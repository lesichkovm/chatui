---
path: modules/slider-widget.md
page-type: module
summary: Numeric range slider widget with step control, value display, and visual feedback.
tags: [widget, input, slider, range, numeric]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Slider Widget

Interactive numeric range slider component with step control, value display, and comprehensive customization options.

## Features

- **Range Selection**: Numeric value selection within defined range
- **Step Control**: Configurable step increments
- **Value Display**: Real-time value feedback
- **Visual Indicators**: Progress bar and handle styling
- **Keyboard Navigation**: Arrow key and tab navigation
- **Touch Support**: Mobile-friendly touch interactions

## Configuration

```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    showValue: true,
    showTicks: false,
    showLabels: false,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    disabled: false,
    onChange: (value) => console.log('Changed:', value),
    onSubmit: (value) => console.log('Submitted:', value)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `min` | number | 0 | Minimum value |
| `max` | number | 100 | Maximum value |
| `value` | number | 50 | Current/initial value |
| `step` | number | 1 | Step increment |
| `showValue` | boolean | true | Show current value |
| `showTicks` | boolean | false | Show tick marks |
| `showLabels` | boolean | false | Show min/max labels |
| `orientation` | string | 'horizontal' | Slider orientation |
| `disabled` | boolean | false | Disable slider |

## Methods

### getValue()
Returns the current slider value.

```javascript
const value = sliderWidget.getValue();
console.log(value); // 75
```

### setValue(value)
Sets the slider value.

```javascript
sliderWidget.setValue(75);
```

### getPercentage()
Returns the value as a percentage of the range.

```javascript
const percentage = sliderWidget.getPercentage();
console.log(percentage); // 75
```

### setRange(min, max)
Updates the slider range.

```javascript
sliderWidget.setRange(0, 200);
```

### setStep(step)
Updates the step increment.

```javascript
sliderWidget.setStep(5);
```

### disable()
Disables the slider.

```javascript
sliderWidget.disable();
```

### enable()
Enables the slider.

```javascript
sliderWidget.enable();
```

### focus()
Focuses the slider handle.

```javascript
sliderWidget.focus();
```

## Events

### change
Fired when the slider value changes.

```javascript
window.addEventListener('chatwidget:slider:change', (e) => {
  const { widgetId, value, percentage } = e.detail;
  console.log(`Slider ${widgetId} changed:`, value, percentage);
});
```

### input
Fired continuously during slider drag.

```javascript
window.addEventListener('chatwidget:slider:input', (e) => {
  const { widgetId, value } = e.detail;
  console.log(`Slider ${widgetId} input:`, value);
});
```

### submit
Fired when the slider value is submitted.

```javascript
window.addEventListener('chatwidget:slider:submit', (e) => {
  const { widgetId, value } = e.detail;
  console.log(`Slider ${widgetId} submitted:`, value);
});
```

## Styling

The slider widget uses CSS custom properties:

```css
.chatui-slider {
  --slider-track-bg: #e9ecef;
  --slider-track-fill: #007bff;
  --slider-handle-bg: #007bff;
  --slider-handle-border: #ffffff;
  --slider-handle-size: 20px;
  --slider-track-height: 6px;
  --slider-disabled-opacity: 0.6;
}

.chatui-slider-vertical {
  --slider-track-width: 6px;
  --slider-track-height: 200px;
}
```

## Accessibility

- **ARIA Attributes**: `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Keyboard Navigation**: Arrow keys, Home, End, Page Up/Down
- **Screen Reader**: Announces value changes and range information
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Visible focus indicator

## Examples

### Basic Slider
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 100,
    value: 25,
    showValue: true
  }
}
```

### With Step Control
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 10,
    step: 0.5,
    value: 5,
    showValue: true,
    showTicks: true
  }
}
```

### Price Range Slider
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 1000,
    step: 50,
    value: 500,
    showValue: true,
    showLabels: true,
    onChange: (value) => {
      updatePriceDisplay(`$${value}`);
    }
  }
}
```

### Vertical Slider
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 100,
    value: 75,
    orientation: 'vertical',
    showValue: true,
    showTicks: true
  }
}
```

### Volume Slider
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    showValue: false,
    showTicks: false,
    onChange: (value) => {
      setVolume(value);
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const slider = chat.addWidget('slider', {
  min: 0,
  max: 100,
  value: 75,
  showValue: true,
  showTicks: true
});
```

### Dynamic Updates
```javascript
// Update slider based on external data
sliderWidget.setValue(currentProgress);

// Change range based on user preferences
sliderWidget.setRange(minPreference, maxPreference);
```

### Event Handling
```javascript
window.addEventListener('chatwidget:slider:change', (e) => {
  const { value } = e.detail;
  // Update related UI elements
  updateProgressIndicator(value);
  saveUserPreference('slider-value', value);
});
```

## Keyboard Navigation

### Arrow Keys
- **Left/Down**: Decrease by step
- **Right/Up**: Increase by step

### Page Keys
- **Page Down**: Decrease by larger step (10x step)
- **Page Up**: Increase by larger step (10x step)

### Home/End
- **Home**: Set to minimum value
- **End**: Set to maximum value

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly with gesture support
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Event Throttling**: Efficient handling of continuous input events
- **Render Optimization**: Minimal DOM updates during drag
- **Memory Management**: Proper cleanup of event listeners

## Advanced Features

### Custom Step Function
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 100,
    step: (value) => {
      // Custom step logic
      if (value < 50) return 1;
      if (value < 80) return 5;
      return 10;
    }
  }
}
```

### Value Formatting
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 1000,
    value: 500,
    formatValue: (value) => {
      return `$${value.toLocaleString()}`;
    }
  }
}
```

### Custom Ticks
```javascript
{
  type: 'slider',
  config: {
    min: 0,
    max: 100,
    ticks: [0, 25, 50, 75, 100],
    tickLabels: ['0%', '25%', '50%', '75%', '100%'],
    showTicks: true
  }
}
```

## See Also

- [Input Widget](input-widget.md) - Numeric text input
- [Rating Widget](rating-widget.md) - Star-based rating system
- [Progress Widget](progress-widget.md) - Progress display component
