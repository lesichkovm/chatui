---
path: api_reference.md
page-type: reference
summary: API reference for ChatUI with supported configuration options, methods, and events.
tags: [api, reference, methods, events, configuration]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# API Reference

This document lists **only the methods and events currently supported by the runtime**. Any API surface not listed here should be considered unsupported or reserved.

---

## Initialization

### `ChatUI.init(config)`
Create and initialize a new widget instance.

```javascript
const chat = ChatUI.init({
  id: "support-chat",
  title: "Support Chat",
  position: "bottom-left",
  color: "#28a745",
  serverUrl: "https://your-server.com"
});
```

**Returns:** `ChatWidget` instance.

---

### `window.createChatWidget(scriptElement)` (Legacy)
Initialize a widget from a script element.

```javascript
const script = document.getElementById("chat-widget");
const widget = window.createChatWidget(script);
```

---

## Supported Configuration Options

### Required
| Option | Type | Default | Description |
|---|---|---|---|
| `serverUrl` | string | `http://localhost:3000` | Backend URL. Protocol determines transport. |

### Display & Placement
| Option | Type | Default | Description |
|---|---|---|---|
| `id` | string | auto-generated | Widget ID. |
| `displayMode` | string | `popup` | `popup` or `fullpage`. |
| `position` | string | `bottom-right` | Corner position for popup mode. |
| `title` | string | `Chat with us` | Header title text. |
| `targetSelector` / `target` | string | `null` | Container selector for fullpage mode. |

### Theme & Colors
| Option | Type | Default | Description |
|---|---|---|---|
| `primaryColor` / `color` | string | theme primary | Primary color override (legacy/light fallback). |
| `themeMode` | string | `light` | Mode override for theme (`light` / `dark`). |

> Theme selection via `data-theme` and mode via `data-theme-mode` are handled by the theme manager when using script tags.

---

## Instance Methods (Supported)

### `open()`
Open the widget.

```javascript
chat.open();
```

### `close()`
Close the widget.

```javascript
chat.close();
```

### `toggle()`
Toggle the widget open/closed.

```javascript
chat.toggle();
```

### `sendMessage(text)`
Send a message to the backend.

```javascript
chat.sendMessage("Hello from the API!");
```

### `addMessage(text, sender, widgetData?)`
Add a message locally without sending to the server.

```javascript
chat.addMessage("Welcome!", "bot");
```

### `setTheme(theme)`
Set the theme: `"default"` or `"branded"`.

```javascript
chat.setTheme("branded");
```

### `setThemeMode(mode)`
Set mode: `"light"` or `"dark"`.

```javascript
chat.setThemeMode("dark");
```

### `toggleThemeMode()`
Toggle between light/dark modes.

```javascript
chat.toggleThemeMode();
```

### `getThemeConfig()`
Get current theme configuration.

```javascript
const themeConfig = chat.getThemeConfig();
```

### `sendTypingIndicator(isTyping)`
Send typing indicator over WebSocket (no-op for non-WS transport).

```javascript
chat.sendTypingIndicator(true);
```

### `destroy()`
Destroy the widget instance and clean up resources.

```javascript
chat.destroy();
```

### `ws` (getter)
Access the underlying WebSocket connection (if any).

```javascript
const socket = chat.ws;
```

---

## Events (Supported)

### `chatwidget:error`
Emitted when the widget surfaces an error message.

```javascript
window.addEventListener("chatwidget:error", (event) => {
  console.log(event.detail);
});
```

### `chatwidget:typing`
Emitted when a typing indicator is received (WebSocket).

```javascript
window.addEventListener("chatwidget:typing", (event) => {
  console.log(event.detail.typing);
});
```

### `chatwidget:read_receipt`
Emitted when a read receipt is received (WebSocket).

```javascript
window.addEventListener("chatwidget:read_receipt", (event) => {
  console.log(event.detail.message_id);
});
```

### `widgetInteraction`
Emitted when a user interacts with a widget.

```javascript
document.addEventListener("widgetInteraction", (event) => {
  console.log(event.detail);
});
```

**Example payload (buttons):**
```json
{
  "widgetId": "chat-widget-xyz",
  "optionId": "start",
  "optionValue": "start",
  "optionText": "Get Started",
  "widgetType": "buttons"
}
```

### `widgetValueChanged`
Emitted when a widget value changes (used by forms).

```javascript
document.addEventListener("widgetValueChanged", (event) => {
  console.log(event.detail);
});
```

---

## Notes

- Transport selection is automatic based on `serverUrl` protocol.
- JSONP fallback is automatic when CORS fails.
- Legacy message formats (`text` + `widget`) are supported for backward compatibility.

---

## See Also

- `docs/livewiki/configuration.md`
- `docs/backend-integration-guide.md`
- `docs/widget-system.md`
