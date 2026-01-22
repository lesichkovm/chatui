---
path: modules/base-widget.md
page-type: module
summary: Abstract base widget class that all widget components extend.
tags: [module, widget, base-class, abstract, components]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Base Widget

The Base Widget is an abstract class that provides the foundation for all interactive widget components in ChatUI. It defines the common interface, lifecycle methods, and utility functions that all widgets must implement.

## Overview

The Base Widget provides:
- Common widget interface and lifecycle
- Event handling and emission
- Configuration management
- Validation framework
- DOM manipulation utilities
- Accessibility support
- State management

## Abstract Class Structure

```javascript
class BaseWidget {
    constructor(config)
    
    // Abstract Methods (must be implemented)
    render()                    // Render widget DOM
    getValue()                  // Get widget value
    validate()                  // Validate widget value
    
    // Lifecycle Methods
    mount(container)           // Mount to DOM
    unmount()                  // Remove from DOM
    destroy()                  // Clean up widget
    
    // Configuration
    updateConfig(newConfig)    // Update widget config
    getConfig()                // Get current config
    
    // Event Management
    on(event, handler)         // Add event listener
    off(event, handler)        // Remove event listener
    emit(event, data)           // Emit event
    
    // State Management
    setState(state)            // Update widget state
    getState()                 // Get current state
    
    // Validation
    setError(error)            // Set validation error
    clearError()               // Clear validation error
    hasError()                 // Check for errors
    
    // Accessibility
    setAriaAttribute(name, value)  // Set ARIA attribute
    announceToScreenReader(text)    // Announce to screen readers
}
```

## Constructor

```javascript
constructor(config)
```

**Parameters:**
- `config` (object): Widget configuration object

**Behavior:**
1. Sets up widget configuration
2. Generates unique widget ID
3. Initializes event system
4. Sets up state management
5. Performs initial validation

**Example:**
```javascript
class MyWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.type = 'my-widget';
        this.value = config.defaultValue || '';
    }
}
```

## Required Abstract Methods

### `render()`
Renders the widget's DOM structure. **Must be implemented by subclasses.**

```javascript
render() {
    this.element = this.createElement('div', 'my-widget');
    
    const input = this.createElement('input', 'my-widget-input');
    input.type = 'text';
    input.placeholder = this.config.placeholder || 'Enter value';
    
    this.element.appendChild(input);
    return this.element;
}
```

**Returns:**
- `HTMLElement`: Root widget element

### `getValue()`
Returns the current value of the widget. **Must be implemented by subclasses.**

```javascript
getValue() {
    const input = this.element.querySelector('.my-widget-input');
    return input.value;
}
```

**Returns:**
- `any`: Current widget value

### `validate()`
Validates the widget's current value. **Must be implemented by subclasses.**

```javascript
validate() {
    const value = this.getValue();
    
    if (this.config.required && !value.trim()) {
        throw new Error('This field is required');
    }
    
    if (this.config.maxLength && value.length > this.config.maxLength) {
        throw new Error(`Maximum length is ${this.config.maxLength}`);
    }
    
    return true;
}
```

**Returns:**
- `boolean`: True if valid, throws error if invalid

## Lifecycle Management

### `mount(container)`
Mounts the widget to a DOM container.

```javascript
widget.mount(document.getElementById('widget-container'));
```

**Parameters:**
- `container` (HTMLElement): DOM container element

**Events Emitted:**
- `widget:mounted`

### `unmount()`
Removes the widget from its container.

```javascript
widget.unmount();
```

**Events Emitted:**
- `widget:unmounted`

### `destroy()`
Completely destroys the widget and cleans up resources.

```javascript
widget.destroy();
```

**Events Emitted:**
- `widget:destroyed`

## Configuration Management

### Standard Configuration Schema

All widgets inherit this standard configuration structure:

```javascript
{
    // Identification
    id: 'widget-123',           // Unique identifier (auto-generated if not provided)
    type: 'widget-type',        // Widget type identifier
    
    // Basic Properties
    required: false,            // Whether widget is required
    disabled: false,            // Whether widget is disabled
    readonly: false,            // Whether widget is read-only
    
    // Validation
    validation: {},            // Validation rules object
    errorMessage: 'Invalid input', // Custom error message
    
    // Styling
    className: 'custom-class', // Additional CSS classes
    style: {},                  // Inline styles object
    
    // Labels and Text
    label: 'Widget Label',      // Widget label text
    placeholder: 'Placeholder',  // Input placeholder
    helpText: 'Help text',      // Help/instruction text
    
    // Event Handlers
    onChange: (value) => {},    // Value change handler
    onFocus: () => {},          // Focus handler
    onBlur: () => {},           // Blur handler
    onSubmit: (value) => {},    // Submit handler
    
    // Accessibility
    ariaLabel: 'Widget label',  // ARIA label
    ariaDescribedBy: 'help-id', // ARIA describedby
    tabIndex: 0                 // Tab index
}
```

### `updateConfig(newConfig)`
Updates the widget configuration.

```javascript
widget.updateConfig({
    required: true,
    placeholder: 'New placeholder',
    onChange: (value) => console.log('New value:', value)
});
```

**Parameters:**
- `newConfig` (object): New configuration options

### `getConfig()`
Returns the current widget configuration.

```javascript
const config = widget.getConfig();
```

**Returns:**
- `object`: Current configuration

## Event System

### Built-in Events

Base widgets emit these standard events:

```javascript
// Lifecycle events
'widget:created'      // Widget created
'widget:mounted'      // Widget mounted to DOM
'widget:unmounted'    // Widget unmounted from DOM
'widget:destroyed'    // Widget destroyed

// Interaction events
'widget:focus'        // Widget focused
'widget:blur'         // Widget blurred
'widget:change'       // Widget value changed
'widget:submit'       // Widget submitted
'widget:reset'        // Widget reset

// Validation events
'widget:validate'     // Widget validation
'widget:valid'        // Widget validation passed
'widget:invalid'      // Widget validation failed
'widget:error'        // Widget error occurred
```

### Event Handling

```javascript
class MyWidget extends BaseWidget {
    setupEventHandlers() {
        // Handle input changes
        this.element.addEventListener('input', (event) => {
            this.value = event.target.value;
            this.emit('widget:change', { value: this.value });
            
            // Call custom onChange handler
            if (this.config.onChange) {
                this.config.onChange(this.value);
            }
        });
        
        // Handle focus events
        this.element.addEventListener('focus', () => {
            this.emit('widget:focus');
            if (this.config.onFocus) {
                this.config.onFocus();
            }
        });
        
        // Handle blur events
        this.element.addEventListener('blur', () => {
            this.emit('widget:blur');
            if (this.config.onBlur) {
                this.config.onBlur();
            }
            
            // Validate on blur
            this.validate();
        });
    }
}
```

## State Management

### Widget State Structure

```javascript
this.state = {
    // Basic state
    value: null,              // Current widget value
    valid: true,              // Validation state
    error: null,              // Current error message
    
    // UI state
    focused: false,           // Focus state
    disabled: false,          // Disabled state
    readonly: false,          // Read-only state
    
    // Interaction state
    touched: false,           // Whether user has interacted
    dirty: false,             // Whether value has changed
    
    // Metadata
    createdAt: Date.now(),    // Creation timestamp
    updatedAt: Date.now(),    // Last update timestamp
    submittedAt: null         // Last submission timestamp
};
```

### `setState(newState)`
Updates the widget state.

```javascript
widget.setState({
    value: 'new value',
    dirty: true,
    updatedAt: Date.now()
});
```

**Parameters:**
- `newState` (object): Partial state object to merge

### `getState()`
Returns the current widget state.

```javascript
const state = widget.getState();
```

**Returns:**
- `object`: Current state object

## Validation Framework

### Validation Rules

```javascript
const validationRules = {
    required: {
        validate: (value) => value && value.trim().length > 0,
        message: 'This field is required'
    },
    
    minLength: {
        validate: (value, min) => value.length >= min,
        message: (min) => `Minimum length is ${min}`
    },
    
    maxLength: {
        validate: (value, max) => value.length <= max,
        message: (max) => `Maximum length is ${max}`
    },
    
    pattern: {
        validate: (value, pattern) => new RegExp(pattern).test(value),
        message: 'Invalid format'
    },
    
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Invalid email address'
    }
};
```

### Validation Implementation

```javascript
class BaseWidget {
    validate() {
        this.clearError();
        
        try {
            // Check if required
            if (this.config.required) {
                const value = this.getValue();
                if (!value || (typeof value === 'string' && !value.trim())) {
                    throw new Error(this.config.errorMessage || 'This field is required');
                }
            }
            
            // Run custom validation
            if (this.config.validation) {
                this.runCustomValidation();
            }
            
            this.setState({ valid: true, error: null });
            this.emit('widget:valid');
            return true;
            
        } catch (error) {
            this.setError(error.message);
            this.emit('widget:invalid', { error: error.message });
            return false;
        }
    }
    
    runCustomValidation() {
        const value = this.getValue();
        const rules = this.config.validation;
        
        Object.entries(rules).forEach(([rule, param]) => {
            const validationRule = this.validationRules[rule];
            if (validationRule) {
                const isValid = validationRule.validate(value, param);
                if (!isValid) {
                    const message = typeof validationRule.message === 'function' 
                        ? validationRule.message(param)
                        : validationRule.message;
                    throw new Error(message);
                }
            }
        });
    }
}
```

### Error Handling

```javascript
class BaseWidget {
    setError(message) {
        this.setState({ 
            valid: false, 
            error: message 
        });
        
        // Add error styling
        this.element.classList.add('error');
        
        // Show error message
        this.showErrorMessage(message);
        
        // Announce to screen readers
        this.announceToScreenReader(`Error: ${message}`);
    }
    
    clearError() {
        this.setState({ 
            valid: true, 
            error: null 
        });
        
        // Remove error styling
        this.element.classList.remove('error');
        
        // Hide error message
        this.hideErrorMessage();
    }
    
    hasError() {
        return this.state.error !== null;
    }
}
```

## Accessibility Support

### ARIA Attributes

```javascript
class BaseWidget {
    setAriaAttribute(name, value) {
        this.element.setAttribute(`aria-${name}`, value);
    }
    
    setupAccessibility() {
        // Set basic ARIA attributes
        if (this.config.ariaLabel) {
            this.setAriaAttribute('label', this.config.ariaLabel);
        }
        
        if (this.config.ariaDescribedBy) {
            this.setAriaAttribute('describedby', this.config.ariaDescribedBy);
        }
        
        // Set required state
        if (this.config.required) {
            this.setAriaAttribute('required', 'true');
        }
        
        // Set invalid state
        if (this.hasError()) {
            this.setAriaAttribute('invalid', 'true');
            this.setAriaAttribute('errormessage', `${this.id}-error`);
        }
        
        // Set disabled state
        if (this.config.disabled) {
            this.setAriaAttribute('disabled', 'true');
        }
    }
}
```

### Screen Reader Support

```javascript
class BaseWidget {
    announceToScreenReader(text) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = text;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}
```

## DOM Utilities

### Element Creation

```javascript
class BaseWidget {
    createElement(tag, className, attributes = {}) {
        const element = document.createElement(tag);
        
        if (className) {
            element.className = className;
        }
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        return element;
    }
    
    createLabel(text, inputId) {
        const label = this.createElement('label', 'widget-label');
        label.textContent = text;
        label.setAttribute('for', inputId);
        return label;
    }
    
    createErrorMessage() {
        const errorElement = this.createElement('div', 'widget-error');
        errorElement.id = `${this.id}-error`;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        return errorElement;
    }
}
```

## Usage Examples

### Creating a Custom Widget

```javascript
class ColorPickerWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.type = 'color-picker';
        this.value = config.defaultValue || '#000000';
    }
    
    render() {
        this.element = this.createElement('div', 'color-picker-widget');
        
        // Create label
        if (this.config.label) {
            const label = this.createLabel(this.config.label, this.id);
            this.element.appendChild(label);
        }
        
        // Create color input
        this.input = this.createElement('input', 'color-picker-input');
        this.input.type = 'color';
        this.input.id = this.id;
        this.input.value = this.value;
        
        // Create text input for hex value
        this.textInput = this.createElement('input', 'color-picker-text');
        this.textInput.type = 'text';
        this.textInput.placeholder = '#000000';
        this.textInput.value = this.value;
        
        // Add elements to container
        this.element.appendChild(this.input);
        this.element.appendChild(this.textInput);
        
        // Create error message container
        this.errorElement = this.createErrorMessage();
        this.element.appendChild(this.errorElement);
        
        // Setup event handlers
        this.setupEventHandlers();
        
        return this.element;
    }
    
    getValue() {
        return this.value;
    }
    
    setValue(value) {
        this.value = value;
        this.input.value = value;
        this.textInput.value = value;
        this.setState({ value, dirty: true, updatedAt: Date.now() });
    }
    
    validate() {
        const value = this.getValue();
        
        if (this.config.required && !value) {
            throw new Error('Please select a color');
        }
        
        // Validate hex color format
        if (!/^#[0-9A-F]{6}$/i.test(value)) {
            throw new Error('Invalid color format');
        }
        
        return true;
    }
    
    setupEventHandlers() {
        this.input.addEventListener('change', (event) => {
            this.setValue(event.target.value);
            this.emit('widget:change', { value: this.value });
        });
        
        this.textInput.addEventListener('input', (event) => {
            const value = event.target.value;
            if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                this.setValue(value);
                this.emit('widget:change', { value: this.value });
            }
        });
    }
}
```

### Using the Base Widget

```javascript
// Create custom widget instance
const colorPicker = new ColorPickerWidget({
    id: 'theme-color',
    label: 'Theme Color',
    required: true,
    defaultValue: '#007bff',
    onChange: (color) => console.log('Color changed:', color)
});

// Mount to DOM
const container = document.getElementById('widget-container');
container.appendChild(colorPicker.render());
colorPicker.mount(container);

// Listen to events
colorPicker.on('widget:change', (event) => {
    console.log('Color changed to:', event.data.value);
});

// Validate widget
if (colorPicker.validate()) {
    console.log('Widget is valid');
} else {
    console.log('Widget has errors:', colorPicker.getState().error);
}

// Get value
const selectedColor = colorPicker.getValue();
console.log('Selected color:', selectedColor);
```

## Best Practices

### Do's
1. **Always extend BaseWidget** for consistency
2. **Implement all abstract methods** (render, getValue, validate)
3. **Use the event system** for communication
4. **Follow accessibility guidelines**
5. **Handle validation properly**
6. **Clean up resources in destroy()**

### Don'ts
1. **Don't override the constructor** without calling super()
2. **Don't skip validation** for required fields
3. **Don't ignore accessibility** requirements
4. **Don't leak memory** (remove event listeners)
5. **Don't use inline styles** prefer CSS classes
6. **Don't emit custom events** without proper namespacing

## See Also

- [Widget Factory](widget-factory.md) - Widget factory documentation
- [Widget Components](../modules/) - All widget implementations
- [UI Module](ui.md) - UI management documentation
- [Development](../development.md) - Widget development guide
