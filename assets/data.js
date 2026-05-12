// assets/data.js
window.AppData = window.AppData || {};

// 角色常數
window.ROLE = { PM: 'pm', QA: 'qa', ENG: 'eng', SYSTEM: 'system' };
window.TYPE = { HUMAN: 'human', COWORK: 'cowork', CLAUDECODE: 'claudecode', DECISION: 'decision', SYSTEM: 'system' };

const ROLE = window.ROLE;
const TYPE = window.TYPE;

window.AppData.flowcharts = {
  main: {
    title: '接案軟體開發流程與 AI Cowork 介入點 v3.2',
    nodes: [
      { id:'A', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'客戶需求進來', bullets:[], x:45, y:2 },
      { id:'B', role:ROLE.PM, type:TYPE.HUMAN, title:'需求訪談與目標確認', bullets:['確認目的與範圍','釐清使用者角色','記錄商業規則'], x:45, y:11 },
      { id:'C', role:ROLE.PM, type:TYPE.COWORK, title:'需求整理與管理', bullets:['會議紀錄','User Story','待確認事項'], x:45, y:20 },
      { id:'D', role:ROLE.PM, type:TYPE.COWORK, title:'SOW / 報價初稿', bullets:['Scope list','報價依據','交付範圍'], x:45, y:29 },
      { id:'E', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate 客戶確認', bullets:['SOW 確認','報價確認','開發範圍確認'], x:45, y:38 },
      { id:'F', role:ROLE.QA, type:TYPE.COWORK, title:'測試規劃初稿', bullets:['測試範圍','風險案例','測試資料'], x:20, y:47 },
      { id:'G', role:ROLE.ENG, type:TYPE.HUMAN, title:'技術可行性確認', bullets:['架構確認','工時估算','依賴風險'], x:70, y:47 },
      { id:'H', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'API / DB Schema 草稿', bullets:['Endpoint 草稿','Schema 草稿','錯誤碼定義'], x:70, y:56 },
      { id:'I', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'CLAUDE.md 初始化', bullets:['Coding style','Commit rule','測試規範'], x:70, y:65 },
      { id:'J', role:ROLE.PM, type:TYPE.HUMAN, title:'排程與優先級', bullets:['Sprint 計畫','任務分派','里程碑'], x:45, y:74 },
      { id:'K', role:ROLE.ENG, type:TYPE.HUMAN, title:'開發實作', bullets:['功能開發','分支管理','Code Review'], x:45, y:83 },
      { id:'L', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Code Review 輔助 + Changelog', bullets:['PR 摘要','Review checklist','Changelog 草稿'], x:70, y:92 },
      { id:'M', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'CI / Staging 部署', bullets:['自動建置','測試執行','Staging 部署'], x:45, y:101 },
      { id:'N', role:ROLE.QA, type:TYPE.COWORK, title:'測試結果整理與失敗摘要', bullets:['失敗分類','重現資訊','優先建議'], x:20, y:110 },
      { id:'O', role:ROLE.QA, type:TYPE.HUMAN, title:'手動探索測試', bullets:['探索測試','Bug 確認','風險判定'], x:45, y:119 },
      { id:'P', role:ROLE.PM, type:TYPE.COWORK, title:'回饋分類與狀態更新', bullets:['Bug / 新需求','狀態同步','客戶回報'], x:70, y:128 },
      { id:'Q', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'Bug 是否修完 / 可進 UAT', bullets:[], x:45, y:137 },
      { id:'R', role:ROLE.PM, type:TYPE.COWORK, title:'Sprint Demo 準備', bullets:['Demo 腳本','Release Note 草稿','驗收清單'], x:70, y:146 },
      { id:'S', role:ROLE.QA, type:TYPE.HUMAN, title:'回歸測試放行', bullets:['核心流程確認','修復驗證','放行建議'], x:45, y:155 },
      { id:'T', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate 客戶 UAT 驗收', bullets:['客戶驗收','回饋確認','簽核判斷'], x:45, y:164 },
      { id:'U', role:ROLE.QA, type:TYPE.COWORK, title:'UAT 缺陷分類 / 補強建議', bullets:['缺陷分類','補測建議','回歸範圍'], x:20, y:173 },
      { id:'V', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'部署方式分流', bullets:['我方部署','客戶自行部署'], x:45, y:182 },
      { id:'W', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Migration / Release script', bullets:['Migration script','Release script','Rollback note'], x:70, y:191 },
      { id:'X', role:ROLE.PM, type:TYPE.HUMAN, title:'交接部署指引', bullets:['客戶部署文件','操作步驟','責任邊界'], x:20, y:191 },
      { id:'Y', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Knowledge Transfer A', bullets:['API doc','Schema','Coding style'], x:70, y:200 },
      { id:'Z', role:ROLE.PM, type:TYPE.HUMAN, title:'Knowledge Transfer B / 保固維護', bullets:['權限交接','維護窗口','Bug 回報 SLA','教育訓練'], x:45, y:209 },
    ],
    edges: [
      {from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},{from:'D',to:'E'},
      {from:'E',to:'F',label:'確認'},{from:'E',to:'G',label:'確認'},
      {from:'G',to:'D',label:'估算差異 → 修改 SOW'},
      {from:'F',to:'J'},{from:'G',to:'H'},{from:'H',to:'I'},{from:'I',to:'J'},
      {from:'J',to:'K'},{from:'K',to:'L'},{from:'L',to:'M'},{from:'M',to:'N'},
      {from:'N',to:'O'},{from:'O',to:'P'},{from:'P',to:'Q'},
      {from:'Q',to:'K',label:'否'},{from:'Q',to:'R',label:'是'},
      {from:'R',to:'S'},{from:'S',to:'T'},
      {from:'T',to:'U',label:'需修正'},{from:'U',to:'K'},
      {from:'T',to:'V',label:'通過'},{from:'V',to:'W',label:'我方部署'},
      {from:'V',to:'X',label:'客戶自行部署'},{from:'W',to:'Y'},{from:'X',to:'Z'},{from:'Y',to:'Z'},
    ]
  },

  preDev: {
    title: '開發前：需求釐清、SOW、測試規劃與技術評估 v3.2',
    nodes: [
      { id:'1', role:ROLE.PM, type:TYPE.HUMAN, title:'需求訪談與目標確認', bullets:['訪談目的','使用者角色','商業目標'], x:45, y:2 },
      { id:'2', role:ROLE.PM, type:TYPE.COWORK, title:'需求整理與管理', bullets:['會議紀錄','User Story','待確認事項'], x:45, y:11 },
      { id:'3', role:ROLE.PM, type:TYPE.COWORK, title:'SOW / 報價初稿', bullets:['Scope list','交付項目','報價依據'], x:45, y:20 },
      { id:'4', role:ROLE.PM, type:TYPE.HUMAN, title:'與客戶溝通報價 / SOW', bullets:['範圍說明','時程說明','商務條件'], x:45, y:29 },
      { id:'5', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate 客戶確認', bullets:['SOW 確認','報價確認','範圍確認'], x:45, y:38 },
      { id:'6', role:ROLE.QA, type:TYPE.COWORK, title:'測試規劃初稿', bullets:['測試範圍','高風險案例','測試資料'], x:20, y:47 },
      { id:'7', role:ROLE.QA, type:TYPE.HUMAN, title:'測試策略確認', bullets:['手測 / 自動化','風險排序','環境需求'], x:20, y:56 },
      { id:'8', role:ROLE.ENG, type:TYPE.HUMAN, title:'技術可行性確認', bullets:['架構可行性','工時估算','技術風險'], x:70, y:47 },
      { id:'9', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'API / DB Schema 草稿', bullets:['OpenAPI 草稿','DB Schema','錯誤碼'], x:70, y:56 },
      { id:'10', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'CLAUDE.md 初始化', bullets:['Coding style','Commit rule','測試規範'], x:70, y:65 },
      { id:'11', role:ROLE.PM, type:TYPE.HUMAN, title:'排程與優先級', bullets:['Sprint plan','任務分派','里程碑'], x:45, y:74 },
    ],
    edges: [
      {from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'4'},{from:'4',to:'5'},
      {from:'5',to:'6',label:'確認'},{from:'6',to:'7'},{from:'7',to:'11'},
      {from:'5',to:'8',label:'確認'},{from:'8',to:'3',label:'估算差異 → 修改 SOW'},
      {from:'8',to:'9'},{from:'9',to:'10'},{from:'10',to:'11'},
    ]
  },

  midDev: {
    title: '開發中：開發執行、測試摘要、Triage 與 Demo 準備 v3.2',
    nodes: [
      { id:'1', role:ROLE.ENG, type:TYPE.HUMAN, title:'開發實作', bullets:['功能開發','分支管理','單元測試'], x:45, y:2 },
      { id:'2', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Code Review 輔助 + Changelog', bullets:['Review checklist','PR 摘要','Changelog 草稿'], x:70, y:11 },
      { id:'3', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'CI / Staging 部署', bullets:['自動建置','測試執行','Staging 部署'], x:45, y:20 },
      { id:'3.5', role:ROLE.QA, type:TYPE.COWORK, title:'測試結果整理與失敗摘要', bullets:['失敗原因初判','重現資訊','風險提示'], x:20, y:29 },
      { id:'4', role:ROLE.QA, type:TYPE.HUMAN, title:'手動探索測試', bullets:['探索測試','Bug ticket','Severity 判定'], x:45, y:38 },
      { id:'5', role:ROLE.PM, type:TYPE.COWORK, title:'回饋分類與狀態更新', bullets:['Bug / 新需求','狀態同步','客戶回報'], x:70, y:47 },
      { id:'6', role:ROLE.PM, type:TYPE.HUMAN, title:'Bug Triage 三角共議', bullets:['Severity by QA','Priority by PM','Impact by Eng'], x:45, y:56 },
      { id:'7', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'Bug 是否修完 / 可進 UAT', bullets:[], x:45, y:65 },
      { id:'8', role:ROLE.PM, type:TYPE.COWORK, title:'Sprint Demo 準備', bullets:['Demo 腳本','Release Note 草稿','驗收清單'], x:70, y:74 },
      { id:'9', role:ROLE.PM, type:TYPE.COWORK, title:'Daily Standup 準備', bullets:['昨日完成','今日計畫','阻塞提醒'], x:20, y:47 },
      { id:'10', role:ROLE.PM, type:TYPE.COWORK, title:'風險登錄更新', bullets:['新增風險','責任人','觸發條件'], x:20, y:56 },
    ],
    edges: [
      {from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'3.5'},{from:'3.5',to:'4'},
      {from:'4',to:'5'},{from:'5',to:'6'},{from:'6',to:'7'},
      {from:'7',to:'1',label:'否'},{from:'7',to:'8',label:'是'},
      {from:'1',to:'9'},{from:'9',to:'10'},{from:'10',to:'6'},
    ]
  },

  postDev: {
    title: '開發後：UAT、部署分流、知識移轉與保固維護 v3.2',
    nodes: [
      { id:'1', role:ROLE.QA, type:TYPE.HUMAN, title:'回歸測試放行', bullets:['完整回歸','修復驗證','放行建議'], x:45, y:2 },
      { id:'2', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate 客戶 UAT 驗收', bullets:['驗收確認','回饋記錄','簽核判斷'], x:45, y:11 },
      { id:'3', role:ROLE.QA, type:TYPE.COWORK, title:'UAT 缺陷分類 / 補強建議', bullets:['Bug / 操作問題','補測建議','回歸範圍'], x:20, y:20 },
      { id:'4', role:ROLE.ENG, type:TYPE.HUMAN, title:'缺陷修正', bullets:['Bug 修復','修復驗證支援','重新部署'], x:20, y:29 },
      { id:'5', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'部署方式分流', bullets:['我方部署','客戶自行部署'], x:45, y:38 },
      { id:'6a', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Migration script + Release script', bullets:['Migration script','Release script','Rollback note'], x:70, y:47 },
      { id:'6b', role:ROLE.PM, type:TYPE.HUMAN, title:'交接部署指引', bullets:['部署步驟','帳號權限','注意事項'], x:20, y:47 },
      { id:'7-1', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Knowledge Transfer A - 技術文件自動生成', bullets:['API doc','Schema','Coding style'], x:70, y:56 },
      { id:'7-2', role:ROLE.PM, type:TYPE.HUMAN, title:'Knowledge Transfer B - 權限與維護交接', bullets:['權限盤點','維護窗口','交接清單'], x:20, y:56 },
      { id:'8', role:ROLE.PM, type:TYPE.HUMAN, title:'保固 / 維護期', bullets:['Bug 回報 SLA','Release Note','教育訓練'], x:45, y:65 },
    ],
    edges: [
      {from:'1',to:'2'},
      {from:'2',to:'3',label:'需修正'},{from:'3',to:'4'},{from:'4',to:'1'},
      {from:'2',to:'5',label:'通過'},
      {from:'5',to:'6a',label:'我方部署'},{from:'5',to:'6b',label:'客戶自行部署'},
      {from:'6a',to:'7-1'},{from:'6b',to:'7-2'},{from:'7-1',to:'8'},{from:'7-2',to:'8'},
    ]
  }
};

window.AppData.slides = [
  {
    id: 'cover',
    type: 'cover',
    title: '接案流程 × AI Cowork 助理 v3.2',
    subtitle: 'PM / QA / 工程師 如何用 AI Cowork 與 Claude Code 加速接案工作流程',
    meta: '2026-05-12'
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
      items: ['根據角色幫忙整理、起草、比對','知道 PM / QA 各需要什麼','有例外可提醒人工確認','適合：摘要、草稿、分類、分析']
    },
    note: 'Claude Code = 工程師專用 Cowork；AI 負責提高效率，人負責決策與品質。'
  },
  {
    id: 'claude-vs-cowork',
    type: 'three-col',
    title: 'Claude Code vs Cowork',
    cols: [
      { label: 'Automation', color: 'green', items: ['固定規則流程','輸入輸出明確','跑測試 / 抓狀態','例外時停止'] },
      { label: 'Cowork', color: 'blue', items: ['PM / QA 助理','需求整理與分類','測試規劃草稿','狀態與回饋同步'] },
      { label: 'Claude Code', color: 'purple', items: ['工程師端助理','PR / commit 草稿','API / DB Schema 草稿','migration / release script'] },
    ]
  },
  {
    id: 'role-matrix',
    type: 'table',
    title: '角色 × 階段總覽',
    headers: ['階段', 'PM', 'QA', '工程師'],
    rows: [
      ['開發前', '需求訪談、SOW / 報價、客戶 Gate', '測試規劃初稿、測試策略確認', '技術可行性、Claude Code 起草 API / DB Schema、CLAUDE.md'],
      ['開發中', '回饋分類、Standup 準備、Sprint Demo', '測試結果整理、探索測試、Bug Triage', '功能實作、Claude Code 輔助 Code Review + Changelog'],
      ['開發後', '部署指引、權限交接、保固維護', '回歸放行、UAT 缺陷分類', '缺陷修正、Claude Code 起草 migration / release script 與技術文件'],
    ]
  },
  { id: 'flow-main',    type: 'flowchart', chartId: 'main',    title: '大流程圖：整體接案流程 v3.2' },
  { id: 'flow-predev',  type: 'flowchart', chartId: 'preDev',  title: '開發前流程圖 v3.2' },
  { id: 'flow-middev',  type: 'flowchart', chartId: 'midDev',  title: '開發中流程圖 v3.2' },
  { id: 'flow-postdev', type: 'flowchart', chartId: 'postDev', title: '開發後流程圖 v3.2' },
  {
    id: 'strategy',
    type: 'three-col',
    title: '三層 AI Cowork 策略',
    cols: [
      { label: '第一層：可全自動', color: 'green', items: ['CI / Staging 自動部署', '自動產進度摘要', '自動跑測試', '自動產 Release Note 草稿'] },
      { label: '第二層：AI 起草，人審核', color: 'blue', items: ['Cowork：需求整理 / 測試案例 / 回饋分類', 'Claude Code：PR 摘要 / commit / 測試碼 / migration script'] },
      { label: '第三層：必須人工決策', color: 'red', items: ['接受需求變更與否', '功能優先序', '是否可上線', '客戶驗收簽核', '高風險 bug 是否放行'] },
    ]
  },
  {
    id: 'pm-cowork',
    type: 'phase-table',
    title: 'PM × AI Cowork 各階段重點',
    rows: [
      { phase: '開發前', auto: '會議逐字稿整理', draft: 'User Story / SOW / 報價初稿', human: '範圍決策、客戶 Gate、優先序' },
      { phase: '開發中', auto: '進度摘要、Standup 準備、風險登錄更新', draft: '回饋分類、狀態更新、Demo 腳本', human: 'Bug Triage 共議、範圍變更決策' },
      { phase: '開發後', auto: 'Release Note、結案清單', draft: '部署指引、權限交接、二期 backlog', human: '是否放行上線、客戶簽核、保固承諾' },
    ]
  },
  {
    id: 'qa-cowork',
    type: 'phase-table',
    title: 'QA × AI Cowork 各階段重點',
    rows: [
      { phase: '開發前', auto: '需求 × 測試對照表', draft: '測試規劃初稿、邊界案例、測試資料草稿', human: '測試策略、高風險判定' },
      { phase: '開發中', auto: 'Smoke / Regression 自動執行', draft: '測試結果整理、失敗摘要、Demo 對齊項目', human: '探索測試、Bug severity、放行建議' },
      { phase: '開發後', auto: '—', draft: 'UAT 缺陷分類、補強建議、測試報告', human: '完整回歸、客戶 UAT 放行' },
    ]
  },
  {
    id: 'mvp',
    type: 'priority-table',
    title: '第一階段可落地的 AI Cowork 功能',
    headers: ['優先', '功能', '使用者', '價值'],
    rows: [
      ['1', '會議紀錄 → 需求摘要 / SOW 草稿', 'PM', '減少需求整理時間 50%+'],
      ['2', '需求 → User Story / 驗收條件', 'PM', '讓工程師與 QA 快速對齊'],
      ['3', '需求 → 測試規劃初稿', 'QA', '減少測試規劃時間'],
      ['4', 'PR → Code Review 預檢 + Changelog', 'Eng', '降低低品質 PR 風險'],
      ['5', 'UAT 回饋分類', 'PM/QA', '區分 bug / 新需求 / 操作問題'],
      ['6', 'Release Note / Knowledge Transfer 草稿', 'PM/Eng', '加速交付與結案'],
    ]
  },
  {
    id: 'conclusion',
    type: 'quote',
    title: '核心策略',
    quote: '把固定規則的工作交給腳本，把 PM/QA 的整理與分類交給 Cowork，把工程師端起草交給 Claude Code，把決策留給人。',
    bullets: [
      'AI 不取代 PM、QA 或工程師',
      'Cowork 協助 PM / QA 整理、起草、比對、提醒與報告產出',
      'Claude Code 協助工程師起草、檢查與生成交付文件',
    ]
  },
  {
    id: 'next',
    type: 'bullets',
    title: '後續方向',
    items: [
      { label: '產品化', desc: '設計 PM / QA Cowork 與 Claude Code 介面分工' },
      { label: 'MVP 開發', desc: '設計資料流：輸入 → AI 處理 → 人工確認 → 輸出' },
      { label: '工具串接', desc: 'GitHub / Jira / Notion / Slack webhook 整合' },
      { label: '計畫書', desc: '整理成提案書，包含開發時程與 ROI 估算' },
    ]
  }
];

window.AppData.contentVersion = 'v3.6';

window.AppData.chapters = [
  { id: 'summary',          title: '核心定位',             icon: '◎' },
  { id: 'flowcharts',       title: 'v3.6 流程圖',          icon: '⊞' },
  { id: 'roles',            title: '角色與 AI 邊界',       icon: '◈' },
  { id: 'pre-dev',          title: '開發前',               icon: '①' },
  { id: 'mid-dev',          title: '開發中',               icon: '②' },
  { id: 'post-dev',         title: '開發後',               icon: '③' },
  { id: 'warranty',         title: '保固 / 維護期',        icon: '▤' },
  { id: 'legend',           title: '圖例說明',             icon: '◇' },
  { id: 'observations',     title: '優點與注意事項',       icon: '◐' },
  { id: 'presentation-use', title: '簡報使用方式',         icon: '▣' },
  { id: 'conclusion',       title: '一句話總結',           icon: '→'  },
];
