# Step 02 Review — UAT 失敗中介節點

## 4-Agent Results

| Agent | 結論 | 備注 |
|-------|------|------|
| code-reviewer | CHANGES_NEEDED → fixed | roles[] 混用 ROLE+TYPE 命名空間；plan 寫 node 10 但實作放 node 8 |
| test-runner | APPROVE | 6 tests 覆蓋完整；rule (c) 通過 |
| performance-investigator | APPROVE | 14 節點 O(n+e)，roles[] 為 dead field 不影響 renderer |
| refactor-architect | APPROVE | 邊鏈完整，Rule (g) 清潔，roles[] 混命名空間為非阻斷 smell |

## 修正項目

1. **schema 修正**：`roles` 從 node 8 移至 node 10（`PM Cowork：交付文件初稿`）
   - 決策：plan 原意為「多角色協作」，node 10 的 Release Note + 操作手冊為 PM + 工程師共同確認，語意最符合 `roles:[PM, ENG]`
   - node 8 保持 `role: ROLE.ENG, type: TYPE.HUMAN` 單一形式，不引入 TYPE 值進 `roles[]`
2. test 4 改為驗證 node 10 `roles` 含 'pm' 和 'eng'

## Known Deferred (interactions.js post-dev table)

`interactions.js` post-dev table 尚未包含 `postdev-engineer-impact` 和 `postdev-engineer-codereview` 兩個新節點。  
Step 04 SSOT (`renderTable()`) 完成後統一重寫，不單獨修正。

## 後續 Step 03 注意事項

- Step 03 midDev 完成後，`interactions.js` mid-dev 表格同樣需要同步（PM 規格釋疑節點）
- `roles[]` schema 在 Step 04 `renderTable()` 時需定義 contract：`roles[]` 應僅含 ROLE 值，TYPE 資訊從 `type` 欄位讀取
- midDev Rule (g) 確認：目前 `{from:'9',to:'8'}` 存在但無 `{from:'8',to:'9'}` → Step 03 新增 middev-pm-clarify 後仍需驗證
