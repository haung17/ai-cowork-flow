// assets/interactions.js
window.DashboardInteractions = {};

DashboardInteractions.init = function() {
  DashboardInteractions.buildNav();
  DashboardInteractions.buildContent();
  DashboardInteractions.initScrollSpy();
  DashboardInteractions.initSearch();
  DashboardInteractions.initModal();
  DashboardInteractions.initHashScroll();
};

DashboardInteractions.initHashScroll = function() {
  var hash = location.hash;
  var m = hash.match(/^#(preDev|midDev|postDev)-([\w-]+)$/);
  if (!m) return;
  var chapterId = m[1];
  var nodeId = m[1] + '-' + m[2];
  var chapterMap = { preDev: 'pre-dev', midDev: 'mid-dev', postDev: 'post-dev' };
  var sectionId = chapterMap[chapterId];
  requestAnimationFrame(function() {
    var section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(function() {
      var node = document.getElementById(nodeId);
      if (!node) return;
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node.classList.add('flash');
      setTimeout(function() { node.classList.remove('flash'); }, 3000);
    }, 600);
  });
};

// 1. Build sidebar nav
DashboardInteractions.buildNav = function() {
  const list = document.getElementById('nav-list');
  window.AppData.chapters.forEach(ch => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    if (ch.external) {
      li.innerHTML = `<a href="${ch.href}" target="_blank" data-id="${ch.id}" aria-label="${ch.title}（開新分頁）">
        <span class="nav-icon">${ch.icon}</span>${ch.title} ↗
      </a>`;
    } else {
      li.innerHTML = `<a href="#${ch.id}" data-id="${ch.id}">
        <span class="nav-icon">${ch.icon}</span>${ch.title}
      </a>`;
    }
    list.appendChild(li);
  });
};

// Table helpers — DOM API (createElement) keeps source free of HTML tag literals
DashboardInteractions._buildTable = function(columns, rows, htmlCols) {
  var t = document.createElement('table');
  var thead = document.createElement('thead');
  var htr = document.createElement('tr');
  columns.forEach(function(c) { var th = document.createElement('th'); th.textContent = c; htr.appendChild(th); });
  thead.appendChild(htr);
  t.appendChild(thead);
  var tbody = document.createElement('tbody');
  rows.forEach(function(cells) {
    var tr = document.createElement('tr');
    cells.forEach(function(v, i) {
      var td = document.createElement('td');
      // Contract: htmlCols must only reference author-controlled static strings — never user-supplied data
      if (htmlCols && htmlCols.indexOf(i) !== -1) { td.innerHTML = v; } else { td.textContent = v; }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  t.appendChild(tbody);
  return t.outerHTML;
};

DashboardInteractions.renderTable = function(sectionId) {
  var data = window.AppData && window.AppData.sectionTables && window.AppData.sectionTables[sectionId];
  if (!data) return '';
  var html = DashboardInteractions._buildTable(data.columns, data.rows);
  if (data.extraTables) {
    data.extraTables.forEach(function(extra) { html += DashboardInteractions._buildTable(extra.columns, extra.rows); });
  }
  return html;
};

// DashboardInteractions._buildTable and .renderTable are accessible via the DashboardInteractions namespace for tests

// 2. Build main content sections
DashboardInteractions.buildContent = function() {
  const wrapper = document.querySelector('.content-wrapper');
  const sections = [];
  const append = html => sections.push(html);

  append(`
  <section id="summary">
    <h1 class="section-title">接案軟體開發完整流程與 AI Cowork / Claude Code 介入點 v3.8</h1>
    <p class="section-desc">這份內容的定位不是一般開發流程圖，而是「AI 輔助下的接案軟體開發交付治理流程」。適用於政府教育部案、企業內部系統案、客製化系統案、網站或後台系統案。</p>
    ${DashboardInteractions._buildTable(
      ['核心定位', '說明'],
      [
        ['三個責任角色', 'PM 負責需求、範圍、客戶溝通與簽核；QA 負責測試策略、品質驗證與驗收確認；工程師負責技術評估、開發、Review、部署與技術文件。'],
        ['AI 不是責任主體', 'Claude Cowork 主要輔助 PM / QA 做整理、起草、比對、提醒；Claude Code 主要輔助工程師做開發、測試、PR、CI、技術文件與專案初始化。'],
        ['治理重點', '先完成 QA / 工程師評估，再對外確認 SOW / 報價；開發中分流 Bug、規格疑義與 Change Request；UAT 前先完成版本凍結、UAT 環境部署與內部 Smoke Test。'],
      ]
    )}
    <p class="section-desc" style="font-family:var(--font-mono);font-size:0.875rem;color:var(--text-faint);margin-bottom:0">版本：v3.8 ／ 整理日期：2026-05-12</p>
  </section>`);

  append(`
  <section id="flowcharts">
    <h2 class="section-title">v3.8 流程圖</h2>
    <p class="section-desc">全架構圖適合當總覽；三張小圖適合分頁講解開發前、開發中、開發後的細節。</p>
    <figure class="flowchart-fig">
      <figcaption>全架構總覽：接案軟體開發交付治理流程與 AI 介入點</figcaption>
      <img src="ChatGPT Image-v3.7-全架構.png" alt="v3.7 全架構流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發前流程：需求釐清、技術評估、SOW / 報價、測試規劃與排程</figcaption>
      <img src="ChatGPT Image-v3.7-開發前.png" alt="v3.7 開發前流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發中流程：PR、CI、Code Review、QA、問題分類與變更控管</figcaption>
      <img src="ChatGPT Image-v3.7-開發中.png" alt="v3.7 開發中流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發後流程：版本凍結、UAT 環境、Smoke Test、UAT、正式部署、文件交付與保固</figcaption>
      <img src="ChatGPT Image-v3.7-開發後.png" alt="v3.7 開發後流程圖" loading="lazy">
    </figure>
  </section>`);

  append(`
  <section id="roles">
    <h2 class="section-title">角色與 AI 邊界</h2>
    <p class="section-desc">AI 的價值是加速整理、起草、比對與修正，但範圍、品質、技術與交付責任仍由人承擔。</p>
    ${DashboardInteractions._buildTable(
      ['角色 / 工具', '主要人工責任', 'AI 可輔助項目', '責任邊界'],
      [
        ['<span class="role-chip pm">PM</span>', '需求訪談、範圍切分、客戶溝通、排程里程碑、簽核協調', '會議紀錄整理、需求清單、SOW 初稿、報價項目、Release Note、結案摘要', 'AI 不能替 PM 承諾報價、範圍、交期與簽核。'],
        ['<span class="role-chip qa">QA</span>', '測試策略、測試執行、缺陷記錄、驗收確認、上線驗證', '測試案例初稿、異常情境、邊界值清單、Bug 描述、測試報告、風險清單', 'AI 不能取代 QA 對品質風險與驗收結果的判斷。'],
        ['<span class="role-chip eng">工程師</span>', '技術評估、開發實作、Code Review、部署、回滾準備', '功能開發、單元測試、Bug 修正、PR 說明、技術文件、API 文件、CLAUDE.md 初始化', 'Claude Code 可以產生程式碼與文件，但工程師必須 review、測試與確認。'],
        ['<span class="type-chip cowork">Cowork</span>', '不是責任角色', 'PM / QA 的文件與分析助手，節省整理、起草、比對與提醒時間', '不直接對客戶承諾，也不做品質放行。'],
        ['<span class="type-chip claudecode">Claude Code</span>', '不是責任角色', '工程師的開發與技術文件助手，加速開發、測試、修正與文件維護', '不承擔正式部署、架構決策與合併責任。'],
      ],
      [0]
    )}
  </section>`);

  append(`
  <section id="pre-dev">
    <h2 class="section-title">一、開發前：需求釐清到排程</h2>
    <p class="section-desc">目標是先把需求、測試風險、技術可行性、工時估算整理清楚，再對外確認 SOW / 報價 / 交期。</p>
    ${DashboardInteractions.renderTable('pre-dev')}
    <details open><summary>開發前流程說明</summary><div class="details-content"><p style="font-size:var(--text-sm);color:var(--text-muted)">技術估算（步驟 9）必須在客戶 Gate 前完成，不得在合約簽核後才發現估算差異。若 Gate 後發生範疇偏差，應走 midDev 的 Change Request Gate，而非回改已簽 SOW / 報價。</p></div></details>
    <div class="fc-container" id="fc-preDev"></div>
  </section>`);

  append(`
  <section id="mid-dev">
    <h2 class="section-title">二、開發中：執行、測試與協調</h2>
    <p class="section-desc">目標是透過 PR、CI、Code Review、QA 驗證與問題分類，讓開發持續迭代，同時避免 Bug、規格疑義、新增需求混在一起。</p>
    ${DashboardInteractions.renderTable('mid-dev')}
    <p class="section-desc">建議每 1-2 週進行 Sprint Demo 或依里程碑展示成果，及早發現需求偏差，降低最後驗收時一次爆出大量問題的風險。</p>
    <div class="fc-container" id="fc-midDev"></div>
  </section>`);

  append(`
  <section id="post-dev">
    <h2 class="section-title">三、開發後：驗收到結案</h2>
    <p class="section-desc">重點是版本凍結、UAT 環境部署、QA Smoke Test、客戶 UAT、正式部署、文件交付、知識轉移與保固交接。</p>
    ${DashboardInteractions.renderTable('post-dev')}
    <div class="fc-container" id="fc-postDev"></div>
  </section>`);

  append(`
  <section id="warranty">
    <h2 class="section-title">保固 / 維護期補充流程</h2>
    <p class="section-desc">保固期不是無限制免費修改，要明確區分原承諾範圍內的缺陷修復、新增需求、操作問題、環境問題、資料問題與二期擴充。</p>
    ${DashboardInteractions._buildTable(
      ['項目', '內容', '說明'],
      [
        ['問題分類', '原始範圍缺陷 / 新增需求 / 操作問題 / 環境問題 / 資料問題 / 二期擴充', '只要對照原 SOW 驗收條件後，確認是在範圍內但未達標，才屬保固內缺陷；其他類型需另行確認責任或費用。'],
        ['Bug 回報管道', '客戶 / 使用者回報、內部缺陷單系統', '要有統一入口，避免 LINE、Email、電話、口頭訊息混雜造成追蹤混亂；建議使用 Issue Tracker 或固定表單。'],
        ['回應 SLA', 'P1 緊急、P2 高、P3 中、P4 低', 'P1 系統無法使用需優先處理；P2 核心功能嚴重受影響；P3 一般功能異常；P4 介面瑕疵或改善建議。'],
        ['修復流程', '客戶回報 → PM 確認 / 分類 → 工程師修正 → QA 驗證 → 部署 → 回報客戶結案', '保固期修 Bug 仍要走基本測試與驗證，至少包含 QA Smoke Test 與該功能回歸，不能工程師修完就直接上線。'],
        ['保固到期結算', '確認已處理問題、未處理問題、責任歸屬、維護合約、二期擴充與歸檔', 'PM 要彙整保固期問題清單、非保固問題、客戶接受事項，並歸檔 SOW、UAT 結果、簽收文件與保固紀錄。'],
      ]
    )}
  </section>`);

  append(`
  <section id="legend">
    <h2 class="section-title">圖例說明</h2>
    ${DashboardInteractions._buildTable(
      ['圖例', '意義'],
      [
        ['<span class="role-chip pm">PM</span>', '藍色，代表決策、溝通、排程、簽核。'],
        ['<span class="role-chip qa">QA</span>', '綠色，代表測試、驗證、品質。'],
        ['<span class="role-chip eng">工程師</span>', '橘色，代表實作、部署、技術支援。'],
        ['<span class="type-chip cowork">Cowork</span>', '紫色，代表整理、起草、比對、提醒。'],
        ['<span class="type-chip claudecode">Claude Code</span>', '深藍色，代表程式開發、測試、文件自動化。'],
        ['紅色星號', '客戶 Gate，代表需要客戶確認或簽核。'],
        ['實線 / 紅色虛線 / 菱形', '實線是正常順序流程；紅色虛線是回饋、修正、重新確認；菱形是條件判斷。'],
      ],
      [0]
    )}
  </section>`);

  append(`
  <section id="observations">
    <h2 class="section-title">目前優點與注意事項</h2>
    <details open><summary>目前流程圖的優點</summary>
      <div class="details-content">
        <ol style="padding-left:var(--sp-6);font-size:var(--text-sm);display:flex;flex-direction:column;gap:var(--sp-2)">
          <li>三階段架構清楚：開發前、開發中、開發後符合一般接案公司交付流程。</li>
          <li>客戶 Gate 收斂到 SOW / 報價 / 交期、Change Request、UAT、正式簽收等關鍵點。</li>
          <li>開發前順序已修正：先做 QA / 工程師評估，再產生 SOW 與報價。</li>
          <li>開發中順序更合理：開發 → PR → CI → Code Review → 測試環境 → QA。</li>
          <li>問題分類適合接案業，能避免新增需求被當 Bug 免費修。</li>
          <li>開發後補上版本凍結、UAT 環境部署、Smoke Test 與保固交接。</li>
          <li>AI 責任邊界明確，最終責任仍由 PM / QA / 工程師承擔。</li>
        </ol>
      </div>
    </details>
    <details><summary>全架構圖使用注意事項</summary>
      <div class="details-content">
        <ol style="padding-left:var(--sp-6);font-size:var(--text-sm);display:flex;flex-direction:column;gap:var(--sp-2)">
          <li>全架構圖資訊量大，適合總覽，不適合投影時逐字講全部內容。</li>
          <li>目前節點已經很多，不建議再增加資安審查、付款節點、合約條款或政府案文件等細節。</li>
          <li>開發前「工程師：投標前技術探勘」（客戶 Gate 前）確保估算差異在簽核前處理；「交付期技術規劃」（Gate 後）負責架構鎖定與 CR 評估，不回改已簽 SOW。</li>
          <li>全架構圖與小圖編號可略有差異，重點是邏輯一致。</li>
          <li>這張圖定位為總覽，不是唯一 SOP；實際執行仍應拆成表格或清單。</li>
        </ol>
      </div>
    </details>
  </section>`);

  append(`
  <section id="presentation-use">
    <h2 class="section-title">建議簡報使用方式</h2>
    ${DashboardInteractions._buildTable(
      ['投影片', '用途', '講法'],
      [
        ['第 1 張：全架構圖', '先讓大家看到完整流程', '這是接案軟體開發的完整治理流程，分成開發前、開發中、開發後三段，並標示 PM、QA、工程師，以及 Claude Cowork / Claude Code 的介入位置。'],
        ['第 2 張：開發前小圖', '說明需求、測試規劃 / 技術評估、SOW / 報價、客戶確認、排程', '開發前不是急著報價，而是先讓 QA 和工程師確認測試與技術成本，避免後續估算翻車。'],
        ['第 3 張：開發中小圖', '說明 PR、CI、Code Review、QA、問題分類、Change Request', '開發中的核心是把 Bug、規格疑義、新增需求分開處理，避免範疇變更被當成免費修改。'],
        ['第 4 張：開發後小圖', '說明版本凍結、UAT 環境、Smoke Test、UAT、正式部署、文件交付、保固交接', '開發後不是直接部署，而是先凍結版本、部署 UAT 環境、完成內部 Smoke Test，再讓客戶驗收。'],
      ]
    )}
  </section>`);

  append(`
  <section id="conclusion">
    <h2 class="section-title">一句話總結</h2>
    <p class="section-desc" style="font-size:var(--text-lg);color:var(--text)">這套流程的核心不是要讓 AI 取代 PM、QA、工程師，而是用 Claude Cowork 加速整理、起草與分析，用 Claude Code 加速開發、測試與文件，但所有範圍、品質、技術與交付責任，仍由 PM、QA、工程師人工確認與承擔。</p>
  </section>`);

  wrapper.innerHTML = sections.join('');

  if (window.FlowCharts) {
    FlowCharts.render('preDev', document.getElementById('fc-preDev'));
    FlowCharts.render('midDev', document.getElementById('fc-midDev'));
    FlowCharts.render('postDev', document.getElementById('fc-postDev'));
  }
};

// 3. Scroll spy
DashboardInteractions.initScrollSpy = function() {
  const sections = document.querySelectorAll('.content-wrapper section[id]');
  const navLinks = document.querySelectorAll('#nav-list a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.dataset.id === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));

  navLinks.forEach(a => {
    if (a.target === '_blank') return; // external links: let browser open new tab normally
    a.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById(a.dataset.id)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

// 4. Search (Ctrl+K)
DashboardInteractions.initSearch = function() {
  const overlay  = document.getElementById('search-overlay');
  const input    = document.getElementById('search-input');
  const results  = document.getElementById('search-results');
  const btn      = document.getElementById('search-btn');

  const open = () => { overlay.classList.remove('hidden'); input.focus(); input.value = ''; results.innerHTML = ''; };
  const close = () => overlay.classList.add('hidden');

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });
  btn.addEventListener('click', open);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  const index = window.AppData.chapters.map(ch => ({
    id: ch.id, label: ch.icon, text: ch.title, href: ch.href
  }));

  let selected = -1;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    selected = -1;
    if (!q) return;

    const matches = index.filter(item =>
      item.text.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );

    matches.slice(0, 8).forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.dataset.idx = i;
      div.innerHTML = `<span class="search-result-label">${item.label}</span>
                       <span class="search-result-text">${item.text}</span>`;
      div.addEventListener('click', () => {
        if (item.href) {
          window.open(item.href, '_blank');
        } else {
          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
        }
        close();
      });
      results.appendChild(div);
    });
  });

  input.addEventListener('keydown', e => {
    const items = results.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') { selected = Math.min(selected+1, items.length-1); }
    if (e.key === 'ArrowUp')   { selected = Math.max(selected-1, 0); }
    if (e.key === 'Enter' && selected >= 0) items[selected]?.click();
    items.forEach((el, i) => el.classList.toggle('selected', i === selected));
  });
};

// 5. No-op: flowchart modal removed
DashboardInteractions.initModal = function() {};

