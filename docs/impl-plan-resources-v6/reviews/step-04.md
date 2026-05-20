# Step 04 Review — SSOT interactions.js renderTable

## 4-Agent Results

| Agent | 結論 | 備注 |
|-------|------|------|
| code-reviewer | API 529 × 3（overloaded）→ 自驗替代 | grep 0 確認；見 Self-Verify 欄 |
| test-runner | APPROVE | 138/138 pass；Rule (b) grep 0；Image-v3.6 僅 img src（Step 07 處理） |
| performance-investigator | APPROVE | O(n×m) optimal；outerHTML on detached node 無 layout trigger；100rows < 50ms ×50x margin |
| refactor-architect | CHANGES_NEEDED → fixed | 2 項修正見下方 |

## 自驗（code-reviewer API 不通時使用）

```
git grep "<table>" -- assets/interactions.js   → 0
git grep "<thead>" -- assets/interactions.js   → 0
window._buildTableHtml / window.renderTable loose globals → 0
DashboardInteractions._buildTable / .renderTable namespace → ✓
htmlCols td.innerHTML contract comment → ✓
AppData.sectionTables keys: pre-dev / mid-dev / post-dev → ✓ (test 2 pass)
138/138 tests pass
```

## 修正項目（refactor-architect CHANGES_NEEDED → fixed）

1. **Global test-hook 污染修正**
   - 原本：`window._buildTableHtml = ...` 和 `window.renderTable = ...` 直接掛 window
   - 修正：移除這兩行；test 改用 `window.DashboardInteractions._buildTable / .renderTable`
   - `DashboardInteractions` 已是既有 window namespace，不增加新 global

2. **`td.innerHTML` contract comment**
   - 新增一行：`// Contract: htmlCols must only reference author-controlled static strings — never user-supplied data`
   - 明確標示 XSS 邊界

## Rule (b) 確認

`git grep "<table>" -- assets/interactions.js` = 0 ✓
`git grep "<thead>" -- assets/interactions.js` = 0 ✓

整個 `buildContent` 無任何 HTML 表格 tag literal：
- 三個章節表（pre-dev / mid-dev / post-dev）→ `renderTable(sectionId)` from AppData.sectionTables
- 其他五個表（summary / roles / warranty / legend / presentation-use）→ `_buildTable(columns, rows, htmlCols)`
- 全部透過 `document.createElement` + `outerHTML`，source 無 `<table>` literal

## 後續 Step 05 注意事項

- Step 05 debounce 在 `resources-loader.js`，不影響 interactions.js
- Step 07 image swap：interactions.js 仍有 `Image-v3.6` 引用（lines 115,119,123,127）— Step 07 統一換
- `AppData.sectionTables` 五個非章節表（summary 等）的資料仍 inline in buildContent；YAGNI 判定可接受，若後續需第二 HTML consumer 再移入 SSOT
