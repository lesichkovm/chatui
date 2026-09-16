# Task: Anchor messages to the bottom of the scroll area

**Source:** docs/proposal.md — Layout
**Priority:** High
**Status:** Pending

## Context

The `.messages` container is `display: flex; flex-direction: column` with no
bottom anchoring, so a short conversation starts at the top and leaves a large
empty area below, which reads as broken.

- `src/modules/ui.js` — `.messages` rule (~line 164)
- `src/modules/chat-widget.class.js` — config parsing from `data-*` attributes
  (~lines 36–50)

## Scope

Anchor the message flow to the bottom of the scroll area **by default**, and
expose the behavior as a configuration option so embedders can opt back into
top anchoring:

- Add a `data-message-anchor` attribute (values: `bottom` | `top`,
  default: `bottom`) plus matching `messageAnchor` key in the programmatic
  `ChatUI.init({...})` config, consistent with how `data-position`,
  `data-theme-mode` etc. are already parsed.
- Implement bottom anchoring with either:
  - `justify-content: flex-end` on `.messages` plus a spacer/`margin-top: auto`
    on the first message so scrolling still works when content overflows, or
  - `flex-direction: column-reverse` with matching DOM order.
- For `top` anchor, keep the current layout.

Whichever approach is chosen must preserve correct scrolling when messages
exceed the container height and keep the existing auto-scroll-to-latest
behavior in `appendMessage` and `addWaitingMessage` working.

## Pros / Cons

**Pros**
- Fixes the "looks broken" empty void — the single highest-impact visual issue
- Matches every mainstream chat product (iMessage, Intercom, WhatsApp)
- `data-message-anchor` keeps embedders in control

**Cons**
- `flex-direction: column-reverse` inverts DOM order vs. visual order, which
  can confuse screen readers and keyboard scrolling — `justify-content`/
  `margin-top: auto` avoids this but is a subtler fix
- Small risk of regressions in the existing force-scroll behavior
- Yet another config option to document and support

**AI Recommendation:** **Do it.** Highest-impact fix in the list for the least
effort — the empty-void look is a genuine defect, not a taste issue. Implement
with `margin-top: auto` on the first child (avoids the column-reverse a11y
trap), default `bottom`, ship the `data-message-anchor` opt-out.

## Acceptance Criteria

- [ ] With few messages, they sit at the bottom of the message area by default
- [ ] `data-message-anchor="top"` (or `messageAnchor: 'top'`) restores the old
      top-aligned layout
- [ ] With many messages, the container scrolls normally and starts scrolled
      to the latest
- [ ] Waiting/typing indicator still appears at the bottom
- [ ] Works in both `popup` and `fullpage` display modes
- [ ] New attribute documented alongside existing `data-*` options
- [ ] Playwright tests added in `tests/` covering bottom-anchored layout,
      `data-message-anchor="top"` opt-out, and scroll behavior on overflow
