// assets/resources-loader.js
window.ResourcesLoader = {};
ResourcesLoader._state = {};

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

ResourcesLoader.renderCatalog = function(md) {
  marked.use({ mangle: false, headerIds: true, gfm: true });
  var html = marked.parse(md);

  var content = document.getElementById('catalog-content');
  content.innerHTML = html;

  content.querySelectorAll('table').forEach(function(table) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  ResourcesLoader.rewriteNodeRefs(content);
  ResourcesLoader.tagTier3(content);
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

ResourcesLoader._handleSearchInput = function(input, results, close) {
  var q = input.value.trim().toLowerCase();
  results.innerHTML = '';
  ResourcesLoader._searchState.selected = -1;
  if (!q) return;
  var headings = Array.from(
    document.querySelectorAll('#catalog-content h2, #catalog-content h3')
  ).map(function(h) {
    return { id: h.id, text: h.textContent.trim(), level: h.tagName };
  });
  headings.filter(function(item) {
    return item.text.toLowerCase().includes(q);
  }).slice(0, 8).forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'search-result-item';
    div.dataset.idx = i;
    div.innerHTML =
      '<span class="search-result-label">' + (item.level === 'H2' ? '§' : '—') + '</span>' +
      '<span class="search-result-text">' + item.text + '</span>';
    div.addEventListener('click', function() {
      var el = document.getElementById(item.id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
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

ResourcesLoader.tagTier3 = function(root) {
  var h2s = Array.from(root.querySelectorAll('h2'));
  var tier3h2 = h2s.find(function(h) { return h.textContent.trim().startsWith('Tier 3'); });
  if (!tier3h2) return;
  var block = document.createElement('div');
  block.className = 'tier3-block';
  var next = tier3h2.nextSibling;
  while (next) {
    var following = next.nextSibling;
    if (next.nodeType === Node.ELEMENT_NODE && next.tagName === 'H2') break;
    block.appendChild(next);
    next = following;
  }
  tier3h2.parentNode.insertBefore(block, tier3h2.nextSibling);
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
  input.addEventListener('input', function() { ResourcesLoader._handleSearchInput(input, results, close); });
  input.addEventListener('keydown', function(e) { ResourcesLoader._handleSearchKeydown(e, results); });
};
