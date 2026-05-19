# Step 03 — Catalog 內容擴充（治理欄位）

**Priority 修復**：#2（Input/Output/Human Gate/Artifact/Risk/Next Node）

## 目標

`resources-catalog.md` 9 個資源詳述區塊，每塊都補上：
- `**Input：**` — 需要餵什麼資料
- `**Output：**` — 會產出什麼交付物
- `**Human Gate：**` — 誰、何時、決定什麼
- `**Artifact：**` — 交付物格式（Markdown / HTML / CSV / ICS）
- `**Risk：**` — 可能造成 scope creep 或錯誤的點
- `**Next Node：**` — 產出後流到哪個 dashboard 節點（連結化在 Phase 4）

注意：欄位以標準化 bold key 形式放在 H3 section 開頭（prompt 範例仍保留在後面）。

## 交付檔

- `resources-catalog.md`（修改：9 節各補 6 欄位）
- `tests/e2e/schema-render.spec.js`（新建）

## TDD — 紅測試

```js
// tests/e2e/schema-render.spec.js
const { test, expect } = require('@playwright/test');

// 每個資源 section 應有 6 個治理欄位 key 渲染出來
const GOVERNANCE_KEYS = ['Input：', 'Output：', 'Human Gate：', 'Artifact：', 'Risk：', 'Next Node：'];

test('schema-render: no HUMAN+COWORK or COWORK+CLAUDECODE strings in DOM', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const body = await page.locator('body').textContent();
  expect(body).not.toContain('HUMAN+COWORK');
  expect(body).not.toContain('COWORK+CLAUDECODE');
});

test('schema-render: all 9 resource sections have Input field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  // Count bold text containing 'Input：' within catalog-content
  const count = await page.locator('#catalog-content').getByText('Input：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: all 9 resource sections have Human Gate field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content').getByText('Human Gate：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: all 9 resource sections have Artifact field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content').getByText('Artifact：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: all 9 resource sections have Risk field', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content h3', { timeout: 8000 });
  const count = await page.locator('#catalog-content').getByText('Risk：', { exact: false }).count();
  expect(count).toBeGreaterThanOrEqual(9);
});

test('schema-render: quick-ref table has Primary type and Support columns', async ({ page }) => {
  await page.goto('/resources.html');
  await page.waitForSelector('#catalog-content table', { timeout: 8000 });
  const headers = await page.locator('#catalog-content table thead th').allTextContents();
  expect(headers.join(' ')).toContain('Primary type');
  expect(headers.join(' ')).toContain('Support');
});
```

## 9 個資源治理欄位內容

### 1. 會議記錄（meeting-notes）
```markdown
**Input：** 錄音檔或逐字稿、與會者名單、會議目的與議程
**Output：** 摘要 + 決策清單 + 待辦清單（負責人 + 期限）+ 待釐清問題
**Human Gate：** PM 在交付前確認：負責人姓名正確、期限可行、敏感資訊已脫敏
**Artifact：** Markdown（.md）
**Risk：** AI 可能漏記輕聲討論、混淆相似人名；摘要過短導致決策資訊遺失
**Next Node：** preDev:2（需求整理 Gate）/ midDev:2（Sprint standup）/ postDev:6（UAT 記錄）
```

### 2. 工作計劃書（work-plan）
```markdown
**Input：** SOW 目標範疇、報價金額範圍、專案期限、客戶特殊要求
**Output：** 完整工作計劃書草稿（背景、範疇、WBS 摘要、里程碑、溝通機制、驗收條件）
**Human Gate：** PM Gate：範疇是否與 SOW 一致；工時估算是否含 buffer（≥10%）；客戶里程碑名稱確認
**Artifact：** Markdown（.md）→ 轉 PDF 交付
**Risk：** AI 可能自行擴大範疇（scope creep）；工時估算過於樂觀；術語與 SOW 不一致
**Next Node：** preDev:7（PM Cowork SOW 初稿）→ Gate preDev:9（SOW Gate 對客戶）
```

### 3. 簡報 HTML（presentation）
```markdown
**Input：** 工作計劃書、WBS 摘要、客戶背景、說明重點（3-5 條）
**Output：** 單一 HTML 簡報（含 CSS）、可在瀏覽器展示的全頁輪播
**Human Gate：** PM 確認：流程順序對應客戶溝通邏輯；圖示 / 截圖來源合法；無機密資訊
**Artifact：** HTML（單一 .html 檔，內嵌 CSS）
**Risk：** HTML 依賴外部 CDN 字型 / 圖示 → 內網展示可能壞；AI 可能產出過度複雜的 CSS 無法手動調整
**Next Node：** Gate preDev:9（SOW Gate，對客戶說明用）
```

### 4. WBS（wbs）
```markdown
**Input：** SOW 工作項目清單、技術架構草稿、角色分配表
**Output：** 3 層 WBS（Phase → Feature → Task）+ 每個 Task 工時估算 + 負責角色
**Human Gate：** 工程師確認工時合理；PM 確認與 SOW 對齊（無超出 / 遺漏）
**Artifact：** Markdown（樹狀結構 .md）→ 可轉 CSV 匯入 ASANA
**Risk：** Claude Code 可能把技術子任務拆太細（超出 SOW）；工時估算忽略測試 / review 時間
**Next Node：** preDev:6（Claude Code 任務拆分）→ preDev:10（PM 排程）
```

### 5. 專案組織架構規劃（org-chart）
```markdown
**Input：** SOW 角色定義、客戶窗口姓名、內部團隊成員名單
**Output：** 組織架構圖草稿（角色 → 人員 → 責任範疇 → 溝通線）
**Human Gate：** PM 確認每個角色已指定真實人員；客戶端窗口已確認並同意；DRI（直接負責人）欄位不可空白
**Artifact：** Markdown（表格格式）→ 可轉 PNG/SVG 進簡報
**Risk：** AI 可能填入假設性人員；職責邊界不清造成後期責任推諉
**Next Node：** preDev:5（工程師技術評估）→ preDev:8（PM 內部確認）
```

### 6. Prototype / UI 截圖分析（prototype）
```markdown
**Input：** 設計稿截圖或 Figma 連結、功能規格文字說明、技術限制（框架、尺寸）
**Output：** GPT 產出 UI 截圖 → Claude Code 轉 static HTML prototype
**Human Gate：** 工程師確認 HTML 可進入 repo（無需大量重構）；PM 確認 UX 流程符合需求
**Artifact：** HTML（static prototype，不含後端邏輯）
**Risk：** GPT 圖與 Claude Code HTML 有視覺落差；prototype 被誤認為正式版 → 需明確標示「僅供 demo」
**Next Node：** preDev:6（Claude Code 任務拆分）— 與 WBS 平行執行
```

### 7. 開發 Sprint 規劃（sprint-plan）
```markdown
**Input：** WBS Task 清單、Sprint 週期設定（1/2 週）、團隊 velocity（story points/sprint）
**Output：** Sprint 0-N 任務分配表（含 task / owner / story points / dependencies）
**Human Gate：** PM 拍板：Sprint N 範圍；velocity 是否合理；客戶驗收順序是否優先
**Artifact：** Markdown（表格）→ 可轉 CSV 匯入 ASANA
**Risk：** AI 排程忽略 team calendar（假期、待崗）；dependencies 推算錯誤導致後 Sprint 卡住
**Next Node：** preDev:10（PM 人工排程與里程碑）→ midDev 每個 Sprint 滾動更新
```

### 8. ASANA 任務管理（asana）
```markdown
**Input：** WBS Task 清單 / Sprint 規劃表、成員 email（ASANA account）、截止日期
**Output：** 符合 ASANA CSV import 格式的任務清單（Task Name / Assignee / Due Date / Section）
**Human Gate：** PM 匯入前確認：assignee email 對應正確、日期格式正確（YYYY-MM-DD）、無重複 task
**Artifact：** CSV（.csv，ASANA import template 格式）
**Risk：** email 欄位錯誤導致任務未指派；日期格式不合 ASANA 規格導致匯入失敗；重複匯入產生重複 task
**Next Node：** preDev:10 之後跨整個專案（preDev → midDev → postDev）
```

### 9. 里程碑提醒（milestone-reminder）
```markdown
**Input：** 工作計劃書里程碑清單、各里程碑日期、時區（Asia/Taipei）
**Output：** .ics 行事曆檔（符合 RFC 5545，可匯入 Google Calendar）
**Human Gate：** PM 匯入前確認：日期與工作計劃書一致；時區正確；里程碑名稱清楚（客戶可識別）
**Artifact：** ICS（.ics，RFC 5545）
**Risk：** AI 產出時區 UTC 未轉換；DTSTART / DTEND 格式錯誤導致匯入失敗；與 ASANA 里程碑名稱不一致
**Next Node：** preDev:10（PM 排程設定）→ 持續觸發至 postDev:12（KT / 保固交接）
```

## Verify 命令

```powershell
npx playwright test tests/e2e/schema-render.spec.js --reporter=list
# 預期 6/6 綠

# grep 確認欄位數（每種 key 應 = 9）
grep -c "^\*\*Input：" resources-catalog.md          # 9
grep -c "^\*\*Human Gate：" resources-catalog.md     # 9
grep -c "^\*\*Artifact：" resources-catalog.md       # 9
grep -c "^\*\*Risk：" resources-catalog.md           # 9
grep -c "^\*\*Next Node：" resources-catalog.md      # 9
```

## 4 Agent Review Prompts

**code-reviewer：**
```
Step 03 catalog content review

交付：resources-catalog.md（9 節各補 6 欄位）
git diff: [step-03 commit diff]

重點：
1. 9 × 6 = 54 欄位格式是否統一（全部 **Key：** bold，無遺漏）？
2. Next Node 引用的節點 ID（preDev:N、midDev:N）是否與 data.js 中的實際節點數量範圍一致（preDev 最多 11）？
3. Human Gate 是否每條都明確指出「誰」、「何時」、「決定什麼」3 要素？
4. Artifact 欄位是否只填 format 類型（Markdown / HTML / CSV / ICS），不摻雜工具名稱？
5. commit message 是否引用 priority #2？
```

**test-runner：**
```
Step 03 test runner

測試：tests/e2e/schema-render.spec.js（6 tests）

1. `getByText('Input：')` 是 contains match — 確認不會誤匹配到「Input：」以外的文字（如 prompt 範例內有「Input」字樣）
2. count >= 9 是否夠精確？是否應 === 9？（section 8、9 Tier 3 結構不同，若沒補到 Input 欄會漏測）
3. 既有 40+ 測試是否仍全綠？
```

**performance-investigator：**
```
Step 03 performance

resources-catalog.md 從原本 ~570 行擴充至 ~750 行（估計增加 ~180 行）。
1. marked.parse 時間是否增加顯著？（用 performance.now() 量測 parse 前後）
2. FCP 是否仍 < 1.5s（本地 server）？
```

**refactor-architect：**
```
Step 03 refactor

1. catalog 結構是否一致（所有 H3 section 欄位順序：Input → Output → Gate → Artifact → Risk → Next Node → 完整 Prompt）？
2. Tier 3 section（asana / milestone-reminder）的 Input/Output/Gate 欄位是否照實填，而非隨便帶過？
```

## Strict Pass Criteria

- `npx playwright test tests/e2e/schema-render.spec.js --repeat-each=3` → 18/18 綠
- `grep -c "^\*\*Input：" resources-catalog.md` → `9`
- `grep -c "^\*\*Human Gate：" resources-catalog.md` → `9`
- `grep -c "^\*\*Artifact：" resources-catalog.md` → `9`
- `grep -c "^\*\*Risk：" resources-catalog.md` → `9`
- 4 agents 全 PASS
