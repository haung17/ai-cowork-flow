// assets/data.js
window.AppData = {};

// 角色常數
const ROLE = { PM: 'pm', QA: 'qa', ENG: 'eng', SYSTEM: 'system' };
const TYPE = { HUMAN: 'human', COWORK: 'cowork', DECISION: 'decision', SYSTEM: 'system' };

AppData.flowcharts = {
  main: {
    title: '接案軟體開發流程與 AI Cowork 介入點',
    nodes: [
      { id: 'A', role: ROLE.SYSTEM,  type: TYPE.SYSTEM,   title: '客戶需求進來',            bullets: [],                                                              x: 45, y: 2   },
      { id: 'B', role: ROLE.PM,      type: TYPE.HUMAN,    title: '需求訪談 / 目標確認',      bullets: ['訪談目的與範圍','確認使用者角色','釐清商業規則'],               x: 45, y: 8   },
      { id: 'C', role: ROLE.PM,      type: TYPE.COWORK,   title: '整理會議紀錄',             bullets: ['功能清單','操作流程','商業規則','待確認問題'],                  x: 45, y: 15  },
      { id: 'D', role: ROLE.PM,      type: TYPE.HUMAN,    title: '範圍、優先序、里程碑確認', bullets: ['本期 / 二期切分','Must/Should/Could','里程碑日期'],             x: 45, y: 22  },
      { id: 'E', role: ROLE.QA,      type: TYPE.COWORK,   title: '測試案例初稿',             bullets: ['正常流程測試','異常情境測試','邊界值測試','權限測試'],          x: 20, y: 29  },
      { id: 'F', role: ROLE.ENG,     type: TYPE.HUMAN,    title: '技術評估 / 工時估算',      bullets: ['可行性確認','工時估算','技術風險','API / DB 影響'],              x: 70, y: 29  },
      { id: 'G', role: ROLE.QA,      type: TYPE.HUMAN,    title: '測試策略確認',             bullets: ['高風險功能','自動化範圍','測試環境'],                          x: 20, y: 36  },
      { id: 'H', role: ROLE.PM,      type: TYPE.HUMAN,    title: '排程 / 任務分派',          bullets: ['Sprint 計畫','任務指派','依賴確認'],                           x: 45, y: 43  },
      { id: 'I', role: ROLE.ENG,     type: TYPE.HUMAN,    title: '開發實作',                bullets: ['功能開發','Code Review','分支管理'],                           x: 45, y: 50  },
      { id: 'J', role: ROLE.ENG,     type: TYPE.COWORK,   title: '測試 skeleton / PR 協助',  bullets: ['自動生成測試框架','PR 摘要草稿','文件草稿'],                  x: 70, y: 50  },
      { id: 'K', role: ROLE.QA,      type: TYPE.COWORK,   title: '自動跑 smoke/E2E',         bullets: ['GitHub Actions','Playwright E2E','API 測試','Regression 報告'],x: 20, y: 57  },
      { id: 'L', role: ROLE.QA,      type: TYPE.HUMAN,    title: '探索測試 / 缺陷判定',     bullets: ['手動探索','Bug 確認','風險評估'],                              x: 45, y: 57  },
      { id: 'M', role: ROLE.SYSTEM,  type: TYPE.DECISION, title: '可進 UAT？',              bullets: [],                                                              x: 45, y: 64  },
      { id: 'N', role: ROLE.PM,      type: TYPE.HUMAN,    title: '協調修正優先順序',         bullets: ['阻塞排除','優先序重排','通知客戶'],                            x: 20, y: 71  },
      { id: 'O', role: ROLE.PM,      type: TYPE.COWORK,   title: 'Demo 腳本 / 驗收清單',    bullets: ['Demo 順序','帳號與資料準備','驗收 checklist'],                 x: 70, y: 71  },
      { id: 'P', role: ROLE.PM,      type: TYPE.HUMAN,    title: '客戶 UAT 安排',           bullets: ['測試環境確認','UAT 時間排定','陪同驗收'],                      x: 70, y: 78  },
      { id: 'Q', role: ROLE.SYSTEM,  type: TYPE.SYSTEM,   title: '客戶驗收回饋',            bullets: [],                                                              x: 70, y: 85  },
      { id: 'R', role: ROLE.PM,      type: TYPE.COWORK,   title: '回饋分類',                bullets: ['Bug / 新需求 / 問題','優先級建議','影響範圍'],                  x: 70, y: 92  },
      { id: 'S', role: ROLE.PM,      type: TYPE.HUMAN,    title: '決策：修正 / 延後 / 加價', bullets: ['商務決策','範圍控制','客戶溝通'],                             x: 45, y: 92  },
      { id: 'T', role: ROLE.QA,      type: TYPE.HUMAN,    title: '回歸 / 放行建議',         bullets: ['完整回歸','放行評估','已知風險列出'],                          x: 45, y: 99  },
      { id: 'U', role: ROLE.SYSTEM,  type: TYPE.DECISION, title: '是否上線？',              bullets: [],                                                              x: 45, y: 106 },
      { id: 'V', role: ROLE.PM,      type: TYPE.COWORK,   title: 'Release Note / 交接文件',  bullets: ['Release Note','操作手冊草稿','結案 checklist'],               x: 70, y: 113 },
      { id: 'W', role: ROLE.PM,      type: TYPE.HUMAN,    title: '簽核 / 結案 / 二期整理',  bullets: ['客戶簽核','保固起算','Phase 2 backlog'],                       x: 45, y: 120 },
    ],
    edges: [
      {from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},
      {from:'D',to:'E'},{from:'D',to:'F'},{from:'E',to:'G'},
      {from:'F',to:'H'},{from:'G',to:'H'},{from:'H',to:'I'},
      {from:'I',to:'J'},{from:'I',to:'K'},{from:'K',to:'L'},
      {from:'J',to:'L'},{from:'L',to:'M'},
      {from:'M',to:'N',label:'否'},{from:'N',to:'I'},
      {from:'M',to:'O',label:'是'},{from:'O',to:'P'},
      {from:'P',to:'Q'},{from:'Q',to:'R'},{from:'R',to:'S'},
      {from:'S',to:'T'},{from:'T',to:'U'},
      {from:'U',to:'I',label:'否'},{from:'U',to:'V',label:'是'},
      {from:'V',to:'W'},
    ]
  },

  // ── 開發前 ─────────────────────────────────────────────
  // 新增 3 節點：
  //   M(x:20,y:65) QA-Cowork 測試金字塔 + 非功能測試
  //   N(x:70,y:58) Eng-Cowork OpenAPI / DB Schema 草稿
  //   O(x:70,y:65) Eng-人工  API 契約 / Schema Review
  // L(整合排程) 移至 y:79 匯聚兩條新路徑
  preDev: {
    title: '開發前：需求釐清、測試規劃與技術評估',
    nodes: [
      { id:'A', role:ROLE.SYSTEM, type:TYPE.SYSTEM,   title:'客戶需求',                    bullets:[],                                                                  x:45, y:2  },
      { id:'B', role:ROLE.PM,     type:TYPE.HUMAN,    title:'訪談、釐清目的與範圍',         bullets:['訪談紀錄','目的確認','使用者角色'],                                x:45, y:9  },
      { id:'C', role:ROLE.PM,     type:TYPE.COWORK,   title:'整理會議紀錄',                bullets:['功能清單','操作流程','商業規則'],                                  x:45, y:16 },
      { id:'D', role:ROLE.PM,     type:TYPE.COWORK,   title:'需求清單 / User Story / AC',  bullets:['User Story 草稿','Acceptance Criteria','Edge cases'],             x:45, y:23 },
      { id:'E', role:ROLE.PM,     type:TYPE.COWORK,   title:'未確認事項 / 風險清單',       bullets:['待客戶確認問題','技術依賴','外部風險'],                            x:45, y:30 },
      { id:'F', role:ROLE.PM,     type:TYPE.HUMAN,    title:'確認本期/二期、優先序',        bullets:['範圍切分','Must/Should/Could','商務範圍'],                         x:45, y:37 },
      { id:'G', role:ROLE.QA,     type:TYPE.COWORK,   title:'測試案例初稿',                bullets:['正常流程','異常情境','邊界值','權限'],                             x:20, y:44 },
      { id:'H', role:ROLE.QA,     type:TYPE.COWORK,   title:'邊界案例 / 測試資料草稿',     bullets:['空值/超長/特殊字元','錯誤格式資料','測試帳號'],                    x:20, y:51 },
      { id:'I', role:ROLE.QA,     type:TYPE.HUMAN,    title:'確認測試策略與重點風險',      bullets:['高風險功能','自動化策略','測試環境'],                              x:20, y:58 },
      { id:'J', role:ROLE.ENG,    type:TYPE.HUMAN,    title:'技術可行性、架構、工時評估',  bullets:['可行性確認','架構設計','工時估算'],                                x:70, y:44 },
      { id:'K', role:ROLE.ENG,    type:TYPE.COWORK,   title:'技術任務拆分草稿',            bullets:['前端任務','後端任務','DB 任務'],                                  x:70, y:51 },
      // ── 新增節點 ──
      { id:'M', role:ROLE.QA,     type:TYPE.COWORK,   title:'測試金字塔 + 非功能測試',     bullets:['Unit/Integration/E2E 分層','效能測試場景','安全 (OWASP) 清單','無障礙 (WCAG) 對照'], x:20, y:65 },
      { id:'N', role:ROLE.ENG,    type:TYPE.COWORK,   title:'OpenAPI / DB Schema 草稿',    bullets:['Endpoint / Payload 草稿','Mock server 規格','DB schema 提案','錯誤碼定義'],          x:70, y:58 },
      { id:'O', role:ROLE.ENG,    type:TYPE.HUMAN,    title:'API 契約 / Schema Review',    bullets:['前後端共識確認','契約測試規劃','向下相容性'],                      x:70, y:65 },
      { id:'L', role:ROLE.PM,     type:TYPE.HUMAN,    title:'整合排程 / 分派任務 / 里程碑', bullets:['Sprint 計畫','任務指派','里程碑確認'],                            x:45, y:79 },
    ],
    edges: [
      {from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},
      {from:'D',to:'E'},{from:'E',to:'F'},
      {from:'F',to:'G'},{from:'F',to:'J'},
      {from:'G',to:'H'},{from:'H',to:'I'},
      {from:'J',to:'K'},
      {from:'I',to:'M'},{from:'M',to:'L'},
      {from:'K',to:'N'},{from:'N',to:'O'},{from:'O',to:'L'},
    ]
  },

  // ── 開發中 ─────────────────────────────────────────────
  // 新增 3 節點：
  //   P(x:45,y:16) Eng-人工  Code Review
  //   Q(x:45,y:30) PM-人工   Bug Triage 三角共議
  //   S(x:70,y:37) PM-Cowork 風險登錄週更新
  // D 加 Staging 部署 bullets；G 加 Standup 準備；H 改名含 Daily Standup
  midDev: {
    title: '開發中：開發執行、測試驗證與進度協調',
    nodes: [
      { id:'A', role:ROLE.SYSTEM, type:TYPE.SYSTEM,   title:'任務進入開發',               bullets:[],                                                                  x:45, y:2  },
      { id:'B', role:ROLE.ENG,    type:TYPE.HUMAN,    title:'實作功能',                   bullets:['功能開發','技術決策','分支管理'],                                  x:45, y:9  },
      { id:'C', role:ROLE.ENG,    type:TYPE.COWORK,   title:'PR / 文件 / 測試碼草稿',     bullets:['PR 摘要草稿','文件草稿','測試 skeleton','Lint / 型別預檢'],         x:70, y:9  },
      // ── 新增：Code Review（x:45 與 D 同 y:16 不同欄）──
      { id:'P', role:ROLE.ENG,    type:TYPE.HUMAN,    title:'Code Review',               bullets:['Reviewer 指派','回合討論','修正後 re-review','approve / merge'],    x:45, y:16 },
      { id:'D', role:ROLE.SYSTEM, type:TYPE.SYSTEM,   title:'CI / Staging 部署',         bullets:['自動建置 & 測試','部署到 Staging','Smoke 自動驗證','失敗自動回滾'], x:70, y:16 },
      { id:'E', role:ROLE.QA,     type:TYPE.COWORK,   title:'整理測試結果 / 失敗初判',    bullets:['失敗原因初判','Selector 問題','API 錯誤','資料前置不足'],           x:70, y:23 },
      { id:'F', role:ROLE.QA,     type:TYPE.HUMAN,    title:'手測 / 探索測試 / Bug 確認', bullets:['手動探索','Bug ticket 產出','嚴重程度分級'],                       x:45, y:23 },
      // ── 新增：Bug Triage（x:45 與 G 同 y:30 不同欄）──
      { id:'Q', role:ROLE.PM,     type:TYPE.HUMAN,    title:'Bug Triage 三角共議',       bullets:['Severity (QA 定)','Priority (PM 定)','技術影響 (Eng 估)','本週/下週修'], x:45, y:30 },
      { id:'G', role:ROLE.PM,     type:TYPE.COWORK,   title:'進度摘要 / Standup 準備 / 阻塞提醒', bullets:['今日完成','進行中','阻塞項目','Standup 前摘要'],         x:20, y:30 },
      { id:'H', role:ROLE.PM,     type:TYPE.HUMAN,    title:'Daily Standup / 排除阻塞',  bullets:['今日待辦確認','阻塞排除','資源協調','客戶溝通'],                    x:20, y:37 },
      // ── 新增：風險登錄（x:70 與 H 同 y:37 不同欄）──
      { id:'S', role:ROLE.PM,     type:TYPE.COWORK,   title:'風險登錄週更新',            bullets:['風險已發生 / 已解除','新增風險','責任人 / 觸發條件','對 PM 提示'],   x:70, y:37 },
      { id:'I', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'客戶變更需求？',            bullets:[],                                                                  x:45, y:44 },
      { id:'J', role:ROLE.PM,     type:TYPE.COWORK,   title:'規格差異比對 / 影響範圍',    bullets:['新舊需求差異','影響模組','QA 回歸建議'],                           x:70, y:51 },
      { id:'K', role:ROLE.PM,     type:TYPE.HUMAN,    title:'決定接受 / 延後 / 加價',    bullets:['商務決策','Change request','時程調整'],                            x:70, y:58 },
      { id:'L', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'Bug 修完了嗎？',            bullets:[],                                                                  x:20, y:51 },
      { id:'M', role:ROLE.QA,     type:TYPE.COWORK,   title:'回歸測試建議',              bullets:['影響模組分析','回歸範圍','優先測試項'],                             x:20, y:58 },
      { id:'N', role:ROLE.QA,     type:TYPE.HUMAN,    title:'回歸確認',                  bullets:['核心流程確認','修復驗證','已知問題記錄'],                           x:20, y:65 },
      { id:'O', role:ROLE.PM,     type:TYPE.COWORK,   title:'Demo 腳本 / 驗收清單草稿',  bullets:['Demo 順序','資料準備','驗收 checklist'],                           x:45, y:72 },
    ],
    edges: [
      {from:'A',to:'B'},
      {from:'B',to:'C'},
      {from:'C',to:'P'},{from:'P',to:'D'},
      {from:'D',to:'E'},
      {from:'B',to:'F'},{from:'E',to:'F'},
      {from:'F',to:'Q'},{from:'Q',to:'G'},
      {from:'G',to:'H'},
      {from:'H',to:'S'},{from:'S',to:'I'},
      {from:'I',to:'J',label:'是'},{from:'J',to:'K'},{from:'K',to:'B'},
      {from:'I',to:'L',label:'否'},{from:'L',to:'B',label:'否'},{from:'L',to:'M',label:'是'},
      {from:'M',to:'N'},{from:'N',to:'O'},
    ]
  },

  // ── 開發後 ─────────────────────────────────────────────
  // 新增 3 節點：
  //   P(x:70,y:58) Eng-Cowork Canary / 灰度發布建議（K→P→L）
  //   Q(x:20,y:62) Eng-Cowork Observability 設置（L→Q→M）
  //   R(x:20,y:79) PM-人工   Sprint Retrospective（O→R）
  postDev: {
    title: '開發後：驗收回饋、上線交付與結案整理',
    nodes: [
      { id:'A', role:ROLE.SYSTEM, type:TYPE.SYSTEM,   title:'功能完成候選版本',              bullets:[],                                                              x:45, y:2  },
      { id:'B', role:ROLE.QA,     type:TYPE.HUMAN,    title:'完整回歸 / 放行評估',           bullets:['完整回歸','嚴重 bug 判斷','放行建議'],                          x:45, y:9  },
      { id:'C', role:ROLE.QA,     type:TYPE.COWORK,   title:'測試報告 / 已知問題清單',      bullets:['測試覆蓋率','通過率','未修復 bug','高風險區域'],                  x:70, y:9  },
      { id:'D', role:ROLE.PM,     type:TYPE.HUMAN,    title:'安排 UAT',                     bullets:['測試環境確認','UAT 時程','陪同驗收'],                           x:45, y:16 },
      { id:'E', role:ROLE.SYSTEM, type:TYPE.SYSTEM,   title:'客戶回饋',                     bullets:[],                                                              x:45, y:23 },
      { id:'F', role:ROLE.PM,     type:TYPE.COWORK,   title:'分類：bug / 新需求 / 操作問題', bullets:['真 Bug','規格遺漏','新需求','操作誤解'],                        x:70, y:23 },
      { id:'G', role:ROLE.PM,     type:TYPE.HUMAN,    title:'決定修正 / 延後 / 加價 / 二期', bullets:['商務決策','範圍控制','客戶確認'],                               x:45, y:30 },
      { id:'H', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'阻擋上線？',                   bullets:[],                                                              x:45, y:37 },
      { id:'I', role:ROLE.ENG,    type:TYPE.HUMAN,    title:'修正',                         bullets:['Bug 修復','功能補實','Code Review'],                           x:20, y:44 },
      { id:'J', role:ROLE.PM,     type:TYPE.COWORK,   title:'Release Note / 交接文件 / 結案 checklist', bullets:['Release Note','操作手冊草稿','交接清單','結案 checklist'], x:70, y:44 },
      { id:'K', role:ROLE.QA,     type:TYPE.HUMAN,    title:'上線前 Smoke Check',           bullets:['主流程確認','關鍵功能可用','環境確認'],                         x:70, y:51 },
      // ── 新增：Canary（x:70,y:58 與 L 同 y:58 不同欄）──
      { id:'P', role:ROLE.ENG,    type:TYPE.COWORK,   title:'Canary / 灰度發布建議',        bullets:['流量比例建議','觀察指標','回滾條件','Feature flag 設定'],         x:70, y:58 },
      { id:'L', role:ROLE.PM,     type:TYPE.HUMAN,    title:'最終上線決策',                 bullets:['上線時間確認','停機計畫','備份確認'],                           x:45, y:58 },
      // ── 新增：Observability（x:20,y:62 介於 L 與 M 之間）──
      { id:'Q', role:ROLE.ENG,    type:TYPE.COWORK,   title:'Observability 設置',           bullets:['Log 結構定義','關鍵指標','告警閾值','Dashboard 草稿'],           x:20, y:62 },
      { id:'M', role:ROLE.SYSTEM, type:TYPE.SYSTEM,   title:'上線',                         bullets:[],                                                              x:45, y:65 },
      { id:'N', role:ROLE.PM,     type:TYPE.COWORK,   title:'整理二期 backlog / 維護事項',  bullets:['Phase 2 backlog','維護注意事項','常見問題'],                      x:70, y:65 },
      { id:'O', role:ROLE.PM,     type:TYPE.HUMAN,    title:'結案 / 簽核 / 保固起算',       bullets:['客戶簽核','付款節點','保固起算'],                               x:45, y:72 },
      // ── 新增：Sprint Retrospective（x:20,y:79）──
      { id:'R', role:ROLE.PM,     type:TYPE.HUMAN,    title:'Sprint Retrospective',         bullets:['做得好的事','卡點 / 痛點','下期改進','流程調整'],                 x:20, y:79 },
    ],
    edges: [
      {from:'A',to:'B'},{from:'B',to:'C'},{from:'B',to:'D'},{from:'C',to:'D'},
      {from:'D',to:'E'},{from:'E',to:'F'},{from:'F',to:'G'},{from:'G',to:'H'},
      {from:'H',to:'I',label:'是'},{from:'I',to:'B'},
      {from:'H',to:'J',label:'否'},{from:'J',to:'K'},
      {from:'K',to:'P'},{from:'P',to:'L'},
      {from:'L',to:'Q'},{from:'Q',to:'M'},
      {from:'M',to:'N'},{from:'N',to:'O'},
      {from:'O',to:'R'},
    ]
  }
};

AppData.slides = [
  {
    id: 'cover',
    type: 'cover',
    title: '接案流程 × AI Cowork 助理',
    subtitle: 'PM / QA / 工程師 如何用 AI 加速接案工作流程',
    meta: '2026-05-08'
  },
  {
    id: 'pain',
    type: 'bullets',
    title: '接案流程的核心痛點',
    items: [
      { label: '需求模糊', desc: '客戶說的和工程師做的永遠有落差，規格不清楚就進開發' },
      { label: '資訊落差', desc: 'PM、QA、工程師各看各的，沒有共同的規格基準' },
      { label: '變更失控', desc: '需求邊做邊改，沒有紀錄，沒有影響分析' },
      { label: '尾聲壓力', desc: '所有問題塞到驗收前爆發：bug、文件、回歸全部同時來' },
    ]
  },
  {
    id: 'cowork-def',
    type: 'comparison',
    title: 'AI Cowork 的定位',
    left: {
      label: 'Automation（腳本）',
      items: ['規則固定、輸入輸出明確','不會判斷商業情境','遇例外卡住','適合：跑測試、抓 issue 狀態']
    },
    right: {
      label: 'AI Cowork（助理）',
      items: ['根據角色幫忙整理、起草、比對','知道 PM / QA / 工程師各需要什麼','有例外可提醒人工確認','適合：摘要、草稿、分類、分析']
    },
    note: 'AI 負責提高效率，人負責做決策與承擔品質'
  },
  {
    id: 'role-matrix',
    type: 'table',
    title: '角色 × 階段總覽',
    headers: ['階段', 'PM', 'QA', '工程師'],
    rows: [
      ['開發前', '需求訪談、範圍確認、排程', '需求可測性、測試規劃、測試金字塔', '技術評估、工時估算、API 契約設計'],
      ['開發中', '進度追蹤、Daily Standup、需求變更管控', '功能測試、Bug Triage、回歸', '功能實作、Code Review、CI/Staging'],
      ['開發後', 'UAT 安排、結案、Sprint Retro', '完整回歸、放行評估', 'Bug 修復、Canary 發布、Observability'],
    ]
  },
  { id: 'flow-main',    type: 'flowchart', chartId: 'main',    title: '大流程圖：整體接案流程' },
  { id: 'flow-predev',  type: 'flowchart', chartId: 'preDev',  title: '開發前流程圖' },
  { id: 'flow-middev',  type: 'flowchart', chartId: 'midDev',  title: '開發中流程圖' },
  { id: 'flow-postdev', type: 'flowchart', chartId: 'postDev', title: '開發後流程圖' },
  {
    id: 'strategy',
    type: 'three-col',
    title: '三層 AI Cowork 策略',
    cols: [
      { label: '第一層：可全自動', color: 'green', items: ['CI / Staging 自動部署', '自動產進度摘要', '自動跑測試', '自動產 Release Note 草稿'] },
      { label: '第二層：AI 起草，人審核', color: 'blue', items: ['需求整理 / User Story', 'QA 測試案例初稿', 'Bug ticket 格式化', '規格差異比對', 'UAT 問題分流'] },
      { label: '第三層：必須人工決策', color: 'red', items: ['接受需求變更與否', '功能優先序', '是否可上線', '客戶驗收簽核', '高風險 bug 是否放行'] },
    ]
  },
  {
    id: 'pm-cowork',
    type: 'phase-table',
    title: 'PM × AI Cowork 各階段重點',
    rows: [
      { phase: '開發前', auto: '會議逐字稿整理', draft: 'User Story / 驗收條件草稿 / 任務拆分', human: '範圍決策、優先序、報價' },
      { phase: '開發中', auto: '進度摘要、Standup 準備、風險登錄更新', draft: '規格差異比對、客戶回報分類、Demo 腳本', human: 'Daily Standup、Bug Triage 共議、範圍變更決策' },
      { phase: '開發後', auto: 'Release Note、結案清單', draft: 'UAT 問題整理、交接文件草稿、二期 backlog', human: '是否放行上線、客戶簽核、Sprint Retro' },
    ]
  },
  {
    id: 'qa-cowork',
    type: 'phase-table',
    title: 'QA × AI Cowork 各階段重點',
    rows: [
      { phase: '開發前', auto: '需求 × 測試對照表', draft: '測試案例初稿、邊界案例、測試資料草稿、測試金字塔分層', human: '測試策略、高風險判定、非功能測試計畫' },
      { phase: '開發中', auto: 'Smoke / Regression 自動執行（Staging 環境）', draft: '回歸測試建議、Bug ticket 草稿、失敗原因初判', human: 'Bug Triage 共議、severity 判定、放行建議' },
      { phase: '開發後', auto: '—', draft: 'UAT 問題分類、測試報告、已知問題清單', human: '完整回歸、Smoke Check、是否允許上線' },
    ]
  },
  {
    id: 'mvp',
    type: 'priority-table',
    title: '第一階段可落地的 AI Cowork 功能',
    headers: ['優先', '功能', '使用者', '價值'],
    rows: [
      ['1', '會議紀錄 → 需求摘要', 'PM', '減少需求整理時間 50%+'],
      ['2', '需求 → User Story / 驗收條件', 'PM', '讓工程師與 QA 快速對齊'],
      ['3', '需求 → 測試案例初稿 + 測試金字塔建議', 'QA', '減少測試規劃時間'],
      ['4', 'PR → Code Review 預檢 + 回歸測試建議', 'QA/Eng', '降低漏測與低品質 PR 風險'],
      ['5', 'UAT 回饋分類', 'PM/QA', '區分 bug / 新需求 / 操作問題'],
      ['6', 'Release Note / 交接文件草稿', 'PM', '加速交付與結案'],
    ]
  },
  {
    id: 'conclusion',
    type: 'quote',
    title: '核心策略',
    quote: '把固定規則的工作交給腳本，把整理與起草交給 AI Cowork，把商務、品質與放行決策留給人。',
    bullets: [
      'AI 不取代 PM、QA 或工程師',
      'AI 協助整理、起草、比對、提醒與報告產出',
      '讓人把時間留給決策、驗證與溝通',
    ]
  },
  {
    id: 'next',
    type: 'bullets',
    title: '後續方向',
    items: [
      { label: '產品化', desc: '設計 PM / QA cowork 功能規格表、系統架構圖' },
      { label: 'MVP 開發', desc: '設計資料流：輸入 → AI 處理 → 人工確認 → 輸出' },
      { label: '工具串接', desc: 'GitHub / Jira / Notion / Slack webhook 整合' },
      { label: '計畫書', desc: '整理成提案書，包含開發時程與 ROI 估算' },
    ]
  }
];

AppData.chapters = [
  { id: 'summary',    title: '摘要',           icon: '◎' },
  { id: 'pain',       title: '問題背景',        icon: '⊘' },
  { id: 'roles',      title: '角色職責',        icon: '◈' },
  { id: 'pre-dev',    title: '開發前',          icon: '①' },
  { id: 'mid-dev',    title: '開發中',          icon: '②' },
  { id: 'post-dev',   title: '開發後',          icon: '③' },
  { id: 'cowork-def', title: 'AI Cowork 定位',  icon: '◇' },
  { id: 'strategy',   title: '三層策略',        icon: '▣' },
  { id: 'flowcharts', title: '流程圖',          icon: '⊞' },
  { id: 'auto-level', title: '自動化等級',      icon: '▤' },
  { id: 'pm-detail',  title: 'PM 詳細規劃',    icon: '◉' },
  { id: 'qa-detail',  title: 'QA 詳細規劃',    icon: '◉' },
  { id: 'mvp',        title: 'MVP 規劃',        icon: '◆' },
  { id: 'principles', title: '導入原則',        icon: '◐' },
  { id: 'next',       title: '後續方向',        icon: '→'  },
];
