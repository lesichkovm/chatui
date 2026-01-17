# Widget System Documentation

## Overview

The ChatUI widget system is designed to be extensible and modular. Each widget type is implemented as a separate class that extends the `BaseWidget` class.

## Architecture

```
src/modules/widgets/
├── base-widget.js      # Base class for all widgets
├── buttons-widget.js   # Button widget implementation
├── select-widget.js    # Dropdown select widget
├── input-widget.js     # Input form widget
├── widget-factory.js   # Factory for creating widgets
└── index.js           # Entry point and exports
```

## Adding a New Widget Type

### 1. Create Widget Class

Create a new file in `src/modules/widgets/` that extends `BaseWidget`:

```javascript
import { BaseWidget } from './base-widget.js';

export class MyCustomWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid custom widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    // Your widget implementation here
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'custom' && 
           // Add your validation logic here
           true;
  }
}
```

### 2. Register Widget Type

Add your widget to the factory in `widget-factory.js`:

```javascript
import { MyCustomWidget } from './my-custom-widget.js';

export class WidgetFactory {
  static widgetTypes = new Map([
    ['buttons', ButtonsWidget],
    ['select', SelectWidget],
    ['input', InputWidget],
    ['custom', MyCustomWidget]  // Add your widget here
  ]);
}
```

### 3. Update Exports

Add your widget to `index.js`:

```javascript
export { MyCustomWidget } from './my-custom-widget.js';
```

### 4. Add CSS Styles

Add styles for your widget in `ui.js`:

```javascript
#${widgetId} .widget-custom {
  margin-top: 8px;
  /* Your custom styles here */
}
```

## Widget Data Format

Each widget receives data in this format:

```json
{
  "type": "widget-type",
  "options": [...],  // Widget-specific options
  // Other widget-specific properties
}
```

## Available Widget Types

### Buttons Widget
```json
{
  "type": "buttons",
  "options": [
    { "id": "opt1", "text": "Option 1", "value": "value1" },
    { "id": "opt2", "text": "Option 2", "value": "value2" }
  ]
}
```

### Select Widget
```json
{
  "type": "select",
  "placeholder": "Choose an option...",
  "options": [
    { "id": "opt1", "text": "Option 1", "value": "value1" },
    { "id": "opt2", "text": "Option 2", "value": "value2" }
  ]
}
```

### Input Widget
```json
{
  "type": "input",
  "inputType": "text",
  "placeholder": "Enter your response...",
  "buttonText": "Submit"
}
```

## Best Practices

1. **Always validate widget data** in the `validate()` method
2. **Use consistent CSS classes** following the `widget-{type}` pattern
3. **Dispatch events** using the base class `handleInteraction()` method
4. **Handle accessibility** by adding proper ARIA attributes
5. **Test thoroughly** with different data scenarios

## Event Handling

All widgets dispatch a `widgetInteraction` event with this structure:

```javascript
{
  widgetId: "chat-widget-abc123",
  optionId: "opt1",
  optionValue: "value1", 
  optionText: "Option 1",
  widgetType: "buttons"
}
```

## Extending the System

The widget system is designed to be easily extensible. You can:

- Add new widget types by following the steps above
- Modify existing widgets without affecting others
- Create custom widget families for specific use cases
- Register widgets dynamically at runtime using `WidgetFactory.registerWidget()`
