# Step 02 — midDev 數據重排 + 側邊錨點套用

## Goal

移動 `middev-pm-clarify` / node 10 / node 11 y 座標，讓原本同 y-row 水平衝突的 `9→clarify` 變成向右下斜線。同時為關鍵 edge 套用 Step 01 新增的 `fromSide`/`toSide`。

## 座標調整

| Node | 舊 (x, y) | 新 (x, y) |
|------|----------|----------|
| middev-pm-clarify | (70, 65) | (70, 74) |
| 10 Gate CR | (70, 74) | (70, 83) |
| 11 UAT 準備 | (45, 74) | (45, 83) |

其餘節點座標不變。

## Edge Side Props

| Edge | fromSide | toSide | 原因 |
|------|----------|--------|------|
| `9→middev-pm-clarify` | right | left | 避免路徑往下穿越 9→11 直線 |
| `middev-pm-clarify→7` | left | — (top) | 左轉回 QA 驗證，S-curve |
| `middev-pm-clarify→1` | — (bottom) | right | back-edge 從右側入 Claude Code |

## Tests (`v7-step02-middev-layout.spec.js`) — 5 tests

1. `middev-pm-clarify.y === 74`
2. node `10.y === 83`、node `11.y === 83`
3. edge `9→middev-pm-clarify` 有 `fromSide:'right'`
4. midDev 渲染後幾何交叉計數 ≤ 2（幾何 line-intersection，允許 back-edge 交叉）
5. midDev 所有 nodes 座標非 NaN

## Geometry Intersection Test (test 4)

用 Playwright evaluate：
1. 取 midDev SVG 所有 path `d` 屬性
2. 解析每段 path 為若干線段 (sampling Bézier at t=0,0.25,0.5,0.75,1.0)
3. 對每對線段做 line-segment intersection check
4. 計算交叉對數，預期 ≤ 2（back-edge 9→1、clarify→1 仍可能交叉一次）

## 4-agent Review 條件

- refactor-architect (g): 幾何交叉 ≤ 2
- code-reviewer: edge schema 沒有 hardcoded string 以外的改動（data.js）
