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
  window.AppData.chapters.forEach(ch => {
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
  const sections = [];
  const append = html => sections.push(html);

  append(`
  <section id="summary">
    <h1 class="section-title">接案軟體開發完整流程與 AI Cowork / Claude Code 介入點 v3.6</h1>
    <p class="section-desc">這份內容的定位不是一般開發流程圖，而是「AI 輔助下的接案軟體開發交付治理流程」。適用於政府教育部案、企業內部系統案、客製化系統案、網站或後台系統案。</p>
    <table>
      <thead><tr><th>核心定位</th><th>說明</th></tr></thead>
      <tbody>
        <tr><td>三個責任角色</td><td>PM 負責需求、範圍、客戶溝通與簽核；QA 負責測試策略、品質驗證與驗收確認；工程師負責技術評估、開發、Review、部署與技術文件。</td></tr>
        <tr><td>AI 不是責任主體</td><td>Claude Cowork 主要輔助 PM / QA 做整理、起草、比對、提醒；Claude Code 主要輔助工程師做開發、測試、PR、CI、技術文件與專案初始化。</td></tr>
        <tr><td>治理重點</td><td>先完成 QA / 工程師評估，再對外確認 SOW / 報價；開發中分流 Bug、規格疑義與 Change Request；UAT 前先完成版本凍結、UAT 環境部署與內部 Smoke Test。</td></tr>
      </tbody>
    </table>
    <p class="section-desc" style="font-family:var(--font-mono);font-size:0.875rem;color:var(--text-faint);margin-bottom:0">版本：v3.6 ／ 整理日期：2026-05-12</p>
  </section>`);

  append(`
  <section id="flowcharts">
    <h2 class="section-title">v3.6 流程圖</h2>
    <p class="section-desc">全架構圖適合當總覽；三張小圖適合分頁講解開發前、開發中、開發後的細節。</p>
    <figure class="flowchart-fig">
      <figcaption>全架構總覽：接案軟體開發交付治理流程與 AI 介入點</figcaption>
      <img src="ChatGPT Image-v3.6-全架構.png" alt="v3.6 全架構流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發前流程：需求釐清、技術評估、SOW / 報價、測試規劃與排程</figcaption>
      <img src="ChatGPT Image-v3.6-開發前.png" alt="v3.6 開發前流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發中流程：PR、CI、Code Review、QA、問題分類與變更控管</figcaption>
      <img src="ChatGPT Image-v3.6-開發中.png" alt="v3.6 開發中流程圖" loading="lazy">
    </figure>
    <figure class="flowchart-fig">
      <figcaption>開發後流程：版本凍結、UAT 環境、Smoke Test、UAT、正式部署、文件交付與保固</figcaption>
      <img src="ChatGPT Image-v3.6-開發後.png" alt="v3.6 開發後流程圖" loading="lazy">
    </figure>
  </section>`);

  append(`
  <section id="roles">
    <h2 class="section-title">角色與 AI 邊界</h2>
    <p class="section-desc">AI 的價值是加速整理、起草、比對與修正，但範圍、品質、技術與交付責任仍由人承擔。</p>
    <table>
      <thead><tr><th>角色 / 工具</th><th>主要人工責任</th><th>AI 可輔助項目</th><th>責任邊界</th></tr></thead>
      <tbody>
        <tr><td><span class="role-chip pm">PM</span></td><td>需求訪談、範圍切分、客戶溝通、排程里程碑、簽核協調</td><td>會議紀錄整理、需求清單、SOW 初稿、報價項目、Release Note、結案摘要</td><td>AI 不能替 PM 承諾報價、範圍、交期與簽核。</td></tr>
        <tr><td><span class="role-chip qa">QA</span></td><td>測試策略、測試執行、缺陷記錄、驗收確認、上線驗證</td><td>測試案例初稿、異常情境、邊界值清單、Bug 描述、測試報告、風險清單</td><td>AI 不能取代 QA 對品質風險與驗收結果的判斷。</td></tr>
        <tr><td><span class="role-chip eng">工程師</span></td><td>技術評估、開發實作、Code Review、部署、回滾準備</td><td>功能開發、單元測試、Bug 修正、PR 說明、技術文件、API 文件、CLAUDE.md 初始化</td><td>Claude Code 可以產生程式碼與文件，但工程師必須 review、測試與確認。</td></tr>
        <tr><td><span class="type-chip cowork">Cowork</span></td><td>不是責任角色</td><td>PM / QA 的文件與分析助手，節省整理、起草、比對與提醒時間</td><td>不直接對客戶承諾，也不做品質放行。</td></tr>
        <tr><td><span class="type-chip claudecode">Claude Code</span></td><td>不是責任角色</td><td>工程師的開發與技術文件助手，加速開發、測試、修正與文件維護</td><td>不承擔正式部署、架構決策與合併責任。</td></tr>
      </tbody>
    </table>
  </section>`);

  append(`
  <section id="pre-dev">
    <h2 class="section-title">一、開發前：需求釐清到排程</h2>
    <p class="section-desc">目標是先把需求、測試風險、技術可行性、工時估算整理清楚，再對外確認 SOW / 報價 / 交期。</p>
    <table>
      <thead><tr><th>#</th><th>節點</th><th>模式</th><th>工作內容</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>PM 人工：需求訪談</td><td>人工為主</td><td>專案目標、使用對象、主要功能、預算 / 交期。AI 可整理紀錄，但不能取代 PM 與客戶溝通。</td></tr>
        <tr><td>2</td><td>PM Cowork：會議紀錄與需求整理</td><td>AI 初稿 + PM 確認</td><td>需求清單、User Story、驗收條件初稿、未確認事項。</td></tr>
        <tr><td>3</td><td>QA Cowork：測試案例 / 測試策略初稿</td><td>AI 初稿 + QA 確認</td><td>正常流程、異常情境、邊界 / 權限、測試資料需求。</td></tr>
        <tr><td>4</td><td>工程師 Claude Code：技術評估與任務拆分</td><td>AI 輔助 + 工程師確認</td><td>技術可行性、API / DB 影響、工時估算初稿、技術任務草稿。</td></tr>
        <tr><td>5</td><td>PM Cowork：SOW / 報價初稿</td><td>AI 初稿 + PM 確認</td><td>工作說明、報價項目、風險 / 依賴、交付假設。這一步必須在 QA 與工程師評估後。</td></tr>
        <tr><td>6</td><td>PM 人工：內部確認與優先序</td><td>人工</td><td>範圍切分、功能優先序、風險判斷、驗收方向。</td></tr>
        <tr><td>7</td><td>客戶 Gate：SOW / 報價 / 交期</td><td>客戶確認</td><td>範圍簽核、報價確認、交期確認。</td></tr>
        <tr><td>8</td><td>PM 人工：排程與里程碑</td><td>人工</td><td>任務指派、里程碑、交付節點、溝通節奏。</td></tr>
        <tr><td>9</td><td>工程師 Claude Code：初始化專案 CLAUDE.md</td><td>AI 輔助 + 工程師確認</td><td>專案脈絡、技術規範、架構決策記錄、Coding Style、常用指令。</td></tr>
        <tr><td>10</td><td>工程師人工：技術確認</td><td>人工</td><td>架構確認、風險確認、依賴確認、估算校正。若估算差異太大，回到 SOW / 報價修正。</td></tr>
      </tbody>
    </table>
    <p class="section-desc">註：開發前小圖為了可讀性壓縮成 9 個節點；全架構圖與本表仍保留第 10 點「工程師人工：技術確認」，作為正式開發前最後確認。</p>
    <details open><summary>開發前回饋流程</summary><div class="details-content"><p style="font-size:var(--text-sm);color:var(--text-muted)">若工程師估算差異過大、QA 發現測試範圍比預期大、需求範圍需要調整，或 API / DB 影響比預期複雜，流程應回到「修正 SOW / 報價 → 客戶重新確認」。</p></div></details>
  </section>`);

  append(`
  <section id="mid-dev">
    <h2 class="section-title">二、開發中：執行、測試與協調</h2>
    <p class="section-desc">目標是透過 PR、CI、Code Review、QA 驗證與問題分類，讓開發持續迭代，同時避免 Bug、規格疑義、新增需求混在一起。</p>
    <table>
      <thead><tr><th>#</th><th>節點</th><th>模式</th><th>工作內容</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>工程師 Claude Code：開發實作</td><td>AI 輔助 + 工程師確認</td><td>功能開發、單元測試、自我檢查、文件 / 註解更新。</td></tr>
        <tr><td>2</td><td>工程師人工：建立 PR</td><td>人工為主</td><td>建立 PR、補充變更說明、指定 reviewer、檢查差異內容。</td></tr>
        <tr><td>3</td><td>CI 自動驗證</td><td>全自動化</td><td>Build / Compile、Lint / Code Style、Unit Test、Security Scan。</td></tr>
        <tr><td>4</td><td>CI 是否通過？</td><td>條件判斷</td><td>未通過回工程師修正；通過後才進入人工 Code Review。</td></tr>
        <tr><td>5</td><td>工程師人工：Code Review / Merge</td><td>人工</td><td>人工 Review、回應意見、必要時同儕 Review、合併受保護分支。</td></tr>
        <tr><td>6</td><td>工程師人工 / 自動化：部署測試環境</td><td>半自動化或自動化</td><td>測試版部署、版號管理、測試環境同步、待測功能清單。</td></tr>
        <tr><td>7</td><td>QA 人工：QA 驗證</td><td>人工為主</td><td>功能測試、探索測試、回歸驗證、驗收條件確認。</td></tr>
        <tr><td>8</td><td>PM / QA Cowork：問題彙整與影響判斷</td><td>AI 整理 + 人工判斷</td><td>缺陷 / 問題彙整、優先級建議、影響分析、下一步建議。</td></tr>
        <tr><td>9</td><td>問題類型？</td><td>條件判斷</td><td>分為 Bug / 未達驗收條件、需求不清 / 規格疑義、新增需求 / 範疇變更、通過 / 符合驗收條件。</td></tr>
      </tbody>
    </table>
    <table>
      <thead><tr><th>分類</th><th>流向</th><th>處理原則</th></tr></thead>
      <tbody>
        <tr><td>A. Bug / 未達驗收條件</td><td>回到工程師修正，再跑 PR / CI / QA</td><td>屬原承諾範圍內修正，通常不需客戶重新簽核。</td></tr>
        <tr><td>B. 需求不清 / 規格疑義</td><td>回到 PM 釐清需求</td><td>必要時找客戶確認，但不一定需要更新 SOW。</td></tr>
        <tr><td>C. 新增需求 / 範疇變更</td><td>進入客戶 Gate</td><td>更新 backlog、調整報價 / 排程，必要時修正 SOW / 報價。</td></tr>
        <tr><td>D. 通過 / 符合驗收條件</td><td>進入階段 Demo / UAT 準備</td><td>可安排內部 Demo、階段成果確認，並進入開發後流程。</td></tr>
      </tbody>
    </table>
    <p class="section-desc">建議每 1-2 週進行 Sprint Demo 或依里程碑展示成果，及早發現需求偏差，降低最後驗收時一次爆出大量問題的風險。</p>
  </section>`);

  append(`
  <section id="post-dev">
    <h2 class="section-title">三、開發後：驗收到結案</h2>
    <p class="section-desc">重點是版本凍結、UAT 環境部署、QA Smoke Test、客戶 UAT、正式部署、文件交付、知識轉移與保固交接。</p>
    <table>
      <thead><tr><th>#</th><th>節點</th><th>模式</th><th>工作內容</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>工程師人工：版本凍結</td><td>人工</td><td>確認驗收版本、鎖定功能範圍、建立版號、凍結變更。</td></tr>
        <tr><td>2</td><td>工程師人工：部署 UAT 環境</td><td>人工 / 半自動化</td><td>UAT 版本部署、環境設定、測試資料準備、回滾點保留。</td></tr>
        <tr><td>3</td><td>QA 人工：Smoke Test / 環境檢查</td><td>人工為主</td><td>基本流程檢查、環境可用性、備份 / 回復確認、風險檢查。</td></tr>
        <tr><td>4</td><td>客戶 Gate：UAT 驗收</td><td>客戶確認</td><td>操作驗收、問題回報、驗收建議、階段結論。</td></tr>
        <tr><td>5</td><td>UAT 是否通過？</td><td>條件判斷</td><td>未通過則修正 / 重新部署 UAT；通過則進入正式簽收 / 上線同意。</td></tr>
        <tr><td>6</td><td>工程師 Claude Code：修正 / 重新部署 UAT</td><td>AI 輔助 + 工程師確認</td><td>修正程式、更新版本、重新部署，並回到 QA Smoke Test。</td></tr>
        <tr><td>7</td><td>客戶 Gate：正式簽收 / 上線同意</td><td>客戶確認</td><td>正式簽收、上線同意、保固起算確認。</td></tr>
        <tr><td>8</td><td>工程師人工：正式部署 / 回滾準備</td><td>人工 / 半自動化</td><td>Production 部署、DB / migration、版本標籤、回滾準備。</td></tr>
        <tr><td>9</td><td>QA 人工：上線後 Smoke Test / 基本監控</td><td>人工為主</td><td>關鍵流程檢查、服務可用性、已知問題確認、初始監控。</td></tr>
        <tr><td>10</td><td>PM Cowork：Release Note 與交付文件初稿</td><td>AI 初稿 + PM 確認</td><td>Release Note、操作手冊初稿、結案摘要、交付清單。</td></tr>
        <tr><td>11</td><td>工程師 Claude Code：技術文件與部署說明</td><td>AI 輔助 + 工程師確認</td><td>架構文件、API 文件、環境設定說明、migration script。</td></tr>
        <tr><td>12</td><td>PM 人工：Knowledge Transfer / 保固交接</td><td>人工</td><td>維運交接、帳號 / 權限、聯絡窗口、保固範圍。</td></tr>
      </tbody>
    </table>
  </section>`);

  append(`
  <section id="warranty">
    <h2 class="section-title">保固 / 維護期補充流程</h2>
    <p class="section-desc">保固期不是無限制免費修改，要明確區分原承諾範圍內的缺陷修復、新增需求、操作問題、環境問題、資料問題與二期擴充。</p>
    <table>
      <thead><tr><th>項目</th><th>內容</th><th>說明</th></tr></thead>
      <tbody>
        <tr><td>問題分類</td><td>原始範圍缺陷 / 新增需求 / 操作問題 / 環境問題 / 資料問題 / 二期擴充</td><td>只要對照原 SOW 驗收條件後，確認是在範圍內但未達標，才屬保固內缺陷；其他類型需另行確認責任或費用。</td></tr>
        <tr><td>Bug 回報管道</td><td>客戶 / 使用者回報、內部缺陷單系統</td><td>要有統一入口，避免 LINE、Email、電話、口頭訊息混雜造成追蹤混亂；建議使用 Issue Tracker 或固定表單。</td></tr>
        <tr><td>回應 SLA</td><td>P1 緊急、P2 高、P3 中、P4 低</td><td>P1 系統無法使用需優先處理；P2 核心功能嚴重受影響；P3 一般功能異常；P4 介面瑕疵或改善建議。</td></tr>
        <tr><td>修復流程</td><td>客戶回報 → PM 確認 / 分類 → 工程師修正 → QA 驗證 → 部署 → 回報客戶結案</td><td>保固期修 Bug 仍要走基本測試與驗證，至少包含 QA Smoke Test 與該功能回歸，不能工程師修完就直接上線。</td></tr>
        <tr><td>保固到期結算</td><td>確認已處理問題、未處理問題、責任歸屬、維護合約、二期擴充與歸檔</td><td>PM 要彙整保固期問題清單、非保固問題、客戶接受事項，並歸檔 SOW、UAT 結果、簽收文件與保固紀錄。</td></tr>
      </tbody>
    </table>
  </section>`);

  append(`
  <section id="legend">
    <h2 class="section-title">圖例說明</h2>
    <table>
      <thead><tr><th>圖例</th><th>意義</th></tr></thead>
      <tbody>
        <tr><td><span class="role-chip pm">PM</span></td><td>藍色，代表決策、溝通、排程、簽核。</td></tr>
        <tr><td><span class="role-chip qa">QA</span></td><td>綠色，代表測試、驗證、品質。</td></tr>
        <tr><td><span class="role-chip eng">工程師</span></td><td>橘色，代表實作、部署、技術支援。</td></tr>
        <tr><td><span class="type-chip cowork">Cowork</span></td><td>紫色，代表整理、起草、比對、提醒。</td></tr>
        <tr><td><span class="type-chip claudecode">Claude Code</span></td><td>深藍色，代表程式開發、測試、文件自動化。</td></tr>
        <tr><td>紅色星號</td><td>客戶 Gate，代表需要客戶確認或簽核。</td></tr>
        <tr><td>實線 / 紅色虛線 / 菱形</td><td>實線是正常順序流程；紅色虛線是回饋、修正、重新確認；菱形是條件判斷。</td></tr>
      </tbody>
    </table>
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
          <li>開發前「工程師人工：技術確認」可保留作為正式開發前最後確認點。</li>
          <li>全架構圖與小圖編號可略有差異，重點是邏輯一致。</li>
          <li>這張圖定位為總覽，不是唯一 SOP；實際執行仍應拆成表格或清單。</li>
        </ol>
      </div>
    </details>
  </section>`);

  append(`
  <section id="presentation-use">
    <h2 class="section-title">建議簡報使用方式</h2>
    <table>
      <thead><tr><th>投影片</th><th>用途</th><th>講法</th></tr></thead>
      <tbody>
        <tr><td>第 1 張：全架構圖</td><td>先讓大家看到完整流程</td><td>這是接案軟體開發的完整治理流程，分成開發前、開發中、開發後三段，並標示 PM、QA、工程師，以及 Claude Cowork / Claude Code 的介入位置。</td></tr>
        <tr><td>第 2 張：開發前小圖</td><td>說明需求、測試規劃 / 技術評估、SOW / 報價、客戶確認、排程</td><td>開發前不是急著報價，而是先讓 QA 和工程師確認測試與技術成本，避免後續估算翻車。</td></tr>
        <tr><td>第 3 張：開發中小圖</td><td>說明 PR、CI、Code Review、QA、問題分類、Change Request</td><td>開發中的核心是把 Bug、規格疑義、新增需求分開處理，避免範疇變更被當成免費修改。</td></tr>
        <tr><td>第 4 張：開發後小圖</td><td>說明版本凍結、UAT 環境、Smoke Test、UAT、正式部署、文件交付、保固交接</td><td>開發後不是直接部署，而是先凍結版本、部署 UAT 環境、完成內部 Smoke Test，再讓客戶驗收。</td></tr>
      </tbody>
    </table>
  </section>`);

  append(`
  <section id="conclusion">
    <h2 class="section-title">一句話總結</h2>
    <p class="section-desc" style="font-size:var(--text-lg);color:var(--text)">這套流程的核心不是要讓 AI 取代 PM、QA、工程師，而是用 Claude Cowork 加速整理、起草與分析，用 Claude Code 加速開發、測試與文件，但所有範圍、品質、技術與交付責任，仍由 PM、QA、工程師人工確認與承擔。</p>
  </section>`);

  wrapper.innerHTML = sections.join('');
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

  const index = window.AppData.chapters.map(ch => ({
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

