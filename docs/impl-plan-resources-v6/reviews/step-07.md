# Step 07 Review — Image Swap v3.6 → v3.7

## 4-Agent Results

| Agent | 結論 | 備注 |
|-------|------|------|
| code-reviewer | APPROVE | minor: title/h1 v3.6 out-of-scope；v3.7 PNG 需 stage |
| test-runner | APPROVE | 3/3 pass；Rule (c) `Image-v3.6` = 0 in non-spec files |
| performance-investigator | CHANGES_NEEDED → fixed | interactions.js `v3.6 流程圖` + `版本：v3.6` stale labels |
| refactor-architect | CHANGES_NEEDED → fixed | presentation.html title + h1 仍 v3.6 |

## 修正項目（CHANGES_NEEDED → fixed）

### 1. presentation.html title + h1（refactor-architect）
- Line 6 `<title>` + Line 21 `<h1>` : v3.6 → v3.7

### 2. interactions.js stale labels（performance-investigator）
- Line 96 h1 section title: v3.6 → v3.7
- Line 106 version footer: `版本：v3.6` → `版本：v3.7`
- Line 111 h2: `v3.6 流程圖` → `v3.7 流程圖`

## Rule (c) 確認

`git grep "Image-v3.6" -- "*.html" "*.js"` = 0（spec.js guard strings 排除）✓

## v3.7 PNG 確認

4 個檔案存在 repo root 並已 stage 入 commit：
- `ChatGPT Image-v3.7-全架構.png`
- `ChatGPT Image-v3.7-開發前.png`
- `ChatGPT Image-v3.7-開發中.png`
- `ChatGPT Image-v3.7-開發後.png`

## 後續 Step 08 注意事項

- `v6-full-journey.spec.js` 13 步驟 E2E：dashboard → resource link → new tab resources.html → dark mode toggle → search → nav click
- 全測預期 ~150 綠（147 + 13 new）
- flake check `--repeat-each=3`
- 視覺驗收清單（見 plan 08-full-e2e.md）
- data.js `contentVersion` 仍為 `'v3.6'`；v3.7 目前只是 image SSOT revision，不等同 content version — acceptable YAGNI defer
