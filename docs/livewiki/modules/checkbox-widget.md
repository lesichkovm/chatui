---
path: checkbox-widget.md
page-type: module
summary: Multi-select checkbox widget with customizable options, layouts, and submit functionality.
tags: [widget, checkbox, multi-select, form, interactive]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Checkbox Widget

The Checkbox Widget provides multi-select functionality with customizable options, flexible layouts, and integrated submit functionality for collecting multiple user selections.

## Features

- **Multi-Select Options**: Support for multiple checkbox selections
- **Flexible Layouts**: Vertical or horizontal arrangement of options
- **Custom Options**: Each option can have custom text, values, and states
- **Submit Integration**: Automatic submit button with selection validation
- **Styling Options**: Multiple variants and sizes for customization
- **State Management**: Individual option disable states and global disable on submit
- **Accessibility**: Proper labeling and keyboard navigation support

## Usage

### Basic Checkbox Widget
```javascript
{
  type: 'checkbox',
  props: {
    options: [
      { id: 'option1', text: 'Option 1' },
      { id: 'option2', text: 'Option 2' },
      { id: 'option3', text: 'Option 3' }
    ],
    buttonText: 'Submit Selection'
  }
}
```

### Horizontal Layout with Pre-selected Options
```javascript
{
  type: 'checkbox',
  props: {
    layout: 'horizontal',
    buttonText: 'Continue',
    allowEmpty: false,
    options: [
      { id: 'newsletter', text: 'Subscribe to newsletter', checked: true },
      { id: 'updates', text: 'Receive product updates', checked: true },
      { id: 'marketing', text: 'Marketing emails' },
      { id: 'sms', text: 'SMS notifications' }
    ]
  }
}
```

### Advanced Configuration
```javascript
{
  type: 'checkbox',
  props: {
    layout: 'vertical',
    variant: 'primary',
    size: 'large',
    allowEmpty: true,
    disableOnSubmit: true,
    buttonText: 'Save Preferences',
    options: [
      { 
        id: 'privacy', 
        text: 'I agree to the privacy policy', 
        value: 'privacy-agreed',
        checked: true,
        disabled: true
      },
      { 
        id: 'terms', 
        text: 'I accept the terms and conditions', 
        value: 'terms-accepted',
        required: true
      },
      { 
        id: 'cookies', 
        text: 'Allow cookies for better experience', 
        value: 'cookies-enabled'
      }
    ],
    optionsStyle: {
      gap: '12px',
      padding: '8px 0'
    }
  }
}
```

## Properties

### Core Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `options` | array | Yes | Array of checkbox option objects |
| `buttonText` | string | No | Text displayed on submit button (default: 'Submit') |

### Option Object Properties
Each option in the `options` array supports:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | Required | Unique identifier for the option |
| `text` | string | Required | Display text for the option label |
| `value` | string | option.id | Value submitted when checked |
| `checked` | boolean | `false` | Initial checked state |
| `disabled` | boolean | `false` | Individual option disabled state |

### Layout Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layout` | string | `'vertical'` | Layout arrangement ('vertical' or 'horizontal') |

### Behavior Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `allowEmpty` | boolean | `true` | Allow submission with no selections |
| `disableOnSubmit` | boolean | `true` | Disable all options after submission |
| `disabled` | boolean | `false` | Global disabled state for all options |

### Styling Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | string | `'primary'` | Button variant (primary, secondary) |
| `size` | string | `'medium'` | Button size (small, medium, large) |
| `optionsStyle` | object | `{}` | Custom CSS styles for options container |
| `buttonStyle` | object | `{}` | Custom CSS styles for submit button |
| `style` | object | `{}` | Custom CSS styles for main container |

## Events

### Interaction Event
The widget emits an interaction event when the user submits their selection:

```javascript
{
  selectedOptions: [
    {
      id: "option1",
      value: "option1", 
      text: "Option 1"
    },
    {
      id: "option3",
      value: "option3",
      text: "Option 3"
    }
  ],
  widgetType: "checkbox"
}
```

## Styling Classes

### Container Classes
- `.widget-checkbox-container`: Main container element
- `.widget-checkbox-options`: Options container
- `.widget-checkbox-item`: Individual option wrapper

### Input Classes
- `.widget-checkbox`: Checkbox input element
- `.widget-checkbox-disabled`: Disabled checkbox state

### Label Classes
- `.widget-checkbox-label`: Option label element

### Button Classes
- `.widget-checkbox-submit`: Submit button
- `.widget-checkbox-disabled`: Disabled button state
- `.variant-{variant}`: Button variant styling
- `.size-{size}`: Button size styling

## Examples

### Product Features Selection
```javascript
{
  type: 'checkbox',
  props: {
    layout: 'horizontal',
    buttonText: 'Apply Filters',
    options: [
      { id: 'wifi', text: 'WiFi', checked: true },
      { id: 'bluetooth', text: 'Bluetooth' },
      { id: 'gps', text: 'GPS', checked: true },
      { id: 'nfc', text: 'NFC' },
      { id: 'waterproof', text: 'Waterproof' }
    ],
    optionsStyle: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }
}
```

### Newsletter Preferences
```javascript
{
  type: 'checkbox',
  props: {
    buttonText: 'Save Preferences',
    allowEmpty: true,
    options: [
      { 
        id: 'daily', 
        text: 'Daily Digest',
        value: 'daily-newsletter'
      },
      { 
        id: 'weekly', 
        text: 'Weekly Roundup',
        value: 'weekly-newsletter',
        checked: true
      },
      { 
        id: 'promotions', 
        text: 'Special Offers',
        value: 'promo-emails'
      },
      { 
        id: 'surveys', 
        text: 'Product Surveys',
        value: 'research-surveys'
      }
    ]
  }
}
```

### Terms and Conditions
```javascript
{
  type: 'checkbox',
  props: {
    layout: 'vertical',
    buttonText: 'Complete Registration',
    allowEmpty: false,
    options: [
      { 
        id: 'terms', 
        text: 'I have read and agree to the Terms of Service',
        required: true
      },
      { 
        id: 'privacy', 
        text: 'I understand and accept the Privacy Policy',
        required: true
      },
      { 
        id: 'marketing', 
        text: 'I would like to receive marketing communications (optional)'
      }
    ]
  }
}
```

## Accessibility

- Each checkbox has proper labeling association with its text
- Keyboard navigation support (Tab, Space, Arrow keys)
- Disabled states are properly indicated
- Form validation provides feedback for required selections
- Semantic HTML structure for screen readers

## Validation Rules

- At least one option must be selected if `allowEmpty` is `false`
- Disabled options cannot be selected by user interaction
- Required options are validated on form submission
- Empty submissions are blocked based on `allowEmpty` setting

## See Also

- [Base Widget](base-widget.md) - Core widget functionality
- [Radio Widget](radio-widget.md) - Single selection alternative
- [Toggle Widget](toggle-widget.md) - Binary on/off selection
- [Container Widget](container-widget.md) - For creating complex forms
