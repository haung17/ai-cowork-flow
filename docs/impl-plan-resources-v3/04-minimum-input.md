# Step 04 — Minimum Input 欄位

**目標**：每個資源 H3 下方加 `**Minimum Input：**` 段落 + bullet list；loader 標記 `.minimum-input-list` class；CSS 加底色。

---

## Deliverables

| 檔案 | 動作 |
|------|------|
| `tests/e2e/minimum-input.spec.js` | 新建（RED → GREEN） |
| `resources-catalog.md` | 9 個資源各加 `**Minimum Input：**` 區塊（3-5 bullet） |
| `assets/resources-loader.js` | 新增 `tagMinimumInputLists(root)`，在 `enrichDom` 後呼叫 |
| `assets/style-resources.css` | 新增 `.minimum-input-list` 樣式 |

---

## RED 測試（minimum-input.spec.js）

4 個測試：
1. 9 個 H3 都有 Minimum Input 文字
2. 每個資源的 minimum-input-list ≥ 2 items
3. meeting-notes minimum-input-list ≥ 3 items（內容正確性）
4. `.minimum-input-list` class 出現 ≥ 9 次

---

## 實作細節

### resources-catalog.md 結構

在每個資源的 `**Human Gate：**` 行之後加：

```markdown
**Minimum Input：**
- 條件 1（缺此資料不可跑）
- 條件 2
- 條件 3
```

markdown 渲染後：`<p><strong>Minimum Input：</strong></p>` + `<ul>...</ul>`

### tagMinimumInputLists

```js
ResourcesLoader.tagMinimumInputLists = function(root) {
  root.querySelectorAll('p').forEach(function(p) {
    var s = p.querySelector('strong');
    if (!s || !s.textContent.includes('Minimum Input')) return;
    var next = p.nextElementSibling;
    if (next && next.tagName === 'UL') next.classList.add('minimum-input-list');
  });
};
```

在 `renderCatalog` 中，`enrichDom` 之後呼叫：
```js
ResourcesLoader.tagMinimumInputLists(content);
```

### CSS

```css
.minimum-input-list {
  background: var(--bg-warn-tint, #FFFBEB);
  border-left: 3px solid var(--accent-warn, #FB923C);
  padding: var(--sp-3) var(--sp-3) var(--sp-3) var(--sp-8);
  border-radius: 0 var(--r-sm) var(--r-sm) 0;
  margin: var(--sp-2) 0 var(--sp-4) 0;
}
```

---

## Minimum Input 內容（9 資源）

| 資源 | Minimum Input（3-5 條） |
|------|------------------------|
| 會議記錄 | 完整逐字稿或錄音檔；與會者名單含角色；會議目的與議程 |
| 工作計劃書 | SOW in-scope / out-of-scope 初稿；交期；預算區間；客戶背景 |
| 簡報 | 工作計劃書或 SOW 摘要（≥3 功能點）；受眾定義；場合目的 |
| WBS | SOW Scope list；交付物清單；團隊角色配置；技術 stack |
| 組織架構 | 我方團隊成員名單含角色；客戶端窗口（業務+技術+決策）；專案規模（人月） |
| Prototype | 功能清單（≥2 頁面）；使用者旅程；技術限制（框架、螢幕尺寸） |
| Sprint 規劃 | WBS 任務清單（含工時+依賴）；團隊 velocity；Sprint 長度；不可移動里程碑日期 |
| ASANA | Sprint 規劃表或 WBS；成員帳號（email 或顯示名稱，格式一致）；截止日期（YYYY-MM-DD）；確認無重複 task |
| 里程碑提醒 | 里程碑清單（名稱+日期，≥2 個）；日期格式 YYYY-MM-DD；時區 Asia/Taipei；與 ASANA 里程碑名稱一致 |

---

## 4-Agent Review 條件

| Agent | 條件 |
|-------|------|
| code-reviewer | `resources-loader.js` 無超過 302 行；`tagMinimumInputLists` 只處理 `<p><strong>` 後接 `<ul>` 的結構 |
| test-runner | 全套 ≥ 93/93（原 89 + 新 4）；`--repeat-each=3` minimum-input.spec.js 12/12 |
| perf | 無新 DOM query 在 scroll/resize handler 中；`tagMinimumInputLists` 只在初始 render 呼叫一次 |
| refactor-architect | `tagMinimumInputLists` 不重複 `tagTier3/4` 的邏輯；可獨立測試 |

---

## Commit

`feat(step-04): add Minimum Input sections to all 9 resources + .minimum-input-list CSS`
