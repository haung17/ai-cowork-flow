# RACI 責任矩陣

v3 governance — 接案流程 AI 分工責任

## 角色定義

| 記號 | 意義 |
|------|------|
| R | Responsible — 執行人 |
| A | Accountable — 最終負責人（簽核） |
| C | Consulted — 提供意見 |
| I | Informed — 知會對象 |

## 主要活動 RACI

| 活動 | PM | 工程師 | QA | AI | 客戶代表 |
|------|----|---------|----|-----|---------|
| AI 產出草稿 | A | C | - | R | - |
| 草稿審核 / 修改 | R | C | C | - | - |
| 對外發送文件 | A,R | I | I | - | I |
| 報價 / 合約拍板 | A | C | - | C | A |
| WBS / 工時審核 | A | R | - | C | - |
| Prototype 技術審核 | C | A,R | C | C | - |
| UAT checklist 製作 | C | C | R | C | A |
| UAT 驗收簽核 | A | - | R | C | A,R |
| Production 部署 | A | R | C | C | I |
| Hotfix 執行 | A | R | I | C | I |
| CR 申請審核 | A | C | - | C | A |
| Status 升等決定 | A,R | C | C | - | - |
| 治理違規記錄 | A | I | I | - | - |

## 說明

- AI（Claude / GPT）在所有活動中最多是 C（提供分析 / 草稿）或 R（執行產出），從不是 A（最終負責）
- 客戶代表在 Tier 4 活動中必須是 A 的共同負責人
- PM 是唯一可以對外溝通的 A，工程師需 PM 授權才可對客戶技術溝通
