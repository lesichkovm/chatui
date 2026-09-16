# Task: CSS isolation — Shadow DOM, iframe, or hardened ID scoping

**Source:** docs/proposal.md — Because it's embedded
**Priority:** High
**Status:** Pending

## Context

The widget appends directly to `document.body` and injects a global `<style>`
tag scoped by the `#${widgetId}` ID selector. This **ID-based scoping is the
current isolation mechanism** — and it has real strengths worth preserving:

- Embedders can intentionally restyle the widget with their own CSS (often a
  feature, not a bug)
- Host tooling works normally: find-in-page, translation/autofill extensions,
  accessibility tools, Playwright/tests
- Simple code — `document.getElementById`, `querySelector`, and
  `document`-level `widgetInteraction` events all work without plumbing
- The widget is designed as a first-class DOM citizen (script-tag config,
  `ChatUI.init()`)

Its limits: higher-specificity/`!important` host rules win, inherited
properties (`font-family`, `box-sizing`, etc.) leak unless individually reset,
generic class names (`.message`, `.input`, `.close`) can collide with host JS,
and widget CSS can leak *out* into the host document.

- `src/modules/ui.js` — `injectStyles` (~line 13), `createWidgetDOM` (~line 1354)

## Scope

Decide between three options (or ship a configurable choice):

1. **Shadow root** — attach to the container, move `injectStyles` and widget
   DOM inside. Requires: retargeting `document.getElementById` lookups (e.g.
   `removeWaitingMessage`), dispatching `widgetInteraction` as a
   `composed: true` event or moving the listener inside the root, and
   verifying `WidgetFactory` output works across the boundary. CSS custom
   properties still pierce the boundary, so the existing theming API keeps
   working — but arbitrary host overrides stop working (breaking change for
   anyone relying on them).
2. **Iframe** — strongest isolation, but adds cross-frame plumbing for config,
   sizing, and events; probably overkill.
3. **Hardened ID scoping (keep current approach)** — strengthen it instead:
   add a fuller scoped reset inside `#${widgetId}`, rename generic classes to
   a `chatui-` prefix to avoid collisions, and scope keyframes names.

If isolation becomes configurable, add `data-isolation="shadow|id"`
(default decided during implementation) plus `isolation` in `ChatUI.init()`.

**AI Recommendation:** **Hardened ID scoping first, shadow DOM only if
embedders report real breakage.** The current ID approach's weaknesses are
fixable cheaply (fuller reset, `chatui-` prefix, scoped keyframes). Shadow DOM
is the "correct" answer but is a breaking change (kills embedder CSS
overrides) with real plumbing cost — justify it with evidence, not principle.
If unsure, ship option 3 now and keep `data-isolation="shadow"` as a
follow-up experiment.

## Acceptance Criteria

- [ ] Decision documented: shadow / iframe / hardened ID scoping (or
      configurable `data-isolation`)
- [ ] If shadow: host-page CSS no longer affects internals; all widgets,
      event delegation, and `widgetInteraction` still work; theming via CSS
      variables unaffected; existing suite updated/passing
- [ ] If hardened ID: scoped reset covers inherited properties, classes
      renamed to `chatui-` prefix, keyframes scoped
- [ ] Playwright test asserting host CSS (e.g. `* { color: red !important }`)
      does not leak into the widget (for the chosen isolation level)
