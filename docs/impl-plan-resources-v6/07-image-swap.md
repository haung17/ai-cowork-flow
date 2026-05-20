# Step 07: Image Swap v3.6 → v3.7

**Goal**: `presentation.html` (4 處) + `assets/interactions.js` (4 lightbox 處) 共 8 處 v3.6 引用換 v3.7。

## 變更清單

### presentation.html

| Line | 舊 src | 新 src |
|------|--------|--------|
| 74 | `ChatGPT Image-v3.6-全架構.png` | `ChatGPT Image-v3.7-全架構.png` |
| 80 | `ChatGPT Image-v3.6-開發前.png` | `ChatGPT Image-v3.7-開發前.png` |
| 101 | `ChatGPT Image-v3.6-開發中.png` | `ChatGPT Image-v3.7-開發中.png` |
| 121 | `ChatGPT Image-v3.6-開發後.png` | `ChatGPT Image-v3.7-開發後.png` |

alt text 同步改：`v3.6` → `v3.7`

### assets/interactions.js

| Line | 舊 src | 新 src |
|------|--------|--------|
| 115 | `ChatGPT Image-v3.6-全架構.png` | `ChatGPT Image-v3.7-全架構.png` |
| 119 | `ChatGPT Image-v3.6-開發前.png` | `ChatGPT Image-v3.7-開發前.png` |
| 123 | `ChatGPT Image-v3.6-開發中.png` | `ChatGPT Image-v3.7-開發中.png` |
| 127 | `ChatGPT Image-v3.6-開發後.png` | `ChatGPT Image-v3.7-開發後.png` |

## TDD

檔案：`tests/e2e/v6-step07-image-swap.spec.js`（3 tests）

1. `git grep "Image-v3.6"` 在 `*.html` `*.js` = 0（字面值不可出現）
2. presentation.html 4 個 `<img>` src 含 v3.7 檔名
3. 載入 presentation.html → 4 個 img 元素 naturalWidth > 0（圖實際載入無 404）

## Rule (c)

Step 07 後：`git grep "Image-v3.6" -- "*.html" "*.js"` = 0。

## 注意事項

- v3.7 PNG 已存在 repo root（untracked）；需在 commit 時一併加入
- alt text 含版本號，一起更新
- interactions.js 內 lightbox src 為 string template literal — 直接替換
