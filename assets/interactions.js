// assets/interactions.js
window.DashboardInteractions = {};

DashboardInteractions.init = function() {
  DashboardInteractions.buildNav();
  DashboardInteractions.buildContent();
  DashboardInteractions.initScrollSpy();
  DashboardInteractions.initSearch();
  DashboardInteractions.initModal();
};

// 1. Build sidebar nav
DashboardInteractions.buildNav = function() {
  const list = document.getElementById('nav-list');
  AppData.chapters.forEach(ch => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `<a href="#${ch.id}" data-id="${ch.id}">
      <span class="nav-icon">${ch.icon}</span>${ch.title}
    </a>`;
    list.appendChild(li);
  });
};

// 2. Build main content sections
DashboardInteractions.buildContent = function() {
  const wrapper = document.querySelector('.content-wrapper');

  // Summary
  wrapper.innerHTML += `
  <section id="summary">
    <h1 class="section-title">PM / QA / 工程師 × AI Cowork 流程指南 v3.2</h1>
    <p class="section-desc">整理自實際討論：接案情境下，PM、QA、工程師如何分工，以及 Cowork 與 Claude Code 在開發前、中、後如何加速作業。</p>
    <p class="section-desc" style="font-family:var(--font-mono);font-size:0.875rem;color:var(--text-faint)">整理日期：2026-05-12 ／ 來源：ChatGPT 對話紀錄</p>
  </section>`;

  // Pain points
  wrapper.innerHTML += `
  <section id="pain">
    <h2 class="section-title">問題背景</h2>
    <p class="section-desc">接案流程中最常見的痛點，也是 AI Cowork 要解決的核心問題。</p>
    <table>
      <thead><tr><th>痛點</th><th>具體情況</th><th>影響</th></tr></thead>
      <tbody>
        <tr><td>需求模糊</td><td>客戶說的和工程師做的有落差，規格不清就進開發</td><td>開發方向錯誤，回頭改成本高</td></tr>
        <tr><td>資訊落差</td><td>PM、QA、工程師各看各的，沒有共同規格基準</td><td>測試不到位，驗收爭議多</td></tr>
        <tr><td>變更失控</td><td>需求邊做邊改，沒有記錄，沒有影響分析</td><td>範圍蔓延、時程爆炸</td></tr>
        <tr><td>尾聲壓力</td><td>bug、文件、回歸全部塞到驗收前爆發</td><td>品質不穩定、交付延期</td></tr>
      </tbody>
    </table>
  </section>`;

  // Roles section
  wrapper.innerHTML += `
  <section id="roles">
    <h2 class="section-title">角色職責</h2>
    <p class="section-desc">工程師視角：PM 降低需求不清的風險，QA 降低交付後才發現問題的風險。</p>
    <details open><summary>PM 的核心價值</summary>
    <div class="details-content">
    <p style="margin-bottom:var(--sp-3);font-size:var(--text-sm);color:var(--text-muted)">讓工程師知道「要做什麼、為什麼做、做到什麼程度算完成」。</p>
    <table>
      <thead><tr><th>工作項目</th><th>細分內容</th><th>工程師需要的產出</th></tr></thead>
      <tbody>
        <tr><td>需求釐清</td><td>確認功能目的、使用者、流程、商業規則</td><td>需求文件、User Story、流程圖</td></tr>
        <tr><td>範圍定義</td><td>本期要做 / 不做 / 二期</td><td>Scope list、Out of scope list</td></tr>
        <tr><td>驗收條件</td><td>每個功能怎樣才算完成</td><td>Acceptance Criteria</td></tr>
        <tr><td>畫面與流程</td><td>Wireframe、Mockup、操作流程</td><td>Figma、流程圖、API 流程</td></tr>
        <tr><td>時程規劃</td><td>切階段、排開發、測試、UAT、上線</td><td>甘特圖、Sprint plan</td></tr>
        <tr><td>溝通窗口</td><td>整理客戶問題，保護工程師不被打斷</td><td>Q&A log、決策紀錄</td></tr>
      </tbody>
    </table>
    </div></details>
    <details><summary>QA 的核心價值</summary>
    <div class="details-content">
    <p style="margin-bottom:var(--sp-3);font-size:var(--text-sm);color:var(--text-muted)">確認「做出來的東西是否真的符合需求，且沒有破壞既有功能」。</p>
    <table>
      <thead><tr><th>工作項目</th><th>細分內容</th><th>工程師需要的產出</th></tr></thead>
      <tbody>
        <tr><td>讀需求</td><td>看 PM 的規格是否可測</td><td>可測性問題清單</td></tr>
        <tr><td>找矛盾</td><td>檢查需求是否衝突、流程是否缺漏</td><td>規格問題回報</td></tr>
        <tr><td>測試計畫</td><td>決定手測 vs 自動化範圍</td><td>Test Plan</td></tr>
        <tr><td>測試案例</td><td>根據驗收條件設計</td><td>Test Cases</td></tr>
        <tr><td>風險評估</td><td>找出高風險功能</td><td>高風險測試項目</td></tr>
      </tbody>
    </table>
    </div></details>
  </section>`;

  // Pre-dev section
  wrapper.innerHTML += `
  <section id="pre-dev">
    <h2 class="section-title">開發前</h2>
    <p class="section-desc">把模糊需求整理成工程師能開工、QA 能測試、客戶能驗收的規格。</p>
    <details open><summary>PM｜需求訪談、範圍確認、時程</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>需求釐清</strong> — 確認功能目的、使用者、流程、商業規則 → 需求文件、User Story、流程圖</li>
      <li style="font-size:var(--text-sm)"><strong>範圍定義</strong> — 哪些本期要做、哪些不做、哪些是二期 → Scope list、Out of scope list</li>
      <li style="font-size:var(--text-sm)"><strong>SOW / 報價初稿</strong> — 由 Cowork 先整理交付範圍、報價依據與待確認項目 → PM 審核後對客戶說明</li>
      <li style="font-size:var(--text-sm)"><strong>優先順序</strong> — 排出 Must / Should / Could → 開發順序、里程碑</li>
      <li style="font-size:var(--text-sm)"><strong>客戶確認 Gate</strong> — SOW、報價、交付範圍確認後才進入測試規劃與技術拆分</li>
      <li style="font-size:var(--text-sm)"><strong>驗收條件</strong> — 每個功能怎樣才算完成 → Acceptance Criteria</li>
      <li style="font-size:var(--text-sm)"><strong>畫面與流程</strong> — Wireframe、Mockup、操作流程 → Figma、流程圖、API 流程</li>
      <li style="font-size:var(--text-sm)"><strong>時程規劃</strong> — 切階段、排開發、測試、UAT、上線 → 甘特圖、Sprint plan</li>
      <li style="font-size:var(--text-sm)"><strong>風險管理</strong> — 第三方 API、客戶資料、法規 → 風險清單、待確認問題</li>
      <li style="font-size:var(--text-sm)"><strong>溝通窗口</strong> — 整理客戶問題，保護工程師不被打斷 → Q&A log、決策紀錄</li>
    </ul></div></details>
    <details><summary>QA｜需求可測性、測試策略</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>讀需求</strong> — 看 PM 的規格是否可測 → 可測性問題清單</li>
      <li style="font-size:var(--text-sm)"><strong>找矛盾</strong> — 需求是否衝突、流程是否缺漏 → 規格問題回報</li>
      <li style="font-size:var(--text-sm)"><strong>測試計畫</strong> — 決定手測 vs 自動化範圍 → Test Plan</li>
      <li style="font-size:var(--text-sm)"><strong>測試案例</strong> — 根據驗收條件設計案例 → Test Cases</li>
      <li style="font-size:var(--text-sm)"><strong>測試資料</strong> — 一般資料、錯誤資料、邊界資料 → 測試帳號、測試資料表</li>
      <li style="font-size:var(--text-sm)"><strong>測試環境</strong> — 確認 staging / test DB / 測試 API → 測試環境清單</li>
      <li style="font-size:var(--text-sm)"><strong>風險評估</strong> — 找出高風險功能（付款、權限、刪除）→ 高風險測試項目</li>
    </ul></div></details>
    <details><summary>工程師｜技術評估、工時估算</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>技術評估</strong> — 評估可行性、架構選型、第三方依賴確認</li>
      <li style="font-size:var(--text-sm)"><strong>OpenAPI / DB Schema 草稿</strong> — Claude Code 起草 endpoint、payload、schema 與錯誤碼，工程師審核後對齊 PM/QA</li>
      <li style="font-size:var(--text-sm)"><strong>CLAUDE.md 初始化</strong> — Claude Code 依專案規範建立 coding style、commit rule、測試規範</li>
      <li style="font-size:var(--text-sm)"><strong>API contract</strong> — 與 PM/QA 確認前後端 API 介面、資料格式</li>
      <li style="font-size:var(--text-sm)"><strong>工時估算</strong> — 各功能工時、整體 sprint 規劃</li>
      <li style="font-size:var(--text-sm)"><strong>環境建置</strong> — 開發、staging、CI/CD 環境設定</li>
    </ul></div></details>
  </section>`;

  // Mid-dev section
  wrapper.innerHTML += `
  <section id="mid-dev">
    <h2 class="section-title">開發中</h2>
    <p class="section-desc">進度追蹤、需求變更管控、持續測試、阻塞排除。</p>
    <details open><summary>PM｜進度追蹤、需求變更管控</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>需求答疑</strong> — 工程師遇到不清楚時負責問客戶或決策，避免猜需求</li>
      <li style="font-size:var(--text-sm)"><strong>控制變更</strong> — 臨時新增功能時，判斷加價 / 延後 / 替換，避免 scope creep</li>
      <li style="font-size:var(--text-sm)"><strong>更新規格</strong> — 需求有變就更新文件，不只口頭講 → 避免資訊落差</li>
      <li style="font-size:var(--text-sm)"><strong>追蹤進度</strong> — 看任務是否卡住、是否超時 → 提早暴露風險</li>
      <li style="font-size:var(--text-sm)"><strong>回饋分類與狀態更新</strong> — Cowork 協助將客戶回饋分為 Bug / 新需求 / 操作問題，並同步狀態</li>
      <li style="font-size:var(--text-sm)"><strong>協調依賴</strong> — UI、API、第三方服務、客戶資料 → 避免工程師空等</li>
      <li style="font-size:var(--text-sm)"><strong>Bug Triage 三角共議</strong> — PM 定 priority、QA 定 severity、工程師估技術影響 → 決定本週/下週修</li>
      <li style="font-size:var(--text-sm)"><strong>Sprint Demo 獨立區塊</strong> — Cowork 起草 Demo 腳本、Release Note 草稿與驗收清單 → 降低尾聲大翻車</li>
      <li style="font-size:var(--text-sm)"><strong>優先級調整</strong> — 時間不夠時決定哪些先做、哪些延後 → 保護核心交付功能</li>
    </ul></div></details>
    <details><summary>QA｜持續測試、Bug 回報</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>提早測試</strong> — CR 功能完成後，初步驗證是否符合客戶需求，測試完成提供客戶進行同步驗證 → 提早暴露落差</li>
      <li style="font-size:var(--text-sm)"><strong>測試結果整理與失敗摘要</strong> — Cowork 彙整 CI / Staging 失敗、重現資訊與可能原因 → QA 進一步判斷</li>
      <li style="font-size:var(--text-sm)"><strong>建立 bug ticket</strong> — 附步驟、環境、截圖、預期/實際結果 → 工程師能快速重現</li>
      <li style="font-size:var(--text-sm)"><strong>回歸測試</strong> — 修 bug 後確認原本功能沒壞 → 避免修 A 壞 B</li>
      <li style="font-size:var(--text-sm)"><strong>探索式測試</strong> — 不只照測試案例，也嘗試異常流程 → 找出規格外問題</li>
      <li style="font-size:var(--text-sm)"><strong>API 測試</strong> — 測 API response、錯誤碼、權限 → 後端問題更早發現</li>
      <li style="font-size:var(--text-sm)"><strong>UI 測試</strong> — 確認畫面、RWD、按鈕、表單驗證 → 降低客戶驗收問題</li>
      <li style="font-size:var(--text-sm)"><strong>案例更新</strong> — 規格改了，測試案例也要同步更新 → 避免測舊需求</li>
    </ul></div></details>
    <details><summary>工程師｜功能實作、Code Review</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>功能實作</strong> — 分支開發、切分 task，保持 PR 粒度小</li>
      <li style="font-size:var(--text-sm)"><strong>Unit / 整合測試</strong> — 保持測試覆蓋率，先寫測試再實作</li>
      <li style="font-size:var(--text-sm)"><strong>Code Review</strong> — Claude Code 協助產出 review checklist、PR 摘要與 changelog，工程師負責審核與修正</li>
      <li style="font-size:var(--text-sm)"><strong>Bug 修復</strong> — 依 severity 排序，Critical 優先處理</li>
      <li style="font-size:var(--text-sm)"><strong>配合 QA</strong> — 提供測試環境、API docs、mock 資料</li>
    </ul></div></details>
  </section>`;

  // Post-dev section
  wrapper.innerHTML += `
  <section id="post-dev">
    <h2 class="section-title">開發後</h2>
    <p class="section-desc">完整回歸、客戶 UAT、上線決策、文件交付、結案。</p>
    <details open><summary>PM｜UAT 安排、結案、文件</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>驗收範圍確認</strong> — 確認本期交付哪些功能 → Release scope</li>
      <li style="font-size:var(--text-sm)"><strong>客戶 UAT 安排</strong> — 請客戶在測試環境驗收 → UAT checklist</li>
      <li style="font-size:var(--text-sm)"><strong>驗收問題控管</strong> — 區分 bug / 需求變更 / 新功能 → Issue classification</li>
      <li style="font-size:var(--text-sm)"><strong>部署方式分流</strong> — 判斷我方部署或客戶自行部署；我方部署走 script，客戶部署走部署指引</li>
      <li style="font-size:var(--text-sm)"><strong>上線排程</strong> — 確認時間、停機窗口、備份策略 → Deployment plan</li>
      <li style="font-size:var(--text-sm)"><strong>Knowledge Transfer 7-2</strong> — 權限、維護窗口、操作責任與交接清單由 PM 對齊客戶</li>
      <li style="font-size:var(--text-sm)"><strong>文件交付</strong> — 操作手冊、帳號、API 文件、維護說明 → Handover docs</li>
      <li style="font-size:var(--text-sm)"><strong>結案確認</strong> — 客戶簽核、付款節點、保固期 → Sign-off</li>
      <li style="font-size:var(--text-sm)"><strong>保固 / 維護期 SLA</strong> — 明確 Bug 回報 SLA、Release Note 節奏與教育訓練安排</li>
      <li style="font-size:var(--text-sm)"><strong>二期需求整理</strong> — 把本次沒做或新增的需求整理成 backlog → Phase 2 backlog</li>
    </ul></div></details>
    <details><summary>QA｜完整回歸、放行評估</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>完整回歸</strong> — 核心流程全部重測 → Regression report</li>
      <li style="font-size:var(--text-sm)"><strong>Smoke test</strong> — 上線前快速確認主流程可用 → Smoke checklist</li>
      <li style="font-size:var(--text-sm)"><strong>驗收測試</strong> — 根據 PM 的驗收條件逐項確認 → UAT support</li>
      <li style="font-size:var(--text-sm)"><strong>Bug 分級</strong> — Critical / Major / Minor → Bug priority list</li>
      <li style="font-size:var(--text-sm)"><strong>修復驗證</strong> — 工程師修完後 retest → Retest result</li>
      <li style="font-size:var(--text-sm)"><strong>已知問題整理</strong> — 無法本期修的問題列出 → Known issues</li>
      <li style="font-size:var(--text-sm)"><strong>測試結案報告</strong> — 測了哪些、剩哪些、風險是什麼 → Test summary report</li>
      <li style="font-size:var(--text-sm)"><strong>Issue regression 確認</strong> — 抽測之前曾發生過的問題，確保問題不會因更版錯誤而再發生 → Regression sampling</li>
    </ul></div></details>
    <details><summary>工程師｜Bug 修復、上線支援</summary>
    <div class="details-content"><ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--sp-2)">
      <li style="font-size:var(--text-sm)"><strong>Bug 修復</strong> — 依優先序處理 Critical / Major bug，確保上線品質</li>
      <li style="font-size:var(--text-sm)"><strong>上線部署</strong> — 配合 PM/QA 執行上線流程、資料庫 migration</li>
      <li style="font-size:var(--text-sm)"><strong>Release script</strong> — Claude Code 起草 migration script、release script 與 rollback note，工程師審核後執行</li>
      <li style="font-size:var(--text-sm)"><strong>Smoke 支援</strong> — 協助確認生產環境功能正常</li>
      <li style="font-size:var(--text-sm)"><strong>系統監控</strong> — 上線後確認 log、效能、錯誤率</li>
      <li style="font-size:var(--text-sm)"><strong>Knowledge Transfer 7-1</strong> — Claude Code 協助產出 API doc、Schema、Coding style 等技術文件，工程師負責審核</li>
    </ul></div></details>
  </section>`;

  // AI Cowork 定位
  wrapper.innerHTML += `
  <section id="cowork-def">
    <h2 class="section-title">AI Cowork 定位</h2>
    <p class="section-desc">Automation（腳本）、Cowork（PM/QA 助理）與 Claude Code（工程師端 AI 起草）的差異。</p>
    <table>
      <thead><tr><th>類型</th><th>核心</th><th>長處</th><th>弱點</th></tr></thead>
      <tbody>
        <tr><td style="font-family:var(--font-mono);font-weight:600">Automation</td><td>流程跑完</td><td>穩定、便宜、快</td><td>不會協作、不知脈絡</td></tr>
        <tr><td style="font-family:var(--font-mono);font-weight:600">Cowork</td><td>PM / QA 助理</td><td>需求整理、測試規劃、回饋分類、狀態同步</td><td>不能代替商務與品質決策</td></tr>
        <tr><td style="font-family:var(--font-mono);font-weight:600">Claude Code</td><td>工程師端 AI 起草</td><td>commit / PR / migration script / 技術文件草稿</td><td>上下文需明確，仍需要工程師 review</td></tr>
        <tr><td style="font-family:var(--font-mono);font-weight:600">Human Decision</td><td>判斷與負責</td><td>理解商業情境、承擔後果</td><td>時間有限、易遺漏細節</td></tr>
      </tbody>
    </table>
  </section>`;

  // Claude Code vs Cowork
  wrapper.innerHTML += `
  <section id="claude-vs-cowork">
    <h2 class="section-title">Claude Code vs Cowork</h2>
    <p class="section-desc">v3.2 將 AI 介入拆成兩種模式：PM/QA 的 Cowork，以及工程師端的 Claude Code。</p>
    <table>
      <thead><tr><th>模式</th><th>使用情境</th><th>典型輸出</th><th>人工 checkpoint</th></tr></thead>
      <tbody>
        <tr><td>Automation</td><td>規則固定、輸入輸出明確</td><td>測試結果、Issue 狀態、Release Note 初稿</td><td>例外狀況人工處理</td></tr>
        <tr><td>Cowork</td><td>PM / QA 需要整理、分類、對齊狀態</td><td>User Story、測試規劃、回饋分類、Demo 腳本</td><td>PM / QA 審核後對客戶或團隊同步</td></tr>
        <tr><td>Claude Code</td><td>工程師需要起草、檢查、產出技術交付物</td><td>PR 摘要、commit、API / DB Schema、migration script</td><td>工程師 review、測試、合併與部署</td></tr>
      </tbody>
    </table>
  </section>`;

  // 三層策略
  wrapper.innerHTML += `
  <section id="strategy">
    <h2 class="section-title">三層策略</h2>
    <p class="section-desc">根據工作類型決定給腳本、給 AI、還是留給人。</p>
    <table>
      <thead><tr><th>層</th><th>類型</th><th>例子</th></tr></thead>
      <tbody>
        <tr>
          <td><span class="type-chip" style="background:#F0FDF4;color:#16A34A;border:1px solid #86EFAC">第一層</span></td>
          <td>可全自動（腳本）</td>
          <td>自動跑測試、自動抓 issue 狀態、自動彙整 commit、自動產 Release Note 初稿</td>
        </tr>
        <tr>
          <td><span class="type-chip cowork">第二層</span></td>
          <td>AI 起草，人審核</td>
          <td>Cowork：需求整理、User Story、QA 測試案例初稿、Bug ticket 格式化、規格差異比對、UAT 問題分流<br>Claude Code：PR 摘要、commit、測試碼、migration script、Release script</td>
        </tr>
        <tr>
          <td><span class="type-chip" style="background:#FEF2F2;color:#DC2626;border:1px solid #FCA5A5">第三層</span></td>
          <td>必須人工決策</td>
          <td>接受需求變更與否、功能優先序、是否可上線、客戶驗收簽核、高風險 bug 是否放行</td>
        </tr>
      </tbody>
    </table>
  </section>`;

  // 流程圖區塊
  wrapper.innerHTML += `
  <section id="flowcharts">
    <h2 class="section-title">流程圖</h2>
    <p class="section-desc">整體接案流程與開發前、中、後的分工與 AI Cowork 介入點。</p>
    <figure class="flowchart-fig">
      <figcaption>整體接案流程</figcaption>
      <img src="ChatGPT Image-v3.2-全架構.png" alt="v3.2 整體接案流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發前流程</figcaption>
      <img src="ChatGPT Image-v3.2-開發前.png" alt="v3.2 開發前流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發中流程</figcaption>
      <img src="ChatGPT Image-v3.2-開發中.png" alt="v3.2 開發中流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發後流程</figcaption>
      <img src="ChatGPT Image-v3.2-開發後.png" alt="v3.2 開發後流程圖" loading="lazy">
    </figure>
  </section>`;

  // auto-level (placeholder)
  wrapper.innerHTML += `
  <section id="auto-level">
    <h2 class="section-title">自動化等級</h2>
    <p class="section-desc">各角色 × 各階段的 AI 介入程度分類。</p>
    <table>
      <thead><tr><th>角色</th><th>開發前</th><th>開發中</th><th>開發後</th></tr></thead>
      <tbody>
        <tr><td><span class="role-chip pm">PM</span></td><td>AI 起草（需求整理、US、任務拆分）</td><td>全自動（進度摘要）+ AI 起草（規格比對）</td><td>全自動（Release Note）+ AI 起草（UAT 分類）</td></tr>
        <tr><td><span class="role-chip qa">QA</span></td><td>全自動（對照表）+ AI 起草（測試案例）</td><td>全自動（Regression）+ AI 起草（回歸建議）</td><td>AI 起草（測試報告、UAT 分類）</td></tr>
        <tr><td><span class="role-chip eng">工程師</span></td><td>Claude Code（API / DB Schema、CLAUDE.md）</td><td>Claude Code（PR 摘要、Code Review 輔助、Changelog）</td><td>Claude Code（migration script、Release script、技術文件）</td></tr>
      </tbody>
    </table>
  </section>`;

  // PM detail
  wrapper.innerHTML += `
  <section id="pm-detail">
    <h2 class="section-title">PM 詳細規劃</h2>
    <p class="section-desc">PM 在各開發階段的具體工作項目與 AI Cowork 介入點。</p>
    <table>
      <thead><tr><th>階段</th><th>可全自動</th><th>AI 起草人審核</th><th>必須人工</th></tr></thead>
      <tbody>
        <tr><td>開發前</td><td>會議逐字稿整理</td><td>User Story / SOW / 報價初稿</td><td>範圍決策、客戶確認 Gate、優先序</td></tr>
        <tr><td>開發中</td><td>每日進度摘要、Standup 準備、風險登錄更新</td><td>回饋分類、狀態更新、Demo 腳本</td><td>Bug Triage 共議、範圍變更接受與否</td></tr>
        <tr><td>開發後</td><td>Release Note、結案清單</td><td>UAT 問題整理、部署指引、權限交接</td><td>部署方式分流、是否放行上線、客戶簽核</td></tr>
      </tbody>
    </table>
  </section>`;

  // QA detail
  wrapper.innerHTML += `
  <section id="qa-detail">
    <h2 class="section-title">QA 詳細規劃</h2>
    <p class="section-desc">QA 在各開發階段的具體工作項目與 AI Cowork 介入點。</p>
    <table>
      <thead><tr><th>階段</th><th>可全自動</th><th>AI 起草人審核</th><th>必須人工</th></tr></thead>
      <tbody>
        <tr><td>開發前</td><td>需求 × 測試對照表</td><td>測試規劃初稿、邊界案例、測試資料草稿</td><td>測試策略、高風險判定</td></tr>
        <tr><td>開發中</td><td>Smoke / Regression 自動執行</td><td>測試結果整理、失敗摘要、Bug ticket 草稿、Sprint Demo 對齊項目</td><td>探索測試、Bug severity、放行建議</td></tr>
        <tr><td>開發後</td><td>—</td><td>UAT 缺陷分類、補強建議、測試報告</td><td>完整回歸、客戶 UAT 放行</td></tr>
      </tbody>
    </table>
  </section>`;

  // MVP
  wrapper.innerHTML += `
  <section id="mvp">
    <h2 class="section-title">MVP 規劃</h2>
    <p class="section-desc">第一階段可落地的 AI Cowork 功能，依優先序排列。</p>
    <table>
      <thead><tr><th>#</th><th>功能</th><th>主要使用者</th><th>核心價值</th></tr></thead>
      <tbody>
        <tr><td style="font-family:var(--font-mono);color:var(--accent)">1</td><td>會議紀錄 → 需求摘要</td><td><span class="role-chip pm">PM</span></td><td>減少需求整理時間 50%+</td></tr>
        <tr><td style="font-family:var(--font-mono);color:var(--accent)">2</td><td>需求 → User Story / 驗收條件</td><td><span class="role-chip pm">PM</span></td><td>讓工程師與 QA 快速對齊</td></tr>
        <tr><td style="font-family:var(--font-mono);color:var(--accent)">3</td><td>需求 → 測試規劃初稿</td><td><span class="role-chip qa">QA</span></td><td>減少測試規劃時間</td></tr>
        <tr><td style="font-family:var(--font-mono);color:var(--accent)">4</td><td>PR diff → Code Review 輔助 + 回歸測試建議</td><td><span class="role-chip eng">工程師</span> <span class="role-chip qa">QA</span></td><td>降低漏測與低品質 PR 風險</td></tr>
        <tr><td style="font-family:var(--font-mono);color:var(--accent)">5</td><td>UAT 回饋分類</td><td><span class="role-chip pm">PM</span> <span class="role-chip qa">QA</span></td><td>區分 bug / 新需求 / 操作問題</td></tr>
        <tr><td style="font-family:var(--font-mono);color:var(--accent)">6</td><td>Release Note / 交接文件草稿</td><td><span class="role-chip pm">PM</span></td><td>加速交付與結案</td></tr>
      </tbody>
    </table>
  </section>`;

  // 導入原則
  wrapper.innerHTML += `
  <section id="principles">
    <h2 class="section-title">導入原則</h2>
    <p class="section-desc">讓 AI Cowork 真正好用，而不是亂跑的 agent。</p>
    <ol style="padding-left:var(--sp-6);font-size:var(--text-sm);display:flex;flex-direction:column;gap:var(--sp-3)">
      <li><strong>AI 只做助理，不做最後決策</strong> — PM 的商業判斷、QA 的品質放行、工程師的技術責任，都不能外包</li>
      <li><strong>優先做「草稿、整理、比對、分類」</strong> — 最穩、最有價值的使用方式</li>
      <li><strong>PM / QA 用 Cowork，工程師用 Claude Code</strong> — 兩者都能起草，但責任邊界與審核者不同</li>
      <li><strong>高頻、規則清楚的，交給腳本</strong> — 跑測試、抓 issue、彙整 commit</li>
      <li><strong>高價值但容易耗時的，交給 AI Cowork</strong> — 需求整理、測試案例、bug ticket、規格比對</li>
      <li><strong>每個流程都要有人工 checkpoint</strong> — 這樣才是真正好用的 cowork</li>
    </ol>
  </section>`;

  // 後續方向
  wrapper.innerHTML += `
  <section id="next">
    <h2 class="section-title">後續方向</h2>
    <p class="section-desc">從本次討論延伸的後續計畫。</p>
    <ol style="padding-left:var(--sp-6);font-size:var(--text-sm);display:flex;flex-direction:column;gap:var(--sp-2)">
      <li>把本內容整理成正式簡報大綱（已做：presentation.html）</li>
      <li>設計 PM Cowork 功能規格表</li>
      <li>設計 QA Cowork 功能規格表</li>
      <li>設計系統架構圖</li>
      <li>設計 MVP 開發時程</li>
      <li>設計資料流：輸入 → AI 處理 → 人工確認 → 輸出</li>
      <li>設計 prompt template 與 workflow</li>
      <li>設計 GitHub / Jira / Notion / Slack 串接方式</li>
      <li>整理成計畫書或提案書</li>
    </ol>
  </section>`;

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

  const index = AppData.chapters.map(ch => ({
    id: ch.id, label: ch.icon, text: ch.title
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
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
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
