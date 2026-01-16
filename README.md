# Go Chat Server (2025)

A simple embedded chat UI widget with JSONP support for cross-domain communication.

## Features

- JSONP support for cross-domain requests
- Secure callback validation
- Message sanitization
- In-memory message storage
- CORS support
- Embedded chat widget that's served directly from the server

## Embedding the Chat Widget

To add the chat widget to your website, include the following script tag:

```html
<script 
  id="chat-widget"
  src="http://cdn.chatui.com/chat-widget.js"
  data-api-server="http://your-server.com/api"
  data-position="bottom-right"
  data-color="#007bff"
  data-title="Chat with us">
</script>
```

The widget will automatically connect to the server api, so if the server is down, the widget won't load.

### Configuration Options

- **data-api-server**: The server api url
- **data-position**: Where to position the chat button (top-right, top-left, bottom-right, bottom-left)
- **data-color**: The primary color for the chat widget (hex color)
- **data-title**: The title displayed in the chat window

## API Endpoints

### GET /api/messages

- **JSONP Request**: `http://your-server.com/api/messages?message=Hello&callback=myCallback`
- **Regular Request**: `http://your-server.com/api/messages`

### POST /api/messages

- **Content-Type**: application/json
- **Body**: `{"message": "Hello"}`

## Security Features

- Callback validation to prevent XSS
- Message sanitization
- Comment prefix to prevent script tag hijacking
- Proper Content-Type headers 