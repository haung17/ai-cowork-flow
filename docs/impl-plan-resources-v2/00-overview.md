# resources.html v2 — 步驟文件總覽

## 目標

resources.html v1 → 升級為 dashboard-grade governance extension。7 項硬傷全部修完。

## 執行順序

| 步驟文件 | Phase | 核心交付 |
|----------|-------|----------|
| `01-schema-and-state.md` | 1 | type schema 修正 + resources-state.json |
| `02-vendor.md` | 5（提前） | marked + 字型 vendor 進 repo，移除 CDN |
| `03-catalog-content.md` | 2 | 9 資源各加 Input/Output/Gate/Artifact/Risk/NextNode |
| `04-deeplink.md` | 3 | flowcharts.js 節點 id + hash scroll + resources 連結 anchor 化 |
| `05-tier3-warning.md` | 4 | Tier 3 ⚠ 視覺警告 |
| `06-renderer-integration.md` | 6 | loader 重構 + 全測試 48/48 綠 |

## 每步驟執行流程（固定）

```
1. 寫失敗測試 (RED) — 跑測試確認紅
2. 實作 (GREEN) — 跑測試確認全綠
3. 4 agents 平行 review (嚴苛標準，全過才繼續)
4. 修補 review 意見
5. commit（含 reviews/step-NN.md + 後續步驟文件調整）
6. 進下一步
```

## 共用測試指令

```powershell
# 全部跑
npx playwright test --reporter=list

# 指定 step
npx playwright test --grep "<step-grep-pattern>"

# 偵錯模式
npx playwright test --headed --grep "<pattern>"

# flake 驗證（跑 3 次）
npx playwright test --grep "<pattern>" --repeat-each=3
```

## 4 Agent Review Prompt 模板

每步驟的 agent prompt 格式：

```
Context:
- 這是 resources.html v2 hardening，步驟 NN：<步驟名稱>
- 該步驟目標：<目標>
- 交付檔：<檔案清單>
- Playwright 測試結果：<跑完的 stdout>
- git diff: <步驟 commit 的 diff>

Review 重點：
<step 文件中的具體問題清單>

嚴格不放行條件（通用）：
- code-reviewer: 無 TODO/FIXME；無 breaking change 未紀錄；fetch/parse 失敗有容錯；commit message 含 priority#N
- test-runner: RED 歷程確認；無 mock 真實 fetch；flake rate=0（跑 3 次皆綠）
- performance-investigator: FCP < 1.5s；任一函式 < 50ms；vendor woff2 < 400KB 總計
- refactor-architect: resources-loader.js < 300 行；任一函式 < 50 行；6 職責分離

請列出：PASS / FAIL（含具體行號），以及後續步驟文件需要調整的項目。
```

## 跨步驟 review 記錄

每步驟 review 結果寫到：`docs/impl-plan-resources-v2/reviews/step-NN.md`

格式：
```markdown
# Step NN Review — <步驟名>

## code-reviewer: PASS/FAIL
<意見>

## test-runner: PASS/FAIL
<意見>

## performance-investigator: PASS/FAIL
<意見>

## refactor-architect: PASS/FAIL
<意見>

## 後續步驟調整
- <步驟文件> 需修改：<原因>
```
