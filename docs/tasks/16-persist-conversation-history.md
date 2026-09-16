# Task: Persist conversation across page navigations

**Source:** docs/proposal.md — Because it's embedded
**Priority:** Medium
**Status:** Pending

## Context

`state.messages` lives only in memory. Navigating to another page on the host
site (or reloading) wipes the conversation. Note: the session key is already
stored in `sessionStorage` (`api-base.js`), so the server-side session may
survive — but the rendered history does not. There is also no distinction
between "minimize" and "end chat".

- `src/modules/chat-widget.class.js` — `state.messages`, `addMessage`,
  `close()`

## Scope

- Persist the message list to `sessionStorage` (per-tab) or `localStorage`
  (cross-tab) keyed by widget ID; make the choice configurable
  (e.g. `data-persist="session|local|none"`).
- Re-render persisted messages on init, reusing `appendMessage` for
  widget-based messages.
- Cap stored history (e.g. last 100 messages) to bound storage use.
- Distinguish minimize (X / launcher click — keeps history) from an explicit
  end-chat action (clears history and session).
- Handle storage failures gracefully (private mode, quota).

## Acceptance Criteria

- [ ] Conversation survives page reload/navigation within the storage scope
- [ ] Minimize preserves history; end-chat clears it
- [ ] Widget-based messages round-trip correctly through storage
- [ ] No crash when storage is unavailable
- [ ] Playwright test added covering: reload restores history, minimize keeps
      it, end-chat clears it, widget messages round-trip, and
      `data-persist="none"` disables persistence
