# Step 01 Review — flowcharts.js router side-anchor

## Agents Results

| Agent | Verdict | Key Notes |
|-------|---------|-----------|
| code-reviewer | PASS (a) | Regression guard holds; default path = v3.7 formula |
| test-runner | PASS tests; WARN version strings | v3.7 strings in prod files — expected, deferred to Step 14 |
| performance-investigator | PASS (g) | No reflow in loop; rect width = string length calc only |
| refactor-architect | BUG FOUND + FIXED | toSignX=0 → sharp kink; fixed with cpX2=x1 S-curve |

## Changes Applied After Review

- `assets/flowcharts.js`: extracted `_exitAnchor` / `_entryAnchor` helpers; fixed `cpX2 = x1` for horizontal-exit + top/bottom-entry; `console.warn` for unknown side strings
- `tests/e2e/v7-step01-router.spec.js`: tests 2/3/4 wrapped in `try/finally`; used `delete` instead of `= undefined`

## Notes for Step 02

- Step 02 midDev data re-layout: `middev-pm-clarify→7` uses `fromSide:'left'` — will hit the fixed S-curve path (not sharp kink). ✓
- Test 1 regression guard is coordinate-only (acknowledged weak but acceptable for step 01 scope)
- v3.7 version strings in prod: confirmed for Step 14, not a step 01 issue
- `⊟` symbol in dashboard.html + data.js: Step 11 scope
