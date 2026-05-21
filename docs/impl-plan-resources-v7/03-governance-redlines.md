# Step 03 — governance 加 3 條紅線

## Goal

`governance.md` 規則表新增規則 8/9/10；`governance.html` sidebar nav 更新計數；`governance-loader.js` post-process rendered table rows → `.governance-rule` class + `.rule-new` badge（前 7 條無 badge，後 3 條有）。

## 修改清單

| 檔案 | 變動 |
|------|------|
| `governance.md` | 標題 `7 條硬規則` → `10 條硬規則`；表格新增規則 8/9/10 |
| `governance.html` | sidebar nav 文字 `7 條硬規則` → `10 條硬規則` |
| `assets/governance-loader.js` | render 後 post-process：hard-rules table tbody `<tr>` 加 `.governance-rule`；最後 3 行第一欄 td 後加 `<span class="rule-new">v3.8 新增</span>` |
| `assets/style-resources.css` | 加 `.rule-new` chip 樣式 |

## 規則內容

| # | 規則 | 說明 |
|---|------|------|
| 8 | **NDA / 資安審查紅線** | 客戶接洽確認後，進入任何實作前，必須完成 NDA 簽署 + 個資/敏感資料識別。識別為敏感的資料不得進入任何 AI prompt。 |
| 9 | **AI Code 測試門檻** | Claude Code 產出代碼，工程師 Code Review 前必須通過自動化單元測試覆蓋率 ≥ 80%（或靜態分析 pass）；不得繞過此門檻。 |
| 10 | **變更管理切換** | CR 進來時，由工程師決定「AI 重生（重新生成）」vs「人工修補」；禁止 AI 自主判斷重構策略或範疇。 |

## governance-loader.js post-process 邏輯

```js
// After content.innerHTML = marked.parse(md)
var hardRulesSection = content.querySelector('#hard-rules');
if (hardRulesSection) {
  var table = hardRulesSection.nextElementSibling;
  // nextSibling may be table-wrapper div; keep looking
  while (table && table.tagName !== 'TABLE') table = table.nextElementSibling;
  if (table) {
    var rows = table.querySelectorAll('tbody tr');
    var total = rows.length;
    rows.forEach(function(tr, i) {
      tr.classList.add('governance-rule');
      if (i >= total - 3) {
        var firstTd = tr.querySelector('td');
        if (firstTd) {
          var badge = document.createElement('span');
          badge.className = 'rule-new';
          badge.textContent = 'v3.8 新增';
          firstTd.appendChild(badge);
        }
      }
    });
  }
}
```

**注意**：table wrapper div 是在 post-process 之前插入的（現有程式碼），所以 `#hard-rules` 後的 nextElementSibling 可能是 `div.table-wrapper`，需要往下找 `TABLE` tag。確保 post-process 在 table-wrapper 插入後執行，或直接用 wrapper 內的 table。

最安全做法：先 post-process `.governance-rule`，再執行 table-wrapper 包裝——或改為在 wrapper 包裝後查找 `content.querySelectorAll('table')[0]`（因為 hard-rules 是第一個 table）。

## Tests (`v7-step03-redlines.spec.js`) — 4 tests

1. `governance.md` 含「規則 8」「規則 9」「規則 10」
2. `governance.html` `.governance-rule` 元素 = 10
3. 3 個 `.rule-new` chip 可見
4. 規則 8 內文含「NDA」；規則 9 含「80%」；規則 10 含「AI 重生」

## Notes for Step 04

- Step 04 preDev NDA Gate：新節點 `predev-nda-gate` 插入 node 1 (客戶接洽) 與 node 2 (會議記錄) 之間
- preDev 節點座標：目前 node 1 y=2、node 2 y=11，節點 y 間距 9 — 可插 y=6 或 y=7
- Step 02 review note：y-density 安全；新節點加在既有序列末尾 or 使用 x 偏移
