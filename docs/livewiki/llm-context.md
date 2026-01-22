---
path: llm-context.md
page-type: overview
summary: Complete codebase summary optimized for LLM consumption and understanding.
tags: [llm, context, summary, codebase]
created: 2026-01-22
updated: 2026-01-22
version: 1.4.0
---

# LLM Context: ChatUI

## Project Summary

ChatUI is a professional, ultra-lightweight (~12KB) chat UI widget built with pure Vanilla JavaScript. It provides a modern conversational interface without framework dependencies or technical complexity, designed for easy integration into any web application with support for multiple transport protocols (WebSocket, CORS, JSONP), advanced widget composition system, cross-environment storage fallback, interactive menu system, enhanced security with HTML sanitization, TypeScript type annotations, and 26+ interactive widget components.

## Key Technologies

- **Pure Vanilla JavaScript** - No framework dependencies
- **ES6 Classes** - Modern class-based architecture
- **TypeScript Support** - Type annotations for enhanced development
- **CSS Custom Properties** - Dynamic theming system
- **WebSocket API** - Real-time bidirectional communication
- **Fetch API** - Modern HTTP requests with CORS support
- **JSONP** - Legacy fallback for older servers
- **HTML Sanitization** - XSS prevention with tag whitelist
- **X-Session-Key Headers** - Enhanced session management
- **Docsify** - Documentation generation
- **Playwright** - End-to-end testing
- **ESBuild** - Fast bundling and compilation

## Directory Structure

```
chatui/
├── src/                    # Source code
│   ├── entry.js           # Entry point and global API
│   └── modules/           # Core modules
│       ├── api.js         # API abstraction layer
│       ├── api-cors.js    # CORS transport implementation
│       ├── api-legacy.js  # JSONP transport implementation
│       ├── chat-widget.class.js  # Main widget orchestrator
│       ├── theme.js       # Theme and styling system
│       ├── ui.js          # UI management and DOM manipulation
│       ├── utils.js       # Utility functions
│       └── widgets/       # Interactive widget components
│           ├── base-widget.js    # Abstract base widget class
│           ├── widget-factory.js  # Widget factory and registry
│           ├── widget-types.js    # Widget type definitions
│           └── [26+ component widgets]
├── demo/                  # Demo files and server
├── dist/                  # Built distribution files
├── tests/                 # Playwright test suites
├── scripts/               # Build and utility scripts
└── docs/                  # Documentation and LiveWiki
```

## Core Concepts

### 1. Transport-Agnostic Communication
ChatUI abstracts communication protocols, automatically detecting and using the appropriate transport:
- **WebSocket** (ws/wss) for real-time bidirectional communication
- **CORS** (http/https) for modern fetch-based API calls
- **JSONP** (http/https) for legacy server compatibility

### 2. Widget System Architecture
A flexible component system for interactive elements:
- **BaseWidget** abstract class defining common interface
- **WidgetFactory** for dynamic widget creation and management
- **Event-driven communication** between widgets and main system
- **26+ specialized widgets** (rating, date picker, file upload, conditional, list, etc.)
- **Interactive Menu System** with color picker, position selector, and sound toggle
- **Container widgets** for grouping and layout management
- **Card widgets** for structured content display
- **Enhanced security** with HTML sanitization and XSS prevention
- Event-driven communication between widgets and main system

### 3. Interactive Menu System
Advanced user configuration interface:
- **Color Picker** with palette and hex input for theme customization
- **Position Selector** for dynamic widget positioning
- **Sound Toggle** for notification preferences
- **Live Preview** with instant visual feedback
- **Persistent Settings** with localStorage integration
- **Accessibility Support** with ARIA compliance and keyboard navigation

### 4. Theme System
Dynamic theming with CSS custom properties:
- **Light/Dark modes** with automatic detection
- **Custom color schemes** and CSS variable management
- **Responsive design** with mobile-first approach
- **Accessibility support** with high contrast and reduced motion

### 5. Event-Driven Architecture
Comprehensive event system for component communication:
- **Widget lifecycle events** (created, mounted, destroyed)
- **User interaction events** (focus, blur, change, submit)
- **Communication events** (connected, disconnected, message)
- **Global window events** for external integration

## Common Patterns

### 1. Module Pattern with ES6 Classes
```javascript
class ChatWidget {
    constructor(config) {
        this.config = this.parseConfig(config);
        this.api = new API(this.config);
        this.ui = new UI(this.config);
        this.theme = new Theme(this.config);
        this.init();
    }
}
```

### 2. Factory Pattern for Widgets
```javascript
class WidgetFactory {
    static create(type, config) {
        const WidgetClass = widgetRegistry[type];
        if (!WidgetClass) {
            throw new Error(`Unknown widget type: ${type}`);
        }
        return new WidgetClass(config);
    }
}
```

### 3. Transport Abstraction
```javascript
class API {
    detectTransport(url) {
        if (url.startsWith('ws://') || url.startsWith('wss://')) {
            return new WebSocketTransport(this.config);
        }
        return this.config.preferJsonP 
            ? new JSONPTransport(this.config)
            : new CORSTransport(this.config);
    }
}
```

### 4. Event Emission Pattern
```javascript
class BaseWidget {
    emit(event, data) {
        const customEvent = new CustomEvent(`chatwidget:${event}`, {
            detail: data
        });
        window.dispatchEvent(customEvent);
    }
}
```

### 5. Configuration Validation
```javascript
class ChatWidget {
    parseConfig(config) {
        const defaults = {
            serverUrl: 'http://localhost:3000',
            position: 'bottom-right',
            color: '#007bff'
        };
        return { ...defaults, ...config };
    }
}
```

## Important Files

### Core System Files
- **`src/entry.js`** - Entry point, global API exposure, auto-initialization
- **`src/modules/chat-widget.class.js`** - Main orchestrator class coordinating all subsystems
- **`src/modules/api.js`** - Transport abstraction layer and protocol detection
- **`src/modules/ui.js`** - DOM management, message rendering, event handling
- **`src/modules/theme.js`** - Dynamic theming, CSS generation, responsive design

### Transport Implementation Files
- **`src/modules/api-cors.js`** - CORS transport using fetch API
- **`src/modules/api-legacy.js`** - JSONP transport for legacy servers
- **`src/modules/widgets/widget-factory.js`** - Widget creation and management
- **`src/modules/widgets/base-widget.js`** - Abstract base class for all widgets

### Widget Component Files

#### Input Widgets
- **`src/modules/widgets/input-widget.js`** - Text input with validation and submit
- **`src/modules/widgets/textarea-widget.js`** - Multi-line text input
- **`src/modules/widgets/password-widget.js`** - Secure password input
- **`src/modules/widgets/text-widget.js`** - Static text display

#### Selection Widgets  
- **`src/modules/widgets/select-widget.js`** - Dropdown selection component
- **`src/modules/widgets/radio-widget.js`** - Single selection radio group
- **`src/modules/widgets/checkbox-widget.js`** - Multiple selection checkbox group
- **`src/modules/widgets/toggle-widget.js`** - Binary on/off toggle switch

#### Interactive Widgets
- **`src/modules/widgets/rating-widget.js`** - Star/emoji/heart rating component
- **`src/modules/widgets/date-widget.js`** - Date picker with validation
- **`src/modules/widgets/color-picker-widget.js`** - Color selection tool
- **`src/modules/widgets/slider-widget.js`** - Numeric range slider
- **`src/modules/widgets/tags-widget.js`** - Tag input and management

#### Action Widgets
- **`src/modules/widgets/button-widget.js`** - Interactive button component
- **`src/modules/widgets/buttons-widget.js`** - Enhanced button group
- **`src/modules/widgets/confirmation-widget.js`** - Yes/No confirmation dialog
- **`src/modules/widgets/file-upload-widget.js`** - File upload with preview

#### Display & Layout Widgets
- **`src/modules/widgets/card-widget.js`** - Content display card
- **`src/modules/widgets/progress-widget.js`** - Progress indicator
- **`src/modules/widgets/container-widget.js`** - Generic container for grouping
- **`src/modules/widgets/list-widget.js`** - Dynamic list component
- **`src/modules/widgets/conditional-widget.js`** - Dynamic content rendering

#### Core Widget System
- **`src/modules/widgets/widget-factory.js`** - Widget creation and management
- **`src/modules/widgets/base-widget.js`** - Abstract base class for all widgets
- **`src/modules/widgets/widget-types.js`** - Widget type definitions and registry

### Build and Test Files
- **`scripts/build.js`** - ESBuild configuration for bundling
- **`playwright.config.ts`** - End-to-end test configuration
- **`demo/server.js`** - Demo API server for testing
- **`package.json`** - Project dependencies and scripts

## API Integration Points

### Server Endpoints Required

#### Handshake Endpoint
```
POST /api/handshake (CORS)
GET /api/handshake?callback=cb (JSONP)
Request: { type: 'handshake', timestamp: 1234567890 }
Response: { status: 'success', session_key: 'abc123...' }
```

#### Messages Endpoint
```
POST /api/messages (CORS)
GET /api/messages?callback=cb&message=... (JSONP)
Request: { type: 'message', message: '...', session_key: '...', timestamp: 1234567890 }
Response: { text: 'Response', sender: 'bot', widget: {...} }
```

#### WebSocket Messages
```
Client → Server: { type: 'handshake|message|typing|read_receipt', payload: {...}, session_key: '...', timestamp: 1234567890 }
Server → Client: { type: 'handshake|message|typing|read_receipt', text: '...', widget: {...}, session_key: '...', timestamp: 1234567890 }
```

### Client-Side API
```javascript
// Global API
window.ChatUI.init(config)
window.createChatWidget(scriptElement)

// Widget Instance Methods
chat.open()
chat.close()
chat.toggle()
chat.sendMessage(text, data)
chat.addWidget(type, config)
chat.getConfig()
chat.updateConfig(newConfig)
```

## Configuration Schema

### Core Configuration
```javascript
{
    serverUrl: 'https://api.example.com',    // Required
    id: 'chat-widget',                       // Widget ID
    title: 'Chat with us',                   // Header title
    color: '#007bff',                        // Primary color
    position: 'bottom-right',                // Corner position
    displayMode: 'popup',                    // popup|fullpage
    themeMode: 'light',                      // light|dark|auto
    width: '380px',                          // Widget width
    height: '600px',                         // Widget height
    targetSelector: null,                    // Container for fullpage mode
}
```

### Communication Configuration
```javascript
{
    preferJsonP: false,                      // Force JSONP mode
    forceJsonP: false,                        // JSONP only, no CORS
    timeout: 5000,                           // Request timeout (ms)
    autoReconnect: true,                      // Auto-reconnect WebSocket
    reconnectDelay: 1000,                    // Reconnection delay (ms)
    headers: {},                             // Custom headers
}
```

### UI Configuration
```javascript
{
    zIndex: 9999,                            // Widget z-index
    showHeader: true,                        // Show header bar
    showFooter: true,                        // Show footer area
    autoOpen: false,                         // Auto-open on load
    placeholder: 'Type a message...',        // Input placeholder
    customCSS: '',                           // Custom CSS styles
}
```

## Widget System

### Available Widget Types
- **Input Widgets**: input, textarea, password
- **Selection Widgets**: select, radio, checkbox, toggle
- **Interactive Widgets**: rating, date, color-picker, slider, tags
- **Action Widgets**: buttons, confirmation, file-upload
- **Display Widgets**: text, card, progress, container
- **Advanced Widgets**: conditional, list, buttons (enhanced)

### Advanced Widget Features
- **Conditional Widget**: Dynamic content rendering based on complex conditions
- **List Widget**: Dynamic lists with multiple layouts, selection, and custom templates
- **Buttons Widget**: Enhanced buttons with variants, icons, loading states
- **Container Widget**: Flexible layout containers with responsive design
- **Card Widget**: Structured content display with media and actions

### Widget Composition Patterns
- **Nested Containers**: Container widgets can contain other containers
- **Conditional Logic**: Conditional widgets can show/hide based on user input
- **Dynamic Lists**: List widgets support real-time updates and filtering
- **Form Patterns**: Combination of input widgets with validation and submission

### Widget Configuration Pattern
```javascript
{
    type: 'rating',
    config: {
        max: 5,
        required: true,
        onChange: (value) => console.log(value),
        onSubmit: (value) => submitRating(value)
    }
}
```

### Custom Widget Development
```javascript
class CustomWidget extends BaseWidget {
    static get type() { return 'custom'; }
    
    render() {
        this.element = this.createElement('div', 'custom-widget');
        // Custom rendering logic
        return this.element;
    }
    
    getValue() {
        // Return current value
        return this.value;
    }
    
    validate() {
        // Validation logic
        return this.value !== null;
    }
}

WidgetFactory.register('custom', CustomWidget);
```

## Event System

### Global Events
```javascript
// Widget lifecycle
window.addEventListener('chatwidget:ready', (e) => {});
window.addEventListener('chatwidget:open', (e) => {});
window.addEventListener('chatwidget:close', (e) => {});

// Communication
window.addEventListener('chatwidget:connected', (e) => {});
window.addEventListener('chatwidget:disconnected', (e) => {});
window.addEventListener('chatwidget:message', (e) => {});

// Widget interactions
window.addEventListener('chatwidget:widget:created', (e) => {});
window.addEventListener('chatwidget:widget:submitted', (e) => {});
```

### Internal Events
```javascript
// API events
this.api.on('connected', () => {});
this.api.on('message', (message) => {});
this.api.on('error', (error) => {});

// UI events
this.ui.on('send_requested', () => {});
this.ui.on('close_requested', () => {});

// Widget events
this.widget.on('change', (value) => {});
this.widget.on('submit', (value) => {});
```

## Development Workflow

### Build Process
```bash
npm run build          # Build distribution files
npm run start:demo     # Start demo server
npm test               # Run Playwright tests
npm run test:ui        # Run tests with UI
npm run test:debug     # Debug tests
```

### Testing Strategy
- **Unit Tests**: Widget validation and behavior
- **Integration Tests**: API communication and data flow
- **E2E Tests**: Complete user workflows with Playwright
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Performance Tests**: Bundle size and runtime performance

### Code Organization Principles
- **Single Responsibility**: Each module has one clear purpose
- **Dependency Injection**: Configuration passed to constructors
- **Event-Driven**: Loose coupling through events
- **Transport Agnostic**: Abstract communication layer
- **Widget Factory**: Dynamic component creation
- **Theme System**: CSS custom properties for styling

## Security Considerations

### XSS Prevention
- Input sanitization with `escapeHtml()` utility
- Safe HTML generation and DOM manipulation
- Scoped CSS with `#chat-widget` prefix
- JSONP callback validation

### CORS Security
- Proper header validation
- Origin checking for WebSocket connections
- Timeout protection for hanging requests
- Automatic fallback to JSONP when needed

### Data Validation
- Server-side validation for all inputs
- Client-side validation for immediate feedback
- Widget configuration validation
- Message format validation

## Performance Optimizations

### Bundle Size
- **Tree shaking** for unused widgets
- **Conditional loading** of components
- **Minification** with ESBuild
- **Gzip compression** for deployment

### Runtime Performance
- **Event delegation** for efficient DOM handling
- **RequestAnimationFrame** for smooth animations
- **Debouncing** for frequent events
- **Virtual scrolling** for long message lists

### Memory Management
- **Proper cleanup** in destroy() methods
- **Event listener removal** to prevent leaks
- **Widget pooling** for frequently used components
- **Reference clearing** for garbage collection

## Browser Compatibility

### Modern Browsers (Full Support)
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Legacy Support
- **IE 11**: Limited support with polyfills
- **Older browsers**: JSONP fallback for CORS issues
- **Mobile browsers**: Responsive design and touch support

### Polyfills Used
- `requestAnimationFrame` for animations
- `URL` constructor for validation
- `CustomEvent` for event system
- `Promise` for async operations

## Integration Examples

### Basic HTML Integration
```html
<script 
  id="chat-widget"
  src="chat-widget.js"
  data-server-url="https://api.example.com"
  data-position="bottom-right"
  data-color="#007bff"
  data-title="Chat with us">
</script>
```

### Programmatic Integration
```javascript
const chat = ChatUI.init({
    serverUrl: 'https://api.example.com',
    title: 'Support Chat',
    color: '#28a745',
    position: 'bottom-left',
    onMessage: (message) => console.log('New message:', message)
});

chat.open();
chat.sendMessage('Hello, I need help!');
```

### Custom Widget Integration
```javascript
// Add custom widget
chat.addWidget('rating', {
    max: 5,
    required: true,
    onSubmit: (rating) => {
        console.log('User rated:', rating);
        chat.sendMessage(`Rating: ${rating}`);
    }
});

// Listen for widget events
window.addEventListener('chatwidget:widget:submitted', (e) => {
    const { widgetId, data } = e.detail;
    console.log(`Widget ${widgetId} submitted:`, data);
});
```

## Recent Enhancements (v1.3.0)

### Widget Validation and Security
- **HTML Sanitization**: Enhanced security with tag whitelist and content sanitization
- **Widget Validation**: Improved validation with explicit boolean coercion
- **Security Features**: Enhanced XSS prevention and input validation
- **Migration Tools**: Widget composition migration and debugging utilities

### Complete Widget Documentation
- **26+ Widget Components**: Full documentation coverage for all widget types
- **Comprehensive Guides**: Detailed usage examples and integration patterns
- **API Documentation**: Complete method and event documentation
- **Accessibility**: Full accessibility support documentation

### New Widget Types Added
- **Color Picker Widget**: Advanced color selection with palette and hex input
- **Form Widget**: Advanced form container with validation and grouping
- **Widget Types System**: Comprehensive type registry and management
- **Interactive Menu System**: Advanced configuration interface with live controls

### Enhanced Features
- **Widget Composition**: Nested widget support and complex form building
- **Interactive Menu System**: Real-time color picker, position selector, and sound toggle
- **Enhanced Security**: HTML sanitization with tag whitelist and XSS prevention
- **TypeScript Support**: Type annotations for better development experience
- **Session Management**: X-Session-Key CORS header support
- **BETA Ribbon**: Corner banner for demo pages
- **Improved Validation**: Better error handling and user feedback
- **Enhanced Styling**: More variants, sizes, and customization options
- **Better Accessibility**: Improved keyboard navigation and screen reader support

## Troubleshooting Common Issues

### Widget Not Appearing
- Check script tag has `id="chat-widget"`
- Verify script path is correct
- Ensure no JavaScript errors in console
- Check CSS conflicts with scoped styles

### Connection Issues
- Verify `serverUrl` is correct and accessible
- Check CORS headers on server
- Try JSONP mode for legacy servers
- Test WebSocket endpoint separately

### Styling Issues
- Use scoped CSS with `#chat-widget` prefix
- Check CSS specificity conflicts
- Verify color format (hex codes)
- Test responsive breakpoints

### Widget Issues
- Check widget type is registered
- Validate widget configuration
- Ensure required methods are implemented
- Test widget validation logic

This context provides comprehensive understanding of the ChatUI codebase for LLM consumption, covering architecture, implementation details, integration patterns, and troubleshooting guidance.
