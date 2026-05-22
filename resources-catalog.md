# 接案流程資源對照表 (v3.8 對應)

---

## AI 使用決策矩陣

> 30 秒判斷：這件事能不能丟給 AI？

| 任務 | AI 可做 | 人必審 | 禁止 AI 代做 | 主要風險 |
|------|---------|--------|-------------|---------|
| 會議記錄 | 摘要、待辦清單 | 負責人、期限 | 承諾客戶交期 | 漏記決策 |
| 工作計劃書 | 草稿、架構 | 範疇、報價、條款 | 報價拍板、合約承諾 | Scope creep |
| 簡報（HTML） | 頁面草稿、架構 | 數字正確性、流程順序 | 對外直接展示未審稿 | 機密外洩 |
| WBS | 拆任務、估工時 | 依賴關係、工時合理性 | 最終估價、SOW 擴充 | 低估測試時間 |
| 組織架構 | 架構草稿、RACI | 人員指派、職責邊界 | 拍板人員與職責 | 假設性人員 |
| Prototype | UI 草稿、HTML 轉換 | UX 流程、技術可行性 | 視為正式版交付 | 視覺落差 |
| Sprint 規劃 | 排程草稿 | 優先序、人員可用性 | 直接承諾交期 | 忽略假期 |
| ASANA 任務 | CSV 草稿 | 匯入前檢查 | 自動建立正式任務 | 重複任務 |
| 里程碑提醒 | ICS 草稿 | 日期、時區、名稱 | 直接推送至客戶行事曆 | 時區偏差 |

---

## 圖例

### Tier — AI 使用風險等級

| Tier | 定義 |
|------|------|
| **1: Draft-safe** | AI 產草稿，不得直接交付；人必須校閱後再對外 |
| **2: Decision-assisted** | AI 輔助分析，關鍵決策由人完成；AI 可做資訊彙整 |
| **3: System-output** | AI 產系統匯入格式（CSV/ICS/JSON），人工觸發或審核後匯入 |
| **4: Human-only** | 報價、合約、UAT 驗收、Production 部署、CR 核准 — AI 不得代決策 |

### type — 沿用 `assets/data.js` 節點屬性

| type | 意義 |
|------|------|
| HUMAN | 人主導，AI 不介入 |
| COWORK | PM / QA 跟 AI 對話起草，人最後確認 |
| CLAUDECODE | 工程師用 Claude Code 在 repo 內生成 |
| DECISION | Gate 簽核點，人決定 |
| SYSTEM | CI / 部署 / 自動化，無需人工 |

---

## 一頁速查表

| # | id | 資源 | Tier | Primary type | Support | 對應節點 | Artifact | Status |
|---|-----|------|------|--------------|---------|----------|----------|--------|
| 1 | meeting-notes | 會議記錄 | 1 | COWORK | — | preDev:2 / midDev standup / postDev UAT | Markdown | DraftReady |
| 2 | work-plan | 工作計劃書 | 1 | COWORK | — | preDev:7 | Markdown | DraftReady |
| 3 | presentation | 簡報（HTML） | 1 | COWORK | — | preDev:7 後 → Gate preDev:9 | HTML | DraftReady |
| 4 | wbs | WBS | 2 | CLAUDECODE | — | preDev:6 | Markdown | DraftReady |
| 5 | org-chart | 專案組織架構規劃 | 2 | COWORK | HUMAN | preDev:5 → preDev:8 | Markdown | DraftReady |
| 6 | prototype | Prototype / UI 截圖分析 | 2 | CLAUDECODE | COWORK | preDev:6 | HTML | DraftReady |
| 7 | sprint-plan | 開發 Sprint 規劃 | 2 | COWORK | — | preDev:10 → midDev | Markdown | DraftReady |
| 8 | asana | ASANA 任務管理 | 3 | SYSTEM | — | preDev:10 跨階段 | CSV | DraftReady |
| 9 | milestone-reminder | 里程碑提醒 | 3 | SYSTEM | — | preDev:10 → postDev:12 | ICS | DraftReady |

---

## 9 個資源詳述

---

### 1. 會議記錄

**Tier 1: Draft-safe ｜ type: COWORK**

**Input：** 錄音檔或逐字稿、與會者名單、會議目的與議程
**Output：** 摘要 + 決策清單 + 待辦清單（負責人 + 期限）+ 待釐清問題
**Human Gate：** PM 在交付前確認：負責人姓名正確、期限可行、敏感資訊已脫敏
**Minimum Input：**
- 完整逐字稿或錄音檔（不接受模糊口述，缺此 AI 只能產佔位符）
- 與會者名單含角色（不可只寫人名）
- 會議目的（缺則 AI 無法判斷決策歸屬）
**Artifact：** Markdown（.md）
**Risk：** AI 可能漏記輕聲討論、混淆相似人名；摘要過短導致決策資訊遺失
**Next Node：** preDev:2（需求整理 Gate）/ midDev:2（Sprint standup）/ postDev:6（UAT 記錄）

- **對應節點**：preDev:2（需求整理）/ midDev 的 standup、sprint review / postDev 的 UAT、KT 會議
- **餵什麼**
  - 錄音檔或逐字稿
  - 與會者名單（角色）
  - 會議目的
  - 已知決策事項列表（選填）
- **AI 產什麼**
  - 時間軸摘要（≤200字）
  - 決策清單（表格）
  - 待辦清單（含負責人、期限）
  - 待釐清問題
- **人要確認**
  - 負責人指派是否正確
  - 期限是否合理
  - 敏感資訊（報價、個資）是否需遮蔽

**完整 prompt 範例**

```
你是 PM 助理，負責整理會議記錄。

會議目的：{{目的，例：需求訪談第一次}}
與會者：{{名單，例：PM 王小明、客戶方 陳大華 (業主)、工程師 林小芸}}

===逐字稿或錄音摘要===
{{貼上逐字稿}}
===

請輸出以下四個區塊，全部用 Markdown：

1. **摘要**（≤200字，條列重點，不寫廢話）
2. **決策清單**（三欄表格：決策項目 / 結論 / 反對意見或前提）
3. **待辦清單**（四欄表格：任務 / 負責人 / 期限 / 優先級(高/中/低)）
4. **待釐清問題**（條列，標出最晚需確認日期）

不要加引言或結語。
```

---

### 2. 工作計劃書

**Tier 1: Draft-safe ｜ type: COWORK**

**Input：** SOW 目標範疇、報價金額範圍、專案期限、客戶特殊要求
**Output：** 完整工作計劃書草稿（背景、範疇、WBS 摘要、里程碑、溝通機制、驗收條件）
**Human Gate：** PM Gate：範疇是否與 SOW 一致；工時估算是否含 buffer（≥10%）；客戶里程碑名稱確認
**Minimum Input：**
- SOW 功能範疇初稿（in-scope / out-of-scope 至少各 3 條，缺則 AI 只能產問題清單）
- 交期（缺則 AI 無法排里程碑）
- 預算區間（缺則工項估算無意義）
- 客戶背景（行業、規模，缺則風險假設脫離現實）
**Artifact：** Markdown（.md）→ 轉 PDF 交付
**Risk：** AI 可能自行擴大範疇（scope creep）；工時估算過於樂觀；術語與 SOW 不一致 → [governance.md#hard-rules](governance.md#hard-rules)
**Next Node：** preDev:7（PM Cowork SOW 初稿）→ Gate preDev:9（SOW Gate 對客戶）

- **對應節點**：preDev:7（PM Cowork SOW / 報價初稿）
- **餵什麼**
  - 專案目標（一兩句話）
  - 功能範疇（條列）
  - 交期
  - 預算範圍（可不寫確切數字，給區間）
  - 客戶背景（行業、規模）
  - 過去類似案的計劃書（選填，做風格參考）
- **AI 產什麼**
  - 專案背景與目標
  - Scope list（含 in-scope / out-of-scope）
  - 交付物清單
  - 時程里程碑表
  - 報價項目草稿（工項+工時，不含單價）
  - 風險與假設條款
- **人要確認**
  - 報價數字、單價
  - 特殊合約條款
  - 客戶的談判底線
  - Out-of-scope 範圍是否正確

**完整 prompt 範例**

```
你是資深 PM，負責撰寫軟體接案的工作計劃書初稿。

## 輸入資料
- 專案目標：{{一兩句話}}
- 功能範疇：
  {{條列功能，例：
  - 會員登入/註冊（含第三方）
  - 商品列表與搜尋
  - 購物車與結帳
  - 後台報表}}
- 交期：{{YYYY-MM-DD}}
- 預算區間：{{例：NT$50~80萬}}
- 客戶背景：{{行業、員工規模、現有系統}}
- 技術 stack（已知）：{{例：React + Node.js + PostgreSQL}}

## 輸出要求（全部 Markdown）

1. **專案概述**（背景 + 目標，≤150字）
2. **工作範疇**
   - In-scope 清單
   - Out-of-scope 清單（明確排除，避免後續爭議）
3. **交付物**（條列，含版本管理與文件說明）
4. **時程與里程碑**（表格：里程碑 / 預計完成 / 交付內容）
5. **工項與工時估算**（表格：模組 / 工項 / 工時(人天)，最後加總）
6. **假設與排除條款**（例：「客戶需於 3 個工作天內回覆審查意見」）
7. **風險摘要**（2~4 條，附緩解方式）

只產草稿，不要加「建議後續洽談」等結語。
```

---

### 3. 簡報（HTML 取代 PPT）

**Tier 1: Draft-safe ｜ type: COWORK**

**Input：** 工作計劃書、WBS 摘要、客戶背景、說明重點（3-5 條）
**Output：** 單一 HTML 簡報（含 CSS）、可在瀏覽器展示的全頁輪播
**Human Gate：** PM 確認：流程順序對應客戶溝通邏輯；圖示 / 截圖來源合法；無機密資訊
**Minimum Input：**
- 工作計劃書或 SOW 摘要（至少 3 個功能點或里程碑，缺則無法架構頁面）
- 受眾定義（客戶高層 / 技術對口 / 混合）
- 場合目的（初次提案 / 進度報告 / 上線說明）
**Artifact：** HTML（單一 .html 檔，內嵌 CSS）
**Risk：** HTML 依賴外部 CDN 字型 / 圖示 → 內網展示可能壞；AI 可能產出過度複雜的 CSS 無法手動調整
**Next Node：** Gate preDev:9（SOW Gate，對客戶說明用）

- **對應節點**：preDev:7（SOW 初稿）完成後 → Gate preDev:9（SOW Gate，對客戶用）
- **餵什麼**
  - 工作計劃書或 SOW（或條列重點）
  - 受眾（客戶高層 / 技術對口 / 混合）
  - 場合目的（初次提案 / 進度報告 / 上線說明）
  - 頁數上限（選填）
  - 風格偏好（選填：簡潔工程感 / 商業正式）
- **AI 產什麼**
  - 靜態 HTML 單頁 slide（`<section>` 架構，可用 CSS 分頁）
  - 各頁標題與重點條列
  - JS 動態效果（簡單 scroll 或 click 換頁）
- **人要確認**
  - 頁面邏輯與順序
  - 數字（報價、工時）準確性
  - 品牌色與 Logo
  - 敏感資訊是否移除

> **External Use Gate**：簡報送客戶或對外展示前，PM 必須完成以下 checklist，全部通過才可交付：
> 1. 範疇對齊 SOW（無超出範圍的功能承諾）
> 2. 所有數字（報價、工時、日期）皆人工填入並確認
> 3. 無 AI 幻覺承諾（未承諾 AI 自動完成的功能）
> 4. 客戶具名、個資、敏感業務資訊已脫敏
>
> ⚠ 未完成 Gate 不得對外發送，違者由 PM 負責。

**完整 prompt 範例**

```
你是前端工程師兼 PM 助理，負責把以下提案重點轉成靜態 HTML 簡報頁面。

## 簡報資訊
- 受眾：{{客戶高層 / 技術對口 / 混合}}
- 場合：{{例：初次提案，30分鐘，Q&A 10分鐘}}
- 風格：簡潔工程感，深色底白字，無花俏動畫
- 頁數：{{5~8 頁}}

## 內容來源
{{貼上工作計劃書摘要或 SOW 重點}}

## 技術要求
- 單一 HTML 檔案，不依賴 CDN（使用 inline CSS + JS）
- 鍵盤左右鍵或按鈕換頁
- 每頁有頁碼（當前/總頁）
- 字型使用系統字型，不 import 外部字型

## 頁面大綱建議
1. 封面（專案名稱、提案日期、公司）
2. 專案目標與範疇（重點條列）
3. 技術方案概覽
4. 時程里程碑表
5. 工項與報價摘要（數字先留 {{PRICE}} placeholder）
6. 風險與保固說明
7. 下一步行動

直接輸出完整 HTML，不加說明文字。
```

---

### 4. WBS（Work Breakdown Structure）

**Tier 2: Decision-assisted ｜ type: CLAUDECODE**

> ⚠ **WBS 不得作為報價依據**，必須由 PM / 工程師覆核工時後才可用於報價或 SOW。

**Input：** SOW 工作項目清單、技術架構草稿、角色分配表
**Output：** 3 層 WBS（Phase → Feature → Task）+ 每個 Task 工時估算 + 負責角色
**Human Gate：** 工程師確認工時合理；PM 確認與 SOW 對齊（無超出 / 遺漏）
**Minimum Input：**
- SOW Scope list（in-scope 功能清單，缺則 AI 只能產泛用模板）
- 交付物清單（缺則文件工項無法估算）
- 團隊角色配置（人數 + 專長，缺則負責角色欄空白）
- 技術 stack（缺則任務粒度無法對應實作）
**Artifact：** Markdown（樹狀結構 .md）→ 可轉 CSV 匯入 ASANA
**Risk：** Claude Code 可能把技術子任務拆太細（超出 SOW）；工時估算忽略測試 / review 時間 → [governance.md#hard-rules](governance.md#hard-rules)
**Next Node：** preDev:6（Claude Code 任務拆分）→ preDev:10（PM 排程）

- **對應節點**：preDev:6（Claude Code 任務拆分與技術草稿）
- **餵什麼**
  - SOW（Scope list）
  - 交付物清單
  - 團隊角色（PM / QA / 工程師 / 前後端比例）
  - 技術 stack
- **AI 產什麼**
  - 樹狀工作包（最多三層：階段 → 模組 → 任務）
  - 每個任務的工時估算範圍（樂觀 / 悲觀 / 期望）
  - 遺漏項警告（AI 主動提出「這類專案通常還需要…」）
  - Markdown / CSV 雙輸出
- **人要確認**
  - 估算合理性（對照過去案例）
  - 任務依賴關係
  - 遺漏警告是否採納
  - 誰負責哪塊

**完整 prompt 範例**

```
你是技術 PM，負責從 SOW 拆解 WBS。

## 輸入
### SOW 功能範疇
{{貼上 Scope list}}

### 交付物
{{條列，例：API 文件、部署說明、操作手冊、原始碼}}

### 團隊配置
{{例：1 PM、1 QA、2 工程師（1 前端 1 後端）}}

### 技術 stack
{{例：Next.js + FastAPI + PostgreSQL + Docker}}

## 輸出要求

1. **WBS 樹狀清單**（Markdown nested list）
   - 第一層：開發前 / 開發中 / 開發後 / 保固
   - 第二層：模組（例：會員系統、購物車）
   - 第三層：任務（例：實作 JWT 登入）
   
2. **工時估算表**（CSV 格式）
   欄位：任務ID, 任務名稱, 負責角色, 樂觀(人天), 悲觀(人天), 期望(人天)

3. **遺漏項警告**（條列，每項說明原因）

不要改變 SOW 範疇，只做拆解，不加新功能。
```

---

### 5. 專案組織架構規劃

**Tier 2: Decision-assisted ｜ Primary type: COWORK ｜ Support: HUMAN**

**Input：** SOW 角色定義、客戶窗口姓名、內部團隊成員名單
**Output：** 組織架構圖草稿（角色 → 人員 → 責任範疇 → 溝通線）
**Human Gate：** PM 確認每個角色已指定真實人員；客戶端窗口已確認並同意；DRI（直接負責人）欄位不可空白
**Minimum Input：**
- 我方團隊成員名單（姓名 + 角色 + 年資，缺則 AI 填入假設性人員）
- 客戶端窗口（業務窗口 + 技術窗口 + 決策層，各至少 1 人）
- 專案規模預估（人月，缺則工時分配無意義）
**Artifact：** Markdown（表格格式）→ 可轉 PNG/SVG 進簡報
**Risk：** AI 可能填入假設性人員；職責邊界不清造成後期責任推諉
**Next Node：** preDev:5（工程師技術評估）→ preDev:8（PM 內部確認）

- **對應節點**：preDev:5（工程師人工技術評估）完成後 → preDev:8（PM 人工內部確認）
- **餵什麼**
  - 團隊人數與每人專長
  - 客戶端對口（技術窗口 / 業務窗口 / 高層）
  - 專案規模（人月估算）
  - 是否有多供應商或外包
- **AI 產什麼**
  - 組織架構草稿（文字版或 ASCII 圖）
  - RACI 矩陣（誰負責 / 誰簽核 / 誰諮詢 / 誰知會）
  - 人天分配模型（各角色佔總工時比例）
  - 溝通節奏建議（會議頻率、管道）
- **人要確認**（此 Tier 2 核心）
  - 人員可用性（有無其他案子排擠）
  - 職責邊界最終決定
  - 客戶端層級對齊（避免跨級溝通）
  - 人天是否符合預算

**完整 prompt 範例**

```
你是 PM 顧問，負責規劃軟體接案的專案組織架構。

## 輸入
### 我方團隊
{{例：
- PM：1人，負責需求、進度、客戶溝通
- 工程師 A：後端，5年經驗
- 工程師 B：前後端都可，2年
- QA：1人，兼任測試文件}}

### 客戶端窗口
{{例：
- 業主（決策）：王總，週會 1 次
- 業務窗口：陳小姐，每日可聯絡
- 技術窗口：無（客戶無 IT 部門）}}

### 專案規模
{{例：預估 6 個月，總工時約 240 人天}}

### 外包或多供應商？
{{例：UI 設計外包 1 人，配合前端審查}}

## 輸出要求（Markdown）

1. **組織架構圖**（ASCII 或文字層級）
2. **RACI 矩陣**（表格：活動 / PM / 工程師A / 工程師B / QA / 客戶業務 / 客戶業主）
   - 每格填 R(負責) / A(簽核) / C(諮詢) / I(知會)
3. **各角色工時分配建議**（表格：角色 / 佔比 / 人天）
4. **溝通節奏建議**（表格：會議類型 / 頻率 / 參與者 / 時長）

請在每個建議旁加「⚠ 需人工確認」標記，表示需 PM 最終決定的項目。
```

---

### 6. Prototype 設計 / UI 截圖分析

**Tier 2: Decision-assisted ｜ Primary type: CLAUDECODE ｜ Support: COWORK**

**Input：** 設計稿截圖或 Figma 連結、功能規格文字說明、技術限制（框架、尺寸）
**Output：** GPT 產出 UI 截圖 → Claude Code 轉 static HTML prototype
**Human Gate：** 工程師確認 HTML 可進入 repo（無需大量重構）；PM 確認 UX 流程符合需求
**Minimum Input：**
- 功能清單（至少 2 個頁面 / 畫面，缺則無法決定 prototype 範圍）
- 使用者旅程（誰做什麼操作，缺則 AI 無法判斷頁面跳轉邏輯）
- 技術限制（框架、螢幕尺寸、是否支援 RWD）
**Artifact：** HTML（static prototype，不含後端邏輯）
**Risk：** GPT 圖與 Claude Code HTML 有視覺落差；prototype 被誤認為正式版 → 需明確標示「僅供 demo」
**Next Node：** preDev:6（Claude Code 任務拆分）— 與 WBS 平行執行

- **對應節點**：preDev:6（Claude Code 任務拆分）區，與 WBS 平行執行
- **作業路徑**
  1. **GPT 產圖片**：給出功能描述 + 風格 → 得 UI 截圖 / 線框圖
  2. **人工確認**：選出最接近需求的版本
  3. **Claude Code 轉 HTML**：以圖片為參考，生成互動 HTML prototype
- **餵什麼**（步驟 1 用）
  - 功能清單（要做哪幾個畫面）
  - 使用者旅程（誰做什麼操作）
  - 品牌色 / 字型（選填）
  - 競品截圖（選填，作風格參考）
- **AI 產什麼**
  - UI 截圖或線框圖（GPT）
  - HTML + CSS prototype（Claude Code）
- **人要確認**（Tier 2 核心）
  - 流程邏輯（按鈕觸發什麼、頁面跳轉）
  - UX 合理性（使用者會不會迷失）
  - 客戶視覺偏好（顏色、密度）

> **Demo 水印強制規則**：所有 Claude Code 產出的 prototype 必須在 viewport 右上角預設顯示浮水印，標示「DEMO / Not Production / 僅供需求確認」。移除浮水印需 PM 書面簽核，且僅在客戶明確同意後方可交付無水印版本。違反此規則，由工程師與 PM 共同承擔客戶誤認風險。

> **UI 截圖分析**：把客戶丟來的競品截圖或現有系統截圖，直接貼給 Claude / GPT chat，問「這個 UI 的資訊層級是什麼、有哪些互動模式、有什麼問題」。是最輕量的用法，不需要 prompt 模板。

**GPT 產圖 prompt 範例**

```
請幫我生成一個 SaaS 後台的 Dashboard 頁面 UI 設計截圖。

風格：簡潔工程感，淺色背景，左側 sidebar，頂部 header
頁面內容包含：
- 左側導覽選單（圖示 + 文字）
- 頂部顯示當前頁標題和用戶頭像
- 主區域：4 個 KPI 卡片（數字+趨勢箭頭）+ 折線圖 + 最新訂單表格

不要卡通風格，接近 Figma Community 的 Dashboard 範本風格。
解析度 1440x900。
```

**Claude Code 轉 HTML prompt 範例**

```
參考這張 UI 截圖，幫我生成一個靜態 HTML prototype。

要求：
- 單一 HTML 檔案，inline CSS
- 左側 sidebar + 頂部 header + 主內容區三欄布局
- 用假資料填充（KPI 卡片：4 個，折線圖：用 Chart.js CDN，訂單表格：5 筆）
- 不需要連後端，全部 static
- Sidebar 的 nav link 加 active class 效果（JavaScript 切換）

不需要 RWD，只做桌面版。直接輸出完整 HTML。
```

---

### 7. 開發 Sprint 規劃

**Tier 2: Decision-assisted ｜ type: COWORK**

**Input：** WBS Task 清單、Sprint 週期設定（1/2 週）、團隊 velocity（story points/sprint）
**Output：** Sprint 0-N 任務分配表（含 task / owner / story points / dependencies）
**Human Gate：** PM 拍板：Sprint N 範圍；velocity 是否合理；客戶驗收順序是否優先
**Minimum Input：**
- WBS 任務清單（含工時估算 + 依賴關係，缺則排程為空）
- 團隊 velocity（每人每 Sprint 可用人天，缺則無法計算 Sprint 容量）
- Sprint 長度（1 週 / 2 週）
- 不可移動里程碑日期（缺則排程無法對齊交期）
**Artifact：** Markdown（表格）→ 可轉 CSV 匯入 ASANA
**Risk：** AI 排程忽略 team calendar（假期、待崗）；dependencies 推算錯誤導致後 Sprint 卡住
**Next Node：** preDev:10（PM 人工排程與里程碑）→ midDev 每個 Sprint 滾動更新

- **對應節點**：preDev:10（PM 人工排程與里程碑）→ midDev 每個 Sprint 滾動更新
- **餵什麼**
  - WBS 任務清單（或待辦事項列表）
  - 團隊速度 velocity（每人每 Sprint 可完成人天，先給預估值）
  - Sprint 長度（1 週 / 2 週）
  - 里程碑日期（Gate 日期）
  - 哪些任務有先後依賴
- **AI 產什麼**
  - Sprint 分配表（哪個 Sprint 做哪些任務，誰負責）
  - 優先序建議（依業務風險 + 技術依賴排序）
  - 緩衝 Sprint 建議
  - 風險旗標（哪個 Sprint 塞太滿）
- **人要確認**（Tier 2 核心）
  - 優先序最終決策（業務價值判斷）
  - 人員可用性（假期、兼其他案）
  - 緩衝時間是否足夠
  - 客戶 Gate 日期是否正確

**完整 prompt 範例**

```
你是 PM，負責把 WBS 任務排成 Sprint 計畫。

## 輸入

### 待辦任務（來自 WBS）
{{貼上任務清單，每行一個任務，格式：任務名稱｜估算人天｜負責角色｜前置任務ID}}
例：
- T01 設計 DB Schema｜2｜後端｜無
- T02 實作 JWT 登入｜3｜後端｜T01
- T03 前端登入頁｜2｜前端｜T02
- T04 API 文件初稿｜1｜後端｜T01

### 團隊與速度
- 後端工程師：每 Sprint 可用 8 人天
- 前端工程師：每 Sprint 可用 8 人天
- Sprint 長度：2 週

### 里程碑（不可移動）
- {{YYYY-MM-DD}}：{{里程碑名稱，例：SOW Gate}}
- {{YYYY-MM-DD}}：{{里程碑名稱，例：Feature Freeze}}

## 輸出要求

1. **Sprint 分配表**（表格：Sprint # / 日期範圍 / 任務清單 / 負責人 / 人天小計）
2. **依賴衝突警告**（如有任務因前置未完成而無法安排）
3. **風險 Sprint**（哪幾個 Sprint 容量超過 80%，建議調整）
4. **建議緩衝**（在哪個里程碑前加 Buffer Sprint）

請在每個建議旁標「⚠ 需人工確認」。
```

---

### 8. ASANA 任務管理

**Tier 3: System-output ｜ type: SYSTEM**

**Input：** WBS Task 清單 / Sprint 規劃表、成員角色名稱（統一格式）、截止日期
**Output：** 符合 ASANA CSV import 格式的任務清單（Task Name / Assignee / Due Date / Section）
**Human Gate：** PM 匯入前確認：assignee email 對應正確、日期格式正確（YYYY-MM-DD）、無重複 task
**Minimum Input：**
- Sprint 規劃表或 WBS 任務清單（缺則無任務可轉）
- 成員角色名稱（全檔格式需一致，如「工程師A」；需匯入 ASANA 時再對應 email）
- 截止日期（YYYY-MM-DD 格式，缺則 Due Date 欄空白）
- 確認無重複 task（避免二次匯入產生重複）
**Artifact：** CSV（.csv，ASANA import template 格式）
**Risk：** email 欄位錯誤導致任務未指派；日期格式不合 ASANA 規格導致匯入失敗；重複匯入產生重複 task → [governance.md#tier4-reference](governance.md#tier4-reference)
**Next Node：** preDev:10 之後跨整個專案（preDev → midDev → postDev）

- **對應節點**：preDev:10 排程完成後建立，跨整個專案 preDev → midDev → postDev
- **Tier 3 意義**：AI 產出任務清單或 CSV，由人觸發匯入；或接 API/MCP 讓 AI 直接建立任務

**選型選項（不推薦，列供參考）**

| 方式 | 門檻 | 特點 |
|------|------|------|
| **A. 手動複製貼上** | 最低，零設定 | AI 產 Markdown 任務清單 → 人一條條建立 |
| **B. CSV 匯入** | 低，需整理格式 | AI 產符合 ASANA CSV schema 的檔案 → 人上傳匯入 |
| **C. MCP 直連** | 高，需付費版 ASANA | Claude Code 透過 MCP 直接建任務、更新狀態 |
| **D. 免費 REST API** | 中高，需做 OAuth 認證 | 認證流程繁雜，需花時間設定 |

**AI 產 ASANA CSV prompt 範例（方式 B）**

```
根據以下 Sprint 計畫，產出一份符合 ASANA CSV 匯入格式的檔案。

ASANA CSV 欄位（按順序）：
Name, Assignee, Due Date, Start Date, Type, Description, Priority

## Sprint 計畫
{{貼上 Sprint 分配表}}

## 輸出格式
- 第一行：CSV 標頭
- 每個任務一行
- Due Date 格式：YYYY-MM-DD
- Type 全部填 Task
- Priority 對應：人天>3 填 High，1~3 填 Medium，<1 填 Low
- Assignee 填角色名稱（例：工程師A），不需 email

只輸出 CSV 內容，不加說明。
```

---

### 9. 里程碑提醒

**Tier 3: System-output ｜ type: SYSTEM**

**Input：** 工作計劃書里程碑清單、各里程碑日期、時區（Asia/Taipei）
**Output：** .ics 行事曆檔（符合 RFC 5545，可匯入 Google Calendar）
**Human Gate：** PM 匯入前確認：日期與工作計劃書一致；時區正確；里程碑名稱清楚（客戶可識別）
**Minimum Input：**
- 里程碑清單（名稱 + 日期，至少 2 個，缺則 ICS 無內容）
- 日期格式統一（YYYY-MM-DD，缺則 AI 格式可能不一致）
- 時區確認（Asia/Taipei，缺則預設 UTC 導致時間偏差 8 小時）
- 里程碑名稱與 ASANA / 工作計劃書一致（缺則跨工具對照困難）
**Artifact：** ICS（.ics，RFC 5545）
**Risk：** AI 產出時區 UTC 未轉換；DTSTART / DTEND 格式錯誤導致匯入失敗；與 ASANA 里程碑名稱不一致
**Next Node：** preDev:10（PM 排程設定）→ 持續觸發至 postDev:12（KT / 保固交接）

- **對應節點**：preDev:10（PM 排程）設定 → 持續觸發至 postDev:12（KT/保固交接）
- **Tier 3 意義**：AI 產 `.ics` / 提醒清單，由人匯入 / 設定；或接排程系統自動推送

**選型選項（不推薦，列供參考）**

| 方式 | 門檻 | 特點 |
|------|------|------|
| **A. ASANA 內建提醒** | 最低，ASANA 任務建好即有 | 需已建立 ASANA 任務（見資源 8） |
| **B. Google Calendar ICS 匯入** | 低，AI 產檔案一次匯入 | `.ics` 檔案人工觸發，不需帳號串接 |
| **C. Slack / Line 機器人** | 中，需建 bot + webhook | 免費，但需時間設定 |
| **D. n8n 排程推送** | 高，需架設 n8n 或使用 cloud | 定期抓 ASANA 進度 → 摘要 → email + Line |

**AI 產 `.ics` 檔案 prompt 範例（方式 B）**

```
根據以下里程碑清單，產出一份 iCalendar (.ics) 檔案，可以直接匯入 Google Calendar。

## 里程碑清單
{{例：
- 2026-06-01：SOW 簽核 Gate
- 2026-07-15：Feature Freeze
- 2026-07-22：UAT 開始
- 2026-08-05：正式上線
- 2026-11-05：保固結束}}

## 設定
- 每個里程碑加一個提前 3 天的提醒（VALARM）
- 活動時間：全天（DTSTART;VALUE=DATE 格式）
- 每個 SUMMARY 加前綴「[專案] 」，例：「[專案] SOW 簽核 Gate」
- PRODID：-//AI Cowork//Milestone//TW

直接輸出 `.ics` 文字內容，不加說明，從 BEGIN:VCALENDAR 開始。
```

---

## Tier 3 系統整合總覽

> ⚠ **本區域所列項目皆不建議優先實作**
> - 僅作為未來可能整合的路徑紀錄
> - 每個方案都有額外帳號 / OAuth / Bot / n8n 維護成本
> - MVP 階段請維持 Tier 1: Draft-safe / Tier 2: Decision-assisted 的 markdown / CSV / ICS 產出
> - 列入此區不等於已選型；正式採用前需獨立 RFC

```
⚠ ASANA 任務管理：
  A. 手動    → 零設定，最慢
  B. CSV 匯入 → AI 產 CSV，一次匯入
  C. MCP 直連 → 需 ASANA 付費版
  D. REST API → 需 OAuth 認證

⚠ 里程碑提醒：
  A. ASANA 內建 → 依賴 ASANA 任務已建立
  B. ICS 匯入   → AI 產 .ics，人工一次匯入 Google Calendar
  C. Slack/Line  → 免費但需建 bot
  D. n8n         → 最強自動化，最高門檻
```

---

## 階段流向總覽

```
preDev（開始）
  需求訪談（HUMAN）
    ↓
    [1. 會議記錄] ← 逐字稿 → 摘要+待辦
    ↓
    [4. WBS] ← SOW → 任務樹+工時估算
    [6. Prototype] ← 功能清單 → GPT 圖 → HTML
    [5. 組織架構規劃] ← 人員配置 → RACI+溝通節奏（⚠人工確認）
    ↓
    [2. 工作計劃書] ← 目標範疇預算 → 計劃書草稿
    [3. 簡報 HTML]  ← 計劃書 → 對客戶簡報頁
    ↓
  SOW Gate（DECISION，人簽核）
    ↓
    [7. Sprint 規劃] ← WBS+速度+里程碑 → Sprint 表（⚠人工確認）
    ↓
    [8. ASANA] ← Sprint 表 → CSV 匯入 or 手動建立（Tier 3）
    [9. 里程碑提醒] ← 里程碑日期 → ICS 匯入 or ASANA 內建（Tier 3）

midDev（進行中）
  [7. Sprint 滾動] ← 每 Sprint 回顧 → 更新優先序（⚠人工確認）
  [8. ASANA 更新]  ← Sprint 結果 → 更新任務狀態（Tier 3）
  [9. 提醒觸發]    ← 里程碑接近 → 系統推送（Tier 3）
  [1. 會議記錄]    ← standup / sprint review → 摘要+待辦

postDev（收尾）
  [1. 會議記錄]    ← UAT 會議 / KT 會議 → 摘要+行動項
  [3. 簡報 HTML]   ← 上線報告 → 對客戶簡報
  [9. 里程碑提醒]  ← 保固 SLA → 提醒（Tier 3 持續）
```

---

*對應 dashboard 版本：v3.8 | 節點 id 參照 `assets/data.js`*

---

## Tier 4 Human-only — 禁止 AI 代決策

> 以下項目 AI 可協助準備資料與草稿，但**絕對不得以 AI 產出直接作為決策依據或對外承諾**。
> 正式核准、簽字、部署指令必須由具責任的人工完成。
> 如違反，由具名決策者承擔完整責任。

### 4-A. 報價與合約簽署

**AI 可做：** 起草報價說明文字、整理 SOW 條款對照表、標記需填寫欄位（金額/單價/條款）
**禁止 AI：** 直接填入報價金額、代表公司簽署任何合約、對客戶承諾交期或費用
**負責人：** PM（報價草稿）+ 業務主管或授權代理人（最終發送）
**升級條件：** 若僅需草稿整理且客戶明確知情為 AI 草稿 → 可降至 Tier 2: Decision-assisted

### 4-B. UAT 驗收簽核

**AI 可做：** 產出 UAT checklist 草稿、整理測試結果摘要、標記未通過項目
**禁止 AI：** 自行判定 UAT 通過、在驗收文件上代填「通過」、通知客戶上線
**負責人：** QA + PM 共同簽核；客戶業主最終確認
**升級條件：** AI 只做測試輔助紀錄（不觸碰簽核流程）→ 可降至 Tier 1: Draft-safe

### 4-C. Production 部署與 Hotfix

**AI 可做：** 產出部署 runbook 草稿、整理回滾步驟清單、分析錯誤 log
**禁止 AI：** 執行任何正式環境指令、觸發部署流程、刪除生產資料、修改正式環境設定
**負責人：** 資深工程師 + DevOps（部署）；PM 確認維護視窗
**升級條件：** 僅 PR 審查輔助或測試環境操作 → 可降至 Tier 2: Decision-assisted

### 4-D. CR 變更申請核准

**AI 可做：** 起草 CR 說明文件、整理 scope change 影響分析、標記受影響的 SOW 條款
**禁止 AI：** 同意任何 scope 變更、修改已簽約範疇、承諾額外工時或費用
**負責人：** PM 評估影響 + 業務主管或授權代理人核准
**升級條件：** 若 CR 不涉及費用/交期變動且客戶主動確認 → PM 可自行判定
