# ChatUI Widget

A simple, embedded, API-agnostic chat UI widget with JSONP support for cross-domain communication.

## Features

- **Lightweight & Fast**: Built with vanilla JavaScript, zero heavy dependencies.
- **Cross-Domain Support**: Native JSONP support allows easy integration with any backend.
- **Secure**: Input sanitization and secure callback handling.
- **Customizable**: Configurable position, colors, and titles via data attributes or CSS.
- **Multiple Modes**: Supports 'popup' (default) and 'fullpage' modes.
- **Modular Architecture**: Built with modern ES6 classes and modules.
- **Programmatic API**: Full control over the widget via JavaScript.
- **Accessible**: Built-in ARIA support and focus management.

## Installation & Usage

### 1. HTML Integration (Auto-initialize)
Add the script tag to your HTML. The widget will automatically initialize based on the data attributes.

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-position="bottom-right"
  data-color="#007bff"
  data-title="Chat with us">
</script>
```

### 2. Programmatic API
You can initialize and control the widget manually using the global `ChatUI` object.

```javascript
// Initialize the widget
const chat = ChatUI.init({
  id: 'custom-chat',
  title: 'Support Chat',
  color: '#28a745',
  position: 'bottom-left',
  serverUrl: 'http://localhost:3000'
});

// Control the widget
chat.open();
chat.close();
chat.toggle();
chat.sendMessage('Hello from the API!');
```

## Configuration Options

| Attribute | JS Option | Description | Default |
|-----------|-----------|-------------|---------|
| `data-server-url` | `serverUrl` | Base URL of the chat backend API | `http://localhost:3000` |
| `data-mode` | `mode` | Display mode: `popup` or `fullpage` | `popup` |
| `data-position` | `position` | Corner position: `bottom-right`, `bottom-left`, `top-right`, `top-left` | `bottom-right` |
| `data-color` | `primaryColor` | Primary theme color (Hex code) | `#007bff` |
| `data-title` | `title` | Title text displayed in the header | `Chat with us` |
| `data-target` | `targetSelector` | Selector for container element (fullpage mode only) | `null` |

## CSS Customization

The widget uses strictly ID-rooted CSS selectors to prevent affecting your site's styles. You can easily theme it by targeting its classes in your own CSS:

```css
/* Override the widget header color */
#chat-widget .header {
    background-color: #333;
    color: #fff;
}

/* Adjust message bubble styles */
#chat-widget .message {
    font-size: 16px;
}
```

## API Integration

The widget expects a backend that supports the following endpoints (compatible with JSONP):

### Handshake
`GET /api/handshake?callback=cb`  
Response: `{ status: "success", session_key: "..." }`

### Send/Receive Messages
`GET /api/messages?callback=cb&message=...&session_key=...`  
Response: `{ text: "Response message", sender: "bot" }`

## Development

### Build
To build the distribution file (`dist/chat-widget.js`):
```bash
npm run build
```

### Testing
Run the Playwright end-to-end tests:
```bash
npm test
```

## Architecture

- `src/modules/`: Individual source modules (API, UI, Utils, Class)
- `src/entry.js`: Entry point for the bundler
- `src/chat-widget.js`: Bundle used for local tests/demos
- `dist/chat-widget.js`: Final distribution bundle
- `dist/chat-widget.min.js`: Minified distribution bundle
- `tests/`: Playwright test suites

## Security Features

- **JSONP Security**: Callback validation to prevent XSS.
- **Scoped Reset**: Internal CSS reset prevents host styles from breaking the UI.
- **Message Sanitization**: Proper handling of user-generated content.
