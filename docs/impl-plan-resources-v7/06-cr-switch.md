# Step 06 — midDev 加變更管理切換節點

## Goal

Gate CR（node 10 現 y=92）→ **工程師變更管理切換**（決定 AI 重生 vs 人工修補）→ 回 Claude Code（node 1 y=2）。對應規則 10。同時滿足 4-agent review 條件 (i)：midDev edges 無 `{from:'10',to:'1'}` 直連。

## 座標

| Node | x | y | 說明 |
|------|---|---|------|
| `middev-engineer-cr-switch`（新） | 70 | 101 | node 10 (y=92) 下方 +9；不影響其他節點 |

x=70 而非 45：與 node 10（x=70）同欄，back-edge 向左回 node 1（x=45）視覺清晰。

## data.js 修改

**新節點**（插在 node 11 後，或直接加在 nodes array 末尾）：
```js
{ id:'middev-engineer-cr-switch', role:ROLE.ENG, type:TYPE.HUMAN,
  title:'工程師：變更管理切換',
  bullets:['AI 重生（重新生成）','人工修補','禁止 AI 自主判斷重構'],
  x:70, y:101 },
```

**Edge 修改**：
- 刪：`{from:'10',to:'1',label:'簽核後排入'}`
- 加：`{from:'10',to:'middev-engineer-cr-switch',label:'CR 核准'}`
- 加：`{from:'middev-engineer-cr-switch',to:'1',label:'AI 重生 / 人工修補',toSide:'right'}` （back-edge；`toSide:'right'` 讓路徑從 node 1 右側入，避免交叉）

## Tests (`v7-step06-cr-switch.spec.js`) — 4 tests

1. `midDev.nodes` 含 `middev-engineer-cr-switch`
2. `midDev.edges` 含 `10→cr-switch` + `cr-switch→1`
3. `midDev.edges` 無 `{from:'10',to:'1'}` 直連（review 條件 i）
4. node title/bullets 含「變更管理」與「AI 重生」

## Notes for Step 07

- Step 07 開始 resources.html 改動：Tier 4 sticky banner + resources-catalog.md WBS Tier 1→Tier 2
- Step 07 範圍純 HTML/CSS/Markdown，不動 data.js / flowcharts.js
- 需確認 resources.html 頂部結構：有無 `<header>` 或 `<main>` 可插 sticky aside
- Step 06 後建議跑全 step01~06 回歸確認無破壞
