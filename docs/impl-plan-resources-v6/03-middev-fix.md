# Step 03: midDev 規格疑義出口

**Goal**: 新增 PM 規格釋疑節點；規格疑義從 node 9 redirect 至新節點，破 8↔9 環；統一「客戶 Gate」字串。

## 變更清單（assets/data.js）

### midDev.nodes
- 插入：`{id:'middev-pm-clarify', role:ROLE.PM, type:TYPE.HUMAN, title:'PM：規格釋疑 + 客戶確認', bullets:['需求釐清','客戶確認','更新 User Story'], x:70, y:65}`

### midDev.nodes（追加）
- 插入：`{id:'11', role:ROLE.PM, type:TYPE.HUMAN, title:'PM / QA：UAT 準備', bullets:['版本候選確認','UAT 環境申請','驗收計劃'], x:45, y:74}`（UAT 開始前的人工準備節點）

### midDev.edges
- 刪除：`{from:'9',to:'8',label:'規格疑義'}`
- 新增：`{from:'9',to:'middev-pm-clarify',label:'規格疑義'}`
- 新增：`{from:'9',to:'11',label:'通過'}`（通過後進入 UAT 準備）
- 新增：`{from:'middev-pm-clarify',to:'10',label:'需客戶 Gate'}`（CR Gate = node 10）
- 新增：`{from:'middev-pm-clarify',to:'1',label:'需更新實作'}`（釐清後需 code 變更，回 Claude Code 開發）
- 新增：`{from:'middev-pm-clarify',to:'7',label:'無需實作變更'}`（釐清後確認無需修改，回 QA 重驗）
- 原 `{from:'middev-pm-clarify',to:'6',label:'釐清後可繼續'}` 已廢棄（node 6 = 自動部署，非開發起點）

### 字串統一
- `data.js` midDev nodes：所有「客戶接抵 Gate」改為「客戶 Gate」

## TDD

檔案：`tests/e2e/v6-step03-middev.spec.js`（5 tests）

1. `midDev.edges` 無 `{from:'8',to:'9'}` AND `{from:'9',to:'8'}` 同存
2. 存在 `middev-pm-clarify` 節點
3. node 9 有出 edge 含 label='規格疑義' 指向 `middev-pm-clarify`（不再指向 8）
4. node `middev-pm-clarify` 有 ≥ 2 條出 edge 且皆有 label
5. `git grep "客戶接抵"` 在 *.js = 0
