# Task: Shorten input placeholder and move the Shift+Enter hint

**Source:** docs/proposal.md — Layout
**Priority:** High
**Status:** Pending

## Context

The textarea placeholder is `"Type your message... (Shift+Enter for new line)"`,
which wraps to two lines and inflates the input box.

- `src/modules/ui.js` — `createWidgetDOM` textarea markup (~line 1382)
- `src/modules/chat-widget.class.js` — config parsing from `data-*` attributes
  (~lines 36–50)

## Scope

- Change the default placeholder to `"Type your message…"`.
- Make the placeholder configurable via a `data-placeholder` attribute and a
  matching `placeholder` key in the programmatic `ChatUI.init({...})` config —
  consistent with how `data-title`, `data-position` etc. are already parsed.
- Move the `Shift+Enter for new line` hint to small helper text under the
  input, or reveal it only when the input is focused. Optionally allow the
  hint text to be overridden/hidden via `data-input-hint` (empty string hides
  it entirely).
- Ensure the helper text does not permanently grow the input area; prefer
  showing on focus or as a subtle one-line caption.

## Pros / Cons

**Pros**
- Compact single-line input; the widget stops looking inflated
- Configurable placeholder is a consistent, cheap embedder win
- Helper text pattern is reusable for future input hints

**Cons**
- Focus-only hint = lower discoverability for the Shift+Enter shortcut
- Persistent helper text costs vertical space — the trade-off between
  discoverability and compactness needs a decision
- More `data-*` surface area to maintain

**AI Recommendation:** **Do it.** Cheap, safe, and the placeholder wrap is a
visible defect. Reveal the hint on focus (not persistent) to keep the input
area compact. Adding `data-placeholder` costs almost nothing and matches the
project's config style.

## Acceptance Criteria

- [ ] Default placeholder fits on one line at the default 350px widget width
- [ ] `data-placeholder="..."` (or `placeholder` config) overrides the default
- [ ] Shift+Enter hint is discoverable but no longer inside the placeholder
- [ ] Hint text meets 4.5:1 contrast against `--chat-bg` (see task 12)
- [ ] New attributes documented alongside existing `data-*` options
- [ ] Playwright test added/updated asserting the default placeholder,
      `data-placeholder` override, and hint behavior (e.g. in
      `tests/chat-widget-input-integration.spec.ts`)
