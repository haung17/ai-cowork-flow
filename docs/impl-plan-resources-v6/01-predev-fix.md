# Step 01: preDev 流程修正

**Goal**: 新增工程師「投標前技術探勘」於 Gate 前；rename node 11 為「交付期技術規劃（CR 評估）」；刪 11→7 back-edge；接 Kickoff node 12。

## 變更清單（assets/data.js）

### preDev.nodes
- 插入新 node（位於 node 8 之後、node 9 之前）：
  ```js
  { id:'predev-engineer-presurvey', role:ROLE.ENG, type:TYPE.HUMAN,
    title:'工程師：投標前技術探勘',
    bullets:['技術可行性確認','估算校正','技術風險識別'], x:70, y:47 }
  ```
- node 11 title 改為 `'工程師：交付期技術規劃（CR 評估）'`
- 新增 node 12（Kickoff terminal）：
  ```js
  { id:'12', role:ROLE.PM, type:TYPE.HUMAN,
    title:'PM 人工：Kickoff / Sprint 起跑',
    bullets:['開發分支建立','任務分派','溝通節奏'], x:45, y:83 }
  ```

### preDev.edges
- 刪除：`{from:'8',to:'9'}`
- 刪除：`{from:'11',to:'7',label:'估算差異 → 修正 SOW / 報價'}`
- 新增：`{from:'8',to:'predev-engineer-presurvey'}`
- 新增：`{from:'predev-engineer-presurvey',to:'9'}`
- 新增：`{from:'11',to:'12',label:'交付期規劃完成'}`

## TDD

檔案：`tests/e2e/v6-step01-predev.spec.js`（4 tests）

1. `preDev.nodes` 含 id `predev-engineer-presurvey`
2. `preDev.edges` 無 `{from:'11',to:'7'}`
3. 渲染後 `#preDev-predev-engineer-presurvey .fc-node-title` 含「投標前技術探勘」
4. node 11 role=`eng` 且 title 含「交付期」
