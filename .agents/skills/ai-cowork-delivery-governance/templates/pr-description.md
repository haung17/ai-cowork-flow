# PR Description 模板

## 變更摘要

> （一句話說明這個 PR 解決了什麼問題，或新增了什麼功能）

---

## 相關 Issue / Ticket

- Closes #
- Related to #

---

## 變更類型

- [ ] feat：新功能
- [ ] fix：Bug 修正
- [ ] refactor：重構（不影響外部行為）
- [ ] test：測試新增或修改
- [ ] docs：文件更新
- [ ] chore：建置 / 設定 / 依賴更新

---

## 影響範圍

> （哪些模組、API、DB Table、前端頁面受到影響）

- 模組 / 功能：
- API 端點：
- DB 變更（如有）：
- 前端頁面：

---

## 測試方式

> （Reviewer 或 QA 如何驗證這個變更）

**手動測試步驟**：
1. 
2. 
3. 

**自動化測試**：
- 新增單元測試：是 / 否
- 測試覆蓋率：

---

## 回滾方式

> （如果這個 PR 上線後出問題，怎麼還原）

- 回滾方式：
- DB 回滾（如有 migration）：

---

## Reviewer Checklist

- [ ] 程式邏輯正確，邊界案例已處理
- [ ] 沒有明顯的安全性問題（input validation、SQL injection、XSS）
- [ ] 函式命名清楚、程式碼可讀
- [ ] 測試已覆蓋主要情境
- [ ] CI 已通過
- [ ] 影響範圍已在 PR 說明中列明

---

## 備註

> （其他 Reviewer 需要知道的事，如：依賴另一個 PR、暫時的 workaround 等）
