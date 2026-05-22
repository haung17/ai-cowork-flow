# Step 08 Review — Human Gate Checklist 可勾選 + 進度條

## 4-Agent Review 結果

| Agent | 結論 | 主要意見 |
|-------|------|----------|
| test-runner | PASS | 187/187 全綠；flake check 18/18 PASS |
| code-reviewer | APPROVE | 9 hard gates 全 PASS；minor: dead CSS、`checks.indexOf(c)` 可改寫、`c.required !== false` 邊界 |
| performance-investigator | PASS (1 CONCERN) | (d) init loop write-read interleave → two-pass fix |
| refactor-architect | PASS (2 CONCERN) | (c) localStorage key 與 array order 綁定；(e) `align-items: baseline` → `flex-start` |

## Post-Review 修正

1. **CSS**: 移除舊 `.acceptance-list` / `.acceptance-chip.*` dead code（lines 404-433）
2. **CSS**: `.acceptance-list label` `align-items: baseline` → `flex-start`；checkbox 加 `margin-top: 2px`
3. **JS**: `renderAcceptanceChecks` 改兩段 pass：先批次 DOM writes，再統一跑 `_updateProgress`（消除 init write-read interleave）

## 未修正（可接受）

- `checks.indexOf(c)` 保持現狀（v3.8 correctness 無影響；v3.9 可用 forEach + origIdx closure 取代）
- localStorage key 與 array order 綁定：接受現狀，spec 已知此限制（resources-state.json acceptanceChecks 不得重排）

## Step 09 調整

- Step 09 不動 localStorage key format；DOMPurify 加在 fetchAll 的 md → html 路徑，不影響 checkboxes
- Step 09 schema validation 檢查 `## 9 個資源詳述` 章節是否存在
