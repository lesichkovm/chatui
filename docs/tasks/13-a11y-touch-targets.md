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

## Acceptance Criteria

- [ ] Every clickable element in the widget has ≥44×44px hit area
- [ ] No visual layout regressions in the 350px popup
- [ ] Verified in both popup and fullpage modes
- [ ] Playwright test added asserting `boundingBox` of interactive elements
      (close, send, launcher, tag/file remove) is ≥44×44px
