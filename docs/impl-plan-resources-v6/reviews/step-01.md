# Step 01 Review — preDev 流程修正

## 4-Agent Results

| Agent | 結論 | 備注 |
|-------|------|------|
| code-reviewer | CHANGES_NEEDED → fixed | interactions.js 表格出同步、deep-link regex、observations 文字 |
| test-runner | CHANGES_NEEDED → fixed | 缺少 edge-path assertion；full suite 後 122/122 |
| performance-investigator | APPROVE | O(n+e) render，13 節點無效能疑慮 |
| refactor-architect | APPROVE | 替換鏈完整，無 dangling edge，node 12 正確 terminal |

## 修正項目

1. `interactions.js:15` — `initHashScroll` regex 改 `[\w-]+` 支援語意 ID
2. `interactions.js:113-134` — pre-dev 表格從 10 rows 更新為 13 rows，移除「回到 SOW」語言
3. `interactions.js:245` — observations 更新「投標前技術探勘 + 交付期技術規劃」說明
4. `tests/e2e/v6-step01-predev.spec.js` — 新增第 5 個 test 驗證 edge 路徑
5. `tests/e2e/deep-link.spec.js:8` — preDev node count 11 → 13

## 後續 Step 02 注意事項

- `interactions.js` post-dev 表格同樣為 hardcoded，Step 02 新增 UAT 中介節點後需同步更新
- `data.js:132-169` legacy slides block 仍有過期 v3.6 文字，Step 04 SSOT 一併清理
- node 11 bullets 的 CR 混合說明（minor issue）留 Step 03 midDev CR Gate 完成後確認是否仍有歧義
