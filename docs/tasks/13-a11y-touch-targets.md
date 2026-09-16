# Task: Minimum 44px touch targets

**Source:** docs/proposal.md — Accessibility
**Priority:** Medium
**Status:** Pending

## Context

Several interactive elements are below the 44×44px minimum:

- `.close` — a 24px glyph with `padding: 0`, roughly 24×24px
- `.send` — 38px tall
- `.widget-tag-remove` — 14px font, `padding: 0`
- `.widget-file-remove` — small icon button
- `.widget-color-preset` — 32×32px
- Retry button in `addFailedMessageIndicator` — tiny inline-styled button

- `src/modules/ui.js` — styles throughout
- `src/modules/chat-widget.class.js` — `addFailedMessageIndicator` (~line 635)

## Scope

- Bring all interactive elements to at least 44×44px effective target size.
- Where a control must look smaller visually, enlarge the hit area with padding
  or a transparent pseudo-element rather than growing the visual glyph.
- Coordinate with task 03 (icon-only send button) so the new send button lands
  at ≥44px from the start.

## Pros / Cons

**Pros**
- Real usability fix — the current X is nearly untappable on mobile
- Pseudo-element hit-area technique preserves the compact visual design
- Aligns with WCAG 2.5.5 / platform HIGs

**Cons**
- Larger hit areas can overlap adjacent elements (e.g. tag-remove next to a
  tag chip) causing mis-taps if done naively
- Some controls (color presets in a row) physically can't reach 44px without
  redesigning the layout — a compromise may be needed
- Touches many CSS rules; regression surface is broad

**AI Recommendation:** **Do it, pragmatically.** Fix the main controls (close,
send, launcher, retry) to true ≥44px; use pseudo-element hit-area expansion
for small inline controls like tag-remove; accept documented exceptions
(e.g. 32px color presets) where 44px would force a redesign.

## Acceptance Criteria

- [ ] Every clickable element in the widget has ≥44×44px hit area
- [ ] No visual layout regressions in the 350px popup
- [ ] Verified in both popup and fullpage modes
- [ ] Playwright test added asserting `boundingBox` of interactive elements
      (close, send, launcher, tag/file remove) is ≥44×44px
