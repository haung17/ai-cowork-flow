# Step 05 Review — Tier 3 Warning UI

**Date**: 2026-05-20  
**Branch**: feat/v2-resources-hardening  
**Scope**: resources-catalog.md, assets/resources-loader.js, assets/style-resources.css, assets/style-base.css, tests/e2e/tier3-warning.spec.js

---

## Agent Results

| Agent | Verdict | Notes |
|-------|---------|-------|
| code-reviewer | REQUEST_CHANGES → **PASS after fixes** | Critical: tagTier3 no H2 sentinel; Important: CSS specificity (#catalog-content blockquote wins over .tier3-block blockquote); Minor: comment misplaced |
| test-runner | **PASS** | 62/62 full suite; 15/15 flake check (--repeat-each=3) |
| performance-investigator | **PASS** | tagTier3 ~0.1-0.2ms (250x under 50ms budget); no layout thrashing |
| refactor-architect | **PASS** | resources-loader.js 211 lines (<300); tagTier3 14 lines (<50); Finding 1 (no H2 sentinel) fixed before review concluded |

---

## Fixes Applied Before Commit

1. **H2 sentinel in tagTier3 while-loop** — `break` on `H2` element prevents absorbing subsequent sections. Applied before test-runner ran (tests confirm 63/63 pass against fixed code).

2. **CSS specificity fix** — changed `.tier3-block blockquote` to `#catalog-content .tier3-block blockquote` to win over existing `#catalog-content blockquote` rule.

3. **Comment placement** — moved `/* ── Tier 3 Warning Block ── */` above `/* ── Print ── */`.

4. **Text match tightened** — `h.textContent.includes('Tier 3')` → `.trim().startsWith('Tier 3')`.

5. **Regression test added** — `tier3-warning: 階段流向總覽 section NOT swallowed into .tier3-block` guards against boundary bleed regression.

---

## Advisory Findings (Deferred)

- performance: O(N) vs O(h) — `querySelectorAll` walks all nodes; acceptable at current scale (~0.1ms), flagged for future if catalog > 5000 nodes
- code-reviewer minor #5: dark-mode override for `--bg-warn-tint` — deferred (dark mode CSS out of scope for Step 05)
- refactor-architect Finding 2: `_postProcess` wrapper to enforce rewriteNodeRefs → tagTier3 order — deferred to Step 06 refactor pass

---

## Impact on Subsequent Steps

- Step 06 (renderer integration) should consider extracting `_postProcess` wrapper per refactor-architect recommendation

---

## Commit

`feat(step-05): tier3 warning block with ⚠ banner (priority #4)`
