---
path: theme-system.md
page-type: reference
summary: Theme system reference for ChatUI (data attributes, CSS variables, and API).
tags: [theme, theming, customization, css-variables, modes]
created: 2026-01-22
updated: 2026-01-22
version: 1.1.0
---

# Theme System

ChatUI uses a **data-attributes-first** theme system backed by CSS variables. You can control theme selection, light/dark modes, and color overrides without writing custom CSS (though CSS overrides are supported).

## What’s Supported

- **Themes**: `default`, `branded`
- **Modes**: `light`, `dark`
- **Custom color overrides** (mode-specific)
- **Runtime switching** via API
- **Persistence** in `localStorage`
- **System preference** (`prefers-color-scheme`) integration

---

## Quick Start

```html
<script
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-theme="default"
  data-theme-mode="light"
  data-title="Chat with us">
</script>
```

> `data-theme-mode` is the preferred attribute for mode.  
> `data-mode` is still supported for legacy compatibility.

---

## Themes

### Default Theme
**Light**
- Primary: `#007bff`
- Background: `#ffffff`
- Surface: `#f8f9fa`
- Text: `#212529`
- Border: `#e9ecef`

**Dark**
- Primary: `#4dabf7`
- Background: `#1a1a1a`
- Surface: `#2d2d2d`
- Text: `#ffffff`
- Border: `#404040`

### Branded Theme
**Light**
- Primary: `#6366f1`
- Background: `#ffffff`
- Surface: `#f5f3ff`
- Text: `#1e1b4b`
- Border: `#e0e7ff`

**Dark**
- Primary: `#818cf8`
- Background: `#0f172a`
- Surface: `#1e293b`
- Text: `#f1f5f9`
- Border: `#334155`

---

## Data Attributes

### Theme Selection

| Attribute | Description | Default |
|---|---|---|
| `data-theme` | Theme name: `default` or `branded` | `default` |
| `data-theme-mode` | Theme mode: `light` or `dark` | `light` |
| `data-mode` | Legacy mode attribute (fallback) | `light` |

### Mode-Specific Color Overrides

Set overrides per mode using `-light` or `-dark` suffixes:

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

### Available Override Attributes

| Attribute | Applies To | Description |
|---|---|---|
| `data-color-light` / `data-color-dark` | `--chat-primary` | Primary color |
| `data-bg-color-light` / `data-bg-color-dark` | `--chat-bg` | Background color |
| `data-surface-color-light` / `data-surface-color-dark` | `--chat-surface` | Card/surface color |
| `data-text-color-light` / `data-text-color-dark` | `--chat-text` | Text color |
| `data-border-color-light` / `data-border-color-dark` | `--chat-border` | Border color |

### Legacy Color Attributes

The following are still supported as **fallbacks** (no mode suffix):

- `data-color`
- `data-bg-color`
- `data-surface-color`
- `data-text-color`
- `data-border-color`

These apply only if mode-specific overrides are not set.

---

## Programmatic API

```javascript
const widget = ChatUI.init({
  serverUrl: "https://your-server.com"
});

// Theme selection
widget.setTheme("branded");

// Mode control
widget.setThemeMode("dark");
widget.toggleThemeMode();

// Inspect current theme configuration
const themeConfig = widget.getThemeConfig();
console.log(themeConfig);
```

`getThemeConfig()` returns:

```json
{
  "theme": "default",
  "mode": "dark",
  "colors": {
    "primary": "#4dabf7",
    "bg": "#1a1a1a",
    "surface": "#2d2d2d",
    "text": "#ffffff",
    "border": "#404040"
  }
}
```

---

## CSS Variable Overrides

You can override the theme using CSS variables:

```css
#chat-widget {
  --chat-primary: #0d6efd;
  --chat-bg: #ffffff;
  --chat-surface: #f8f9fa;
  --chat-text: #212529;
  --chat-border: #e9ecef;
}
```

These variables are scoped per widget ID.

---

## Persistence & System Mode

- Theme and mode are saved to `localStorage` per widget ID:
  - `chat-widget-{widgetId}-theme`
  - `chat-widget-{widgetId}-mode`
- If no explicit mode is set, the widget respects `prefers-color-scheme`.

---

## Migration Notes

### Legacy `data-color`
`data-color` still works, but only applies to the **primary color** in the current mode. Prefer mode-specific overrides:

```html
<script data-color-light="#007bff" data-color-dark="#4dabf7"></script>
```

---

## Troubleshooting

### Theme not applying
- Ensure the script tag has an `id`.
- Verify `data-theme` is `default` or `branded`.
- Confirm `data-theme-mode` is `light` or `dark`.

### Custom colors not working
- Use correct attribute names and suffixes.
- Ensure colors are valid hex values.

---

## See Also

- `docs/overview.md`
- `docs/widget-system.md`
- `docs/backend-integration-guide.md`
