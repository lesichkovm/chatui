# Task: Improve agent bubble visibility

**Source:** docs/proposal.md — Message affordances
**Priority:** Medium
**Status:** Pending

## Context

Agent bubbles use `--chat-surface` on a `--chat-bg` panel. In dark mode that is
`#2d2d2d` on `#1a1a1a` — the bubble barely separates from the background and
messages can look like loose text on the panel.

- `src/modules/ui.js` — `.bot-message` rule (~line 191), theme variables
  (~lines 23–60)

## Scope

- Lift agent bubbles a step in luminance and/or add a subtle
  `1px solid var(--chat-border)` border so they read as distinct surfaces.
- Apply to both `default` and `branded` themes in light and dark modes.
- While here, verify user/agent bubble contrast still meets 4.5:1 for text
  (feeds into task 12).

## Pros / Cons

**Pros**
- Cheap clarity win — bubbles that read as bubbles
- Border option works without changing any theme variable values

**Cons**
- Changing `--chat-surface` luminance affects everything using that variable
  (header, widgets, cards) — a border on `.bot-message` only is safer
- Any tweak must be re-verified across 4 theme/mode combos plus embedder
  custom colors, which may already rely on the current subtlety

**AI Recommendation:** **Do it — via border, not luminance.** A
`1px solid var(--chat-border)` on `.bot-message` is a two-line fix that
doesn't disturb `--chat-surface` (used by header/cards/widgets) or embedder
custom colors.

## Acceptance Criteria

- [ ] Agent bubbles are visually distinct from the panel in all four theme/mode combos
- [ ] Change is implemented via theme variables or `.bot-message` styling, not hardcoded colors
- [ ] Playwright/visual check updated — existing theme specs
      (`tests/theme-system.spec.ts`) still pass; add assertion that bot bubble
      background differs from panel background in all theme/mode combos
