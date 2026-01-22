---
path: cheatsheet.md
page-type: reference
summary: Quick reference guide for common ChatUI operations and configurations.
tags: [cheatsheet, reference, quick-start, examples]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# ChatUI Cheatsheet

Quick reference guide for common ChatUI operations, configurations, and examples.

## Quick Setup

### HTML Integration (30 seconds)
```html
<script 
  id="chat-widget"
  src="chat-widget.js"
  data-server-url="https://your-server.com"
  data-position="bottom-right"
  data-color="#007bff"
  data-title="Chat with us">
</script>
```

### JavaScript Integration
```javascript
const chat = ChatUI.init({
    serverUrl: 'https://your-server.com',
    title: 'Support Chat',
    color: '#28a745',
    position: 'bottom-left'
});
```

## Configuration Options

### Essential Options
```javascript
{
    serverUrl: 'https://api.example.com',    // Required
    title: 'Chat with us',                   // Header title
    color: '#007bff',                        // Primary color
    position: 'bottom-right',                // Corner: bottom-right|bottom-left|top-right|top-left
}
```

### Display Options
```javascript
{
    displayMode: 'popup',                    // popup|fullpage
    themeMode: 'light',                      // light|dark|auto
    width: '380px',                          // Widget width
    height: '600px',                         // Widget height
    zIndex: 9999                             // Widget z-index
}
```

### Communication Options
```javascript
{
    preferJsonP: false,                      // Force JSONP mode
    timeout: 5000,                           // Request timeout (ms)
    autoReconnect: true,                     // Auto-reconnect WebSocket
    headers: {                              // Custom headers
        'Authorization': 'Bearer token123'
    }
}
```

## Widget Control

### Basic Operations
```javascript
chat.open();                    // Open widget
chat.close();                   // Close widget
chat.toggle();                  // Toggle open/closed
chat.isOpen();                  // Check if open (returns boolean)
```

### Message Operations
```javascript
// Send message
chat.sendMessage('Hello, world!');

// Add local message
chat.addMessage('Welcome!', 'bot', 'text');

// Get all messages
const messages = chat.getMessages();

// Clear all messages
chat.clearMessages();
```

### Widget Operations
```javascript
// Add widget
chat.addWidget('rating', { max: 5, required: true });

// Remove widget
chat.removeWidget('rating-123');

// Clear all widgets
chat.clearWidgets();
```

## Widget Types

### Input Widgets
```javascript
// Text input
chat.addWidget('input', {
    placeholder: 'Enter your name',
    required: true
});

// Textarea
chat.addWidget('textarea', {
    placeholder: 'Enter your message',
    maxLength: 500
});

// Password
chat.addWidget('password', {
    placeholder: 'Enter password',
    minLength: 8
});
```

### Selection Widgets
```javascript
// Dropdown
chat.addWidget('select', {
    options: ['Option 1', 'Option 2', 'Option 3'],
    required: true
});

// Radio buttons
chat.addWidget('radio', {
    options: ['Yes', 'No', 'Maybe'],
    required: true
});

// Checkbox
chat.addWidget('checkbox', {
    options: ['Option A', 'Option B'],
    required: true
});

// Toggle switch
chat.addWidget('toggle', {
    label: 'Enable notifications',
    default: false
});
```

### Interactive Widgets
```javascript
// Rating
chat.addWidget('rating', {
    max: 5,
    icon: 'star',
    required: true
});

// Date picker
chat.addWidget('date', {
    format: 'YYYY-MM-DD',
    min: '2024-01-01',
    max: '2024-12-31'
});

// Color picker
chat.addWidget('color-picker', {
    default: '#007bff',
    format: 'hex'
});

// Slider
chat.addWidget('slider', {
    min: 0,
    max: 100,
    step: 1,
    default: 50
});

// Tags
chat.addWidget('tags', {
    placeholder: 'Add tags...',
    maxTags: 5
});
```

### Action Widgets
```javascript
// Button
chat.addWidget('button', {
    text: 'Submit',
    onClick: () => console.log('Clicked!')
});

// Confirmation
chat.addWidget('confirmation', {
    text: 'Are you sure?',
    onConfirm: () => console.log('Confirmed!'),
    onCancel: () => console.log('Cancelled!')
});

// File upload
chat.addWidget('file-upload', {
    accept: '.jpg,.png,.pdf',
    maxSize: 10485760,        // 10MB
    multiple: false,
    preview: true
});
```

## Event Handling

### Global Events
```javascript
// Widget lifecycle
window.addEventListener('chatwidget:ready', (e) => {
    console.log('Widget ready');
});

window.addEventListener('chatwidget:open', (e) => {
    console.log('Widget opened');
});

window.addEventListener('chatwidget:close', (e) => {
    console.log('Widget closed');
});

// Messages
window.addEventListener('chatwidget:message', (e) => {
    const { message, sender, type } = e.detail;
    console.log('New message:', message);
});

// Connection
window.addEventListener('chatwidget:connected', (e) => {
    console.log('Connected to server');
});

window.addEventListener('chatwidget:disconnected', (e) => {
    console.log('Disconnected from server');
});
```

### Widget Events
```javascript
// Widget created
window.addEventListener('chatwidget:widget:created', (e) => {
    const { widgetId, type } = e.detail;
    console.log(`Widget ${type} created: ${widgetId}`);
});

// Widget submitted
window.addEventListener('chatwidget:widget:submitted', (e) => {
    const { widgetId, data } = e.detail;
    console.log(`Widget ${widgetId} submitted:`, data);
});
```

### Instance Events
```javascript
const chat = ChatUI.init(config);

// Using configuration handlers
const chat = ChatUI.init({
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error)
});
```

## Server API

### Handshake Endpoint
```javascript
// CORS
POST /api/handshake
{
    "type": "handshake",
    "timestamp": 1234567890
}

// Response
{
    "status": "success",
    "session_key": "abc123..."
}

// JSONP
GET /api/handshake?callback=chatui_cb_123
chatui_cb_123({
    "status": "success",
    "session_key": "abc123..."
});
```

### Messages Endpoint
```javascript
// CORS
POST /api/messages
{
    "type": "message",
    "message": "Hello, world!",
    "session_key": "abc123...",
    "timestamp": 1234567890
}

// Response
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
```javascript
// Client → Server
{
    "type": "handshake|message|typing|read_receipt",
    "payload": { ... },
    "session_key": "abc123...",
    "timestamp": 1234567890
}

// Server → Client
{
    "type": "handshake|message|typing|read_receipt",
    "text": "Response message",
    "widget": { ... },
    "payload": { ... },
    "session_key": "abc123...",
    "timestamp": 1234567890
}
```

## Styling

### CSS Customization
```css
/* Override header */
#chat-widget .header {
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
}

/* Message bubbles */
#chat-widget .message.user {
    background-color: #007bff;
    color: white;
    border-radius: 18px 18px 4px 18px;
}

#chat-widget .message.bot {
    background-color: #f8f9fa;
    color: #333;
    border: 1px solid #dee2e6;
    border-radius: 18px 18px 18px 4px;
}

/* Input area */
#chat-widget .message-input {
    border: 2px solid #dee2e6;
    border-radius: 8px;
    padding: 12px;
}

#chat-widget .message-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}
```

### Theme Variables
```css
#chat-widget {
    --chatui-primary-color: #007bff;
    --chatui-background-color: #ffffff;
    --chatui-text-color: #333333;
    --chatui-border-color: #dee2e6;
    --chatui-border-radius: 8px;
    --chatui-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## Common Patterns

### Form with Multiple Widgets
```javascript
// Create form widgets
const widgets = [
    { type: 'input', config: { id: 'name', placeholder: 'Name', required: true } },
    { type: 'input', config: { id: 'email', placeholder: 'Email', required: true } },
    { type: 'rating', config: { id: 'rating', max: 5, required: true } },
    { type: 'confirmation', config: { id: 'submit', text: 'Submit Form' } }
];

// Add widgets
widgets.forEach(({ type, config }) => {
    chat.addWidget(type, config);
});

// Handle form submission
window.addEventListener('chatwidget:widget:submitted', (e) => {
    if (e.detail.widgetId === 'submit') {
        // Collect form data
        const formData = {};
        widgets.forEach(({ config }) => {
            const widget = chat.getWidget(config.id);
            if (widget) {
                formData[config.id] = widget.getValue();
            }
        });
        
        // Submit form
        chat.sendMessage('Form submitted', formData);
    }
});
```

### Custom Widget Development
```javascript
class CustomWidget extends BaseWidget {
    static get type() { return 'custom'; }
    
    render() {
        this.element = this.createElement('div', 'custom-widget');
        
        const input = this.createElement('input', 'custom-input');
        input.type = 'text';
        input.placeholder = this.config.placeholder || 'Enter value';
        
        this.element.appendChild(input);
        return this.element;
    }
    
    getValue() {
        return this.element.querySelector('.custom-input').value;
    }
    
    validate() {
        const value = this.getValue();
        if (this.config.required && !value.trim()) {
            throw new Error('This field is required');
        }
        return true;
    }
}

// Register custom widget
WidgetFactory.register('custom', CustomWidget);

// Use custom widget
chat.addWidget('custom', {
    placeholder: 'Custom input',
    required: true,
    onChange: (value) => console.log('Value changed:', value)
});
```

### Real-time Features
```javascript
// WebSocket setup
const chat = ChatUI.init({
    serverUrl: 'wss://api.example.com/ws',
    autoReconnect: true,
    reconnectDelay: 2000
});

// Handle real-time events
window.addEventListener('chatwidget:typing', (e) => {
    const { typing } = e.detail;
    if (typing) {
        console.log('User is typing...');
    }
});

window.addEventListener('chatwidget:read_receipt', (e) => {
    const { messageId } = e.detail;
    console.log(`Message ${messageId} was read`);
});

// Send typing indicator
chat.sendTyping(true);  // Start typing
chat.sendTyping(false); // Stop typing

// Send read receipt
chat.sendReadReceipt('msg-123');
```

## Debugging

### Enable Debug Mode
```javascript
// Enable debug logging
window.ChatUI.debug = true;

// Check widget state
const chat = ChatUI.instances[0];
console.log('Config:', chat.getConfig());
console.log('Session:', chat.getSessionKey());
console.log('Messages:', chat.getMessages());
```

### Monitor Events
```javascript
// Monitor all events
window.addEventListener('chatwidget:*', (e) => {
    console.log(`Event: ${e.type}`, e.detail);
});

// Monitor API calls
const originalSend = API.prototype.send;
API.prototype.send = function(data) {
    console.log('API Request:', data);
    return originalSend.call(this, data).then(response => {
        console.log('API Response:', response);
        return response;
    });
};
```

### Common Issues & Solutions

#### Widget Not Appearing
```html
<!-- ❌ Missing ID -->
<script src="chat-widget.js"></script>

<!-- ✅ Correct -->
<script id="chat-widget" src="chat-widget.js"></script>
```

#### Connection Issues
```javascript
// Try JSONP fallback
chat.updateConfig({ preferJsonP: true });

// Check server connectivity
fetch(chat.getConfig().serverUrl + '/api/handshake')
    .then(response => console.log('Server reachable:', response.ok))
    .catch(error => console.error('Server unreachable:', error));
```

#### Styling Conflicts
```css
/* Use higher specificity */
#chat-widget.chat-widget .header {
    background: #333 !important;
}

/* Check for CSS conflicts */
#chat-widget * {
    box-sizing: border-box !important;
}
```

## Performance Tips

### Bundle Optimization
```javascript
// Use minified version
<script src="chat-widget.min.js"></script>

// Load widgets on demand
chat.addWidget('rating', { lazy: true });
```

### Runtime Optimization
```javascript
// Debounce frequent events
const debouncedHandler = debounce(handler, 100);

// Batch DOM updates
requestAnimationFrame(() => {
    // DOM updates here
});
```

## Browser Compatibility

### Modern Browsers (Full Support)
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

### Legacy Support
```html
<!-- Include polyfills for older browsers -->
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
<script src="chat-widget.legacy.js"></script>
```

### Mobile Optimization
```css
/* Mobile styles */
@media (max-width: 768px) {
    #chat-widget {
        width: 100vw !important;
        height: 100vh !important;
    }
}
```

## Quick Reference Card

### Initialization
```javascript
ChatUI.init(config)           // Create widget instance
window.createChatWidget(script)  // Legacy factory
```

### Control
```javascript
chat.open()                   // Open
chat.close()                  // Close
chat.toggle()                 // Toggle
chat.sendMessage(text)        // Send message
chat.addWidget(type, config)  // Add widget
```

### Events
```javascript
chatwidget:ready             // Widget ready
chatwidget:open               // Widget opened
chatwidget:message            // New message
chatwidget:connected          // Server connected
chatwidget:widget:submitted   // Widget submitted
```

### Configuration
```javascript
serverUrl (required)          // Server URL
position                      // Corner position
color                         // Primary color
displayMode                   // popup|fullpage
themeMode                     // light|dark|auto
```

### Widget Types
```javascript
input, textarea, password     // Text inputs
select, radio, checkbox       // Selection inputs
rating, date, color-picker    // Interactive inputs
button, confirmation          // Action inputs
file-upload, tags, slider     // Advanced inputs
```

This cheatsheet provides quick reference for the most common ChatUI operations and configurations.
