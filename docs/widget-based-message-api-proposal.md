# Widget-Based Message API Proposal

## Executive Summary

This document describes the **Composable Widget-Based Message System** that is now implemented. By treating all message content as a tree of widgets, we enable deep nesting (e.g., cards containing multiple buttons) and a future-proof interface that simplifies both bot and human-driven interactions.

## Current State Analysis

### Existing Message Structure

```javascript
// Current format
{
  text: "message",
  sender: "user|bot", 
  timestamp: Date.now(),
  widgetData: { /* optional widget */ }
}
```

### Current Limitations

1. **Text-Centric Design**: Messages are primarily text with optional widgets as attachments.
2. **Inconsistent Architecture**: Widgets are second-class citizens attached to text messages.
3. **Limited Composition**: Cannot easily combine multiple content types (e.g., a card with text, an image, and a row of buttons).
4. **Extensibility Issues**: Adding new content types requires specific API handling logic.

## Composable Widgets (Current Architecture)

We move from a flat list of widgets to a **recursive widget tree**. Every element in a message is a widget, and some widgets (Containers) can host other widgets.

### The Unified Widget Schema

All widgets follow this base structure:

```typescript
interface Widget {
  type: string;          // e.g., "text", "container", "button", "card"
  id?: string;           // Optional unique identifier
  props?: object;        // Widget-specific properties
  children?: Widget[];   // Nested widgets (for layout/container widgets)
  meta?: object;         // Optional metadata (styles, tracking, etc.)
}
```

### Key Widget Categories

#### 1. Content Widgets (Leaves)
- **`text`**: Standard text, supports markdown or basic formatting.
- **`image`**: Displays an image with optional alt text.
- **`icon`**: Displays a decorative icon.

#### 2. Action Widgets (Interactions)
- **`button`**: A single clickable action.
- **`input`**: Text field, checkbox, or radio button.

#### 3. Container Widgets (Composers)
- **`container`**: Generic box for grouping widgets (v-stack/h-stack).
- **`card`**: A visually distinct container with padding and shadows.
- **`row` / `column`**: Specialized layout widgets.

### Example: Composable Card Message

A card containing an image, some text, and a horizontal row of buttons.

```javascript
{
  sender: "bot",
  timestamp: Date.now(),
  widgets: [
    {
      type: "card",
      children: [
        {
          type: "image",
          props: { src: "https://example.com/item.jpg", alt: "Item" }
        },
        {
          type: "text",
          props: { content: "Confirm your order for **Widget X**", format: "markdown" }
        },
        {
          type: "container",
          props: { layout: "horizontal", gap: "small" },
          children: [
            {
              type: "button",
              props: { label: "Confirm", value: "confirm_123", variant: "primary" }
            },
            {
              type: "button",
              props: { label: "Cancel", value: "cancel_123", variant: "secondary" }
            }
          ]
        }
      ]
    }
  ]
}
```

## Technical Implementation Details

### Updated Widget Factory (Recursive)

The factory must now handle nested children recursively.

```javascript
// src/modules/widgets/widget-factory.js
export class WidgetFactory {
  static createWidget(widgetConfig, widgetId) {
    const WidgetClass = this.widgetTypes.get(widgetConfig.type);
    if (!WidgetClass) return null;

    const widgetInstance = new WidgetClass(widgetConfig, widgetId);
    const element = widgetInstance.createElement();

    // Recursively process children if present
    if (widgetConfig.children && Array.isArray(widgetConfig.children)) {
      const childrenContainer = widgetInstance.getChildrenContainer ? 
                                widgetInstance.getChildrenContainer(element) : 
                                element;
      
      widgetConfig.children.forEach(childConfig => {
        const childWidget = this.createWidget(childConfig, widgetId);
        if (childWidget) {
          childrenContainer.appendChild(childWidget);
        }
      });
    }

    return element;
  }
}
```

### Layout Widgets Example

```javascript
// src/modules/widgets/container-widget.js
export class ContainerWidget extends BaseWidget {
  createElement() {
    const el = document.createElement('div');
    el.className = `widget-container layout-${this.widgetData.props?.layout || 'vertical'}`;
    if (this.widgetData.props?.gap) {
      el.classList.add(`gap-${this.widgetData.props.gap}`);
    }
    return el;
  }
}
```

## Benefits of Composability

1. **Infinite Flexibility**: Define once, use anywhere. A `button` behaves the same whether it's in a message root or inside a `card`.
2. **Cleaner API**: The API doesn't need to know about `card_with_buttons` or `text_with_image`. It only knows `widgets`.
3. **Future Proofing**: New widgets can be introduced (e.g., `chart`, `video`, `map`) and immediately placed inside existing containers like `tabs` or `cards`.
4. **UI Consistency**: Centralized layout logic (spacing, alignment) is handled by container widgets rather than per-message CSS.

## Implementation Roadmap

### Phase 1: Core Transformation (Weeks 1-2) ✅ **COMPLETED**
- ✅ Refactor `WidgetFactory` for recursion.
- ✅ Implement base `container`, `card`, and `text` (v2) widgets.
- ✅ Update `appendMessage` to support the recursive rendering.

### Phase 2: Widget Porting (Weeks 3-4) ✅ **COMPLETED**
- ✅ Port existing single-purpose widgets (Buttons, Select) to the new composable system.
- ✅ Add support for layout-specific properties (flex, grid, gap).
- ✅ Extended Phase 2: Ported all 14 widgets (Input, Password, Textarea, Checkbox, Slider, Rating, Toggle, Date, Tags, FileUpload, ColorPicker, Confirmation, Radio, Progress).

### Phase 3: Advanced Composition (Weeks 5-6) ✅ **COMPLETED**
- ✅ Add `conditional` containers (show/hide based on state).
- ✅ Implement `list` widgets for dynamic data.
- ✅ Update documentation with "Composition Recipes".

---
*Document Version: 4.0 (Implemented)*  
*Last Updated: January 22, 2026*  
*Author: ChatUI Development Team*
*Phase 1 Status: ✅ COMPLETED*
*Phase 2 Status: ✅ COMPLETED (Clean composable system)*
*Phase 3 Status: ✅ COMPLETED (Advanced composition)*
*Legacy Compatibility: ✅ Supported (legacy `text` + `widget` responses still accepted)*
