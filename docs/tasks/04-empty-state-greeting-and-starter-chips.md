# Task: Empty state — greeting bubble and starter chips

**Source:** docs/proposal.md — Empty state
**Priority:** High
**Status:** Pending

## Context

When the widget opens there is no content: no greeting, no suggested actions.
An empty chat panel gives users nothing to act on.

- `src/modules/chat-widget.class.js` — `open()` / `init()`
- `src/modules/ui.js` — `createWidgetDOM`

## Scope

- On first open (before any messages), render a greeting bubble from the agent,
  e.g. "Hi! How can we help?".
- Render 2–4 tappable starter chips (e.g. "Track my order", "Talk to a human")
  that send the chip text as a user message when clicked.
- Make greeting text and chips configurable via config/data attributes
  (e.g. `data-greeting`, `data-starter-chips`), with sensible defaults.
- Hide chips once the conversation has started; do not re-show on reopen.
- Reuse existing message/chip styling conventions and sanitization
  (`createSafeMessageHTML`) — chips must not inject raw HTML.

## Acceptance Criteria

- [ ] Fresh widget opens with a greeting bubble and starter chips
- [ ] Clicking a chip sends its text through the normal `sendMessage` path
- [ ] Chips disappear after first use and do not return
- [ ] Greeting/chips configurable and disabled cleanly when not provided
- [ ] Playwright test added covering: greeting rendered on first open, chip
      click sends a message, chips hidden after conversation starts, and
      `data-greeting`/`data-starter-chips` configuration
