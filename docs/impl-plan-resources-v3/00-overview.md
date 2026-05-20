# v3 Governance Core — Overview

**Branch**: `feat/v3-governance-core`  
**Base**: `feat/v2-resources-hardening` (v2 70/70 tests)  
**外部 review 分數**: 82/100 (GPT + Gemini)  
**v3 目標**: 治理核心 5 項 → 預期升至 ~90/100

---

## 7 步驟清單

| Step | 目標 | 主要交付 |
|------|------|----------|
| 01 | Tier schema 重劃 | Tier 1-4 新名、Tier 4 H2 佔位 |
| 02 | Tier 4 內容 | 4 個 H3、禁止 AI 列表、`.tier4-block` CSS |
| 03 | Status 重劃 + 遷移 | 全砍 DraftReady、6 色 badge |
| 04 | Minimum Input md 欄位 | 9 資源各 3-5 條 bullet |
| 05 | Acceptance chips | state.json `acceptanceChecks`、4-color chip UI（WCAG AA） |
| 06 | governance.md + skill 拆分 | 7 條硬規則、SKILL.md 骨架、references/*.md |
| 07 | governance.html + sidebar + 全測收尾 | sidebar 第一項、~95 tests 全綠 |

---

## 共用測試指令

```powershell
# 全 suite
npx playwright test --reporter=list

# 單一 spec
npx playwright test tests/e2e/<spec>.spec.js --reporter=list

# flake check
npx playwright test tests/e2e/<spec>.spec.js --repeat-each=3

# HTTP server（Playwright webServer 已設定，通常無需手動開）
python -m http.server 8080
```

---

## 4-agent review prompt 模板

每 step 完成後，以下 4 agent **平行**跑，結果寫入 `reviews/step-NN.md`。

### code-reviewer

```
Review step-NN changes on feat/v3-governance-core.
Files in scope: <列出本 step 修改的檔案>
Check:
(a) No TODO/FIXME in new code
(b) state.json schema change → migration note present in reviews/step-NN.md
(c) Breaking change to v2 anchor/selector documented
(d) Commit message references step priority number
v3 extra: if state.json schema changed, migration table (old→new) must be in review doc.
```

### test-runner

```
Run full Playwright suite on feat/v3-governance-core.
npx playwright test --reporter=list
Then flake: npx playwright test tests/e2e/<new spec>.spec.js --repeat-each=3
Check:
(a) All tests green
(b) Flake rate 0
(c) New tests went through RED commit before GREEN
v3 extra: git grep "Verified" -- "*.json" "*.md" == 0 after step-03+
v3 extra: git grep "Tier 1[^:]" -- "*.md" == 0 after step-01+
```

### performance-investigator

```
Profile resources.html after step-NN changes.
Measure: FCP < 1.5s; any new enrichDom function < 50ms; resources-loader.js < 300 lines.
v3 extra (step-05+): Acceptance chip 4 colors contrast ratio >= 4.5:1 (WCAG AA).
Colors to check:
  Pending: bg=#F3F4F6 fg=#374151
  Pass:    bg=#F0FDF4 fg=#15803D
  Fail:    bg=#FEF2F2 fg=#B91C1C
  N/A:     bg=#FFFBEB fg=#92400E
```

### refactor-architect

```
Review resources-loader.js and any new files after step-NN.
Check:
(a) resources-loader.js < 300 lines
(b) No function > 50 lines
(c) fetch/parse/enrich/render/nav/search 6 concerns stay separated
v3 extra (step-06+): governance.md not isolated — catalog must have >= 3 cross-refs to governance.md#anchor.
```

---

## v3 新增嚴格不放行條件

| Agent | 條件 |
|-------|------|
| code-reviewer | state.json schema breaking → migration note 必須在 reviews/step-NN.md |
| test-runner | `git grep "Verified"` = 0（step-03 後）；`git grep "Tier 1[^:]"` = 0（step-01 後） |
| performance-investigator | Acceptance chip 4 色 contrast ≥ 4.5:1 |
| refactor-architect | governance.md ≥ 3 catalog cross-refs |

---

## Status enum（v3 生效）

| 英文 token | 顏色 | 說明 |
|-----------|------|------|
| `DraftReady` | 灰 | prompt 可用，但未曾實戰 |
| `InternallyTested` | 藍 | 已用假案測過 |
| `ClientTested` | 綠 | 已在真實客戶流程使用 |
| `NeedsHumanGate` | 橘 | 必須人工確認後才能前進 |
| `NotRecommended` | 紅刪除 | 不建議現階段導入 |
| `SystemCandidate` | 紫 | 未接系統，只是候選 |

## Tier enum（v3 生效）

| Tier | 定義 |
|------|------|
| Tier 1: Draft-safe | AI 產草稿，不得直接交付 |
| Tier 2: Decision-assisted | AI 輔助分析，人工決策 |
| Tier 3: System-output | AI 產系統匯入格式，人工觸發/審核 |
| Tier 4: Human-only | 報價/UAT/Production/CR — 禁止 AI 代決策 |

## Acceptance chip enum（v3 生效）

| status | bg | fg | contrast |
|--------|----|----|---------|
| `Pending` | #F3F4F6 | #374151 | 8.6:1 |
| `Pass` | #F0FDF4 | #15803D | 5.1:1 |
| `Fail` | #FEF2F2 | #B91C1C | 5.9:1 |
| `N/A` | #FFFBEB | #92400E | 6.3:1 |
