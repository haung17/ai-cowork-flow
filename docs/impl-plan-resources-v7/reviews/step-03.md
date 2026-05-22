# Step 03 Review — governance 10 條硬規則

## Agents Results

| Agent | Verdict | Key Notes |
|-------|---------|-----------|
| code-reviewer | REQUEST_CHANGES → FIXED | (a) `tables[0]` fragile; (d) `--accent-dark` in dark mode = #E6EDF3 → white-on-white fail |
| test-runner | PASS 16/16 | step01 + step02 + step03 all green, no regressions |
| performance-investigator | PASS | Single O(n) pass; double `querySelectorAll` cosmetic only; 1 reflow acceptable at 1 table |
| refactor-architect | BLOCKING FOUND → FIXED | `i>=total-3` magic number → use `ruleNum>=8` text-content guard |

## Changes Applied After Review

- `governance-loader.js`:
  - table selector: `#hard-rules` (querySelector) → h2 text-match "硬規則" (marked.js does not parse `{#id}`)
  - badge guard: `i >= total - 3` → `parseInt(firstTd.textContent) >= NEW_RULE_THRESHOLD`
  - constants extracted: `NEW_RULE_THRESHOLD = 8`, `NEW_RULE_LABEL = 'v3.8 新增'`
- `style-resources.css`: `.rule-new` background `var(--accent-dark)` → `#1d4ed8` (theme-stable)

## Notes for Step 04

- preDev gap: node 1 y=2, node 2 y=11 — 9-unit gap; insert `predev-nda-gate` at (45, 6)
- No mass y-shift needed; all other nodes at y≥11 unaffected
- Edge: delete `{from:'1',to:'2'}`; add `1→predev-nda-gate` + `predev-nda-gate→2`
- Node role: PM, type: HUMAN (NDA is PM responsibility per rule 8)
