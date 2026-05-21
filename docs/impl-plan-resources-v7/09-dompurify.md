# Step 09 — DOMPurify Sanitize + Schema Validation

## Goal

`resources.html` 加 DOMPurify CDN；`resources-loader.js` fetchAll 加 sanitize + schema section check；載入失敗時顯示明確錯誤訊息。

## 修改清單

| 檔案 | 變動 |
|------|------|
| `resources.html` | 加 `<script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js">` before resources-loader.js |
| `assets/resources-loader.js` | `renderCatalog` 加 DOMPurify.sanitize；`fetchAll` 加 schema section 驗證；error 文字改明確 |

## resources.html — CDN 順序

```html
<script src="assets/vendor/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
<script src="assets/resources-loader.js"></script>
```

## resources-loader.js — renderCatalog 修改

```js
ResourcesLoader.renderCatalog = function(md) {
  if (!window.DOMPurify) {
    ResourcesLoader._showError('sanitizer load fail：DOMPurify 未載入，無法安全渲染內容。');
    return;
  }
  var requiredSections = ['## AI 使用決策矩陣', '## 9 個資源詳述', '## Tier 4'];
  for (var i = 0; i < requiredSections.length; i++) {
    if (md.indexOf(requiredSections[i]) === -1) {
      ResourcesLoader._showError('Schema mismatch：缺少必要章節「' + requiredSections[i] + '」');
      return;
    }
  }
  var t0 = performance.now();
  var rawHtml = marked.parse(md);
  ResourcesLoader._parseTime = performance.now() - t0;
  var cleanHtml = DOMPurify.sanitize(rawHtml);
  var content = document.getElementById('catalog-content');
  content.innerHTML = cleanHtml;
  // ... rest unchanged
```

## _showError helper

```js
ResourcesLoader._showError = function(msg) {
  var errEl = document.getElementById('catalog-error');
  if (!errEl) return;
  errEl.classList.remove('hidden');
  var p = errEl.querySelector('p');
  if (p) p.textContent = msg;
};
```

## Tests (`v7-step09-sanitize.spec.js`) — 5 tests

1. `window.DOMPurify` 在 resources.html 載入後存在
2. fixture md 含 `<script>alert(1)</script>` → `marked.parse + DOMPurify.sanitize` 後 DOM 無 script tag
3. 故意刪除 `## Tier 4` section → `.catalog-error` 可見且文字含「Schema mismatch」
4. DOMPurify mock 為 null → `.catalog-error` 可見且文字含「sanitizer load fail」
5. 正常 md 渲染後 `#catalog-content h2` 數量 ≥ 3

## Notes for Step 10

- Step 10 Status badge：`enrichDom` 加 status-badge + meta row + 點擊跳 governance.html
- DOMPurify 不影響 enrichDom（DOM 操作，非 innerHTML）
- Schema validation 需要 resources-catalog.md 含「## 9 個資源詳述」—— 確認現有文件已有此標題
