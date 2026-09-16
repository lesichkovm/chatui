# Task: Message timestamps and agent identity

**Source:** docs/proposal.md — Message affordances
**Priority:** Medium
**Status:** Pending

## Context

`addMessage` stores `timestamp: Date.now()` on each message object, but
`appendMessage` never renders it. Agent messages have no avatar or name label,
so users cannot tell who said what or when.

- `src/modules/chat-widget.class.js` — `addMessage` (~line 742)
- `src/modules/ui.js` — `appendMessage` (~line 1440)

## Scope

- Render a timestamp for each message — either on hover, or as separators on
  day/time breaks (both acceptable; pick the lighter-weight option first).
- Add a configurable agent name label and/or avatar on agent messages
  (e.g. `data-agent-name`, `data-agent-avatar`).
- Keep markup accessible: timestamps in `<time datetime="...">`, avatar with
  appropriate `alt`/`aria-hidden` handling.
- Theme-aware styling via CSS variables.

## Pros / Cons

**Pros**
- Timestamps already exist in state — display is the only missing piece
- Agent name/avatar builds trust and distinguishes bot vs. user messages
- Configurable identity fits the `data-*` model

**Cons**
- Visual clutter risk if every bubble shows a timestamp — hover/day-break
  grouping adds logic
- Time formatting raises i18n questions (locale, 12/24h) that are easy to
  get subtly wrong
- Avatar images introduce loading/failure states and layout shifts

**AI Recommendation:** **Do timestamps, defer avatars.** Timestamps are nearly
free (data already exists) — show on hover to avoid clutter. Agent *name* is
a cheap config string worth adding; avatar images add loading/failure/layout
complexity that isn't justified yet.

## Acceptance Criteria

- [ ] User can see when a message was sent
- [ ] Agent messages are attributed (name and/or avatar) when configured
- [ ] No timestamp clutter: repeated/grouped messages don't repeat labels unnecessarily
- [ ] Works for widget-based messages, not just plain text
- [ ] Playwright test added covering timestamp rendering, agent name/avatar
      from config, and widget-based messages (e.g. in
      `tests/chat-messages.spec.ts`)
