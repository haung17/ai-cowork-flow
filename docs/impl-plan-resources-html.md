# resources.html 實作計劃

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新建 `resources.html` — 從 `resources-catalog.md` 動態 fetch + marked.js 渲染的靜態頁面，並在 `dashboard.html` 加兩個入口連結。

**Architecture:** 純靜態站，無 build step。fetch markdown → marked.parse → inject DOM。sidebar nav 從渲染後的 h2 自動建立。theme 與 dashboard 共用 `localStorage key: cowork-theme`。

**Tech Stack:** HTML/CSS/JS（無框架），marked.js（CDN），Playwright（TDD + E2E），Python HTTP server（測試用 webServer）

---

## 每個 Task 完成後的 4-Agent Review 流程

每個 Task commit 後，立刻並行跑以下 4 個 agents（prompt 在每個 Task 末尾）。

```
並行：code-reviewer | test-runner | performance-investigator | refactor-architect
      ↓
收集意見 → 修補 → 補充 commit → 進入下一 Task
```

---

## 檔案結構總覽

```
流程圖/
├── resources.html                        ← 新建
├── resources-catalog.md                  ← 既有，唯一資料源，不改
├── dashboard.html                        ← 修改（2 處入口）
├── assets/
│   ├── style-base.css                    ← 既有，不改
│   ├── style-dash.css                    ← 既有，不改
│   ├── data.js                           ← 修改（加 resources chapter）
│   ├── interactions.js                   ← 修改（buildNav + search 支援 external）
│   ├── style-resources.css               ← 新建
│   └── resources-loader.js               ← 新建
├── tests/
│   ├── e2e/
│   │   ├── resources-page.spec.js        ← 新建
│   │   ├── dashboard-link.spec.js        ← 新建
│   │   └── full-journey.spec.js          ← 新建
│   └── unit/
│       └── catalog-parse.spec.js         ← 新建（Step 3 用）
├── playwright.config.js                  ← 新建
├── package.json                          ← 新建
└── .gitignore                            ← 修改
```

---

## Task 1: Tooling & Skeleton

**目標：** 裝 Playwright、建 `resources.html` 空殼、跑第一個測試（紅→綠）。

**Files:**
- Create: `package.json`
- Create: `playwright.config.js`
- Create: `resources.html`
- Create: `tests/e2e/resources-page.spec.js`
- Modify: `.gitignore`

---

- [ ] **Step 1.1: 寫測試（RED）**

建立 `tests/e2e/resources-page.spec.js`：

```js
// tests/e2e/resources-page.spec.js
const { test, expect } = require('@playwright/test');

test('skeleton: title contains 資源對照', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page).toHaveTitle(/資源對照/);
});

test('skeleton: has sidebar element', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page.locator('#sidebar')).toBeVisible();
});

test('skeleton: has main content area', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page.locator('#main-content')).toBeVisible();
});

test('skeleton: has catalog-content div', async ({ page }) => {
  await page.goto('/resources.html');
  await expect(page.locator('#catalog-content')).toBeVisible();
});
```

- [ ] **Step 1.2: 裝 npm 套件**

建立 `package.json`（直接寫檔，不 `npm init`）：

```json
{
  "name": "ai-cowork-flow",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test",
    "test:e2e": "playwright test tests/e2e/full-journey.spec.js",
    "test:headed": "playwright test --headed",
    "serve": "python -m http.server 8080"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0"
  }
}
```

執行：

```powershell
cd "C:\Users\haung\OneDrive\Desktop\流程圖"
npm install
npx playwright install chromium
```

- [ ] **Step 1.3: 建 playwright.config.js**

```js
// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  use: {
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'python -m http.server 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});
```

- [ ] **Step 1.4: 跑測試確認 RED**

```powershell
npx playwright test --grep "skeleton"
```

預期：FAIL — `resources.html` 不存在，404 或 page title 不符。

- [ ] **Step 1.5: 建 resources.html 空殼（GREEN）**

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>接案流程資源對照表</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/style-base.css">
  <link rel="stylesheet" href="assets/style-resources.css">
</head>
<body>
  <!-- Search overlay -->
  <div id="search-overlay" class="search-overlay hidden">
    <div class="search-box">
      <input id="search-input" type="text" placeholder="搜尋資源..." autocomplete="off">
      <div id="search-results" class="search-results"></div>
    </div>
  </div>

  <div class="app-layout">
    <nav id="sidebar" class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-logo">資源對照</span>
        <div style="display:flex;gap:4px;align-items:center;">
          <button id="theme-toggle" class="theme-toggle" aria-label="切換為深色主題">Dark</button>
          <button id="search-btn" class="search-trigger" title="Ctrl+K" aria-label="搜尋">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <a href="dashboard.html" class="back-link" title="返回 Dashboard" aria-label="返回 Dashboard">←</a>
        </div>
      </div>
      <ul class="nav-list" id="nav-list">
        <!-- JS 動態填入 -->
      </ul>
    </nav>

    <main id="main-content" class="main-content">
      <div id="catalog-content" class="content-wrapper"></div>
      <div id="catalog-error" class="catalog-error hidden" role="alert">
        <p>無法載入 <code>resources-catalog.md</code>。請用 HTTP server 開啟，不能直接雙擊 HTML 檔案。</p>
        <pre>python -m http.server 8080</pre>
        <p>然後開啟 <code>http://localhost:8080/resources.html</code></p>
      </div>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="assets/resources-loader.js"></script>
  <script>
    (function() {
      const saved = localStorage.getItem('cowork-theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
      const btn = document.getElementById('theme-toggle');
      btn.textContent = saved === 'dark' ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', saved === 'dark' ? '切換為淺色主題' : '切換為深色主題');
    })();

    document.getElementById('theme-toggle').addEventListener('click', function() {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cowork-theme', next);
      this.textContent = next === 'dark' ? 'Light' : 'Dark';
      this.setAttribute('aria-label', next === 'dark' ? '切換為淺色主題' : '切換為深色主題');
    });
  </script>
</body>
</html>
```

建立佔位 `assets/style-resources.css`（暫只一行，Task 2 補完整）：

```css
/* assets/style-resources.css — placeholder, Task 2 fills this */
```

建立佔位 `assets/resources-loader.js`（暫空，Task 3 補完整）：

```js
// assets/resources-loader.js — placeholder, Task 3 fills this
window.ResourcesLoader = {};
ResourcesLoader.init = function() {};
```

- [ ] **Step 1.6: 更新 .gitignore**

在 `.gitignore` 追加：

```
node_modules/
playwright-report/
test-results/
```

- [ ] **Step 1.7: 跑測試確認 GREEN**

```powershell
npx playwright test --grep "skeleton"
```

預期：4 tests PASS。

- [ ] **Step 1.8: Commit**

```bash
git add resources.html assets/style-resources.css assets/resources-loader.js package.json playwright.config.js tests/ .gitignore
git commit -m "test(task1): add skeleton tests + tooling (RED→GREEN)"
```

- [ ] **Step 1.9: 4-Agent Review**（並行）

**code-reviewer prompt:**
```
Review Task 1 of docs/impl-plan-resources-html.md.

Files added/changed: resources.html, assets/style-resources.css (placeholder),
assets/resources-loader.js (placeholder), package.json, playwright.config.js,
tests/e2e/resources-page.spec.js, .gitignore

Check:
1. resources.html HTML structure matches plan (sidebar #sidebar, main #main-content,
   #catalog-content, #catalog-error with .hidden, CDN script tag for marked.js)
2. package.json devDependencies only has @playwright/test, no prod deps
3. playwright.config.js uses Python HTTP server — correct command and timeout?
4. .gitignore: did node_modules/, playwright-report/, test-results/ get added?
5. No inline event handlers except the theme init IIFE (which is idiomatic)
6. aria-label on theme-toggle and search-btn buttons?

Report critical issues with file:line. Mark nice-to-haves separately.
```

**test-runner prompt:**
```
Run Task 1 tests and verify RED→GREEN cycle.

Command: npx playwright test --grep "skeleton" --reporter=list

Check:
1. All 4 skeleton tests pass?
2. Were there 2 separate commits: first with test (RED), second with implementation (GREEN)?
3. Any test asserting things that would pass even without the correct HTML
   (e.g., toBeVisible on a missing element that Playwright treats as hidden not missing)?

Report: pass/fail per test, suspect patterns.
```

**performance-investigator prompt:**
```
Analyze Task 1 for performance baseline.

Files: resources.html, playwright.config.js

Check:
1. CDN marked.min.js is render-blocking — is it loaded at bottom of body? (It is, correct)
2. Google Fonts is in <head> — is preconnect present to reduce TTFB? (It is, correct)
3. No images or large assets in skeleton — confirmed?

Report any issues. This task should be trivially clean. Flag if not.
```

**refactor-architect prompt:**
```
Review Task 1 structure.

Files: resources.html, assets/resources-loader.js (placeholder), assets/style-resources.css (placeholder)

Check:
1. resources.html: is the inline <script> block only doing theme init + one event listener?
   (OK per plan — ResourcesLoader.init() is delegated to resources-loader.js)
2. resources-loader.js placeholder: exports window.ResourcesLoader with no-op init — clean?
3. Any concern about future growth? (Note: resources-loader.js will grow to ~120-150 lines in Task 3-5)

Report recommendations for Task 3-5 to keep resources-loader.js focused.
```

---

## Task 2: Sidebar + Theme Toggle

**目標：** `style-resources.css` 完整版，sidebar layout、nav、theme、dark mode 全部到位。

**Files:**
- Modify: `assets/style-resources.css`（完整版）
- Modify: `tests/e2e/resources-page.spec.js`（新增 theme tests）

---

- [ ] **Step 2.1: 寫測試（RED）**

在 `tests/e2e/resources-page.spec.js` 追加：

```js
test('theme: default is light', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.removeItem('cowork-theme'));
  await page.reload();
  const theme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('light');
});

test('theme: clicking toggle switches to dark', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.removeItem('cowork-theme'));
  await page.reload();
  await page.click('#theme-toggle');
  const theme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('dark');
});

test('theme: localStorage key is cowork-theme', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.removeItem('cowork-theme'));
  await page.reload();
  await page.click('#theme-toggle');
  const stored = await page.evaluate(() => localStorage.getItem('cowork-theme'));
  expect(stored).toBe('dark');
});

test('theme: page respects stored dark theme on reload', async ({ page }) => {
  await page.goto('/resources.html');
  await page.evaluate(() => localStorage.setItem('cowork-theme', 'dark'));
  await page.reload();
  const theme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('dark');
});

test('theme: sidebar is visible on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/resources.html');
  await expect(page.locator('#sidebar')).toBeVisible();
});
```

- [ ] **Step 2.2: 跑確認 RED**

```powershell
npx playwright test --grep "theme"
```

預期：FAIL — style-resources.css 空，sidebar 沒有正確 display。

- [ ] **Step 2.3: 寫完整 style-resources.css（GREEN）**

```css
/* assets/style-resources.css */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
  transition: background-color 0.2s, color 0.2s;
}

.app-layout { display: flex; min-height: 100vh; }

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  min-width: 240px;
  border-right: 1px solid var(--border);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  background: var(--bg-subtle);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4);
  border-bottom: 1px solid var(--border);
}

.sidebar-logo {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--accent-dark);
  letter-spacing: -0.02em;
}

.back-link {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 3px 8px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: border-color 0.15s, color 0.15s;
}
.back-link:hover { border-color: var(--accent); color: var(--accent); }

.search-trigger {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 4px 8px;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  transition: border-color 0.15s, color 0.15s;
}
.search-trigger:hover { border-color: var(--accent); color: var(--accent); }

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 3px 8px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
}
.theme-toggle:hover { border-color: var(--accent); color: var(--accent); }

/* Nav list */
.nav-list { list-style: none; padding: var(--sp-3) 0; flex: 1; overflow-y: auto; }

.nav-item a {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 6px var(--sp-4);
  text-decoration: none;
  color: var(--text-muted);
  font-size: var(--text-sm);
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.nav-item a:hover { color: var(--text); background: var(--bg-muted); }
.nav-item a.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: #EFF6FF;
  font-weight: 500;
}
[data-theme="dark"] .nav-item a.active { background: #0D1F3C; }

/* ── Main content ── */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--sp-12) var(--sp-16);
  max-width: 900px;
}

/* ── Catalog error ── */
.catalog-error {
  padding: var(--sp-6);
  color: var(--level-human);
  background: var(--level-human-bg);
  border: 1px solid var(--level-human-border);
  border-radius: var(--r-md);
  margin: var(--sp-8) 0;
  font-size: var(--text-sm);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.catalog-error.hidden { display: none; }
.catalog-error pre {
  background: var(--bg-muted);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--r-sm);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text);
}
.catalog-error code { font-family: var(--font-mono); color: var(--text); }

/* ── Markdown rendered content ── */
#catalog-content h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--accent-dark);
  letter-spacing: -0.02em;
  margin: 0 0 var(--sp-6);
}

#catalog-content h2 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--accent-dark);
  letter-spacing: -0.01em;
  margin: var(--sp-12) 0 var(--sp-4);
  padding-top: var(--sp-8);
  border-top: 1px solid var(--border);
  scroll-margin-top: var(--sp-8);
}
#catalog-content h2:first-child { border-top: none; margin-top: 0; padding-top: 0; }

#catalog-content h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  margin: var(--sp-8) 0 var(--sp-3);
  scroll-margin-top: var(--sp-8);
}

#catalog-content p { margin-bottom: var(--sp-4); color: var(--text-muted); font-size: var(--text-sm); }

#catalog-content ul, #catalog-content ol {
  padding-left: var(--sp-6);
  margin-bottom: var(--sp-4);
  font-size: var(--text-sm);
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

#catalog-content hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: var(--sp-8) 0;
}

/* Tables */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: var(--sp-4) 0;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
}

#catalog-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}
#catalog-content th {
  text-align: left;
  padding: var(--sp-2) var(--sp-3);
  background: var(--bg-muted);
  border: 1px solid var(--border);
  font-weight: 600;
  color: var(--text-muted);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-family: var(--font-mono);
  white-space: nowrap;
}
#catalog-content td {
  padding: var(--sp-2) var(--sp-3);
  border: 1px solid var(--border);
  vertical-align: top;
  line-height: 1.5;
}
#catalog-content tr:nth-child(even) td { background: var(--bg-subtle); }
[data-theme="dark"] #catalog-content td { color: var(--text); }
[data-theme="dark"] #catalog-content tr:nth-child(even) td { background: var(--bg-muted); }
[data-theme="dark"] #catalog-content tr:nth-child(odd) td { background: var(--bg-subtle); }

/* Code blocks */
#catalog-content pre {
  background: var(--bg-muted);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: var(--sp-4);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  margin: var(--sp-4) 0;
  line-height: 1.6;
}
#catalog-content code { font-family: var(--font-mono); font-size: 0.9em; }
#catalog-content pre code { background: none; padding: 0; font-size: inherit; }
#catalog-content :not(pre) > code {
  background: var(--bg-muted);
  padding: 1px 5px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
}
[data-theme="dark"] #catalog-content pre { background: var(--bg-subtle); }
[data-theme="dark"] #catalog-content :not(pre) > code { background: var(--bg-muted); }

/* Blockquote (prompt example sections) */
#catalog-content blockquote {
  border-left: 3px solid var(--accent);
  padding: var(--sp-3) var(--sp-4);
  background: var(--bg-subtle);
  margin: var(--sp-4) 0;
  font-size: var(--text-sm);
  color: var(--text-muted);
  border-radius: 0 var(--r-md) var(--r-md) 0;
}

/* Search overlay */
.search-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}
.search-overlay.hidden { display: none; }
.search-box {
  background: var(--bg);
  border-radius: var(--r-lg);
  width: 560px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
  border: 1px solid var(--border);
}
#search-input {
  width: 100%;
  padding: var(--sp-4) var(--sp-6);
  border: none;
  outline: none;
  font-size: var(--text-lg);
  font-family: var(--font-sans);
  background: transparent;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}
.search-results { max-height: 360px; overflow-y: auto; }
.search-result-item {
  padding: var(--sp-3) var(--sp-6);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  border-bottom: 1px solid var(--border);
}
.search-result-item:hover, .search-result-item.selected { background: var(--bg-muted); }
.search-result-label {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--text-faint);
  min-width: 20px;
}
.search-result-text { font-size: var(--text-sm); color: var(--text); }
[data-theme="dark"] .search-box { background: var(--bg-subtle); }
[data-theme="dark"] #search-input { background: var(--bg-subtle); }

/* Responsive */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .main-content { padding: var(--sp-8) var(--sp-4); }
}

/* Print */
@media print {
  .sidebar, .search-overlay { display: none; }
  .main-content { padding: 0; }
  #catalog-content pre { white-space: pre-wrap; }
}
```

- [ ] **Step 2.4: 跑測試確認 GREEN**

```powershell
npx playwright test --grep "theme|skeleton"
```

預期：9 tests PASS。

- [ ] **Step 2.5: Commit**

```bash
git add assets/style-resources.css tests/e2e/resources-page.spec.js
git commit -m "feat(task2): sidebar layout + theme toggle (RED→GREEN)"
```

- [ ] **Step 2.6: 4-Agent Review**（並行）

**code-reviewer prompt:**
```
Review Task 2 of docs/impl-plan-resources-html.md.

Files changed: assets/style-resources.css (full version), tests/e2e/resources-page.spec.js

Check:
1. style-resources.css uses only CSS variables from style-base.css
   (--bg, --text, --accent, --accent-dark, --border, --bg-subtle, --bg-muted,
    --text-muted, --sp-*, --r-*, --font-*) — no hardcoded colors?
   Exception allowed: #EFF6FF and #0D1F3C for .nav-item a.active (same as style-dash.css)
2. .catalog-error.hidden uses display:none — consistent with dashboard pattern?
3. theme toggle: does it update aria-label when switching? (in resources.html inline script)
4. localStorage key is exactly 'cowork-theme' — same as dashboard.html?
5. Responsive: @media (max-width: 768px) hides sidebar — any content inaccessible on mobile?

Report critical issues with file:line.
```

**test-runner prompt:**
```
Run Task 2 tests.

Command: npx playwright test --grep "theme|skeleton" --reporter=list

Check:
1. All 9 tests pass?
2. The theme tests use localStorage.removeItem before reload — does this prevent test state leakage?
3. Is there a test that verifies aria-label updates on toggle? (If missing, note as gap)

Report: pass/fail, coverage gaps.
```

**performance-investigator prompt:**
```
Analyze Task 2 CSS performance.

File: assets/style-resources.css

Check:
1. CSS file size (rough estimate from line count ~220 lines) — reasonable for static site?
2. No @import rules that would cause extra round-trips?
3. transition on body — does this cause layout thrash on theme switch?
4. .nav-list overflow-y: auto on sidebar — does this create a scroll container
   that affects IntersectionObserver in Task 4? (Note for future tasks)

Report any issues with estimated impact.
```

**refactor-architect prompt:**
```
Review Task 2 structure.

Files: assets/style-resources.css

Check:
1. CSS is one file (~220 lines) covering: reset, layout, sidebar, nav,
   content, tables, code, search, responsive. Is this cohesive or should any section split?
2. The .table-wrapper, .catalog-error, #catalog-content h2/h3 styles are
   content-specific — are they better in a separate catalog-content.css?
   (Consider: only 1 page uses resources.html, keeping it one file is YAGNI)
3. Any style duplicated from style-dash.css that could be moved to style-base.css?

Recommendation: split or not? Justify.
```

---

## Task 3: Catalog Loader（fetch + marked）

**目標：** `resources-loader.js` 完整版 — fetch markdown、marked.parse、inject DOM、error handling。

**Files:**
- Modify: `assets/resources-loader.js`（完整版）
- Create: `tests/unit/catalog-parse.spec.js`
- Modify: `tests/e2e/resources-page.spec.js`（新增 catalog tests）

---

- [ ] **Step 3.1: 寫測試（RED）**

`tests/unit/catalog-parse.spec.js` — 驗證 fetch + 渲染結果：

```js
// tests/unit/catalog-parse.spec.js
const { test, expect } = require('@playwright/test');

test('catalog: renders 一頁速查表 heading after load', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const h2texts = await page.locator('#catalog-content h2').allTextContents();
  expect(h2texts.some(t => t.includes('一頁速查表'))).toBe(true);
});

test('catalog: renders at least 9 h3 section headings', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content h3').count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('catalog: renders at least 1 table', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const count = await page.locator('#catalog-content table').count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test('catalog: renders at least 9 code blocks (one per resource)', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content pre code', { timeout: 8000 });
  const count = await page.locator('#catalog-content pre code').count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('catalog: tables are wrapped in .table-wrapper', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('.table-wrapper', { timeout: 8000 });
  const wrappers = await page.locator('.table-wrapper').count();
  expect(wrappers).toBeGreaterThanOrEqual(1);
});

test('catalog: shows error element when fetch fails', async ({ page }) => {
  await page.route('**/resources-catalog.md', route => route.abort());
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-error:not(.hidden)', { timeout: 8000 });
  await expect(page.locator('#catalog-error')).not.toHaveClass(/hidden/);
  await expect(page.locator('#catalog-error')).toContainText('無法載入');
});
```

- [ ] **Step 3.2: 跑確認 RED**

```powershell
npx playwright test tests/unit/catalog-parse.spec.js
```

預期：FAIL — resources-loader.js 是 no-op，catalog-content 空。

- [ ] **Step 3.3: 寫完整 resources-loader.js（GREEN）**

```js
// assets/resources-loader.js
window.ResourcesLoader = {};

ResourcesLoader.init = function() {
  ResourcesLoader.loadCatalog();
  ResourcesLoader.initSearchPanel();
};

ResourcesLoader.loadCatalog = async function() {
  try {
    const res = await fetch('resources-catalog.md');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const md = await res.text();

    marked.use({ mangle: false, headerIds: true, gfm: true });
    const html = marked.parse(md);

    const content = document.getElementById('catalog-content');
    content.innerHTML = html;

    // Wrap tables for horizontal scroll on narrow screens
    content.querySelectorAll('table').forEach(function(table) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    ResourcesLoader.buildNav();
    ResourcesLoader.initScrollSpy();

  } catch (err) {
    document.getElementById('catalog-error').classList.remove('hidden');
    console.error('[ResourcesLoader] fetch failed:', err);
  }
};

ResourcesLoader.buildNav = function() {
  const list = document.getElementById('nav-list');
  if (!list) return;

  const headings = document.querySelectorAll('#catalog-content h2');
  headings.forEach(function(h) {
    if (!h.id) {
      h.id = h.textContent.trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w一-鿿-]/g, '');
    }
    const li = document.createElement('li');
    li.className = 'nav-item';
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.dataset.id = h.id;
    a.textContent = h.textContent.trim();
    li.appendChild(a);
    list.appendChild(li);
  });
};

ResourcesLoader.initScrollSpy = function() {
  const headings = document.querySelectorAll('#catalog-content h2[id]');
  const navLinks = document.querySelectorAll('#nav-list a[data-id]');
  if (!headings.length || !navLinks.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(function(a) {
          a.classList.toggle('active', a.dataset.id === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(function(h) { observer.observe(h); });

  navLinks.forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.getElementById(a.dataset.id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

ResourcesLoader.initSearchPanel = function() {
  const overlay = document.getElementById('search-overlay');
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const btn     = document.getElementById('search-btn');
  if (!overlay || !input) return;

  const open  = function() { overlay.classList.remove('hidden'); input.focus(); input.value = ''; results.innerHTML = ''; };
  const close = function() { overlay.classList.add('hidden'); };

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape') close();
  });
  if (btn) btn.addEventListener('click', open);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });

  var selected = -1;

  input.addEventListener('input', function() {
    var q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    selected = -1;
    if (!q) return;

    var headings = Array.from(
      document.querySelectorAll('#catalog-content h2, #catalog-content h3')
    ).map(function(h) {
      return { id: h.id, text: h.textContent.trim(), level: h.tagName };
    });

    var matches = headings.filter(function(item) {
      return item.text.toLowerCase().includes(q);
    });

    matches.slice(0, 8).forEach(function(item, i) {
      var div = document.createElement('div');
      div.className = 'search-result-item';
      div.dataset.idx = i;
      div.innerHTML = '<span class="search-result-label">' +
        (item.level === 'H2' ? '§' : '—') +
        '</span><span class="search-result-text">' +
        item.text + '</span>';
      div.addEventListener('click', function() {
        var el = document.getElementById(item.id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        close();
      });
      results.appendChild(div);
    });
  });

  input.addEventListener('keydown', function(e) {
    var items = results.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') selected = Math.min(selected + 1, items.length - 1);
    if (e.key === 'ArrowUp')   selected = Math.max(selected - 1, 0);
    if (e.key === 'Enter' && selected >= 0) {
      var sel = items[selected];
      if (sel) sel.click();
    }
    items.forEach(function(el, i) {
      el.classList.toggle('selected', i === selected);
    });
  });
};
```

注意：`marked.use({ mangle: false, headerIds: true, gfm: true })` — 不開 raw HTML pass-through，防 XSS。

- [ ] **Step 3.4: 跑測試確認 GREEN**

```powershell
npx playwright test tests/unit/catalog-parse.spec.js
```

預期：6 tests PASS。

- [ ] **Step 3.5: 確認全部到目前為止的測試仍 PASS**

```powershell
npx playwright test --grep "skeleton|theme|catalog"
```

預期：15 tests PASS。

- [ ] **Step 3.6: Commit**

```bash
git add assets/resources-loader.js tests/unit/catalog-parse.spec.js
git commit -m "feat(task3): catalog loader fetch+marked+nav+search (RED→GREEN)"
```

- [ ] **Step 3.7: 4-Agent Review**（並行）

**code-reviewer prompt:**
```
Review Task 3 of docs/impl-plan-resources-html.md.

File changed: assets/resources-loader.js (full implementation ~120 lines)

Check:
1. marked.use() config: { mangle: false, headerIds: true, gfm: true }
   — no renderer override that allows raw HTML pass-through?
   (marked 4.x: gfm:true enables tables/code-fence. raw HTML in md would still pass
    unless sanitize:true or custom renderer. resources-catalog.md has no raw HTML,
    but note this for future maintainers)
2. fetch('resources-catalog.md') — relative URL, works from HTTP server root.
   Will it break on GitHub Pages? (repo is at root, should be fine)
3. buildNav: assigns h2.id if not already set. The heading text contains Chinese +
   hyphens. Does the replace regex produce valid ids? Test with 「一頁速查表」→ expected id?
4. initScrollSpy: observer is created but never disconnected.
   Is this a memory leak concern for a single-page static site? (Low risk, note it)
5. initSearchPanel: buildIndex is done inside 'input' event every keystroke.
   For ~20 headings this is fine. Document the assumption.
6. Error handler shows #catalog-error — does it also hide #catalog-content?
   (Currently no — content is empty string, which is acceptable)

Report critical issues with file:line.
```

**test-runner prompt:**
```
Run Task 3 tests.

Commands:
  npx playwright test tests/unit/catalog-parse.spec.js --reporter=list
  npx playwright test --grep "skeleton|theme|catalog" --reporter=list

Check:
1. All 15 tests pass?
2. The 'fetch fails' test uses page.route() to abort — is the abort happening
   before or after the page script runs? Does timing matter?
3. Are there untested behaviors?
   - What happens if resources-catalog.md is present but empty?
   - What if marked.parse() throws? (Should it catch and show error?)
   - What if #catalog-content doesn't exist in DOM?
   List coverage gaps.

Report pass/fail, gaps.
```

**performance-investigator prompt:**
```
Analyze Task 3 for performance.

File: assets/resources-loader.js

Check:
1. resources-catalog.md file size — run:
     wc -c resources-catalog.md (bash) or (Get-Item resources-catalog.md).Length (PowerShell)
   Is it under 100KB? (Likely ~15-20KB)
2. marked.parse() is synchronous and blocks main thread. For 15-20KB this is ~1-5ms.
   Acceptable? Should it be wrapped in requestAnimationFrame or setTimeout(0)?
3. DOM mutation: content.innerHTML = html; then querySelectorAll + insertBefore for
   each table. For 9+ tables this is ~9 DOM mutations. Acceptable?
4. IntersectionObserver on ~5 h2 elements — very low cost. Confirm.
5. search buildIndex: querySelectorAll called on every keystroke. ~20 headings.
   Is memoization needed? (Probably not for this scale)

Report any issues with estimated impact. Suggest optimization only if impact is measurable.
```

**refactor-architect prompt:**
```
Review Task 3 structure.

File: assets/resources-loader.js (~120 lines)

Current responsibilities:
- loadCatalog: fetch + marked.parse + DOM inject + table wrap
- buildNav: h2 → sidebar nav
- initScrollSpy: IntersectionObserver + click handler
- initSearchPanel: Ctrl+K + input search + keyboard nav

Check:
1. Line count: is it under 200?
2. Are the 4 responsibilities clearly separated? Can you read each function without
   needing to read the others?
3. loadCatalog calls buildNav() and initScrollSpy() after fetch completes.
   This creates temporal coupling. Is there a cleaner way?
   (Event: 'catalog-loaded' CustomEvent + listeners? YAGNI for single page, note it)
4. initSearchPanel: index is rebuilt on every keystroke (inside 'input' listener).
   Should this be a module-level variable set after loadCatalog completes?

Recommend: split or refactor? Justify with YAGNI.
```

---

## Task 4: Section Navigation

**目標：** 驗證 buildNav + scrollSpy 正確工作（已在 Task 3 實作，此 Task 寫測試補齊）。

**Files:**
- Modify: `tests/e2e/resources-page.spec.js`（新增 nav tests）

---

- [ ] **Step 4.1: 寫測試（RED/GREEN）**

在 `tests/e2e/resources-page.spec.js` 追加：

```js
test('nav: sidebar nav has items after catalog loads', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#nav-list .nav-item', { timeout: 8000 });
  const count = await page.locator('#nav-list .nav-item').count();
  expect(count).toBeGreaterThanOrEqual(4);
});

test('nav: each nav item corresponds to a h2 in catalog-content', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#nav-list .nav-item a', { timeout: 8000 });
  const navIds = await page.locator('#nav-list .nav-item a').evaluateAll(
    links => links.map(a => a.dataset.id).filter(Boolean)
  );
  for (const id of navIds) {
    const el = await page.locator('#catalog-content #' + id);
    await expect(el).toHaveCount(1);
  }
});

test('nav: clicking first nav item scrolls and sets active', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#nav-list .nav-item a', { timeout: 8000 });
  const firstLink = page.locator('#nav-list .nav-item a').first();
  await firstLink.click();
  // Short wait for smooth scroll + IntersectionObserver to fire
  await page.waitForTimeout(600);
  await expect(firstLink).toHaveClass(/active/);
});
```

- [ ] **Step 4.2: 跑確認（應 GREEN — 已實作）**

```powershell
npx playwright test --grep "nav"
```

預期：3 tests PASS（buildNav + scrollSpy 已在 Task 3 實作）。

- [ ] **Step 4.3: Commit**

```bash
git add tests/e2e/resources-page.spec.js
git commit -m "test(task4): nav tests — all green from task3 implementation"
```

- [ ] **Step 4.4: 4-Agent Review**（並行）

**code-reviewer prompt:**
```
Review Task 4 nav tests.

File: tests/e2e/resources-page.spec.js (nav tests section)

Check:
1. 'nav item corresponds to a h2' test uses evaluateAll + locator by dynamic id.
   Is the CSS selector '#catalog-content #' + id safe? (id may contain Chinese chars)
2. 'clicking first nav item' uses waitForTimeout(600) for smooth scroll — is this
   brittle? Could use waitForFunction instead? Evaluate trade-off.
3. Are there tests for: nav does NOT appear before catalog loads? (race condition coverage)
   (Optional — note if missing)

Report critical issues.
```

**test-runner prompt:**
```
Run Task 4 tests.

Command: npx playwright test --grep "nav" --reporter=list

Check:
1. All 3 nav tests pass?
2. The waitForTimeout(600) — is this causing flakiness in CI environment?
3. Run tests 3x to check for flakiness: npx playwright test --grep "nav" --repeat-each=3

Report pass/fail and flakiness.
```

**performance-investigator prompt:**
```
No performance concerns for Task 4 (nav tests only). Confirm:
1. Total test suite runtime for current tests — under 30 seconds?
   Command: npx playwright test --reporter=list 2>&1 | tail -5
2. If over 30s, identify slowest tests.
```

**refactor-architect prompt:**
```
Review Task 4. No new implementation files.
Check: Are nav-related tests in the right file?
Currently in tests/e2e/resources-page.spec.js.
Would a separate tests/e2e/nav.spec.js be cleaner?
Consider: YAGNI — current file is ~60 tests, manageable? Recommend only if file > 100 lines.
```

---

## Task 5: Search

**目標：** 驗證搜尋面板完整行為（已在 Task 3 實作 initSearchPanel）。

**Files:**
- Modify: `tests/e2e/resources-page.spec.js`（新增 search tests）

---

- [ ] **Step 5.1: 寫測試（RED/GREEN）**

追加：

```js
test('search: opens with Ctrl+K', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await expect(page.locator('#search-overlay')).not.toHaveClass(/hidden/);
});

test('search: closes with Escape', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await expect(page.locator('#search-overlay')).not.toHaveClass(/hidden/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#search-overlay')).toHaveClass(/hidden/);
});

test('search: typing 會議 shows 會議記錄 result', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await page.fill('#search-input', '會議');
  await page.waitForSelector('.search-result-item', { timeout: 3000 });
  const firstResult = await page.locator('.search-result-item').first().textContent();
  expect(firstResult).toContain('會議記錄');
});

test('search: ArrowDown + Enter closes overlay and does not throw', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.keyboard.press('Control+k');
  await page.fill('#search-input', '會議');
  await page.waitForSelector('.search-result-item');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('#search-overlay')).toHaveClass(/hidden/);
});

test('search: clicking search-btn opens panel', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  await page.click('#search-btn');
  await expect(page.locator('#search-overlay')).not.toHaveClass(/hidden/);
});
```

- [ ] **Step 5.2: 跑確認**

```powershell
npx playwright test --grep "search"
```

預期：5 tests PASS。

- [ ] **Step 5.3: Commit**

```bash
git add tests/e2e/resources-page.spec.js
git commit -m "test(task5): search panel tests — all green from task3 implementation"
```

- [ ] **Step 5.4: 4-Agent Review**（並行）

**code-reviewer prompt:**
```
Review Task 5 search tests + existing initSearchPanel (assets/resources-loader.js).

Check:
1. initSearchPanel: search index built from DOM querySelectorAll on every keypress.
   For h2 + h3 (~15 headings) this is fine. But is it called before catalog loads?
   (No — ResourcesLoader.init() calls initSearchPanel() immediately, not after fetch.
    The buildIndex inside input listener uses DOM at keypress time, so it's lazy. Correct.)
2. Test 'ArrowDown + Enter' — it navigates to h3 using element.id.
   If h3 has no id (set by marked's headerIds:true), does scrollIntoView silently fail?
   Verify marked headerIds:true assigns ids to h3 as well as h2.
3. Any XSS: search result innerHTML uses item.text from DOM textContent — safe.

Report critical issues.
```

**test-runner prompt:**
```
Run Task 5 tests.

Command: npx playwright test --grep "search" --reporter=list

Check:
1. All 5 tests pass?
2. The 'typing 會議' test depends on catalog having loaded before search opens.
   waitForSelector('#catalog-content h3') ensures this — is 8000ms timeout sufficient?
3. Run tests 3x for flakiness: npx playwright test --grep "search" --repeat-each=3

Report pass/fail and flakiness.
```

**performance-investigator prompt:**
```
Analyze search performance in assets/resources-loader.js.

Check:
1. buildIndex (inside input listener) runs querySelectorAll on every keystroke.
   For ~15 headings: how many DOM nodes queried? Acceptable?
2. Is there debounce on input event? (No) For 15 headings, is debounce needed?
   (Threshold: >100 nodes or >50ms per query → add debounce. Under this → skip)
3. .slice(0, 8) caps results — correct.

Report with skip-if criteria.
```

**refactor-architect prompt:**
```
Review search implementation in assets/resources-loader.js.

Current: buildIndex is an anonymous function inside initSearchPanel's 'input' listener.

Check:
1. Should buildIndex be a named function on ResourcesLoader? (ResourcesLoader.buildSearchIndex)
   — Better for testing, but Task 3 tests don't unit-test it directly.
2. initSearchPanel is ~50 lines inside a ~120-line file. Too large?
   (If total file >200 lines, recommend extracting search to ResourcesLoader.Search = {})
3. The 'selected' variable is a closure inside initSearchPanel — not on the module.
   Is this correct encapsulation?

Recommend split only if file > 200 lines.
```

---

## Task 6: Dashboard Linkage

**目標：** dashboard.html + data.js + interactions.js 加兩個入口，不破壞現有 chapter 行為。

**Files:**
- Modify: `assets/data.js`
- Modify: `assets/interactions.js`
- Modify: `dashboard.html`
- Create: `tests/e2e/dashboard-link.spec.js`

---

- [ ] **Step 6.1: 寫測試（RED）**

```js
// tests/e2e/dashboard-link.spec.js
const { test, expect } = require('@playwright/test');

test('dashboard-link: resources-link in sidebar header', async ({ page }) => {
  await page.goto('/dashboard.html');
  await expect(page.locator('a.resources-link')).toBeVisible();
});

test('dashboard-link: resources-link opens new tab to resources.html', async ({ page, context }) => {
  await page.goto('/dashboard.html');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('a.resources-link')
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('resources.html');
  await newPage.close();
});

test('dashboard-link: 資源對照 chapter appears in sidebar nav', async ({ page }) => {
  await page.goto('/dashboard.html');
  const navText = await page.locator('#nav-list').textContent();
  expect(navText).toContain('資源對照');
});

test('dashboard-link: 資源對照 chapter link opens new tab', async ({ page, context }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item');
  const resourcesLink = page.locator('#nav-list a', { hasText: '資源對照' });
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    resourcesLink.click()
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toContain('resources.html');
  await newPage.close();
});

test('dashboard-link: existing chapter summary still uses anchor href (no new tab)', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item a[data-id="summary"]');
  const summaryLink = page.locator('#nav-list a[data-id="summary"]');
  const href = await summaryLink.getAttribute('href');
  expect(href).toBe('#summary');
  // target should NOT be _blank
  const target = await summaryLink.getAttribute('target');
  expect(target).toBeNull();
});

test('dashboard-link: dashboard search shows 資源對照 result', async ({ page }) => {
  await page.goto('/dashboard.html');
  await page.keyboard.press('Control+k');
  await page.fill('#search-input', '資源');
  await page.waitForSelector('.search-result-item');
  const results = await page.locator('.search-result-item').allTextContents();
  expect(results.some(t => t.includes('資源對照'))).toBe(true);
});
```

- [ ] **Step 6.2: 跑確認 RED**

```powershell
npx playwright test tests/e2e/dashboard-link.spec.js
```

預期：FAIL — 沒有 a.resources-link，chapters 沒有 resources entry。

- [ ] **Step 6.3: 修改 assets/data.js（GREEN — part 1）**

在 `window.AppData.chapters` 陣列最後加一個 entry。找到最後一個 `}` 前面的 `]` 改為：

```js
// 在 window.AppData.chapters = [ ... ] 裡，現有最後一項後面加：
  { id: 'resources', title: '資源對照', icon: '⊟', external: true, href: 'resources.html' },
```

完整修改前後對照 — 找到 chapters 陣列最後一項（`{ id: 'conclusion', title: '一句話總結', icon: '→'  }`），在其後加逗號並插入新項：

```js
  { id: 'conclusion',       title: '一句話總結',           icon: '→'  },
  { id: 'resources',        title: '資源對照',             icon: '⊟', external: true, href: 'resources.html' },
```

- [ ] **Step 6.4: 修改 assets/interactions.js（GREEN — part 2）**

`DashboardInteractions.buildNav` 改為支援 `external:true`：

```js
// 1. Build sidebar nav
DashboardInteractions.buildNav = function() {
  const list = document.getElementById('nav-list');
  window.AppData.chapters.forEach(ch => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    if (ch.external) {
      li.innerHTML = `<a href="${ch.href}" target="_blank" data-id="${ch.id}" aria-label="${ch.title}（開新分頁）">
        <span class="nav-icon">${ch.icon}</span>${ch.title} ↗
      </a>`;
    } else {
      li.innerHTML = `<a href="#${ch.id}" data-id="${ch.id}">
        <span class="nav-icon">${ch.icon}</span>${ch.title}
      </a>`;
    }
    list.appendChild(li);
  });
};
```

同時更新 `DashboardInteractions.initSearch` 中的 search result click handler，讓 external chapter 開新分頁而非 scrollIntoView（否則 `document.getElementById('resources')` 回傳 null）：

找到 `div.addEventListener('click', () => {` 這段，改為：

```js
      div.addEventListener('click', () => {
        if (item.href) {
          window.open(item.href, '_blank');
        } else {
          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
        }
        close();
      });
```

同時更新 index 建立，把 `href` 加進去：

```js
  const index = window.AppData.chapters.map(ch => ({
    id: ch.id, label: ch.icon, text: ch.title, href: ch.href
  }));
```

- [ ] **Step 6.5: 修改 dashboard.html（GREEN — part 3）**

在 `<button id="search-btn"` 之前（同一個 `div` 容器內）加入 resources-link：

```html
<!-- 找到這行: -->
          <button id="theme-toggle" class="theme-toggle">Dark</button>
          <button id="search-btn" class="search-trigger" title="Ctrl+K">

<!-- 改為（在兩個 button 之間插入）: -->
          <button id="theme-toggle" class="theme-toggle">Dark</button>
          <a id="resources-link-btn" class="resources-link search-trigger" href="resources.html" target="_blank" title="資源對照" aria-label="開啟資源對照頁" style="text-decoration:none;display:flex;align-items:center;">⊟</a>
          <button id="search-btn" class="search-trigger" title="Ctrl+K">
```

- [ ] **Step 6.6: 跑測試確認 GREEN**

```powershell
npx playwright test tests/e2e/dashboard-link.spec.js
```

預期：6 tests PASS。

- [ ] **Step 6.7: 確認回歸：既有 dashboard 測試仍 PASS**

```powershell
npx playwright test --grep "skeleton|theme|catalog|nav|search"
```

預期：所有既有測試仍 PASS。

- [ ] **Step 6.8: Commit**

```bash
git add assets/data.js assets/interactions.js dashboard.html tests/e2e/dashboard-link.spec.js
git commit -m "feat(task6): dashboard linkage — 2 entry points to resources.html (RED→GREEN)"
```

- [ ] **Step 6.9: 4-Agent Review**（並行）

**code-reviewer prompt:**
```
Review Task 6 of docs/impl-plan-resources-html.md.

Files changed: assets/data.js, assets/interactions.js, dashboard.html,
tests/e2e/dashboard-link.spec.js

Check:
1. data.js: new chapter entry { id:'resources', title:'資源對照', icon:'⊟',
   external:true, href:'resources.html' } — is the href a relative path? Correct for
   same-origin GitHub Pages?
2. interactions.js buildNav: external:true branch uses ch.href directly in href attr.
   No encoding needed (only 'resources.html', no special chars). Correct?
3. interactions.js search click: ch.href check uses window.open(item.href, '_blank').
   Is item.href correctly passed from the index map?
   (index = chapters.map(ch => ({..., href: ch.href})) — ch.href is undefined for
    non-external chapters, so item.href is undefined → falsy → goes to scrollIntoView. Correct.)
4. dashboard.html: new <a> uses class="resources-link search-trigger". Is reusing
   .search-trigger correct for styling? (It gives the border + hover effect. Fine.)
5. REGRESSION: existing 10 chapters (summary, flowcharts, ..., conclusion) still use
   href="#id" not external. Confirmed by test?

Report with file:line citations.
```

**test-runner prompt:**
```
Run Task 6 tests.

Commands:
  npx playwright test tests/e2e/dashboard-link.spec.js --reporter=list
  npx playwright test --reporter=list  (full regression)

Check:
1. All 6 dashboard-link tests pass?
2. Full regression: all previous tests still pass?
3. The new-tab tests use context.waitForEvent('page') — is there a timeout?
   If no timeout set, it could hang if the new tab doesn't open. (Playwright default: 30s)
4. Test 'existing chapter anchor href' verifies target is null (not _blank) —
   this is the regression guard. Does it pass?

Report pass/fail.
```

**performance-investigator prompt:**
```
Analyze Task 6 changes.

Files: assets/interactions.js, assets/data.js

Check:
1. interactions.js buildNav: now has if/else per chapter. 11 chapters total (10 + 1 external).
   O(11) — negligible. Confirm.
2. interactions.js initSearch: index map now includes href. 11 items, one extra property.
   Negligible. Confirm.
3. dashboard.html: one extra <a> element in header. No performance impact. Confirm.

This task should be clean. Report only if something unexpected found.
```

**refactor-architect prompt:**
```
Review Task 6 structure.

Files changed: assets/interactions.js, assets/data.js, dashboard.html

Check:
1. interactions.js buildNav: the if/else for external creates two different HTML strings.
   Is there a risk of XSS if ch.href or ch.title contains user input?
   (data.js is hardcoded, no user input — safe. But note for future dynamic data.)
2. interactions.js initSearch: search index now has href property, but the original
   pattern (id, label, text) is extended. Is this additive change clean?
   (Only the click handler checks it — no other code path affected. Clean.)
3. dashboard.html: the new <a> uses inline style="text-decoration:none;display:flex;..."
   This should move to a CSS class. Is this acceptable for a single occurrence?
   (YAGNI — only one element, inline is acceptable. Or add .resources-link to style-dash.css)

Recommend: move inline style to CSS class? Cost: +3 lines CSS, cleaner HTML. Your call.
```

---

## Task 7: Polish & Accessibility

**目標：** aria-labels、table RWD 測試、keyboard nav、print style 驗證。

**Files:**
- Modify: `tests/e2e/resources-page.spec.js`（新增 polish tests）

注意：大部分 polish 已在 Task 1-3 實作（aria-labels 在 resources.html，table-wrapper 在 resources-loader.js，print CSS 在 style-resources.css）。此 Task 補齊測試覆蓋。

---

- [ ] **Step 7.1: 寫測試**

```js
test('polish: theme-toggle has aria-label', async ({ page }) => {
  await page.goto('/resources.html');
  const label = await page.locator('#theme-toggle').getAttribute('aria-label');
  expect(label).toBeTruthy();
  expect(label.length).toBeGreaterThan(3);
});

test('polish: search-btn has aria-label', async ({ page }) => {
  await page.goto('/resources.html');
  const label = await page.locator('#search-btn').getAttribute('aria-label');
  expect(label).toBeTruthy();
});

test('polish: back-link has aria-label', async ({ page }) => {
  await page.goto('/resources.html');
  const label = await page.locator('a.back-link').getAttribute('aria-label');
  expect(label).toBeTruthy();
});

test('polish: tables wrapped in .table-wrapper on narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/resources.html');
  await page.waitForSelector('.table-wrapper', { timeout: 8000 });
  const wrapper = page.locator('.table-wrapper').first();
  const overflow = await wrapper.evaluate(el =>
    window.getComputedStyle(el).overflowX
  );
  expect(overflow).toBe('auto');
});

test('polish: page does not have horizontal scrollbar on 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h2', { timeout: 8000 });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  // Allow 1px rounding tolerance
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
```

- [ ] **Step 7.2: 跑測試**

```powershell
npx playwright test --grep "polish"
```

若有 FAIL，修補對應 resources.html 或 style-resources.css。

常見問題：
- `polish: page does not have horizontal scrollbar` FAIL → 某個元素（通常是 `pre` 或 table）寬度超出。確認 `pre { overflow-x: auto; }` 和 `.table-wrapper { overflow-x: auto; }` 已在 style-resources.css。

- [ ] **Step 7.3: Commit**

```bash
git add tests/e2e/resources-page.spec.js
git commit -m "test(task7): polish + a11y tests (RED→GREEN)"
```

- [ ] **Step 7.4: 4-Agent Review**（並行）

**code-reviewer prompt:**
```
Review Task 7 polish tests and verify existing implementation covers them.

Tests added: tests/e2e/resources-page.spec.js (polish section)
Implementation checked: resources.html, assets/style-resources.css,
assets/resources-loader.js

Check:
1. aria-label on #theme-toggle: set in resources.html and updated on click? Verified?
2. .table-wrapper overflow-x: auto — is this in style-resources.css?
3. horizontal scrollbar test: checks documentElement.scrollWidth <= clientWidth.
   Does any pre, code block, or table break this on 375px?
   (.main-content has max-width:900px + padding, on 375px: padding is var(--sp-4)=1rem each side → usable width ~343px. Large code blocks may overflow. Is overflow-x:auto on pre sufficient?)
4. back-link: <a href="dashboard.html" class="back-link" ... aria-label="返回 Dashboard"> — present in resources.html Task 1?

Report any gap between tests and implementation.
```

**test-runner prompt:**
```
Run Task 7 tests.

Command: npx playwright test --grep "polish" --reporter=list

Check:
1. All 5 polish tests pass?
2. The 375px tests: are they setting viewport correctly? (page.setViewportSize before goto)
3. The horizontal scrollbar test — run on actual resources.html with catalog loaded.
   Is 8000ms timeout enough for catalog to load before measuring scrollWidth?

Report pass/fail.
```

**performance-investigator prompt:**
```
Analyze resources.html page performance on mobile (375px).

Check:
1. On 375px, sidebar is display:none (CSS media query). Is any sidebar JS still running?
   (initScrollSpy still observes headings — observer is attached to DOM, not display.
    On mobile: observer fires but nav-list has no items since .sidebar is hidden.
    navLinks = document.querySelectorAll('#nav-list a[data-id]') → empty NodeList.
    No error, just no effect. Acceptable.)
2. Google Fonts loading on mobile — adds 2 round trips. Acceptable for static site?
3. marked.js CDN script tag — is it loaded from a fast CDN? (jsdelivr.net — yes)

Report any issues.
```

**refactor-architect prompt:**
```
Task 7 review — polish and a11y completeness check.

Check:
1. Are all interactive elements (buttons, links, search input) keyboard accessible?
   - #theme-toggle: button → Tab focusable ✓
   - #search-btn: button → Tab focusable ✓
   - .back-link: <a> → Tab focusable ✓
   - #nav-list a: <a> → Tab focusable ✓
   - #search-input: input → Tab focusable ✓
   Any missing?
2. Is there a visible focus indicator? (Browser default or custom :focus style in CSS?)
   Check style-resources.css for :focus-visible rules. If absent, note as gap.
3. #catalog-error has role="alert" — this is correct for dynamic error messages.
   Any other ARIA roles needed?

Report gaps, ranked by severity.
```

---

## Task 8: Full E2E Journey

**目標：** 完整 user journey 從 dashboard 開始，跑完所有功能節點。

**Files:**
- Create: `tests/e2e/full-journey.spec.js`

---

- [ ] **Step 8.1: 寫測試**

```js
// tests/e2e/full-journey.spec.js
const { test, expect } = require('@playwright/test');

test('full-journey: complete user flow through dashboard to resources', async ({ page, context }) => {
  // 1. Open dashboard
  await page.goto('/dashboard.html');
  await expect(page).toHaveTitle(/接案軟體開發交付治理流程/);

  // 2. Click resources-link in header → new tab opens
  const [resourcesPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    page.click('a.resources-link')
  ]);
  await resourcesPage.waitForLoadState('domcontentloaded');
  expect(resourcesPage.url()).toContain('resources.html');

  // 3. Catalog renders — all 9 resource sections visible
  await resourcesPage.waitForSelector('#catalog-content h3', { timeout: 10000 });
  const h3s = await resourcesPage.locator('#catalog-content h3').allTextContents();
  const resourceNames = ['會議記錄', '工作計劃書', '簡報', 'WBS', '組織架構', 'Prototype', 'Sprint', 'ASANA', '里程碑'];
  for (const name of resourceNames) {
    expect(h3s.some(t => t.includes(name))).toBe(true);
  }

  // 4. Switch to dark mode
  await resourcesPage.click('#theme-toggle');
  const theme = await resourcesPage.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(theme).toBe('dark');

  // 5. Search for 會議 → find result → Enter → overlay closes
  await resourcesPage.keyboard.press('Control+k');
  await resourcesPage.fill('#search-input', '會議');
  await resourcesPage.waitForSelector('.search-result-item', { timeout: 3000 });
  const firstResult = await resourcesPage.locator('.search-result-item').first().textContent();
  expect(firstResult).toContain('會議記錄');
  await resourcesPage.keyboard.press('ArrowDown');
  await resourcesPage.keyboard.press('Enter');
  await expect(resourcesPage.locator('#search-overlay')).toHaveClass(/hidden/);

  // 6. Click nav item for Tier 3 section
  const tier3Nav = resourcesPage.locator('#nav-list .nav-item a', { hasText: 'Tier 3' });
  const tier3NavCount = await tier3Nav.count();
  if (tier3NavCount > 0) {
    await tier3Nav.first().click();
    await resourcesPage.waitForTimeout(600);
    // Verify Tier 3 h2 is in or near viewport
    const tier3H2 = resourcesPage.locator('#catalog-content h2', { hasText: 'Tier 3' });
    await expect(tier3H2.first()).toBeInViewport({ ratio: 0.1 });
  }

  // 7. dark mode persists on reload
  await resourcesPage.reload();
  const themeAfterReload = await resourcesPage.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  expect(themeAfterReload).toBe('dark');

  // Cleanup
  await resourcesPage.evaluate(() => localStorage.removeItem('cowork-theme'));
});

test('full-journey: resources chapter in dashboard nav also opens resources.html', async ({ page, context }) => {
  await page.goto('/dashboard.html');
  await page.waitForSelector('#nav-list .nav-item a', { timeout: 5000 });

  const resourcesNavLink = page.locator('#nav-list a', { hasText: '資源對照' });
  await expect(resourcesNavLink).toBeVisible();

  const [newPage] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }),
    resourcesNavLink.click()
  ]);
  await newPage.waitForLoadState('domcontentloaded');
  expect(newPage.url()).toContain('resources.html');
  await newPage.close();
});
```

- [ ] **Step 8.2: 跑 E2E**

```powershell
npx playwright test tests/e2e/full-journey.spec.js --reporter=list
```

預期：2 tests PASS。

- [ ] **Step 8.3: 跑完整測試套件（最終 GREEN）**

```powershell
npx playwright test --reporter=list
```

預期：所有 tests PASS（Task 1-8 共 ~25+ tests）。

- [ ] **Step 8.4: 視覺驗收**

```powershell
python -m http.server 8080
```

1. 開 `http://localhost:8080/dashboard.html`
2. 確認 sidebar header 有 ⊟ 按鈕
3. 點 ⊟ → 新分頁開 `resources.html`
4. 確認 9 個資源 section 都在（會議記錄、工作計劃書、簡報、WBS、組織架構、Prototype、Sprint 規劃、ASANA、里程碑提醒）
5. 切換 dark mode → 頁面變深色
6. Ctrl+K 搜尋「會議」→ 結果出現 → Enter → 跳到該節
7. 點 sidebar nav 最後一個 item → 滾動到對應節
8. dashboard.html sidebar nav 最後項「資源對照 ↗」→ 點擊開新分頁
9. dashboard.html 既有 chapter（如「核心定位」）→ 點擊仍是錨點滾動，非新分頁

- [ ] **Step 8.5: Final Commit**

```bash
git add tests/e2e/full-journey.spec.js
git commit -m "test(task8): full E2E journey — all tests green"
```

- [ ] **Step 8.6: 4-Agent Review（Final）**（並行）

**code-reviewer prompt:**
```
Final review of resources.html implementation.

All files: resources.html, assets/style-resources.css, assets/resources-loader.js,
assets/data.js (modified), assets/interactions.js (modified), dashboard.html (modified),
tests/e2e/resources-page.spec.js, tests/e2e/dashboard-link.spec.js,
tests/e2e/full-journey.spec.js, tests/unit/catalog-parse.spec.js

Check:
1. No hardcoded colors in style-resources.css except the 2 allowed exceptions?
2. No raw HTML pass-through in marked.use() config?
3. resources.html CDN marked.js loaded at body end (not head) — no render blocking?
4. All interactive elements have aria-label or descriptive text?
5. dashboard.html: 2 changes (resources-link + data.js chapter) — any other unintended changes?
6. interactions.js: only buildNav and initSearch modified — scrollSpy and initModal untouched?
7. Full test suite passes — confirmed by test-runner?

Report any remaining concerns before shipping.
```

**test-runner prompt:**
```
Run final full test suite.

Command: npx playwright test --reporter=list

Check:
1. ALL tests pass?
2. Total test count — expected ~25+. List if fewer.
3. Any flaky tests (run 3x to check): npx playwright test --repeat-each=3
4. Coverage map:
   - Task 1 skeleton: ✓
   - Task 2 theme: ✓
   - Task 3 catalog load/error: ✓
   - Task 4 nav: ✓
   - Task 5 search: ✓
   - Task 6 dashboard linkage: ✓
   - Task 7 polish/a11y: ✓
   - Task 8 E2E journey: ✓
   Any missing coverage?

Final verdict: SHIP or BLOCK.
```

**performance-investigator prompt:**
```
Final performance audit of resources.html.

Run the page and measure:
1. Page load time (DOMContentLoaded): npx playwright test with page.on('domcontentloaded')
   Or measure manually in DevTools.
2. resources-catalog.md size: (Get-Item resources-catalog.md).Length in PowerShell
3. marked.js CDN size: ~50KB minified
4. Total page weight: fonts (2 families) + style-base.css + style-resources.css +
   resources-loader.js + marked.min.js + resources-catalog.md
5. Largest Contentful Paint: is it the first h2 or a code block?
6. Any blocking scripts in <head>? (Only fonts preconnect, no blocking JS)

Report: total weight estimate, LCP estimate, any optimization worth doing.
```

**refactor-architect prompt:**
```
Final structural review.

Files: assets/resources-loader.js

Count lines: (Get-Content assets\resources-loader.js | Measure-Object -Line).Lines

Check:
1. Is resources-loader.js under 200 lines? If over, which functions should extract?
   Suggested split if needed:
   - ResourcesLoader.Nav = { build, initScrollSpy }
   - ResourcesLoader.Search = { init, buildIndex }
   - ResourcesLoader.Catalog = { load, wrapTables }
2. Is there any shared utility between resources-loader.js and interactions.js?
   (scrollIntoView, IntersectionObserver pattern, search overlay pattern)
   Should these move to a shared assets/utils.js? (YAGNI: only if pattern used 3+ times)
3. After all 8 tasks: does the file structure in docs/impl-plan-resources-html.md
   match what was actually built? Any drift?

Final recommendation: refactor now or leave for next major version?
```

---

## Verification Summary

```powershell
# Install (one-time)
npm install
npx playwright install chromium

# Full test suite
npx playwright test --reporter=list

# E2E only
npx playwright test tests/e2e/full-journey.spec.js --reporter=list

# Headed visual run
npx playwright test tests/e2e/full-journey.spec.js --headed

# Serve and manually verify
python -m http.server 8080
# Open: http://localhost:8080/dashboard.html
```

Expected final state:
- All ~25+ tests PASS
- `resources.html` renders all 9 catalog sections
- Dashboard has 2 working entry points to resources.html
- Dark mode syncs via `cowork-theme` localStorage key
- Ctrl+K search works on both pages
- GitHub Pages compatible (same-origin fetch)
