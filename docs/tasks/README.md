# Tasks from docs/proposal.md review

Tasks generated from the UI/UX review in `docs/proposal.md`. Each file is one
valid proposal item, numbered in the proposal's priority order.

All tasks must include Playwright test coverage (see `tests/`); each task's
acceptance criteria lists the specific coverage expected. Every task also
includes a **Pros / Cons** section so items can be accepted or rejected on
their merits — a task existing here is not a commitment to build it.

| File | Task | Priority |
|------|------|----------|
| 01 | Anchor messages to bottom of scroll area | High |
| 02 | Shorten placeholder, move Shift+Enter hint | High |
| 03 | Icon-only send button (auto-grow already done) | Medium |
| 04 | Empty state: greeting + starter chips | High |
| 05 | Header subtitle / presence indicator | Medium |
| 06 | Message timestamps + agent identity | Medium |
| 07 | Per-message delivery status (failed/retry already done) | Medium |
| 08 | "Scroll to latest" button | Medium |
| 09 | Agent bubble visibility/contrast | Medium |
| 10 | Screen-reader text for typing indicator | Medium |
| 11 | Focus management + Escape to close | Medium |
| 12 | Contrast audit 4.5:1 | Medium |
| 13 | 44px minimum touch targets | Medium |
| 14 | CSS isolation (Shadow DOM or iframe) | High |
| 15 | Mobile full-screen sheet + 100dvh + safe-area | High |
| 16 | Persist conversation, minimize vs end-chat | Medium |
| 17 | Lazy-load bundle + prefers-reduced-motion | Medium |
| 18 | Transcript download (URL + optional built-in) | Low |

## Not a task (already implemented)

- **Theme `light | dark | auto`** — `src/modules/theme.js` already supports
  `data-theme-mode`, `prefers-color-scheme` detection, localStorage
  persistence, `watchSystemTheme`, and per-mode custom color attributes.
- **Input auto-grow** — `setupTextareaAutoResize` in
  `src/modules/chat-widget.class.js` already provides it (1 line, 150px cap).
- **`role="log"` / `aria-live="polite"`** — already on `.messages` in
  `createWidgetDOM`.
- **Failed message + retry** — `addFailedMessageIndicator` and the retry queue
  already exist; task 07 covers only the missing sending/sent states.
- **Focus into input on open, ARIA labels on buttons** — already in place.
