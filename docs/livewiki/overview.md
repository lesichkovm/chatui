---
path: overview.md
page-type: overview
summary: High-level introduction and architectural overview of the ChatUI widget system with 26+ interactive components.
tags: [overview, introduction, architecture, widgets]
created: 2026-01-22
updated: 2026-01-22
version: 1.4.0
---

# ChatUI Widget Overview

ChatUI is a professional, ultra-lightweight (~12KB) chat UI widget built with pure Vanilla JavaScript. It provides a modern conversational interface without framework dependencies or technical complexity.

## Strategic Position

ChatUI delivers interactive chat capabilities with minimal performance overhead, designed to be "live in 30 seconds" while remaining extensible for enterprise requirements.

## Key Features

- **Ultra-Lightweight**: ~12KB core footprint
- **Zero Dependencies**: Pure vanilla JavaScript
- **Framework Agnostic**: Works with any web stack
- **CORS-First Communication**: Modern fetch API with JSONP fallback
- **Real-Time Support**: WebSocket integration for live features
- **Dual Modes**: Popup and fullpage embedding
- **26+ Interactive Widgets**: Comprehensive UI component library
- **Widget Composition**: Advanced Phase 2 composable widget system
- **Interactive Menu System**: Color picker, position selector, and sound toggle
- **Enhanced Security**: HTML sanitization with tag whitelist and XSS prevention
- **Session Management**: X-Session-Key CORS header support
- **Cross-Environment Storage**: Fallback support for various environments
- **API Configuration Validation**: Enhanced error handling and validation
- **TypeScript Support**: Type annotations for better development experience
- **Accessible**: ARIA-compliant focus management
- **Secure**: XSS prevention and scoped CSS

## Target Markets

- **SMBs**: Professional chat with zero dev overhead
- **Enterprise Legacy Systems**: Modern UI without framework migrations
- **SaaS Platforms**: White-label frontend for proprietary backends

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
    C --> K[Utilities]
    
    H --> L[CORS API]
    H --> M[Legacy API]
    H --> N[WebSocket API]
    
    I --> O[Message Rendering]
    I --> P[Event Handling]
    I --> Q[DOM Management]
    
    D --> R[Widget Factory]
    D --> S[Base Widget]
    D --> T[26+ Component Widgets]
```

## Module Structure

The widget is organized into logical modules:

- **Entry Point**: Auto-initialization and global API
- **Core Classes**: Main ChatWidget implementation
- **API Layer**: Transport abstraction (CORS/JSONP/WebSocket)
- **UI Layer**: DOM manipulation and event handling
- **Theme System**: Styling and customization
- **Widget System**: Interactive component framework
- **Utilities**: Helper functions and shared utilities

## Communication Protocols

ChatUI supports multiple transport protocols with automatic fallback:

1. **WebSocket** (ws/wss): Real-time bidirectional communication
2. **CORS** (http/https): Modern fetch-based API calls
3. **JSONP** (http/https): Legacy fallback for older servers

## Integration Patterns

### HTML Integration
```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="https://your-server.com"
  data-position="bottom-right"
  data-color="#007bff"
  data-title="Chat with us">
</script>
```

### Programmatic API
```javascript
const chat = ChatUI.init({
  id: 'custom-chat',
  title: 'Support Chat',
  color: '#28a745',
  position: 'bottom-left',
  serverUrl: 'http://localhost:3000'
});
```

## Widget Composition System

ChatUI features an advanced widget composition system allowing complex UI combinations:

### Basic Widget Categories
- **Input Widgets**: Input, Textarea, Password, Text
- **Selection Widgets**: Select, Radio, Checkbox, Toggle
- **Interactive Widgets**: Rating, Date, Color Picker, Slider, Tags
- **Action Widgets**: Button, Buttons, Confirmation, File Upload
- **Display Widgets**: Card, Progress, Container, List, Conditional

### Composition Examples
```javascript
// Multi-step form with validation
const formWidget = {
  type: 'container',
  children: [
    { type: 'input', label: 'Name', required: true },
    { type: 'email', label: 'Email', validation: 'email' },
    { type: 'buttons', buttons: ['Submit', 'Cancel'] }
  ]
};

// Interactive rating with feedback
const ratingWidget = {
  type: 'container',
  children: [
    { type: 'rating', max: 5 },
    { type: 'textarea', label: 'Feedback (optional)' },
    { type: 'button', text: 'Submit Rating' }
  ]
};
```

## See Also

- [Getting Started](getting_started.md) - Quick setup guide
- [Architecture](architecture.md) - Detailed system design
- [API Reference](api_reference.md) - Complete API documentation
- [Configuration](configuration.md) - All configuration options

## Changelog
- **v1.4.0** (2026-01-22): Added interactive widget menu system with color picker and position selector, enhanced security with HTML sanitization, TypeScript type annotations, X-Session-Key CORS header support, and BETA ribbon banner for demos
- **v1.3.0** (2026-01-22): Added comprehensive widget validation with HTML sanitization, enhanced security features, and widget composition migration tools
- **v1.2.0** (2026-01-22): Enhanced widget system with 26+ components, composition capabilities, cross-environment storage, and API validation improvements
- **v1.1.0** (2026-01-22): Initial documentation with 15+ widget components
- **v1.0.0** (2026-01-22): Base overview creation
