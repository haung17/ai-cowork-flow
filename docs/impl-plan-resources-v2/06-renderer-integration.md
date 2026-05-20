# Step 06 — Renderer Integration + Full Test Suite

**Priority 修復**：#6（status badge）+ #7（verification checklist）+ #2（speed-ref table chips）+ 整體整合

## 目標

1. `resources-loader.js` 完整重構：`fetchAll` → `renderCatalog` → `enrichDom` → `rewriteNodeRefs` → `tagTier3` → `renderTypeChips` → `buildNav` → `initScrollSpy`；`marked.use()` 移至模組初始化（非 renderCatalog 內）；補 `performance.now()` 計測 marked.parse（step-03 review 建議）
2. `enrichDom(catalogHtml, state)` — 每個 `h3[id]` 後插入 status badge + verification checklist（從 `_state` 取值）
3. `renderTypeChips(root)` — 速查表 Primary type / Support 欄位由文字改成 chip span
4. `style-resources.css` 補：status badge 顏色、verification list 樣式、type chip 顏色
5. 最終：全測試 48/48（含新測試）全綠；`resources-loader.js` < 300 行

## 交付檔

- `assets/resources-loader.js`（完整重構）
- `assets/style-resources.css`（補 badge + chip + verify）
- `tests/e2e/status-and-verify.spec.js`（新建）

## TDD — 紅測試

```js
// tests/e2e/status-and-verify.spec.js
const { test, expect } = require('@playwright/test');

test('status: meeting-notes section has status badge Verified', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const badge = page.locator('[data-resource-id="meeting-notes"] .status-badge');
  await expect(badge).toBeVisible();
  const text = await badge.textContent();
  expect(text.trim()).toBe('Verified');
});

test('status: org-chart section has status badge Needs Human Gate', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const badge = page.locator('[data-resource-id="org-chart"] .status-badge');
  await expect(badge).toBeVisible();
  const text = await badge.textContent();
  expect(text.trim()).toBe('Needs Human Gate');
});

test('status: asana section has status badge System Candidate', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const badge = page.locator('[data-resource-id="asana"] .status-badge');
  await expect(badge).toBeVisible();
  const text = await badge.textContent();
  expect(text.trim()).toBe('System Candidate');
});

test('verify: meeting-notes has 3 verification checklist items', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const items = page.locator('[data-resource-id="meeting-notes"] .verification-list li');
  await expect(items).toHaveCount(3);
});

test('verify: verification items have disabled checkboxes', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const checkbox = page.locator('[data-resource-id="meeting-notes"] .verification-list input[type="checkbox"]').first();
  await expect(checkbox).toBeDisabled();
});

test('chips: quick-ref table type cells contain chip spans not raw text', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  // Primary type chip for row 1 (meeting-notes) should be COWORK chip
  const chip = page.locator('#catalog-content table tbody tr:first-child .chip').first();
  await expect(chip).toBeVisible();
});

test('chips: HUMAN+COWORK not present in table cell text', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const tableCells = await page.locator('#catalog-content table td').allTextContents();
  const joined = tableCells.join(' ');
  expect(joined).not.toContain('HUMAN+COWORK');
  expect(joined).not.toContain('COWORK+CLAUDECODE');
});

test('state-fallback: state.json 404 shows placeholder not crash', async ({ page }) => {
  await page.route('**/resources-state.json', route => route.fulfill({ status: 404 }));
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const h3Count = await page.locator('#catalog-content h3').count();
  expect(h3Count).toBeGreaterThanOrEqual(9);
  // Badges should show placeholder
  const badge = page.locator('.status-badge').first();
  const badgeText = await badge.textContent();
  expect(badgeText.trim().length).toBeGreaterThan(0); // shows something
});
```

## 實作要點

### resources-loader.js 重構後結構

目標：< 300 行，每個函式 < 50 行，6 職責明確分開：

```
ResourcesLoader._state = {};     // 全域 state

ResourcesLoader.init()           // 入口：fetchAll + initSearchPanel（不變）
ResourcesLoader.fetchAll()       // 職責：fetch md + json（Promise.all）→ renderCatalog
ResourcesLoader.renderCatalog(md)  // 職責：marked.parse → inject → 後處理 → nav
  └── calls: enrichDom, rewriteNodeRefs, tagTier3, renderTypeChips, buildNav, initScrollSpy
ResourcesLoader.enrichDom(root)  // 職責：state badge + verify checklist（讀 _state）
ResourcesLoader.rewriteNodeRefs(root) // 職責：preDev:N → <a>（Phase 4 已實作）
ResourcesLoader.tagTier3(root)        // 職責：Tier 3 wrapper（Phase 5 已實作）
ResourcesLoader.renderTypeChips(root) // 職責：table type 欄 → chip spans
ResourcesLoader.buildNav()            // 職責：sidebar nav（不變）
ResourcesLoader.initScrollSpy()       // 職責：scroll spy（不變）
ResourcesLoader.initSearchPanel()     // 職責：Ctrl+K search（不變）
```

### enrichDom 實作

```js
ResourcesLoader.enrichDom = function(root) {
  var state = ResourcesLoader._state || {};
  var h3s = root.querySelectorAll('h3');
  h3s.forEach(function(h3) {
    var id = h3.id;   // marked headerIds assigns id from h3 text
    // Find matching state key by id or by checking resource id mapping
    // id format from marked: e.g. "1-會議記錄" or "meeting-notes" depending on h3 text
    // We need to map h3 id → resource key in state.json
    // Strategy: attach data-resource-id to the wrapper div we insert
    var resourceKey = ResourcesLoader._findResourceKey(id, h3.textContent);
    if (!resourceKey) return;
    var entry = state[resourceKey] || { status: '—', verification: [] };

    var wrapper = document.createElement('div');
    wrapper.setAttribute('data-resource-id', resourceKey);
    wrapper.className = 'resource-meta';

    // Status badge
    var badge = document.createElement('span');
    badge.className = 'status-badge status-' + entry.status.toLowerCase().replace(/\s+/g, '-');
    badge.textContent = entry.status;
    wrapper.appendChild(badge);

    // Verification list
    if (entry.verification && entry.verification.length > 0) {
      var ul = document.createElement('ul');
      ul.className = 'verification-list';
      entry.verification.forEach(function(item) {
        var li = document.createElement('li');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.disabled = true;
        li.appendChild(cb);
        li.appendChild(document.createTextNode(' ' + item));
        ul.appendChild(li);
      });
      wrapper.appendChild(ul);
    }

    // Insert after h3
    if (h3.nextSibling) {
      h3.parentNode.insertBefore(wrapper, h3.nextSibling);
    } else {
      h3.parentNode.appendChild(wrapper);
    }
  });
};

ResourcesLoader._findResourceKey = function(h3Id, h3Text) {
  var keyMap = {
    '會議記錄': 'meeting-notes',
    '工作計劃書': 'work-plan',
    '簡報': 'presentation',
    'WBS': 'wbs',
    '組織架構': 'org-chart',
    'Prototype': 'prototype',
    'Sprint': 'sprint-plan',
    'ASANA': 'asana',
    '里程碑': 'milestone-reminder'
  };
  var text = h3Text.trim();
  for (var key in keyMap) {
    if (text.indexOf(key) !== -1) return keyMap[key];
  }
  return null;
};
```

### renderTypeChips 實作

```js
ResourcesLoader.renderTypeChips = function(root) {
  var chipColors = {
    'COWORK': 'cowork', 'HUMAN': 'human', 'CLAUDECODE': 'claudecode',
    'DECISION': 'decision', 'SYSTEM': 'system'
  };
  var rows = root.querySelectorAll('table tbody tr');
  rows.forEach(function(row) {
    var cells = row.querySelectorAll('td');
    // Primary type = cells[4], Support = cells[5] (0-indexed, after # id name tier)
    // Note: table columns: # | id | 資源 | Tier | Primary type | Support | 對應節點 | Artifact | Status
    // indices:             0   1    2     3      4               5         6          7          8
    [4, 5].forEach(function(ci) {
      var cell = cells[ci];
      if (!cell) return;
      var text = cell.textContent.trim();
      if (!text || text === '—') return;
      cell.textContent = '';
      text.split(/[/\s]+/).forEach(function(part) {
        var upper = part.trim().toUpperCase();
        if (!upper || upper === '—') return;
        var span = document.createElement('span');
        span.className = 'chip type-' + (chipColors[upper] || 'default');
        span.textContent = upper;
        cell.appendChild(span);
        cell.appendChild(document.createTextNode(' '));
      });
    });
  });
};
```

### style-resources.css 補充

```css
/* Status badges */
.status-badge {
  display: inline-block;
  font-size: var(--text-sm, 11px);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  margin-bottom: var(--sp-2, 8px);
}
.status-verified       { background: #D1FAE5; color: #065F46; }
.status-needs-human-gate { background: #FEF3C7; color: #92400E; }
.status-system-candidate { background: #EDE9FE; color: #5B21B6; }
.status-draft          { background: #F3F4F6; color: #374151; }
.status-deprecated     { background: #FEE2E2; color: #991B1B; text-decoration: line-through; }
[data-theme="dark"] .status-verified        { background: #064E3B; color: #6EE7B7; }
[data-theme="dark"] .status-needs-human-gate { background: #78350F; color: #FCD34D; }
[data-theme="dark"] .status-system-candidate { background: #3730A3; color: #C4B5FD; }
[data-theme="dark"] .status-draft            { background: #1F2937; color: #9CA3AF; }

/* Verification list */
.verification-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--sp-4, 16px) 0;
  font-size: var(--text-sm, 12px);
  color: var(--text-faint, #6B7280);
}
.verification-list li {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 3px 0;
}
.verification-list input[type="checkbox"] {
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: var(--accent-dark, #3B82F6);
}

/* Type chips */
.chip { display: inline-block; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px; letter-spacing: 0.03em; }
.type-cowork     { background: #DBEAFE; color: #1E40AF; }
.type-human      { background: #FCE7F3; color: #9D174D; }
.type-claudecode { background: #D1FAE5; color: #065F46; }
.type-decision   { background: #FEF3C7; color: #92400E; }
.type-system     { background: #F3E8FF; color: #6D28D9; }
.type-default    { background: #F3F4F6; color: #374151; }
[data-theme="dark"] .type-cowork     { background: #1E3A5F; color: #93C5FD; }
[data-theme="dark"] .type-human      { background: #500724; color: #FBCFE8; }
[data-theme="dark"] .type-claudecode { background: #064E3B; color: #6EE7B7; }
[data-theme="dark"] .type-decision   { background: #78350F; color: #FCD34D; }
[data-theme="dark"] .type-system     { background: #2E1065; color: #DDD6FE; }
```

## Verify 命令

```powershell
# 新 8 測試
npx playwright test tests/e2e/status-and-verify.spec.js --reporter=list
# 預期 8/8 綠

# 全套
npx playwright test --reporter=list
# 預期 48/48 綠（原 36 + 新 12：state-merge 5 + no-cdn 3 + noscript 1 + schema-render 6 + deep-link 6 + tier3 5 + status-verify 8 = 34，但部分重疊，以實際跑出來為準）

# flake
npx playwright test --repeat-each=3

# loader 行數
(Get-Content assets/resources-loader.js).Count
# 應 < 300

# 每個函式行數（手動數，或 grep function 定義再比對）
```

## 4 Agent Review Prompts

**code-reviewer：**
```
Step 06 renderer integration review

交付：resources-loader.js（完整重構），style-resources.css（badge + chip + verify）
git diff: [step-06 commit diff]
測試：全部 48/48 綠

重點：
1. _findResourceKey 用 textContent indexOf 做 key 對應 — 是否夠健壯？如果 h3 text 是「1. 會議記錄」，indexOf('會議記錄') 應 OK，確認。
2. enrichDom 在 h3.nextSibling 後插入 wrapper — 如果 h3 後緊接 table（速查表 H2 下的 table），會不會誤插？（enrichDom 只處理 h3，速查表在 h2 下，h2 不在 enrichDom 中 — 確認）
3. renderTypeChips 的 cell index (4, 5) — 是否對應正確的 Primary type / Support 欄？（速查表欄位 0-indexed: # id 資源 Tier Primary Support 對應節點 Artifact Status = 0 1 2 3 4 5 6 7 8）
4. 所有新函式 commit message 引用所有修復的 priority (priority #2, #6, #7)？
5. 無 TODO / FIXME？
```

**test-runner：**
```
Step 06 test runner

全套測試 48/48。

1. 所有測試 --repeat-each=3 無 flake（特別是 enrichDom 相關 — 依賴 state.json fetch timing）
2. state-fallback test（test-8）：mock 404 後 catalog 仍渲染，badge 顯示 '—' — 測試是否覆蓋 '—' 佔位符字串？
3. renderTypeChips test — 測試用 `page.locator('.chip').first()` 是否夠精確？是否可能匹配到其他 chip（如 status badge 若有 .chip class）？
4. 是否有任何 v1 測試因速查表欄位改動（column index 變）而失敗？
```

**performance-investigator：**
```
Step 06 final performance

resources-loader.js 重構後：fetchAll → renderCatalog 序列（marked.parse + enrichDom + rewriteNodeRefs + tagTier3 + renderTypeChips + buildNav）。

1. 各函式的 performance.now() 量測（enrichDom / renderTypeChips / rewriteNodeRefs 各自）— 哪個最慢？是否全部 < 50ms？
2. FCP（go to resources.html → h3 visible）是否 < 1.5s（local server）？
3. woff2 總大小最終確認 < 400KB？
4. 沒有任何 layout thrashing（enrichDom / renderTypeChips 批次操作 vs 逐行 reflow）？
```

**refactor-architect：**
```
Step 06 final refactor

1. resources-loader.js 行數 < 300？列出各函式行數。
2. 所有函式 < 50 行？哪個最接近上限？
3. 6 職責（fetch / parse+render / enrich / nav / theme / search）是否清晰分離？有無一個函式橫跨 2+ 職責？
4. _state 全域暴露在 window.ResourcesLoader._state — 是否應改為 closure 私有？（YAGNI：Phase 6 已用，若未來 state 同步需從外部讀，保持公開 OK，但需在 code 中說明意圖）
5. _findResourceKey 的 keyMap 是 magic string 表 — 是否應提取為常數或獨立設定？
```

## Strict Pass Criteria

- `npx playwright test --repeat-each=3` → 全綠（N×3 次）
- `(Get-Content assets/resources-loader.js).Count` → < 300
- 視覺驗收清單（手動）：
  - `http://localhost:8080/resources.html`：速查表 type 欄有 chip，每節有 badge + verify list，Tier 3 橘框黃底
  - 點 `preDev:2` → 新分頁 dashboard，preDev-2 節點橘色脈衝
  - dark mode toggle → 全色正常
  - Ctrl+K 搜尋「會議」→ 結果出現 → Enter 跳節
  - 關 JS → noscript banner 出現
  - 攔截 CDN → 仍正常渲染
- 4 agents 全 PASS
