---
path: architecture.md
page-type: overview
summary: System architecture, design patterns, and key technical decisions aligned with the current codebase.
tags: [architecture, design, patterns, technical]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# Architecture

ChatUI uses a modular, event-driven architecture with strict separation of concerns. The design prioritizes performance, maintainability, and extensibility, while remaining framework‑agnostic and dependency‑free.

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Public API Layer"
        A[HTML Data Attributes]
        B[Programmatic API]
        C[Auto-Initialization]
    end

    subgraph "Core System"
        D[ChatWidget Class]
        E[State + Events]
    end

    subgraph "Communication Layer"
        F[HybridChatAPI]
        G[CORS Transport]
        H[JSONP Transport]
        I[WebSocket Transport]
    end

    subgraph "Presentation Layer"
        J[UI Module]
        K[Theme System]
        L[DOM Management]
    end

    subgraph "Widget System"
        M[Widget Factory]
        N[Base Widget]
        O[Composable Widgets]
    end

    A --> D
    B --> D
    C --> D

    D --> F
    D --> J
    D --> K
    D --> M

    F --> G
    F --> H
    F --> I

    J --> L
    K --> J

    M --> N
    N --> O
```

---

## Module Structure

### Entry Point (`src/entry.js`)
- Exposes `window.ChatUI.init()` for programmatic usage.
- Exposes legacy `window.createChatWidget()`.
- Auto-initializes script tags with `id` starting with `chat-widget`.
- Observes DOM for dynamically inserted script tags.

### Core Orchestrator (`src/modules/chat-widget.class.js`)
- Parses configuration (script element or JS object).
- Initializes theme manager, UI, and transport layer.
- Manages open/close state, message flow, and error handling.
- Handles widget interaction events and forwards to API.

### Communication Layer (`src/modules/api.js`, `api-cors.js`, `api-legacy.js`)
- `HybridChatAPI` selects transport based on `serverUrl` protocol:
  - `wss://` or `ws://` → WebSocket
  - `https://` or `http://` → CORS with JSONP fallback
- CORS transport uses `fetch` with timeouts and error classification.
- JSONP transport remains for legacy environments.

### UI Layer (`src/modules/ui.js`)
- Injects scoped CSS per widget instance.
- Renders messages and widgets.
- Manages message list, input area, and layout.

### Theme System (`src/modules/theme.js`)
- Data-attributes-first theming with CSS variables.
- Supports themes: `default`, `branded`.
- Supports modes: `light`, `dark`.
- Persists preference via `localStorage`.
- Respects `prefers-color-scheme` when no explicit mode is set.

### Widget System (`src/modules/widgets/`)
- `WidgetFactory` creates widgets by type and supports nested children.
- `BaseWidget` provides validation and event dispatch helpers.
- Widgets are composable via `children`.

---

## Transport Selection

```mermaid
flowchart LR
    A[serverUrl] --> B{Protocol}
    B -->|wss/ws| C[WebSocket]
    B -->|https/http| D[CORS fetch]
    D -->|CORS Error| E[JSONP Fallback]
```

---

## Widget System (Composable)

Widgets are defined as a tree. Each widget may include `props` and `children`.

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
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
```

### Supported Widget Categories
- **Content/Layout**: `text`, `container`, `card`, `row`, `column`
- **Actions**: `button`, `buttons`, `confirmation`
- **Inputs**: `input`, `password`, `textarea`
- **Selection**: `select`, `radio`, `checkbox`, `toggle`
- **Interactive**: `rating`, `slider`, `date`, `tags`, `color_picker`
- **Data/Advanced**: `file_upload`, `progress`, `list`, `conditional`, `form`

> `image` and `icon` are placeholders mapped to container behavior.

---

## Event Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Layer
    participant W as ChatWidget
    participant API as HybridChatAPI
    participant S as Server

    U->>UI: Type or interact
    UI->>W: sendMessage / widgetInteraction
    W->>API: sendMessage()
    API->>S: HTTP/WebSocket message
    S->>API: Response
    API->>W: Process response
    W->>UI: appendMessage()
    UI->>U: Render
```

### Key Events
- `widgetInteraction` (document): emitted by widgets when user interacts.
- `widgetValueChanged` (document): emitted on input value changes for forms.
- `chatwidget:error` (window): emitted when errors are surfaced to the user.
- `chatwidget:typing` (window): emitted on WebSocket typing indicators.
- `chatwidget:read_receipt` (window): emitted on WebSocket read receipts.

---

## Security & Reliability

- Input validation and sanitization for messages and widgets.
- JSONP callback names are randomized and validated.
- CORS requests enforce JSON responses and timeouts.
- Scoped CSS prevents style leakage.
- WebSocket URL validation to avoid insecure protocols in production.

---

## Extensibility Points

### Custom Widgets
- Implement a `BaseWidget` subclass.
- Register via `WidgetFactory.registerWidget("custom", CustomWidget)`.

### Theming
- Override CSS variables per widget ID:
  - `--chat-primary`, `--chat-bg`, `--chat-surface`, `--chat-text`, `--chat-border`

---

## See Also

- `docs/livewiki/getting_started.md`
- `docs/livewiki/configuration.md`
- `docs/livewiki/api_reference.md`
- `docs/overview.md`
- `docs/widget-system.md`
