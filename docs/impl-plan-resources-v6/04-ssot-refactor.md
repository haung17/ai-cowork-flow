# Step 04: SSOT — interactions.js 表格 render from data.js

**Goal**: 砍 interactions.js 三章節 hardcoded HTML `<table>`；data.js 加 `sectionTables` schema；寫 `renderTable(sectionId)` 從 data.js 產生 DOM 並插入。

## 前置條件

- Step 01-03 全 committed，133/133 pass
- interactions.js 目前有三段 `<table>` hardcoded HTML（pre-dev / mid-dev / post-dev）
- Rule (b)：Step 04 後 `git grep "<table>" -- assets/interactions.js` = 0

## 變更清單

### assets/data.js — 新增 sectionTables

頂層加 `AppData.sectionTables`：

```js
AppData.sectionTables = {
  'pre-dev': {
    columns: ['#', '節點', '模式', '工作內容'],
    rows: [
      ['1', '客戶訪談 / 需求收集', '人工為主', '...'],
      // ... 全部 preDev 表格 rows
    ]
  },
  'mid-dev': {
    columns: ['#', '節點', '模式', '工作內容'],
    rows: [...]
  },
  'post-dev': {
    columns: ['#', '節點', '模式', '工作內容'],
    rows: [...]
  }
};
```

- `rows` 為 `string[][]`（純字串，無 HTML tag）
- 同一 section 若需多張表（如 mid-dev 有分類表），以 `extraTables` 陣列附加：`{ columns, rows }[]`

### assets/interactions.js — renderTable()

```js
function renderTable(sectionId) {
  var data = window.AppData.sectionTables[sectionId];
  if (!data) return '';
  return buildTableHtml(data.columns, data.rows);
}

function buildTableHtml(columns, rows) {
  var thead = '<thead><tr>' + columns.map(function(c){ return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead>';
  var tbody = '<tbody>' + rows.map(function(row){
    return '<tr>' + row.map(function(cell){ return '<td>' + esc(cell) + '</td>'; }).join('') + '</tr>';
  }).join('') + '</tbody>';
  return '<table>' + thead + tbody + '</table>';
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
```

- `buildContent()` 中三章節 `<table>...</table>` 字面值全部改為 `renderTable('pre-dev')` 等呼叫
- 刪除所有 `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>` 字面值（留在 buildTableHtml 內的除外）

### 目標

- `git grep "<table>" -- assets/interactions.js` 只在 `buildTableHtml` 內部找到（不在 buildContent 字面值）
- Rule (b)：`buildContent` 無任何 HTML 表格字面值

## TDD

檔案：`tests/e2e/v6-step04-ssot.spec.js`（5 tests）

1. `interactions.js` `buildContent` 無直接 `<table>` 字面值（透過 fetch interactions.js 源碼確認）
2. dashboard.html 三章節 section 內各有至少一個 `<table>` 元素（render 結果）
3. pre-dev table tbody row 數 = `AppData.sectionTables['pre-dev'].rows.length`
4. mid-dev table thead th 文字陣列 = `AppData.sectionTables['mid-dev'].columns`
5. perf：100 rows 假資料 `renderTable` < 50ms（`performance.now()` in page）

## 注意事項

- mid-dev 有兩張表（節點列表 + 分類流向表），`extraTables` 或第二個 key 處理
- `esc()` 防 XSS：所有 cell 值需 escape；不插入 raw HTML
- Step 04 review 重點：Rule (b) grep 0；`roles[]` contract（只存 ROLE 值）
- `interactions.js` 同步更新 lightbox img src（Step 07 做，此步不動）
