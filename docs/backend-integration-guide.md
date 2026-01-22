---
path: backend-integration-guide.md
page-type: reference
summary: Backend integration reference for ChatUI including CORS, JSONP fallback, WebSocket, and composable widget responses.
tags: [backend, api, cors, jsonp, websocket, widgets]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# Backend Integration Guide

ChatUI is a frontend-only widget that connects to your backend over **WebSocket** or **HTTP** (CORS) with **automatic JSONP fallback** when CORS fails. This guide documents the required endpoints, request/response formats, and the widget message schema.

---

## Transport Selection (How ChatUI Chooses)

ChatUI selects the transport based on the `serverUrl` protocol:

- `wss://` or `ws://` → **WebSocket**
- `https://` or `http://` → **CORS (fetch)** with **JSONP fallback** on CORS/network errors

---

## CORS (HTTP/HTTPS) API

### Base URL
```
https://your-server.com
```

### Required Endpoints

#### 1) Handshake
`POST /api/handshake`

**Request Body**
```json
{
  "type": "handshake",
  "timestamp": 1234567890
}
```

**Response**
```json
{
  "status": "success",
  "session_key": "unique_session_id"
}
```

#### 2) Connect
`POST /api/messages`

**Request Body**
```json
{
  "type": "connect",
  "session_key": "unique_session_id",
  "timestamp": 1234567890
}
```

**Response (Composable - Preferred)**
```json
{
  "status": "success",
  "widgets": [
    {
      "type": "text",
      "props": { "content": "Welcome!", "format": "plain" }
    }
  ]
}
```

**Response (Legacy - Supported)**
```json
{
  "status": "success",
  "text": "Welcome!",
  "sender": "bot"
}
```

#### 3) Message
`POST /api/messages`

**Request Body**
```json
{
  "type": "message",
  "message": "Hello",
  "session_key": "unique_session_id",
  "timestamp": 1234567890
}
```

**Response (Composable - Preferred)**
```json
{
  "status": "success",
  "widgets": [
    {
      "type": "card",
      "children": [
        { "type": "text", "props": { "content": "How can we help?", "format": "plain" } },
        {
          "type": "buttons",
          "props": {
            "options": [
              { "id": "sales", "text": "Sales", "value": "sales" },
              { "id": "support", "text": "Support", "value": "support" }
            ]
          }
        }
      ]
    }
  ]
}
```

**Response (Legacy - Supported)**
```json
{
  "status": "success",
  "text": "Choose an option",
  "sender": "bot",
  "widget": {
    "type": "buttons",
    "options": [
      { "id": "sales", "text": "Sales", "value": "sales" },
      { "id": "support", "text": "Support", "value": "support" }
    ]
  }
}
```

### CORS Requirements

- Responses must be JSON.
- Recommended headers:
  - `Content-Type: application/json`
  - `Access-Control-Allow-Origin: https://your-site.com` (or `*` if appropriate)
  - `Access-Control-Allow-Methods: POST, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type`

---

## JSONP (Legacy Fallback)

When CORS fails, ChatUI falls back to JSONP.

### Handshake
`GET /api/handshake?callback=cbName`

**Response**
```javascript
cbName({
  "status": "success",
  "session_key": "unique_session_id"
});
```

### Connect
`GET /api/messages?callback=cbName&type=connect&session_key=...`

**Response (Legacy format only)**
```javascript
cbName({
  "text": "Welcome!",
  "sender": "bot"
});
```

### Message
`GET /api/messages?callback=cbName&type=message&message=...&session_key=...`

**Response (Legacy format only)**
```javascript
cbName({
  "text": "Thanks for your message!",
  "sender": "bot",
  "widget": {
    "type": "rating",
    "maxRating": 5
  }
});
```

> JSONP uses the legacy single-widget response format.

---

## WebSocket API (WS/WSS)

### Connection URL
```
wss://your-server.com/ws
```

### Client → Server

```json
{
  "type": "handshake|connect|message|typing|read_receipt",
  "payload": "...",
  "session_key": "unique_session_id",
  "timestamp": 1234567890
}
```

Examples:

**Handshake**
```json
{ "type": "handshake", "timestamp": 1234567890 }
```

**Connect**
```json
{ "type": "connect", "session_key": "unique_session_id", "timestamp": 1234567890 }
```

**Message**
```json
{
  "type": "message",
  "payload": "Hello",
  "session_key": "unique_session_id",
  "timestamp": 1234567890
}
```

**Typing**
```json
{
  "type": "typing",
  "payload": { "typing": true },
  "session_key": "unique_session_id",
  "timestamp": 1234567890
}
```

**Read Receipt**
```json
{
  "type": "read_receipt",
  "payload": { "message_id": "msg_123" },
  "session_key": "unique_session_id",
  "timestamp": 1234567890
}
```

### Server → Client

```json
{
  "type": "handshake|message|message:stream|typing|read_receipt",
  "text": "...",
  "widgets": [ ... ],
  "session_key": "...",
  "timestamp": 1234567890
}
```

**Composable Message**
```json
{
  "type": "message",
  "widgets": [
    { "type": "text", "props": { "content": "Welcome!", "format": "plain" } }
  ],
  "timestamp": 1234567890
}
```

**Legacy Message**
```json
{
  "type": "message",
  "text": "Welcome!",
  "sender": "bot",
  "timestamp": 1234567890
}
```

**Streaming (Optional)**
```json
{
  "type": "message:stream",
  "text": "Partial response...",
  "timestamp": 1234567890
}
```

---

## Widget Message Format

### Preferred: Composable Widgets

```json
{
  "status": "success",
  "widgets": [
    {
      "type": "container",
      "props": { "layout": "vertical", "gap": "medium" },
      "children": [
        { "type": "text", "props": { "content": "Quick question:", "format": "plain" } },
        {
          "type": "select",
          "props": {
            "placeholder": "Pick one",
            "options": [
              { "id": "a", "text": "Option A", "value": "a" },
              { "id": "b", "text": "Option B", "value": "b" }
            ]
          }
        }
      ]
    }
  ]
}
```

### Legacy: Single Widget

```json
{
  "text": "Pick a date",
  "sender": "bot",
  "widget": {
    "type": "date",
    "value": "2026-01-01"
  }
}
```

---

## Widget Interaction Events (Frontend)

When users interact with widgets, ChatUI emits:

### `widgetInteraction`
```json
{
  "widgetId": "chat-widget-xyz",
  "optionId": "support",
  "optionValue": "support",
  "optionText": "Support",
  "widgetType": "buttons"
}
```

### `widgetValueChanged`
```json
{
  "widgetId": "chat-widget-xyz",
  "value": "alice@example.com",
  "widgetType": "input"
}
```

Use these payloads to determine how your backend should respond with the next widget tree.

---

## Notes & Best Practices

- **Always return JSON** for CORS endpoints.
- **Prefer `widgets` array** for new integrations.
- **Keep `session_key` stable** across requests.
- **Use JSONP only as fallback** (legacy behavior).
- **WebSocket** is recommended for real-time UX (typing, streaming, receipts).