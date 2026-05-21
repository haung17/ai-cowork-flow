# Step 08 — Human Gate Checklist 可勾選 + 進度條

## Goal

`resources-state.json` acceptanceChecks 升級 schema（加 `owner` + `required`）；`resources-loader.js` renderAcceptanceChecks 改為互動 checkbox + localStorage 保存 + per-resource 進度條；required 全勾時 H3 旁出現 ✅。

## 修改清單

| 檔案 | 變動 |
|------|------|
| `resources-state.json` | 所有 9 個 resource 的 acceptanceChecks 加 `owner` + `required: bool` |
| `assets/resources-loader.js` | `renderAcceptanceChecks` 改互動版；新增 `_updateProgress` helper |
| `assets/style-resources.css` | `.acceptance-progress`、`.owner`、`.required-marker`、`.h3-complete` |

## resources-state.json schema

每個 acceptanceChecks item：
```json
{ "label": "...", "status": "Pending", "owner": "PM|Engineer|QA", "required": true }
```

`required` 預設 `true`；`owner` 依業務邏輯填入（PM / Engineer / QA）。

## resources-loader.js — renderAcceptanceChecks 邏輯

1. 找 `h3[data-resource-id]` 對應 checks
2. 每個 check → `<label><input type="checkbox" data-resource="{id}" data-idx="{idx}"> {label} <span class="owner">@{owner}</span><span class="required-marker"> ⭑</span></label>`
3. localStorage key: `cowork-check-{id}-{idx}` — 值 `"1"` 代表勾選；render 時 restore
4. change event → localStorage save/remove → `_updateProgress(id, checks, h3)`
5. 進度條 `<div class="acceptance-progress" data-resource="{id}">{checked}/{requiredTotal} required</div>`
6. 全勾 → H3 append `<span class="h3-complete"> ✅</span>`

## Tests (`v7-step08-checklist.spec.js`) — 6 tests

1. state schema 全 entries acceptanceChecks 都有 `owner` (string) + `required` (boolean)
2. checkbox 可點選（非 disabled）
3. checkbox click → localStorage `cowork-check-{id}-{idx}` = `"1"`
4. reload → 勾選狀態還原
5. `.acceptance-progress` 顯示 `N / M` 格式
6. 100 checkbox 連續 click < 200ms

## Notes for Step 09

- Step 09 DOMPurify：resources.html 加 CDN script；resources-loader.js fetchAll 加 sanitize；schema section check。
- Step 08 localStorage key 格式確定：`cowork-check-{resourceId}-{checkIndex}` — Step 09 不動此格式。
