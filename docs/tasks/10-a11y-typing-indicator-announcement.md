# Task: Screen-reader announcement for typing indicator

**Source:** docs/proposal.md — Accessibility
**Priority:** Medium
**Status:** Pending

## Context

The proposal asked for `role="log"` + `aria-live="polite"` on the message list
and a text equivalent for the typing indicator. The list part is **already
done** (`.messages` has `role="log" aria-live="polite" aria-atomic="false"` in
`createWidgetDOM`, ~line 1380). The waiting/typing dots, however, are three
empty `<span>`s with no accessible text.

- `src/modules/chat-widget.class.js` — `addWaitingMessage` (~line 765)
- `src/modules/ui.js` — `.waiting-dots` styles (~line 1200)

## Scope

- Add a visually hidden "Agent is typing" text node inside the waiting message
  element so screen readers announce it via the existing live region.
- Add a `.visually-hidden` / `.sr-only` utility class to the injected styles.
- Mark the animated dots container `aria-hidden="true"` so only the text is announced.

## Pros / Cons

**Pros**
- Tiny change, real a11y win — screen-reader users currently get silence
- Reuses the existing live region; no new ARIA machinery needed

**Cons**
- If the waiting indicator appears/disappears rapidly (retries, flaky
  network), `aria-live` can spam announcements — may need a slight debounce
- The sr-only text is a new translatable string (currently all UI strings
  are hardcoded English anyway)

**AI Recommendation:** **Do it.** A few lines of markup for a real
screen-reader gap. Add a small guard so a flapping indicator doesn't spam the
live region (e.g. only announce on insert, rely on removal being silent).

## Acceptance Criteria

- [ ] Screen reader announces "Agent is typing" when the indicator appears
- [ ] Dots themselves are not announced as gibberish
- [ ] Announcement stops being read repeatedly when the indicator is removed
- [ ] Playwright test added asserting the waiting message exposes "Agent is
      typing" accessible text and dots are `aria-hidden`
