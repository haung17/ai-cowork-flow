# Step 03 Review — midDev 規格疑義出口

## 4-Agent Results

| Agent | 結論 | 備注 |
|-------|------|------|
| code-reviewer | REQUEST_CHANGES → fixed | 3 項：Test 5 dead code / interactions.js table stale / middev-pm-clarify→6 語意不當 |
| test-runner | CHANGES_NEEDED → fixed | Test 5 只掃 title，未涵蓋 bullets + edge labels |
| performance-investigator | (not dispatched; Step 03 為純資料變更，無效能觸發點) | — |
| refactor-architect | APPROVE | Rule (g) 通過；所有節點有 incoming；邊鏈完整 |

## 修正項目

1. **Test 5 死碼移除 + 掃描範圍擴大**
   - 原本：`hasOldString` 恆回傳 `false`；`allTitles` 只掃 `node.title`
   - 修正：掃 `node.title` + `node.bullets[]` + `edge.label` 合并字串，斷言無 `客戶接抵`

2. **`middev-pm-clarify` 出口語意修正**
   - 原本：`{to:'6',label:'釐清後可繼續'}` — node 6 = 自動部署，非開發起點，語意不符
   - 修正：`{to:'1',label:'需更新實作'}` + `{to:'7',label:'無需實作變更'}`
   - 理由：規格釋疑後兩種情境（需 code 變更 / 只需 QA 重驗）都有明確出口

3. **interactions.js mid-dev table 補齊兩新節點**
   - 新增 row：`PM 釐清` — PM：規格釋疑 + 客戶確認
   - 新增 row：`11` — PM / QA：UAT 準備
   - Row B 流向說明更新：明確標示 PM 主導釐清，AI 不得直接修正

4. **`03-middev-fix.md` 補記 node 11**
   - 原計劃未文件化 node 11（PM / QA：UAT 準備），實作與計劃有漂移
   - 修正：補記 node 11 定義及 `{from:'9',to:'11',label:'通過'}` edge

## 最終狀態

- Rule (g) 確認：`{from:'8',to:'9'}` 仍存在（正向），`{from:'9',to:'8'}` 不存在 → 無死循環
- Rule (a) 確認：`middev-pm-clarify` (PM/HUMAN) 夾在 DECISION 後、CLAUDECODE 前，sandwich 保持
- 133/133 tests pass；`git grep "客戶接抵" -- *.js` = 0

## 後續 Step 04 注意事項

- `interactions.js` 三章節表格（pre-dev / mid-dev / post-dev）現仍為 hardcoded HTML
- Step 04 `renderTable()` 完成後，這三段 `<table>` 全部換掉，Rule (b) 需驗證
- `sectionTables` schema 設計時，mid-dev 需容納 `middev-pm-clarify` 語意 ID 行（非純數字行號）
- `roles[]` 在 Step 04 contract 定義：只存 ROLE 值（'pm','qa','eng','system'），TYPE 從 `type` 欄位讀
