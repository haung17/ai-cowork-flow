# Changelog

All notable changes to this project are documented here.

---

## v3.8 (2026-05-21) — PR #16

### Flow Logic — 4 Gate 節點
- **preDev**: 新增「PM：NDA + 資安審查 Gate」（`predev-pm-nda-gate`）於客戶接洽後、會議記錄前
- **midDev**: 新增「工程師：AI Code 測試門檻 Gate（覆蓋率 ≥ 80%）」（`middev-engineer-ai-test-gate`）於 Claude Code 後、PR 建立前
- **midDev**: 新增「工程師：變更管理切換 Gate」（`middev-engineer-cr-switch`）於 Gate CR 後、回 Claude Code 前
- **midDev**: 重排 `middev-pm-clarify` / node 10 / node 11 y 座標；9→clarify edge 改 `fromSide:'right'` 側邊錨點，消除水平線跨越垂直線交叉

### 治理強化 — 3 條業務紅線
- `governance.md` 新增規則 8（NDA / 資安審查紅線）、規則 9（AI Code 測試門檻 ≥ 80%）、規則 10（變更管理切換責任歸屬）
- `governance.html` 渲染 10 條規則；規則 8/9/10 加 `v3.8 新增` badge
- `governance.md` 加「交付規範引用」區塊，交叉連結 Demo 水印規則與 External Use Gate

### Resources — P0 治理強化
- **Tier 4 sticky banner**：`resources.html` 頂部固定警告列，顯示 AI 禁止執行的 7 項決策
- **WBS 重分類**：Tier 1 → Tier 2；加紅字警語「不得作為報價依據」
- **Human Gate Checklist**：9 個資源 `acceptanceChecks` 升級 schema（加 `owner`、`required`）；checkbox UI + localStorage 保存 + progress bar + 100% 時 H3 旁顯示 ✅
- **DOMPurify sanitize**：`marked.parse` 後過 DOMPurify 3.0.6（vendored）；fetch 後校驗 3 個必要章節；錯誤訊息細化（sanitizer load fail / schema mismatch / fetch fail）
- **Status badge 顯著化**：9 個資源 H3 旁顯示 status badge + 可用程度 + 下一步說明；點擊跳 `governance.html#status-promotion`
- **Demo 水印強制規則**：prototype 章節加浮水印強制規定（移除需 PM 書面簽核）
- **External Use Gate**：簡報章節加 4 項交付 checklist（範疇對齊 SOW + 脫敏）

### Resources — P1 UX 改善
- **Dashboard 入口改文字**：`⊟` 符號改為「📋 資源對照」＋「⚖️ 治理規則」明確文字連結（`data.js`）
- **Decision-query chips**：`resources.html` search overlay 加 5 個快速決策問題 chips（對外承諾？改 production？草稿？CSV/ICS 匯入？拍板決策？）

### Tests
- 新增 `tests/e2e/v7-step08~12.spec.js` + `v7-step11-entry.spec.js` + `v7-full-journey.spec.js`（13 步驟端到端）
- 208/208 tests pass；624/624 flake-free（`--repeat-each=3`）

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
