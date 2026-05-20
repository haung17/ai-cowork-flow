# Step 08: Full E2E + Regression

**Goal**: `v6-full-journey.spec.js` 13 步驟使用者旅程 + 全測 ~150 綠 + flake check + 視覺驗收。

## Full Journey Test Design（13 steps）

檔案：`tests/e2e/v6-full-journey.spec.js`

| Step | 動作 | 驗證 |
|------|------|------|
| 1 | 開啟 `dashboard.html` | 頁面載入；sidebar 存在 |
| 2 | preDev 節點含「投標前技術探勘」 | data-id 或文字可見 |
| 3 | midDev 無 8↔9 環；含 PM 釐清節點 | AppData.flowcharts midDev 驗證 |
| 4 | postDev 5→engineer-impact→6 路徑存在 | edges 驗證 |
| 5 | 點擊 resources link → 新 tab 開啟 resources.html | page 2 URL 含 resources.html |
| 6 | resources.html catalog 載入 ≥ 9 h3 | waitForSelector |
| 7 | resources.html 搜尋「會議」→ 結果出現 | waitForSelector .search-result-item |
| 8 | 點擊搜尋結果 → overlay 關閉 | #search-overlay.hidden |
| 9 | nav 點擊跳到章節 | scrollIntoView 觸發 |
| 10 | dashboard tab 切換 dark theme | data-theme=dark |
| 11 | resources tab 自動同步 dark theme | cross-tab storage event |
| 12 | resources.html 4 個 v3.7 img 自然寬度 > 0（透過 presentation.html） | 可選 |
| 13 | dashboard preDev table row count = sectionTables rows length | SSOT 驗證 |

## 驗收清單（跑完測試後人工確認）

- [ ] dashboard preDev：「工程師：投標前技術探勘」可見於 Gate 前
- [ ] dashboard preDev：無 11→7 back-edge
- [ ] dashboard midDev：node 9 四條出路皆有 label，無 8↔9 環
- [ ] dashboard postDev：5→6 中間有工程師影響分析節點
- [ ] dashboard 三章節表格與 v3.7 PNG 節點對齊
- [ ] presentation.html 四張圖全顯示 v3.7（無 404）
- [ ] resources.html 連打搜尋不卡頓（250ms debounce 可感知）
- [ ] 兩 tab cross-tab theme sync 實際操作 OK

## 最終 grep 驗證

```bash
git grep "Image-v3.6" -- "*.html" "*.js"   # 0
git grep "客戶接抵" -- "*.js"                # 0
git grep "<table>" -- "assets/interactions.js"  # 0
```
