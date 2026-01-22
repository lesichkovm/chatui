---
path: conventions.md
page-type: reference
summary: Coding and documentation conventions for ChatUI development and contribution.
tags: [conventions, standards, guidelines, development]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Conventions

This document outlines the coding standards, conventions, and best practices for ChatUI development and contribution.

## Code Style Standards

### JavaScript Conventions

#### ES6+ Standards
- Use modern ES6+ syntax (classes, arrow functions, destructuring)
- Prefer `const` and `let` over `var`
- Use template literals for string interpolation
- Implement proper module imports/exports

```javascript
// ✅ Good
import { BaseWidget } from './base-widget.js';

class MyWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.value = config.defaultValue || '';
    }
    
    render() {
        const element = this.createElement('div', 'my-widget');
        element.textContent = `Value: ${this.value}`;
        return element;
    }
}

export { MyWidget };

// ❌ Bad
function MyWidget(config) {
    this.value = config.defaultValue || '';
}

MyWidget.prototype.render = function() {
    var element = document.createElement('div');
    element.className = 'my-widget';
    element.textContent = 'Value: ' + this.value;
    return element;
};
```

#### Naming Conventions
- **Classes**: PascalCase (`ChatWidget`, `BaseWidget`)
- **Methods**: camelCase (`sendMessage`, `addMessage`)
- **Variables**: camelCase (`sessionKey`, `messageList`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`, `ERROR_TYPES`)
- **Files**: kebab-case (`chat-widget.class.js`, `api-cors.js`)
- **CSS Classes**: kebab-case with BEM methodology (`chat-widget__header`, `chat-widget--open`)

```javascript
// ✅ Good
class ChatWidget {
    constructor(config) {
        this.DEFAULT_TIMEOUT = 5000;
        this.sessionKey = null;
        this.messageList = [];
    }
    
    sendMessage(text) {
        // Implementation
    }
}

// ❌ Bad
class chatwidget {
    constructor(config) {
        this.defaulttimeout = 5000;
        this.sessionkey = null;
        this.messagelist = [];
    }
    
    Send_Message(text) {
        // Implementation
    }
}
```

#### Function and Method Structure
- Keep functions small and focused (single responsibility)
- Use descriptive function names
- Provide JSDoc comments for public methods
- Handle errors appropriately

```javascript
/**
 * Sends a message to the server with optional data.
 * @param {string} text - Message text to send
 * @param {object} data - Optional additional data
 * @returns {Promise<object>} Server response
 * @throws {ValidationError} If message is invalid
 * @throws {NetworkError} If network request fails
 */
async sendMessage(text, data = {}) {
    // Validate input
    if (!text || text.trim().length === 0) {
        throw new ValidationError('Message cannot be empty');
    }
    
    try {
        // Send message
        const response = await this.api.sendMessage(text, data);
        return response;
    } catch (error) {
        throw new NetworkError('Failed to send message', error);
    }
}
```

### CSS Conventions

#### BEM Methodology
Use Block-Element-Modifier methodology for CSS classes:

```css
/* Block */
.chat-widget {}

/* Element */
.chat-widget__header {}
.chat-widget__messages {}
.chat-widget__input {}

/* Modifier */
.chat-widget--open {}
.chat-widget--dark {}
.chat-widget__header--hidden {}
```

#### CSS Custom Properties
Use CSS custom properties for theming:

```css
:root {
    --chatui-primary-color: #007bff;
    --chatui-background-color: #ffffff;
    --chatui-text-color: #333333;
    --chatui-border-radius: 8px;
}

#chat-widget {
    background-color: var(--chatui-background-color);
    border-radius: var(--chatui-border-radius);
}
```

#### Responsive Design
Mobile-first approach with logical breakpoints:

```css
/* Mobile first */
.chat-widget {
    width: 100%;
    max-width: 380px;
}

/* Tablet */
@media (min-width: 768px) {
    .chat-widget {
        width: 380px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .chat-widget {
        width: 420px;
    }
}
```

## File Organization

### Directory Structure
```
src/
├── entry.js                    # Entry point
└── modules/                    # Core modules
    ├── api.js                  # API abstraction
    ├── chat-widget.class.js    # Main widget class
    ├── ui.js                   # UI management
    ├── theme.js                # Theme system
    ├── utils.js                # Utilities
    └── widgets/                # Widget components
        ├── base-widget.js      # Base widget class
        ├── widget-factory.js   # Widget factory
        └── [component-widgets].js
```

### File Naming
- Use kebab-case for all files
- Include `.js` extension for imports
- Use descriptive names that indicate purpose

```javascript
// ✅ Good
import { ChatWidget } from './modules/chat-widget.class.js';
import { BaseWidget } from './modules/widgets/base-widget.js';
import { RatingWidget } from './modules/widgets/rating-widget.js';

// ❌ Bad
import { ChatWidget } from './modules/ChatWidget';
import { BaseWidget } from './modules/widgets/BaseWidget';
import { RatingWidget } from './modules/widgets/rating';
```

### Module Structure
Each module should follow this structure:

```javascript
// 1. Imports
import { BaseWidget } from './base-widget.js';
import { createElement } from '../utils.js';

// 2. Constants
const DEFAULT_CONFIG = {
    max: 5,
    icon: 'star'
};

// 3. Class definition
export class RatingWidget extends BaseWidget {
    // Implementation
}

// 4. Exports
export { RatingWidget };
```

## Documentation Standards

### JSDoc Comments
Use comprehensive JSDoc comments for all public APIs:

```javascript
/**
 * Creates a new chat widget instance with the specified configuration.
 * @class ChatWidget
 * @param {object|string} config - Configuration object or script element
 * @param {string} config.serverUrl - Base URL for chat backend API (required)
 * @param {string} [config.title='Chat with us'] - Header title text
 * @param {string} [config.color='#007bff'] - Primary theme color (hex)
 * @param {string} [config.position='bottom-right'] - Corner position
 * @param {string} [config.displayMode='popup'] - Display mode: 'popup' or 'fullpage'
 * @param {string} [config.themeMode='light'] - Theme mode: 'light', 'dark', or 'auto'
 * @param {function} [config.onOpen] - Callback when widget opens
 * @param {function} [config.onClose] - Callback when widget closes
 * @param {function} [config.onMessage] - Callback when message is received
 * @param {function} [config.onError] - Callback when error occurs
 * @example
 * const chat = new ChatWidget({
 *     serverUrl: 'https://api.example.com',
 *     title: 'Support Chat',
 *     color: '#28a745',
 *     position: 'bottom-left'
 * });
 */
class ChatWidget {
    // Implementation
}
```

### README Documentation
Each module should have clear documentation explaining:
- Purpose and responsibilities
- Public API methods
- Usage examples
- Configuration options
- Event handling

### Code Comments
Use inline comments for complex logic:

```javascript
// Validate configuration before initialization
if (!config.serverUrl) {
    throw new Error('serverUrl is required');
}

// Auto-detect transport based on URL protocol
const transport = this.detectTransport(config.serverUrl);

// Set up event delegation for better performance
this.container.addEventListener('click', this.handleClick.bind(this));
```

## Error Handling Conventions

### Error Types
Use specific error types for different scenarios:

```javascript
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

class NetworkError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'NetworkError';
        this.originalError = originalError;
    }
}

class ConfigurationError extends Error {
    constructor(message, option) {
        super(message);
        this.name = 'ConfigurationError';
        this.option = option;
    }
}
```

### Error Handling Pattern
Follow consistent error handling patterns:

```javascript
async sendMessage(text, data) {
    try {
        // Validate input
        this.validateMessage(text);
        
        // Send message
        const response = await this.api.sendMessage(text, data);
        
        // Handle response
        this.handleResponse(response);
        
        return response;
        
    } catch (error) {
        // Classify and handle error
        if (error instanceof ValidationError) {
            this.handleValidationError(error);
        } else if (error instanceof NetworkError) {
            this.handleNetworkError(error);
        } else {
            this.handleGenericError(error);
        }
        
        // Emit error event
        this.emit('error', { error, context: 'sendMessage' });
        
        // Re-throw if needed
        throw error;
    }
}
```

## Event System Conventions

### Event Naming
Use consistent event naming with prefixes:

```javascript
// Widget lifecycle events
'widget:created'
'widget:mounted'
'widget:destroyed'

// User interaction events
'widget:focus'
'widget:blur'
'widget:change'
'widget:submit'

// System events
'system:connected'
'system:disconnected'
'system:error'
```

### Event Data Structure
Use consistent event data structure:

```javascript
// Standard event data
{
    type: 'widget:submit',
    timestamp: 1234567890,
    data: {
        widgetId: 'rating-123',
        value: 5,
        metadata: {}
    }
}
```

### Event Emission Pattern
```javascript
class BaseWidget {
    emit(event, data) {
        const eventData = {
            type: event,
            timestamp: Date.now(),
            data: data || {}
        };
        
        // Emit to window for global listeners
        const customEvent = new CustomEvent(`chatwidget:${event}`, {
            detail: eventData
        });
        window.dispatchEvent(customEvent);
        
        // Emit to internal listeners
        this.emitInternal(event, eventData);
    }
}
```

## Testing Conventions

### Test Structure
Use descriptive test names and clear structure:

```javascript
describe('ChatWidget', () => {
    describe('constructor', () => {
        it('should initialize with default configuration', () => {
            const widget = new ChatWidget({});
            expect(widget.getConfig().serverUrl).toBe('http://localhost:3000');
        });
        
        it('should throw error when serverUrl is missing', () => {
            expect(() => new ChatWidget({ serverUrl: null }))
                .toThrow('serverUrl is required');
        });
    });
    
    describe('sendMessage', () => {
        it('should send message to server', async () => {
            const widget = new ChatWidget(mockConfig);
            const response = await widget.sendMessage('Hello');
            expect(response.text).toBeDefined();
        });
        
        it('should validate message before sending', () => {
            const widget = new ChatWidget(mockConfig);
            expect(() => widget.sendMessage(''))
                .toThrow('Message cannot be empty');
        });
    });
});
```

### Test Data
Use consistent test data patterns:

```javascript
const mockConfig = {
    serverUrl: 'https://test-api.example.com',
    title: 'Test Chat',
    color: '#007bff'
};

const mockMessage = {
    id: 'msg-123',
    text: 'Hello, world!',
    sender: 'user',
    type: 'text',
    timestamp: Date.now()
};
```

## Git Conventions

### Commit Message Format
Use conventional commit messages:

```
type(scope): description

feat(widgets): add rating widget component
fix(api): handle CORS errors properly
docs(readme): update installation instructions
style(css): improve button hover states
refactor(theme): simplify color management
test(e2e): add widget interaction tests
chore(build): update esbuild configuration
```

### Branch Naming
Use descriptive branch names:

```
feature/rating-widget
bugfix/cors-handling
docs/api-documentation
hotfix/security-patch
```

### Pull Request Guidelines
- Include clear description of changes
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass
- Follow code review checklist

## Performance Conventions

### Memory Management
- Clean up event listeners in destroy methods
- Remove DOM references when not needed
- Use object pooling for frequently created objects

```javascript
class BaseWidget {
    destroy() {
        // Remove event listeners
        this.removeAllListeners();
        
        // Remove DOM element
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // Clear references
        this.element = null;
        this.config = null;
    }
}
```

### DOM Optimization
- Use event delegation for multiple elements
- Batch DOM updates with requestAnimationFrame
- Use document fragments for multiple insertions

```javascript
// ✅ Good - Event delegation
this.container.addEventListener('click', (event) => {
    const widget = event.target.closest('[data-widget]');
    if (widget) {
        this.handleWidgetClick(widget);
    }
});

// ❌ Bad - Multiple listeners
widgets.forEach(widget => {
    widget.element.addEventListener('click', this.handleWidgetClick);
});
```

## Security Conventions

### Input Validation
- Validate all user inputs
- Sanitize HTML content
- Use safe HTML generation

```javascript
// ✅ Good - Sanitize input
const safeText = escapeHtml(userInput);

// ❌ Bad - Direct insertion
element.innerHTML = userInput;
```

### XSS Prevention
- Use textContent instead of innerHTML when possible
- Validate and sanitize all dynamic content
- Use scoped CSS to prevent style injection

```javascript
// ✅ Good
element.textContent = message;

// ❌ Bad
element.innerHTML = message;
```

## Accessibility Conventions

### ARIA Attributes
- Use proper ARIA labels and descriptions
- Implement keyboard navigation
- Announce changes to screen readers

```javascript
// ✅ Good
const button = createElement('button', 'send-button', {
    'aria-label': 'Send message',
    'aria-describedby': 'message-input'
});

// ❌ Bad
const button = createElement('button', 'send-button');
```

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Implement proper focus management
- Support common keyboard shortcuts

```javascript
class FocusManager {
    trapFocus(container) {
        container.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                const focusableElements = this.getFocusableElements(container);
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}
```

## Review Checklist

### Code Review
- [ ] Code follows style conventions
- [ ] Functions are small and focused
- [ ] Error handling is comprehensive
- [ ] Documentation is complete
- [ ] Tests are included and passing
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Accessibility requirements met

### Documentation Review
- [ ] API documentation is complete
- [ ] Examples are clear and working
- [ ] Configuration options documented
- [ ] Event handling explained
- [ ] Troubleshooting guide included

### Testing Review
- [ ] Unit tests cover core functionality
- [ ] Integration tests cover workflows
- [ ] E2E tests cover user scenarios
- [ ] Accessibility tests included
- [ ] Performance tests implemented

Following these conventions ensures consistency, maintainability, and quality across the ChatUI codebase.
