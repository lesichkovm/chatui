---
path: toggle-widget.md
page-type: module
summary: Binary toggle switch widget for on/off selections with customizable styling.
tags: [widget, toggle, switch, binary, interactive]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Toggle Widget

The Toggle Widget provides a binary on/off switch interface for simple yes/no or enabled/disabled selections with smooth animations and customizable styling.

## Features

- **Binary Selection**: Simple on/off toggle functionality
- **Visual Feedback**: Smooth animations and state transitions
- **Customizable Styling**: Multiple variants, sizes, and color schemes
- **Submit Integration**: Built-in submit button with state validation
- **Accessibility**: Keyboard navigation and screen reader support
- **State Management**: Default values and disable on submit functionality

## Usage

### Basic Toggle
```javascript
{
  type: 'toggle',
  props: {
    label: 'Enable notifications',
    buttonText: 'Save Settings',
    defaultValue: false
  }
}
```

### Pre-enabled Toggle
```javascript
{
  type: 'toggle',
  props: {
    label: 'Subscribe to newsletter',
    buttonText: 'Update Preferences',
    defaultValue: true,
    variant: 'primary',
    size: 'large'
  }
}
```

### Advanced Configuration
```javascript
{
  type: 'toggle',
  props: {
    label: 'Enable two-factor authentication',
    buttonText: 'Save Security Settings',
    defaultValue: false,
    required: true,
    variant: 'secondary',
    size: 'medium',
    disableOnSubmit: true,
    toggleStyle: {
      width: '60px',
      height: '30px'
    }
  }
}
```

## Properties

### Core Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | `'Toggle setting'` | Label text displayed above toggle |
| `buttonText` | string | `'Submit'` | Text displayed on submit button |
| `defaultValue` | boolean | `false` | Initial toggle state (true = on, false = off) |

### Behavior Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `required` | boolean | `false` | Whether toggle selection is required |
| `disableOnSubmit` | boolean | `true` | Disable toggle after submission |
| `disabled` | boolean | `false` | Initial disabled state |

### Styling Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | string | `'primary'` | Color variant (primary, secondary) |
| `size` | string | `'medium'` | Size variant (small, medium, large) |
| `toggleStyle` | object | `{}` | Custom CSS styles for toggle element |
| `buttonStyle` | object | `{}` | Custom CSS styles for submit button |
| `style` | object | `{}` | Custom CSS styles for main container |

## Events

### Interaction Event
The widget emits an interaction event when the user submits the toggle state:

```javascript
{
  value: true,
  widgetType: "toggle"
}
```

## Styling Classes

### Container Classes
- `.widget-toggle-container`: Main container element
- `.widget-toggle-label`: Label element

### Toggle Classes
- `.widget-toggle`: Toggle switch element
- `.widget-toggle.active`: On/active state
- `.widget-toggle.disabled`: Disabled state
- `.variant-{variant}`: Variant styling
- `.size-{size}`: Size styling

### Button Classes
- `.widget-toggle-submit`: Submit button
- `.widget-toggle-disabled`: Disabled button state
- `.variant-{variant}`: Button variant styling
- `.size-{size}`: Button size styling

## Examples

### Privacy Settings
```javascript
{
  type: 'toggle',
  props: {
    label: 'Share usage data with analytics',
    buttonText: 'Save Privacy Settings',
    defaultValue: false,
    variant: 'primary',
    size: 'medium'
  }
}
```

### Feature Enablement
```javascript
{
  type: 'toggle',
  props: {
    label: 'Enable dark mode',
    buttonText: 'Apply Theme',
    defaultValue: true,
    variant: 'secondary',
    size: 'large',
    disableOnSubmit: false
  }
}
```

### Email Preferences
```javascript
{
  type: 'toggle',
  props: {
    label: 'Receive promotional emails',
    buttonText: 'Update Email Preferences',
    defaultValue: false,
    variant: 'primary',
    size: 'medium'
  }
}
```

### Security Settings
```javascript
{
  type: 'toggle',
  props: {
    label: 'Require login for access',
    buttonText: 'Update Security',
    defaultValue: true,
    required: true,
    variant: 'primary',
    size: 'large',
    toggleStyle: {
      backgroundColor: '#dc3545'
    }
  }
}
```

## Accessibility

- Toggle switch is keyboard accessible (Tab, Space, Enter)
- State changes are announced to screen readers
- Proper labeling with descriptive text
- Visual feedback for state changes
- Disabled states are properly indicated

## Validation

- Toggle state is always valid (always has a value)
- Required validation ensures interaction before submission
- Disabled toggles cannot be interacted with
- Form validation prevents empty submissions if required

## Behavior Details

### Toggle Interaction
- Click or tap to toggle between on/off states
- Smooth animation transitions between states
- Visual feedback with color and position changes
- Keyboard support for accessibility

### Submit Behavior
- Submit button always enabled (toggle always has value)
- Can disable toggle after submission if specified
- Emits interaction event with current state
- Form validation based on required setting

### Visual States
- **Off State**: Toggle in left position, inactive styling
- **On State**: Toggle in right position, active styling
- **Disabled State**: Grayed out, no interaction possible
- **Hover State**: Visual feedback on mouse hover

## Custom Styling

The toggle widget supports extensive customization:

```javascript
toggleStyle: {
  width: '50px',           // Toggle width
  height: '25px',          // Toggle height
  backgroundColor: '#ccc', // Off state background
  activeColor: '#007bff'   // On state background
}
```

## Size Variants

- **Small**: Compact toggle for tight spaces
- **Medium**: Standard size for general use
- **Large**: Larger toggle for better accessibility

## Color Variants

- **Primary**: Blue theme for primary actions
- **Secondary**: Gray theme for secondary actions
- Custom colors supported via `toggleStyle`

## See Also

- [Base Widget](base-widget.md) - Core widget functionality
- [Checkbox Widget](checkbox-widget.md) - Multi-select alternative
- [Radio Widget](radio-widget.md) - Single selection alternative
- [Button Widget](button-widget.md) - Standalone button component
