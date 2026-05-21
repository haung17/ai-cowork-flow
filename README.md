# AI Cowork Flow — v3.7

接案軟體開發交付治理流程：PM / QA / 工程師三角色下，AI（Claude Cowork + Claude Code）如何介入整理、開發、測試、驗收與保固交接。

## Pages

| 頁面 | 說明 |
|------|------|
| `dashboard.html` | 互動式流程儀表板（開發前 / 開發中 / 開發後）、sidebar、全文搜尋、主題切換 |
| `resources.html` | AI Cowork 資源對照表（9 項交付物 prompt 與驗收條件） |
| `governance.html` | 治理規則頁（7 條硬規則、Tier 定義、Status 升等） |
| `presentation.html` | Reveal.js 簡報（v3.7 流程圖四張） |

## How To View

```bash
python -m http.server 8080
# http://localhost:8080/dashboard.html
```

GitHub Pages:

```
https://haung17.github.io/ai-cowork-flow/dashboard.html
https://haung17.github.io/ai-cowork-flow/resources.html
```

## Files

```
assets/
  data.js          # SSOT: flowchart nodes/edges + sectionTables + chapters
  interactions.js  # dashboard DOM renderer (renderTable / buildContent)
  resources-loader.js  # resources.html catalog loader + search debounce
  style-*.css      # shared CSS variables + page-specific styles
resources-catalog.md    # 9 resources 內容（marked.js 動態渲染）
resources-state.json    # 各資源 status / verification / acceptanceChecks
governance.md           # 治理規則原始文件
```

## Tests

```bash
npx playwright test              # 148 tests
npx playwright test --repeat-each=3  # flake check
```

## Concept

```
固定規則工作 → 腳本自動化
起草、摘要、比對、分類 → AI Cowork
商務決策、品質判斷、簽核、部署 → 人工
```

角色邊界：
- **PM**: 需求訪談、範圍切分、客戶溝通；AI 不能承諾報價、範圍、交期
- **QA**: 測試策略、缺陷記錄、驗收確認；AI 不能取代品質風險判斷
- **工程師**: 技術評估、Code Review、部署；AI 不承擔架構決策與正式部署

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
