// assets/resources-loader.js
window.ResourcesLoader = {};
ResourcesLoader._state = {};
ResourcesLoader._parseTime = 0;

marked.use({ mangle: false, headerIds: true, gfm: true });

ResourcesLoader.init = function() {
  ResourcesLoader.fetchAll();
  ResourcesLoader.initSearchPanel();
};

ResourcesLoader.fetchAll = async function() {
  var mdPromise = fetch('resources-catalog.md').then(function(r) {
    if (!r.ok) throw new Error('md HTTP ' + r.status);
    return r.text();
  });
  var statePromise = fetch('resources-state.json').then(function(r) {
    if (!r.ok) return {};
    return r.json();
  }).catch(function() { return {}; });

  try {
    var results = await Promise.all([mdPromise, statePromise]);
    ResourcesLoader._state = results[1];
    ResourcesLoader.renderCatalog(results[0]);
  } catch (err) {
    document.getElementById('catalog-error').classList.remove('hidden');
    console.error('[ResourcesLoader] fetchAll failed:', err);
  }
};

ResourcesLoader._showError = function(msg) {
  var errEl = document.getElementById('catalog-error');
  if (!errEl) return;
  errEl.classList.remove('hidden');
  var p = errEl.querySelector('p');
  if (p) p.textContent = msg;
};

ResourcesLoader.renderCatalog = function(md) {
  if (!window.DOMPurify) {
    ResourcesLoader._showError('sanitizer load fail：DOMPurify 未載入，無法安全渲染內容。');
    return;
  }
  var requiredSections = ['## AI 使用決策矩陣', '## 9 個資源詳述', '## Tier 4'];
  for (var i = 0; i < requiredSections.length; i++) {
    if (md.indexOf(requiredSections[i]) === -1) {
      ResourcesLoader._showError('Schema mismatch：缺少必要章節「' + requiredSections[i] + '」');
      return;
    }
  }
  var t0 = performance.now();
  var rawHtml = marked.parse(md);
  ResourcesLoader._parseTime = performance.now() - t0;
  var cleanHtml = DOMPurify.sanitize(rawHtml);

  var content = document.getElementById('catalog-content');
  content.innerHTML = cleanHtml;

  content.querySelectorAll('table').forEach(function(table) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  ResourcesLoader.rewriteNodeRefs(content);
  ResourcesLoader.tagTier3(content);
  ResourcesLoader.tagTier4(content);
  ResourcesLoader.enrichDom(content, ResourcesLoader._state);
  ResourcesLoader.renderAcceptanceChecks(content, ResourcesLoader._state);
  ResourcesLoader.tagMinimumInputLists(content);
  ResourcesLoader.renderTypeChips(content);
  ResourcesLoader.buildNav();
  ResourcesLoader.initScrollSpy();
};

ResourcesLoader.buildNav = function() {
  var list = document.getElementById('nav-list');
  if (!list) return;

  var headings = document.querySelectorAll('#catalog-content h2');
  headings.forEach(function(h) {
    if (!h.id) {
      h.id = h.textContent.trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w一-鿿-]/g, '');
    }
    var li = document.createElement('li');
    li.className = 'nav-item';
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.dataset.id = h.id;
    a.textContent = h.textContent.trim();
    li.appendChild(a);
    list.appendChild(li);
  });
};

ResourcesLoader.initScrollSpy = function() {
  var headings = document.querySelectorAll('#catalog-content h2[id]');
  var navLinks = document.querySelectorAll('#nav-list a[data-id]');
  if (!headings.length || !navLinks.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function(a) {
          a.classList.toggle('active', a.dataset.id === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(function(h) { observer.observe(h); });

  navLinks.forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.getElementById(a.dataset.id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

ResourcesLoader._searchState = { selected: -1 };

ResourcesLoader._debounce = function(fn, ms) {
  var t;
  return function() { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function() { fn.apply(c, a); }, ms); };
};

ResourcesLoader._nearestHeading = function(el) {
  var cur = el.previousElementSibling;
  while (cur) {
    if (cur.tagName === 'H3' || cur.tagName === 'H2') return cur;
    cur = cur.previousElementSibling;
  }
  return el.closest('section') ? el.closest('section').querySelector('h2,h3') : null;
};

ResourcesLoader._handleSearchInput = function(input, results, close) {
  var q = input.value.trim().toLowerCase();
  results.innerHTML = '';
  ResourcesLoader._searchState.selected = -1;
  if (!q) return;
  var matches = [];
  // headings
  Array.from(document.querySelectorAll('#catalog-content h2, #catalog-content h3')).forEach(function(h) {
    if (h.textContent.trim().toLowerCase().includes(q)) {
      matches.push({ anchor: h, text: h.textContent.trim(), label: h.tagName === 'H2' ? '§' : '—' });
    }
  });
  // paragraphs and table cells
  Array.from(document.querySelectorAll('#catalog-content p, #catalog-content td')).forEach(function(el) {
    var text = el.textContent.trim();
    if (!text.toLowerCase().includes(q)) return;
    var heading = ResourcesLoader._nearestHeading(el);
    if (!heading) return;
    // truncate snippet around match
    var idx = text.toLowerCase().indexOf(q), start = Math.max(0, idx - 20);
    var snippet = (start > 0 ? '…' : '') + text.slice(start, idx + q.length + 30).replace(/\s+/g, ' ');
    matches.push({ anchor: heading, text: snippet, label: '¶' });
  });
  // deduplicate by anchor id + snippet, cap at 8
  var seen = {};
  matches.filter(function(m) {
    var key = (m.anchor && m.anchor.id) + '|' + m.text.slice(0, 30);
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  }).slice(0, 8).forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'search-result-item';
    div.dataset.idx = i;
    div.innerHTML =
      '<span class="search-result-label">' + item.label + '</span>' +
      '<span class="search-result-text">' + item.text + '</span>';
    div.addEventListener('click', function() {
      if (item.anchor) item.anchor.scrollIntoView({ behavior: 'smooth' });
      close();
    });
    results.appendChild(div);
  });
};

ResourcesLoader._handleSearchKeydown = function(e, results) {
  var items = results.querySelectorAll('.search-result-item');
  var s = ResourcesLoader._searchState;
  if (e.key === 'ArrowDown') s.selected = Math.min(s.selected + 1, items.length - 1);
  if (e.key === 'ArrowUp')   s.selected = Math.max(s.selected - 1, 0);
  if (e.key === 'Enter' && s.selected >= 0) { var sel = items[s.selected]; if (sel) sel.click(); }
  items.forEach(function(el, i) { el.classList.toggle('selected', i === s.selected); });
};

ResourcesLoader._RESOURCE_MAP = {
  '會議記錄': 'meeting-notes',
  '工作計劃書': 'work-plan',
  '簡報（HTML 取代 PPT）': 'presentation',
  'WBS（Work Breakdown Structure）': 'wbs',
  '專案組織架構規劃': 'org-chart',
  'Prototype 設計 / UI 截圖分析': 'prototype',
  '開發 Sprint 規劃': 'sprint-plan',
  'ASANA 任務管理': 'asana',
  '里程碑提醒': 'milestone-reminder'
};

ResourcesLoader.enrichDom = function(root, state) {
  var h3s = Array.from(root.querySelectorAll('h3'));
  var resourceH3s = h3s.filter(function(h) { return /^\d+\. /.test(h.textContent.trim()); });
  resourceH3s.forEach(function(h3) {
    var name = h3.textContent.trim().replace(/^\d+\.\s+/, '');
    var resourceId = ResourcesLoader._RESOURCE_MAP[name];
    if (!resourceId) return;
    h3.dataset.resourceId = resourceId;
    var entry = state[resourceId];
    if (!entry || !entry.status) return;
    var badge = document.createElement('span');
    badge.className = 'status-badge status-' + entry.status.toLowerCase().replace(/\s+/g, '-');
    badge.textContent = entry.status;
    h3.insertAdjacentElement('afterend', badge);
    if (entry.verification && entry.verification.length) {
      var ul = document.createElement('ul');
      ul.className = 'verification-list';
      entry.verification.forEach(function(item) {
        var li = document.createElement('li');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.disabled = true;
        li.appendChild(cb);
        li.appendChild(document.createTextNode(item));
        ul.appendChild(li);
      });
      badge.insertAdjacentElement('afterend', ul);
      ResourcesLoader.rewriteNodeRefs(ul);
    }
  });
};

ResourcesLoader.renderTypeChips = function(root) {
  var typeMap = { COWORK: 'cowork', CLAUDECODE: 'claudecode', SYSTEM: 'system', HUMAN: 'human' };
  var tables = Array.from(root.querySelectorAll('table'));
  var table = tables.find(function(t) {
    var ths = Array.from(t.querySelectorAll('th'));
    return ths.some(function(th) { return th.textContent.trim() === 'Primary type'; });
  });
  if (!table) return;
  var headers = Array.from(table.querySelectorAll('th')).map(function(th) {
    return th.textContent.trim();
  });
  var primaryIdx = headers.indexOf('Primary type');
  var supportIdx = headers.indexOf('Support');
  if (primaryIdx === -1) return;
  table.querySelectorAll('tbody tr').forEach(function(tr) {
    var cells = tr.querySelectorAll('td');
    [primaryIdx, supportIdx].forEach(function(idx) {
      var cell = cells[idx];
      if (!cell) return;
      var val = cell.textContent.trim();
      if (!typeMap[val]) return;
      var span = document.createElement('span');
      span.className = 'chip type-' + typeMap[val];
      span.textContent = val;
      cell.textContent = '';
      cell.appendChild(span);
    });
  });
};

ResourcesLoader._tagTierBlock = function(root, label, className) {
  var h2s = Array.from(root.querySelectorAll('h2'));
  var targetH2 = h2s.find(function(h) { return h.textContent.trim().startsWith(label); });
  if (!targetH2) return;
  var block = document.createElement('div');
  block.className = className;
  var next = targetH2.nextSibling;
  while (next) {
    var following = next.nextSibling;
    if (next.nodeType === Node.ELEMENT_NODE && next.tagName === 'H2') break;
    block.appendChild(next);
    next = following;
  }
  targetH2.parentNode.insertBefore(block, targetH2.nextSibling);
};

ResourcesLoader.tagTier3 = function(root) {
  ResourcesLoader._tagTierBlock(root, 'Tier 3', 'tier3-block');
};

ResourcesLoader.tagTier4 = function(root) {
  ResourcesLoader._tagTierBlock(root, 'Tier 4', 'tier4-block');
};

ResourcesLoader.renderAcceptanceChecks = function(root, state) {
  var pendingUpdates = [];
  root.querySelectorAll('h3[data-resource-id]').forEach(function(h3) {
    var id = h3.dataset.resourceId;
    var checks = state[id] && state[id].acceptanceChecks;
    if (!checks || !checks.length) return;
    var anchor = h3;
    var el = h3.nextElementSibling;
    while (el && el.tagName !== 'H3' && el.tagName !== 'H2') {
      if (el.classList.contains('verification-list')) anchor = el;
      el = el.nextElementSibling;
    }
    var ul = document.createElement('ul');
    ul.className = 'acceptance-list';
    checks.forEach(function(c, idx) {
      var li = document.createElement('li');
      var label = document.createElement('label');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.resource = id;
      cb.dataset.idx = String(idx);
      var lsKey = 'cowork-check-' + id + '-' + idx;
      try { if (localStorage.getItem(lsKey) === '1') cb.checked = true; } catch(e) {}
      cb.addEventListener('change', function() {
        try {
          if (cb.checked) { localStorage.setItem(lsKey, '1'); }
          else { localStorage.removeItem(lsKey); }
        } catch(e) {}
        ResourcesLoader._updateProgress(id, checks, h3);
      });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + c.label));
      if (c.owner) {
        var ownerSpan = document.createElement('span');
        ownerSpan.className = 'owner';
        ownerSpan.textContent = ' @' + c.owner;
        label.appendChild(ownerSpan);
      }
      if (c.required !== false) {
        var req = document.createElement('span');
        req.className = 'required-marker';
        req.textContent = ' ⭑';
        label.appendChild(req);
      }
      li.appendChild(label);
      ul.appendChild(li);
    });
    var progressDiv = document.createElement('div');
    progressDiv.className = 'acceptance-progress';
    progressDiv.dataset.resource = id;
    // Batch all DOM writes first; defer reads (_updateProgress) to second pass
    anchor.parentNode.insertBefore(ul, anchor.nextSibling);
    ul.parentNode.insertBefore(progressDiv, ul.nextSibling);
    pendingUpdates.push({ id: id, checks: checks, h3: h3 });
  });
  // Second pass: all DOM nodes inserted — now run progress reads without layout thrash
  pendingUpdates.forEach(function(p) {
    ResourcesLoader._updateProgress(p.id, p.checks, p.h3);
  });
};

ResourcesLoader._updateProgress = function(id, checks, h3) {
  var progressDiv = document.querySelector('.acceptance-progress[data-resource="' + id + '"]');
  if (!progressDiv) return;
  var requiredChecks = checks.filter(function(c) { return c.required !== false; });
  var requiredTotal = requiredChecks.length;
  var checkedCount = 0;
  requiredChecks.forEach(function(c) {
    var origIdx = checks.indexOf(c);
    var cb = document.querySelector(
      'input[type="checkbox"][data-resource="' + id + '"][data-idx="' + origIdx + '"]'
    );
    if (cb && cb.checked) checkedCount++;
  });
  progressDiv.textContent = checkedCount + ' / ' + requiredTotal + ' required';
  if (checkedCount === requiredTotal && requiredTotal > 0) {
    if (!h3.querySelector('.h3-complete')) {
      var mark = document.createElement('span');
      mark.className = 'h3-complete';
      mark.textContent = ' ✅';
      h3.appendChild(mark);
    }
  } else {
    var existing = h3.querySelector('.h3-complete');
    if (existing) h3.removeChild(existing);
  }
};

ResourcesLoader.tagMinimumInputLists = function(root) {
  root.querySelectorAll('strong').forEach(function(s) {
    if (!s.textContent.includes('Minimum Input')) return;
    var p = s.closest('p'), next = p && p.nextElementSibling;
    if (next && next.tagName === 'UL') next.classList.add('minimum-input-list');
  });
};

ResourcesLoader.rewriteNodeRefs = function(root) {
  var pattern = /\b(preDev|midDev|postDev):(\d+)\b/g;
  function walkText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;
      pattern.lastIndex = 0;
      if (!pattern.test(text)) return;
      pattern.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0;
      var m;
      while ((m = pattern.exec(text)) !== null) {
        if (m.index > last) {
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        }
        var a = document.createElement('a');
        a.href = 'dashboard.html#' + m[1] + '-' + m[2];
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = m[0];
        a.title = '跳到 dashboard ' + m[0];
        frag.appendChild(a);
        last = m.index + m[0].length;
      }
      if (last < text.length) {
        frag.appendChild(document.createTextNode(text.slice(last)));
      }
      node.parentNode.replaceChild(frag, node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName !== 'A' &&
      node.tagName !== 'CODE' &&
      node.tagName !== 'PRE'
    ) {
      Array.from(node.childNodes).forEach(walkText);
    }
  }
  walkText(root);
};

ResourcesLoader.initSearchPanel = function() {
  var overlay = document.getElementById('search-overlay');
  var input   = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var btn     = document.getElementById('search-btn');
  if (!overlay || !input) return;
  var open  = function() { overlay.classList.remove('hidden'); input.focus(); input.value = ''; results.innerHTML = ''; };
  var close = function() { overlay.classList.add('hidden'); };
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });
  if (btn) btn.addEventListener('click', open);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
  // Anonymous wrapper: keeps _handleSearchInput as late-bound lookup so tests can stub the property.
  input.addEventListener('input', ResourcesLoader._debounce(function() { ResourcesLoader._handleSearchInput(input, results, close); }, 250));
  input.addEventListener('keydown', function(e) { ResourcesLoader._handleSearchKeydown(e, results); });
};
