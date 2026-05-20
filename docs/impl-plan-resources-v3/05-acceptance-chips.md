# Step 05 — Acceptance Checklist + 4-Color Chip

**目標**：`resources-state.json` 新增 `acceptanceChecks` schema；renderer 渲染 4-color chip；WCAG AA contrast ≥ 4.5:1。

---

## Deliverables

| 檔案 | 動作 |
|------|------|
| `tests/e2e/acceptance-chips.spec.js` | 新建（RED → GREEN） |
| `resources-state.json` | 9 個 entry 各加 `acceptanceChecks: []`（≥2 items per resource） |
| `assets/resources-loader.js` | 新增 `renderAcceptanceChecks(root, state)` |
| `assets/style-resources.css` | 新增 4 個 `.acceptance-chip.status-*` 樣式（WCAG AA） |

---

## state.json Schema

```json
{
  "meeting-notes": {
    "status": "DraftReady",
    "verification": [...],
    "acceptanceChecks": [
      { "label": "決策清單有負責人 + 期限", "status": "Pending" },
      { "label": "敏感資訊脫敏", "status": "Pending" }
    ],
    "lastUpdated": "2026-05-20"
  }
}
```

`acceptanceChecks[].status` enum: `Pending` / `Pass` / `Fail` / `N/A`

---

## renderAcceptanceChecks

插入位置：每個 H3 的 `.verification-list` **之後**

```js
ResourcesLoader.renderAcceptanceChecks = function(root, state) {
  var IDs = ResourcesLoader._RESOURCE_IDS;
  root.querySelectorAll('h3[data-resource-id]').forEach(function(h3) {
    var id = h3.dataset.resourceId;
    var checks = state[id] && state[id].acceptanceChecks;
    if (!checks || !checks.length) return;
    // find verification-list sibling
    var anchor = h3;
    var el = h3.nextElementSibling;
    while (el && el.tagName !== 'H3' && el.tagName !== 'H2') {
      if (el.classList.contains('verification-list')) anchor = el;
      el = el.nextElementSibling;
    }
    var ul = document.createElement('ul');
    ul.className = 'acceptance-list';
    checks.forEach(function(c) {
      var li = document.createElement('li');
      var chip = document.createElement('span');
      var key = c.status.toLowerCase().replace('/', '-');
      chip.className = 'acceptance-chip status-' + key;
      chip.textContent = c.status.toUpperCase();
      li.appendChild(chip);
      li.appendChild(document.createTextNode(' ' + c.label));
      ul.appendChild(li);
    });
    anchor.parentNode.insertBefore(ul, anchor.nextSibling);
  });
};
```

---

## CSS — WCAG AA Contrast

| Class | Background | Color | Contrast ratio |
|-------|-----------|-------|---------------|
| `.status-pending` | `#F3F4F6` | `#374151` | ~8.6:1 ✓ |
| `.status-pass` | `#F0FDF4` | `#15803D` | ~5.1:1 ✓ |
| `.status-fail` | `#FEF2F2` | `#B91C1C` | ~5.9:1 ✓ |
| `.status-n-a` | `#FFFBEB` | `#92400E` | ~6.3:1 ✓ |

```css
.acceptance-chip {
  display: inline-block;
  padding: 1px 6px;
  border-radius: var(--r-sm);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-right: var(--sp-2);
}
.acceptance-chip.status-pending { background: #F3F4F6; color: #374151; }
.acceptance-chip.status-pass    { background: #F0FDF4; color: #15803D; }
.acceptance-chip.status-fail    { background: #FEF2F2; color: #B91C1C; }
.acceptance-chip.status-n-a     { background: #FFFBEB; color: #92400E; }

.acceptance-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--sp-4) 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}
.acceptance-list li {
  font-size: var(--text-sm);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: var(--sp-1);
}
```

Note: `N/A` → CSS class `status-n-a` (slash replaced with hyphen).

---

## acceptanceChecks 內容（9 資源）

| 資源 | checks (status 全 Pending) |
|------|---------------------------|
| meeting-notes | 決策清單有負責人+期限；敏感資訊脫敏 |
| work-plan | in-scope/out-of-scope 明確；工時含 buffer≥10%；報價數字由人填寫 |
| presentation | 數字正確性確認；無機密資訊；CDN 依賴已處理 |
| wbs | 工時估算合理；任務依賴關係正確；與 SOW 無超出或遺漏 |
| org-chart | 每個角色有真實人員；DRI 不空白；客戶端窗口已確認 |
| prototype | UX 流程符合需求；標示「僅供 demo」；可進入 repo |
| sprint-plan | 優先序決策完成；人員可用性確認；緩衝時間足夠 |
| asana | assignee 格式正確；無重複 task；日期格式 YYYY-MM-DD |
| milestone-reminder | 日期與計劃書一致；時區正確；名稱與 ASANA 一致 |

---

## 4-Agent Review 條件

| Agent | 條件 |
|-------|------|
| code-reviewer | schema 新增 `acceptanceChecks` 需附 migration note 在 reviews/step-05.md；不破壞既有 verification 測試 |
| test-runner | 全套 ≥ 97/97（93 + 新 4）；`--repeat-each=3` acceptance-chips.spec.js 12/12 |
| perf | 4-color chip contrast ratio 計算（WCAG AA ≥ 4.5:1）每色均達標 |
| refactor-architect | `renderAcceptanceChecks` ≤ 30 lines；不重複 `enrichDom` 邏輯 |

---

## Commit

`feat(step-05): acceptance checklist schema + 4-color chip renderer (WCAG AA)`
