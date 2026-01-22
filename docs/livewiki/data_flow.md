---
path: data_flow.md
page-type: overview
summary: How data moves through the ChatUI system from user input to server responses.
tags: [data-flow, architecture, communication, events]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Data Flow

Understanding how data flows through ChatUI is essential for debugging, customization, and extension. This document traces the complete data lifecycle from user interactions to server responses.

## High-Level Data Flow

```mermaid
graph TB
    subgraph "User Interaction"
        A[User Input]
        B[Widget Interaction]
        C[UI Events]
    end
    
    subgraph "Widget Processing"
        D[Event Handler]
        E[Data Validation]
        F[Message Formatting]
    end
    
    subgraph "Communication Layer"
        G[Transport Selection]
        H[Request Formatting]
        I[Network Request]
    end
    
    subgraph "Server Processing"
        J[Server Handler]
        K[Business Logic]
        L[Response Generation]
    end
    
    subgraph "Response Processing"
        M[Response Parsing]
        N[Data Validation]
        O[UI Updates]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> A
```

## Message Flow Sequence

### 1. User Input Processing

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UI Layer
    participant W as ChatWidget
    participant API as API Layer
    participant S as Server
    
    U->>UI: Types message
    UI->>UI: Validate input
    UI->>W: sendMessage(text)
    W->>W: Format message
    W->>API: send(message)
    API->>S: HTTP/WebSocket request
    S->>API: Response
    API->>W: Process response
    W->>UI: renderMessage()
    UI->>U: Display response
```

### 2. Widget Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant WG as Widget
    participant WF as Widget Factory
    participant W as ChatWidget
    participant API as API Layer
    
    U->>WG: Interact with widget
    WG->>WG: Validate input
    WG->>WF: emit('submitted', data)
    WF->>W: handleWidgetSubmit(data)
    W->>W: Format widget data
    W->>API: sendWidgetMessage(data)
    API->>W: Response
    W->>UI: Update UI
```

## Transport Layer Data Flow

### CORS Transport Flow

```mermaid
sequenceDiagram
    participant W as ChatWidget
    participant CORS as CORS API
    participant S as Server
    
    W->>CORS: sendMessage(message)
    CORS->>CORS: Add session key
    CORS->>CORS: Format request
    CORS->>S: POST /api/messages
    S->>CORS: JSON response
    CORS->>CORS: Parse response
    CORS->>W: Processed response
```

**Request Format:**
```json
{
    "type": "message",
    "message": "Hello world",
    "session_key": "abc123...",
    "timestamp": 1234567890
}
```

**Response Format:**
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

### JSONP Transport Flow

```mermaid
sequenceDiagram
    participant W as ChatWidget
    participant JSONP as JSONP API
    participant S as Server
    
    W->>JSONP: sendMessage(message)
    JSONP->>JSONP: Create callback
    JSONP->>S: GET /api/messages?callback=cb&message=...
    S->>JSONP: JSONP response
    JSONP->>JSONP: Execute callback
    JSONP->>W: Processed response
```

**Request URL:**
```
GET /api/messages?callback=chatui_cb_123&message=Hello&session_key=abc123
```

**Response Format:**
```javascript
chatui_cb_123({
    "text": "Response message",
    "sender": "bot"
});
```

### WebSocket Transport Flow

```mermaid
sequenceDiagram
    participant W as ChatWidget
    participant WS as WebSocket API
    participant S as WebSocket Server
    
    W->>WS: connect()
    WS->>S: WebSocket connection
    S->>WS: Connection established
    
    W->>WS: sendMessage(message)
    WS->>S: JSON message
    S->>WS: Response message
    WS->>W: Process response
    
    Note over WS,S: Real-time events
    S->>WS: typing indicator
    WS->>W: emit('typing')
```

**Message Format:**
```json
{
    "type": "message",
    "payload": {
        "text": "Hello world"
    },
    "session_key": "abc123...",
    "timestamp": 1234567890
}
```

## Event Flow Architecture

### Event Emission Chain

```mermaid
graph LR
    A[User Action] --> B[DOM Event]
    B --> C[UI Event Handler]
    C --> D[Custom Event]
    D --> E[Widget Event]
    E --> F[API Event]
    F --> G[Server Event]
    G --> H[Response Event]
    H --> I[UI Update Event]
    I --> J[DOM Update]
```

### Event Types and Flow

#### 1. User Interface Events
```javascript
// DOM Events
element.addEventListener('click', handleClick);
element.addEventListener('keydown', handleKeydown);

// Custom UI Events
this.emit('ui:message_send', { text: message });
this.emit('ui:widget_submit', { widgetId, data });
```

#### 2. Widget Events
```javascript
// Widget Creation
this.emit('widget:created', { widgetId, type, config });

// Widget Interaction
this.emit('widget:focus', { widgetId });
this.emit('widget:blur', { widgetId });
this.emit('widget:submit', { widgetId, data });
```

#### 3. Communication Events
```javascript
// API Events
this.emit('api:request', { type, data });
this.emit('api:response', { data });
this.emit('api:error', { error });

// Connection Events
this.emit('connection:established');
this.emit('connection:lost');
this.emit('connection:error', { error });
```

#### 4. Global Events
```javascript
// Window Events
window.dispatchEvent(new CustomEvent('chatwidget:message', {
    detail: { message, sender, type }
}));

window.dispatchEvent(new CustomEvent('chatwidget:connected'));
```

## State Management Flow

### Configuration State Flow

```mermaid
graph TB
    A[HTML Data Attributes] --> B[Config Parser]
    C[JavaScript Config] --> B
    B --> D[Merged Config]
    D --> E[Validation]
    E --> F[Final Config]
    F --> G[Module Initialization]
```

### Session State Flow

```mermaid
graph TB
    A[Widget Init] --> B[Handshake Request]
    B --> C[Session Key Response]
    C --> D[Session Storage]
    D --> E[Message Requests]
    E --> F[Session Validation]
    F --> G[State Updates]
```

### UI State Flow

```mermaid
graph TB
    A[User Action] --> B[UI State Change]
    B --> C[DOM Update]
    C --> D[Visual Update]
    D --> E[User Feedback]
    E --> F[Next Action]
```

## Data Validation Flow

### Input Validation Chain

```mermaid
graph LR
    A[Raw Input] --> B[Widget Validation]
    B --> C[Type Validation]
    C --> D[Format Validation]
    D --> E[Business Rules]
    E --> F[Sanitization]
    F --> G[Validated Data]
```

### Response Validation Chain

```mermaid
graph LR
    A[Server Response] --> B[Format Check]
    B --> C[Schema Validation]
    C --> D[Security Check]
    D --> E[Data Parsing]
    E --> F[Validated Response]
```

## Error Handling Flow

### Error Propagation

```mermaid
graph TB
    A[Error Source] --> B[Local Handler]
    B --> C[Error Classification]
    C --> D[Recovery Strategy]
    D --> E[User Notification]
    E --> F[Logging]
    F --> G[State Recovery]
```

### Error Types and Handling

#### 1. Network Errors
```javascript
try {
    await this.api.sendMessage(message);
} catch (error) {
    if (error.type === 'network') {
        this.handleNetworkError(error);
    } else if (error.type === 'timeout') {
        this.handleTimeoutError(error);
    }
}
```

#### 2. Validation Errors
```javascript
function validateMessage(message) {
    if (!message || message.trim().length === 0) {
        throw new ValidationError('Message cannot be empty');
    }
    if (message.length > 1000) {
        throw new ValidationError('Message too long');
    }
    return true;
}
```

#### 3. Widget Errors
```javascript
try {
    const widget = this.addWidget(type, config);
} catch (error) {
    this.emit('widget:error', { type, error });
    this.showErrorMessage('Failed to create widget');
}
```

## Performance Optimization Flow

### Message Batching

```mermaid
graph LR
    A[Multiple Messages] --> B[Batch Queue]
    B --> C[Batch Timer]
    C --> D[Batch Request]
    D --> E[Batch Response]
    E --> F[Individual Updates]
```

### DOM Update Batching

```mermaid
graph LR
    A[Multiple Updates] --> B[Update Queue]
    B --> C[Request Animation Frame]
    C --> D[Batch DOM Updates]
    D --> E[Single Reflow]
```

## Debugging Data Flow

### Debug Event Tracking

```javascript
// Enable debug mode
window.ChatUI.debug = true;

// Track all events
window.addEventListener('chatwidget:*', (event) => {
    console.log(`Event: ${event.type}`, event.detail);
});
```

### Network Request Debugging

```javascript
// Intercept API calls
const originalSend = API.prototype.send;
API.prototype.send = function(data) {
    console.log('API Request:', data);
    return originalSend.call(this, data).then(response => {
        console.log('API Response:', response);
        return response;
    });
};
```

## See Also

- [Architecture](architecture.md) - System design overview
- [API Reference](api_reference.md) - Complete API documentation
- [Configuration](configuration.md) - All configuration options
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
