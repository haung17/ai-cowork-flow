# Step 01 — Tier Schema 重劃

**目標**：定義 Tier 1-4 命名，改 catalog 開頭 Tier 圖例；在末尾加 Tier 4 H2 佔位（內容在 step 02 補）。

**交付檔**：
- `resources-catalog.md`（圖例改寫 + 速查表 Tier 欄 + Tier 4 H2 佔位）
- `tests/e2e/tier-rename.spec.js`（RED → GREEN）

---

## TDD RED 測試

**檔案**：`tests/e2e/tier-rename.spec.js`

```js
// tests/e2e/tier-rename.spec.js
const { test, expect } = require('@playwright/test');

test('tier: legend table has exactly 4 rows', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const count = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('#catalog-content table'));
    const tierTable = tables.find(t => {
      const ths = Array.from(t.querySelectorAll('th'));
      return ths.some(th => th.textContent.trim() === 'Tier') &&
             ths.some(th => th.textContent.trim() === '定義');
    });
    return tierTable ? tierTable.querySelectorAll('tbody tr').length : 0;
  });
  expect(count).toBe(4);
});

test('tier: legend contains "Draft-safe"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('Draft-safe')
  );
  expect(found).toBe(true);
});

test('tier: legend contains "Decision-assisted"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('Decision-assisted')
  );
  expect(found).toBe(true);
});

test('tier: legend contains "System-output"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('System-output')
  );
  expect(found).toBe(true);
});

test('tier: legend contains "Human-only"', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('Human-only')
  );
  expect(found).toBe(true);
});

test('tier: no "AI 自動化程度" string remains', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content', { timeout: 8000 });
  const found = await page.evaluate(() =>
    document.getElementById('catalog-content').innerText.includes('AI 自動化程度')
  );
  expect(found).toBe(false);
});

test('tier: Tier 4 H2 exists in catalog', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const found = await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('#catalog-content h2'));
    return h2s.some(h => h.textContent.trim().startsWith('Tier 4'));
  });
  expect(found).toBe(true);
});

test('tier: speed-ref table Tier column shows "1" not old verbose text', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  // First data row should be meeting-notes with Tier 1
  const tierCell = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('#catalog-content table'));
    const speedRef = tables.find(t =>
      Array.from(t.querySelectorAll('th')).some(th => th.textContent.trim() === 'Primary type')
    );
    if (!speedRef) return null;
    const firstRow = speedRef.querySelector('tbody tr');
    const headers = Array.from(speedRef.querySelectorAll('th')).map(th => th.textContent.trim());
    const idx = headers.indexOf('Tier');
    const cells = firstRow.querySelectorAll('td');
    return cells[idx] ? cells[idx].textContent.trim() : null;
  });
  expect(tierCell).toBe('1');
});
```

---

## 實作要點

### `resources-catalog.md` — 圖例改寫

**改前**（行 7-13）：
```md
### Tier — AI 自動化程度

| Tier | 定義 |
|------|------|
| **1** | 丟原料 AI 直接做大部分，人僅校稿或微調數字 |
| **2** | AI 輔助起草，需明確人工輸入與決策確認才能繼續 |
| **3** | 需接系統或定期觸發；AI 產 CSV / ICS / JSON，由人匯入 |
```

**改後**：
```md
### Tier — AI 使用風險等級

| Tier | 定義 |
|------|------|
| **1: Draft-safe** | AI 產草稿，不得直接交付；人必須校閱後再對外 |
| **2: Decision-assisted** | AI 輔助分析，關鍵決策由人完成；AI 可做資訊彙整 |
| **3: System-output** | AI 產系統匯入格式（CSV/ICS/JSON），人工觸發或審核後匯入 |
| **4: Human-only** | 報價、合約、UAT 驗收、Production 部署、CR 核准 — AI 不得代決策 |
```

### `resources-catalog.md` — 速查表 Tier 欄

速查表 Tier 欄數字保持不動（1/2/3），仍是純數字，方便掃描。

### `resources-catalog.md` — Tier 4 H2 佔位（末尾）

在現有 Tier 3 `## Tier 3 系統整合總覽` 之後加：

```md
---

## Tier 4 Human-only — 禁止 AI 代決策

> 以下項目 AI 可協助準備資料與草稿，但**絕對不得以 AI 產出直接作為決策依據或對外承諾**。
> 正式核准、簽字、部署指令必須由具責任人工完成。

<!-- step-02 補充 4 個 H3 -->
```

---

## 驗收命令

```powershell
# RED（改 catalog 前）
npx playwright test tests/e2e/tier-rename.spec.js --reporter=list
# 預期：8 tests FAIL

# GREEN（改 catalog 後）
npx playwright test tests/e2e/tier-rename.spec.js --reporter=list
# 預期：8 tests PASS

# flake check
npx playwright test tests/e2e/tier-rename.spec.js --repeat-each=3
# 預期：24 tests PASS (8×3)

# 全 suite 回歸
npx playwright test --reporter=list
# 預期：70 + 8 = 78 tests PASS
```

---

## 4-agent review prompts

### code-reviewer
```
Review step-01 changes on feat/v3-governance-core.
Files: resources-catalog.md, tests/e2e/tier-rename.spec.js
Check:
(a) No TODO/FIXME in new md content
(b) Tier table H3 label changed from "AI 自動化程度" to "AI 使用風險等級" — no other remnants of old label
(c) Speed-ref table Tier column numbers (1/2/3) unchanged (selector compatibility)
(d) Tier 4 H2 佔位 comment does not leak to rendered HTML
(e) Commit message references step-01
v3 extra: no state.json change → no migration note required at this step
```

### test-runner
```
Run full suite + flake check on feat/v3-governance-core after step-01.
npx playwright test --reporter=list
npx playwright test tests/e2e/tier-rename.spec.js --repeat-each=3
Check: 78/78 green, 0 flake.
v3 extra: git grep "AI 自動化程度" -- "*.md" == 0
```

### performance-investigator
```
Profile resources.html after step-01.
Measure: FCP < 1.5s, tagTier4 (step-01 only adds H2 佔位, no JS change) N/A.
resources-loader.js unchanged — confirm line count still < 300.
```

### refactor-architect
```
Review resources-loader.js after step-01.
Confirm: tagTier3 still correct; no new functions added; line count < 300.
Note: tagTier4() is NOT added in step-01 (pure content change step); flag if it appears.
```

---

## Commit message

```
feat(step-01): tier schema rename 1-3 + tier 4 H2 placeholder (v3 governance priority #1)
```
