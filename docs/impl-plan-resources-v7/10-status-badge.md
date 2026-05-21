# Step 10 — Status Badge 顯著化

## Goal

每個資源 H3 旁加 prominent status badge + 可用程度/下一步 meta row；點 badge 跳 `governance.html#status-promotion`。governance-loader.js 加 id 補丁（marked 不解析 `{#id}`）。

## 修改清單

| 檔案 | 變動 |
|------|------|
| `assets/resources-loader.js` | `enrichDom` 加 status-meta row；badge click → governance.html#status-promotion；`_STATUS_MAP` 常數 |
| `assets/governance-loader.js` | rendered 後找 "Status 升等規則摘要" h2 → 加 `id="status-promotion"` |
| `assets/style-resources.css` | `.status-meta` row 樣式 |

## Status Mapping (`_STATUS_MAP`)

```js
ResourcesLoader._STATUS_MAP = {
  DraftReady:       { usability: '內部草稿，勿對外交付',       nextStep: '完成假案測試後升 InternallyTested' },
  InternallyTested: { usability: '可對內使用，不可直接送客戶',  nextStep: '客戶測試通過後升 ClientTested' },
  ClientTested:     { usability: '已通過客戶驗收，可正式使用', nextStep: '維持狀態或視需要回退' },
  NeedsHumanGate:   { usability: '必須人工 Gate 才可使用',     nextStep: '完成 Gate checklist' },
  NotRecommended:   { usability: '不建議使用',                 nextStep: '查看治理說明後評估' },
};
```

## enrichDom 修改

badge 加 `cursor: pointer` + click listener → `window.open('governance.html#status-promotion', '_blank')`

status-meta row：
```html
<div class="status-meta">
  可用程度：{usability} · 下一步：{nextStep}
</div>
```
插在 badge `afterend`，再插 meta row。

## governance-loader.js 補丁

```js
// 在 table wrap 前加：
content.querySelectorAll('h2').forEach(function(h) {
  if (h.textContent.indexOf('Status 升等規則摘要') !== -1) h.id = 'status-promotion';
});
```

## Tests (`v7-step10-status.spec.js`) — 5 tests

1. 9 個資源全有 `.status-badge` 元素
2. badge 的 CSS class 含 `status-draftready`（或對應 slug）
3. `.status-meta` row 顯示「可用程度」與「下一步」
4. 點 badge → 新頁面 URL 含 `governance.html`
5. `ResourcesLoader._STATUS_MAP` 涵蓋 5 個 status key

## Notes for Step 11

- Step 11 Dashboard `⊟`→文字 + decision chips
- `_STATUS_MAP` 不需在 Step 11 動
