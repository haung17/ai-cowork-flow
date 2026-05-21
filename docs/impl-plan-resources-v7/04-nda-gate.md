# Step 04 — preDev 加 NDA Gate 節點

## Goal

preDev 需求訪談（node 1）→ **PM NDA Gate** → 會議紀錄（node 2）。確保客戶接洽後、實作前完成 NDA 簽署 + 個資識別（對應規則 8）。

## 座標

| Node | x | y | 說明 |
|------|---|---|------|
| `predev-nda-gate`（新） | 45 | 6 | node 1 y=2、node 2 y=11 之間；其餘節點不移動 |

## data.js 修改

**新節點**（插在 node 1 後）：
```js
{ id:'predev-nda-gate', role:ROLE.PM, type:TYPE.HUMAN,
  title:'PM 人工：NDA + 資安審查',
  bullets:['NDA 簽署確認','個資/敏感資料識別','敏感資料不進 AI prompt'],
  x:45, y:6 },
```

**Edge 修改**：
- 刪：`{from:'1',to:'2'}`
- 加：`{from:'1',to:'predev-nda-gate'}` + `{from:'predev-nda-gate',to:'2'}`

## Tests (`v7-step04-nda.spec.js`) — 4 tests

1. `preDev.nodes` 含 `predev-nda-gate`
2. `preDev.edges` 含 `1→predev-nda-gate` + `predev-nda-gate→2`
3. `preDev.edges` 不含 `{from:'1',to:'2'}` 直連
4. node label 含「NDA」與「資安」（title 或 bullets）

## Notes for Step 05

- Step 05 midDev AI Code Test Gate：插在 node 1 (Claude Code y=2) 與 node 2 (建立 PR y=11) 之間
- midDev 同樣有 9-unit gap；可用 (60, 6) 或 (45, 6)
- 需用 x-offset (60) 讓 gate 節點靠右，避免與 preDev 同 x=45 的流程混淆（midDev node 1 在 x=45）
- Step 03 review 確認：y-density 安全，middev-cr-switch 預定 y=92
