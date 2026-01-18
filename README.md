# ChatUI Widget

![Tests](https://github.com/lesichkovm/chatui/workflows/Tests/badge.svg)

A professional, **ultra-lightweight (~12KB)**, API-agnostic chat UI widget built with **pure Vanilla JavaScript**. Zero framework lock-in (no React/Vue/jQuery), zero external dependencies, with **CORS-first communication** and automatic JSONP fallback for seamless cross-domain integration.

## Strategic Position

ChatUI provides the interactive power of a modern conversational UI without the performance overhead or technical complexity of framework-bound libraries. It is designed to be "live in 30 seconds" while remaining extensible enough for complex enterprise requirements.

## Target Markets

- **SMBs**: Professional chat with zero dev overhead.
- **Enterprise Legacy Systems**: Modern interactivity without framework migrations.
- **SaaS Platforms**: A lean, white-label frontend for proprietary backends.

## Features

- **Ultra-Lightweight**: ~12KB core footprint, minimal impact on host performance.
- **Interactive Widget System**: Support for 15+ specialized UI components (Rating, Date Picker, File Upload, etc.).
- **Zero Dependencies**: Pure vanilla JS, works with any stack.
- **CORS-First Communication**: Modern fetch-based API with automatic JSONP fallback for legacy compatibility.
- **Real-Time WebSocket Support**: Live typing indicators, read receipts, and streaming responses.
- **Protocol-Based Transport**: Automatically uses WebSocket (ws/wss) or CORS/JSONP (http/https) based on server URL.
- **Dual Modes**: Supports both `popup` and `fullpage` embedded modes.
- **Modular Architecture**: Built with modern ES6 classes and a dedicated `WidgetFactory`.
- **Accessible & Secure**: ARIA-compliant focus management and robust XSS prevention.

## Installation & Usage

### 1. HTML Integration (Auto-initialize)
Add the script tag to your HTML. The widget will automatically initialize based on the data attributes.

**CORS Mode (HTTP/HTTPS) - Default:**
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

**JSONP Mode (Legacy Fallback):**
```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-prefer-jsonp="true"
  data-position="bottom-right"
  data-color="#007bff"
  data-title="Chat with us">
</script>

**WebSocket Mode (WS/WSS):**
```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="wss://your-server.com/ws"
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
| `data-server-url` | `serverUrl` | Base URL for the chat backend API | `http://localhost:3000` |
| `data-display` | `displayMode` | Display mode: `popup` or `fullpage` | `popup` |
| `data-mode` | `themeMode` | Theme mode: `light` or `dark` | `light` |
| `data-position` | `position` | Corner position: `bottom-right`, `bottom-left`, `top-right`, `top-left` | `bottom-right` |
| `data-color` | `primaryColor` | Primary theme color (Hex code) | `#007bff` |
| `data-title` | `title` | Title text displayed in the header | `Chat with us` |
| `data-target` | `targetSelector` | Selector for container element (fullpage mode only) | `null` |
| `data-prefer-jsonp` | `preferJsonP` | Force JSONP instead of CORS (legacy) | `false` |
| `data-force-jsonp` | `forceJsonP` | Force JSONP only, no CORS fallback | `false` |
| `data-timeout` | `timeout` | CORS request timeout in milliseconds | `5000` |

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

The widget supports multiple transport protocols with automatic fallback:

### CORS Mode (Default) - HTTP/HTTPS
The widget uses modern fetch API with proper CORS headers. This is the default and recommended approach for modern web applications.

#### Handshake
`POST /api/handshake`  
Request body: `{ type: 'handshake', timestamp: 1234567890 }`  
Response: `{ status: "success", session_key: "..." }`

#### Send/Receive Messages
`POST /api/messages`  
Request body: `{ type: 'message', message: "...", session_key: "...", timestamp: 1234567890 }`  
Response: `{ text: "Response message", sender: "bot" }`

#### Connect
`POST /api/messages`  
Request body: `{ type: 'connect', session_key: "...", timestamp: 1234567890 }`  
Response: `{ text: "Welcome message", sender: "bot" }`

### JSONP Mode (Legacy Fallback)
If CORS fails or is explicitly configured, the widget automatically falls back to JSONP for compatibility with older servers.

#### Handshake
`GET /api/handshake?callback=cb`  
Response: `{ status: "success", session_key: "..." }`

#### Send/Receive Messages
`GET /api/messages?callback=cb&message=...&session_key=...`  
Response: `{ text: "Response message", sender: "bot" }`

### WebSocket Mode (WS/WSS)
For real-time features, use a WebSocket endpoint. The widget will automatically detect the protocol and establish a WebSocket connection.

#### WebSocket Message Format
The widget sends and receives JSON messages with the following structure:

**Client → Server:**
```json
{
  "type": "handshake|connect|message|typing|read_receipt",
  "payload": { ... },
  "session_key": "...",
  "timestamp": 1234567890
}
```

**Server → Client:**
```json
{
  "type": "handshake|message|message:stream|typing|read_receipt",
  "text": "...",
  "widget": { ... },
  "payload": { ... },
  "session_key": "...",
  "timestamp": 1234567890
}
```

#### Real-Time Features
- **Typing Indicators**: Send `{ type: "typing", payload: { typing: true } }` to show/hide typing indicators
- **Read Receipts**: Send `{ type: "read_receipt", payload: { message_id: "..." } }` to confirm message reads
- **Streaming Responses**: Send `{ type: "message:stream", text: "partial..." }` for character-by-character AI responses
- **Custom Events**: Listen for `chatwidget:typing` and `chatwidget:read_receipt` events on the window object

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

## Running the Demo

To see the widget in action with a live backend:

1. Start the demo API server:
   ```bash
   npm run start:demo
   ```
2. Open `demo/demo.html` in your browser.

## Architecture

- `src/modules/`: Individual source modules (API, UI, Utils, Class)
- `src/entry.js`: Entry point for the bundler
- `dist/chat-widget.js`: Final distribution bundle
- `dist/chat-widget.min.js`: Minified distribution bundle
- `tests/`: Playwright test suites

## Security Features

- **CORS-First Security**: Uses modern CORS headers by default, falling back to JSONP only when necessary.
- **JSONP Security**: Callback validation to prevent XSS when JSONP fallback is used.
- **Scoped Reset**: Internal CSS reset prevents host styles from breaking the UI.
- **Message Sanitization**: Proper handling of user-generated content.
- **Timeout Protection**: Configurable request timeouts prevent hanging connections.
