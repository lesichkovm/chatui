---
path: configuration.md
page-type: reference
summary: Complete configuration reference for ChatUI widget including all options and customization.
tags: [configuration, options, customization, settings]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Configuration

Complete reference for all ChatUI configuration options, including HTML data attributes, JavaScript configuration, and advanced customization.

## Configuration Methods

### 1. HTML Data Attributes (Recommended)

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

### 2. JavaScript Configuration

```javascript
const chat = ChatUI.init({
  serverUrl: 'https://your-server.com',
  position: 'bottom-right',
  color: '#007bff',
  title: 'Chat with us'
});
```

### 3. Mixed Configuration

You can combine both methods - JavaScript configuration takes precedence over HTML attributes.

## Core Configuration Options

### Required Options

| Option | HTML Attribute | JS Option | Type | Default | Description |
|--------|----------------|-----------|------|---------|-------------|
| Server URL | `data-server-url` | `serverUrl` | string | `http://localhost:3000` | Base URL for chat backend API |

### Basic Options

| Option | HTML Attribute | JS Option | Type | Default | Description |
|--------|----------------|-----------|------|---------|-------------|
| Widget ID | `data-id` | `id` | string | `chat-widget` | Unique widget identifier |
| Title | `data-title` | `title` | string | `Chat with us` | Header title text |
| Color | `data-color` | `color` | string | `#007bff` | Primary theme color (hex) |
| Position | `data-position` | `position` | string | `bottom-right` | Corner position |

### Display Options

| Option | HTML Attribute | JS Option | Type | Default | Description |
|--------|----------------|-----------|------|---------|-------------|
| Display Mode | `data-display` | `displayMode` | string | `popup` | `popup` or `fullpage` |
| Theme Mode | `data-mode` | `themeMode` | string | `light` | `light` or `dark` |
| Target | `data-target` | `targetSelector` | string | `null` | Container selector (fullpage mode) |
| Width | `data-width` | `width` | string | `380px` | Widget width |
| Height | `data-height` | `height` | string | `600px` | Widget height |

### Communication Options

| Option | HTML Attribute | JS Option | Type | Default | Description |
|--------|----------------|-----------|------|---------|-------------|
| Prefer JSONP | `data-prefer-jsonp` | `preferJsonP` | boolean | `false` | Prefer JSONP over CORS |
| Force JSONP | `data-force-jsonp` | `forceJsonP` | boolean | `false` | Force JSONP only, no CORS fallback |
| Timeout | `data-timeout` | `timeout` | number | `5000` | CORS request timeout (ms) |
| Auto Reconnect | `data-auto-reconnect` | `autoReconnect` | boolean | `true` | Auto-reconnect WebSocket |
| Reconnect Delay | `data-reconnect-delay` | `reconnectDelay` | number | `1000` | Reconnection delay (ms) |

### UI Options

| Option | HTML Attribute | JS Option | Type | Default | Description |
|--------|----------------|-----------|------|---------|-------------|
| Z-Index | `data-z-index` | `zIndex` | number | `9999` | Widget z-index |
| Show Header | `data-show-header` | `showHeader` | boolean | `true` | Show header bar |
| Show Footer | `data-show-footer` | `showFooter` | boolean | `true` | Show footer area |
| Auto Open | `data-auto-open` | `autoOpen` | boolean | `false` | Auto-open on load |
| Placeholder | `data-placeholder` | `placeholder` | string | `Type a message...` | Input placeholder text |

## Position Options

### Corner Positions

| Value | Description | CSS Position |
|-------|-------------|--------------|
| `bottom-right` | Bottom right corner (default) | `bottom: 20px; right: 20px` |
| `bottom-left` | Bottom left corner | `bottom: 20px; left: 20px` |
| `top-right` | Top right corner | `top: 20px; right: 20px` |
| `top-left` | Top left corner | `top: 20px; left: 20px` |

### Custom Positioning

```javascript
const chat = ChatUI.init({
  position: 'custom',
  customPosition: {
    bottom: '30px',
    right: '30px'
  }
});
```

## Theme Configuration

### Color Schemes

```javascript
// Light theme (default)
const chat = ChatUI.init({
  themeMode: 'light',
  color: '#007bff',
  backgroundColor: '#ffffff',
  textColor: '#333333'
});

// Dark theme
const chat = ChatUI.init({
  themeMode: 'dark',
  color: '#0d6efd',
  backgroundColor: '#1a1a1a',
  textColor: '#ffffff'
});
```

### Custom CSS Variables

```css
#chat-widget {
  --chatui-primary-color: #007bff;
  --chatui-background-color: #ffffff;
  --chatui-text-color: #333333;
  --chatui-border-color: #dee2e6;
  --chatui-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Advanced Configuration

### Custom Headers

```javascript
const chat = ChatUI.init({
  serverUrl: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'custom-value'
  }
});
```

### Custom Event Handlers

```javascript
const chat = ChatUI.init({
  onOpen: () => console.log('Widget opened'),
  onClose: () => console.log('Widget closed'),
  onMessage: (message) => console.log('New message:', message),
  onError: (error) => console.error('Error:', error)
});
```

### Widget Configuration

```javascript
const chat = ChatUI.init({
  widgets: {
    rating: {
      max: 5,
      required: true,
      icon: 'star'
    },
    date: {
      format: 'YYYY-MM-DD',
      min: '2024-01-01',
      max: '2024-12-31'
    }
  }
});
```

## Environment-Specific Configuration

### Development

```javascript
const chat = ChatUI.init({
  serverUrl: 'http://localhost:3000',
  debug: true,
  logLevel: 'debug',
  timeout: 10000
});
```

### Production

```javascript
const chat = ChatUI.init({
  serverUrl: 'https://api.example.com',
  debug: false,
  logLevel: 'error',
  timeout: 5000,
  autoReconnect: true
});
```

### Testing

```javascript
const chat = ChatUI.init({
  serverUrl: 'http://test-server.com',
  mockMode: true,
  debug: true,
  autoOpen: true
});
```

## Configuration Validation

### Built-in Validation

ChatUI automatically validates configuration options:

```javascript
// Valid colors
color: '#007bff'     // ✅ Valid hex
color: 'blue'        // ❌ Invalid, will use default
color: '#gggggg'     // ❌ Invalid hex, will use default

// Valid positions
position: 'bottom-right'  // ✅ Valid
position: 'center'        // ❌ Invalid, will use default

// Valid URLs
serverUrl: 'https://api.example.com'  // ✅ Valid
serverUrl: 'not-a-url'                // ❌ Invalid, will use default
```

### Custom Validation

```javascript
const chat = ChatUI.init({
  serverUrl: 'https://api.example.com',
  customValidator: (config) => {
    if (config.color && !config.color.startsWith('#')) {
      throw new Error('Color must start with #');
    }
    return true;
  }
});
```

## Configuration Examples

### Basic Customer Support Chat

```html
<script 
  id="chat-widget"
  src="chat-widget.js"
  data-server-url="https://support.example.com"
  data-title="Customer Support"
  data-color="#28a745"
  data-position="bottom-right">
</script>
```

### Sales Chat with Custom Styling

```javascript
const chat = ChatUI.init({
  serverUrl: 'https://sales.example.com',
  title: 'Sales Team',
  color: '#fd7e14',
  position: 'bottom-left',
  themeMode: 'light',
  width: '400px',
  height: '650px',
  customCSS: `
    #chat-widget .header {
      background: linear-gradient(45deg, #fd7e14, #e67e22);
    }
  `
});
```

### Embedded Fullpage Chat

```html
<div id="chat-container"></div>

<script 
  id="chat-widget"
  src="chat-widget.js"
  data-server-url="https://api.example.com"
  data-display="fullpage"
  data-target="#chat-container"
  data-show-header="false"
  data-width="100%"
  data-height="500px">
</script>
```

### WebSocket Real-time Chat

```javascript
const chat = ChatUI.init({
  serverUrl: 'wss://chat.example.com/ws',
  title: 'Live Chat',
  color: '#6f42c1',
  autoReconnect: true,
  reconnectDelay: 2000,
  onConnected: () => console.log('Connected to chat server'),
  onDisconnected: () => console.log('Disconnected from chat server')
});
```

## Configuration Best Practices

### 1. Use Environment Variables

```javascript
const chat = ChatUI.init({
  serverUrl: process.env.CHAT_SERVER_URL || 'http://localhost:3000',
  debug: process.env.NODE_ENV === 'development',
  color: process.env.CHAT_COLOR || '#007bff'
});
```

### 2. Validate Configuration

```javascript
function validateConfig(config) {
  const required = ['serverUrl'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(', ')}`);
  }
  
  return true;
}

const config = { serverUrl: 'https://api.example.com' };
validateConfig(config);
const chat = ChatUI.init(config);
```

### 3. Use Configuration Defaults

```javascript
const defaultConfig = {
  serverUrl: 'http://localhost:3000',
  title: 'Chat with us',
  color: '#007bff',
  position: 'bottom-right',
  timeout: 5000
};

const userConfig = {
  serverUrl: 'https://api.example.com',
  color: '#28a745'
};

const finalConfig = { ...defaultConfig, ...userConfig };
const chat = ChatUI.init(finalConfig);
```

## Troubleshooting Configuration

### Common Issues

1. **Widget Not Appearing**
   - Check `id="chat-widget"` is present
   - Verify script path is correct
   - Ensure no JavaScript errors

2. **Connection Issues**
   - Verify `serverUrl` is correct and accessible
   - Check CORS headers on server
   - Try JSONP mode for legacy servers

3. **Styling Issues**
   - Use scoped CSS with `#chat-widget` prefix
   - Check CSS specificity
   - Verify color format (hex codes)

### Debug Mode

```javascript
// Enable debug mode
window.ChatUI.debug = true;

// Check current configuration
const chat = ChatUI.init(config);
console.log('Current config:', chat.getConfig());
```

## See Also

- [Getting Started](getting_started.md) - Setup and integration guide
- [API Reference](api_reference.md) - Complete API documentation
- [Architecture](architecture.md) - System design overview
- [Development](development.md) - Development workflow and guidelines
