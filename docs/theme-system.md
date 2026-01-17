# ChatUI Theme System

## Overview

The ChatUI Theme System provides a **data-attributes-first** approach to theming, allowing users to customize the chat widget's appearance without writing any CSS. The system supports:

- ✅ **Two Base Themes**: Default (clean, minimal) and Branded (corporate-friendly)
- ✅ **Light/Dark Modes**: Each theme has both light and dark variants
- ✅ **Custom Colors**: Override any color via HTML data attributes
- ✅ **Runtime Switching**: Change themes and modes programmatically
- ✅ **Persistence**: Theme preferences saved to localStorage
- ✅ **System Integration**: Respects `prefers-color-scheme` media query

## Quick Start

### Basic Usage

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-position="bottom-right"
  data-theme="default"
  data-mode="light"
  data-title="Chat with us">
</script>
```

### Available Themes

#### 1. Default Theme

**Light Mode:**
- Primary: `#007bff` (Blue)
- Background: `#ffffff` (White)
- Surface: `#f8f9fa` (Light Gray)
- Text: `#212529` (Dark Gray)
- Border: `#e9ecef` (Light Border)

**Dark Mode:**
- Primary: `#4dabf7` (Light Blue)
- Background: `#1a1a1a` (Dark)
- Surface: `#2d2d2d` (Dark Gray)
- Text: `#ffffff` (White)
- Border: `#404040` (Medium Gray)

#### 2. Branded Theme

**Light Mode:**
- Primary: `#6366f1` (Indigo)
- Background: `#ffffff` (White)
- Surface: `#f5f3ff` (Light Purple)
- Text: `#1e1b4b` (Dark Indigo)
- Border: `#e0e7ff` (Light Indigo Border)

**Dark Mode:**
- Primary: `#818cf8` (Light Indigo)
- Background: `#0f172a` (Slate)
- Surface: `#1e293b` (Dark Slate)
- Text: `#f1f5f9` (Light Slate)
- Border: `#334155` (Medium Slate)

## Custom Colors (Data-Attributes-First)

You can override any color using data attributes. Separate attributes are provided for light and dark modes:

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-position="bottom-right"
  data-theme="default"
  data-mode="light"
  
  <!-- Light Mode Colors -->
  data-color-light="#ff6b6b"
  data-bg-color-light="#ffffff"
  data-surface-color-light="#ffe5e5"
  data-text-color-light="#2d2d2d"
  data-border-color-light="#ffcccc"
  
  <!-- Dark Mode Colors -->
  data-color-dark="#ff8787"
  data-bg-color-dark="#1a1a1a"
  data-surface-color-dark="#2d2020"
  data-text-color-dark="#ffffff"
  data-border-color-dark="#4a3030"
  
  data-title="Custom Chat">
</script>
```

### Available Color Attributes

| Attribute | Description | Default (Light) | Default (Dark) |
|-----------|-------------|-----------------|----------------|
| `data-color-light` | Primary color (buttons, links) | `#007bff` | - |
| `data-color-dark` | Primary color (dark mode) | - | `#4dabf7` |
| `data-bg-color-light` | Background color | `#ffffff` | - |
| `data-bg-color-dark` | Background color (dark mode) | - | `#1a1a1a` |
| `data-surface-color-light` | Surface/card color | `#f8f9fa` | - |
| `data-surface-color-dark` | Surface/card color (dark mode) | - | `#2d2d2d` |
| `data-text-color-light` | Text color | `#212529` | - |
| `data-text-color-dark` | Text color (dark mode) | - | `#ffffff` |
| `data-border-color-light` | Border color | `#e9ecef` | - |
| `data-border-color-dark` | Border color (dark mode) | - | `#404040` |

## Programmatic API

### Initialization

```javascript
// Initialize widget programmatically
const widget = ChatUI.init({
  serverUrl: 'http://localhost:3000',
  position: 'bottom-right',
  title: 'Chat with us'
});
```

### Theme Control Methods

#### `setTheme(theme)`
Set the theme (default or branded).

```javascript
widget.setTheme('branded');
```

**Parameters:**
- `theme` (string): Theme name - `'default'` or `'branded'`

---

#### `setThemeMode(mode)`
Set the theme mode (light or dark).

```javascript
widget.setThemeMode('dark');
```

**Parameters:**
- `mode` (string): Mode name - `'light'` or `'dark'`

---

#### `toggleThemeMode()`
Toggle between light and dark mode.

```javascript
const newMode = widget.toggleThemeMode();
console.log(`Switched to ${newMode} mode`);
```

**Returns:**
- `string`: The new mode (`'light'` or `'dark'`)

---

#### `getThemeConfig()`
Get the current theme configuration.

```javascript
const config = widget.getThemeConfig();
console.log(config);
// {
//   theme: 'default',
//   mode: 'dark',
//   colors: {
//     primary: '#4dabf7',
//     bg: '#1a1a1a',
//     surface: '#2d2d2d',
//     text: '#ffffff',
//     border: '#404040'
//   }
// }
```

**Returns:**
- `object`: Theme configuration with `theme`, `mode`, and `colors` properties

## Advanced Features

### Theme Persistence

Theme preferences are automatically saved to localStorage and will persist across page reloads:

```javascript
// User sets dark mode
widget.setThemeMode('dark');

// On next page load, dark mode is automatically applied
```

Storage keys:
- `chat-widget-{widgetId}-theme`: Stores the theme name
- `chat-widget-{widgetId}-mode`: Stores the mode (light/dark)

### System Theme Integration

The widget automatically respects the user's system theme preference if no explicit preference is set:

```javascript
// Widget will automatically use dark mode if user's system is set to dark
// No data-mode attribute needed
```

The widget also watches for system theme changes and updates automatically (unless user has set an explicit preference).

### Multiple Widgets

You can have multiple widgets with different themes on the same page:

```html
<!-- Widget 1: Default Light -->
<script 
  id="chat-widget-1"
  src="path/to/chat-widget.js"
  data-theme="default"
  data-mode="light"
  data-title="Support">
</script>

<!-- Widget 2: Branded Dark -->
<script 
  id="chat-widget-2"
  src="path/to/chat-widget.js"
  data-theme="branded"
  data-mode="dark"
  data-title="Sales">
</script>
```

## CSS Variables

The theme system uses CSS variables for maximum flexibility. You can also override these in your own CSS if needed:

```css
#chat-widget {
  --chat-primary: #your-color;
  --chat-bg: #your-bg;
  --chat-surface: #your-surface;
  --chat-text: #your-text;
  --chat-border: #your-border;
  --chat-primary-dark: #your-hover-color;
}
```

## Examples

### Example 1: Corporate Branded Widget

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-theme="branded"
  data-mode="light"
  data-color-light="#6366f1"
  data-title="Enterprise Support">
</script>
```

### Example 2: Custom Red Theme

```html
<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-theme="default"
  data-mode="light"
  data-color-light="#dc2626"
  data-surface-color-light="#fee2e2"
  data-border-color-light="#fecaca"
  data-title="Urgent Support">
</script>
```

### Example 3: Dynamic Theme Switching

```html
<button onclick="switchToDark()">Dark Mode</button>
<button onclick="switchToLight()">Light Mode</button>

<script 
  id="chat-widget"
  src="path/to/chat-widget.js"
  data-server-url="http://your-server.com"
  data-title="Chat">
</script>

<script>
  const widget = document.getElementById('chat-widget')._chatWidgetInstance;
  
  function switchToDark() {
    widget.setThemeMode('dark');
  }
  
  function switchToLight() {
    widget.setThemeMode('light');
  }
</script>
```

## Browser Support

The theme system works in all modern browsers that support:
- CSS Variables (Custom Properties)
- localStorage
- matchMedia API (for system theme detection)

Supported browsers:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

## Migration Guide

### From Legacy Color Attribute

**Old:**
```html
<script data-color="#007bff"></script>
```

**New:**
```html
<script 
  data-theme="default"
  data-mode="light"
  data-color-light="#007bff"
  data-color-dark="#4dabf7">
</script>
```

The old `data-color` attribute is still supported for backward compatibility but will only apply to the light mode primary color.

## Testing

Run the theme system tests:

```bash
npm test -- theme-system.spec.ts
```

View the theme demo:

```bash
# Start the demo server
npm run demo

# Open http://localhost:3000/demo/theme-demo.html
```

## Troubleshooting

### Theme not applying

1. **Check the build**: Make sure you've built the latest version
   ```bash
   npm run build
   ```

2. **Check the script element**: Ensure the widget script has an `id` attribute
   ```html
   <script id="chat-widget" src="..."></script>
   ```

3. **Check console**: Look for any JavaScript errors

### Custom colors not working

1. **Use correct attribute names**: Make sure to use `-light` or `-dark` suffix
2. **Use valid color values**: Use hex (`#ff0000`), rgb (`rgb(255,0,0)`), or named colors
3. **Check mode**: Custom colors are mode-specific

### Widget instance not found

```javascript
// Wait for widget to initialize
setTimeout(() => {
  const widget = document.getElementById('chat-widget')._chatWidgetInstance;
  // Now you can use the widget
}, 1000);
```

## Performance

The theme system is designed to be lightweight and performant:

- **Zero runtime overhead**: Themes use CSS variables, no JavaScript recalculation
- **Minimal bundle size**: ~2KB additional code (minified + gzipped)
- **Instant switching**: Theme changes are applied immediately via CSS
- **No reflows**: Color changes don't trigger layout recalculations

## Future Enhancements

Planned features for future releases:

- [ ] Theme presets library
- [ ] Color palette generator
- [ ] Accessibility contrast checker
- [ ] Theme export/import
- [ ] CSS-in-JS support
- [ ] Theme marketplace

## Support

For issues, questions, or feature requests, please visit:
- GitHub Issues: [chatui/issues](https://github.com/your-org/chatui/issues)
- Documentation: [chatui.dev/docs/themes](https://chatui.dev/docs/themes)

## License

MIT License - see LICENSE file for details
