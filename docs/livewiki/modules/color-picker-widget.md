---
path: modules/color-picker-widget.md
page-type: module
summary: Color selection widget with palette, hex input, and preset colors.
tags: [widget, color, picker, selection, input]
created: 2026-01-22
updated: 2026-01-22
version: 1.1.0
---

# Color Picker Widget

Advanced color selection component with palette, hex input, preset colors, and comprehensive color management features.

## Features

- **Color Palette**: Visual color grid for easy selection
- **Hex Input**: Direct hex color code input
- **Preset Colors**: Customizable color presets
- **Color Preview**: Real-time color preview
- **RGB/HSL Support**: Multiple color format support
- **Accessibility**: Screen reader compatible

## Configuration

```javascript
{
  type: 'color-picker',
  config: {
    value: '#007bff',
    showPalette: true,
    showHex: true,
    showPresets: true,
    presets: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
    palette: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
    format: 'hex', // 'hex', 'rgb', 'hsl'
    onChange: (color) => console.log('Color changed:', color),
    onSubmit: (color) => console.log('Color submitted:', color)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | string | '#000000' | Initial color value |
| `showPalette` | boolean | true | Show color palette |
| `showHex` | boolean | true | Show hex input field |
| `showPresets` | boolean | true | Show preset colors |
| `presets` | array | [] | Array of preset color values |
| `palette` | array | [] | Color palette grid |
| `format` | string | 'hex' | Output color format |

## Methods

### getValue()
Returns the current color value.

```javascript
const color = colorPickerWidget.getValue();
console.log(color); // "#007bff"
```

### setValue(color)
Sets the color value.

```javascript
colorPickerWidget.setValue('#28a745');
```

### getRGB()
Returns color as RGB object.

```javascript
const rgb = colorPickerWidget.getRGB();
console.log(rgb); // { r: 0, g: 123, b: 255 }
```

### getHSL()
Returns color as HSL object.

```javascript
const hsl = colorPickerWidget.getHSL();
console.log(hsl); // { h: 210, s: 100, l: 50 }
```

### setPresets(presets)
Updates the preset colors.

```javascript
colorPickerWidget.setPresets(['#ff0000', '#00ff00', '#0000ff']);
```

## Events

### change
Fired when color selection changes.

```javascript
window.addEventListener('chatwidget:color-picker:change', (e) => {
  const { widgetId, color, rgb, hsl } = e.detail;
  console.log(`Color ${widgetId} changed:`, color);
});
```

### submit
Fired when color is submitted.

```javascript
window.addEventListener('chatwidget:color-picker:submit', (e) => {
  const { widgetId, color } = e.detail;
  console.log(`Color ${widgetId} submitted:`, color);
});
```

## Styling

The color picker widget uses CSS custom properties:

```css
.chatui-color-picker {
  --color-picker-bg: #ffffff;
  --color-picker-border: #e1e5e9;
  --color-picker-padding: 16px;
  --color-picker-border-radius: 8px;
}

.chatui-color-swatch {
  --swatch-size: 32px;
  --swatch-border: #ffffff;
  --swatch-border-width: 2px;
  --swatch-border-radius: 4px;
  --swatch-margin: 4px;
}

.chatui-color-input {
  --input-bg: #f8f9fa;
  --input-border: #dee2e6;
  --input-border-focus: #007bff;
  --input-padding: 8px 12px;
}
```

## Examples

### Basic Color Picker
```javascript
{
  type: 'color-picker',
  config: {
    value: '#007bff',
    onChange: (color) => {
      updateThemeColor(color);
    }
  }
}
```

### With Presets
```javascript
{
  type: 'color-picker',
  config: {
    value: '#28a745',
    presets: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6c757d'],
    showPalette: false,
    onSubmit: (color) => {
      saveUserPreference('theme-color', color);
    }
  }
}
```

### RGB Format Output
```javascript
{
  type: 'color-picker',
  config: {
    value: '#007bff',
    format: 'rgb',
    onChange: (color) => {
      console.log(color); // "rgb(0, 123, 255)"
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const colorPicker = chat.addWidget('color-picker', {
  value: '#007bff',
  presets: ['#ff0000', '#00ff00', '#0000ff'],
  onChange: (color) => {
    updateBackgroundColor(color);
  }
});
```

### Event Handling
```javascript
window.addEventListener('chatwidget:color-picker:change', (e) => {
  const { color } = e.detail;
  // Apply color to UI elements
  document.documentElement.style.setProperty('--primary-color', color);
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly color selection
- **Legacy**: Basic functionality with polyfills

## See Also

- [Input Widget](input-widget.md) - Text input component
- [Slider Widget](slider-widget.md) - Numeric range slider
- [Button Widget](button-widget.md) - Interactive button component

## Changelog
- **v1.1.0** (2026-01-22): Enhanced with interactive menu system integration and position selector support
- **v1.0.0** (2026-01-22): Initial color picker widget implementation
