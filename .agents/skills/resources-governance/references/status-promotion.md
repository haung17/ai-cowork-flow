# Status 升等 SOP

v3 governance — 資源 Status 升等流程

## Status 枚舉

| Status | 意義 |
|--------|------|
| DraftReady | prompt 可用，尚未實戰驗證 |
| InternallyTested | 已用假案測試，checklist 全 pass |
| ClientTested | 已在真實客戶流程使用，無重大問題 |
| NeedsHumanGate | 資源性質需 human gate，非驗證失敗 |
| NotRecommended | 不建議現階段導入，有重大風險 |
| SystemCandidate | 候選系統整合方案，尚未實作 |

## 升等路徑

### DraftReady → InternallyTested

**條件**：
1. 完成至少 1 次假案全程測試（非生產環境）
2. 對應資源的 `verification` checklist 全部 pass
3. Minimum Input 條件均已滿足
4. acceptanceChecks 核心項目無 Fail

**操作**：
1. 手動編輯 `resources-state.json`：`"status": "InternallyTested"`
2. 更新 `lastUpdated` 為升等日期
3. 在 `acceptanceChecks` 中將 pass 的項目改為 `"Pass"`
4. 在 `audit-log.md` 記錄升等事件

### InternallyTested → ClientTested

**條件**：
1. 完成至少 1 次真實客戶流程使用
2. 客戶未反映重大問題或資料錯誤
3. PM 確認產出品質符合交付標準

**操作**：同上，`"status": "ClientTested"`

### DraftReady → NeedsHumanGate

**條件**：資源本身性質需要 human gate（如 org-chart、合約類），不論測試狀態。

### 任意 → NotRecommended

**條件**：發現重大風險（如 AI 一直產出不準確結果、客戶曾有不良反應）。

**操作**：需填寫降等原因並記錄於 `audit-log.md`。

## 注意事項

- Status 只能由人工編輯，AI 不得自行修改 `resources-state.json`
- 降等（如 ClientTested → DraftReady）需 PM 授權並記錄原因
- 每次升等後應在 acceptanceChecks 中更新對應項目狀態
