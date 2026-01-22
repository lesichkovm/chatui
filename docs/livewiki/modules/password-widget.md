---
path: modules/password-widget.md
page-type: module
summary: Secure password input widget with visibility toggle and strength validation.
tags: [widget, input, password, security, validation]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Password Widget

Secure password input component with visibility toggle, strength validation, and comprehensive security features.

## Features

- **Visibility Toggle**: Show/hide password functionality
- **Strength Validation**: Real-time password strength assessment
- **Secure Input**: Proper password field handling
- **Validation**: Custom validation rules and patterns
- **Accessibility**: Screen reader compatible with proper ARIA
- **Styling**: Customizable appearance with security indicators

## Configuration

```javascript
{
  type: 'password',
  config: {
    placeholder: 'Enter your password',
    required: false,
    minLength: 8,
    maxLength: 128,
    showToggle: true,
    showStrength: false,
    strengthLevels: ['weak', 'fair', 'good', 'strong'],
    validation: (value) => {
      // Custom validation logic
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value);
    },
    onChange: (value) => console.log('Changed:', value),
    onSubmit: (value) => console.log('Submitted:', value)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | string | 'Enter password' | Placeholder text |
| `required` | boolean | false | Whether the field is required |
| `minLength` | number | 8 | Minimum password length |
| `maxLength` | number | 128 | Maximum password length |
| `showToggle` | boolean | true | Show visibility toggle button |
| `showStrength` | boolean | false | Show password strength indicator |
| `strengthLevels` | array | ['weak', 'fair', 'good', 'strong'] | Custom strength level labels |

## Methods

### getValue()
Returns the current password value.

```javascript
const password = passwordWidget.getValue();
console.log(password); // "userPassword123"
```

### setValue(password)
Sets the password value.

```javascript
passwordWidget.setValue('newPassword123');
```

### validate()
Validates the password against configured rules.

```javascript
const isValid = passwordWidget.validate();
if (!isValid) {
  console.log('Password validation failed');
}
```

### getStrength()
Returns the current password strength assessment.

```javascript
const strength = passwordWidget.getStrength();
console.log(strength); // "strong"
```

### toggleVisibility()
Toggles password visibility.

```javascript
passwordWidget.toggleVisibility();
```

### focus()
Focuses the password input field.

```javascript
passwordWidget.focus();
```

## Events

### change
Fired when the password value changes.

```javascript
window.addEventListener('chatwidget:password:change', (e) => {
  const { widgetId, value, strength } = e.detail;
  console.log(`Password ${widgetId} changed:`, value, strength);
});
```

### submit
Fired when the password form is submitted.

```javascript
window.addEventListener('chatwidget:password:submit', (e) => {
  const { widgetId, value } = e.detail;
  console.log(`Password ${widgetId} submitted:`, value);
});
```

### strength-change
Fired when password strength changes.

```javascript
window.addEventListener('chatwidget:password:strength-change', (e) => {
  const { widgetId, strength, score } = e.detail;
  console.log(`Password strength: ${strength} (${score})`);
});
```

## Password Strength Algorithm

The widget uses a comprehensive strength assessment:

### Scoring Factors
- **Length**: Longer passwords score higher
- **Character Variety**: Mix of uppercase, lowercase, numbers, symbols
- **Common Patterns**: Penalizes common patterns and sequences
- **Dictionary Words**: Checks against common password lists

### Strength Levels
- **Weak** (0-2): Short, simple patterns
- **Fair** (3-4): Mixed characters, moderate length
- **Good** (5-6): Good length, character variety
- **Strong** (7-8): Long, complex, unique patterns

## Styling

The password widget uses CSS custom properties:

```css
.chatui-password {
  --password-bg: #ffffff;
  --password-border: #e1e5e9;
  --password-border-focus: #007bff;
  --password-text: #495057;
  --password-placeholder: #6c757d;
  --password-padding: 12px;
  --password-border-radius: 6px;
  --password-font-size: 14px;
}

.chatui-password-strength {
  --strength-weak: #dc3545;
  --strength-fair: #ffc107;
  --strength-good: #28a745;
  --strength-strong: #007bff;
}
```

## Accessibility

- **ARIA Attributes**: `aria-label`, `aria-required`, `aria-invalid`
- **Screen Reader**: Announces password strength and validation
- **Keyboard Navigation**: Full keyboard access
- **High Contrast**: Supports high contrast mode
- **Security**: Proper password field semantics

## Security Considerations

- **No Plaintext Storage**: Password values are not stored in logs
- **Secure Input**: Uses proper password input type
- **Memory Management**: Clears password references when appropriate
- **XSS Prevention**: Proper escaping and sanitization

## Examples

### Basic Password Field
```javascript
{
  type: 'password',
  config: {
    placeholder: 'Enter your password',
    required: true
  }
}
```

### With Strength Indicator
```javascript
{
  type: 'password',
  config: {
    placeholder: 'Create a strong password',
    showStrength: true,
    minLength: 12,
    validation: (value) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(value);
    }
  }
}
```

### Custom Validation
```javascript
{
  type: 'password',
  config: {
    placeholder: 'Enter account password',
    validation: (value) => {
      // Must contain at least one number and one uppercase letter
      return /\d/.test(value) && /[A-Z]/.test(value);
    },
    onSubmit: (value) => {
      authenticateUser(value);
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const password = chat.addWidget('password', {
  placeholder: 'Enter your password',
  required: true,
  showStrength: true,
  minLength: 8
});
```

### Event Handling
```javascript
window.addEventListener('chatwidget:password:strength-change', (e) => {
  const { strength } = e.detail;
  // Update UI based on strength
  updateSubmitButton(strength === 'strong');
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Full touch support with secure input handling
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Strength Calculation**: Debounced to prevent performance issues
- **Event Handling**: Efficient event listeners with proper cleanup
- **Memory**: Secure memory management for password values

## See Also

- [Input Widget](input-widget.md) - Single-line text input
- [Form Widget](form-widget.md) - Form container with validation
- [Security Guide](../conventions.md#security) - Security best practices
- [Validation Patterns](../conventions.md#validation) - Common validation rules
