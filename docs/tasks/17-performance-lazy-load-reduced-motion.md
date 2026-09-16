# Task: Lazy-load widget and honor prefers-reduced-motion

**Source:** docs/proposal.md — Because it's embedded
**Priority:** Medium
**Status:** Pending

## Context

The bundle is a monolithic IIFE (`scripts/build.js`, esbuild `format: 'iife'`)
that auto-initializes on `DOMContentLoaded` plus a MutationObserver — every
visitor pays the full parse cost up front. Animations (waiting dots, hover
transforms, slide-in error) have no `prefers-reduced-motion` handling.

- `src/entry.js` — auto-init + MutationObserver
- `scripts/build.js` — single-bundle build
- `src/modules/ui.js` — `waitingDotPulse` keyframes, transitions

## Scope

- Ship a tiny loader stub that registers the launcher/init logic and loads the
  full bundle after page interactive (e.g. `requestIdleCallback` / `load` event
  / first user interaction), or split the bundle so the heavy widget code is
  fetched on demand.
- Keep the `ChatUI.init()` and `data-` attribute auto-init APIs working
  unchanged for embedders.
- Wrap animations/transitions in
  `@media (prefers-reduced-motion: no-preference)` or add a reduced-motion
  override block.

## Pros / Cons

**Pros**
- Host pages stop paying full parse/init cost for users who never open chat
- `prefers-reduced-motion` is a one-line-each CSS guard — cheap a11y win
- Improves host-site Lighthouse/Core Web Vitals, which embedders care about

**Cons**
- A loader stub + split bundle adds build and init complexity — two artifacts
  to version, cache-bust, and keep API-compatible
- First open has a load delay; may need a loading state on the launcher
- The MutationObserver/auto-init timing must be reproduced inside the loader
  (script tags added before the bundle loads)
- Easier to get subtly wrong than it looks; the win is small if the bundle
  is already tiny

**AI Recommendation:** **Split it.** Do the `prefers-reduced-motion` part —
it's ~10 lines of CSS. Defer lazy-loading: the bundle is small, the IIFE is
already cheap to parse, and a loader stub adds real complexity for a gain
that should be measured first. Revisit if the bundle grows significantly.

## Acceptance Criteria

- [ ] Initial page load fetches only the loader; full bundle loads deferred
- [ ] Widget still auto-initializes correctly from script-tag config
- [ ] All animations disabled/reduced under `prefers-reduced-motion`
- [ ] Build still produces dist + netlify/dist artifacts
- [ ] Playwright test added covering deferred loading (widget works when
      bundle loads after interactive) and reduced-motion behavior via
      emulated `prefers-reduced-motion` media feature
