---
path: README.md
page-type: overview
summary: Default entry point for LiveWiki documentation, aligned with the current ChatUI runtime.
tags: [overview, introduction, entry-point]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# ChatUI Widget Overview

ChatUI is a professional, ultra-lightweight chat UI widget built with **pure Vanilla JavaScript**. It’s frontend-only, framework agnostic, and designed to be “live in 30 seconds” with minimal integration effort.

## Key Features

- **Zero dependencies**: No React/Vue/jQuery required.
- **Composable widget system**: Nested widget trees for cards, forms, lists, and conditionals.
- **Hybrid transport**: WebSocket for real-time, HTTP CORS with JSONP fallback when needed.
- **Dual modes**: Popup and fullpage embedding.
- **Theme system**: Default/Branded themes, Light/Dark modes, CSS variable overrides.
- **Security & sanitization**: Widget data sanitization and safe message rendering.

## Transport Selection

ChatUI selects the transport based on the `serverUrl` protocol:

- `wss://` or `ws://` → **WebSocket**
- `https://` or `http://` → **CORS (fetch)** with **JSONP fallback**

## Widget Schema (Composable)

Widgets are defined as a tree where each widget can optionally have `children`.

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    { "type": "text", "props": { "content": "Welcome!", "format": "plain" } },
    {
      "type": "buttons",
      "props": { "options": [{ "id": "start", "text": "Get Started", "value": "start" }] }
    }
  ]
}
```

## Message Formats

### Preferred (Composable)

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
          "props": { "options": [{ "id": "start", "text": "Get Started", "value": "start" }] }
        }
      ]
    }
  ]
}
```

### Legacy (Supported)

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

## Supported Widget Types

### Content & Layout
- `text`, `container`, `card`, `row`, `column`
- `image`, `icon` (placeholders mapped to container behavior)

### Actions
- `button`, `buttons`, `confirmation`

### Inputs
- `input`, `password`, `textarea`

### Selection
- `select`, `radio`, `checkbox`, `toggle`

### Interactive
- `rating`, `slider`, `date`, `tags`, `color_picker`

### Data & Advanced
- `file_upload`, `progress`, `list`, `conditional`, `form`

## Architecture Summary

- **Entry**: `src/entry.js` auto-initializes and exposes `ChatUI.init()`.
- **Core**: `src/modules/chat-widget.class.js` orchestrates lifecycle and state.
- **API**: `src/modules/api.js` selects WebSocket/CORS/JSONP.
- **UI**: `src/modules/ui.js` renders DOM and injects scoped styles.
- **Theme**: `src/modules/theme.js` manages theme/mode and CSS variables.
- **Widgets**: `src/modules/widgets/` provides composable widget classes.

## See Also

- `docs/livewiki/getting_started.md`
- `docs/livewiki/configuration.md`
- `docs/livewiki/api_reference.md`
- `docs/livewiki/data_flow.md`
- `docs/widget-system.md`

---

**Version**: 2.0.0  
**Last Updated**: 2026-01-22  
**License**: MIT  
**Repository**: https://github.com/lesichkovm/chatui