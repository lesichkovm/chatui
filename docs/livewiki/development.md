---
path: development.md
page-type: tutorial
summary: Development workflow, testing, and contributing guidelines for ChatUI.
tags: [development, testing, contributing, workflow]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Development

This guide covers the development workflow, testing procedures, and contribution guidelines for ChatUI.

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- Modern web browser

### 1. Clone the Repository

```bash
git clone https://github.com/lesichkovm/chatui.git
cd chatui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

Start the demo server for testing:

```bash
npm run start:demo
```

Open `demo/demo.html` in your browser to see the widget in action.

## Project Structure

```
chatui/
├── src/                    # Source code
│   ├── entry.js           # Entry point and initialization
│   └── modules/           # Core modules
│       ├── api.js         # API abstraction layer
│       ├── api-cors.js    # CORS transport
│       ├── api-legacy.js  # JSONP transport
│       ├── chat-widget.class.js  # Main widget class
│       ├── theme.js       # Theme system
│       ├── ui.js          # UI management
│       ├── utils.js       # Utility functions
│       └── widgets/       # Widget components
│           ├── base-widget.js    # Base widget class
│           ├── widget-factory.js  # Widget factory
│           └── [component-widgets].js
├── demo/                  # Demo files
│   ├── server.js          # Demo server
│   └── demo.html          # Demo page
├── dist/                  # Built distribution files
├── tests/                 # Test files
├── scripts/               # Build scripts
└── docs/                  # Documentation
```

## Build Process

### Development Build

```bash
npm run build
```

This creates:
- `dist/chat-widget.js` - Development bundle
- `dist/chat-widget.min.js` - Minified production bundle

### Build Script

The build process uses ESBuild for fast compilation:

```javascript
// scripts/build.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/entry.js'],
  bundle: true,
  outfile: 'dist/chat-widget.js',
  format: 'iife',
  globalName: 'ChatUIBundle',
  sourcemap: true,
  minify: false,
}).catch(() => process.exit(1));
```

## Testing

### End-to-End Testing

ChatUI uses Playwright for E2E testing:

```bash
# Run all tests
npm test

# Run tests with browser UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

### Test Structure

```
tests/
├── basic-functionality.spec.js    # Basic widget operations
├── api-integration.spec.js        # API communication tests
├── widget-system.spec.js          # Widget component tests
├── configuration.spec.js          # Configuration tests
└── accessibility.spec.js         # Accessibility tests
```

### Writing Tests

```javascript
// tests/basic-functionality.spec.js
const { test, expect } = require('@playwright/test');

test('widget initializes correctly', async ({ page }) => {
  await page.goto('demo/demo.html');
  
  // Wait for widget to load
  await page.waitForSelector('#chat-widget');
  
  // Check widget is present
  const widget = page.locator('#chat-widget');
  await expect(widget).toBeVisible();
  
  // Check default configuration
  const title = page.locator('#chat-widget .header .title');
  await expect(title).toHaveText('Chat with us');
});

test('widget opens and closes', async ({ page }) => {
  await page.goto('demo/demo.html');
  
  // Click to open
  await page.click('#chat-widget .toggle-button');
  await expect(page.locator('#chat-widget.chat-widget.open')).toBeVisible();
  
  // Click to close
  await page.click('#chat-widget .header .close-button');
  await expect(page.locator('#chat-widget.chat-widget.open')).toBeHidden();
});
```

### Local Testing

For quick development testing:

1. Start the demo server:
   ```bash
   npm run start:demo
   ```

2. Open `demo/demo.html` in your browser

3. Use browser dev tools to:
   - Check console for errors
   - Inspect widget DOM structure
   - Monitor network requests
   - Test different configurations

## Widget Development

### Creating a New Widget

1. **Extend Base Widget**

```javascript
// src/modules/widgets/my-widget.js
import { BaseWidget } from './base-widget.js';

export class MyWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.type = 'my-widget';
        this.value = config.defaultValue || '';
    }
    
    render() {
        this.element = this.createElement('div', 'my-widget');
        
        const input = this.createElement('input', 'my-widget-input');
        input.type = 'text';
        input.placeholder = this.config.placeholder || 'Enter value';
        input.value = this.value;
        
        this.element.appendChild(input);
        return this.element;
    }
    
    validate() {
        if (this.config.required && !this.value.trim()) {
            throw new Error('This field is required');
        }
        return true;
    }
    
    getValue() {
        const input = this.element.querySelector('.my-widget-input');
        return input.value;
    }
    
    setValue(value) {
        this.value = value;
        const input = this.element.querySelector('.my-widget-input');
        if (input) input.value = value;
    }
}
```

2. **Register Widget**

```javascript
// src/modules/widgets/index.js
import { MyWidget } from './my-widget.js';

export const widgetRegistry = {
    // ... existing widgets
    'my-widget': MyWidget
};
```

3. **Update Widget Factory**

```javascript
// src/modules/widgets/widget-factory.js
import { widgetRegistry } from './index.js';

export class WidgetFactory {
    static create(type, config) {
        const WidgetClass = widgetRegistry[type];
        if (!WidgetClass) {
            throw new Error(`Unknown widget type: ${type}`);
        }
        return new WidgetClass(config);
    }
    
    static register(type, WidgetClass) {
        widgetRegistry[type] = WidgetClass;
    }
}
```

### Widget Development Guidelines

1. **Always extend BaseWidget**
2. **Implement required methods**: `render()`, `validate()`, `getValue()`
3. **Use consistent CSS classes**: `widget-type`, `widget-type-input`
4. **Emit events for interactions**: `focus`, `blur`, `change`, `submit`
5. **Handle configuration validation**
6. **Provide accessibility support**

### Widget Testing

```javascript
// tests/widget-system.spec.js
test('my-widget renders correctly', async ({ page }) => {
  await page.goto('demo/demo.html');
  
  // Add widget via API
  await page.evaluate(() => {
    window.chat.addWidget('my-widget', {
      placeholder: 'Test input',
      required: true
    });
  });
  
  // Check widget is rendered
  const widget = page.locator('.my-widget');
  await expect(widget).toBeVisible();
  
  // Test input
  const input = page.locator('.my-widget-input');
  await input.fill('test value');
  
  // Test validation
  const submitButton = page.locator('.my-widget-submit');
  await submitButton.click();
  
  // Check value is submitted
  const messages = await page.evaluate(() => window.chat.getMessages());
  expect(messages[messages.length - 1].data.value).toBe('test value');
});
```

## API Development

### Adding a New Transport

1. **Create Transport Class**

```javascript
// src/modules/api-my-transport.js
import { BaseTransport } from './api.js';

export class MyTransport extends BaseTransport {
    constructor(config) {
        super(config);
        this.type = 'my-transport';
    }
    
    async handshake() {
        // Implement handshake logic
        return { status: 'success', session_key: 'abc123' };
    }
    
    async sendMessage(message) {
        // Implement message sending
        return { text: 'Response', sender: 'bot' };
    }
    
    async connect() {
        // Implement connection logic
        return true;
    }
    
    disconnect() {
        // Implement disconnection logic
    }
}
```

2. **Register Transport**

```javascript
// src/modules/api.js
import { MyTransport } from './api-my-transport.js';

export class API {
    detectTransport(url) {
        if (url.startsWith('my-protocol://')) {
            return new MyTransport(this.config);
        }
        // ... existing transport detection
    }
}
```

## Theme Development

### Custom Theme Creation

1. **CSS Variables**

```css
#chat-widget.my-theme {
  --chatui-primary-color: #6366f1;
  --chatui-background-color: #ffffff;
  --chatui-text-color: #1f2937;
  --chatui-border-color: #e5e7eb;
  --chatui-shadow: 0 10px 25px rgba(0,0,0,0.1);
  --chatui-border-radius: 12px;
  --chatui-font-family: 'Inter', sans-serif;
}
```

2. **Component Styling**

```css
#chat-widget.my-theme .header {
  background: var(--chatui-primary-color);
  border-radius: var(--chatui-border-radius) var(--chatui-border-radius) 0 0;
}

#chat-widget.my-theme .message.user {
  background: var(--chatui-primary-color);
  color: white;
}

#chat-widget.my-theme .message.bot {
  background: var(--chatui-background-color);
  border: 1px solid var(--chatui-border-color);
}
```

3. **Theme Registration**

```javascript
// src/modules/theme.js
export class Theme {
    constructor(config) {
        this.themes = {
            'my-theme': {
                primaryColor: '#6366f1',
                backgroundColor: '#ffffff',
                textColor: '#1f2937'
            }
        };
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (theme) {
            this.container.className = `chat-widget ${themeName}`;
            this.setCSSVariables(theme);
        }
    }
}
```

## Debugging

### Debug Mode

Enable debug mode for detailed logging:

```javascript
window.ChatUI.debug = true;
```

### Common Debugging Techniques

1. **Console Logging**

```javascript
// Add to your widget or module
if (window.ChatUI?.debug) {
    console.log('MyWidget: Render called', this.config);
}
```

2. **Event Monitoring**

```javascript
// Monitor all widget events
window.addEventListener('chatwidget:*', (event) => {
    console.log(`Event: ${event.type}`, event.detail);
});
```

3. **Network Inspection**

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

## Performance Optimization

### Bundle Size Optimization

1. **Tree Shaking**

```javascript
// Only import needed widgets
import { RatingWidget } from './widgets/rating-widget.js';
import { DateWidget } from './widgets/date-widget.js';
```

2. **Code Splitting**

```javascript
// Load widgets on demand
async function loadWidget(type) {
    const module = await import(`./widgets/${type}-widget.js`);
    return module.default;
}
```

### Runtime Optimization

1. **Event Delegation**

```javascript
// Use single event listener for multiple widgets
this.container.addEventListener('click', (event) => {
    const widget = event.target.closest('[data-widget]');
    if (widget) {
        this.handleWidgetClick(widget);
    }
});
```

2. **DOM Batching**

```javascript
// Batch DOM updates
const updates = [];
updates.push(() => this.updateMessages());
updates.push(() => this.updateWidgets());

requestAnimationFrame(() => {
    updates.forEach(update => update());
});
```

## Contributing

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Make your changes**
4. **Add tests**
5. **Run tests**
   ```bash
   npm test
   ```
6. **Build the project**
   ```bash
   npm run build
   ```
7. **Commit changes**
   ```bash
   git commit -m "Add my new feature"
   ```
8. **Push to branch**
   ```bash
   git push origin feature/my-new-feature
   ```
9. **Create Pull Request**

### Code Style Guidelines

1. **Use ES6+ syntax**
2. **Follow JavaScript Standard Style**
3. **Use meaningful variable names**
4. **Add JSDoc comments for public methods**
5. **Keep functions small and focused**

### Commit Message Format

```
type(scope): description

feat(widgets): add rating widget component
fix(api): handle CORS errors properly
docs(readme): update installation instructions
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `test`: Test additions
- `chore`: Maintenance

## Release Process

1. **Update version in package.json**
2. **Update CHANGELOG.md**
3. **Create git tag**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. **Build distribution**
   ```bash
   npm run build
   ```
5. **Publish to npm** (if applicable)
   ```bash
   npm publish
   ```

## See Also

- [Architecture](architecture.md) - System design overview
- [API Reference](api_reference.md) - Complete API documentation
- [Configuration](configuration.md) - All configuration options
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
