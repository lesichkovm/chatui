---
path: modules/textarea-widget.md
page-type: module
summary: Multi-line text input widget with auto-resize and validation support.
tags: [widget, input, textarea, multi-line, validation]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Textarea Widget

Multi-line text input component with auto-resize functionality and comprehensive validation support.

## Features

- **Auto-resize**: Automatically adjusts height based on content
- **Character Counting**: Optional character/word count display
- **Validation**: Built-in validation with custom rules
- **Placeholder**: Support for placeholder text
- **Resizable**: User-resizable with CSS control
- **Styling**: Customizable appearance and states

## Configuration

```javascript
{
  type: 'textarea',
  config: {
    placeholder: 'Enter your message...',
    required: false,
    minLength: 0,
    maxLength: 1000,
    showCharCount: false,
    showWordCount: false,
    autoResize: true,
    rows: 3,
    validation: (value) => {
      // Custom validation logic
      return value.length > 10;
    },
    onChange: (value) => console.log('Changed:', value),
    onSubmit: (value) => console.log('Submitted:', value)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | string | '' | Placeholder text displayed when empty |
| `required` | boolean | false | Whether the field is required |
| `minLength` | number | 0 | Minimum character length |
| `maxLength` | number | 1000 | Maximum character length |
| `showCharCount` | boolean | false | Show character counter |
| `showWordCount` | boolean | false | Show word counter |
| `autoResize` | boolean | true | Auto-adjust height |
| `rows` | number | 3 | Initial number of rows |

## Methods

### getValue()
Returns the current text content.

```javascript
const text = textareaWidget.getValue();
console.log(text); // "Current text content"
```

### setValue(text)
Sets the text content and triggers auto-resize.

```javascript
textareaWidget.setValue('New text content');
```

### validate()
Validates the current content against configured rules.

```javascript
const isValid = textareaWidget.validate();
if (!isValid) {
  console.log('Validation failed');
}
```

### focus()
Focuses the textarea element.

```javascript
textareaWidget.focus();
```

### blur()
Removes focus from the textarea element.

```javascript
textareaWidget.blur();
```

## Events

### change
Fired when the text content changes.

```javascript
window.addEventListener('chatwidget:textarea:change', (e) => {
  const { widgetId, value } = e.detail;
  console.log(`Textarea ${widgetId} changed:`, value);
});
```

### submit
Fired when the textarea form is submitted.

```javascript
window.addEventListener('chatwidget:textarea:submit', (e) => {
  const { widgetId, value } = e.detail;
  console.log(`Textarea ${widgetId} submitted:`, value);
});
```

## Styling

The textarea widget uses CSS custom properties for styling:

```css
.chatui-textarea {
  --textarea-bg: #ffffff;
  --textarea-border: #e1e5e9;
  --textarea-border-focus: #007bff;
  --textarea-text: #495057;
  --textarea-placeholder: #6c757d;
  --textarea-padding: 12px;
  --textarea-border-radius: 6px;
  --textarea-font-size: 14px;
  --textarea-line-height: 1.5;
}
```

## Accessibility

- **ARIA Attributes**: Proper `aria-label`, `aria-required`, `aria-invalid`
- **Keyboard Navigation**: Full keyboard access and focus management
- **Screen Reader**: Compatible with screen readers
- **High Contrast**: Supports high contrast mode

## Examples

### Basic Textarea
```javascript
{
  type: 'textarea',
  config: {
    placeholder: 'Enter your feedback...',
    rows: 4
  }
}
```

### With Character Limit
```javascript
{
  type: 'textarea',
  config: {
    placeholder: 'Describe your issue...',
    maxLength: 500,
    showCharCount: true,
    required: true
  }
}
```

### With Custom Validation
```javascript
{
  type: 'textarea',
  config: {
    placeholder: 'Enter your message...',
    validation: (value) => {
      return value.includes('@') && value.length > 10;
    },
    onSubmit: (value) => {
      if (value.includes('@')) {
        submitMessage(value);
      }
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const textarea = chat.addWidget('textarea', {
  placeholder: 'Type your message here...',
  required: true,
  maxLength: 1000,
  showCharCount: true
});
```

### Event Handling
```javascript
window.addEventListener('chatwidget:textarea:change', (e) => {
  const { value } = e.detail;
  // Auto-save draft
  localStorage.setItem('message-draft', value);
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Full touch support with virtual keyboard handling
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Auto-resize**: Debounced resize events to prevent performance issues
- **Character Counting**: Efficient counting algorithms
- **Memory**: Proper cleanup of event listeners

## See Also

- [Input Widget](input-widget.md) - Single-line text input
- [Form Widget](form-widget.md) - Form container with validation
- [Validation Guide](../conventions.md#validation) - Validation patterns and best practices
