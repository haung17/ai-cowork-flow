# Step 05 — Tier 3 Warning UI

**Priority 修復**：#4（Tier 3 警告太弱）

## 目標

1. `resources-catalog.md` Tier 3 區塊改寫：強化警告文字 + 每個選型前加 `⚠`
2. `resources-loader.js` 加 `tagTier3(root)` — H2「Tier 3」後的所有內容包進 `.tier3-block`
3. `assets/style-resources.css` 加 Tier 3 block 樣式（左橘 border + 淺黃底）+ CSS variable `--accent-warn`

## 交付檔

- `resources-catalog.md`（修改：Tier 3 section）
- `assets/resources-loader.js`（修改：tagTier3）
- `assets/style-resources.css`（修改：.tier3-block + 補 --accent-warn）
- `assets/style-base.css`（修改：加 --accent-warn CSS variable）
- `tests/e2e/tier3-warning.spec.js`（新建）

## TDD — 紅測試

```js
// tests/e2e/tier3-warning.spec.js
const { test, expect } = require('@playwright/test');

test('tier3-warning: Tier 3 section has .tier3-block wrapper', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const block = page.locator('.tier3-block');
  await expect(block).toBeVisible();
});

test('tier3-warning: tier3-block contains warning text about not recommended', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier3-block', { timeout: 8000 });
  const text = await page.locator('.tier3-block').textContent();
  expect(text).toContain('不建議優先實作');
});

test('tier3-warning: tier3-block contains warning symbol', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier3-block', { timeout: 8000 });
  const text = await page.locator('.tier3-block').textContent();
  expect(text).toContain('⚠');
});

test('tier3-warning: non-Tier-3 sections do NOT have tier3-block class', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  // Tier 1/2 sections should not be wrapped in .tier3-block
  // Check by verifying that "會議記錄" section is outside any .tier3-block
  const meetingInTier3 = await page.evaluate(() => {
    const h3s = document.querySelectorAll('#catalog-content h3');
    for (const h of h3s) {
      if (h.textContent.includes('會議記錄')) {
        return h.closest('.tier3-block') !== null;
      }
    }
    return false;
  });
  expect(meetingInTier3).toBe(false);
});

test('tier3-warning: tier3-block has correct border color (CSS)', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.tier3-block', { timeout: 8000 });
  const borderColor = await page.locator('.tier3-block').evaluate(el => {
    return window.getComputedStyle(el).borderLeftColor;
  });
  // Should be orange (#FB923C = rgb(251, 146, 60))
  expect(borderColor).toMatch(/rgb\(251,\s*146,\s*60\)|#[Ff][Bb]923[Cc]/);
});
```

## 實作要點

### resources-catalog.md Tier 3 改寫

```markdown
## Tier 3 系統整合總覽

> ⚠ **本區域所列項目皆不建議優先實作**
>
> - 僅作為未來可能整合的路徑紀錄，不代表選型決策
> - 每個方案都有額外帳號 / OAuth / Bot / n8n 設定與維護成本
> - MVP 階段請維持 Tier 1 / Tier 2 的 Markdown / CSV / ICS 手動產出
> - 列入此區不等於已選型；正式採用前需獨立 RFC + 成本評估

### ASANA 任務管理 — 路徑選項

| 選項 | 說明 | 前置條件 | 維護成本 |
|------|------|----------|----------|
| ⚠ A. 手動輸入 | 零設定，人工填入 | 無 | 低（人力成本高） |
| ⚠ B. CSV 匯入 | AI 產 CSV，一次批次匯入 | ASANA 帳號 | 低 |
| ⚠ C. MCP 直連 | Claude MCP 直接呼叫 ASANA API | ASANA 付費版 + MCP 設定 | 中 |
| ⚠ D. REST API | 程式碼呼叫 ASANA REST API | OAuth App + token 管理 | 高 |

### 里程碑提醒 — 路徑選項

| 選項 | 說明 | 前置條件 | 維護成本 |
|------|------|----------|----------|
| ⚠ A. ASANA 內建 | 依賴 ASANA 任務已建立 | ASANA 帳號 | 低 |
| ⚠ B. ICS 匯入 | AI 產 .ics，人工一次匯入 Google Calendar | Google 帳號 | 低 |
| ⚠ C. Slack/Line Bot | 自動推送提醒 | Bot 設定 + 工作區 | 中 |
| ⚠ D. n8n 自動化 | 最強自動化，最高門檻 | n8n 環境 + 所有系統串接 | 高 |
```

### assets/style-base.css — 加 CSS variable

在 `:root` block 補：
```css
--accent-warn: #FB923C;
--bg-warn-tint: #FFFBEB;
```

在 `[data-theme="dark"]` block 補：
```css
--bg-warn-tint: #292524;
```

### assets/style-resources.css — .tier3-block

```css
.tier3-block {
  border-left: 4px solid var(--accent-warn);
  background: var(--bg-warn-tint);
  padding: var(--sp-4, 16px);
  border-radius: 0 var(--r-sm, 6px) var(--r-sm, 6px) 0;
  margin-top: var(--sp-4, 16px);
}
.tier3-block > h2 {
  margin-top: 0;
}
.tier3-block blockquote {
  background: transparent;
  border-left: none;
  margin-left: 0;
  padding-left: 0;
}
.tier3-block blockquote strong:first-child {
  color: var(--accent-warn);
}
```

### assets/resources-loader.js — tagTier3

```js
ResourcesLoader.tagTier3 = function(root) {
  var h2s = Array.from(root.querySelectorAll('h2'));
  var tier3H2 = h2s.find(function(h) {
    return h.textContent.trim().indexOf('Tier 3') !== -1;
  });
  if (!tier3H2) return;

  var wrapper = document.createElement('div');
  wrapper.className = 'tier3-block';

  // Collect: h2 itself + all siblings until next h2 or end
  var nodes = [tier3H2];
  var sib = tier3H2.nextSibling;
  while (sib) {
    if (sib.nodeType === Node.ELEMENT_NODE && sib.tagName === 'H2') break;
    nodes.push(sib);
    sib = sib.nextSibling;
  }

  // Insert wrapper before the h2, move all nodes into wrapper
  tier3H2.parentNode.insertBefore(wrapper, tier3H2);
  nodes.forEach(function(n) { wrapper.appendChild(n); });
};
```

呼叫時機：`renderCatalog` 中，`rewriteNodeRefs(content)` 後，`buildNav()` 前：

```js
ResourcesLoader.tagTier3(content);
```

## Verify 命令

```powershell
npx playwright test tests/e2e/tier3-warning.spec.js --reporter=list
# 預期 5/5 綠

# dark mode 下 bg-warn-tint 是否切換
# 開 browser → toggle dark → .tier3-block background 應為 #292524
```

## 4 Agent Review Prompts

**code-reviewer：**
```
Step 05 Tier 3 warning review

交付：resources-catalog.md Tier 3 改寫，style-base.css（新 variable），style-resources.css（.tier3-block），resources-loader.js（tagTier3）

重點：
1. tagTier3 的節點收集邏輯：收集「h2 Tier 3」到「下一個 h2 或 DOM 結尾」之間的所有 sibling — 是否包含 h2 本身（正確）？
2. `while (sib)` loop 中 `sib = sib.nextSibling`：nodes.push 後再走 next — 是否確保在 wrapper.appendChild(n) 前 next 已被快取（nodes 陣列收集後再批次 append，正確）？
3. dark mode：`--bg-warn-tint: #292524` 是否夠深讓左橘 border 可見（WCAG contrast）？
4. commit message 是否引用 priority #4？
```

**test-runner：**
```
Step 05 test runner

測試：tests/e2e/tier3-warning.spec.js（5 tests）

1. test-5（border color）：getComputedStyle.borderLeftColor 返回值在不同瀏覽器可能格式不同（rgb vs hex）— 目前用 regex 匹配兩種格式，是否足夠？
2. test-4（meetingInTier3）：closest('.tier3-block') — 是否正確測出祖先？在 Playwright 中 evaluate 回傳 boolean 是否準確？
3. 既有測試全綠？
```

**performance-investigator：**
```
Step 05 performance

tagTier3 走 DOM 一次（O(n) siblings）— catalog 在 Tier 3 之後有約 150 行內容。
1. 執行時間 < 50ms？
2. wrapper.appendChild 批次移動 nodes — 是否有多次 reflow（每次 appendChild 觸發）？可否改用 DocumentFragment？
```

**refactor-architect：**
```
Step 05 refactor

1. tagTier3 < 50 行？
2. tagTier3 + rewriteNodeRefs 都是「後處理 DOM」邏輯 — 若以後還有類似需求（e.g. tagTier2Warning），應否抽出 genericWrapper(root, h2Text, className) 通用函式？（目前只有 1 個 Tier 3，YAGNI OK，但 refactor-architect 要指出這個擴展點）
```

## Strict Pass Criteria

- `npx playwright test tests/e2e/tier3-warning.spec.js --repeat-each=3` → 15/15 綠
- `.tier3-block` 存在且在「會議記錄」H3 的 `.closest('.tier3-block')` = null
- dark mode toggle 後 `.tier3-block` background 顏色切換
- 4 agents 全 PASS
