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

## Pros / Cons

**Pros**
- Measurable engagement lift — gives users something to act on immediately
- Teaches users what the agent can do
- Configurable via `data-*`, consistent with existing patterns

**Cons**
- A canned greeting can misfire if the backend/agent isn't actually responsive
  (sets an expectation the product may not meet)
- Chips send hardcoded text — useless or misleading if the backend can't
  handle those prompts; quality depends entirely on embedder configuration
- More first-open UI to keep theme-consistent and test

**AI Recommendation:** **Do it.** Biggest UX lever after the layout fixes —
an empty panel is a dead end, and the mechanism (chips calling `sendMessage`)
is simple. Make both greeting and chips config-only with no defaults, so
embedders who don't configure it get today's clean empty state.

## Acceptance Criteria

- [ ] Fresh widget opens with a greeting bubble and starter chips
- [ ] Clicking a chip sends its text through the normal `sendMessage` path
- [ ] Chips disappear after first use and do not return
- [ ] Greeting/chips configurable and disabled cleanly when not provided
- [ ] Playwright test added covering: greeting rendered on first open, chip
      click sends a message, chips hidden after conversation starts, and
      `data-greeting`/`data-starter-chips` configuration
