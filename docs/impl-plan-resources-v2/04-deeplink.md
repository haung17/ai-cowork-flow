# Step 04 — Deep-link Infrastructure

**Priority 修復**：#3（preDev:N 死字串 → 可跳轉 anchor）

## 目標

1. `flowcharts.js` 每張 `.fc-node` div 加 `id="${chartId}-${n.id}"`（如 `preDev-2`）
2. `interactions.js` 新增 `initHashScroll()` — 讀 `location.hash`，scroll 到對應章節 + 節點，節點 `.flash` 3 秒
3. `style-dash.css` 加 `.fc-node.flash` 脈衝動畫
4. `resources-loader.js` 新增 `rewriteNodeRefs(root)` — 把渲染後 DOM 中「對應節點」字串的 `preDev:N` / `midDev:N` / `postDev:N` 轉為可點擊 `<a>`

## 交付檔

- `assets/flowcharts.js`（修改：加 card.id）
- `assets/interactions.js`（修改：加 initHashScroll）
- `assets/style-dash.css`（修改：加 .flash 動畫）
- `assets/resources-loader.js`（修改：加 rewriteNodeRefs）
- `tests/e2e/deep-link.spec.js`（新建）

## TDD — 紅測試

```js
// tests/e2e/deep-link.spec.js
const { test, expect } = require('@playwright/test');

test('deep-link: flowchart nodes have id attributes', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('.fc-node', { timeout: 8000 });
  // preDev has 11 nodes → ids preDev-1 to preDev-11
  const preDev = await page.locator('[id^="preDev-"]').count();
  expect(preDev).toBe(11);
  const midDev = await page.locator('[id^="midDev-"]').count();
  expect(midDev).toBe(10);
  const postDev = await page.locator('[id^="postDev-"]').count();
  expect(postDev).toBe(12);
});

test('deep-link: hash navigation scrolls to node and adds flash', async ({ page }) => {
  await page.goto('/dashboard.html#preDev-2');
  await page.waitForSelector('#preDev-2', { timeout: 10000 });
  // flash should be applied shortly after load
  await page.waitForTimeout(800);
  const hasFlash = await page.locator('#preDev-2').evaluate(el => el.classList.contains('flash'));
  expect(hasFlash).toBe(true);
});

test('deep-link: flash class removed after 3 seconds', async ({ page }) => {
  await page.goto('/dashboard.html#preDev-2');
  await page.waitForSelector('#preDev-2', { timeout: 10000 });
  await page.waitForTimeout(3500); // wait past the 3s timeout
  const hasFlash = await page.locator('#preDev-2').evaluate(el => el.classList.contains('flash'));
  expect(hasFlash).toBe(false);
});

test('deep-link: resources page has clickable preDev links', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  // At least one anchor linking to dashboard with preDev hash
  const links = await page.locator('a[href*="dashboard.html#preDev-"]').count();
  expect(links).toBeGreaterThan(0);
});

test('deep-link: clicking node link opens dashboard in new tab', async ({ page, context }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const firstLink = page.locator('a[href*="dashboard.html#preDev-"]').first();
  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    firstLink.click()
  ]);
  await newPage.waitForLoadState('domcontentloaded');
  expect(newPage.url()).toContain('dashboard.html#preDev-');
  await newPage.close();
});

test('deep-link: no preDev:N raw text remains in catalog-content', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  // rewriteNodeRefs should have converted all raw "preDev:N" strings to <a> links
  // so text nodes should not contain raw "preDev:2" etc
  const rawText = await page.evaluate(() => {
    const content = document.getElementById('catalog-content');
    return content ? content.innerText : '';
  });
  // Allow "preDev" in link href/title but not as bare "preDev:2" text outside <a>
  // Check: after rewrite, no bare ":" between preDev and number in text
  expect(rawText).not.toMatch(/\bpreDev:\d+\b/);
  expect(rawText).not.toMatch(/\bmidDev:\d+\b/);
  expect(rawText).not.toMatch(/\bpostDev:\d+\b/);
});
```

## 實作要點

### assets/flowcharts.js — card.id

在 line 80（`const card = document.createElement('div');` 之後）加：

```js
card.id = chartId + '-' + n.id;   // e.g. "preDev-2", "main-A"
```

注意：`chartId` 是 `FlowCharts.render(chartId, containerEl)` 的第一個參數，值為 `preDev` / `midDev` / `postDev` / `main`。節點 id 是 `n.id`（`'2'`、`'A'` 等字串）。

完整 id 範例：`preDev-2`、`midDev-7`、`postDev-12`、`main-A`。

### assets/interactions.js — initHashScroll

在 `DashboardInteractions.init` 末尾呼叫：

```js
DashboardInteractions.initHashScroll = function() {
  var hash = location.hash;
  var m = hash.match(/^#(preDev|midDev|postDev|main)-([A-Z0-9]+)$/);
  if (!m) return;
  var chapterId = m[1];
  var nodeId = m[1] + '-' + m[2];
  var chapterMap = { preDev: 'pre-dev', midDev: 'mid-dev', postDev: 'post-dev', main: 'flowcharts' };
  var sectionId = chapterMap[chapterId];
  requestAnimationFrame(function() {
    var section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(function() {
      var node = document.getElementById(nodeId);
      if (!node) return;
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node.classList.add('flash');
      setTimeout(function() { node.classList.remove('flash'); }, 3000);
    }, 600);
  });
};
```

在 `DashboardInteractions.init` 的最末行加：

```js
DashboardInteractions.initHashScroll();
```

### assets/style-dash.css — .fc-node.flash

```css
.fc-node.flash {
  outline: 2px solid var(--accent-warn, #FB923C);
  box-shadow: 0 0 0 6px rgba(251, 146, 60, 0.25);
  animation: fc-flash-pulse 1s ease-in-out 3;
}
@keyframes fc-flash-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
}
```

### assets/resources-loader.js — rewriteNodeRefs

```js
ResourcesLoader.rewriteNodeRefs = function(root) {
  // Match preDev:N, midDev:N, postDev:N (N = digits)
  // Also match Gate preDev:9 pattern
  var pattern = /\b(preDev|midDev|postDev):(\d+)\b/g;
  
  function walkText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.textContent;
      if (!pattern.test(text)) return;
      pattern.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0;
      var m;
      while ((m = pattern.exec(text)) !== null) {
        if (m.index > last) {
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        }
        var a = document.createElement('a');
        a.href = 'dashboard.html#' + m[1] + '-' + m[2];
        a.target = '_blank';
        a.textContent = m[0];
        a.title = '跳到 dashboard ' + m[0];
        frag.appendChild(a);
        last = m.index + m[0].length;
      }
      if (last < text.length) {
        frag.appendChild(document.createTextNode(text.slice(last)));
      }
      node.parentNode.replaceChild(frag, node);
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.tagName !== 'A' &&
      node.tagName !== 'CODE' &&
      node.tagName !== 'PRE'
    ) {
      Array.from(node.childNodes).forEach(walkText);
    }
  }
  walkText(root);
};
```

呼叫時機：在 `renderCatalog` 裡 `marked.parse` 注入 DOM 後，`buildNav` 之前：

```js
ResourcesLoader.rewriteNodeRefs(content);
```

**注意邊界情況**：
- `Gate preDev:9` → `Gate ` + `<a href="...#preDev-9">preDev:9</a>` ✓
- `preDev:10 之後` → `<a>preDev:10</a>` + ` 之後` ✓  
- Code block 內（`<pre>/<code>`）不轉換，因為 prompt 範例中可能有類似字串
- 已是 `<a>` 內不再處理

## Verify 命令

```powershell
npx playwright test tests/e2e/deep-link.spec.js --reporter=list
# 預期 6/6 綠

# flake（特別是 flash timing test）
npx playwright test tests/e2e/deep-link.spec.js --repeat-each=3

# 確認 node id 屬性
# 開 browser console: document.querySelectorAll('[id^="preDev-"]').length → 11
```

## 4 Agent Review Prompts

**code-reviewer：**
```
Step 04 deep-link review

交付：flowcharts.js（card.id），interactions.js（initHashScroll），style-dash.css（.flash），resources-loader.js（rewriteNodeRefs）
git diff: [step-04 commit diff]
測試結果: 6/6 綠

重點：
1. card.id = chartId + '-' + n.id — n.id 是字串型（'2'）還是數字？chartId 來源正確？最終 id 格式 `preDev-2` 正確？
2. initHashScroll regex `^#(preDev|midDev|postDev|main)-([A-Z0-9]+)$`：main 的節點 id 是 A-Z 字母，數字節點是 0-9 — `[A-Z0-9]+` 是否正確覆蓋（case sensitive）？
3. rewriteNodeRefs 使用 DOM TreeWalker 還是遞迴 childNodes — 確認在 text node replaceChild 後不會 infinite loop（用 Array.from 前複製 childNodes list）
4. `<a>` 和 `<code>/<pre>` 的跳過邏輯是否正確？
5. flash 動畫：`animation: fc-flash-pulse 1s ease-in-out 3` — 跑 3 次 = 3 秒 total，與 setTimeout 3000ms 一致 ✓
6. commit message 是否引用 priority #3？
```

**test-runner：**
```
Step 04 test runner

測試：tests/e2e/deep-link.spec.js（6 tests）

1. test-2/test-3（flash timing）：waitForTimeout(800) 和 waitForTimeout(3500) 在 CI 慢環境可能 flaky — 是否需要 pollForever 或 expect.poll？
2. test-6（no raw preDev:N text）：innerText 讀取是否在 rewriteNodeRefs 完成後（waitForSelector '#catalog-content h3' 是否足夠等待 rewrite 完）？
3. 既有 40+ 測試是否仍全綠（特別是 flowcharts 相關 modal click test）？
```

**performance-investigator：**
```
Step 04 performance

rewriteNodeRefs 走遍整個 catalog DOM 的 text nodes。

1. 用 performance.now() 量測 rewriteNodeRefs 在 catalog 完整 DOM（~750 行 md 解析後）的執行時間 — 是否 < 50ms？
2. regex 每次 exec 有 lastIndex 管理，是否可能在某個 text node 上進入 infinite loop？（確認 lastIndex reset）
3. 新增 6 個 E2E test 是否讓整體測試時間增加過多？
```

**refactor-architect：**
```
Step 04 refactor

1. rewriteNodeRefs 函式本身是否 < 50 行？
2. 與 tagTier3（Phase 5）都是「遍歷 DOM 後處理」— 是否應有共用的 DOM walker utility？還是各自獨立（YAGNI）？
3. initHashScroll 在 interactions.js 的定位：它是 dashboard 專屬邏輯，放在 DashboardInteractions 物件上是否正確（而非 flowcharts.js）？
```

## Strict Pass Criteria

- `npx playwright test tests/e2e/deep-link.spec.js --repeat-each=3` → 18/18 綠
- `document.querySelectorAll('[id^="preDev-"]').length === 11` (via browser console on dashboard)
- `document.querySelectorAll('[id^="midDev-"]').length === 10`
- `document.querySelectorAll('[id^="postDev-"]').length === 12`
- 既有測試仍全綠
- 4 agents 全 PASS
