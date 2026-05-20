# Step 06: Cross-tab Theme Sync

**Goal**: `dashboard.html` + `resources.html` 各加 `storage` event listener；A tab 切 dark → B tab 自動同步。

## 變更清單

### dashboard.html — inline script 加 storage listener

在 `theme-toggle` click listener 後加：

```js
window.addEventListener('storage', function(e) {
  if (e.key === 'cowork-theme' && e.newValue) {
    document.documentElement.setAttribute('data-theme', e.newValue);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = e.newValue === 'dark' ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', e.newValue === 'dark' ? '切換為淺色主題' : '切換為深色主題');
    }
  }
});
```

### governance.html — 同 resources.html pattern（refactor-architect 審查補加）

```js
window.addEventListener('storage', function(e) {
  if (e.key === 'cowork-theme' && e.newValue) {
    document.documentElement.setAttribute('data-theme', e.newValue);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = e.newValue === 'dark' ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', e.newValue === 'dark' ? '切換為淺色主題' : '切換為深色主題');
    }
  }
});
```

### resources.html — inline script 加 storage listener

在 `theme-toggle` click listener 後加：

```js
window.addEventListener('storage', function(e) {
  if (e.key === 'cowork-theme' && e.newValue) {
    document.documentElement.setAttribute('data-theme', e.newValue);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = e.newValue === 'dark' ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', e.newValue === 'dark' ? '切換為淺色主題' : '切換為深色主題');
    }
  }
});
```

## TDD

檔案：`tests/e2e/v6-step06-theme-sync.spec.js`（3 tests）

1. 同 context 兩個 page（`/dashboard.html` + `/resources.html`）：page A 切 dark → 200ms 內 page B `data-theme` = 'dark'
2. 反向：page B 切 light → page A 同步
3. 後開的 page 讀 localStorage 直接呈現正確 theme

## Rule (h)

Step 06 後：`addEventListener('storage'` 出現在 `dashboard.html` + `resources.html` 兩個都要。
`governance.html` 亦補加（refactor-architect 審查發現缺漏）；`presentation.html` 排除（單 tab slideshow，cross-tab sync 無意義）。

## 注意事項

- `storage` event 只在**其他** tab 更新 localStorage 時觸發，同 tab 不觸發（瀏覽器標準行為）
- Playwright 用 `context.newPage()` 在同 BrowserContext，storage event 可跨 page 觸發
- `e.newValue` 可能為 `null`（item 被刪除時）→ guard `&& e.newValue`
- dashboard.html 使用 `const` (ES6)，resources.html 使用 `var` — storage listener 與各自風格一致
