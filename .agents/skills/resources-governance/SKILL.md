---
name: resources-governance
description: AI 接案交付治理規則與資源使用指南。管理 AI 在軟體接案流程中的使用邊界、責任歸屬與違規處理。
triggers:
  - 治理
  - governance
  - 硬規則
  - hard rules
  - Tier 4
  - Status 升等
  - 違規
  - 稽核
  - UAT 驗收
  - 部署審核
  - CR 審核
---

# AI 接案交付治理

管理 AI 在軟體接案流程中的使用邊界。

## 何時使用本 Skill

- 決定某操作是否可由 AI 執行
- 處理 AI 產出的 Status 升等
- 記錄治理違規事件
- 回答「AI 可不可以做 X」類問題

## 7 條硬規則（一行版）

1. AI 產出不得視為承諾 → 需人工審核後才可對外溝通
2. AI 產出不得直接發給客戶 → PM 確認後以人工名義發出
3. AI 產出不得作為報價依據 → PM Gate 後人填最終數字
4. AI 不得新增 SOW 範圍 → 需 CR 流程 + PM Gate
5. AI 不得判定 UAT 通過 → 客戶代表 + PM 書面確認
6. AI 不得批准 CR → 需正式審核流程
7. AI 不得執行 Production 部署 / Hotfix → 工程師 + PM 確認 + 操作日誌

**違反即觸發嚴重治理違規流程。**

## Tier 4 清單（禁止 AI 代決策）

| 項目 | 禁止 AI | 負責人 |
|------|---------|-------|
| 報價 / 合約簽署 | 拍板金額、簽文件 | PM + 業主 |
| UAT 驗收簽核 | 判定通過、代客戶簽 | PM + 客戶代表 |
| Production 部署 / Hotfix | 執行部署指令 | 工程師 + PM |
| CR 核准 | 批准、修改 SOW | PM + 客戶業主 |

## Status 快速判斷

```
DraftReady → InternallyTested：1 次假案 + checklist 全 pass
InternallyTested → ClientTested：1 次真實客戶使用
DraftReady → NeedsHumanGate：資源性質需 human gate
任意 → NotRecommended：重大風險，需填降等說明
```

## 違規快速處理（3 步）

1. **立即停止** — 暫停操作，不繼續發送
2. **記錄事件** — 時間、操作者、影響範圍、已發送對象
3. **通報復原** — 通知 PM；若已對外需主動更正

## Cross-Reference 表

| 場景 | 讀取 |
|------|------|
| 完整 RACI 責任矩陣 | `references/responsibility-matrix.md` |
| Status 升等 SOP | `references/status-promotion.md` |
| 違規處理 SOP | `references/violation-handling.md` |
| 稽核紀錄模板 | `references/audit-log.md` |
| 完整治理手冊（HTML 頁面用） | `governance.md`（repo root） |
