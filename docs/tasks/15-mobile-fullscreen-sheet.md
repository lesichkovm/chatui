# Task: Mobile full-screen sheet behavior

**Source:** docs/proposal.md — Because it's embedded
**Priority:** High
**Status:** Pending

## Context

The popup is a fixed 350×500px card with no media queries. On a phone viewport
it covers most of the screen but still behaves like a floating card, and
`100vh` plus the mobile keyboard can crop the input.

- `src/modules/ui.js` — `.window` rule (~line 91), no `@media` blocks exist

## Scope

- Below ~640px viewport width, the open widget becomes a full-screen sheet
  (edge-to-edge, no border radius, launcher hidden or repositioned).
- Use `100dvh` (with `100vh` fallback) so the mobile keyboard doesn't crop the
  input area.
- Respect `env(safe-area-inset-bottom)` (and side insets) for notched devices.
- Keep the launcher button reachable and correctly positioned on small screens.
- Ensure body scroll behind the sheet is locked while open on mobile.

## Acceptance Criteria

- [ ] At ≤640px the widget is full-screen; above it remains a floating card
- [ ] Input stays visible with the on-screen keyboard open
- [ ] No clipped UI on devices with safe-area insets
- [ ] Verified on emulated mobile viewport in Playwright
- [ ] Playwright test added running at ≤640px viewport asserting full-screen
      layout, and at desktop width asserting the floating card
