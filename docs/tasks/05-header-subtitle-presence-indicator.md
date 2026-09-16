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

## Acceptance Criteria

- [ ] Subtitle renders when configured and is hidden otherwise
- [ ] Presence dot (if implemented) reflects actual connection state
- [ ] No header layout breakage in popup (350px) or fullpage mode
- [ ] Playwright test added covering subtitle rendering from config and
      presence dot state (connected vs. failed handshake)
