# ChatUI Widget

A simple, embedded, API-agnostic chat UI widget with JSONP support for cross-domain communication.

## Features

- **Lightweight & Fast**: Built with vanilla JavaScript, zero heavy dependencies.
- **Cross-Domain Support**: Native JSONP support allows easy integration with any backend.
- **Secure**: Input sanitization and secure callback handling.
- **Customizable**: Configurable position, colors, and titles via data attributes or CSS.
- **Multiple Modes**: Supports 'popup' (default) and 'fullpage' modes.
- **Modular Architecture**: Built with modern ES6 classes and modules.

## Installation & Usage

To add the chat widget to your website, include the script tag pointing to the bundled widget file:

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-position="bottom-right"
  data-color="#007bff"
  data-title="Chat with us">
</script>
```

### Configuration Options

The widget is configured via data attributes on the script tag:

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-server-url` | Base URL of the chat backend API | `http://localhost:3000` |
| `data-mode` | Display mode: `popup` or `fullpage` | `popup` |
| `data-position` | Corner position: `bottom-right`, `bottom-left`, `top-right`, `top-left` | `bottom-right` |
| `data-color` | Primary theme color (Hex code) | `#007bff` |
| `data-title` | Title text displayed in the header | `Chat with us` |
| `data-target` | Selector for container element (only for `fullpage` mode) | `null` |

## API Integration

The widget expects a backend that supports the following endpoints (compatible with JSONP):

### Handshake
`GET /api/handshake?callback=cb`
Response: `{ status: "success", session_key: "..." }`

### Send/Receive Messages
`GET /api/messages?callback=cb&message=...&session_key=...`
Response: `{ text: "Response message", sender: "bot" }`

## Development

This project uses a modular architecture bundled with `esbuild`.

### Prerequisites
- Node.js installed

### Setup
```bash
npm install
```

### Build
To build the distribution file (`dist/chat-widget.js`):
```bash
node scripts/build.js
```

### Testing
Run the Playwright end-to-end tests:
```bash
npm test
```

## Architecture

The project is structured as follows:
- `src/modules/`: Individual source modules (API, UI, Utils, Class)
- `src/entry.js`: Entry point for the bundler
- `dist/chat-widget.js`: Generated bundle (do not edit directly)
- `tests/`: Playwright test suites

## Security Features

- Callback validation to prevent XSS
- Message sanitization
- Proper Content-Type headers