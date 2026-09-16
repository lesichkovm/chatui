# Task: Per-message delivery status (sending / sent)

**Source:** docs/proposal.md — Message affordances
**Priority:** Medium
**Status:** Pending

## Context

Failure handling is already implemented: `addFailedMessageIndicator` renders a
"Failed to send" row with a Retry button, and `queueMessageForRetry` /
`processMessageQueue` provide automatic retries with backoff. What is missing
is per-message status on the user's own bubbles — a message currently appears
instantly as if delivered, with no "sending…" or "sent" state.

- `src/modules/chat-widget.class.js` — `sendMessage` (~line 426),
  `addFailedMessageIndicator` (~line 635)

## Scope

- Render user messages immediately with a "sending" indicator (e.g. clock icon
  or dimmed state) when they are appended.
- Transition to "sent" when `api.sendMessage` succeeds.
- On failure, attach the failed state to the message bubble itself (with the
  existing retry affordance) instead of/in addition to the separate indicator row.
- Keep the existing auto-retry queue; make its state visible on the bubble.

## Pros / Cons

**Pros**
- Honest feedback — users know their message is in flight, not lost
- Builds on the already-implemented failure/retry machinery
- Silent failure is the worst outcome on embedded widgets; this removes it

**Cons**
- "Sent" is approximate: over the JSONP/HTTP fallback it means "server
  responded", not "agent received" — the semantics must be chosen carefully
  to avoid overpromising
- Status icons add per-message UI state to manage and keep synchronized with
  the retry queue
- Small perpetual animation/tick elements add DOM noise to the live region

**AI Recommendation:** **Do it.** The retry/failure machinery is already built;
surfacing per-message state is incremental work that eliminates silent
failure — the worst UX outcome here. Keep semantics honest: label it
"Sending…" then remove the indicator on ack rather than claiming "Delivered".

## Acceptance Criteria

- [ ] User message shows pending state until the server acknowledges it
- [ ] Failed messages are clearly marked on the bubble and can be retried in place
- [ ] No duplicate "failed" rows when the queue retries automatically
- [ ] Playwright test added covering pending → sent transition and failed
      state with in-place retry (mock network failure)
