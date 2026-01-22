---
path: getting_started.md
page-type: tutorial
summary: Step-by-step guide for setting up and integrating the ChatUI widget.
tags: [tutorial, setup, installation, integration]
created: 2026-01-22
updated: 2026-01-22
version: 1.1.0
---

# Getting Started

This guide helps you integrate the ChatUI widget in minutes. It covers the recommended script-tag setup, programmatic initialization, transport selection, and basic customization.

## Prerequisites

- A web server or hosting environment
- Basic HTML/JavaScript knowledge
- A backend endpoint for the chat API (optional for static demos)

---

## 1) Include the Widget Bundle

Add the built bundle to your page:

```html
<script src="dist/chat-widget.min.js"></script>
```

---

## 2) Auto‑Initialize via Script Tag (Recommended)

ChatUI auto-initializes any script tag whose `id` starts with `chat-widget`.

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-position="bottom-right"
  data-title="Chat with us">
</script>
```

### Display Modes

**Popup (default):**
```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-display="popup"
  data-position="bottom-right">
</script>
```

**Fullpage (embedded):**
```html
<div id="chat-container"></div>

<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-display="fullpage"
  data-target="#chat-container">
</script>
```

---

## 3) Programmatic Initialization

Use the global `ChatUI` API:

```javascript
const chat = ChatUI.init({
  id: "support-chat",
  title: "Support Chat",
  position: "bottom-left",
  color: "#28a745",
  serverUrl: "https://your-server.com"
});

chat.open();
```

---

## Transport Selection

ChatUI selects transport based on `serverUrl` protocol:

- `wss://` or `ws://` → **WebSocket**
- `https://` or `http://` → **CORS (fetch)** with **JSONP fallback** on CORS/network errors

### Examples

**WebSocket:**
```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="wss://your-server.com/ws">
</script>
```

**CORS (default):**
```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com">
</script>
```

---

## Theme Basics

ChatUI supports `default` and `branded` themes, with light/dark modes.

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-theme="default"
  data-theme-mode="dark">
</script>
```

### Custom Colors (Mode-Specific)

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-theme="default"
  data-theme-mode="light"
  data-color-light="#ff6b6b"
  data-bg-color-light="#ffffff"
  data-surface-color-light="#ffe5e5"
  data-text-color-light="#2d2d2d"
  data-border-color-light="#ffcccc">
</script>
```

> `data-theme-mode` is preferred. `data-mode` is supported for legacy compatibility.

---

## Message Formats (Backend Responses)

### Preferred: Composable Widgets

```json
{
  "status": "success",
  "widgets": [
    {
      "type": "card",
      "children": [
        { "type": "text", "props": { "content": "Welcome!", "format": "plain" } },
        {
          "type": "buttons",
          "props": {
            "options": [
              { "id": "start", "text": "Get Started", "value": "start" }
            ]
          }
        }
      ]
    }
  ]
}
```

### Legacy (Still Supported)

```json
{
  "text": "Choose an option",
  "sender": "bot",
  "widget": {
    "type": "buttons",
    "options": [
      { "id": "opt1", "text": "Option 1", "value": "opt1" }
    ]
  }
}
```

---

## Quick Troubleshooting

### Widget Not Appearing
- Ensure the script tag has an `id` (e.g., `chat-widget`)
- Verify the bundle path is correct
- Check the browser console for errors

### Connection Issues
- Verify `data-server-url` is reachable
- Ensure correct protocol (`wss://` for WebSocket, `https://` for CORS)
- If CORS fails, JSONP fallback is attempted automatically

### Theme Not Applying
- Use `data-theme` (`default` or `branded`)
- Use `data-theme-mode` (`light` or `dark`)

---

## Next Steps

- **Configuration**: `docs/livewiki/configuration.md`
- **API Reference**: `docs/livewiki/api_reference.md`
- **Architecture**: `docs/livewiki/architecture.md`
- **Widget System**: `docs/widget-system.md`
