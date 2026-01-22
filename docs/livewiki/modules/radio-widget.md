---
path: radio-widget.md
page-type: module
summary: Single selection radio widget with customizable options and layouts.
tags: [widget, radio, single-select, form, interactive]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Radio Widget

The Radio Widget provides single-selection functionality with customizable options, flexible layouts, and integrated submit functionality for collecting one choice from multiple options.

## Features

- **Single Selection**: Only one option can be selected at a time
- **Flexible Layouts**: Vertical or horizontal arrangement of options
- **Custom Options**: Each option can have custom text, values, and states
- **Submit Integration**: Automatic submit button with selection validation
- **Styling Options**: Multiple variants and sizes for customization
- **State Management**: Individual option disable states and global disable on submit
- **Accessibility**: Proper labeling and keyboard navigation support

## Usage

### Basic Radio Widget
```javascript
{
  type: 'radio',
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

### Horizontal Layout with Default Selection
```javascript
{
  type: 'radio',
  props: {
    layout: 'horizontal',
    buttonText: 'Continue',
    options: [
      { id: 'male', text: 'Male' },
      { id: 'female', text: 'Female', checked: true },
      { id: 'other', text: 'Other' }
    ]
  }
}
```

### Advanced Configuration
```javascript
{
  type: 'radio',
  props: {
    layout: 'vertical',
    variant: 'primary',
    size: 'large',
    buttonText: 'Save Choice',
    options: [
      { 
        id: 'beginner', 
        text: 'Beginner', 
        value: 'level-1',
        description: 'Just getting started'
      },
      { 
        id: 'intermediate', 
        text: 'Intermediate', 
        value: 'level-2',
        description: 'Some experience',
        checked: true
      },
      { 
        id: 'advanced', 
        text: 'Advanced', 
        value: 'level-3',
        description: 'Expert level',
        disabled: true
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
| `options` | array | Yes | Array of radio option objects |
| `buttonText` | string | No | Text displayed on submit button (default: 'Submit') |

### Option Object Properties
Each option in the `options` array supports:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | Required | Unique identifier for the option |
| `text` | string | Required | Display text for the option label |
| `value` | string | option.id | Value submitted when selected |
| `checked` | boolean | `false` | Initial selected state (only one can be true) |
| `disabled` | boolean | `false` | Individual option disabled state |
| `description` | string | `null` | Optional description text below label |

### Layout Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layout` | string | `'vertical'` | Layout arrangement ('vertical' or 'horizontal') |

### Behavior Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
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
  selectedOption: {
    id: "option2",
    value: "option2", 
    text: "Option 2"
  },
  widgetType: "radio"
}
```

## Styling Classes

### Container Classes
- `.widget-radio-container`: Main container element
- `.widget-radio-options`: Options container
- `.widget-radio-item`: Individual option wrapper

### Input Classes
- `.widget-radio`: Radio input element
- `.widget-radio-disabled`: Disabled radio state

### Label Classes
- `.widget-radio-label`: Option label element
- `.widget-radio-description`: Option description element

### Button Classes
- `.widget-radio-submit`: Submit button
- `.widget-radio-disabled`: Disabled button state
- `.variant-{variant}`: Button variant styling
- `.size-{size}`: Button size styling

## Examples

### Payment Method Selection
```javascript
{
  type: 'radio',
  props: {
    layout: 'vertical',
    buttonText: 'Continue to Payment',
    options: [
      { id: 'credit', text: 'Credit Card', checked: true },
      { id: 'debit', text: 'Debit Card' },
      { id: 'paypal', text: 'PayPal' },
      { id: 'bank', text: 'Bank Transfer' }
    ]
  }
}
```

### Difficulty Level Selection
```javascript
{
  type: 'radio',
  props: {
    layout: 'horizontal',
    buttonText: 'Start Game',
    options: [
      { id: 'easy', text: 'Easy' },
      { id: 'medium', text: 'Medium', checked: true },
      { id: 'hard', text: 'Hard' }
    ],
    optionsStyle: {
      display: 'flex',
      gap: '16px'
    }
  }
}
```

### Shipping Options
```javascript
{
  type: 'radio',
  props: {
    layout: 'vertical',
    buttonText: 'Apply Shipping',
    options: [
      { 
        id: 'standard', 
        text: 'Standard Shipping (5-7 days)',
        value: 'standard-5-7',
        checked: true
      },
      { 
        id: 'express', 
        text: 'Express Shipping (2-3 days)',
        value: 'express-2-3'
      },
      { 
        id: 'overnight', 
        text: 'Overnight Shipping (1 day)',
        value: 'overnight-1'
      }
    ]
  }
}
```

### Survey Question
```javascript
{
  type: 'radio',
  props: {
    layout: 'vertical',
    buttonText: 'Next Question',
    options: [
      { 
        id: 'strongly-disagree', 
        text: 'Strongly Disagree',
        description: 'Completely disagree with the statement'
      },
      { 
        id: 'disagree', 
        text: 'Disagree',
        description: 'Partially disagree with the statement'
      },
      { 
        id: 'neutral', 
        text: 'Neutral',
        description: 'Neither agree nor disagree',
        checked: true
      },
      { 
        id: 'agree', 
        text: 'Agree',
        description: 'Partially agree with the statement'
      },
      { 
        id: 'strongly-agree', 
        text: 'Strongly Agree',
        description: 'Completely agree with the statement'
      }
    ]
  }
}
```

## Accessibility

- Each radio has proper labeling association with its text
- Keyboard navigation support (Tab, Arrow keys, Space/Enter)
- Disabled states are properly indicated
- Form validation provides feedback for required selections
- Semantic HTML structure for screen readers
- Only one radio can be selected in a group

## Validation Rules

- Exactly one option must be selected for submission
- Disabled options cannot be selected by user interaction
- Only one option can have `checked: true` initially
- Empty submissions are blocked (radio groups always require a selection)

## Behavior Details

### Selection Behavior
- Clicking a radio selects it and deselects others
- Only one radio can be selected at a time
- Arrow keys navigate between options
- Space or Enter selects the focused radio

### Submit Behavior
- Submit button validates that an option is selected
- Can disable all radios after submission if specified
- Emits interaction event with selected option data

### Visual States
- **Selected**: Radio button filled, label highlighted
- **Unselected**: Radio button empty, normal styling
- **Disabled**: Grayed out, no interaction possible
- **Hover**: Visual feedback on mouse hover

## See Also

- [Base Widget](base-widget.md) - Core widget functionality
- [Checkbox Widget](checkbox-widget.md) - Multi-select alternative
- [Toggle Widget](toggle-widget.md) - Binary on/off selection
- [Container Widget](container-widget.md) - For creating complex forms
