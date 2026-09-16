# Task: CSS isolation via Shadow DOM or iframe

**Source:** docs/proposal.md — Because it's embedded
**Priority:** High
**Status:** Pending

## Context

The widget appends directly to `document.body` and injects a global `<style>`
tag scoped only by the `#${widgetId}` ID selector. Host-page CSS with equal or
higher specificity (or global resets like `* { margin: 0 }` with `!important`,
button/input styles, `font-family` inheritance quirks) can bleed in — the most
common "looks fine on our demo, broken on the customer's site" bug. Host JS can
also accidentally match the widget's generic class names (`.message`, `.input`,
`.close`).

- `src/modules/ui.js` — `injectStyles` (~line 13), `createWidgetDOM` (~line 1354)

## Scope

- Render the widget inside a shadow root (preferred — no iframe plumbing) or an
  iframe. Attach the shadow root to the container and move `injectStyles` and
  all widget DOM inside it.
- Update all `querySelector`/`getElementById` lookups that assume
  `document`-level reach (e.g. `removeWaitingMessage` uses
  `document.getElementById` — won't cross shadow boundary).
- Verify widget sub-components (`WidgetFactory` output, event delegation,
  `widgetInteraction` listeners on `document`) still work across the shadow
  boundary — retarget listeners or use `composed: true` events as needed.
- Keep the scoped style injection working inside the shadow root.

## Acceptance Criteria

- [ ] Widget renders identically inside shadow root in popup and fullpage
- [ ] Host page global CSS no longer affects widget internals
- [ ] All widgets (buttons, forms, file upload, etc.) still dispatch/handle
      interactions correctly
- [ ] Existing Playwright suite updated/passing for the new DOM structure
- [ ] New Playwright test asserting host-page CSS (e.g. a global
      `* { color: red !important }` reset) does not leak into the widget, and
      widget interactions still work inside the shadow root
