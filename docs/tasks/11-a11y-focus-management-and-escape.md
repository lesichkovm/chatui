# Task: Focus management and Escape-to-close

**Source:** docs/proposal.md — Accessibility
**Priority:** Medium
**Status:** Pending

## Context

Partially done already: the close button has `aria-label="Close chat"` and focus
is moved into the textarea on open (`open()` focuses `this.textarea`). Missing:
Escape key to close, and returning focus to the launcher button when the widget
closes.

- `src/modules/chat-widget.class.js` — `bindEvents` (~line 312), `open()` /
  `close()` (~lines 376, 393)

## Scope

- Close the popup when Escape is pressed while focus is inside the widget
  (popup mode only; `fullpage` has no close button).
- On close, return focus to the launcher (`.button`) so keyboard users don't
  lose their place.
- Consider a light focus trap or at least a sensible tab order while open.
- Remove document-level listeners in `destroy()` to avoid leaks.

## Acceptance Criteria

- [ ] Escape closes the widget from anywhere inside it
- [ ] Focus returns to the launcher on close (both via Escape and the X button)
- [ ] Focus lands in the textarea on open (existing behavior, keep)
- [ ] Listeners cleaned up on `destroy()`
- [ ] Playwright test added covering Escape-close and focus returning to the
      launcher (e.g. in `tests/chat-widget.spec.ts`)
