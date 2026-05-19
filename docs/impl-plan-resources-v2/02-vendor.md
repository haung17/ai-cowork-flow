# Step 02 — Vendor 外部依賴（提前執行）

**Priority 修復**：#5（CDN 脆弱 + 無 SRI + 無 noscript）

## 目標

1. `assets/vendor/marked.min.js` — pin v12.0.2，從 jsDelivr 下載放本地
2. `assets/vendor/fonts/` — Inter (400/500/600/700) + JetBrains Mono (400/500) woff2
3. `assets/style-fonts.css` — 本地 `@font-face`
4. `resources.html` / `dashboard.html` / `presentation.html` 移除 Google Fonts + jsDelivr CDN；改引本地
5. `resources.html` 補 `<noscript>` fallback
6. `assets/vendor/LICENSES.md` — 記錄授權

## 交付檔

- `assets/vendor/marked.min.js`（新建）
- `assets/vendor/fonts/inter-400.woff2` … `inter-700.woff2`（4 檔）
- `assets/vendor/fonts/jetbrains-mono-400.woff2`、`jetbrains-mono-500.woff2`（2 檔）
- `assets/style-fonts.css`（新建）
- `assets/vendor/LICENSES.md`（新建）
- `resources.html`（修改）
- `dashboard.html`（修改）
- `presentation.html`（修改）
- `tests/e2e/no-cdn.spec.js`（新建）
- `tests/e2e/noscript.spec.js`（新建）

## TDD — 紅測試

```js
// tests/e2e/no-cdn.spec.js
const { test, expect } = require('@playwright/test');

test('no-cdn: resources.html renders with CDN blocked', async ({ page, context }) => {
  await page.route('**/cdn.jsdelivr.net/**', route => route.abort());
  await page.route('**/fonts.googleapis.com/**', route => route.abort());
  await page.route('**/fonts.gstatic.com/**', route => route.abort());
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content h3').count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('no-cdn: dashboard.html renders with CDN blocked', async ({ page }) => {
  await page.route('**/fonts.googleapis.com/**', route => route.abort());
  await page.route('**/fonts.gstatic.com/**', route => route.abort());
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list', { timeout: 8000 });
  const nav = await page.locator('#nav-list').isVisible();
  expect(nav).toBe(true);
});

test('no-cdn: no external font or CDN requests made', async ({ page }) => {
  const externalRequests = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('googleapis') || url.includes('gstatic') || url.includes('jsdelivr')) {
      externalRequests.push(url);
    }
  });
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  expect(externalRequests.length).toBe(0);
});
```

```js
// tests/e2e/noscript.spec.js
const { test, expect } = require('@playwright/test');

test('noscript: banner visible when JS disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/resources.html');
  const banner = page.locator('.noscript-banner');
  await expect(banner).toBeVisible();
  const text = await banner.textContent();
  expect(text).toContain('resources-catalog.md');
  await context.close();
});
```

## 實作要點

### 下載 marked v12.0.2

```powershell
# 確認版本
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js" -OutFile "assets/vendor/marked.min.js"
```

### 下載字型（使用 google-webfonts-helper 或 fontsource）

**方法：直接從 fontsource unpkg 下載：**

```powershell
$fonts = @(
  @{ url="https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2"; out="inter-400.woff2" },
  @{ url="https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.woff2"; out="inter-500.woff2" },
  @{ url="https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.woff2"; out="inter-600.woff2" },
  @{ url="https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2"; out="inter-700.woff2" },
  @{ url="https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff2"; out="jetbrains-mono-400.woff2" },
  @{ url="https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-500-normal.woff2"; out="jetbrains-mono-500.woff2" }
)
New-Item -ItemType Directory -Force "assets/vendor/fonts"
foreach ($f in $fonts) {
  Invoke-WebRequest -Uri $f.url -OutFile "assets/vendor/fonts/$($f.out)"
}
```

### assets/style-fonts.css

```css
@font-face {
  font-family: 'Inter';
  src: url('vendor/fonts/inter-400.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('vendor/fonts/inter-500.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('vendor/fonts/inter-600.woff2') format('woff2');
  font-weight: 600; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('vendor/fonts/inter-700.woff2') format('woff2');
  font-weight: 700; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('vendor/fonts/jetbrains-mono-400.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('vendor/fonts/jetbrains-mono-500.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
```

### resources.html 改動

刪除：
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

新增（在 `<link rel="stylesheet" href="assets/style-base.css">` 前）：
```html
<link rel="stylesheet" href="assets/style-fonts.css">
```

新增（`assets/vendor/marked.min.js`）：
```html
<script src="assets/vendor/marked.min.js"></script>
```

`<noscript>` 在 `</body>` 前：
```html
<noscript>
  <div class="noscript-banner" style="padding:16px;background:#FFFBEB;border:1px solid #F59E0B;font-family:sans-serif;">
    JS 已停用。請直接閱讀 <a href="resources-catalog.md">resources-catalog.md</a> 原始檔，或以支援 JavaScript 的瀏覽器開啟。
  </div>
</noscript>
```

### dashboard.html + presentation.html 改動

同樣：刪 Google Fonts `<link>` + `preconnect`；加 `<link rel="stylesheet" href="assets/style-fonts.css">`。

### assets/vendor/LICENSES.md

```markdown
# Vendor Licenses

## marked v12.0.2
- License: MIT
- Source: https://github.com/markedjs/marked
- Downloaded: 2026-05-19

## Inter (SIL OFL 1.1)
- License: SIL Open Font License 1.1
- Source: https://github.com/rsms/inter
- Downloaded: 2026-05-19

## JetBrains Mono (SIL OFL 1.1)
- License: SIL Open Font License 1.1
- Source: https://github.com/JetBrains/JetBrainsMono
- Downloaded: 2026-05-19
```

## Verify 命令

```powershell
# CDN 測試
npx playwright test tests/e2e/no-cdn.spec.js tests/e2e/noscript.spec.js --reporter=list

# flake
npx playwright test tests/e2e/no-cdn.spec.js tests/e2e/noscript.spec.js --repeat-each=3

# 確認無 CDN 引用
git grep "fonts.googleapis" -- "*.html"       # 應無輸出
git grep "cdn.jsdelivr" -- "*.html" "*.js"    # 應無輸出
git grep "fonts.gstatic" -- "*.html"          # 應無輸出

# 字型大小（< 400KB 總計）
Get-ChildItem assets/vendor/fonts/*.woff2 | Measure-Object -Property Length -Sum | Select-Object Sum
```

## 4 Agent Review Prompts

**code-reviewer：**
```
Step 02 vendor review

交付：assets/vendor/marked.min.js、assets/vendor/fonts/*.woff2（6 檔）、assets/style-fonts.css、LICENSES.md；3 個 HTML 改動；2 個新測試
git diff: [step-02 commit diff]

重點：
1. git grep "fonts.googleapis" 和 "cdn.jsdelivr" 是否真的 = 0？
2. LICENSES.md 是否覆蓋 marked + Inter + JetBrains Mono 3 個授權？
3. style-fonts.css 的 url() 路徑是相對 CSS 檔案的，但 CSS 放在 assets/，字型在 assets/vendor/fonts/ — 路徑 `vendor/fonts/inter-400.woff2` 是否正確？
4. noscript banner 的 inline style 是否可接受（style-base.css 還沒套用時用 inline 做 fallback 是正確做法）？
5. commit message 是否引用 priority #5？
```

**test-runner：**
```
Step 02 test runner

測試：tests/e2e/no-cdn.spec.js（3），tests/e2e/noscript.spec.js（1）
指令：npx playwright test no-cdn noscript --repeat-each=3

1. no-cdn test-3（監聽 request event）：是否有 race condition？（在 page.route 設定後才 goto，監聽是否在 goto 前設好？）
2. noscript test：newContext({ javaScriptEnabled: false }) 後頁面是否真的停用 JS？（Playwright 支援，但確認是否需要等待策略）
3. 既有 36 個測試是否仍全部綠（vendor 後路徑改動是否破壞既有 CI）？
```

**performance-investigator：**
```
Step 02 performance

1. 字型 woff2 總計大小（目標 < 400KB）？實際是多少？
2. 6 個 @font-face 是否設 font-display: swap？沒有的話首次載入會有 FOUT — 確認
3. 字型全部 vendor 後 FCP 是否比 CDN 版快（local server 下本地 woff2 應更快）？
4. marked.min.js v12 大小 vs 未 pin 版是否差異大？
```

**refactor-architect：**
```
Step 02 refactor

1. assets/ 目錄引入 vendor/ 子目錄 — 是否符合現有命名慣例？
2. style-fonts.css 是否只做 @font-face，不做其他樣式（職責單一）？
3. 3 個 HTML 同樣改動（刪 CDN + 加 style-fonts.css）—  是否有抽象化空間？（此處用 vendor 純靜態，重複 OK，YAGNI 不抽）
```

## Strict Pass Criteria

- `npx playwright test tests/e2e/no-cdn.spec.js tests/e2e/noscript.spec.js --repeat-each=3` → 12/12 綠
- `git grep "fonts.googleapis" -- "*.html"` → 0
- `git grep "cdn.jsdelivr" -- "*.html" "*.js"` → 0
- `(Get-ChildItem assets/vendor/fonts/*.woff2 | Measure-Object Length -Sum).Sum` → < 409600（400KB）
- 既有 36 個測試仍全綠
- 4 agents 全 PASS
