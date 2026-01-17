# ChatUI Backend Integration Guide

## Overview

ChatUI is a lightweight, framework-agnostic chat widget that supports two transport protocols:
- **JSONP** (HTTP/HTTPS) - For cross-domain compatibility without CORS issues
- **WebSocket** (WS/WSS) - For real-time features like typing indicators and streaming responses

The widget automatically detects the protocol based on your server URL and uses the appropriate transport method.

## Quick Start

### 1. Choose Your Protocol

**JSONP Mode (Simple, Cross-Domain):**
```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="https://your-server.com/api">
</script>
```

**WebSocket Mode (Real-Time):**
```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="wss://your-server.com/ws">
</script>
```

### 2. Implement the Required Endpoints

Based on your chosen protocol, implement the corresponding endpoints below.

---

## JSONP API Endpoints

### Base URL Structure
```
https://your-server.com/api/{endpoint}?callback={callback_name}&{parameters}
```

### 1. Handshake Endpoint

**Endpoint:** `GET /api/handshake`

**Parameters:**
- `callback` (required): JSONP callback function name

**Response Format:**
```javascript
handshakeCallback_1234567890({
  "status": "success",
  "session_key": "unique_session_id_12345",
  "message": "Welcome message (optional)"
});
```

**Response Fields:**
- `status` (string): Must be "success" for successful handshake
- `session_key` (string): Unique session identifier for the user
- `message` (string, optional): Welcome message to display

### 2. Messages Endpoint

**Endpoint:** `GET /api/messages`

**Parameters:**
- `callback` (required): JSONP callback function name
- `message` (optional): User message text
- `type` (optional): Message type ("connect", "message", "typing", "read_receipt")
- `session_key` (required): Session identifier from handshake

**Response Formats:**

#### For Regular Messages:
```javascript
chatCallback_1234567890({
  "text": "Bot response message",
  "sender": "bot",
  "timestamp": 1234567890,
  "session_key": "user_session_key"
});
```

#### For Interactive Widgets:
```javascript
chatCallback_1234567890({
  "text": "Choose an option below:",
  "sender": "bot",
  "timestamp": 1234567890,
  "session_key": "user_session_key",
  "widget": {
    "type": "buttons",
    "options": [
      { "id": "btn1", "text": "Option 1", "value": "option1" },
      { "id": "btn2", "text": "Option 2", "value": "option2" }
    ]
  }
});
```

**Response Fields:**
- `text` (string): Message text to display
- `sender` (string): Always "bot" for server responses
- `timestamp` (number): Unix timestamp
- `session_key` (string): User's session key
- `widget` (object, optional): Interactive widget configuration

---

## WebSocket API

### Connection URL
```
wss://your-server.com/ws
```

### Message Format

All WebSocket messages follow this structure:

```json
{
  "type": "message_type",
  "payload": { ... },
  "session_key": "user_session_key",
  "timestamp": 1234567890
}
```

### 1. Handshake (Client → Server)

```json
{
  "type": "handshake",
  "timestamp": 1234567890
}
```

### 2. Handshake Response (Server → Client)

```json
{
  "type": "handshake",
  "status": "success",
  "session_key": "unique_session_id_12345",
  "timestamp": 1234567890
}
```

### 3. Client Message (Client → Server)

```json
{
  "type": "message",
  "payload": "Hello, how can you help me?",
  "session_key": "user_session_key",
  "timestamp": 1234567890
}
```

### 4. Server Response (Server → Client)

**Regular Message:**
```json
{
  "type": "message",
  "text": "I'm here to help! What do you need?",
  "sender": "bot",
  "timestamp": 1234567890
}
```

**Widget Response:**
```json
{
  "type": "message",
  "text": "Please rate our service:",
  "widget": {
    "type": "rating",
    "maxRating": 5,
    "iconType": "star"
  },
  "timestamp": 1234567890
}
```

### 5. Real-Time Features

**Typing Indicator (Client → Server):**
```json
{
  "type": "typing",
  "payload": { "typing": true },
  "session_key": "user_session_key",
  "timestamp": 1234567890
}
```

**Typing Indicator (Server → Client):**
```json
{
  "type": "typing",
  "payload": { "typing": false },
  "timestamp": 1234567890
}
```

**Read Receipt (Client → Server):**
```json
{
  "type": "read_receipt",
  "payload": { "message_id": "msg_12345" },
  "session_key": "user_session_key",
  "timestamp": 1234567890
}
```

**Streaming Response (Server → Client):**
```json
{
  "type": "message:stream",
  "text": "Partial response...",
  "timestamp": 1234567890
}
```

---

## Widget System

ChatUI supports 15+ interactive widget types. When you include a `widget` object in your response, the chat UI will automatically render the corresponding interactive element.

### Available Widget Types

#### 1. Buttons Widget
```json
{
  "type": "buttons",
  "options": [
    { "id": "btn1", "text": "Rate Service", "value": "rate" },
    { "id": "btn2", "text": "Schedule Meeting", "value": "schedule" }
  ]
}
```

#### 2. Rating Widget
```json
{
  "type": "rating",
  "maxRating": 5,
  "iconType": "star"
}
```

#### 3. Input Widget
```json
{
  "type": "input",
  "placeholder": "Enter your response...",
  "inputType": "text",
  "buttonText": "Submit"
}
```

#### 4. Select Widget
```json
{
  "type": "select",
  "options": [
    { "value": "option1", "text": "First Option" },
    { "value": "option2", "text": "Second Option" }
  ],
  "placeholder": "Choose an option..."
}
```

#### 5. Checkbox Widget
```json
{
  "type": "checkbox",
  "options": [
    { "id": "chk1", "text": "Feature A", "value": "feature_a" },
    { "id": "chk2", "text": "Feature B", "value": "feature_b" }
  ],
  "buttonText": "Submit"
}
```

#### 6. Textarea Widget
```json
{
  "type": "textarea",
  "placeholder": "Enter detailed feedback...",
  "rows": 4,
  "maxLength": 500
}
```

#### 7. Slider Widget
```json
{
  "type": "slider",
  "min": 0,
  "max": 100,
  "defaultValue": 50,
  "step": 1,
  "label": "Select a value"
}
```

#### 8. Date Widget
```json
{
  "type": "date",
  "value": "2024-01-15",
  "required": true
}
```

#### 9. Color Picker Widget
```json
{
  "type": "color_picker",
  "defaultColor": "#667eea",
  "presetColors": ["#667eea", "#764ba2", "#f093fb"]
}
```

#### 10. Toggle Widget
```json
{
  "type": "toggle",
  "defaultValue": false,
  "label": "Enable notifications"
}
```

#### 11. Tags Widget
```json
{
  "type": "tags",
  "placeholder": "Add tags...",
  "suggestions": ["javascript", "chat", "widget"]
}
```

#### 12. File Upload Widget
```json
{
  "type": "file_upload",
  "accept": ".jpg,.png,.pdf",
  "multiple": false,
  "maxSize": "5MB"
}
```

#### 13. Radio Widget
```json
{
  "type": "radio",
  "options": [
    { "id": "rad1", "text": "Choice A", "value": "choice_a" },
    { "id": "rad2", "text": "Choice B", "value": "choice_b" }
  ],
  "buttonText": "Submit Choice"
}
```

#### 14. Confirmation Widget
```json
{
  "type": "confirmation",
  "title": "Confirm Action",
  "message": "Are you sure you want to proceed?",
  "confirmText": "Yes",
  "cancelText": "No"
}
```

#### 15. Progress Widget
```json
{
  "type": "progress",
  "value": 75,
  "max": 100,
  "showPercentage": true
}
```

### Widget Interaction Handling

When users interact with widgets, the widget dispatches a custom event that you can listen for:

```javascript
window.addEventListener('widgetInteraction', (event) => {
  const { widgetId, widgetType, optionId, optionValue, optionText } = event.detail;
  
  // Send interaction data to your backend
  fetch('/api/widget-interaction', {
    method: 'POST',
    body: JSON.stringify({
      widgetType,
      optionId,
      optionValue,
      optionText,
      sessionKey: getSessionKey()
    })
  });
});
```

---

## Session Management

### Session Key Storage
- The widget stores session keys in `localStorage` under the key `chat_session_key`
- Session keys are automatically included in all API requests
- For WebSocket connections, the session key is established during handshake

### Session Lifecycle
1. **Handshake**: Client initiates, server responds with session key
2. **Connection**: Client uses session key for all subsequent requests
3. **Reconnection**: WebSocket automatically reconnects with existing session key
4. **Timeout**: Implement server-side session timeout as needed

---

## Error Handling

### JSONP Errors
```javascript
handshakeCallback_1234567890({
  "status": "error",
  "error": "Session expired",
  "message": "Please refresh and try again"
});
```

### WebSocket Errors
```json
{
  "type": "error",
  "message": "Session expired",
  "code": 401
}
```

### Common Error Scenarios
- Invalid session key
- Session timeout
- Rate limiting
- Server maintenance

---

## Security Considerations

### JSONP Security
- Validate callback names to prevent XSS
- Use allowlist for callback function patterns
- Set appropriate CORS headers

### Session Security
- Generate cryptographically secure session keys
- Implement session expiration
- Validate session keys on each request
- Use HTTPS in production

### Input Validation
- Sanitize all user inputs
- Validate widget data structures
- Implement rate limiting

---

## Implementation Examples

### Node.js with Express (JSONP)

```javascript
const express = require('express');
const app = express();

app.get('/api/handshake', (req, res) => {
  const callback = req.query.callback;
  const sessionKey = generateSessionKey();
  
  const response = {
    status: 'success',
    session_key: sessionKey,
    message: 'Welcome to our chat service!'
  };
  
  res.type('application/javascript');
  res.send(`${callback}(${JSON.stringify(response)})`);
});

app.get('/api/messages', (req, res) => {
  const { callback, message, session_key, type } = req.query;
  
  // Validate session
  if (!isValidSession(session_key)) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  
  let response;
  
  if (message) {
    response = processMessage(message, session_key);
  } else if (type === 'connect') {
    response = { text: 'Connected! How can I help?', sender: 'bot' };
  }
  
  res.type('application/javascript');
  res.send(`${callback}(${JSON.stringify(response)})`);
});
```

### Node.js with WebSocket

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  let sessionKey = null;
  
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    
    switch (message.type) {
      case 'handshake':
        sessionKey = generateSessionKey();
        ws.send(JSON.stringify({
          type: 'handshake',
          status: 'success',
          session_key: sessionKey,
          timestamp: Date.now()
        }));
        break;
        
      case 'message':
        const response = processMessage(message.payload, sessionKey);
        ws.send(JSON.stringify({
          type: 'message',
          text: response.text,
          widget: response.widget,
          timestamp: Date.now()
        }));
        break;
        
      case 'typing':
        // Handle typing indicators
        broadcastTypingIndicator(sessionKey, message.payload.typing);
        break;
    }
  });
});
```

### Python with Flask (JSONP)

```python
from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

@app.route('/api/handshake')
def handshake():
    callback = request.args.get('callback')
    session_key = str(uuid.uuid4())
    
    response = {
        'status': 'success',
        'session_key': session_key,
        'message': 'Welcome to our chat service!'
    }
    
    return f"{callback}({json.dumps(response)})", 200, {'Content-Type': 'application/javascript'}

@app.route('/api/messages')
def messages():
    callback = request.args.get('callback')
    message = request.args.get('message')
    session_key = request.args.get('session_key')
    
    if not is_valid_session(session_key):
        error_response = {'error': 'Invalid session'}
        return f"{callback}({json.dumps(error_response)})", 401, {'Content-Type': 'application/javascript'}
    
    if message:
        response = process_message(message, session_key)
    else:
        response = {'text': 'Connected! How can I help?', 'sender': 'bot'}
    
    return f"{callback}({json.dumps(response)})", 200, {'Content-Type': 'application/javascript'}
```

---

## Testing Your Backend

### Test with the Demo Client

1. Start your backend server
2. Update the demo HTML to point to your server:
   ```html
   <script data-server-url="http://localhost:3000" src="chat-widget.js"></script>
   ```
3. Open the demo page and test the interaction

### Test Endpoints Directly

**JSONP Handshake Test:**
```bash
curl "http://localhost:3000/api/handshake?callback=testCallback"
```

**JSONP Message Test:**
```bash
curl "http://localhost:3000/api/messages?callback=testCallback&message=hello&session_key=test123"
```

**WebSocket Test:**
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'handshake', timestamp: Date.now() }));
};
ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

---

## Deployment Considerations

### Production Checklist
- [ ] Use HTTPS/WSS for all connections
- [ ] Implement proper session management
- [ ] Add rate limiting and abuse prevention
- [ ] Set up monitoring and logging
- [ ] Configure CORS headers properly
- [ ] Implement health checks
- [ ] Set up load balancing if needed

### Scaling Considerations
- Use Redis or similar for session storage in distributed environments
- Implement WebSocket connection pooling
- Consider message queues for handling high-volume chat traffic
- Monitor WebSocket connection limits

---

## Troubleshooting

### Common Issues

**Widget not loading:**
- Check that the server URL is accessible
- Verify CORS headers are set correctly
- Ensure the callback parameter is handled properly

**Session issues:**
- Verify session keys are being generated and stored correctly
- Check session validation logic
- Ensure session keys are included in all requests

**WebSocket connection failures:**
- Verify WebSocket server is running on correct port
- Check firewall and proxy configurations
- Ensure WSS certificate is valid for HTTPS sites

**Widget rendering issues:**
- Validate widget JSON structure
- Check that all required fields are present
- Verify widget types match supported types

### Debug Mode

Enable debug logging in the widget:
```html
<script data-debug="true" src="chat-widget.js"></script>
```

This will output detailed logs to the browser console for troubleshooting.

---

## Support

For additional support:
- Check the test files in `/tests/` for expected API behaviors
- Review the demo implementations in `/netlify/functions/`
- Examine the widget source code in `/src/modules/`
- Run the test suite: `npm test`

---

*This guide covers the complete backend API specification for ChatUI. For frontend integration details, see the main README.md file.*
