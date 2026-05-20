# Step 06 Review — governance.md + Skill 拆分

**Date**: 2026-05-20  
**Branch**: feat/v3-governance-core  
**Scope**: governance.md, .agents/skills/resources-governance/ (SKILL.md + 4 references), resources-catalog.md (3 cross-refs)

---

## Files Created

| 檔案 | 行數 |
|------|------|
| `governance.md` | 70 行 |
| `.agents/skills/resources-governance/SKILL.md` | 73 行（< 200 ✓）|
| `references/responsibility-matrix.md` | 43 行 |
| `references/status-promotion.md` | 58 行 |
| `references/violation-handling.md` | 52 行 |
| `references/audit-log.md` | 62 行 |

---

## governance.md Structure

- `## 7 條硬規則 {#hard-rules}` — 7 條完整規則表格
- `## Tier 4 對照表 {#tier4-reference}` — 4 項 Tier 4 項目
- `## Status 升等規則摘要 {#status-promotion}` — 升等路徑表
- `## 責任歸屬 {#responsibility}` — 角色對照
- `## 違規處理 {#violation-handling}` — 3 步快速流程
- `## 稽核紀錄 {#audit-log}` — 指向 references

---

## Catalog Cross-refs（≥ 3 ✓）

| 資源 | Risk anchor |
|------|-------------|
| work-plan | `governance.md#hard-rules` |
| wbs | `governance.md#hard-rules` |
| asana | `governance.md#tier4-reference` |

---

## Test Results

- Full suite: 100/100
- governance-link.spec.js: 3/3

---

## Advisory

- governance.html 連結至 sidebar 在 step-07 處理（此時 governance.md 可 fetch 已驗證）
- SKILL.md 73 行，依 Rule A 規範 < 200 行；大塊內容已拆分至 references/

---

## Commit

`feat(step-06): governance.md hard rules + skill split (SKILL.md + 4 references)`
