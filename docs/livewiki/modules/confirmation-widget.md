---
path: modules/confirmation-widget.md
page-type: module
summary: Yes/No confirmation dialog widget with customizable messages and actions.
tags: [widget, dialog, confirmation, modal, interaction]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Confirmation Widget

Interactive yes/no confirmation dialog component with customizable messages, styling, and action handling.

## Features

- **Modal Dialog**: Overlay confirmation with backdrop
- **Custom Messages**: Configurable title, message, and button text
- **Actions**: Separate handlers for confirm and cancel actions
- **Styling**: Customizable appearance and animations
- **Keyboard Navigation**: Escape to cancel, Enter to confirm
- **Accessibility**: Screen reader compatible with proper ARIA

## Configuration

```javascript
{
  type: 'confirmation',
  config: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Yes',
    cancelText: 'No',
    variant: 'primary', // 'primary', 'secondary', 'danger'
    showCancel: true,
    closeOnBackdrop: true,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled')
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | 'Confirm Action' | Dialog title |
| `message` | string | 'Are you sure?' | Confirmation message |
| `confirmText` | string | 'Yes' | Confirm button text |
| `cancelText` | string | 'No' | Cancel button text |
| `variant` | string | 'primary' | Button style variant |
| `showCancel` | boolean | true | Show cancel button |
| `closeOnBackdrop` | boolean | true | Close on backdrop click |

## Methods

### show()
Displays the confirmation dialog.

```javascript
confirmationWidget.show();
```

### hide()
Hides the confirmation dialog.

```javascript
confirmationWidget.hide();
```

### confirm()
Programmatically triggers confirm action.

```javascript
confirmationWidget.confirm();
```

### cancel()
Programmatically triggers cancel action.

```javascript
confirmationWidget.cancel();
```

### isVisible()
Returns whether the dialog is currently visible.

```javascript
const visible = confirmationWidget.isVisible();
console.log(visible); // true
```

### focus()
Focuses the confirm button.

```javascript
confirmationWidget.focus();
```

## Events

### show
Fired when the dialog is shown.

```javascript
window.addEventListener('chatwidget:confirmation:show', (e) => {
  const { widgetId } = e.detail;
  console.log(`Confirmation ${widgetId} shown`);
});
```

### hide
Fired when the dialog is hidden.

```javascript
window.addEventListener('chatwidget:confirmation:hide', (e) => {
  const { widgetId } = e.detail;
  console.log(`Confirmation ${widgetId} hidden`);
});
```

### confirm
Fired when the confirm action is triggered.

```javascript
window.addEventListener('chatwidget:confirmation:confirm', (e) => {
  const { widgetId } = e.detail;
  console.log(`Confirmation ${widgetId} confirmed`);
});
```

### cancel
Fired when the cancel action is triggered.

```javascript
window.addEventListener('chatwidget:confirmation:cancel', (e) => {
  const { widgetId } = e.detail;
  console.log(`Confirmation ${widgetId} cancelled`);
});
```

## Styling

The confirmation widget uses CSS custom properties:

```css
.chatui-confirmation {
  --confirmation-backdrop: rgba(0, 0, 0, 0.5);
  --confirmation-bg: #ffffff;
  --confirmation-border: #e1e5e9;
  --confirmation-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  --confirmation-border-radius: 8px;
  --confirmation-padding: 24px;
  --confirmation-max-width: 400px;
}

.chatui-confirmation-title {
  --title-color: #212529;
  --title-font-size: 18px;
  --title-font-weight: 600;
  --title-margin: 0 0 16px 0;
}

.chatui-confirmation-message {
  --message-color: #495057;
  --message-font-size: 14px;
  --message-line-height: 1.5;
  --message-margin: 0 0 24px 0;
}
```

## Accessibility

- **ARIA Attributes**: `aria-modal`, `aria-labelledby`, `aria-describedby`
- **Focus Trapping**: Focus stays within dialog while open
- **Keyboard Navigation**: Escape to cancel, Enter to confirm, Tab navigation
- **Screen Reader**: Announces dialog title and message
- **High Contrast**: Supports high contrast mode

## Examples

### Basic Confirmation
```javascript
{
  type: 'confirmation',
  config: {
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    onConfirm: () => {
      deleteItem();
    }
  }
}
```

### Save Confirmation
```javascript
{
  type: 'confirmation',
  config: {
    title: 'Save Changes',
    message: 'Do you want to save your changes before leaving?',
    confirmText: 'Save',
    cancelText: 'Don\'t Save',
    variant: 'primary',
    onConfirm: () => {
      saveChanges();
    },
    onCancel: () => {
      discardChanges();
    }
  }
}
```

### Simple Yes/No
```javascript
{
  type: 'confirmation',
  config: {
    message: 'Continue to the next step?',
    confirmText: 'Yes',
    cancelText: 'No',
    variant: 'secondary',
    onConfirm: () => {
      goToNextStep();
    }
  }
}
```

### Warning Confirmation
```javascript
{
  type: 'confirmation',
  config: {
    title: 'Warning',
    message: 'This action may affect other users. Are you sure you want to continue?',
    confirmText: 'Continue',
    cancelText: 'Go Back',
    variant: 'danger',
    onConfirm: () => {
      executeWarningAction();
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const confirmation = chat.addWidget('confirmation', {
  title: 'Confirm Deletion',
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  variant: 'danger',
  onConfirm: () => {
    deleteItem(itemId);
  },
  onCancel: () => {
    // User cancelled
  }
});
```

### Dynamic Content
```javascript
// Update confirmation message based on context
function showDeleteConfirmation(itemName) {
  confirmationWidget.setMessage(`Are you sure you want to delete "${itemName}"?`);
  confirmationWidget.show();
}
```

### Event Handling
```javascript
window.addEventListener('chatwidget:confirmation:confirm', (e) => {
  const { widgetId } = e.detail;
  // Track confirmation actions
  trackUserAction('confirmation_confirmed', { widgetId });
});

window.addEventListener('chatwidget:confirmation:cancel', (e) => {
  const { widgetId } = e.detail;
  // Track cancellation actions
  trackUserAction('confirmation_cancelled', { widgetId });
});
```

## Keyboard Navigation

### Standard Keys
- **Enter**: Confirm action
- **Escape**: Cancel action
- **Tab**: Navigate between buttons
- **Shift + Tab**: Navigate backwards

### Focus Management
- Focus is trapped within the dialog
- Confirm button receives initial focus
- Focus returns to previous element on close

## Advanced Features

### Custom HTML Content
```javascript
{
  type: 'confirmation',
  config: {
    title: 'Complex Confirmation',
    message: '<p>This action will:</p><ul><li>Delete all related data</li><li>Notify affected users</li></ul>',
    confirmText: 'Proceed',
    cancelText: 'Cancel',
    htmlContent: true
  }
}
```

### Async Confirmation
```javascript
{
  type: 'confirmation',
  config: {
    title: 'Process Data',
    message: 'Start processing the uploaded data?',
    confirmText: 'Start',
    cancelText: 'Cancel',
    onConfirm: async () => {
      confirmationWidget.setLoading(true);
      try {
        await processData();
        confirmationWidget.hide();
      } catch (error) {
        confirmationWidget.setError('Processing failed');
      } finally {
        confirmationWidget.setLoading(false);
      }
    }
  }
}
```

### Custom Variants
```javascript
{
  type: 'confirmation',
  config: {
    title: 'Information',
    message: 'New features are available!',
    confirmText: 'Learn More',
    cancelText: 'Dismiss',
    variant: 'info',
    showCancel: true
  }
}
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly with proper modal handling
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Modal Efficiency**: Efficient backdrop and modal rendering
- **Event Handling**: Proper cleanup of event listeners
- **Memory Management**: Clean DOM removal on hide
- **Animation**: Smooth transitions without layout thrashing

## Security Considerations

- **XSS Prevention**: Proper sanitization of message content
- **Focus Security**: Proper focus trapping to prevent escape
- **Content Security**: Safe rendering of custom HTML content

## See Also

- [Button Widget](button-widget.md) - Interactive button component
- [Buttons Widget](buttons-widget.md) - Enhanced button group
- [Modal Patterns](../conventions.md#modals) - Modal design patterns
