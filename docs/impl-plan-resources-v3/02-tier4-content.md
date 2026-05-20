# Step 02 — Tier 4 內容區塊

**目標**：填入 Tier 4 的 4 個 H3 詳述；新增 `tagTierBlock(root, label)` 取代 `tagTier3()` + `tagTier4()` 分立（維持 resources-loader.js < 300 行）。

**交付檔**：
- `resources-catalog.md`（Tier 4 H2 下補 4 個 H3）
- `assets/resources-loader.js`（`tagTier3` + `tagTier4` → `tagTierBlock`）
- `assets/style-resources.css`（`.tier4-block` 紅左框樣式）
- `tests/e2e/tier4-block.spec.js`（RED → GREEN）

> **step-01 refactor-architect 動態調整**：資源 loader 現 284 行，tagTier4 直接加 16 行 = 300 整。
> 任何註解/空行即超。**強制合併為 `tagTierBlock(root, label)` 參數化 helper**（節省 ~13 行）。

---

## TDD RED 測試

**檔案**：`tests/e2e/tier4-block.spec.js`

```js
// tests/e2e/tier4-block.spec.js
const { test, expect } = require('@playwright/test');

test('tier4: .tier4-block element exists', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const count = await page.locator('.tier4-block').count();
  expect(count).toBe(1);
});

test('tier4: .tier4-block contains exactly 4 H3s', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier4-block', { timeout: 8000 });
  const count = await page.locator('.tier4-block h3').count();
  expect(count).toBe(4);
});

test('tier4: each H3 under tier4-block has 禁止 AI text', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier4-block h3', { timeout: 8000 });
  const allForbidden = await page.evaluate(() => {
    const h3s = Array.from(document.querySelectorAll('.tier4-block h3'));
    return h3s.every(h3 => {
      let el = h3.nextElementSibling;
      while (el && el.tagName !== 'H3') {
        if (el.innerText && el.innerText.includes('禁止 AI')) return true;
        el = el.nextElementSibling;
      }
      return false;
    });
  });
  expect(allForbidden).toBe(true);
});

test('tier4: .tier4-block has red left border (CSS variable --accent-danger fallback)', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier4-block', { timeout: 8000 });
  const borderColor = await page.evaluate(() => {
    const el = document.querySelector('.tier4-block');
    return window.getComputedStyle(el).borderLeftColor;
  });
  // #DC2626 = rgb(220,38,38)
  expect(borderColor).toBe('rgb(220, 38, 38)');
});

test('tier4: Tier 3 block (.tier3-block) not affected — still exists', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content', { timeout: 8000 });
  const t3 = await page.locator('.tier3-block').count();
  const t4 = await page.locator('.tier4-block').count();
  expect(t3).toBe(1);
  expect(t4).toBe(1);
});

test('tier4: 階段流向總覽 section NOT inside tier4-block', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const inside = await page.evaluate(() => {
    const tier4 = document.querySelector('.tier4-block');
    if (!tier4) return false;
    const flowH2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('階段流向'));
    return tier4.contains(flowH2);
  });
  expect(inside).toBe(false);
});
```

---

## 實作要點

### `resources-catalog.md` — Tier 4 H2 下補 4 個 H3

移除 HTML 佔位 comment，補入 4 個 H3：

```md
## Tier 4 Human-only — 禁止 AI 代決策

> 以下項目 AI 可協助準備資料與草稿，但**絕對不得以 AI 產出直接作為決策依據或對外承諾**。
> 正式核准、簽字、部署指令必須由具責任的人工完成。
> 如違反，由具名決策者承擔完整責任。

### 4-H3-A. 報價與合約簽署

**AI 可做：** 起草報價說明文字、整理 SOW 條款對照表、標記需填寫欄位（金額/單價/條款）
**禁止 AI：** 直接填入報價金額、代表公司簽署任何合約、對客戶承諾交期或費用
**負責人：** PM（報價草稿）+ 業務主管或授權代理人（最終發送）
**升級條件：** 若僅需草稿整理且客戶明確知情為 AI 草稿 → 可降至 Tier 2（Decision-assisted）

### 4-H3-B. UAT 驗收簽核

**AI 可做：** 產出 UAT checklist 草稿、整理測試結果摘要、標記未通過項目
**禁止 AI：** 自行判定 UAT 通過、在驗收文件上代填「通過」或類似字樣、通知客戶上線
**負責人：** QA + PM 共同簽核；客戶業主最終確認
**升級條件：** AI 只做測試輔助紀錄（不觸碰簽核流程）→ 可降至 Tier 1（Draft-safe）

### 4-H3-C. Production 部署與 Hotfix

**AI 可做：** 產出部署 runbook 草稿、整理回滾步驟清單、分析錯誤 log
**禁止 AI：** 執行任何正式環境指令、觸發部署流程、刪除生產資料、修改正式環境設定
**負責人：** 資深工程師 + DevOps（部署）；由 PM 確認視窗
**升級條件：** 僅 PR 審查輔助或測試環境 → 可降至 Tier 2（Decision-assisted）

### 4-H3-D. CR 變更申請核准

**AI 可做：** 起草 CR 說明文件、整理 scope change 影響分析、標記受影響的 SOW 條款
**禁止 AI：** 同意任何 scope 變更、修改已簽約範疇、承諾額外工時或費用
**負責人：** PM 評估影響 + 業務主管或授權代理人核准
**升級條件：** 若 CR 不涉及費用/交期變動且客戶主動確認 → PM 可自行判定
```

### `assets/resources-loader.js` — `tagTierBlock` 取代 `tagTier3`

**改前** (line 211-225, 15 lines)：
```js
ResourcesLoader.tagTier3 = function(root) {
  var h2s = Array.from(root.querySelectorAll('h2'));
  var tier3h2 = h2s.find(function(h) { return h.textContent.trim().startsWith('Tier 3'); });
  if (!tier3h2) return;
  var block = document.createElement('div');
  block.className = 'tier3-block';
  var next = tier3h2.nextSibling;
  while (next) {
    var following = next.nextSibling;
    if (next.nodeType === Node.ELEMENT_NODE && next.tagName === 'H2') break;
    block.appendChild(next);
    next = following;
  }
  tier3h2.parentNode.insertBefore(block, tier3h2.nextSibling);
};
```

**改後**（合併為 helper；`tagTier3`/`tagTier4` 變成 1 行 wrapper）：

```js
ResourcesLoader._tagTierBlock = function(root, label, className) {
  var h2s = Array.from(root.querySelectorAll('h2'));
  var targetH2 = h2s.find(function(h) { return h.textContent.trim().startsWith(label); });
  if (!targetH2) return;
  var block = document.createElement('div');
  block.className = className;
  var next = targetH2.nextSibling;
  while (next) {
    var following = next.nextSibling;
    if (next.nodeType === Node.ELEMENT_NODE && next.tagName === 'H2') break;
    block.appendChild(next);
    next = following;
  }
  targetH2.parentNode.insertBefore(block, targetH2.nextSibling);
};

ResourcesLoader.tagTier3 = function(root) {
  ResourcesLoader._tagTierBlock(root, 'Tier 3', 'tier3-block');
};

ResourcesLoader.tagTier4 = function(root) {
  ResourcesLoader._tagTierBlock(root, 'Tier 4', 'tier4-block');
};
```

在 `renderCatalog` 的 `tagTier3(content)` 呼叫後加 `ResourcesLoader.tagTier4(content);`

淨增：`_tagTierBlock` 15 + `tagTier3` wrapper 3 + `tagTier4` wrapper 3 - 舊 `tagTier3` 15 + `tagTier4` 呼叫 1 = **+7 lines**。
284 + 7 = **291 lines**（遠低於 300）。

### `assets/style-resources.css` — `.tier4-block`

在 `.tier3-block` 樣式後加：
```css
/* ── Tier 4 Human-only Block ── */
.tier4-block {
  border-left: 4px solid var(--accent-danger, #DC2626);
  background: var(--bg-danger-tint, #FEF2F2);
  padding: var(--sp-4);
  border-radius: 0 var(--r-md) var(--r-md) 0;
  margin: var(--sp-4) 0;
}

#catalog-content .tier4-block blockquote {
  background: none;
  border: none;
  padding: 0;
  margin: 0 0 var(--sp-4) 0;
  font-size: var(--text-sm);
  color: var(--text);
}
```

---

## 驗收命令

```powershell
# RED（加測試，改 catalog/JS 前）
npx playwright test tests/e2e/tier4-block.spec.js --reporter=list
# 預期：6 tests FAIL

# GREEN（改完後）
npx playwright test tests/e2e/tier4-block.spec.js --reporter=list
# 預期：6 tests PASS

# flake check
npx playwright test tests/e2e/tier4-block.spec.js --repeat-each=3

# 全 suite 回歸（tier3 regression must stay green）
npx playwright test --reporter=list
# 預期：78 + 6 = 84 tests PASS
```

---

## 4-agent review prompts

### code-reviewer
```
Review step-02 changes on feat/v3-governance-core.
Files: resources-catalog.md (Tier 4 H3 content), assets/resources-loader.js (tagTierBlock refactor), assets/style-resources.css (.tier4-block CSS), tests/e2e/tier4-block.spec.js
Check:
(a) tagTierBlock correctly parameterized — both label and className pass correctly
(b) tagTier3 wrapper calls _tagTierBlock with 'Tier 3' and 'tier3-block' (v2 regression)
(c) renderCatalog calls both tagTier3 AND tagTier4 after refactor
(d) CSS specificity: #catalog-content .tier4-block blockquote beats #catalog-content blockquote (same pattern as tier3 fix in v2 step-05)
(e) Tier 4 content: each H3 has AI 可做/禁止 AI/負責人/升級條件 4 fields
(f) No TODO/FIXME
v3 extra: no state.json change → migration note NOT required
```

### test-runner
```
Run full suite + flake on feat/v3-governance-core after step-02.
npx playwright test --reporter=list  (expect 84/84)
npx playwright test tests/e2e/tier4-block.spec.js --repeat-each=3 (expect 18/18)
Also check tier3-warning.spec.js still all green (tier3 regression).
v3 extra: git grep "AI 自動化程度" == 0; git grep "Tier 1[^:]" == 0
```

### performance-investigator
```
Profile resources.html after step-02.
Measure: FCP < 1.5s; tagTierBlock function < 50ms; resources-loader.js < 300 lines.
Check renderCatalog now calls both tagTier3 AND tagTier4 — confirm both < 1ms (DOM walk O(N)).
```

### refactor-architect
```
Review resources-loader.js after step-02.
Check:
(a) Line count (expect ~291, must be < 300)
(b) _tagTierBlock is the single implementation; tagTier3/tagTier4 are thin wrappers (≤ 3 lines each)
(c) No function > 50 lines
(d) 6 concerns still separated
v3 extra: governance.md cross-refs not applicable at step-02
```

---

## Commit message

```
feat(step-02): tier 4 human-only block + tagTierBlock refactor (v3 governance priority #1)
```
