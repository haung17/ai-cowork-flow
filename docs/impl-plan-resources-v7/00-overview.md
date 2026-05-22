# v3.8 Implementation Plan — Overview

**Branch**: `feat/v3.8-middev-edges-redlines-governance`
**Target PR**: #16
**Base**: v3.7 (148/148 tests)

## Scope

| Phase | 內容 | Step |
|-------|------|------|
| A. midDev 視覺 | flowcharts.js side-anchor + data 重排 | 01-02 |
| B. 業務紅線 | governance 10 條 + preDev NDA + midDev AI-test + CR-switch | 03-06 |
| C. Resources P0 | Tier 4 banner + WBS reclassify + checklist + sanitize + status badge | 07-10 |
| D. Resources P1 | sidebar 入口 + decision chips + Demo watermark + External Use Gate | 11-12 |
| E. 收尾 | Full E2E + PR | 13-14 |

## Step List

| Step | 標題 | 預計測試數 |
|------|------|----------|
| 01 | flowcharts.js router 側邊錨點 | 6 |
| 02 | midDev 數據重排 + side props | 5 |
| 03 | governance 3 條紅線 | 4 |
| 04 | preDev NDA Gate 節點 | 4 |
| 05 | midDev AI Code Test Gate | 4 |
| 06 | midDev CR 變更管理切換 | 4 |
| 07 | Tier 4 sticky banner + WBS Tier 2 | 5 |
| 08 | Human Gate Checklist (checkbox + localStorage) | 6 |
| 09 | DOMPurify sanitize + schema validation | 5 |
| 10 | Status badge 顯著化 | 5 |
| 11 | Dashboard 入口文字 + decision chips | 6 |
| 12 | Demo watermark + External Use Gate | 4 |
| 13 | Full E2E journey + flake check | 13 |
| 14 | PR #16 + README + CHANGELOG | — |

**預期測試總數**: 148 + ~58 = ~206

## 執行模式

每 step：RED commit → GREEN commit → flake check → 4-agent 平行 review → reviews/step-NN.md → 動態調整後續 step doc → 進下一 step。
