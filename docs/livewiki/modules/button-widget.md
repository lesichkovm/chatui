---
path: modules/button-widget.md
page-type: module
summary: Interactive button widget with variants, loading states, and comprehensive customization.
tags: [widget, button, action, interactive, states]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Button Widget

Interactive button component with multiple variants, loading states, and extensive customization options.

## Features

- **Multiple Variants**: Primary, secondary, outline, ghost, link styles
- **Loading States**: Built-in loading spinner and disabled state
- **Icons**: Support for icon buttons and icon-text combinations
- **Sizes**: Small, medium, large size options
- **States**: Hover, active, disabled, focus states
- **Accessibility**: Full keyboard navigation and screen reader support

## Configuration

```javascript
{
  type: 'button',
  config: {
    text: 'Click me',
    variant: 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'link'
    size: 'medium', // 'small', 'medium', 'large'
    disabled: false,
    loading: false,
    icon: null, // Icon class or SVG
    iconPosition: 'left', // 'left', 'right'
    fullWidth: false,
    onClick: () => console.log('Button clicked'),
    onSubmit: () => console.log('Button submitted')
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | string | 'Button' | Button text content |
| `variant` | string | 'primary' | Button style variant |
| `size` | string | 'medium' | Button size |
| `disabled` | boolean | false | Disable button |
| `loading` | boolean | false | Show loading state |
| `icon` | string | null | Icon class or SVG |
| `iconPosition` | string | 'left' | Icon position |
| `fullWidth` | boolean | false | Full width button |

## Methods

### setText(text)
Updates the button text.

```javascript
buttonWidget.setText('New text');
```

### getText()
Returns the current button text.

```javascript
const text = buttonWidget.getText();
console.log(text); // "Current text"
```

### setVariant(variant)
Changes the button variant.

```javascript
buttonWidget.setVariant('secondary');
```

### setSize(size)
Updates the button size.

```javascript
buttonWidget.setSize('large');
```

### setDisabled(disabled)
Enables or disables the button.

```javascript
buttonWidget.setDisabled(true);
```

### setLoading(loading)
Sets the loading state.

```javascript
buttonWidget.setLoading(true);
```

### focus()
Focuses the button.

```javascript
buttonWidget.focus();
```

### blur()
Removes focus from the button.

```javascript
buttonWidget.blur();
```

### click()
Programmatically clicks the button.

```javascript
buttonWidget.click();
```

## Events

### click
Fired when the button is clicked.

```javascript
window.addEventListener('chatwidget:button:click', (e) => {
  const { widgetId, text } = e.detail;
  console.log(`Button ${widgetId} clicked:`, text);
});
```

### submit
Fired when the button form is submitted.

```javascript
window.addEventListener('chatwidget:button:submit', (e) => {
  const { widgetId, text } = e.detail;
  console.log(`Button ${widgetId} submitted:`, text);
});
```

### loading-start
Fired when loading state starts.

```javascript
window.addEventListener('chatwidget:button:loading-start', (e) => {
  const { widgetId } = e.detail;
  console.log(`Button ${widgetId} loading started`);
});
```

### loading-end
Fired when loading state ends.

```javascript
window.addEventListener('chatwidget:button:loading-end', (e) => {
  const { widgetId } = e.detail;
  console.log(`Button ${widgetId} loading ended`);
});
```

## Button Variants

### Primary
Main action button with solid background.

```javascript
{
  type: 'button',
  config: {
    text: 'Submit',
    variant: 'primary'
  }
}
```

### Secondary
Secondary action button with different color scheme.

```javascript
{
  type: 'button',
  config: {
    text: 'Cancel',
    variant: 'secondary'
  }
}
```

### Outline
Button with transparent background and border.

```javascript
{
  type: 'button',
  config: {
    text: 'Learn More',
    variant: 'outline'
  }
}
```

### Ghost
Minimal button with no background or border.

```javascript
{
  type: 'button',
  config: {
    text: 'Edit',
    variant: 'ghost'
  }
}
```

### Link
Button styled as a link.

```javascript
{
  type: 'button',
  config: {
    text: 'View Details',
    variant: 'link'
  }
}
```

## Styling

The button widget uses CSS custom properties:

```css
.chatui-button {
  --button-bg-primary: #007bff;
  --button-bg-secondary: #6c757d;
  --button-bg-outline: transparent;
  --button-bg-ghost: transparent;
  --button-bg-link: transparent;
  
  --button-text-primary: #ffffff;
  --button-text-secondary: #ffffff;
  --button-text-outline: #007bff;
  --button-text-ghost: #495057;
  --button-text-link: #007bff;
  
  --button-border-primary: #007bff;
  --button-border-secondary: #6c757d;
  --button-border-outline: #007bff;
  --button-border-ghost: transparent;
  --button-border-link: transparent;
  
  --button-padding-small: 6px 12px;
  --button-padding-medium: 8px 16px;
  --button-padding-large: 12px 24px;
  --button-border-radius: 6px;
  --button-font-size: 14px;
  --button-font-weight: 500;
}
```

## Accessibility

- **ARIA Attributes**: `aria-label`, `aria-disabled`, `aria-busy`
- **Keyboard Navigation**: Enter, Space, Tab, Shift+Tab
- **Screen Reader**: Announces button state and purpose
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Visible focus indicator

## Examples

### Basic Button
```javascript
{
  type: 'button',
  config: {
    text: 'Click Me',
    onClick: () => {
      console.log('Button clicked!');
    }
  }
}
```

### With Icon
```javascript
{
  type: 'button',
  config: {
    text: 'Save',
    icon: 'fas fa-save',
    iconPosition: 'left',
    variant: 'primary'
  }
}
```

### Loading Button
```javascript
{
  type: 'button',
  config: {
    text: 'Submit',
    loading: false,
    onClick: async () => {
      buttonWidget.setLoading(true);
      try {
        await submitForm();
      } finally {
        buttonWidget.setLoading(false);
      }
    }
  }
}
```

### Full Width Button
```javascript
{
  type: 'button',
  config: {
    text: 'Continue',
    variant: 'primary',
    fullWidth: true,
    size: 'large'
  }
}
```

### Icon Only Button
```javascript
{
  type: 'button',
  config: {
    icon: 'fas fa-times',
    variant: 'ghost',
    onClick: () => {
      closeModal();
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const button = chat.addWidget('button', {
  text: 'Submit Form',
  variant: 'primary',
  onClick: () => {
    submitFormData();
  }
});
```

### Dynamic Updates
```javascript
// Update button state based on form validation
function updateButtonState(isValid) {
  buttonWidget.setDisabled(!isValid);
  buttonWidget.setText(isValid ? 'Submit' : 'Fix Errors');
}

// Show loading during async operation
async function handleSubmit() {
  buttonWidget.setLoading(true);
  buttonWidget.setText('Processing...');
  
  try {
    await processRequest();
    buttonWidget.setText('Success!');
  } catch (error) {
    buttonWidget.setText('Error - Retry');
  } finally {
    buttonWidget.setLoading(false);
  }
}
```

### Event Handling
```javascript
window.addEventListener('chatwidget:button:click', (e) => {
  const { widgetId, text } = e.detail;
  // Track button clicks
  trackUserAction('button_click', { widgetId, text });
});
```

## Keyboard Navigation

### Standard Keys
- **Enter/Space**: Activate button
- **Tab**: Move to next focusable element
- **Shift + Tab**: Move to previous focusable element

### Disabled State
- Disabled buttons are not focusable
- Screen readers announce disabled state

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly with proper hit targets
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Event Handling**: Efficient click event handling
- **State Updates**: Minimal DOM updates for state changes
- **Animation**: Smooth transitions without layout thrashing
- **Memory**: Proper cleanup of event listeners

## Advanced Features

### Custom Button Types
```javascript
{
  type: 'button',
  config: {
    text: 'Download',
    variant: 'primary',
    customType: 'submit', // 'button', 'submit', 'reset'
    formId: 'my-form'
  }
}
```

### Tooltip Support
```javascript
{
  type: 'button',
  config: {
    text: 'Help',
    variant: 'ghost',
    icon: 'fas fa-question-circle',
    tooltip: 'Click for help documentation'
  }
}
```

### Confirmation Dialog
```javascript
{
  type: 'button',
  config: {
    text: 'Delete',
    variant: 'secondary',
    confirm: {
      message: 'Are you sure you want to delete?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    },
    onClick: () => {
      deleteItem();
    }
  }
}
```

## See Also

- [Buttons Widget](buttons-widget.md) - Enhanced button group component
- [Confirmation Widget](confirmation-widget.md) - Yes/No confirmation dialog
- [Form Widget](form-widget.md) - Form container with validation
