# 稽核紀錄模板

v3 governance — 治理事件記錄

## 使用時機

- Status 升等 / 降等
- Tier 4 操作執行
- 治理違規事件
- AI 工具異常（產出嚴重錯誤）

## 紀錄格式

```markdown
## [YYYY-MM-DD] [事件類型] — [資源/操作名稱]

**操作者**：[姓名 / 角色]
**時間**：[YYYY-MM-DD HH:MM]
**事件類型**：Status 升等 / Tier 4 操作 / 治理違規 / AI 異常
**影響範圍**：[描述]

### 詳情
[事件描述，3-5 句話]

### 決策
[PM 最終決定]

### 後續行動
- [ ] [行動項 1，負責人，期限]
- [ ] [行動項 2]
```

## 範例記錄

```markdown
## 2026-05-20 Status 升等 — work-plan: DraftReady → InternallyTested

**操作者**：PM 王小明
**時間**：2026-05-20 14:30
**事件類型**：Status 升等
**影響範圍**：work-plan 資源在 resources-state.json 的 status 欄位

### 詳情
已完成 1 次假案測試（ShopDemo 電商案）。verification checklist 3 項全 pass。
acceptanceChecks 中 in-scope/out-of-scope 和 buffer 估算均確認。

### 決策
升等為 InternallyTested，下次真實案子使用後可再升 ClientTested。

### 後續行動
- [x] 更新 resources-state.json status 欄位 — PM 王小明 — 2026-05-20
```

## 歸檔位置

本文件僅為模板。實際稽核紀錄建議記錄在：
- 專案管理工具（ASANA 任務、Notion 頁面）
- 或複製本模板於 `docs/audit/YYYY-MM-DD-[事件].md`
