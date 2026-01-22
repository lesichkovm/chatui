---
path: modules/interactive-menu.md
page-type: module
summary: Interactive widget menu system with color picker, position selector, and sound toggle for enhanced user experience.
tags: [widget, menu, interactive, ui, configuration]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Interactive Menu System

Advanced interactive menu system that provides users with real-time configuration options for the chat widget, including color customization, position selection, and sound preferences.

## Overview

The interactive menu system enhances user experience by providing intuitive controls for customizing the chat widget appearance and behavior without requiring code changes or page reloads.

## Features

- **Color Picker**: Real-time theme color selection with palette and hex input
- **Position Selector**: Dynamic widget positioning (corners and side positions)
- **Sound Toggle**: Enable/disable notification sounds
- **Live Preview**: Instant visual feedback for all changes
- **Persistent Settings**: Save user preferences across sessions
- **Responsive Design**: Mobile-friendly touch controls

## Configuration

```javascript
{
  type: 'interactive-menu',
  config: {
    enabled: true,
    position: 'top-right', // Menu button position
    theme: 'light', // light | dark | auto
    showColorPicker: true,
    showPositionSelector: true,
    showSoundToggle: true,
    persistSettings: true,
    storageKey: 'chatui-menu-settings'
  }
}
```

## Menu Components

### Color Picker Integration

The menu integrates with the color picker widget to provide:

```javascript
// Color picker configuration within menu
{
  type: 'color-picker',
  config: {
    value: '#007bff',
    presets: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1'],
    showPalette: true,
    showHexInput: true,
    livePreview: true
  }
}
```

### Position Selector

Users can position the chat widget in various locations:

```javascript
// Position options
const positions = [
  'bottom-left', 'bottom-right', 'bottom-center',
  'top-left', 'top-right', 'top-center',
  'left-center', 'right-center'
];

// Position selector configuration
{
  type: 'position-selector',
  config: {
    current: 'bottom-right',
    showPreview: true,
    animateTransition: true
  }
}
```

### Sound Toggle

Control notification sound preferences:

```javascript
// Sound toggle configuration
{
  type: 'sound-toggle',
  config: {
    enabled: true,
    volume: 0.5,
    soundFile: 'notification.mp3',
    testSound: true
  }
}
```

## Implementation

### HTML Structure

```html
<div class="chatui-interactive-menu" data-menu-id="main-menu">
  <button class="menu-toggle" aria-label="Open settings menu">
    <i class="icon-settings"></i>
  </button>
  
  <div class="menu-panel" role="dialog" aria-hidden="true">
    <div class="menu-header">
      <h3>Widget Settings</h3>
      <button class="close-menu" aria-label="Close menu">×</button>
    </div>
    
    <div class="menu-content">
      <!-- Color Picker Section -->
      <div class="menu-section">
        <h4>Theme Color</h4>
        <div class="color-picker-container"></div>
      </div>
      
      <!-- Position Selector Section -->
      <div class="menu-section">
        <h4>Widget Position</h4>
        <div class="position-selector-container"></div>
      </div>
      
      <!-- Sound Toggle Section -->
      <div class="menu-section">
        <h4>Sound Settings</h4>
        <div class="sound-toggle-container"></div>
      </div>
    </div>
  </div>
</div>
```

### JavaScript Integration

```javascript
// Initialize interactive menu
const menu = new InteractiveMenu({
  widget: chatWidget,
  container: document.body,
  settings: {
    position: 'bottom-right',
    color: '#007bff',
    soundEnabled: true
  }
});

// Listen for menu events
menu.addEventListener('color-change', (e) => {
  const { color } = e.detail;
  chatWidget.setColor(color);
});

menu.addEventListener('position-change', (e) => {
  const { position } = e.detail;
  chatWidget.setPosition(position);
});

menu.addEventListener('sound-toggle', (e) => {
  const { enabled } = e.detail;
  chatWidget.setSoundEnabled(enabled);
});
```

## CSS Styling

```css
.chatui-interactive-menu {
  position: fixed;
  z-index: 10000;
}

.menu-toggle {
  background: var(--chatui-primary-color, #007bff);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.menu-panel {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  padding: 16px;
  min-width: 280px;
  max-width: 320px;
}

.menu-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.menu-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
```

## Accessibility

The interactive menu system includes comprehensive accessibility features:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support with Tab, Enter, Escape
- **Focus Management**: Proper focus trapping within menu
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects prefers-reduced-motion preferences

```javascript
// Keyboard navigation example
menu.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'Escape':
      menu.close();
      break;
    case 'Tab':
      // Handle focus trapping
      e.preventDefault();
      menu.focusNextElement();
      break;
  }
});
```

## Storage Integration

User preferences are automatically saved to localStorage:

```javascript
// Storage schema
const menuSettings = {
  color: '#007bff',
  position: 'bottom-right',
  soundEnabled: true,
  menuPosition: 'top-right',
  lastUpdated: '2026-01-22T10:30:00Z'
};

// Load settings on initialization
const loadSettings = () => {
  const stored = localStorage.getItem('chatui-menu-settings');
  return stored ? JSON.parse(stored) : defaultSettings;
};

// Save settings on change
const saveSettings = (settings) => {
  localStorage.setItem('chatui-menu-settings', JSON.stringify(settings));
};
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-optimized controls
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Lazy Loading**: Menu components load on demand
- **Event Delegation**: Efficient event handling
- **CSS Transitions**: Hardware-accelerated animations
- **Minimal DOM**: Lightweight structure

## Integration Examples

### Basic Integration

```html
<script src="chat-widget.js"></script>
<script>
  const chat = ChatUI.init({
    serverUrl: 'https://your-server.com',
    interactiveMenu: {
      enabled: true,
      position: 'top-right'
    }
  });
</script>
```

### Advanced Configuration

```javascript
const chat = ChatUI.init({
  serverUrl: 'https://your-server.com',
  interactiveMenu: {
    enabled: true,
    position: 'top-right',
    customSections: [
      {
        id: 'advanced',
        title: 'Advanced Settings',
        content: '<div class="custom-section">...</div>'
      }
    ],
    onColorChange: (color) => {
      console.log('Color changed:', color);
    },
    onPositionChange: (position) => {
      console.log('Position changed:', position);
    }
  }
});
```

## Troubleshooting

### Common Issues

**Menu not appearing**
- Verify `enabled: true` in configuration
- Check container element exists
- Ensure CSS is loaded

**Color changes not applying**
- Verify CSS custom properties are supported
- Check for conflicting styles
- Ensure widget instance is available

**Position changes not working**
- Verify position values are valid
- Check container positioning
- Ensure CSS transforms are applied

## See Also

- [Color Picker Widget](color-picker-widget.md) - Color selection component
- [Theme System](theme.md) - Theme and styling documentation
- [Configuration](../configuration.md) - General configuration options
- [UI Module](ui.md) - UI management and DOM manipulation

## Changelog
- **v1.0.0** (2026-01-22): Initial interactive menu system implementation with color picker, position selector, and sound toggle
