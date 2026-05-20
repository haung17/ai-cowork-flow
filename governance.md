# AI 接案交付治理手冊

> 本手冊定義 AI 輔助軟體接案的使用邊界、責任歸屬、違規處理與稽核機制。
> 所有團隊成員在使用 AI 工具前應閱讀並遵守本規則。

---

## 7 條硬規則 {#hard-rules}

以下規則為**不可妥協的底線**，任何情境下均適用：

| # | 規則 | 說明 |
|---|------|------|
| 1 | AI 產出**不得視為承諾** | 所有 AI 輸出必須經人工審核後才可對外溝通，否則視為個人承諾而非組織承諾 |
| 2 | AI 產出**不得直接對客戶發送** | 含 email、Slack、任何通訊工具；必須由 PM 確認後以人工名義發出 |
| 3 | AI 產出**不得直接作為報價依據** | 金額、工時、工項需 PM Gate 後由人填寫最終數字 |
| 4 | AI **不得自行新增 SOW 範圍** | 任何範疇擴充（含「建議追加功能」）需正式 CR 流程 + PM Gate |
| 5 | AI **不得自行判定 UAT 通過** | 驗收需客戶代表 + PM 雙方書面確認，AI 只可協助產出 UAT checklist |
| 6 | AI **不得自行批准 CR** | 變更申請需正式審核流程，AI 只可輔助分析影響範圍 |
| 7 | AI **不得自行執行 Production 部署 / Hotfix** | 需工程師 + PM 確認，並記錄操作日誌；緊急 Hotfix 需即時通報 |

違反任何一條視為**嚴重治理違規**，需立即記錄並上報。
→ 詳細違規處理流程見 [references/violation-handling.md](.agents/skills/resources-governance/references/violation-handling.md)

---

## Tier 4 對照表 {#tier4-reference}

以下項目屬於 **Tier 4: Human-only**，AI 不得代決策、代執行：

| 項目 | AI 可協助 | AI 絕對禁止 | 負責人 |
|------|-----------|------------|-------|
| 報價與合約簽署 | 草稿、條款分析、歷史案例對比 | 拍板金額、簽署任何文件 | PM + 業主 |
| UAT 驗收簽核 | 產出 UAT checklist、整理 bug 清單 | 判定驗收通過、代表客戶簽核 | PM + 客戶代表 |
| Production 部署 / Hotfix | 分析部署風險、產出部署 checklist | 執行部署指令、合併 production branch | 工程師 + PM |
| CR / 變更申請核准 | 分析影響範圍、估算工時變動 | 批准 CR、修改 SOW 條款 | PM + 客戶業主 |

---

## Status 升等規則摘要 {#status-promotion}

| 從 | 到 | 升等條件 |
|----|----|---------| 
| DraftReady | InternallyTested | 完成至少 1 次假案測試 + verification checklist 全 pass |
| InternallyTested | ClientTested | 完成至少 1 次真實客戶流程使用，且客戶未反映重大問題 |
| DraftReady | NeedsHumanGate | 資源性質本身需 human gate（如 org-chart），非驗證失敗 |
| 任意 | NotRecommended | 發現重大風險或不適合現有流程，需填寫降等說明 |

→ 完整升等 SOP 見 [references/status-promotion.md](.agents/skills/resources-governance/references/status-promotion.md)

---

## 責任歸屬 {#responsibility}

| 角色 | 治理責任 |
|------|---------|
| PM | 所有對外溝通的最終審核人；Tier 4 決策執行人；Status 升等審核人 |
| 工程師 | WBS / prototype / 部署相關產出的技術把關；Tier 4 部署執行人 |
| QA | UAT checklist 製作協助；驗收過程記錄人 |
| AI（Claude/GPT） | 起草、分析、格式轉換；無任何決策權或承諾權 |

→ 完整 RACI 矩陣見 [references/responsibility-matrix.md](.agents/skills/resources-governance/references/responsibility-matrix.md)

---

## 違規處理 {#violation-handling}

**發現違規時的 3 步驟**：

1. **立即停止** — 暫停相關 AI 操作，不繼續發送或提交
2. **記錄事件** — 填寫稽核紀錄（時間、操作者、影響範圍、已發送對象）
3. **通報與復原** — 通知 PM，若已對外發送需主動更正

→ 完整違規處理 SOP 見 [references/violation-handling.md](.agents/skills/resources-governance/references/violation-handling.md)

---

## 稽核紀錄 {#audit-log}

所有治理違規事件、Status 升等決定、Tier 4 操作需記錄於稽核日誌。

→ 稽核紀錄模板見 [references/audit-log.md](.agents/skills/resources-governance/references/audit-log.md)

---

*本手冊版本：v3.0（2026-05-20）| 對應 resources.html v3*
