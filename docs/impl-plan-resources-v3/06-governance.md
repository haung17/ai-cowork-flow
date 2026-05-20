# Step 06 — governance.md + Skill 拆分

**目標**：建立完整治理手冊；依 Rule A 拆 SKILL.md（< 200 行）+ references/*.md。catalog ≥ 3 處 Risk 交叉引用 governance.md#anchor。

---

## Deliverables

| 檔案 | 動作 |
|------|------|
| `tests/e2e/governance-link.spec.js` | 新建（RED → GREEN） |
| `governance.md` | 新建（repo root）|
| `.agents/skills/resources-governance/SKILL.md` | 新建（< 200 行） |
| `.agents/skills/resources-governance/references/responsibility-matrix.md` | 新建 |
| `.agents/skills/resources-governance/references/status-promotion.md` | 新建 |
| `.agents/skills/resources-governance/references/violation-handling.md` | 新建 |
| `.agents/skills/resources-governance/references/audit-log.md` | 新建 |
| `resources-catalog.md` | Risk 欄加 ≥ 3 處 `→ [governance.md#anchor]` 連結 |

---

## governance.md 結構（供 governance.html fetch）

1. `## 7 條硬規則 (#hard-rules)` — AI 產出使用限制
2. `## Tier 4 對照表 (#tier4-reference)` — 鏡像 catalog Tier 4 區塊
3. `## Status 升等規則摘要 (#status-promotion)` — 指向 references
4. `## 責任歸屬 (#responsibility)` — 指向 references
5. `## 違規處理 (#violation-handling)` — 指向 references
6. `## 稽核紀錄 (#audit-log)` — 指向 references

---

## 7 條硬規則（完整文字）

1. AI 產出不得視為承諾 — 所有 AI 輸出必須經人工審核後才可對外溝通
2. AI 產出不得直接對客戶發送 — 含 email、Slack、任何通訊工具
3. AI 產出不得直接作為報價依據 — 金額、工時、工項需人工確認
4. AI 不得自行新增 SOW 範圍 — 任何範疇擴充需 PM Gate
5. AI 不得自行判定 UAT 通過 — 驗收需客戶 + PM 雙方簽核
6. AI 不得自行批准 CR — 變更申請需正式審核流程
7. AI 不得自行執行 Production 部署 / Hotfix — 需工程師 + PM 確認

---

## catalog cross-refs（≥ 3 處 Risk 欄）

| 資源 | 現有 Risk 文字 | 加入 anchor 連結 |
|------|--------------|----------------|
| work-plan | scope creep | → `[governance.md#hard-rules]` |
| asana | 重複匯入 / email 錯誤 | → `[governance.md#tier4-reference]` |
| wbs | 超出 SOW | → `[governance.md#hard-rules]` |

---

## SKILL.md 骨架（< 200 行）

```yaml
---
name: resources-governance
description: AI 接案交付治理規則與資源使用指南
triggers:
  - 治理
  - governance
  - 硬規則
  - Tier 4
  - Status 升等
---
```

正文：7 條規則一行版 + 違規快速處理 + cross-ref 表

---

## 4-Agent Review 條件

| Agent | 條件 |
|-------|------|
| code-reviewer | governance.md 7 條規則均在 `#hard-rules` 節；SKILL.md < 200 行 |
| test-runner | 全套 ≥ 100/100（97 + 新 3）；governance-link.spec.js 9/9 |
| perf | governance.md 可 fetch（無 CORS 問題，純靜態） |
| refactor-architect | catalog Risk 欄 ≥ 3 處 `governance.md#` anchor；`governance.md` 不孤島 |

---

## Commit

`feat(step-06): governance.md hard rules + skill split (SKILL.md + 4 references)`
