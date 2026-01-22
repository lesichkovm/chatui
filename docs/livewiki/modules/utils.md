---
path: modules/utils.md
page-type: module
summary: Utility functions and helper methods used throughout the ChatUI codebase.
tags: [module, utilities, helpers, functions]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Utilities

The utilities module provides helper functions and common utilities used throughout the ChatUI codebase. It includes DOM manipulation helpers, validation functions, formatting utilities, and common algorithms.

## Overview

The utilities module contains:
- DOM manipulation helpers
- String and number formatting functions
- Validation utilities
- Date and time helpers
- Color manipulation functions
- Event handling utilities
- Performance helpers

## Available Utilities

### DOM Utilities

#### `createElement(tag, className, attributes)`
Creates a DOM element with optional class and attributes.

```javascript
const button = createElement('button', 'send-button', {
    type: 'button',
    'aria-label': 'Send message'
});
```

**Parameters:**
- `tag` (string): HTML tag name
- `className` (string, optional): CSS class name
- `attributes` (object, optional): HTML attributes

**Returns:**
- `HTMLElement`: Created DOM element

#### `findParent(element, selector)`
Finds the nearest parent element matching a selector.

```javascript
const messageElement = findParent(target, '.message');
```

**Parameters:**
- `element` (HTMLElement): Starting element
- `selector` (string): CSS selector to match

**Returns:**
- `HTMLElement|null`: Matching parent element or null

#### `isVisible(element)`
Checks if an element is visible in the viewport.

```javascript
const isVisible = isVisible(messageElement);
```

**Parameters:**
- `element` (HTMLElement): Element to check

**Returns:**
- `boolean`: Whether element is visible

### String Utilities

#### `escapeHtml(text)`
Escapes HTML characters in a string.

```javascript
const safeText = escapeHtml('<script>alert("xss")</script>');
// Returns: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
```

**Parameters:**
- `text` (string): Text to escape

**Returns:**
- `string`: Escaped text

#### `truncateText(text, maxLength, suffix)`
Truncates text to a maximum length.

```javascript
const short = truncateText('This is a very long message', 20, '...');
// Returns: "This is a very lo..."
```

**Parameters:**
- `text` (string): Text to truncate
- `maxLength` (number): Maximum length
- `suffix` (string, optional): Suffix to add when truncated

**Returns:**
- `string`: Truncated text

#### `capitalizeFirst(text)`
Capitalizes the first letter of a string.

```javascript
const capitalized = capitalizeFirst('hello world');
// Returns: "Hello world"
```

### Validation Utilities

#### `isValidEmail(email)`
Validates an email address format.

```javascript
const isValid = isValidEmail('user@example.com');
```

**Parameters:**
- `email` (string): Email to validate

**Returns:**
- `boolean`: Whether email is valid

#### `isValidUrl(url)`
Validates a URL format.

```javascript
const isValid = isValidUrl('https://example.com');
```

**Parameters:**
- `url` (string): URL to validate

**Returns:**
- `boolean`: Whether URL is valid

#### `isValidHexColor(color)`
Validates a hex color code.

```javascript
const isValid = isValidHexColor('#007bff');
```

**Parameters:**
- `color` (string): Color to validate

**Returns:**
- `boolean`: Whether color is valid hex

### Date Utilities

#### `formatTime(timestamp)`
Formats a timestamp as a readable time.

```javascript
const time = formatTime(Date.now());
// Returns: "10:30 AM"
```

**Parameters:**
- `timestamp` (number): Unix timestamp

**Returns:**
- `string`: Formatted time

#### `formatDate(timestamp)`
Formats a timestamp as a readable date.

```javascript
const date = formatDate(Date.now());
// Returns: "January 22, 2026"
```

**Parameters:**
- `timestamp` (number): Unix timestamp

**Returns:**
- `string`: Formatted date

#### `getTimeAgo(timestamp)`
Returns a relative time string (e.g., "2 minutes ago").

```javascript
const timeAgo = getTimeAgo(Date.now() - 120000);
// Returns: "2 minutes ago"
```

**Parameters:**
- `timestamp` (number): Unix timestamp

**Returns:**
- `string`: Relative time string

### Color Utilities

#### `hexToRgb(hex)`
Converts a hex color to RGB values.

```javascript
const rgb = hexToRgb('#007bff');
// Returns: { r: 0, g: 123, b: 255 }
```

**Parameters:**
- `hex` (string): Hex color code

**Returns:**
- `object|null`: RGB values or null if invalid

#### `rgbToHex(r, g, b)`
Converts RGB values to a hex color.

```javascript
const hex = rgbToHex(0, 123, 255);
// Returns: "#007bff"
```

**Parameters:**
- `r` (number): Red value (0-255)
- `g` (number): Green value (0-255)
- `b` (number): Blue value (0-255)

**Returns:**
- `string`: Hex color code

#### `adjustColorBrightness(color, percent)`
Adjusts the brightness of a color.

```javascript
const lighter = adjustColorBrightness('#007bff', 20);
const darker = adjustColorBrightness('#007bff', -20);
```

**Parameters:**
- `color` (string): Hex color code
- `percent` (number): Brightness adjustment (-100 to 100)

**Returns:**
- `string`: Adjusted hex color

### Event Utilities

#### `debounce(func, wait)`
Debounces a function call.

```javascript
const debouncedSearch = debounce(searchFunction, 300);
```

**Parameters:**
- `func` (function): Function to debounce
- `wait` (number): Delay in milliseconds

**Returns:**
- `function`: Debounced function

#### `throttle(func, limit)`
Throttles a function call.

```javascript
const throttledScroll = throttle(scrollHandler, 100);
```

**Parameters:**
- `func` (function): Function to throttle
- `limit` (number): Time limit in milliseconds

**Returns:**
- `function`: Throttled function

#### `once(func)`
Creates a function that can only be called once.

```javascript
const onceInit = once(initializationFunction);
```

**Parameters:**
- `func` (function): Function to wrap

**Returns:**
- `function`: Function that can only be called once

### Performance Utilities

#### `requestAnimationFrame(callback)`
Cross-browser requestAnimationFrame wrapper.

```javascript
requestAnimationFrame(() => {
    // Animation code
});
```

**Parameters:**
- `callback` (function): Callback function

#### `generateId(prefix)`
Generates a unique ID with optional prefix.

```javascript
const messageId = generateId('msg');
// Returns: "msg-abc123"
```

**Parameters:**
- `prefix` (string, optional): ID prefix

**Returns:**
- `string`: Unique ID

#### `measurePerformance(name, fn)`
Measures the performance of a function.

```javascript
const result = measurePerformance('render', () => {
    return renderMessages();
});
```

**Parameters:**
- `name` (string): Performance mark name
- `fn` (function): Function to measure

**Returns:**
- `any`: Function result

## Implementation Examples

### DOM Utilities Implementation

```javascript
export function createElement(tag, className = '', attributes = {}) {
    const element = document.createElement(tag);
    
    if (className) {
        element.className = className;
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    
    return element;
}

export function findParent(element, selector) {
    let parent = element.parentElement;
    
    while (parent && !parent.matches(selector)) {
        parent = parent.parentElement;
    }
    
    return parent;
}

export function isVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           rect.width > 0 && 
           rect.height > 0;
}
```

### Validation Utilities Implementation

```javascript
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isValidHexColor(color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
}
```

### Event Utilities Implementation

```javascript
export function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export function once(func) {
    let called = false;
    let result;
    
    return function(...args) {
        if (!called) {
            called = true;
            result = func.apply(this, args);
        }
        return result;
    };
}
```

## Usage Examples

### Common Usage Patterns

```javascript
import {
    createElement,
    escapeHtml,
    debounce,
    formatTime,
    isValidEmail,
    generateId
} from './utils.js';

// Create DOM elements
const message = createElement('div', 'message user', {
    'data-message-id': generateId('msg')
});

// Sanitize user input
const safeMessage = escapeHtml(userInput);

// Debounce search
const debouncedSearch = debounce(searchMessages, 300);

// Format timestamps
const timeString = formatTime(message.timestamp);

// Validate input
if (isValidEmail(email)) {
    // Process email
}
```

### Performance Optimization

```javascript
import { debounce, throttle, measurePerformance } from './utils.js';

// Debounce resize handler
const debouncedResize = debounce(handleResize, 250);

// Throttle scroll events
const throttledScroll = throttle(handleScroll, 100);

// Measure performance
const renderTime = measurePerformance('render', () => {
    renderMessages();
});
```

### Error Handling

```javascript
import { isValidUrl, isValidHexColor } from './utils.js';

function validateConfig(config) {
    const errors = [];
    
    if (!isValidUrl(config.serverUrl)) {
        errors.push('Invalid server URL');
    }
    
    if (!isValidHexColor(config.color)) {
        errors.push('Invalid color format');
    }
    
    return errors;
}
```

## Testing Utilities

### Unit Test Examples

```javascript
// Test DOM utilities
test('createElement creates element with correct attributes', () => {
    const button = createElement('button', 'test-btn', { type: 'submit' });
    
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toBe('test-btn');
    expect(button.type).toBe('submit');
});

// Test validation utilities
test('isValidEmail validates email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
});

// Test event utilities
test('debounce delays function execution', (done) => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();
    
    setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
    }, 150);
});
```

## Performance Considerations

### Memory Management

```javascript
// Clean up event listeners
export function removeEventListener(element, event, handler) {
    element.removeEventListener(event, handler);
}

// Clear timeouts and intervals
export function clearTimers() {
    // Implementation for clearing active timers
}
```

### Optimization Tips

1. **Use Debouncing/Throttling**: For frequent events like scroll and resize
2. **Cache DOM Queries**: Store frequently accessed elements
3. **Use Document Fragments**: For batch DOM operations
4. **Avoid Layout Thrashing**: Batch reads and writes separately

## Browser Compatibility

### Polyfills

```javascript
// requestAnimationFrame polyfill
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
}

// URL constructor polyfill for older browsers
if (!window.URL) {
    window.URL = window.webkitURL;
}
```

## See Also

- [ChatWidget Class](chat-widget-class.md) - Main widget class
- [UI Module](ui.md) - UI management documentation
- [API Module](api.md) - API layer documentation
- [Development](../development.md) - Development guidelines
