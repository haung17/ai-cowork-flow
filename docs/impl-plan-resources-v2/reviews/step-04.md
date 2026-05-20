# Step 04 Review — Deep-link Infrastructure

**Date**: 2026-05-19  
**Branch**: feat/v2-resources-hardening  
**Scope**: flowcharts.js, interactions.js, resources-loader.js, style-dash.css, dashboard.html, tests/e2e/deep-link.spec.js

---

## Agent Results

| Agent | Verdict | Notes |
|-------|---------|-------|
| code-reviewer | REQUEST_CHANGES → **PASS after fix** | 2 items: (1) commit not yet made (procedural), (2) `main` in regex but main chart never rendered as interactive nodes — fixed before commit |
| test-runner | **PASS** | 57/57 full suite; 18/18 flake check (--repeat-each=3) on deep-link.spec.js |
| performance-investigator | **PASS** | ~400 DOM ops for 33 nodes well under threshold; rewriteNodeRefs ~700 nodes <3ms; no FCP regression |
| refactor-architect | **PASS** | resources-loader.js 194 lines (<300); rewriteNodeRefs 39 lines (<50); initHashScroll 20 lines (<50); buildContent 227 lines is pre-existing, not introduced in Step 04 |

---

## Fixes Applied Before Commit

1. **`main` removed from `initHashScroll` regex and chapterMap** — resources-loader.js rewriteNodeRefs only emits `preDev|midDev|postDev` refs (numeric IDs only). Dashboard regex narrowed to `/^#(preDev|midDev|postDev)-([0-9]+)$/` to match. Silent `#main-A` hits now silently return at top of function rather than routing to `#flowcharts` section and then failing to find a node.

---

## Advisory Findings (Deferred — YAGNI)

- refactor-architect Finding 1: `buildContent` 227 lines — pre-existing; extract-method refactor deferred to separate cleanup
- refactor-architect Finding 2: Mixed abstraction in `buildContent` tail — deferred  
- refactor-architect Finding 3: `btn` null guard in `initSearch` — deferred (btn always exists in current HTML)
- code-reviewer minor: double regex pass in `rewriteNodeRefs` — negligible perf impact; deferred
- code-reviewer minor: `toBeGreaterThan(0)` in test 4 could be pinned to exact count — deferred to Step 06 full test audit

---

## Impact on Subsequent Steps

- Step 05 (Tier 3) — no changes to deep-link infrastructure needed
- Step 06 (renderer integration) — `buildContent` long-method finding should be addressed if it grows further

---

## Commit

`feat(step-04): deep-link infra preDev:N → dashboard nodes (priority #3)`
