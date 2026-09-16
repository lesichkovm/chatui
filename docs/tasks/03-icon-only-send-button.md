# Task: Icon-only send button

**Source:** docs/proposal.md — Layout
**Priority:** Medium
**Status:** Pending

## Context

The proposal asked for input auto-grow plus an icon-only send button. Auto-grow
is **already implemented** (`setupTextareaAutoResize` in
`src/modules/chat-widget.class.js` — `rows="1"`, capped at 150px). The remaining
work is replacing the text "Send" button with an icon to reclaim horizontal
space.

- `src/modules/ui.js` — `.send` rule and button markup (~lines 229, 1383)

## Scope

- Replace the "Send" label with an SVG send icon (e.g. paper plane), matching
  the existing inline-SVG approach used for the launcher button.
- Keep `aria-label="Send message"` on the button.
- Keep the button height aligned with the textarea (38px) and ensure a minimum
  44px touch target (see task 13).

## Acceptance Criteria

- [ ] Send button renders as an icon in both light and dark modes
- [ ] Accessible name still announced as "Send message"
- [ ] Input row gains horizontal room; no layout regressions at 350px width
- [ ] Playwright test updated — existing specs that click the "Send" text
      button must target the icon button (by aria-label) instead
