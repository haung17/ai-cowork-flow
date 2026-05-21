# Step 07 — Tier 4 Sticky Banner + WBS Tier 重分類

## Goal

resources.html 頂部加永久固定 Tier 4 警告 banner（7 項 AI 禁令）；resources-catalog.md WBS 從 Tier 1 升為 Tier 2 + 紅字警語。

## 修改清單

| 檔案 | 變動 |
|------|------|
| `resources.html` | `<main>` 第一個子元素加 `<aside class="tier4-banner" role="alert">` |
| `assets/style-resources.css` | `.tier4-banner` sticky 樣式 |
| `resources-catalog.md` | WBS 標題 Tier 1→Tier 2；加警語段落 |

## resources.html — banner HTML

插在 `<main id="main-content">` 開頭、`#catalog-content` 之前：

```html
<aside class="tier4-banner" role="alert">
  <strong>⚠ AI 禁止執行的 7 項決策（Tier 4 Human-only）：</strong>
  <span class="tier4-items">報價拍板</span>
  <span class="tier4-items">合約簽署</span>
  <span class="tier4-items">SOW 範疇確認</span>
  <span class="tier4-items">CR 批准</span>
  <span class="tier4-items">UAT 驗收判定</span>
  <span class="tier4-items">Production 部署</span>
  <span class="tier4-items">Hotfix 執行</span>
</aside>
```

## CSS — `.tier4-banner`

```css
.tier4-banner {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fef2f2;
  border-bottom: 2px solid #dc2626;
  padding: 8px 16px;
  font-size: var(--text-sm, 12px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
[data-theme="dark"] .tier4-banner {
  background: #3f1b1b;
  border-bottom-color: #f87171;
}
.tier4-items {
  background: #dc2626;
  color: #fff;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  white-space: nowrap;
}
[data-theme="dark"] .tier4-items {
  background: #b91c1c;
}
```

## resources-catalog.md WBS 修改

```markdown
### 4. WBS（Work Breakdown Structure）

**Tier 2: Decision-assisted ｜ type: CLAUDECODE**

> ⚠ **WBS 不得作為對外報價依據**，必須由 PM / 工程師覆核工時後才可用於報價或 SOW。

```

## Tests (`v7-step07-tier4-banner.spec.js`) — 5 tests

1. resources.html DOM 有 `.tier4-banner` 元素
2. banner 文字含「報價」「合約」「UAT」「Production」「Hotfix」「CR」「SOW」7 項
3. banner CSS `position` = sticky
4. resources-catalog.md WBS 區塊含「Tier 2」
5. resources-catalog.md WBS 區塊含「不得作為報價依據」

## Notes for Step 08

- Step 08 Human Gate Checklist：resources-state.json schema 升級 + checkbox UI
- Step 07 不動 resources-loader.js / resources-state.json
