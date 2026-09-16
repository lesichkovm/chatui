# Task: Transcript download link/button

**Source:** Feature idea (extends docs/proposal.md review)
**Priority:** Low
**Status:** Pending

## Context

There is currently no way for an end user to get a copy of the conversation.
The proposal is to let the embedder configure a URL; when set, the widget shows
a download icon/link in the header that opens that URL, where the embedder's
own script can generate the transcript (e.g. a PDF).

- `src/modules/ui.js` — `.header` markup in `createWidgetDOM` (~line 1375)
- `src/modules/chat-widget.class.js` — `data-*` config parsing (~lines 36–50),
  `state.messages` already holds `{ text, sender, timestamp }` per message
- `src/modules/api-base.js` — session key stored in `sessionStorage` under
  `chat_session_key`

## Scope

- Add `data-transcript-url="https://…"` (+ `transcriptUrl` in
  `ChatUI.init()` config). When present, render a download icon button in the
  header (next to the close button) that opens the URL in a new tab
  (`target="_blank" rel="noopener"`).
- Support a `{sessionKey}` placeholder in the URL, substituted with the stored
  session key so the embedder's script can identify the conversation, e.g.
  `data-transcript-url="/transcript?session={sessionKey}"`. If no placeholder
  is present, append `?session_key=…` (or `&`) automatically — decide and
  document one behavior.
- Optional built-in mode: `data-transcript` (no URL) renders the same button
  but generates a transcript client-side from `state.messages` (plain text or
  printable HTML) and triggers a local download — for embedders who don't want
  to build a server endpoint.
- Icon button must have an accessible name ("Download transcript"), ≥44px
  touch target (task 13), and theme-aware styling.

## Notes / open questions

- Privacy: appending the session key to a third-party URL leaks it — document
  that the URL should be same-origin/trusted.
- Client-side mode depends on message history; combines naturally with the
  persisted history from task 16 but should work without it.

## Pros / Cons

**Pros**
- Genuinely useful for support/sales conversations (email me the transcript)
- URL mode keeps the widget thin — embedders own the transcript format
- Built-in mode reuses `state.messages` which already has text + timestamps

**Cons**
- Two modes = two features to build, test, and document; built-in mode could
  be cut to keep scope sane
- Session-key-in-URL leaks a credential-ish value into logs/referer headers —
  needs clear documentation and a same-origin recommendation
- Client-side transcripts include whatever is in state — partial/failed
  messages need a decision
- Competes for header space with subtitle (task 05) and close button

**AI Recommendation:** **Defer — build the URL mode only if an embedder asks.**
Nice-to-have, not a gap users complain about. If done, ship only
`data-transcript-url` (thin, embedder-owned); skip the built-in client-side
mode until persistence (task 16) exists to make it meaningful.

## Acceptance Criteria

- [ ] No transcript UI when neither attribute is set
- [ ] `data-transcript-url` shows a header icon that opens the URL with the
      session key substituted/appended
- [ ] `data-transcript` (built-in mode, if implemented) downloads a local
      transcript of the current conversation
- [ ] Accessible name and ≥44px target on the button
- [ ] New attributes documented alongside existing `data-*` options
- [ ] Playwright test added covering: hidden by default, URL opens with
      session key, built-in download triggers, button accessibility
