---
path: overview.md
page-type: overview
summary: High-level introduction and architectural overview of the ChatUI widget system.
tags: [overview, introduction, architecture, widgets]
created: 2026-01-22
updated: 2026-01-22
version: 1.5.0
---

# ChatUI Project Overview

ChatUI is a professional, ultra-lightweight, **frontend-only** chat widget built with **pure Vanilla JavaScript**. It provides a modern conversational UI without framework dependencies, and supports multiple transport protocols with automatic fallback.

## Strategic Position

ChatUI delivers interactive chat capabilities with minimal performance overhead, designed to be “live in 30 seconds” while remaining extensible for enterprise requirements.

## Key Features

- **Zero dependencies**: No React/Vue/jQuery required.
- **Composable widget system**: Nested widget trees with containers, cards, forms, lists, and conditionals.
- **Hybrid transport**: WebSocket (`ws/wss`) with HTTP fallback via CORS and JSONP.
- **Dual display modes**: `popup` or `fullpage`.
- **Theme system**: Light/Dark modes, Default/Branded themes, CSS variable overrides.
- **Security & sanitization**: Widget data sanitization and safe message rendering.
- **Programmatic API**: `ChatUI.init()` plus theme controls and lifecycle management.

## Target Markets

- **SMBs**: Professional chat with minimal dev overhead.
- **Enterprise legacy systems**: Modern UI without framework migration.
- **SaaS platforms**: White-label frontend for proprietary backends.

## Architecture Overview

```mermaid
graph TB
    A[ChatUI Widget] --> B[Entry Point]
    A --> C[Core Modules]
    A --> D[Widget System]
    
    B --> E[Auto-Initialization]
    B --> F[Programmatic API]
    
    C --> G[ChatWidget Class]
    C --> H[API Layer]
    C --> I[UI Layer]
    C --> J[Theme System]
    
    H --> K[WebSocket]
    H --> L[CORS (Fetch)]
    H --> M[JSONP Fallback]
    
    I --> N[Message Rendering]
    I --> O[DOM Management]
    
    D --> P[Widget Factory]
    D --> Q[Composable Widgets]
```

## Transport Selection

ChatUI chooses the transport based on the `serverUrl` protocol:

- **`wss://` or `ws://`** → WebSocket
- **`https://` or `http://`** → CORS (fetch) with JSONP fallback when needed

## Theme System

ChatUI uses data-attributes-first theming with CSS variables:

- **Themes**: `default` and `branded`
- **Modes**: `light` and `dark`
- **Custom overrides**: `data-color-light`, `data-bg-color-dark`, etc.

Theme mode can be set via `data-theme-mode` (preferred) or `data-mode` (legacy).

## Widget System

ChatUI implements a **composable widget tree**. Every message can contain a nested structure of widgets.

### Core Widget Categories

- **Content/Layout**: `text`, `container`, `card`, `row`, `column`
- **Actions**: `button`, `buttons`, `confirmation`
- **Inputs**: `input`, `password`, `textarea`
- **Selection**: `select`, `radio`, `checkbox`, `toggle`
- **Interactive**: `rating`, `slider`, `date`, `tags`, `color_picker`
- **Data/Advanced**: `file_upload`, `progress`, `list`, `conditional`, `form`

> `image` and `icon` types currently map to container behavior as placeholders.

### Composable Message Format (Preferred)

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

### Legacy Message Format (Supported)

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

## Integration Patterns

### HTML Integration

```html
<script 
  id="chat-widget"
  src="dist/chat-widget.min.js"
  data-server-url="https://your-server.com"
  data-position="bottom-right"
  data-title="Chat with us">
</script>
```

### Programmatic API

```javascript
const chat = ChatUI.init({
  id: 'support-chat',
  title: 'Support Chat',
  position: 'bottom-left',
  color: '#28a745',
  serverUrl: 'https://your-server.com'
});
```

## Module Structure

- `src/entry.js` → global API + auto-init
- `src/modules/chat-widget.class.js` → main orchestrator
- `src/modules/api.js` → hybrid transport (WS/CORS/JSONP)
- `src/modules/ui.js` → DOM rendering + styles
- `src/modules/theme.js` → theme system
- `src/modules/widgets/` → composable widgets

## See Also

- `docs/theme-system.md`
- `docs/widget-system.md`
- `docs/backend-integration-guide.md`
- `docs/composition-recipes.md`
