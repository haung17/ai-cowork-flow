# Step 07 — governance.html + Sidebar Entry + 全測收尾

**目標**：新建 `governance.html`（複用 sidebar shell，fetch governance.md）；resources.html sidebar 加「治理原則」入口（第一項，紅色）。

---

## Deliverables

| 檔案 | 動作 |
|------|------|
| `tests/e2e/governance-page.spec.js` | 新建（RED → GREEN） |
| `governance.html` | 新建（sidebar shell + governance-loader.js） |
| `assets/governance-loader.js` | 新建（獨立 loader，fetch governance.md，無 state.json） |
| `resources.html` | sidebar nav 加第一項「治理原則」連結（紅底白字） |
| `assets/style-resources.css` | `.governance-link` 樣式 |

---

## governance.html 設計

- 複用 `resources.html` 的 sidebar shell HTML 結構
- 不引用 `resources-loader.js`、`resources-state.json`
- 引用 `assets/governance-loader.js`（獨立）
- sidebar 第一項改為「← 返回資源庫」

## governance-loader.js

```js
window.GovernanceLoader = {};
GovernanceLoader.init = function() {
  fetch('governance.md').then(r => r.text()).then(md => {
    document.getElementById('catalog-content').innerHTML = marked.parse(md);
  }).catch(() => {
    document.getElementById('catalog-error').classList.remove('hidden');
  });
};
```

## resources.html Sidebar 修改

在 `<ul id="nav-list">` 之前加：

```html
<ul class="nav-list governance-nav">
  <li class="nav-item">
    <a href="governance.html" class="governance-link" aria-label="治理原則">
      ⚠ 治理原則
    </a>
  </li>
</ul>
```

## CSS

```css
.governance-link {
  display: flex;
  align-items: center;
  padding: 8px var(--sp-4);
  background: var(--accent-danger, #DC2626);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  border-radius: 0;
}
.governance-link:hover { background: #B91C1C; color: #fff; }
```

---

## TDD

`tests/e2e/governance-page.spec.js`：
1. governance.html 可開啟
2. governance.html 有 7 條硬規則 visible
3. sidebar 有「返回資源庫」連結
4. resources.html sidebar 第一個 a 是「治理原則」

---

## 4-Agent Review 條件

| Agent | 條件 |
|-------|------|
| code-reviewer | governance-loader.js 不引用 resources-loader.js；無交叉污染 |
| test-runner | 全套 ≥ 104/104（100 + 新 4）；無 flake |
| perf | governance.html render 在 5s 內（marked.parse 足夠快） |
| refactor-architect | governance-loader.js < 30 行；sidebar governance entry 不破壞既有 nav |

---

## Commit

`feat(step-07): governance.html + sidebar governance entry (v3 complete)`
