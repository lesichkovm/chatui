---
path: troubleshooting.md
page-type: tutorial
summary: Common issues, error messages, and solutions for ChatUI widget problems.
tags: [troubleshooting, errors, solutions, debugging]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Troubleshooting

Common issues, error messages, and solutions for ChatUI widget problems.

## Quick Diagnosis

### 1. Check Browser Console

Open your browser's developer console (F12) and look for:

- JavaScript errors
- ChatUI initialization messages
- Network request failures
- CSS conflicts

### 2. Verify Widget Loading

```javascript
// Check if ChatUI is loaded
console.log('ChatUI loaded:', typeof window.ChatUI !== 'undefined');

// Check widget instances
console.log('Widget instances:', window.ChatUI?.instances);
```

### 3. Test Network Connection

```javascript
// Test server connectivity
fetch('https://your-server.com/api/handshake')
    .then(response => console.log('Server reachable:', response.ok))
    .catch(error => console.error('Server unreachable:', error));
```

## Common Issues

### Widget Not Appearing

#### Symptoms
- No widget visible on page
- No errors in console
- Script tag appears to load

#### Causes & Solutions

**1. Missing Script ID**
```html
<!-- ❌ Wrong -->
<script src="chat-widget.js"></script>

<!-- ✅ Correct -->
<script id="chat-widget" src="chat-widget.js"></script>
```

**2. Incorrect Script Path**
```html
<!-- ❌ Wrong path -->
<script id="chat-widget" src="wrong/path/chat-widget.js"></script>

<!-- ✅ Correct path -->
<script id="chat-widget" src="correct/path/chat-widget.js"></script>
```

**3. Script Loading Error**
```javascript
// Check in console
// ❌ Error: Failed to load resource: net::ERR_FILE_NOT_FOUND

// Solution: Verify file path and server configuration
```

**4. CSS Display Issues**
```css
/* Check for conflicting CSS */
#chat-widget {
    display: block !important; /* Force display */
    visibility: visible !important;
}
```

### Connection Errors

#### Symptoms
- Widget appears but shows "Connection failed"
- Messages not sending/receiving
- Console shows network errors

#### Causes & Solutions

**1. Incorrect Server URL**
```html
<!-- ❌ Wrong URL -->
<script data-server-url="http://localhost:3000"></script>

<!-- ✅ Correct URL -->
<script data-server-url="https://your-server.com"></script>
```

**2. CORS Issues**
```javascript
// Server must include these headers:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**3. JSONP Fallback**
```html
<!-- Force JSONP mode for legacy servers -->
<script 
  data-server-url="http://legacy-server.com"
  data-prefer-jsonp="true">
</script>
```

**4. WebSocket Connection Issues**
```javascript
// Check WebSocket URL format
const wsUrl = 'wss://your-server.com/ws'; // ✅ Correct
const wsUrl = 'ws://your-server.com/ws';  // ✅ For HTTP
const wsUrl = 'https://your-server.com/ws'; // ❌ Wrong protocol
```

### Styling Issues

#### Symptoms
- Widget appears but looks broken
- Styles not applying correctly
- Conflicts with site CSS

#### Causes & Solutions

**1. CSS Specificity Issues**
```css
/* ❌ Low specificity */
.chat-widget { color: red; }

/* ✅ High specificity */
#chat-widget.chat-widget { color: red; }
```

**2. CSS Reset Conflicts**
```css
/* Add scoped reset */
#chat-widget * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
```

**3. Theme Not Applying**
```javascript
// Check theme mode
const chat = ChatUI.init({
    themeMode: 'dark', // or 'light'
    color: '#007bff'
});
```

### Widget Functionality Issues

#### Symptoms
- Widgets not rendering
- Widget interactions not working
- Widget validation errors

#### Causes & Solutions

**1. Widget Not Registered**
```javascript
// Check widget is available
console.log('Available widgets:', Object.keys(window.ChatUI.widgets));

// Register custom widget
window.ChatUI.widgets.register('my-widget', MyWidget);
```

**2. Configuration Errors**
```javascript
// Validate widget configuration
try {
    chat.addWidget('rating', { max: 5 });
} catch (error) {
    console.error('Widget configuration error:', error);
}
```

**3. Event Handler Issues**
```javascript
// Check event listeners
window.addEventListener('chatwidget:widget:submitted', (event) => {
    console.log('Widget submitted:', event.detail);
});
```

## Error Messages

### "ChatUI is not defined"

**Cause**: Script not loaded or loaded before ChatUI

**Solution**:
```html
<!-- Load ChatUI before using it -->
<script src="chat-widget.js"></script>
<script>
    // Now ChatUI is available
    const chat = ChatUI.init({...});
</script>
```

### "Failed to initialize widget"

**Cause**: Invalid configuration or missing required options

**Solution**:
```javascript
// Check required options
const config = {
    serverUrl: 'https://your-server.com', // Required
    // ... other options
};

// Validate configuration
if (!config.serverUrl) {
    throw new Error('serverUrl is required');
}
```

### "Network request failed"

**Cause**: Server unreachable or CORS issues

**Solution**:
```javascript
// Test server connectivity
fetch(config.serverUrl + '/api/handshake')
    .then(response => {
        if (!response.ok) {
            throw new Error('Server responded with error');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
        // Try JSONP fallback
        config.preferJsonP = true;
    });
```

### "Widget type not found"

**Cause**: Widget not registered or incorrect type name

**Solution**:
```javascript
// Check available widgets
const availableWidgets = ['rating', 'date', 'select', 'input'];
if (!availableWidgets.includes(widgetType)) {
    throw new Error(`Unknown widget type: ${widgetType}`);
}
```

## Debugging Techniques

### Enable Debug Mode

```javascript
// Enable detailed logging
window.ChatUI.debug = true;

// Enable network debugging
window.ChatUI.debug.network = true;

// Enable widget debugging
window.ChatUI.debug.widgets = true;
```

### Monitor Events

```javascript
// Monitor all widget events
window.addEventListener('chatwidget:*', (event) => {
    console.log(`Event: ${event.type}`, event.detail);
});

// Monitor specific events
window.addEventListener('chatwidget:error', (event) => {
    console.error('ChatUI Error:', event.detail);
});
```

### Inspect Widget State

```javascript
// Get widget instance
const chat = window.ChatUI.instances[0];

// Check configuration
console.log('Config:', chat.getConfig());

// Check connection status
console.log('Connected:', chat.isConnected());

// Check messages
console.log('Messages:', chat.getMessages());
```

### Network Debugging

```javascript
// Intercept API calls
const originalSend = API.prototype.send;
API.prototype.send = function(data) {
    console.log('API Request:', data);
    return originalSend.call(this, data).then(response => {
        console.log('API Response:', response);
        return response;
    }).catch(error => {
        console.error('API Error:', error);
        throw error;
    });
};
```

## Performance Issues

### Slow Widget Loading

**Symptoms**: Widget takes long time to appear
**Causes**: Large bundle size, slow server, many widgets

**Solutions**:
```javascript
// Use minified version
<script src="chat-widget.min.js"></script>

// Lazy load widgets
chat.addWidget('rating', { lazy: true });

// Optimize server response time
```

### Memory Leaks

**Symptoms**: Page becomes slow over time
**Causes**: Event listeners not removed, widget instances not cleaned up

**Solutions**:
```javascript
// Clean up widget on page unload
window.addEventListener('beforeunload', () => {
    if (chat) {
        chat.destroy();
    }
});

// Remove event listeners
element.removeEventListener('click', handler);
```

### High CPU Usage

**Symptoms**: Page becomes unresponsive
**Causes**: Frequent DOM updates, infinite loops

**Solutions**:
```javascript
// Batch DOM updates
requestAnimationFrame(() => {
    // DOM updates here
});

// Debounce frequent events
const debouncedHandler = debounce(handler, 100);
```

## Browser Compatibility

### Internet Explorer Issues

**Symptoms**: Widget not working in IE
**Causes**: ES6+ features not supported

**Solutions**:
```javascript
// Use polyfills
<script src="https://polyfill.io/v3/polyfill.min.js"></script>

// Use legacy build
<script src="chat-widget.legacy.js"></script>
```

### Mobile Browser Issues

**Symptoms**: Widget not responsive on mobile
**Causes**: Touch events, viewport issues

**Solutions**:
```css
/* Mobile optimizations */
#chat-widget {
    max-width: 100vw;
    max-height: 100vh;
}

@media (max-width: 768px) {
    #chat-widget {
        width: 100%;
        height: 100%;
        position: fixed;
    }
}
```

## Server-Side Issues

### CORS Configuration

**Node.js Express**:
```javascript
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

**Apache**:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "POST, GET, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

**Nginx**:
```nginx
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "POST, GET, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type";
```

### JSONP Implementation

**Node.js Express**:
```javascript
app.get('/api/messages', (req, res) => {
    const callback = req.query.callback;
    const data = { text: 'Response message' };
    
    if (callback) {
        res.jsonp(data);
    } else {
        res.json(data);
    }
});
```

### WebSocket Server

**Node.js ws**:
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        // Handle different message types
        switch (data.type) {
            case 'handshake':
                ws.send(JSON.stringify({
                    type: 'handshake',
                    status: 'success',
                    session_key: generateSessionKey()
                }));
                break;
            case 'message':
                ws.send(JSON.stringify({
                    type: 'message',
                    text: 'Response: ' + data.payload.text,
                    sender: 'bot'
                }));
                break;
        }
    });
});
```

## Getting Help

### 1. Check Documentation

- [Getting Started](getting_started.md) - Basic setup
- [API Reference](api_reference.md) - Complete API docs
- [Configuration](configuration.md) - All options

### 2. Search Issues

Check existing issues on GitHub:
- [GitHub Issues](https://github.com/lesichkovm/chatui/issues)

### 3. Create Minimal Reproduction

Create a simple test case to isolate the problem:

```html
<!DOCTYPE html>
<html>
<head>
    <title>ChatUI Debug</title>
</head>
<body>
    <script id="chat-widget" src="chat-widget.js" data-server-url="https://your-server.com"></script>
    <script>
        window.ChatUI.debug = true;
        window.addEventListener('chatwidget:error', (e) => console.error('Error:', e.detail));
    </script>
</body>
</html>
```

### 4. Report Issue

When reporting an issue, include:

- Browser and version
- Operating system
- ChatUI version
- Error messages
- Steps to reproduce
- Minimal reproduction case

## See Also

- [Getting Started](getting_started.md) - Setup and integration guide
- [API Reference](api_reference.md) - Complete API documentation
- [Configuration](configuration.md) - All configuration options
- [Development](development.md) - Development workflow and guidelines
