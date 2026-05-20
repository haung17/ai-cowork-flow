# Step 03 — Status 重劃 + 遷移

**目標**：state.json 全部砍為 DraftReady；新增 6 種 Status enum；badge CSS 對應；更新受影響的既有測試。

**交付檔**：
- `resources-state.json`（全 9 筆 status → DraftReady）
- `assets/style-resources.css`（6 色 status badge）
- `tests/e2e/status-migration.spec.js`（RED → GREEN）
- `tests/unit/state-merge.spec.js`（更新 `Verified` → `DraftReady`）
- `tests/e2e/renderer.spec.js`（更新 `Verified`/`Needs Human Gate` → `DraftReady`）

---

## Migration Note（code-reviewer v3 必要條件）

| 舊 Status | 新 Status | 理由 |
|-----------|-----------|------|
| `Verified` (×4) | `DraftReady` | 外部 review 給 82/100；現有資源未經正式客戶實戰驗證，不應標 Verified |
| `Needs Human Gate` (×3) | `DraftReady` | 保持 NeedsHumanGate 語意，但先降回 DraftReady 再重新走驗證流程 |
| `System Candidate` (×2) | `DraftReady` | 同上 |

舊 `resources-state.json` key 不變；`verification` 欄位不變；`status` 欄位全部改寫。

---

## TDD RED 測試

**檔案**：`tests/e2e/status-migration.spec.js`

```js
// tests/e2e/status-migration.spec.js
const { test, expect } = require('@playwright/test');

test('status-migration: all 9 resource badges show DraftReady', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id]', { timeout: 8000 });
  const badges = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.status-badge'))
      .filter(b => {
        const h3 = b.previousElementSibling;
        return h3 && h3.dataset.resourceId;
      })
      .map(b => b.textContent.trim());
  });
  expect(badges.length).toBe(9);
  expect(badges.every(t => t === 'DraftReady')).toBe(true);
});

test('status-migration: no "Verified" text in any status badge', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const hasVerified = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.status-badge'))
      .some(b => b.textContent.trim() === 'Verified')
  );
  expect(hasVerified).toBe(false);
});

test('status-migration: no "Needs Human Gate" text in any status badge', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-badge', { timeout: 8000 });
  const has = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.status-badge'))
      .some(b => b.textContent.trim() === 'Needs Human Gate')
  );
  expect(has).toBe(false);
});

test('status-migration: .status-draftready CSS class exists and has background', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.status-draftready', { timeout: 8000 });
  const bg = await page.evaluate(() => {
    const el = document.querySelector('.status-draftready');
    return el ? window.getComputedStyle(el).backgroundColor : null;
  });
  expect(bg).not.toBeNull();
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
});

test('status-migration: meeting-notes badge class is status-draftready', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('h3[data-resource-id="meeting-notes"]', { timeout: 8000 });
  const cls = await page.evaluate(() => {
    const h3 = document.querySelector('h3[data-resource-id="meeting-notes"]');
    const badge = h3 && h3.nextElementSibling;
    return badge ? badge.className : null;
  });
  expect(cls).toContain('status-draftready');
});
```

---

## 實作要點

### `resources-state.json` — 全部 status 改 DraftReady

```json
{
  "meeting-notes":      { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "work-plan":          { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "presentation":       { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "wbs":                { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "org-chart":          { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "prototype":          { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "sprint-plan":        { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "asana":              { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" },
  "milestone-reminder": { "status": "DraftReady", "verification": [...], "lastUpdated": "2026-05-20" }
}
```

**`assets/resources-loader.js` badge class 映射**：現有 `entry.status.toLowerCase().replace(/\s+/g, '-')` 可直接處理 DraftReady → `draftready`。無需改 JS。

### `assets/style-resources.css` — 6 色 badge

移除舊 4 色（`status-verified`, `status-needs-human-gate`, `status-system-candidate`, `status-draft`, `status-deprecated`），換成 6 色：

```css
.status-draftready       { background: var(--bg-muted); color: var(--text-muted); }
.status-internallytested { background: #EFF6FF; color: #1D4ED8; }
.status-clienttested     { background: #F0FDF4; color: #15803D; }
.status-needshumangate   { background: #FFF7ED; color: #D97706; }
.status-notrecommended   { background: #FEF2F2; color: #DC2626; text-decoration: line-through; }
.status-systemcandidate  { background: #F5F3FF; color: #7C3AED; }
```

dark-mode 暫不加（和 tier3/4 一樣 deferred）。

### 既有測試更新

**`tests/unit/state-merge.spec.js` line 21**：
```js
// 舊
test('state-merge: meeting-notes has status Verified', async ({ page }) => {
  ...
  expect(status).toBe('Verified');
});
// 新
test('state-merge: meeting-notes has status DraftReady', async ({ page }) => {
  ...
  expect(status).toBe('DraftReady');
});
```

**`tests/e2e/renderer.spec.js` line 11-20**：
```js
// 舊: expect(text).toBe('Verified')
// 新: expect(text).toBe('DraftReady')
```

**`tests/e2e/renderer.spec.js` line 35-44**：
```js
// 舊: expect(text).toBe('Needs Human Gate')
// 新: expect(text).toBe('DraftReady')
```

---

## 驗收命令

```powershell
# RED（改 state.json/CSS/tests 前）
npx playwright test tests/e2e/status-migration.spec.js --reporter=list
# 預期：5 tests FAIL

# GREEN（改完後）
npx playwright test tests/e2e/status-migration.spec.js --reporter=list
# 預期：5 tests PASS

# flake check
npx playwright test tests/e2e/status-migration.spec.js --repeat-each=3

# 全 suite 回歸
npx playwright test --reporter=list
# 預期：84 + 5 = 89 tests PASS（既有 renderer/state-merge 同步更新）

# grep 殘留
git grep "Verified" -- "*.json" "*.md"
# 預期：0（除 plan doc 引用）
```

---

## Commit message

```
feat(step-03): status reclassification all → DraftReady + 6-color badge CSS (v3 governance priority #2)
```
