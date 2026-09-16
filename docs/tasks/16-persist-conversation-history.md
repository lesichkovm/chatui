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

## Pros / Cons

**Pros**
- Losing a conversation on navigation is a top complaint for site-wide
  widgets; the session key already survives, so this completes the story
- `data-persist="none"` keeps privacy-sensitive embedders safe
- Minimize-vs-end-chat distinction is real UX, not just plumbing

**Cons**
- Storing conversation text raises privacy expectations (shared devices,
  GDPR-adjacent concerns) — must be opt-in-able and documented
- Stale history can confuse ("why is yesterday's chat back?") — needs a
  clear/expiry policy decision
- Widget-based messages must serialize/deserialize cleanly — the storage
  schema needs care to survive format changes
- localStorage vs sessionStorage is a real fork in the road (cross-tab
  continuity vs. privacy)

**AI Recommendation:** **Do it, but after the core UX fixes — and opt-in.**
High user value, but it has the most policy surface (privacy, expiry,
serialization schema) of any task here. Ship `data-persist` defaulting to
`none` (or `session`) so embedders choose deliberately. Don't rush it ahead
of tasks 01/04/15.

## Acceptance Criteria

- [ ] Conversation survives page reload/navigation within the storage scope
- [ ] Minimize preserves history; end-chat clears it
- [ ] Widget-based messages round-trip correctly through storage
- [ ] No crash when storage is unavailable
- [ ] Playwright test added covering: reload restores history, minimize keeps
      it, end-chat clears it, widget messages round-trip, and
      `data-persist="none"` disables persistence
