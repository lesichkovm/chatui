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

## Pros / Cons

**Pros**
- The 350×500 fixed card is essentially broken on phones today — this is the
  correct responsive pattern for embedded chat
- `100dvh` + safe-area fixes real, well-known mobile-keyboard cropping bugs
- Mostly additive CSS; low risk to the desktop experience

**Cons**
- A full-screen takeover is aggressive — the user loses all page context;
  some products prefer a taller card instead
- `dvh` units and `env()` need fallbacks for older browsers
- Testing matrix grows: viewport sizes, orientation, keyboard open/closed
  are hard to fully cover even with emulation

**AI Recommendation:** **Do it.** A 350×500 fixed card on a phone is a defect,
not a preference — every embedded chat product does full-screen on mobile.
Mostly additive CSS with a `vh` fallback; the testing cost is the real price,
and it's still worth it.

## Acceptance Criteria

- [ ] At ≤640px the widget is full-screen; above it remains a floating card
- [ ] Input stays visible with the on-screen keyboard open
- [ ] No clipped UI on devices with safe-area insets
- [ ] Verified on emulated mobile viewport in Playwright
- [ ] Playwright test added running at ≤640px viewport asserting full-screen
      layout, and at desktop width asserting the floating card
