# Changelog

All notable changes to this project are documented here.

---

## v3.7 (2026-05-21) — PR #15 + hotfix

### Flow Logic Fixes
- **preDev**: 新增「工程師：投標前技術探勘」節點，置於客戶 Gate 之前；原 node 11 改名「交付期技術規劃（CR 評估）」；刪除 11→7 逆流 back-edge（SOW 簽核後不允許回改）
- **postDev**: UAT 失敗路徑 5→6 中間插入「工程師：影響分析與修正規劃」；新增「工程師：Code Review」節點於 Claude Code 修正後（7→codereview→8），確保 AI 修正必經人工審查
- **midDev**: 新增「PM：規格釋疑 + 客戶確認」節點；規格疑義 edge 從 9→8 改為 9→middev-pm-clarify，破除 8↔9 死循環；node 9 四條出路皆補齊 label

### SSOT — interactions.js 表格重構
- `data.js` 新增 `AppData.sectionTables`，三章節（pre-dev / mid-dev / post-dev）表格資料集中管理
- `interactions.js` `buildContent()` 零 `<table>` 字面值；新增 `renderTable(sectionId)` 與 `_buildTable(columns, rows, htmlCols)` 透過 DOM API 建表

### Search Debounce
- `resources-loader.js` 新增 `_debounce(fn, 250)` utility
- `_handleSearchInput` 包 250ms trailing edge debounce；連打 10 字（200ms burst）只觸發 1 次

### Cross-tab Theme Sync
- `dashboard.html` / `resources.html` / `governance.html` 各加 `window.addEventListener('storage', ...)` 監聽 `cowork-theme` key；A tab 切換主題，B tab 自動同步（含 button text + aria-label）

### Image Assets
- 流程圖更新至 v3.7（全架構 / 開發前 / 開發中 / 開發後）
- `presentation.html` + `assets/interactions.js` 共 8 處 src/alt 換 v3.7
- `presentation.html` title/h1 更新至 v3.7；`data.js` 11 處版本字串統一 v3.7

### Tests
- 新增 `tests/e2e/v6-step01~07` 共 7 個 step spec + `v6-full-journey.spec.js`（13 步驟端到端旅程）
- 148/148 tests pass；444/444 flake-free（`--repeat-each=3`）

---

## v3.6 (2026-05-13) — PR #8

- 流程圖更新至 v3.6（全架構 / 開發前 / 開發中 / 開發後）
- Skill 細切：ai-cowork-delivery-governance A-tier 結構完成

---

## v5 (2026-05-20) — PR #14

### Tech Debt
- `_RESOURCE_IDS` 順序陣列 → `_RESOURCE_MAP` 名稱對應（`{ '中文名稱': 'resource-id' }`），插入新資源不再位移
- 搜尋從標題 h2/h3 擴展至段落 `p` + 表格 `td` 全文；`_nearestHeading()` 提供 scroll anchor；結果顯示 snippet 預覽

---

## v4 (2026-05-??) — PR #13

### UX Fixes
- 速查表 Decision Matrix 加入 resources.html
- ASANA assignee role 顯示修正
- GitHub Pages 錯誤訊息修正

---

## v3 (2026-05-??) — PR #12

### Governance
- Tier 欄位重命名與 Tier 4（Human-only）內容補齊
- Status 欄位（DraftReady / HumanGateRequired / SystemCandidate）
- Minimum Input 區塊
- Acceptance Chips（PASS / PENDING / N/A / BLOCKED）
- `governance.md` + `governance.html`：7 條硬規則、Tier 4 參照、Status 升等說明

---

## v2 (2026-05-??) — PR #11

- `resources.html` 初版（70 tests）
- `resources-catalog.md` 9 個資源詳述（會議記錄、工作計劃書、簡報、WBS、組織架構、Prototype、Sprint 規劃、ASANA、里程碑提醒）
- `resources-state.json` status / verification / acceptanceChecks

---

## v1

- `dashboard.html` 初版：三章節流程圖（開發前 / 開發中 / 開發後）、sidebar、theme toggle
- `presentation.html`：Reveal.js 簡報
