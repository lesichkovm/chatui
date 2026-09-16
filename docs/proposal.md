Looking at the screenshot, the biggest issue is that huge empty void in the middle. A few things I'd change, roughly in priority order.

Layout

Anchor messages to the bottom of the scroll area (justify-content: flex-end on the message container, or flex-direction: column-reverse). Right now the conversation starts at the top and leaves ~600px of dead space, which reads as broken.
Shorten the placeholder to "Type your message…". It's wrapping to two lines and inflating the input box. Put the Shift+Enter hint as small helper text under the input, or only reveal it on focus.
Give the input auto-grow behavior (1 line by default, capped at ~5), and consider an icon-only send button to reclaim horizontal room.

Empty state

Open with a greeting bubble from the agent plus 2–4 tappable starter chips ("Track my order", "Talk to a human"). An empty chat panel gives people nothing to act on, and starter prompts measurably lift engagement.
Add a header subtitle like "Typically replies in a few minutes" or an online/offline dot so expectations are set.

Message affordances that are missing

Timestamps (or at least on hover / on day breaks), and an avatar or name label on agent messages.
Delivery states: sending, sent, failed with a retry tap. Network failures on embedded widgets are common and silent failure is the worst outcome.
A "scroll to latest" button when the user has scrolled up and a new message arrives.
Agent bubbles are currently barely distinguishable from the panel background. Lift them a step in luminance or add a subtle border.

Accessibility

The message list needs role="log" and aria-live="polite" so screen readers announce replies; the typing indicator needs a visually hidden "Agent is typing".
aria-label on the X button, focus moved into the input when the widget opens, focus returned to the launcher when it closes, Escape to close.
Check the placeholder and any gray secondary text against 4.5:1. The gray on near-black in the shot looks borderline.
Touch targets at 44px minimum; the X looks smaller than that.

Because it's embedded

Render inside an iframe (or a shadow root) so the host page's CSS can't bleed in. This is the single most common source of "it looks fine on our demo, broken on the customer's site" bugs.
Below ~640px wide, go full-screen sheet rather than a floating card, use 100dvh rather than 100vh so the mobile keyboard doesn't crop the input, and respect env(safe-area-inset-bottom).
Persist the thread in sessionStorage/localStorage so navigating to another page on the site doesn't wipe the conversation, and distinguish minimize from end-chat.
Lazy-load the widget bundle after page interactive, and honor prefers-reduced-motion for the open/close animation.

One judgment call

The widget is dark on what looks like a light host page. If this ships to many sites, expose a theme: light | dark | auto config rather than hardcoding dark, since a dark panel on a light brand site tends to look like a third-party bolt-on.