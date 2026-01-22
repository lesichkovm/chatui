# ChatUI Widget

![Tests](https://github.com/lesichkovm/chatui/workflows/Tests/badge.svg)

A professional, ultra-lightweight, API-agnostic chat UI widget built with **pure Vanilla JavaScript**. No framework lock‑in, no external dependencies, and a transport layer that works over **WebSocket**, **CORS (fetch)**, and **JSONP fallback**.

---

## Quick Links

- **Website**: https://chatui.lesichkov.co.uk/
- **Build Output**: `dist/chat-widget.js`, `dist/chat-widget.min.js`
- **Source**: `src/`

---

## Highlights

- **Pure Vanilla JS** (no React/Vue/jQuery)
- **Composable Widget System** (nested widget trees, forms, cards, lists)
- **Hybrid Transport** (WebSocket → CORS → JSONP fallback)
- **Popup + Fullpage** display modes
- **Theme System** with light/dark + CSS variables
- **Security & Sanitization** for widget data and message rendering
- **Programmatic API** for lifecycle and theme control

---

## Installation

### 1) Include the bundle

```html
<script src="dist/chat-widget.min.js"></script>
```

### 2) Auto‑initialize via script tag

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-position="bottom-right"
  data-title="Chat with us">
</script>
```

### 3) Programmatic initialization

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

## Configuration

### HTML Data Attributes

| Attribute | Description | Default |
|---|---|---|
| `data-server-url` | Base URL for the backend API | `http://localhost:3000` |
| `data-display` | `popup` or `fullpage` | `popup` |
| `data-position` | `bottom-right`, `bottom-left`, `top-right`, `top-left` | `bottom-right` |
| `data-title` | Header title | `Chat with us` |
| `data-color` | Primary color (legacy/light mode) | `#007bff` |
| `data-target` | Container selector for fullpage mode | `null` |
| `data-theme` | Theme name: `default` or `branded` | `default` |
| `data-mode` | Theme mode (legacy): `light` or `dark` | `light` |
| `data-theme-mode` | Theme mode (preferred) | `light` |

### JavaScript Options

| Option | Description | Default |
|---|---|---|
| `id` | Widget ID | auto‑generated |
| `displayMode` | `popup` or `fullpage` | `popup` |
| `position` | Corner position | `bottom-right` |
| `primaryColor` / `color` | Primary color | Theme primary |
| `title` | Header title | `Chat with us` |
| `targetSelector` / `target` | Container selector (fullpage) | `null` |
| `serverUrl` | Backend URL | `http://localhost:3000` |

> **Note:** `data-prefer-jsonp` and `data-force-jsonp` are parsed but not currently passed through the widget config. JSONP is still used automatically when CORS fails.

---

## Theme System

ChatUI supports **Light/Dark** modes with **Default** and **Branded** themes, plus optional per‑mode overrides.

### Basic usage

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-theme="default"
  data-theme-mode="dark">
</script>
```

### Custom colors (mode-specific)

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

### CSS variable override

```css
#chat-widget {
  --chat-primary: #0d6efd;
  --chat-bg: #ffffff;
  --chat-surface: #f8f9fa;
  --chat-text: #212529;
  --chat-border: #e9ecef;
}
```

### Theme API

```javascript
const widget = ChatUI.init({ serverUrl: "https://your-server.com" });

widget.setTheme("branded");
widget.setThemeMode("dark");
widget.toggleThemeMode();
const themeConfig = widget.getThemeConfig();
```

---

## Transport & Protocols

ChatUI chooses transport based on `serverUrl`:

- `wss://` or `ws://` → **WebSocket**
- `https://` or `http://` → **CORS (fetch)** with **JSONP fallback**

### CORS Endpoints

**Handshake**

`POST /api/handshake`  
Body: `{ "type": "handshake", "timestamp": 1234567890 }`  
Response: `{ "status": "success", "session_key": "..." }`

**Connect**

`POST /api/messages`  
Body: `{ "type": "connect", "session_key": "...", "timestamp": 1234567890 }`

**Send Message**

`POST /api/messages`  
Body: `{ "type": "message", "message": "Hello", "session_key": "...", "timestamp": 1234567890 }`

### JSONP (Legacy Fallback)

**Handshake**

`GET /api/handshake?callback=cb`  
Response: `cb({ status: "success", session_key: "..." })`

**Message**

`GET /api/messages?callback=cb&message=...&session_key=...`

### WebSocket

**Client → Server**

```json
{
  "type": "handshake|connect|message|typing|read_receipt",
  "payload": "...",
  "session_key": "...",
  "timestamp": 1234567890
}
```

**Server → Client**

```json
{
  "type": "handshake|message|message:stream|typing|read_receipt",
  "text": "...",
  "widgets": [ ... ],
  "session_key": "...",
  "timestamp": 1234567890
}
```

---

## Message Formats

ChatUI supports both **legacy** and **composable** message formats:

### Legacy

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

### Composable Widgets (Preferred)

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

---

## Widget System

ChatUI ships a composable widget system with recursive rendering.

### Core types

- **Content/Layout**: `text`, `container`, `card`, `row`, `column`
- **Actions**: `button`, `buttons`, `confirmation`
- **Inputs**: `input`, `password`, `textarea`
- **Selection**: `select`, `radio`, `checkbox`, `toggle`
- **Interactive**: `rating`, `slider`, `date`, `tags`, `color_picker`
- **Data**: `file_upload`, `progress`, `list`, `conditional`, `form`

> `image` and `icon` types exist as placeholders and map to container behavior.

### Widget interaction events

Listen for widget submissions:

```javascript
document.addEventListener("widgetInteraction", (event) => {
  console.log("Widget interaction:", event.detail);
});
```

### Form widget

Use a `form` container to collect values and submit them through a button:

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    { "type": "input", "props": { "placeholder": "Your name" } },
    { "type": "input", "props": { "placeholder": "Your email" } },
    {
      "type": "buttons",
      "props": { "options": [{ "id": "submit", "text": "Submit" }] }
    }
  ]
}
```

---

## Events

ChatUI emits a few global events:

- **Errors**: `chatwidget:error`
- **WebSocket typing**: `chatwidget:typing`
- **WebSocket read receipts**: `chatwidget:read_receipt`

```javascript
window.addEventListener("chatwidget:error", (event) => {
  console.log("ChatUI error:", event.detail);
});
```

---

## Development

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

### Demo

```bash
npm run start:demo
# Then open demo/demo.html
```

---

## Architecture Overview

- `src/entry.js` → global API + auto‑init
- `src/modules/chat-widget.class.js` → main orchestrator
- `src/modules/api.js` → hybrid transport (WS/CORS/JSONP)
- `src/modules/ui.js` → DOM rendering + styles
- `src/modules/theme.js` → theme system
- `src/modules/widgets/` → composable widgets

---

## Security Notes

- Input sanitization and widget data validation are built in.
- JSONP callbacks are randomized and validated.
- CORS requests use `Content-Type: application/json`.

---

## License

MIT (or project-specific license if you have one).
