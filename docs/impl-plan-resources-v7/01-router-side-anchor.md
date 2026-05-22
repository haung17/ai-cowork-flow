# Step 01 — flowcharts.js router 側邊錨點支援

## Goal

`assets/flowcharts.js` 目前所有 edge 固定使用 bottom-center exit → top-center entry Bézier。  
加入 optional `fromSide` / `toSide` 屬性，讓 edge 可從任意方向連出/進，解決同 y-row 節點之間的水平交叉問題。

## Deliverables

- `assets/flowcharts.js` — edge 路徑計算升級
- `tests/e2e/v7-step01-router.spec.js` — 6 tests

## Schema 升級

```
edge: {
  from: string,
  to: string,
  label?: string,
  fromSide?: 'bottom' | 'right' | 'left' | 'top'   // 預設 'bottom'
  toSide?:   'top'    | 'left'  | 'right' | 'bottom' // 預設 'top'
}
```

## Anchor 計算

| side | anchor 公式 |
|------|------------|
| bottom | (cx, ty + NODE_H - 10) |
| top | (cx, ty) |
| right | (cx + NODE_W/2, ty + NODE_H/2) |
| left | (cx - NODE_W/2, ty + NODE_H/2) |

## Bézier 控制點

- bottom/top exit → **vertical** tangent: `C(x1, y1+sign*dy)` — 同原算法
- right/left exit → **horizontal** tangent: `C(x1+sign*dx, y1)`
- dx = |x2-x1|*0.5; dy = |y2-y1|*0.5

## Label 背景 rect

若 `|dx| > |dy| * 2`（水平度高），label text 前插入同寬 `<rect fill="var(--bg,#fff)" rx="2">`。

## Regression Guard

無 `fromSide` / `toSide` props → path d 公式與 v3.7 完全一致：
```
M{x1},{y1} C{x1},{y1+dy} {x2},{y2-dy} {x2},{y2}
```

## Tests (`v7-step01-router.spec.js`)

1. 預設 edge（`1→2` in midDev）path 起點 y = `from.ty + NODE_H - 10` = from.ty + 100
2. `fromSide:'right'` 注入 → start x = `from.cx + NODE_W/2`
3. `toSide:'left'` 注入 → end x = `to.cx - NODE_W/2`
4. horizontal edge (`|dx|>|dy|*2`) label 有 `<rect>` 元素緊鄰 text
5. midDev 全 edges 都有有效 path d（非空、以 M 開頭）
6. midDev SVG `<marker>` 仍存在且 path 有 `marker-end` 屬性

## 4-agent Review 條件

- code-reviewer (a): 無 side prop 時 path d = v6 formula
- performance-investigator: 新增 rect 計算不影響 render time（無 reflow loop）
