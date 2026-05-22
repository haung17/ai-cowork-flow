# Step 09 Review — DOMPurify Sanitize + Schema Validation

## 4-Agent Review 結果

| Agent | 結論 | 主要意見 |
|-------|------|----------|
| test-runner | PASS | 192/192 全綠；step09 flake check 15/15 PASS |
| code-reviewer | APPROVE | 8 hard gates PASS；Important: error div 顯示 schema/sanitizer 錯誤時，fetch troubleshoot hints 仍可見（誤導使用者）|
| security | PASS (1 IMPORTANT) | search result `div.innerHTML` string concat → `createElement`；其餘 DOMPurify config / vendor authenticity PASS |
| refactor-architect | BLOCK→已修 + 3 CONCERN | (e) 成功 render 後 `#catalog-error` 不消失 → 加 `classList.add('hidden')` reset；`REQUIRED_SECTIONS` 模組常數；`fetchAll` 改用 `_showError` |

## Post-Review 修正

1. `renderCatalog` 成功路徑加 `errEl.classList.add('hidden')` reset（BLOCK fix）
2. `REQUIRED_SECTIONS` 提升為模組常數 `ResourcesLoader.REQUIRED_SECTIONS`
3. `fetchAll` catch 改用 `_showError('無法載入 resources-catalog.md...')` 統一 error entry point
4. `_showError` 加 fetch-error 判斷：schema/sanitizer 錯誤時 hide troubleshoot `ul`/`pre` hints
5. search result `div.innerHTML` string concat → `createElement` + `textContent`（XSS 防禦一致性）

## 未修正（可接受）

- `indexOf` → `/^## heading/m.test(md)` line-anchor 升級（v3.8 controlled authorship 低風險，留 v3.9）
- DOMPurify 3.0.6 → 3.1.x 升版（無 blocker CVE，留 v3.9）

## Step 10 調整

- Step 10 enrichDom 加 status-badge + meta row + 點擊跳 governance.html
- `_showError` 行為已穩定，Step 10 不需修改
