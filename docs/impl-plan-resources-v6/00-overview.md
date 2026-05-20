# v6 實作計畫總覽

目標：修正 dashboard 流程數據從「漂亮架構圖」到「商務上能擋住接案翻車」的接案治理流程，並消除既有架構債。

## 8 個 Step

| Step | 主題 | 關鍵檔案 |
|------|------|---------|
| 01 | preDev 流程修正 | `assets/data.js` |
| 02 | UAT 失敗中介節點 | `assets/data.js` |
| 03 | midDev 規格疑義出口 | `assets/data.js` |
| 04 | SSOT — renderTable() | `assets/data.js`, `assets/interactions.js` |
| 05 | Search debounce | `assets/resources-loader.js` |
| 06 | Cross-tab theme sync | `dashboard.html`, `resources.html` |
| 07 | Image swap v3.6 → v3.7 | `presentation.html`, `assets/interactions.js` |
| 08 | Full E2E + regression | `tests/e2e/v6-full-journey.spec.js` |

每 step：RED → GREEN → flake check → 4-agent review → reviews/step-NN.md → commit。
