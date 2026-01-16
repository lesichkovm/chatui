# Playwright Tests

This directory contains Playwright tests for the Chat Widget application.

## Test Files

- `chat-widget.spec.ts` - Basic widget functionality tests
- `widget-customization.spec.ts` - Widget customization tests (position, color, title)
- `multiple-widgets.spec.ts` - Multiple widgets on same page tests
- `chat-messages.spec.ts` - Chat message functionality tests

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests with Playwright UI
```bash
npm run test:ui
```

### Debug tests
```bash
npm run test:debug
```

## Test Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Base URL**: http://localhost:32000
- **Test Directory**: ./tests
- **Browsers**: Chromium, Firefox, WebKit
- **Server**: Automatically starts an HTTP server on port 32000

## Test Coverage

### Basic Functionality
- Widget button visibility
- Opening/closing chat window
- Toggle functionality
- Header and input visibility

### Customization
- Widget positioning (bottom-right, bottom-left)
- Custom colors
- Custom titles

### Multiple Widgets
- Independent widget states
- Simultaneous widget usage
- Different configurations per widget

### Message Functionality
- Typing and sending messages
- Message display
- Message history persistence
- Enter key support
- Multiple messages handling
- Auto-scroll to latest message
