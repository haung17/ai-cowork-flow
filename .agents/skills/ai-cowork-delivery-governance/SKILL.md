---
name: ai-cowork-delivery-governance
description: Use this skill whenever the user asks to explain, update, review, or generate content for the v3.6 AI Cowork / Claude Code freelance software delivery governance flow. Trigger on: 接案, 接案流程, 新接案啟動, AI Cowork, Claude Code, PM/QA/工程師, SOW, 報價, UAT, 保固, 客戶驗收, Change Request, dashboard, presentation, 流程圖, v3.6, even if the user only asks for a slide, dashboard text, SOP, proposal, template, or diagram update.
---

# AI Cowork Delivery Governance

This skill covers the complete v3.6 AI-assisted freelance software delivery governance flow for PM, QA, and engineers in contract software development companies (政府案、企業系統、客製化系統、網站後台).

Core idea: Claude Cowork speeds up PM/QA 整理、起草、比對、提醒. Claude Code speeds up engineering 開發、測試、PR、CI、技術文件. Humans keep all scope, quality, technical, and delivery responsibility.

## Trigger Conditions

Use when user mentions any of:
- 接案, 軟體接案, 新接案專案啟動
- SOW, 報價, 客戶確認, 範疇變更, Change Request
- UAT, 驗收, 正式簽收, 保固
- PR, CI, Code Review, QA 驗證
- PM, QA, 工程師, Cowork, Claude Code 分工
- dashboard, presentation, 流程圖, v3.6

## Workflow

1. Identify the target artifact: template, dashboard text, presentation, SOP, proposal, diagram review, or stage explanation.
2. Read the relevant reference(s) before writing — use the table below.
3. Keep the three-stage structure: 開發前, 開發中, 開發後.
4. Preserve role boundaries: PM, QA, 工程師 are accountable; Cowork and Claude Code are assistants.
5. Preserve the 4 key gates only: SOW / 報價, Change Request, UAT, 正式簽收. Do not add gates.
6. For issue triage questions, always route per the four-type classification (Bug / 規格疑義 / 新增需求 / 通過).
7. For dashboard / SOP text, use fuller tables and explanations from reference files.
8. For presentation text, use short slide-ready wording from `references/presentation-guide.md`.
9. For diagram review, check ordering, gate count, and role boundary annotation.
10. When generating contract artifacts (SOW, CR, release note, UAT checklist, PR description), start from the matching `templates/*.md` rather than freeform.

## References

| Scenario | Read |
|---|---|
| Need pre-development stage detail (需求、QA/技術評估、SOW、客戶確認、排程) | `references/pre-dev.md` |
| Need mid-development stage detail (開發、PR、CI、Review、QA、問題分流) | `references/mid-dev.md` |
| Need post-development stage detail (凍結、UAT、部署、文件、KT) | `references/post-dev.md` |
| Need warranty / maintenance detail (SLA、保固範圍、結算) | `references/warranty.md` |
| Need role responsibilities and AI assistant boundary | `references/roles-ai-boundary.md` |
| Need customer Gate detail (SOW / CR / UAT / 簽收 triggers, inputs, outputs) | `references/customer-gates.md` |
| Need issue triage routing (Bug / 規格疑義 / 新增需求 / 通過) | `references/issue-triage.md` |
| Need slide-ready wording or presentation sequence | `references/presentation-guide.md` |
| Need SOW template | `templates/sow-template.md` |
| Need PR description template | `templates/pr-description.md` |
| Need Change Request template | `templates/change-request.md` |
| Need UAT checklist template | `templates/uat-checklist.md` |
| Need Release Note template | `templates/release-note.md` |
