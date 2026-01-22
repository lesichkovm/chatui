---
path: input-widget.md
page-type: module
summary: Interactive input widget with validation, submit functionality, and customizable styling.
tags: [widget, input, form, validation, interactive]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Input Widget

The Input Widget provides a standalone input field with submit functionality, designed for collecting user responses with validation and customizable styling.

## Features

- **Multiple Input Types**: Text, email, password, number, date, and more
- **Built-in Validation**: Required field validation, pattern matching, min/max constraints
- **Submit Integration**: Automatic submit button with keyboard support (Enter key)
- **Styling Options**: Multiple variants (primary, secondary) and sizes (small, medium, large)
- **State Management**: Disable on submit, clear on submit, error state handling
- **Accessibility**: Proper labeling and ARIA support

## Usage

### Basic Input Widget
```javascript
{
  type: 'input',
  props: {
    placeholder: 'Enter your name...',
    buttonText: 'Submit',
    required: true
  }
}
```

### Email Input with Validation
```javascript
{
  type: 'input',
  props: {
    type: 'email',
    placeholder: 'Enter your email address',
    buttonText: 'Subscribe',
    variant: 'primary',
    size: 'medium',
    required: true,
    pattern: '[^@]+@[^@]+\.[a-zA-Z]{2,}',
    clearOnSubmit: true
  }
}
```

### Number Input with Constraints
```javascript
{
  type: 'input',
  props: {
    type: 'number',
    placeholder: 'Enter quantity (1-10)',
    buttonText: 'Add to Cart',
    min: 1,
    max: 10,
    step: 1,
    required: true,
    variant: 'secondary'
  }
}
```

## Properties

### Core Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | `'text'` | Input type (text, email, password, number, date, etc.) |
| `placeholder` | string | `'Enter your response...'` | Placeholder text displayed in input |
| `buttonText` | string | `'Submit'` | Text displayed on submit button |

### Validation Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `required` | boolean | `false` | Whether the input is required |
| `pattern` | string | `null` | Regex pattern for validation |
| `min` | number/string | `null` | Minimum value (for number/date inputs) |
| `max` | number/string | `null` | Maximum value (for number/date inputs) |
| `maxLength` | number | `null` | Maximum character length |
| `step` | number | `null` | Step increment (for number inputs) |

### Behavior Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disableOnSubmit` | boolean | `true` | Disable input and button after submission |
| `clearOnSubmit` | boolean | `true` | Clear input value after submission |
| `disabled` | boolean | `false` | Initial disabled state |

### Styling Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | string | `'primary'` | Button variant (primary, secondary) |
| `size` | string | `'medium'` | Input and button size (small, medium, large) |
| `inputStyle` | object | `{}` | Custom CSS styles for input element |
| `buttonStyle` | object | `{}` | Custom CSS styles for button element |
| `style` | object | `{}` | Custom CSS styles for container |

## Events

### Interaction Event
The widget emits an interaction event when the user submits the input:

```javascript
{
  value: "user input value",
  inputType: "text",
  widgetType: "input"
}
```

## Styling Classes

### Container Classes
- `.widget-input-container`: Main container element

### Input Classes
- `.widget-input`: Input element
- `.widget-input-disabled`: Disabled input state
- `.widget-input-error`: Validation error state
- `.variant-{variant}`: Variant styling (primary, secondary)
- `.size-{size}`: Size styling (small, medium, large)

### Button Classes
- `.widget-input-submit`: Submit button
- `.widget-input-disabled`: Disabled button state
- `.variant-{variant}`: Button variant styling
- `.size-{size}`: Button size styling

## Examples

### Contact Form Input
```javascript
{
  type: 'input',
  props: {
    type: 'text',
    placeholder: 'Your full name',
    buttonText: 'Next',
    required: true,
    maxLength: 50,
    variant: 'primary',
    size: 'large',
    inputStyle: {
      fontSize: '16px',
      padding: '12px'
    }
  }
}
```

### Search Input
```javascript
{
  type: 'input',
  props: {
    type: 'search',
    placeholder: 'Search products...',
    buttonText: 'Search',
    variant: 'secondary',
    clearOnSubmit: false,
    disableOnSubmit: false
  }
}
```

### Password Input
```javascript
{
  type: 'input',
  props: {
    type: 'password',
    placeholder: 'Enter password',
    buttonText: 'Login',
    required: true,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$',
    variant: 'primary'
  }
}
```

## Accessibility

- Input field uses proper HTML5 input types for semantic meaning
- Submit button is keyboard accessible
- Error states are visually indicated
- Form validation provides user feedback
- Proper labeling through placeholder text

## See Also

- [Base Widget](base-widget.md) - Core widget functionality
- [Button Widget](button-widget.md) - Standalone button component
- [Textarea Widget](textarea-widget.md) - Multi-line input component
- [Container Widget](container-widget.md) - For creating multi-input forms
