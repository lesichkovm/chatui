# Task: Header subtitle / presence indicator

**Source:** docs/proposal.md — Empty state
**Priority:** Medium
**Status:** Pending

## Context

The header contains only the title and the close button. There is no
expectation-setting copy such as "Typically replies in a few minutes" and no
online/offline indicator.

- `src/modules/ui.js` — `.header` markup in `createWidgetDOM` (~line 1375)

## Scope

- Add an optional subtitle line under the header title, configurable via
  config/data attribute (e.g. `data-subtitle="Typically replies in a few minutes"`).
- Optionally add an online/offline status dot next to the title, driven by
  connection state (handshake success/failure already tracked in
  `initializeConnection`).
- Subtitle/dot must adapt to light and dark themes via CSS variables.

## Pros / Cons

**Pros**
- Sets response-time expectations — reduces "is anyone there?" abandonment
- A presence dot tied to handshake state is honest and cheap to implement
- Optional/configurable — zero cost when unused

**Cons**
- A static "typically replies in a few minutes" is a claim the embedder must
  stand behind; hardcoding it as default would be dishonest
- A presence dot can only reflect *connection* state, not real agent
  availability — it can overpromise ("online" just means the socket is up)
- Adds header height; slightly more layout to maintain

**AI Recommendation:** **Do the subtitle, skip the presence dot.** A
configurable `data-subtitle` is honest and useful. The dot only reflects
socket state — showing "online" when no agent is available overpromises, so
it isn't worth it until real presence exists server-side.

## Acceptance Criteria

- [ ] Subtitle renders when configured and is hidden otherwise
- [ ] Presence dot (if implemented) reflects actual connection state
- [ ] No header layout breakage in popup (350px) or fullpage mode
- [ ] Playwright test added covering subtitle rendering from config and
      presence dot state (connected vs. failed handshake)
