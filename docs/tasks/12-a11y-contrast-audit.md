# Task: Color contrast audit (4.5:1)

**Source:** docs/proposal.md — Accessibility
**Priority:** Medium
**Status:** Pending

## Context

The proposal flags that gray secondary text on the near-black background looks
borderline. Known suspects: `.close` at `opacity: 0.6`, placeholder text,
file-size/secondary text at `opacity: 0.7`, and dropzone icon at `opacity: 0.6`
— all in dark mode (`--chat-bg: #1a1a1a`, `--chat-text: #ffffff`).

- `src/modules/ui.js` — theme variables (~lines 23–60), `.close` (~line 148),
  `.widget-file-size` (~line 951), `.widget-file-dropzone-content svg` (~line 917)

## Scope

- Audit all text/foreground combinations in both themes × both modes against
  WCAG AA 4.5:1 (3:1 for large text and non-text UI like focus indicators).
- Placeholder text in particular must be checked — browser-rendered
  placeholders are often below threshold.
- Fix failures by adjusting theme variables or removing/lowering opacity, not
  by hardcoding overrides.

## Pros / Cons

**Pros**
- WCAG AA conformance matters for embedders selling to enterprises/gov
- Fixes are mostly variable/opacity tweaks — low code risk
- Produces a reusable contrast checklist for future UI work

**Cons**
- Raising contrast changes the visual design — e.g. the dimmed close button
  at `opacity: 0.6` was likely an aesthetic choice
- Embedder custom colors can still fail contrast; the widget can't police
  arbitrary `data-*-color` values (could warn, but that's scope creep)
- Manual audit work is tedious; automated computed-style checks only
  partially cover it (opacity, inheritance, placeholders)

**AI Recommendation:** **Do it once, manually + targeted automation.** Fix the
known suspects (dimmed close, placeholder, 0.7-opacity secondary text) and
add computed-style assertions for the key pairs. Don't build a general
contrast framework — embedder custom colors are their responsibility anyway.

## Acceptance Criteria

- [ ] Documented list of checked combinations and results
- [ ] All normal text ≥ 4.5:1 in every theme/mode
- [ ] Placeholder text legible in all modes
- [ ] Automated contrast checks added where feasible (e.g. Playwright +
      computed styles asserting ratios for key text/background pairs in
      `tests/theme-system.spec.ts`), or a documented manual audit procedure
