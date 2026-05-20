# Step 05: Search Debounce

**Goal**: `resources-loader.js` `_handleSearchInput` 包 250ms trailing debounce；連打 10 字不觸發多次搜尋。

## 變更清單

### assets/resources-loader.js

加 utility function（在 `_handleSearchInput` 定義前）：

```js
ResourcesLoader._debounce = function(fn, ms) {
  var t;
  return function() {
    var args = arguments, ctx = this;
    clearTimeout(t);
    t = setTimeout(function() { fn.apply(ctx, args); }, ms);
  };
};
```

將 input 事件綁定改為：

```js
// Anonymous wrapper: keeps _handleSearchInput as late-bound lookup so tests can stub the property.
input.addEventListener('input', ResourcesLoader._debounce(function() { ResourcesLoader._handleSearchInput(input, results, close); }, 250));
```

原本直接綁定 `_handleSearchInput` 的行改掉。

> **實作偏差說明**：計畫原稿建議 `.bind(ResourcesLoader)`，但使用 anonymous wrapper 才能讓測試透過 property assignment（`ResourcesLoader._handleSearchInput = stub`）攔截呼叫。若使用 `.bind`，listener attach 時已綁定原始 reference，測試 stub 無效。

## TDD

檔案：`tests/e2e/v6-step05-debounce.spec.js`（3 tests）

1. 連打 10 字（間隔 20ms）→ 300ms 後搜尋結果只更新過 ≤ 2 次
2. 最後一字輸入後 ≤ 300ms 內結果出現（trailing edge 有觸發）
3. 完整字串「工程師」輸入後結果含相關內容（功能不退化）

## Rule (e)

Step 05 後：搜尋 burst test（10 字 200ms 內）→ `_handleSearchInput` ≤ 2 次觸發。

## 注意事項

- debounce 為 trailing edge only（不需要 leading edge）
- 250ms > 20ms 打字間隔 → burst 10 字只觸發最後一次
- anonymous wrapper（非 `.bind`）確保 `_handleSearchInput` 為 late-bound lookup，測試可 stub
