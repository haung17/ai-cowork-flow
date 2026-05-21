# Step 05 — midDev 加 AI Code Test Gate 節點

## Goal

midDev Claude Code 開發（node 1 y=2）→ **工程師 AI Code 測試門檻**（覆蓋率 ≥ 80%）→ 建立 PR（node 2 y=11）。對應規則 9。

## 座標調整

同 step04 邏輯：NODE_H=110 / UNIT=14 → 需 ≥8 units 間距。當前 1(y=2)→2(y=11) 間距 9 units 不足插入第三節點。做法：新 gate 放 y=11，所有 y≥11 的 midDev 節點 **+9**。

### 新節點

```js
{ id:'middev-engineer-ai-test-gate', role:ROLE.ENG, type:TYPE.HUMAN,
  title:'工程師：AI Code 測試門檻',
  bullets:['自動化測試覆蓋率 ≥ 80%','或靜態分析 pass','不得繞過此門檻'],
  x:45, y:11 }
```

### midDev 節點 y 座標更新（+9 shift）

| Node | 舊 y | 新 y |
|------|------|------|
| 2（建立 PR） | 11 | 20 |
| 3（CI 自動驗證） | 20 | 29 |
| 4（CI 是否通過？） | 29 | 38 |
| 5（Code Review） | 38 | 47 |
| 6（部署測試環境） | 47 | 56 |
| 7（QA 驗證） | 56 | 65 |
| 8（問題彙整） | 56 | 65 |
| 9（問題類型？） | 65 | 74 |
| middev-pm-clarify | 74 | 83 |
| 10（Gate CR） | 83 | 92 |
| 11（UAT 準備） | 83 | 92 |

### Edge 修改

- 刪：`{from:'1',to:'2'}`
- 加：`{from:'1',to:'middev-engineer-ai-test-gate'}` + `{from:'middev-engineer-ai-test-gate',to:'2',label:'覆蓋率達標'}`

### Step02 測試更新（座標變動）

v7-step02-middev-layout.spec.js 的座標斷言需跟著更新：
- `middev-pm-clarify.y === 74` → `83`
- `node 10.y === 83` → `92`
- `node 11.y === 83` → `92`

## Tests (`v7-step05-ai-test.spec.js`) — 4 tests

1. `midDev.nodes` 含 `middev-engineer-ai-test-gate`
2. `midDev.edges` 含 `1→ai-test-gate` + `ai-test-gate→2`
3. `midDev.edges` 無 `{from:'1',to:'2'}` 直連
4. node bullets 含「80%」

## Notes for Step 06

- Step 06 CR Switch：插在 node 10（Gate CR，y=92 after step05）後
- 新節點放 y=101（92+9）；不需再 mass-shift
- ID：`middev-engineer-cr-switch`（遵循 {phase}-{role}-{noun} 規則）
- 刪 `{from:'10',to:'1',label:'簽核後排入'}`；加 `10→cr-switch→1`（back-edge 用 side props）
