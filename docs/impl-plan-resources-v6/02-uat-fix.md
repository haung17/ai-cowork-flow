# Step 02: UAT 失敗中介節點

**Goal**: postDev 5→6 間插入「工程師：影響分析與修正規劃」；加 Code Review 節點 7→3；升級 node 10 為 `roles[]` 陣列。

## 變更清單（assets/data.js）

### postDev.nodes
- 插入：`{id:'postdev-engineer-impact', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師：影響分析與修正規劃', bullets:['UAT 失敗根因分析','修正範圍評估','修正計劃'], x:20, y:47}`
- 插入：`{id:'postdev-engineer-codereview', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師：Code Review / 上線前確認', bullets:['正式部署前 review','回滾確認','變更驗證'], x:70, y:56}`
- Node 10 升級 `roles: [ROLE.PM, ROLE.ENG]`（PM Cowork + 工程師協作）並改 `type:TYPE.COWORK`（已是 Cowork）

### postDev.edges
- 刪除：`{from:'5',to:'6',label:'未通過'}`
- 刪除：`{from:'7',to:'8'}` (若存在直連)
- 新增：`{from:'5',to:'postdev-engineer-impact',label:'未通過'}`
- 新增：`{from:'postdev-engineer-impact',to:'6'}`
- 新增：`{from:'7',to:'postdev-engineer-codereview'}`
- 新增：`{from:'postdev-engineer-codereview',to:'8'}`

### Schema 升級
- 新增 `roles` 陣列欄位支援：node 10 改為 `roles:[ROLE.PM, ROLE.ENG]`
- 注意：flowcharts.js 只讀 `n.role` — roles[] 為 data 層欄位，Step 04 SSOT 時再同步 renderer

## TDD

檔案：`tests/e2e/v6-step02-uat.spec.js`（6 tests）

1. `postDev.edges` 無 `{from:'5',to:'6'}` 直送
2. 存在 `{from:'5',to:'postdev-engineer-impact'}` 與 `{from:'postdev-engineer-impact',to:'6'}`
3. node `postdev-engineer-impact` type=HUMAN role=ENGINEER
4. node 10 支援 `roles` 陣列含 `['pm','eng']`
5. `postDev.edges` 無 `{from:'7',to:'8'}` 直連（v3.7 PNG 示 Code Review 為必經）
6. 存在 `{from:'7',to:'postdev-engineer-codereview'}` 與 `{from:'postdev-engineer-codereview',to:'8'}`，node type=HUMAN role=ENGINEER
