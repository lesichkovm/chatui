---
path: date-widget.md
page-type: module
summary: Date picker widget with validation, formatting, and customizable date constraints.
tags: [widget, date, picker, form, validation]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Date Widget

The Date Widget provides a date selection interface with validation, formatting options, and customizable date constraints for collecting date input from users.

## Features

- **Multiple Input Types**: Date, datetime-local, month, week, time inputs
- **Date Constraints**: Min/max date validation and default values
- **Formatted Display**: Optional human-readable date formatting
- **Submit Integration**: Built-in submit button with validation
- **Keyboard Support**: Enter key submission and accessibility
- **Styling Options**: Multiple variants and sizes for customization
- **Internationalization**: Configurable locale and formatting options

## Usage

### Basic Date Picker
```javascript
{
  type: 'date',
  props: {
    label: 'Select your birth date',
    buttonText: 'Submit',
    required: true
  }
}
```

### Date Range with Constraints
```javascript
{
  type: 'date',
  props: {
    label: 'Select appointment date',
    minDate: '2024-01-01',
    maxDate: '2024-12-31',
    defaultValue: '2024-06-15',
    buttonText: 'Book Appointment',
    variant: 'primary',
    showFormatted: true
  }
}
```

### DateTime Selection
```javascript
{
  type: 'date',
  props: {
    label: 'Schedule meeting time',
    inputType: 'datetime-local',
    minDate: '2024-01-01T09:00',
    maxDate: '2024-12-31T17:00',
    buttonText: 'Schedule',
    required: true,
    variant: 'secondary'
  }
}
```

## Properties

### Core Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | `'Select a date'` | Label text displayed above date input |
| `buttonText` | string | `'Submit'` | Text displayed on submit button |
| `inputType` | string | `'date'` | HTML5 input type (date, datetime-local, month, week, time) |

### Date Constraints
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `minDate` | string | `null` | Minimum allowed date (ISO format) |
| `maxDate` | string | `null` | Maximum allowed date (ISO format) |
| `defaultValue` | string | `null` | Default selected date (ISO format) |

### Display Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showFormatted` | boolean | `true` | Show formatted date display below input |

### Formatting Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `formatDate` | boolean | `false` | Include formatted date in interaction data |
| `locale` | string | `'en-US'` | Locale for date formatting |
| `formatOptions` | object | `{}` | Intl.DateTimeFormat options |

### Behavior Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `required` | boolean | `false` | Whether date selection is required |
| `disableOnSubmit` | boolean | `true` | Disable input after submission |
| `disabled` | boolean | `false` | Initial disabled state |

### Styling Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | string | `'primary'` | Color variant (primary, secondary) |
| `size` | string | `'medium'` | Size variant (small, medium, large) |
| `inputStyle` | object | `{}` | Custom CSS styles for date input |
| `buttonStyle` | object | `{}` | Custom CSS styles for submit button |
| `style` | object | `{}` | Custom CSS styles for main container |

## Input Types

### date
Standard date picker with calendar interface
```javascript
inputType: 'date'
// Format: YYYY-MM-DD
```

### datetime-local
Date and time selection
```javascript
inputType: 'datetime-local'
// Format: YYYY-MM-DDTHH:MM
```

### month
Month and year selection
```javascript
inputType: 'month'
// Format: YYYY-MM
```

### week
Week and year selection
```javascript
inputType: 'week'
// Format: YYYY-WWW
```

### time
Time selection only
```javascript
inputType: 'time'
// Format: HH:MM
```

## Events

### Interaction Event
The widget emits an interaction event when the user submits the date:

```javascript
{
  value: "2024-06-15",
  formattedValue: "Saturday, June 15, 2024",
  inputType: "date",
  widgetType: "date"
}
```

## Styling Classes

### Container Classes
- `.widget-date-container`: Main container element
- `.widget-date-label`: Label element
- `.widget-date-display`: Formatted date display

### Input Classes
- `.widget-date-input`: Date input element
- `.widget-date-disabled`: Disabled input state
- `.widget-date-error`: Validation error state
- `.variant-{variant}`: Variant styling
- `.size-{size}`: Size styling

### Button Classes
- `.widget-date-submit`: Submit button
- `.widget-date-disabled`: Disabled button state
- `.variant-{variant}`: Button variant styling
- `.size-{size}`: Button size styling

## Examples

### Birth Date Selection
```javascript
{
  type: 'date',
  props: {
    label: 'Date of Birth',
    maxDate: '2006-01-01',
    minDate: '1920-01-01',
    buttonText: 'Continue',
    required: true,
    variant: 'primary',
    size: 'large',
    showFormatted: true
  }
}
```

### Event Registration
```javascript
{
  type: 'date',
  props: {
    label: 'Event Date',
    minDate: '2024-01-01',
    buttonText: 'Register',
    required: true,
    formatDate: true,
    locale: 'en-US',
    formatOptions: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  }
}
```

### Appointment Scheduling
```javascript
{
  type: 'date',
  props: {
    label: 'Select Appointment Date',
    inputType: 'datetime-local',
    minDate: '2024-01-01T09:00',
    maxDate: '2024-12-31T17:00',
    buttonText: 'Book Appointment',
    required: true,
    variant: 'secondary',
    inputStyle: {
      fontSize: '16px',
      padding: '12px'
    }
  }
}
```

### Month Selection
```javascript
{
  type: 'date',
  props: {
    label: 'Select billing month',
    inputType: 'month',
    defaultValue: '2024-06',
    buttonText: 'Set Billing Cycle',
    variant: 'primary',
    showFormatted: false
  }
}
```

### Deadline Selection
```javascript
{
  type: 'date',
  props: {
    label: 'Project Deadline',
    minDate: '2024-01-01',
    buttonText: 'Set Deadline',
    required: true,
    formatDate: true,
    locale: 'en-US',
    formatOptions: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  }
}
```

## Accessibility

- Uses semantic HTML5 date input elements
- Proper labeling with associated label element
- Keyboard navigation support
- Error states are visually indicated
- Form validation provides user feedback
- Screen reader compatible

## Validation

- Required field validation if `required` is true
- Date range validation based on `minDate` and `maxDate`
- Invalid dates are prevented by browser input validation
- Empty submissions blocked if required
- Visual error states for validation failures

## Formatting Options

The widget supports custom date formatting using Intl.DateTimeFormat:

```javascript
formatOptions: {
  weekday: 'long',    // Monday, Tuesday, etc.
  year: 'numeric',    // 2024
  month: 'long',      // January, February, etc.
  day: 'numeric'      // 1, 2, 3, etc.
}
```

Common format combinations:
- US Style: `{ month: 'short', day: 'numeric', year: 'numeric' }`
- European Style: `{ day: 'numeric', month: 'short', year: 'numeric' }`
- Full Date: `{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }`

## Browser Support

- **Modern Browsers**: Full support for all input types
- **Mobile**: Native date/time pickers on iOS and Android
- **Desktop**: Calendar pickers and spinboxes
- **Fallback**: Text input with validation in older browsers

## See Also

- [Base Widget](base-widget.md) - Core widget functionality
- [Input Widget](input-widget.md) - Text input alternative
- [Container Widget](container-widget.md) - For creating multi-field date forms
