# Step 02 Review — Vendor 外部依賴

## code-reviewer: PASS
- `git grep "fonts.googleapis" -- "*.html"` → 0
- `git grep "cdn.jsdelivr" -- "*.html"` → 0
- `noscript-banner` 存在於 `resources.html:50`
- `font-display: swap` 全 6 個 @font-face 皆有（style-fonts.css lines 4/9/14/19/24/29）
- LICENSES.md 完整（marked MIT + Inter SIL OFL + JetBrains Mono SIL OFL）
- 無 `// TODO` / `// FIXME`
- 無 `fetch()` 引用 vendor assets

## test-runner: PASS
- 45/45 綠（3 次重跑，135/135 無 flake）
- `no-cdn.spec.js` 4/4、`noscript.spec.js` 1/1 全綠
- 現有 fetch mock 僅針對本地 md / state.json 錯誤路徑（intentional negative-path），非 CDN mock

## performance-investigator: PASS（主執行緒自行量測）
- Vendor fonts 總大小：139,744 bytes（136 KB）< 400 KB ✓
- `marked.min.js`：35,479 bytes（35 KB）< 200 KB ✓
- `font-display: swap` 全部存在，無 render-blocking ✓
- `<script>` 在 body 底部，`<noscript>` 在 body 內 ✓
- 備註：agent 工具存取受限，由主執行緒以 PowerShell Get-ChildItem 直接量測

## refactor-architect: PASS
- `resources-loader.js`：153 行 < 300；最大函式 `_handleSearchInput` 26 行 < 50
- `style-fonts.css`：純 @font-face，單一職責
- Vendor assets 置於 `assets/vendor/`，未污染 `assets/` 根目錄
- LICENSES.md 三項授權齊全
- 三個 HTML 皆一致引入 `style-fonts.css`
- **文件缺口（已修補）**：`presentation.html` reveal.js CDN 未標註 out-of-scope → 已加 HTML comment 說明

## 修補動作
- `presentation.html` 新增 `<!-- reveal.js CDN: vendoring deferred, out of scope for Step 02 -->`

## 後續步驟調整
- `03-catalog-content.md`：無需調整
- `04-deeplink.md`：無需調整
- `06-renderer-integration.md`：確認 vendor marked path 為 `assets/vendor/marked.min.js`（已對齊）

## 最終判定
全 4 agents PASS。Strict pass criteria 達成：
- `git grep "fonts.googleapis\|cdn.jsdelivr" -- "*.html"` → 0
- 45/45 × 3 runs = 135/135 綠
- Fonts 136 KB < 400 KB；marked 35 KB < 200 KB
- `resources-loader.js` 153 行 < 300
