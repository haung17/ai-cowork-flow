# Step 01 — Schema rewrite + resources-state.json

**Priority 修復**：#1（type schema）+ #6（status 欄位）+ #7（verification）

## 目標

1. 速查表 type 欄拆成 `Primary type` + `Support type` 兩欄（消除 `HUMAN+COWORK` 複合字串）
2. 速查表補 `id` 欄（作為 state.json key）和 `Status` 欄
3. 新建 `resources-state.json`（9 筆，含 status + verification）
4. resources-loader.js 新增 `fetchAll()` 並行 fetch md + json，state 資料暫存到 `ResourcesLoader._state`

## 交付檔

- `resources-catalog.md`（修改：速查表）
- `resources-state.json`（新建）
- `assets/resources-loader.js`（修改：fetchAll + state 暫存）
- `tests/unit/state-merge.spec.js`（新建）

## TDD — 紅測試

```js
// tests/unit/state-merge.spec.js
const { test, expect } = require('@playwright/test');

test('state-merge: state.json loads and _state is populated', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const state = await page.evaluate(() => window.ResourcesLoader._state);
  expect(state).toBeTruthy();
  expect(Object.keys(state).length).toBe(9);
});

test('state-merge: meeting-notes has status Verified', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const status = await page.evaluate(() => window.ResourcesLoader._state['meeting-notes']?.status);
  expect(status).toBe('Verified');
});

test('state-merge: meeting-notes verification has 3 items', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const v = await page.evaluate(() => window.ResourcesLoader._state['meeting-notes']?.verification);
  expect(Array.isArray(v)).toBe(true);
  expect(v.length).toBe(3);
});

test('state-merge: page DOM has no HUMAN+COWORK substring', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const body = await page.locator('body').textContent();
  expect(body).not.toContain('HUMAN+COWORK');
  expect(body).not.toContain('COWORK+CLAUDECODE');
});

test('state-merge: state.json fetch failure shows placeholder not crash', async ({ page }) => {
  await page.route('**/resources-state.json', route => route.abort());
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  // catalog should still render even without state
  const h3Count = await page.locator('#catalog-content h3').count();
  expect(h3Count).toBeGreaterThanOrEqual(9);
});
```

## 實作要點

### resources-catalog.md 速查表欄位改動

舊：`| # | 資源 | Tier | type | 對應 dashboard 節點 | 一句話 |`

新：
```
| # | id | 資源 | Tier | Primary type | Support | 對應節點 | Artifact | Status |
```

9 列改動：
- 第 5 列：Primary type = `COWORK`，Support = `HUMAN`
- 第 6 列：Primary type = `CLAUDECODE`，Support = `COWORK`
- 其他 7 列：Support 欄留空（`—`）

Status 欄初始值（從 state.json 取，md 先填同樣值方便 grep 驗證）：
1. meeting-notes → `Verified`
2. work-plan → `Verified`
3. presentation → `Verified`
4. wbs → `Verified`
5. org-chart → `Needs Human Gate`
6. prototype → `Needs Human Gate`
7. sprint-plan → `Needs Human Gate`
8. asana → `System Candidate`
9. milestone-reminder → `System Candidate`

### resources-state.json

```json
{
  "meeting-notes": {
    "status": "Verified",
    "verification": [
      "逐字稿是否涵蓋會議完整時長（錄音與文字核對）",
      "決策清單是否標註負責人 + 期限",
      "敏感資訊（薪資、客戶名、報價）是否已脫敏"
    ],
    "lastUpdated": "2026-05-19"
  },
  "work-plan": {
    "status": "Verified",
    "verification": [
      "計劃書範疇是否對齊 SOW（不超不缺）",
      "工時估算是否包含 buffer（建議 20%）",
      "客戶可識別的里程碑是否清楚標出"
    ],
    "lastUpdated": "2026-05-19"
  },
  "presentation": {
    "status": "Verified",
    "verification": [
      "HTML 在目標瀏覽器（Chrome/Edge）無 layout 破版",
      "所有圖片 / 截圖有本地 fallback（不依賴外部 URL）",
      "簡報流程是否符合 Gate preDev:9 的對客戶說明順序"
    ],
    "lastUpdated": "2026-05-19"
  },
  "wbs": {
    "status": "Verified",
    "verification": [
      "所有 WBS 節點可對應到 SOW 工作項目（不多不漏）",
      "工時總和是否在報價合約範圍內",
      "Level 3 任務是否均有指定責任角色"
    ],
    "lastUpdated": "2026-05-19"
  },
  "org-chart": {
    "status": "Needs Human Gate",
    "verification": [
      "每個角色的人員姓名是否已確認（不可空白）",
      "職責邊界是否與 SOW 章節對應",
      "PM 是否 Gate 確認過 client 端窗口"
    ],
    "lastUpdated": "2026-05-19"
  },
  "prototype": {
    "status": "Needs Human Gate",
    "verification": [
      "GPT 產出圖與 Claude Code HTML 轉換後是否視覺一致（截圖比對）",
      "互動邏輯（按鈕 / 表單）是否符合 spec",
      "工程師確認 HTML 可進入 repo 不需重構"
    ],
    "lastUpdated": "2026-05-19"
  },
  "sprint-plan": {
    "status": "Needs Human Gate",
    "verification": [
      "Sprint 速度（velocity）是否已由 PM 拍板",
      "優先序排列是否對齊客戶驗收順序",
      "每個 Sprint 是否有 buffer 任務（不超過 10%）"
    ],
    "lastUpdated": "2026-05-19"
  },
  "asana": {
    "status": "System Candidate",
    "verification": [
      "CSV 欄位格式是否符合 ASANA 匯入 template（Task Name / Assignee / Due Date）",
      "匯入後 assignee 是否正確對應到 ASANA user",
      "重複任務是否有 de-dup 機制（avoid double import）"
    ],
    "lastUpdated": "2026-05-19"
  },
  "milestone-reminder": {
    "status": "System Candidate",
    "verification": [
      "ICS 時區是否正確（Asia/Taipei）",
      "匯入 Google Calendar 後是否出現在正確日期",
      "里程碑名稱是否與工作計劃書一致"
    ],
    "lastUpdated": "2026-05-19"
  }
}
```

### assets/resources-loader.js 修改

在 `ResourcesLoader.init` 改為呼叫 `fetchAll()`：

```js
ResourcesLoader.init = function() {
  ResourcesLoader.fetchAll();
  ResourcesLoader.initSearchPanel();
};

ResourcesLoader.fetchAll = async function() {
  var mdPromise = fetch('resources-catalog.md').then(function(r) {
    if (!r.ok) throw new Error('md HTTP ' + r.status);
    return r.text();
  });
  var statePromise = fetch('resources-state.json').then(function(r) {
    if (!r.ok) return {};
    return r.json();
  }).catch(function() { return {}; });

  try {
    var results = await Promise.all([mdPromise, statePromise]);
    var md = results[0];
    var state = results[1];
    ResourcesLoader._state = state;
    ResourcesLoader.renderCatalog(md);
  } catch (err) {
    document.getElementById('catalog-error').classList.remove('hidden');
    console.error('[ResourcesLoader] fetchAll failed:', err);
  }
};
```

舊的 `loadCatalog` 邏輯移入 `renderCatalog(md)`（signature 變，但內部不動）。

注意：`_state` 暫存但 Phase 6 才用它渲染 badge + checklist。此步只保證 state 正確載入。

## Verify 命令

```powershell
npx playwright test tests/unit/state-merge.spec.js --reporter=list
# 預期 5/5 綠

# flake 驗證
npx playwright test tests/unit/state-merge.spec.js --repeat-each=3 --reporter=list
# 15/15 綠

# 手動確認 md 無複合字串
grep -n "HUMAN+COWORK\|COWORK+CLAUDECODE" resources-catalog.md
# 應無輸出
```

## 4 Agent Review Prompts

**code-reviewer prompt：**
```
Step 01 — schema + state.json review

交付：resources-catalog.md（速查表改欄），resources-state.json（新建），resources-loader.js（fetchAll + _state）
git diff: [step-01 commit diff]
測試結果: 5/5 綠

Review 重點：
1. resources-catalog.md 速查表第 5、6 列 Primary type / Support type 欄拆分是否乾淨？是否還殘留 HUMAN+COWORK 或 COWORK+CLAUDECODE？
2. resources-state.json 的 9 個 id 是否與 catalog 速查表 id 欄完全對應（不多不漏）？
3. fetchAll() 中 state fetch 失敗路徑（catch → return {}）是否真的不會 crash catalog 渲染？
4. commit message 是否引用 priority #1 + #6 + #7？
5. _state 暴露在 window.ResourcesLoader._state 是否為刻意（Phase 6 會用），還是不小心 leak？

嚴格不放行條件（通用）：無 TODO/FIXME；無 breaking change；fetch 失敗有容錯；commit message 含 priority#1
```

**test-runner prompt：**
```
Step 01 test runner review

測試檔：tests/unit/state-merge.spec.js（5 tests）
指令：npx playwright test tests/unit/state-merge.spec.js --repeat-each=3

確認：
1. 所有 5 test 在連跑 3 次（15 runs）均綠（無 flake）
2. test-4（fetch 攔截）是否用 page.route abort 真實模擬 fetch 失敗，而非 mock ResourcesLoader 內部？
3. test-1 從 window.ResourcesLoader._state 讀值，但如果 _state 未 await 就讀，可能有 race condition — 確認 waitForSelector 的時機是否正確？
```

**performance-investigator prompt：**
```
Step 01 performance review

resources-loader.js 改動：fetchAll 改為 Promise.all 並行 fetch md + json。

1. 測量：page.goto('/resources.html') 到 '#catalog-content h3' 出現的時間（原本只 fetch md，現在多 fetch state.json，是否增加 FCP？）
2. resources-state.json 大小是否合理（預期 < 5KB）？
3. 若 state.json fetch 比 md fetch 慢（正常），Promise.all 等待最慢那個 — catalog 渲染是否被 state.json 拖延？如果是，建議改為「md fetch 完先渲染，state fetch 完再 enrich」的分段策略。
```

**refactor-architect prompt：**
```
Step 01 refactor review

resources-loader.js 變更：loadCatalog → fetchAll + renderCatalog split。

1. fetchAll 職責：fetch md + fetch state + 啟動渲染 — 這 3 件事在一個函式是否合理？
2. renderCatalog 是否只做渲染（不做 fetch / 不做 state enrich）？
3. _state 的 assignment 在 fetchAll — 若 Phase 6 的 enrichDom 要用，是否需要 callback 或 event？還是直接讀 _state 就夠？
4. resources-loader.js 目前行數是否還在 300 行以下？
```

## Strict Pass Criteria

- `npx playwright test tests/unit/state-merge.spec.js --repeat-each=3` → 15/15 綠
- `git grep "HUMAN+COWORK" -- resources-catalog.md` → 0 results
- `git grep "COWORK+CLAUDECODE" -- resources-catalog.md` → 0 results
- `node -e "const s = require('./resources-state.json'); console.log(Object.keys(s).length)"` → `9`
- 4 agents 全 PASS
