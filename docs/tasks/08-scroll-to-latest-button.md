# Task: "Scroll to latest" button

**Source:** docs/proposal.md — Message affordances
**Priority:** Medium
**Status:** Pending

## Context

`appendMessage` and `addWaitingMessage` always force
`container.scrollTop = container.scrollHeight`. If the user has scrolled up to
read history, a new message yanks them to the bottom — and there is no way to
jump back down other than manual scrolling.

- `src/modules/ui.js` — `appendMessage` (~line 1471)
- `src/modules/chat-widget.class.js` — `addWaitingMessage` (~line 781)

## Scope

- Track whether the user is near the bottom of `.messages` (e.g. within ~80px).
- Only auto-scroll on new messages when the user is already near the bottom.
- When the user is scrolled up and a new message arrives, show a floating
  "scroll to latest" button (optionally with an unread-count badge).
- Clicking it scrolls to the bottom and hides the button.

## Acceptance Criteria

- [ ] Reading history is not interrupted by incoming messages
- [ ] Button appears only when scrolled up with new content
- [ ] Button is keyboard-accessible and meets touch-target size (task 13)
- [ ] Works with the bottom-anchored layout from task 01
- [ ] Playwright test added covering: no forced scroll when user is reading
      history, button appears/disappears, click scrolls to latest
