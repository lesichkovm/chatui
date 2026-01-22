---
path: api_reference.md
page-type: reference
summary: Complete API reference for ChatUI including configuration options, methods, and events.
tags: [api, reference, methods, events, configuration]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# API Reference

Complete reference for the ChatUI widget API, including configuration options, methods, and events.

## Configuration Options

### Core Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `serverUrl` | string | `http://localhost:3000` | Base URL for chat backend API |
| `id` | string | `chat-widget` | Unique widget identifier |
| `title` | string | `Chat with us` | Header title text |
| `color` | string | `#007bff` | Primary theme color (hex) |
| `position` | string | `bottom-right` | Corner position |
| `displayMode` | string | `popup` | Display mode: `popup` or `fullpage` |
| `themeMode` | string | `light` | Theme mode: `light` or `dark` |
| `targetSelector` | string | `null` | Container selector (fullpage mode) |

### Communication Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `preferJsonP` | boolean | `false` | Prefer JSONP over CORS |
| `forceJsonP` | boolean | `false` | Force JSONP only, no CORS fallback |
| `timeout` | number | `5000` | CORS request timeout (ms) |
| `autoReconnect` | boolean | `true` | Auto-reconnect WebSocket connections |
| `reconnectDelay` | number | `1000` | Reconnection delay (ms) |

### UI Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | string | `380px` | Widget width |
| `height` | string | `600px` | Widget height |
| `zIndex` | number | `9999` | Widget z-index |
| `showHeader` | boolean | `true` | Show header bar |
| `showFooter` | boolean | `true` | Show footer area |
| `autoOpen` | boolean | `false` | Auto-open on load |

## Position Options

| Value | Description |
|-------|-------------|
| `bottom-right` | Bottom right corner (default) |
| `bottom-left` | Bottom left corner |
| `top-right` | Top right corner |
| `top-left` | Top left corner |

## Methods

### Initialization

#### `ChatUI.init(config)`
Creates and initializes a new ChatUI widget instance.

```javascript
const chat = ChatUI.init({
    serverUrl: 'https://api.example.com',
    title: 'Support Chat',
    color: '#28a745'
});
```

**Parameters:**
- `config` (object): Configuration options

**Returns:**
- `ChatWidget`: Widget instance

#### `window.createChatWidget(scriptElement)`
Legacy factory function for script tag initialization.

```javascript
const script = document.getElementById('chat-widget');
const widget = window.createChatWidget(script);
```

**Parameters:**
- `scriptElement` (HTMLElement): Script tag element

**Returns:**
- `ChatWidget`: Widget instance

### Widget Control

#### `open()`
Opens the chat widget.

```javascript
chat.open();
```

#### `close()`
Closes the chat widget.

```javascript
chat.close();
```

#### `toggle()`
Toggles the widget open/closed state.

```javascript
chat.toggle();
```

#### `isOpen()`
Returns the current open state.

```javascript
const isOpen = chat.isOpen();
console.log(isOpen); // true/false
```

**Returns:**
- `boolean`: Current open state

### Message Management

#### `sendMessage(text, data)`
Sends a message to the server.

```javascript
chat.sendMessage('Hello, I need help!');
chat.sendMessage('Select option', { type: 'select', options: ['A', 'B', 'C'] });
```

**Parameters:**
- `text` (string): Message text
- `data` (object, optional): Additional message data

**Returns:**
- `Promise`: Resolves when message is sent

#### `addMessage(text, sender, type)`
Adds a message locally without sending to server.

```javascript
chat.addMessage('Welcome!', 'bot', 'text');
chat.addMessage('User message', 'user', 'text');
```

**Parameters:**
- `text` (string): Message text
- `sender` (string): Message sender (`'user'` or `'bot'`)
- `type` (string): Message type (`'text'`, `'widget'`, etc.)

#### `clearMessages()`
Clears all messages from the chat.

```javascript
chat.clearMessages();
```

#### `getMessages()`
Returns all messages in the chat.

```javascript
const messages = chat.getMessages();
console.log(messages); // Array of message objects
```

**Returns:**
- `Array`: Array of message objects

### Widget Management

#### `addWidget(type, config)`
Adds an interactive widget to the chat.

```javascript
chat.addWidget('rating', { max: 5, required: true });
chat.addWidget('date', { min: '2024-01-01', max: '2024-12-31' });
```

**Parameters:**
- `type` (string): Widget type
- `config` (object): Widget configuration

**Returns:**
- `Widget`: Widget instance

#### `removeWidget(widgetId)`
Removes a widget from the chat.

```javascript
chat.removeWidget('rating-123');
```

**Parameters:**
- `widgetId` (string): Widget identifier

#### `clearWidgets()`
Removes all widgets from the chat.

```javascript
chat.clearWidgets();
```

### Configuration

#### `updateConfig(newConfig)`
Updates widget configuration.

```javascript
chat.updateConfig({
    title: 'Updated Title',
    color: '#ff6b6b'
});
```

**Parameters:**
- `newConfig` (object): New configuration options

#### `getConfig()`
Returns current widget configuration.

```javascript
const config = chat.getConfig();
console.log(config.serverUrl);
```

**Returns:**
- `object`: Current configuration

### Session Management

#### `getSessionKey()`
Returns the current session key.

```javascript
const sessionKey = chat.getSessionKey();
```

**Returns:**
- `string`: Session key or `null` if not established

#### `resetSession()`
Resets the current session and establishes a new one.

```javascript
chat.resetSession();
```

## Events

ChatUI emits custom events that you can listen to:

### Widget Events

#### `chatwidget:open`
Fired when the widget is opened.

```javascript
window.addEventListener('chatwidget:open', (event) => {
    console.log('Widget opened');
});
```

#### `chatwidget:close`
Fired when the widget is closed.

```javascript
window.addEventListener('chatwidget:close', (event) => {
    console.log('Widget closed');
});
```

#### `chatwidget:ready`
Fired when the widget is fully initialized.

```javascript
window.addEventListener('chatwidget:ready', (event) => {
    console.log('Widget ready');
});
```

### Message Events

#### `chatwidget:message`
Fired when a message is sent or received.

```javascript
window.addEventListener('chatwidget:message', (event) => {
    const { message, sender, type } = event.detail;
    console.log('Message:', message, 'from:', sender);
});
```

**Event Detail:**
- `message` (string): Message text
- `sender` (string): Message sender
- `type` (string): Message type

#### `chatwidget:message:sent`
Fired when a message is sent to the server.

```javascript
window.addEventListener('chatwidget:message:sent', (event) => {
    console.log('Message sent:', event.detail.message);
});
```

#### `chatwidget:message:received`
Fired when a message is received from the server.

```javascript
window.addEventListener('chatwidget:message:received', (event) => {
    console.log('Message received:', event.detail.message);
});
```

### Connection Events

#### `chatwidget:connected`
Fired when connection to server is established.

```javascript
window.addEventListener('chatwidget:connected', (event) => {
    console.log('Connected to server');
});
```

#### `chatwidget:disconnected`
Fired when connection to server is lost.

```javascript
window.addEventListener('chatwidget:disconnected', (event) => {
    console.log('Disconnected from server');
});
```

#### `chatwidget:connection:error`
Fired when connection error occurs.

```javascript
window.addEventListener('chatwidget:connection:error', (event) => {
    console.error('Connection error:', event.detail.error);
});
```

### Real-time Events (WebSocket)

#### `chatwidget:typing`
Fired when typing indicator is received.

```javascript
window.addEventListener('chatwidget:typing', (event) => {
    const { typing } = event.detail;
    console.log('Typing:', typing);
});
```

#### `chatwidget:read_receipt`
Fired when read receipt is received.

```javascript
window.addEventListener('chatwidget:read_receipt', (event) => {
    const { messageId } = event.detail;
    console.log('Message read:', messageId);
});
```

### Widget Events

#### `chatwidget:widget:created`
Fired when a widget is created.

```javascript
window.addEventListener('chatwidget:widget:created', (event) => {
    const { widgetId, type } = event.detail;
    console.log('Widget created:', widgetId, type);
});
```

#### `chatwidget:widget:submitted`
Fired when a widget is submitted.

```javascript
window.addEventListener('chatwidget:widget:submitted', (event) => {
    const { widgetId, data } = event.detail;
    console.log('Widget submitted:', widgetId, data);
});
```

## Server API

### Handshake Endpoint

**URL:** `POST /api/handshake` (CORS) or `GET /api/handshake?callback=cb` (JSONP)

**Request:**
```json
{
    "type": "handshake",
    "timestamp": 1234567890
}
```

**Response:**
```json
{
    "status": "success",
    "session_key": "abc123..."
}
```

### Messages Endpoint

**URL:** `POST /api/messages` (CORS) or `GET /api/messages?callback=cb&message=...` (JSONP)

**Request:**
```json
{
    "type": "message",
    "message": "Hello",
    "session_key": "abc123...",
    "timestamp": 1234567890
}
```

**Response:**
```json
{
    "text": "Response message",
    "sender": "bot",
    "widget": {
        "type": "rating",
        "config": { "max": 5 }
    }
}
```

### WebSocket Messages

**Client → Server:**
```json
{
    "type": "handshake|connect|message|typing|read_receipt",
    "payload": { ... },
    "session_key": "abc123...",
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
    "session_key": "abc123...",
    "timestamp": 1234567890
}
```

## See Also

- [Getting Started](getting_started.md) - Setup and integration guide
- [Configuration](configuration.md) - Detailed configuration options
- [Data Flow](data_flow.md) - How data moves through the system
- [Development](development.md) - Development workflow and guidelines
