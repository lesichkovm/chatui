---
path: configuration.md
page-type: reference
summary: Configuration reference for the ChatUI widget (supported options only).
tags: [configuration, options, customization, settings]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# Configuration

This reference lists **only the options currently supported by the runtime**. Options not listed here should be treated as unsupported or reserved.

---

## Configuration Methods

### 1) HTML Data Attributes (Recommended)

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-position="bottom-right"
  data-title="Chat with us">
</script>
```

### 2) JavaScript Initialization

```javascript
const chat = ChatUI.init({
  id: "support-chat",
  title: "Support Chat",
  position: "bottom-left",
  color: "#28a745",
  serverUrl: "https://your-server.com"
});
```

---

## Supported Options

### Required

| HTML Attribute | JS Option | Type | Default | Description |
|---|---|---|---|---|
| `data-server-url` | `serverUrl` | string | `http://localhost:3000` | Backend base URL. Protocol determines transport. |

### Display & Placement

| HTML Attribute | JS Option | Type | Default | Description |
|---|---|---|---|---|
| `data-display` | `displayMode` | string | `popup` | `popup` or `fullpage`. |
| `data-position` | `position` | string | `bottom-right` | Corner position for popup mode. |
| `data-target` | `targetSelector` / `target` | string | `null` | Container selector for fullpage mode. |
| `data-title` | `title` | string | `Chat with us` | Header title text. |

### Theme & Colors

| HTML Attribute | JS Option | Type | Default | Description |
|---|---|---|---|---|
| `data-theme` | (theme manager) | string | `default` | Theme name: `default` or `branded`. |
| `data-theme-mode` | `themeMode` | string | `light` | Preferred mode attribute (`light` or `dark`). |
| `data-mode` | `themeMode` (legacy) | string | `light` | Legacy mode attribute (fallback). |
| `data-color` | `primaryColor` / `color` | string | theme primary | Legacy primary color override (mode fallback). |

#### Mode-Specific Color Overrides

The theme manager and widget apply CSS variables from these attributes (preferred):

| Attribute | Maps To |
|---|---|
| `data-color-light` / `data-color-dark` | `--chat-primary` |
| `data-bg-color-light` / `data-bg-color-dark` | `--chat-bg` |
| `data-surface-color-light` / `data-surface-color-dark` | `--chat-surface` |
| `data-text-color-light` / `data-text-color-dark` | `--chat-text` |
| `data-border-color-light` / `data-border-color-dark` | `--chat-border` |

> Legacy fallbacks without `-light`/`-dark` are still supported:
> `data-color`, `data-bg-color`, `data-surface-color`, `data-text-color`, `data-border-color`.

### Transport Notes

ChatUI selects transport from `serverUrl`:

- `wss://` or `ws://` → WebSocket
- `https://` or `http://` → CORS (fetch) with JSONP fallback

---

## Programmatic API Options (Supported)

| Option | Type | Default | Description |
|---|---|---|---|
| `id` | string | auto-generated | Widget ID. |
| `displayMode` | string | `popup` | `popup` or `fullpage`. |
| `position` | string | `bottom-right` | Corner position for popup. |
| `primaryColor` / `color` | string | theme primary | Primary color override. |
| `title` | string | `Chat with us` | Header title text. |
| `targetSelector` / `target` | string | `null` | Container selector for fullpage mode. |
| `serverUrl` | string | `http://localhost:3000` | Backend URL for transport selection. |

---

## Reserved / Not Yet Wired

The following attributes are parsed but **not currently forwarded** to the transport layer:

- `data-prefer-jsonp`
- `data-force-jsonp`

They are reserved for future wiring and should not be relied on today.

---

## Examples

### Fullpage Embed

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

### Branded Dark Theme

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-theme="branded"
  data-theme-mode="dark">
</script>
```

### Mode-Specific Color Overrides

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

---

## Notes & Best Practices

- Always set `data-server-url` or `serverUrl`.
- Prefer `data-theme-mode` over `data-mode`.
- Use mode-specific color overrides for light/dark customization.
- For fullpage mode, ensure `data-target` exists.

---

## See Also

- `docs/livewiki/getting_started.md`
- `docs/livewiki/api_reference.md`
- `docs/theme-system.md`
- `docs/backend-integration-guide.md`
