---
path: getting_started.md
page-type: tutorial
summary: Step-by-step guide for setting up and integrating the ChatUI widget.
tags: [tutorial, setup, installation, integration]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Getting Started

This guide will help you integrate the ChatUI widget into your web application in minutes.

## Prerequisites

- A web server or hosting environment
- Basic HTML/JavaScript knowledge
- A chat backend API (optional for testing)

## Installation

### 1. Include the Widget

Download the built widget file and include it in your HTML:

```html
<script src="path/to/chat-widget.js"></script>
```

### 2. Basic HTML Integration

The simplest way to use ChatUI is through HTML data attributes:

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

The widget will automatically initialize when the page loads.

## Configuration Options

### Required Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-server-url` | Your chat backend URL | `https://api.example.com` |

### Optional Attributes

| Attribute | Description | Default | Example |
|-----------|-------------|---------|---------|
| `data-position` | Widget position | `bottom-right` | `bottom-left` |
| `data-color` | Primary theme color | `#007bff` | `#28a745` |
| `data-title` | Header title | `Chat with us` | `Support Chat` |
| `data-display` | Display mode | `popup` | `fullpage` |
| `data-mode` | Theme mode | `light` | `dark` |
| `data-prefer-jsonp` | Force JSONP mode | `false` | `true` |

## Communication Modes

### CORS Mode (Default)
Modern HTTP/HTTPS communication using fetch API:

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="https://your-server.com">
</script>
```

### WebSocket Mode
Real-time bidirectional communication:

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="wss://your-server.com/ws">
</script>
```

### JSONP Mode (Legacy)
For older servers that don't support CORS:

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-prefer-jsonp="true">
</script>
```

## Programmatic API

For more control, use the JavaScript API:

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

// Listen for events
window.addEventListener('chatwidget:message', (event) => {
  console.log('New message:', event.detail);
});
```

## Display Modes

### Popup Mode (Default)
The widget appears as a floating bubble in the corner of the page:

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-display="popup"
  data-position="bottom-right">
</script>
```

### Fullpage Mode
The widget fills a container element:

```html
<div id="chat-container"></div>

<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-display="fullpage"
  data-target="#chat-container">
</script>
```

## CSS Customization

The widget uses scoped CSS to avoid conflicts with your site. Customize it with CSS:

```css
/* Override header colors */
#chat-widget .header {
    background-color: #333;
    color: #fff;
}

/* Adjust message bubbles */
#chat-widget .message {
    font-size: 16px;
}

/* Custom widget positioning */
#chat-widget.chat-widget.bottom-right {
    bottom: 20px;
    right: 20px;
}
```

## Testing the Integration

### 1. Use the Demo Server

Start the included demo server:

```bash
npm run start:demo
```

Then open `demo/demo.html` in your browser.

### 2. Check Browser Console

Open your browser's developer console and look for:

- Initialization messages
- API request/response logs
- Any error messages

### 3. Verify Network Requests

Check the Network tab to ensure:

- Handshake requests are successful
- Message requests are being sent
- WebSocket connections (if applicable)

## Troubleshooting

### Widget Not Appearing
- Check that the script tag has `id="chat-widget"`
- Verify the script path is correct
- Ensure no JavaScript errors in console

### API Connection Issues
- Verify the `data-server-url` is correct
- Check CORS headers on your server
- Try JSONP mode for legacy servers

### Styling Conflicts
- Use scoped CSS with `#chat-widget` prefix
- Check for CSS specificity issues
- Verify CSS reset isn't interfering

## Next Steps

- Read the [Architecture](architecture.md) guide for system design
- Review the [API Reference](api_reference.md) for complete documentation
- Check [Configuration](configuration.md) for all options
- See [Development](development.md) for advanced customization

## See Also

- [Architecture](architecture.md) - System design overview
- [API Reference](api_reference.md) - Complete API documentation
- [Configuration](configuration.md) - All configuration options
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
