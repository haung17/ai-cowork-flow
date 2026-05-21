// assets/data.js
window.AppData = window.AppData || {};

// 角色常數
window.ROLE = { PM: 'pm', QA: 'qa', ENG: 'eng', SYSTEM: 'system' };
window.TYPE = { HUMAN: 'human', COWORK: 'cowork', CLAUDECODE: 'claudecode', DECISION: 'decision', SYSTEM: 'system' };

const ROLE = window.ROLE;
const TYPE = window.TYPE;

window.AppData.flowcharts = {
  main: {
    title: '接案軟體開發完整流程與 AI Cowork / Claude Code 介入點 v3.7',
    nodes: [
      { id:'A', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'客戶需求進來', bullets:[], x:45, y:2 },
      { id:'B', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：需求訪談', bullets:['專案目標','使用對象','預算 / 交期'], x:45, y:11 },
      { id:'C', role:ROLE.PM, type:TYPE.COWORK, title:'PM Cowork：需求整理', bullets:['會議紀錄','User Story','驗收條件初稿'], x:45, y:20 },
      { id:'D', role:ROLE.QA, type:TYPE.COWORK, title:'QA Cowork：測試規劃初稿', bullets:['測試範圍','高風險案例','測試資料需求'], x:20, y:29 },
      { id:'E', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：技術評估', bullets:['技術可行性','API / DB 影響','工時估算'], x:70, y:29 },
      { id:'F', role:ROLE.PM, type:TYPE.COWORK, title:'PM Cowork：SOW / 報價初稿', bullets:['Scope list','報價項目','交付假設'], x:45, y:38 },
      { id:'G', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：SOW / 報價 / 交期', bullets:['範圍簽核','報價確認','交期確認'], x:45, y:47 },
      { id:'H', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Claude Code：API / DB Schema 草稿', bullets:['OpenAPI 草稿','DB Schema','錯誤碼'], x:70, y:56 },
      { id:'I', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Claude Code：CLAUDE.md 初始化', bullets:['Coding style','Commit rule','測試規範'], x:70, y:65 },
      { id:'J', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：技術確認', bullets:['架構確認','依賴確認','估算校正'], x:45, y:74 },
      { id:'K', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：排程與里程碑', bullets:['Sprint 計畫','任務分派','溝通節奏'], x:45, y:83 },
      { id:'L', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Claude Code：開發實作', bullets:['功能開發','單元測試','文件更新'], x:45, y:92 },
      { id:'M', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：PR', bullets:['PR 說明','指定 reviewer','差異檢查'], x:45, y:101 },
      { id:'N', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'CI 自動驗證', bullets:['Build','Lint','Unit Test'], x:45, y:110 },
      { id:'O', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：Code Review / Merge', bullets:['Review','回應意見','合併分支'], x:45, y:119 },
      { id:'P', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'部署測試環境', bullets:['測試版部署','版號管理','待測清單'], x:45, y:128 },
      { id:'Q', role:ROLE.QA, type:TYPE.HUMAN, title:'QA 人工：驗證', bullets:['功能測試','探索測試','回歸驗證'], x:20, y:137 },
      { id:'R', role:ROLE.PM, type:TYPE.COWORK, title:'PM / QA Cowork：問題分類', bullets:['Bug','規格疑義','新增需求','通過'], x:70, y:137 },
      { id:'S', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'問題類型？', bullets:['修正','釐清','CR','UAT 準備'], x:45, y:146 },
      { id:'T', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：Change Request', bullets:['影響分析','報價 / 排程調整','客戶簽核'], x:70, y:155 },
      { id:'U', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：版本凍結', bullets:['Release tag','凍結變更','驗收版本'], x:45, y:164 },
      { id:'V', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：UAT 環境', bullets:['UAT 部署','測試資料','回滾點'], x:45, y:173 },
      { id:'W', role:ROLE.QA, type:TYPE.HUMAN, title:'QA 人工：Smoke Test', bullets:['核心流程','環境檢查','風險檢查'], x:20, y:182 },
      { id:'X', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：UAT', bullets:['客戶驗收','問題回報','階段結論'], x:45, y:191 },
      { id:'Y', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：正式簽收 / 上線同意', bullets:['正式簽收','上線同意','保固起算'], x:45, y:200 },
      { id:'Z', role:ROLE.PM, type:TYPE.HUMAN, title:'文件 / KT / 保固交接', bullets:['Release Note','操作手冊','保固 SLA'], x:45, y:209 },
    ],
    edges: [
      {from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},{from:'C',to:'E'},
      {from:'D',to:'F'},{from:'E',to:'F'},{from:'F',to:'G'},
      {from:'G',to:'H'},{from:'H',to:'I'},{from:'I',to:'J'},{from:'J',to:'K'},
      {from:'K',to:'L'},{from:'L',to:'M'},{from:'M',to:'N'},{from:'N',to:'O'},
      {from:'O',to:'P'},{from:'P',to:'Q'},{from:'Q',to:'R'},{from:'R',to:'S'},
      {from:'S',to:'L',label:'Bug'},{from:'S',to:'C',label:'規格疑義'},
      {from:'S',to:'T',label:'新增需求'},{from:'T',to:'K'},
      {from:'S',to:'U',label:'通過'},{from:'U',to:'V'},{from:'V',to:'W'},{from:'W',to:'X'},
      {from:'X',to:'L',label:'需修正'},{from:'X',to:'Y',label:'通過'},{from:'Y',to:'Z'},
    ]
  },

  preDev: {
    title: '開發前：需求釐清、技術評估、SOW / 報價、測試規劃與排程 v3.7',
    nodes: [
      { id:'1', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：需求訪談', bullets:['專案目標','使用對象','預算 / 交期'], x:45, y:2 },
      { id:'predev-nda-gate', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：NDA + 資安審查', bullets:['NDA 簽署確認','個資/敏感資料識別','敏感資料不進 AI prompt'], x:45, y:6 },
      { id:'2', role:ROLE.PM, type:TYPE.COWORK, title:'PM Cowork：會議紀錄與需求整理', bullets:['需求清單','User Story','驗收條件初稿'], x:45, y:11 },
      { id:'3', role:ROLE.QA, type:TYPE.COWORK, title:'QA Cowork：測試案例 / 測試策略初稿', bullets:['正常流程','異常情境','測試資料需求'], x:20, y:20 },
      { id:'4', role:ROLE.QA, type:TYPE.HUMAN, title:'QA 人工：測試策略確認', bullets:['高風險判定','測試範圍','測試規劃'], x:20, y:29 },
      { id:'5', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：技術評估', bullets:['技術可行性','API / DB 影響','工時估算'], x:70, y:20 },
      { id:'6', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Claude Code：任務拆分與技術草稿', bullets:['技術任務','OpenAPI 草稿','DB Schema'], x:70, y:29 },
      { id:'7', role:ROLE.PM, type:TYPE.COWORK, title:'PM Cowork：SOW / 報價初稿', bullets:['Scope list','報價項目','交付假設'], x:45, y:38 },
      { id:'8', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：內部確認與優先序', bullets:['範圍切分','風險判斷','驗收方向'], x:45, y:47 },
      { id:'predev-engineer-presurvey', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師：投標前技術探勘', bullets:['技術可行性確認','估算校正','技術風險識別'], x:70, y:47 },
      { id:'9', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：SOW / 報價 / 交期', bullets:['範圍簽核','報價確認','交期確認'], x:45, y:56 },
      { id:'10', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：排程與里程碑', bullets:['Sprint plan','任務分派','里程碑'], x:45, y:65 },
      { id:'11', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師：交付期技術規劃（CR 評估）', bullets:['架構確認','依賴確認','CR 影響評估'], x:45, y:74 },
      { id:'12', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：Kickoff / Sprint 起跑', bullets:['開發分支建立','任務分派','溝通節奏'], x:45, y:83 },
    ],
    edges: [
      {from:'1',to:'predev-nda-gate'},{from:'predev-nda-gate',to:'2'},
      {from:'2',to:'3'},{from:'3',to:'4'},
      {from:'2',to:'5'},{from:'5',to:'6'},
      {from:'4',to:'7'},{from:'6',to:'7'},{from:'7',to:'8'},
      {from:'8',to:'predev-engineer-presurvey'},
      {from:'predev-engineer-presurvey',to:'9'},
      {from:'9',to:'10'},{from:'10',to:'11'},
      {from:'11',to:'12',label:'交付期規劃完成'},
    ]
  },

  midDev: {
    title: '開發中：PR、CI、Code Review、測試環境、QA、問題分類與變更控管 v3.7',
    nodes: [
      { id:'1', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Claude Code：開發實作', bullets:['功能開發','單元測試','文件更新'], x:45, y:2 },
      { id:'2', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：建立 PR', bullets:['PR 說明','指定 reviewer','差異檢查'], x:45, y:11 },
      { id:'3', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'CI 自動驗證', bullets:['Build / Compile','Lint','Unit Test'], x:45, y:20 },
      { id:'4', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'CI 是否通過？', bullets:['未通過回修','通過後 Review'], x:45, y:29 },
      { id:'5', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：Code Review / Merge', bullets:['Review','回應意見','合併分支'], x:45, y:38 },
      { id:'6', role:ROLE.SYSTEM, type:TYPE.SYSTEM, title:'部署測試環境', bullets:['測試版部署','版號管理','待測清單'], x:45, y:47 },
      { id:'7', role:ROLE.QA, type:TYPE.HUMAN, title:'QA 人工：QA 驗證', bullets:['功能測試','探索測試','回歸驗證'], x:20, y:56 },
      { id:'8', role:ROLE.PM, type:TYPE.COWORK, title:'PM / QA Cowork：問題彙整', bullets:['缺陷彙整','優先級建議','影響分析'], x:70, y:56 },
      { id:'9', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'問題類型？', bullets:['Bug','規格疑義','新增需求','通過'], x:45, y:65 },
      { id:'middev-pm-clarify', role:ROLE.PM, type:TYPE.HUMAN, title:'PM：規格釋疑 + 客戶確認', bullets:['需求釐清','客戶確認','更新 User Story'], x:70, y:74 },
      { id:'10', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：Change Request', bullets:['影響分析','報價 / 排程調整','客戶 Gate'], x:70, y:83 },
      { id:'11', role:ROLE.PM, type:TYPE.HUMAN, title:'PM / QA：UAT 準備', bullets:['版本候選確認','UAT 環境申請','驗收計劃'], x:45, y:83 },
    ],
    edges: [
      {from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'4'},
      {from:'4',to:'1',label:'未通過'},{from:'4',to:'5',label:'通過'},
      {from:'5',to:'6'},{from:'6',to:'7'},{from:'7',to:'8'},{from:'8',to:'9'},
      {from:'9',to:'1',label:'Bug / 未達驗收條件'},
      {from:'9',to:'middev-pm-clarify',label:'規格疑義',fromSide:'right',toSide:'left'},
      {from:'9',to:'10',label:'新增需求 / 範疇變更'},
      {from:'9',to:'11',label:'通過'},
      {from:'middev-pm-clarify',to:'10',label:'需客戶 Gate'},
      {from:'middev-pm-clarify',to:'1',label:'需更新實作',toSide:'right'},
      {from:'middev-pm-clarify',to:'7',label:'無需實作變更',fromSide:'left'},
      {from:'10',to:'1',label:'簽核後排入'},
    ]
  },

  postDev: {
    title: '開發後：版本凍結、UAT 環境、Smoke Test、UAT、正式簽收、部署、文件 / KT / 保固 v3.7',
    nodes: [
      { id:'1', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：版本凍結', bullets:['Release tag','鎖定範圍','凍結變更'], x:45, y:2 },
      { id:'2', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：部署 UAT 環境', bullets:['UAT 版本部署','環境設定','回滾點保留'], x:45, y:11 },
      { id:'3', role:ROLE.QA, type:TYPE.HUMAN, title:'QA 人工：Smoke Test / 環境檢查', bullets:['基本流程','環境可用性','風險檢查'], x:20, y:20 },
      { id:'4', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：UAT 驗收', bullets:['操作驗收','問題回報','階段結論'], x:45, y:29 },
      { id:'5', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'UAT 是否通過？', bullets:['未通過回修','通過後簽收'], x:45, y:38 },
      { id:'postdev-engineer-impact', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師：影響分析與修正規劃', bullets:['UAT 失敗根因分析','修正範圍評估','修正計劃'], x:20, y:43 },
      { id:'6', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Claude Code：修正 / 重新部署 UAT', bullets:['修正程式','更新版本','重新部署'], x:20, y:47 },
      { id:'7', role:ROLE.SYSTEM, type:TYPE.DECISION, title:'🟥 Gate：正式簽收 / 上線同意', bullets:['正式簽收','上線同意','保固起算'], x:45, y:56 },
      { id:'postdev-engineer-codereview', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師：Code Review / 上線前確認', bullets:['正式部署前 review','回滾確認','變更驗證'], x:70, y:60 },
      { id:'8', role:ROLE.ENG, type:TYPE.HUMAN, title:'工程師人工：正式部署 / 回滾準備', bullets:['Production 部署','migration','rollback'], x:70, y:65 },
      { id:'9', role:ROLE.QA, type:TYPE.HUMAN, title:'QA 人工：上線後 Smoke Test', bullets:['關鍵流程','服務可用性','初始監控'], x:20, y:65 },
      { id:'10', role:ROLE.PM, type:TYPE.COWORK, title:'PM Cowork：交付文件初稿', bullets:['Release Note','操作手冊','交付清單'], roles:[ROLE.PM, ROLE.ENG], x:45, y:74 },
      { id:'11', role:ROLE.ENG, type:TYPE.CLAUDECODE, title:'Claude Code：技術文件與部署說明', bullets:['架構文件','API 文件','環境設定'], x:70, y:83 },
      { id:'12', role:ROLE.PM, type:TYPE.HUMAN, title:'PM 人工：Knowledge Transfer / 保固交接', bullets:['聯絡窗口','保固範圍','SLA'], x:45, y:92 },
    ],
    edges: [
      {from:'1',to:'2'},{from:'2',to:'3'},{from:'3',to:'4'},{from:'4',to:'5'},
      {from:'5',to:'postdev-engineer-impact',label:'未通過'},{from:'postdev-engineer-impact',to:'6'},{from:'6',to:'3'},
      {from:'5',to:'7',label:'通過'},{from:'7',to:'postdev-engineer-codereview'},{from:'postdev-engineer-codereview',to:'8'},{from:'8',to:'9'},
      {from:'9',to:'10'},{from:'10',to:'11'},{from:'11',to:'12'},
    ]
  }
};

// Legacy metadata: current dashboard.html and presentation.html render hardcoded/static
// content, not this slide array. Keep it synchronized so older generators do not
// accidentally reintroduce pre-v3.6 flow ordering.
window.AppData.slides = [
  {
    id: 'cover',
    type: 'cover',
    title: '接案軟體開發交付治理流程 v3.7',
    subtitle: 'PM / QA / 工程師三角色下，AI 如何介入整理、開發、測試、驗收與保固交接',
    meta: '2026-05-12'
  },
  {
    id: 'role-matrix',
    type: 'table',
    title: '角色 × 階段總覽',
    headers: ['階段', 'PM', 'QA', '工程師'],
    rows: [
      ['開發前', '需求訪談、QA / 技術評估後產 SOW / 報價、客戶 Gate', '測試規劃初稿、測試策略確認', '技術評估、任務拆分、CLAUDE.md'],
      ['開發中', '問題彙整、規格釐清、Change Request', 'QA 驗證、問題分類、放行建議', '開發、PR、CI、Code Review、測試環境部署'],
      ['開發後', '正式簽收、文件交付、KT / 保固交接', 'UAT 前 Smoke Test、上線後 Smoke Test', '版本凍結、UAT 環境、正式部署、技術文件'],
    ]
  },
  { id: 'flow-main',    type: 'flowchart', chartId: 'main',    title: '大流程圖：整體接案流程 v3.7' },
  { id: 'flow-predev',  type: 'flowchart', chartId: 'preDev',  title: '開發前流程圖 v3.7' },
  { id: 'flow-middev',  type: 'flowchart', chartId: 'midDev',  title: '開發中流程圖 v3.7' },
  { id: 'flow-postdev', type: 'flowchart', chartId: 'postDev', title: '開發後流程圖 v3.7' },
  {
    id: 'conclusion',
    type: 'quote',
    title: '核心策略',
    quote: '用 Claude Cowork 加速整理、起草與分析，用 Claude Code 加速開發、測試與文件，但範圍、品質、技術與交付責任仍由人承擔。',
    bullets: [
      'AI 不取代 PM、QA 或工程師',
      'Cowork 協助 PM / QA 整理、起草、比對、提醒與報告產出',
      'Claude Code 協助工程師開發、檢查與生成交付文件',
    ]
  }
];

window.AppData.contentVersion = 'v3.7';

window.AppData.chapters = [
  { id: 'summary',          title: '核心定位',             icon: '◎' },
  { id: 'flowcharts',       title: 'v3.7 流程圖',          icon: '⊞' },
  { id: 'roles',            title: '角色與 AI 邊界',       icon: '◈' },
  { id: 'pre-dev',          title: '開發前',               icon: '①' },
  { id: 'mid-dev',          title: '開發中',               icon: '②' },
  { id: 'post-dev',         title: '開發後',               icon: '③' },
  { id: 'warranty',         title: '保固 / 維護期',        icon: '▤' },
  { id: 'legend',           title: '圖例說明',             icon: '◇' },
  { id: 'observations',     title: '優點與注意事項',       icon: '◐' },
  { id: 'presentation-use', title: '簡報使用方式',         icon: '▣' },
  { id: 'conclusion',       title: '一句話總結',           icon: '→'  },
  { id: 'resources',        title: '資源對照',             icon: '⊟', external: true, href: 'resources.html' },
];

window.AppData.sectionTables = {
  'pre-dev': {
    columns: ['#', '節點', '模式', '工作內容'],
    rows: [
      ['1',  'PM 人工：需求訪談', '人工為主', '專案目標、使用對象、主要功能、預算 / 交期。AI 可整理紀錄，但不能取代 PM 與客戶溝通。'],
      ['2',  'PM Cowork：會議紀錄與需求整理', 'AI 初稿 + PM 確認', '需求清單、User Story、驗收條件初稿、未確認事項。'],
      ['3',  'QA Cowork：測試案例 / 測試策略初稿', 'AI 初稿 + QA 確認', '正常流程、異常情境、邊界 / 權限、測試資料需求。'],
      ['4',  'QA 人工：測試策略確認', '人工', '高風險判定、測試範圍確認、測試規劃定案。'],
      ['5',  '工程師人工：技術評估', '人工為主', '技術可行性、API / DB 影響、工時估算初稿。'],
      ['6',  '工程師 Claude Code：任務拆分與技術草稿', 'AI 輔助 + 工程師確認', '技術任務清單、OpenAPI 草稿、DB Schema 草稿。'],
      ['7',  'PM Cowork：SOW / 報價初稿', 'AI 初稿 + PM 確認', '工作說明、報價項目、風險 / 依賴、交付假設。必須在 QA 與工程師評估後產出。'],
      ['8',  'PM 人工：內部確認與優先序', '人工', '範圍切分、功能優先序、風險判斷、驗收方向。'],
      ['9',  '工程師：投標前技術探勘', '人工', '技術可行性最終確認、估算校正、技術風險識別。估算差異在此處理，不得在客戶簽核後回改 SOW。'],
      ['10', '客戶 Gate：SOW / 報價 / 交期', '客戶確認', '範圍簽核、報價確認、交期確認。進入此 Gate 前技術估算已鎖定。'],
      ['11', 'PM 人工：排程與里程碑', '人工', 'Sprint 計畫、任務分派、里程碑設定、溝通節奏。'],
      ['12', '工程師：交付期技術規劃（CR 評估）', '人工', '架構鎖定、依賴確認、分支與環境準備。若有範疇偏差，走 midDev CR Gate 流程，不回改 SOW。'],
      ['13', 'PM 人工：Kickoff / Sprint 起跑', '人工', '開發分支建立、任務分派、溝通節奏確認，正式進入開發中階段。'],
    ]
  },
  'mid-dev': {
    columns: ['#', '節點', '模式', '工作內容'],
    rows: [
      ['1',       '工程師 Claude Code：開發實作', 'AI 輔助 + 工程師確認', '功能開發、單元測試、自我檢查、文件 / 註解更新。'],
      ['2',       '工程師人工：建立 PR', '人工為主', '建立 PR、補充變更說明、指定 reviewer、檢查差異內容。'],
      ['3',       'CI 自動驗證', '全自動化', 'Build / Compile、Lint / Code Style、Unit Test、Security Scan。'],
      ['4',       'CI 是否通過？', '條件判斷', '未通過回工程師修正；通過後才進入人工 Code Review。'],
      ['5',       '工程師人工：Code Review / Merge', '人工', '人工 Review、回應意見、必要時同儕 Review、合併受保護分支。'],
      ['6',       '工程師人工 / 自動化：部署測試環境', '半自動化或自動化', '測試版部署、版號管理、測試環境同步、待測功能清單。'],
      ['7',       'QA 人工：QA 驗證', '人工為主', '功能測試、探索測試、回歸驗證、驗收條件確認。'],
      ['8',       'PM / QA Cowork：問題彙整與影響判斷', 'AI 整理 + 人工判斷', '缺陷 / 問題彙整、優先級建議、影響分析、下一步建議。'],
      ['9',       '問題類型？', '條件判斷', '分為 Bug / 未達驗收條件、需求不清 / 規格疑義、新增需求 / 範疇變更、通過 / 符合驗收條件。'],
      ['PM 釐清', 'PM：規格釋疑 + 客戶確認', 'PM 人工', '需求釐清、客戶確認、更新 User Story；釐清後視情況需更新實作或直接進 QA 重驗。'],
      ['11',      'PM / QA：UAT 準備', '人工', '版本候選確認、UAT 環境申請、驗收計劃；接著進入開發後流程。'],
    ],
    extraTables: [{
      columns: ['分類', '流向', '處理原則'],
      rows: [
        ['A. Bug / 未達驗收條件', '回到工程師修正，再跑 PR / CI / QA', '屬原承諾範圍內修正，通常不需客戶重新簽核。'],
        ['B. 需求不清 / 規格疑義', 'PM 規格釋疑節點 → 需更新實作（回 node 1）或無需實作變更（回 QA 重驗）', '必要時找客戶確認，不允許 AI 直接修正；由 PM 主導釐清後決定路徑。'],
        ['C. 新增需求 / 範疇變更', '進入客戶 Gate', '更新 backlog、調整報價 / 排程，必要時修正 SOW / 報價。'],
        ['D. 通過 / 符合驗收條件', 'PM / QA UAT 準備 → 進入開發後流程', '可安排內部 Demo、階段成果確認，並進入開發後流程。'],
      ]
    }]
  },
  'post-dev': {
    columns: ['#', '節點', '模式', '工作內容'],
    rows: [
      ['1',  '工程師人工：版本凍結', '人工', '確認驗收版本、鎖定功能範圍、建立版號、凍結變更。'],
      ['2',  '工程師人工：部署 UAT 環境', '人工 / 半自動化', 'UAT 版本部署、環境設定、測試資料準備、回滾點保留。'],
      ['3',  'QA 人工：Smoke Test / 環境檢查', '人工為主', '基本流程檢查、環境可用性、備份 / 回復確認、風險檢查。'],
      ['4',  '客戶 Gate：UAT 驗收', '客戶確認', '操作驗收、問題回報、驗收建議、階段結論。'],
      ['5',  'UAT 是否通過？', '條件判斷', '未通過則進工程師影響分析；通過則進入正式簽收 / 上線同意。'],
      ['影響分析', '工程師：影響分析與修正規劃', '人工', 'UAT 失敗根因分析、修正範圍評估、修正計劃。AI 修正前必經此節點。'],
      ['6',  'Claude Code：修正 / 重新部署 UAT', 'AI 輔助 + 工程師確認', '修正程式、更新版本、重新部署，並回到 QA Smoke Test。'],
      ['7',  '客戶 Gate：正式簽收 / 上線同意', '客戶確認', '正式簽收、上線同意、保固起算確認。'],
      ['CR', '工程師：Code Review / 上線前確認', '人工', '正式部署前 review、回滾確認、變更驗證。'],
      ['8',  '工程師人工：正式部署 / 回滾準備', '人工 / 半自動化', 'Production 部署、DB / migration、版本標籤、回滾準備。'],
      ['9',  'QA 人工：上線後 Smoke Test / 基本監控', '人工為主', '關鍵流程檢查、服務可用性、已知問題確認、初始監控。'],
      ['10', 'PM Cowork：Release Note 與交付文件初稿（PM + 工程師）', 'AI 初稿 + PM 確認', 'Release Note、操作手冊初稿、結案摘要、交付清單。'],
      ['11', 'Claude Code：技術文件與部署說明', 'AI 輔助 + 工程師確認', '架構文件、API 文件、環境設定說明、migration script。'],
      ['12', 'PM 人工：Knowledge Transfer / 保固交接', '人工', '維運交接、帳號 / 權限、聯絡窗口、保固範圍。'],
    ]
  }
};
