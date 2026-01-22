---
path: modules/form-widget.md
page-type: module
summary: Form container widget with validation, submission handling, and field grouping.
tags: [widget, form, validation, submission, container]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Form Widget

Advanced form container component with validation, submission handling, field grouping, and comprehensive form management features.

## Features

- **Field Grouping**: Organize fields into logical sections
- **Validation**: Comprehensive form validation with custom rules
- **Submission**: Built-in submission handling with loading states
- **Error Handling**: Detailed error display and management
- **Reset**: Form reset and clearing functionality
- **Accessibility**: Full keyboard navigation and screen reader support

## Configuration

```javascript
{
  type: 'form',
  config: {
    fields: [
      {
        name: 'name',
        type: 'input',
        label: 'Name',
        required: true,
        validation: (value) => value.length >= 2
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        required: true,
        validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      }
    ],
    validation: 'onChange', // 'onChange', 'onSubmit', 'manual'
    showErrors: true,
    resetOnSubmit: false,
    onSubmit: (data) => console.log('Form submitted:', data),
    onValidation: (isValid, errors) => console.log('Validation:', isValid, errors)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fields` | array | [] | Array of field configurations |
| `validation` | string | 'onChange' | Validation trigger |
| `showErrors` | boolean | true | Show validation errors |
| `resetOnSubmit` | boolean | false | Reset form after submission |
| `submitText` | string | 'Submit' | Submit button text |
| `resetText` | string | 'Reset' | Reset button text |

## Field Configuration

### Basic Field
```javascript
{
  name: 'username',
  type: 'input',
  label: 'Username',
  placeholder: 'Enter username',
  required: true,
  validation: (value) => value.length >= 3
}
```

### Select Field
```javascript
{
  name: 'country',
  type: 'select',
  label: 'Country',
  required: true,
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]
}
```

### Field Group
```javascript
{
  type: 'group',
  label: 'Personal Information',
  fields: [
    {
      name: 'firstName',
      type: 'input',
      label: 'First Name',
      required: true
    },
    {
      name: 'lastName',
      type: 'input',
      label: 'Last Name',
      required: true
    }
  ]
}
```

## Methods

### getValue()
Returns all form field values.

```javascript
const formData = formWidget.getValue();
console.log(formData); // { name: 'John', email: 'john@example.com' }
```

### setValue(data)
Sets form field values.

```javascript
formWidget.setValue({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### getFieldValue(name)
Returns a specific field value.

```javascript
const name = formWidget.getFieldValue('name');
console.log(name); // "John Doe"
```

### setFieldValue(name, value)
Sets a specific field value.

```javascript
formWidget.setFieldValue('name', 'Jane Doe');
```

### validate()
Validates all form fields.

```javascript
const isValid = formWidget.validate();
console.log(isValid); // true
```

### getErrors()
Returns current validation errors.

```javascript
const errors = formWidget.getErrors();
console.log(errors); // { email: 'Invalid email format' }
```

### reset()
Resets all form fields to initial values.

```javascript
formWidget.reset();
```

### clear()
Clears all form field values.

```javascript
formWidget.clear();
```

### submit()
Programmatically submits the form.

```javascript
formWidget.submit();
```

### isSubmitting()
Returns whether form is currently submitting.

```javascript
const submitting = formWidget.isSubmitting();
console.log(submitting); // true
```

## Events

### change
Fired when any field value changes.

```javascript
window.addEventListener('chatwidget:form:change', (e) => {
  const { widgetId, fieldName, value, formData } = e.detail;
  console.log(`Form ${widgetId} field ${fieldName} changed:`, value);
});
```

### validation
Fired when validation runs.

```javascript
window.addEventListener('chatwidget:form:validation', (e) => {
  const { widgetId, isValid, errors } = e.detail;
  console.log(`Form ${widgetId} validation:`, isValid, errors);
});
```

### submit
Fired when form is submitted successfully.

```javascript
window.addEventListener('chatwidget:form:submit', (e) => {
  const { widgetId, formData } = e.detail;
  console.log(`Form ${widgetId} submitted:`, formData);
});
```

### error
Fired when submission encounters an error.

```javascript
window.addEventListener('chatwidget:form:error', (e) => {
  const { widgetId, error } = e.detail;
  console.log(`Form ${widgetId} error:`, error);
});
```

### reset
Fired when form is reset.

```javascript
window.addEventListener('chatwidget:form:reset', (e) => {
  const { widgetId } = e.detail;
  console.log(`Form ${widgetId} reset`);
});
```

## Styling

The form widget uses CSS custom properties:

```css
.chatui-form {
  --form-bg: #ffffff;
  --form-border: #e1e5e9;
  --form-padding: 20px;
  --form-border-radius: 8px;
  --form-gap: 16px;
}

.chatui-form-group {
  --group-margin: 0 0 20px 0;
  --group-gap: 12px;
}

.chatui-form-field {
  --field-margin: 0 0 12px 0;
  --field-gap: 8px;
}

.chatui-form-label {
  --label-color: #495057;
  --label-font-size: 14px;
  --label-font-weight: 500;
  --label-margin: 0 0 4px 0;
}

.chatui-form-error {
  --error-color: #dc3545;
  --error-font-size: 12px;
  --error-margin: 4px 0 0 0;
}
```

## Accessibility

- **ARIA Attributes**: `aria-required`, `aria-invalid`, `aria-describedby`
- **Keyboard Navigation**: Tab, Enter, Escape navigation
- **Screen Reader**: Field labels and error announcements
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Proper focus handling and error focus

## Examples

### Basic Contact Form
```javascript
{
  type: 'form',
  config: {
    fields: [
      {
        name: 'name',
        type: 'input',
        label: 'Full Name',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email Address',
        required: true,
        placeholder: 'Enter your email',
        validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        required: true,
        placeholder: 'Enter your message'
      }
    ],
    submitText: 'Send Message',
    onSubmit: (data) => {
      sendContactForm(data);
    }
  }
}
```

### Registration Form with Groups
```javascript
{
  type: 'form',
  config: {
    fields: [
      {
        type: 'group',
        label: 'Account Information',
        fields: [
          {
            name: 'username',
            type: 'input',
            label: 'Username',
            required: true,
            validation: (value) => value.length >= 3
          },
          {
            name: 'email',
            type: 'input',
            label: 'Email',
            required: true,
            validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          },
          {
            name: 'password',
            type: 'password',
            label: 'Password',
            required: true,
            validation: (value) => value.length >= 8
          }
        ]
      },
      {
        type: 'group',
        label: 'Personal Information',
        fields: [
          {
            name: 'firstName',
            type: 'input',
            label: 'First Name',
            required: true
          },
          {
            name: 'lastName',
            type: 'input',
            label: 'Last Name',
            required: true
          }
        ]
      }
    ],
    onSubmit: (data) => {
      registerUser(data);
    }
  }
}
```

### Survey Form
```javascript
{
  type: 'form',
  config: {
    fields: [
      {
        name: 'satisfaction',
        type: 'rating',
        label: 'How satisfied are you?',
        required: true
      },
      {
        name: 'features',
        type: 'checkbox',
        label: 'Which features do you use?',
        options: [
          { value: 'chat', label: 'Chat' },
          { value: 'file-upload', label: 'File Upload' },
          { value: 'video', label: 'Video Call' }
        ]
      },
      {
        name: 'feedback',
        type: 'textarea',
        label: 'Additional Feedback',
        placeholder: 'Share your thoughts...'
      }
    ],
    submitText: 'Submit Survey',
    onSubmit: (data) => {
      submitSurvey(data);
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const form = chat.addWidget('form', {
  fields: [
    {
      name: 'search',
      type: 'input',
      label: 'Search',
      placeholder: 'Enter search term'
    }
  ],
  submitText: 'Search',
  onSubmit: (data) => {
    performSearch(data.search);
  }
});
```

### Dynamic Field Updates
```javascript
// Add field dynamically
formWidget.addField({
  name: 'newField',
  type: 'input',
  label: 'New Field',
  required: true
});

// Update field validation
formWidget.updateField('email', {
  validation: (value) => value.endsWith('@company.com')
});
```

### Event Handling
```javascript
window.addEventListener('chatwidget:form:change', (e) => {
  const { fieldName, value } = e.detail;
  // Auto-save draft
  saveFormDraft(fieldName, value);
});

window.addEventListener('chatwidget:form:validation', (e) => {
  const { isValid } = e.detail;
  // Update submit button state
  updateSubmitButton(!isValid);
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly with virtual keyboard handling
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Validation Debouncing**: Efficient validation triggering
- **Field Rendering**: Optimized field updates
- **Memory Management**: Proper cleanup of field references
- **Event Optimization**: Efficient event handling

## See Also

- [Input Widget](input-widget.md) - Text input component
- [Container Widget](container-widget.md) - Layout container
- [Validation Guide](../conventions.md#validation) - Validation patterns
