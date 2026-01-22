---
path: widget-system.md
page-type: reference
summary: Composable widget system reference for ChatUI, including schemas, types, events, and extension points.
tags: [widgets, composition, schema, events, extension]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# Widget System

ChatUI uses a **composable widget tree**. Every message can contain one or more widgets, and many widgets can host nested children (containers, cards, forms, lists, etc.). This enables complex UI composition without bespoke message formats.

---

## Core Concepts

### 1) Widget Tree
Widgets are defined as a **recursive structure**:

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    { "type": "text", "props": { "content": "Welcome!", "format": "plain" } },
    {
      "type": "buttons",
      "props": {
        "options": [
          { "id": "start", "text": "Get Started", "value": "start" }
        ]
      }
    }
  ]
}
```

### 2) Widget Schema

```json
{
  "type": "string",
  "id": "optional-string",
  "props": { "any": "widget-specific" },
  "children": [ "Widget", "Widget", "..."]
}
```

- `type` is required.
- `props` is widget-specific.
- `children` is optional and only meaningful for container-like widgets.

---

## Supported Widget Types

### Content & Layout
- `text`
- `container`
- `card`
- `row` *(alias of container layout)*
- `column` *(alias of container layout)*
- `image` *(placeholder, behaves like container)*
- `icon` *(placeholder, behaves like container)*

### Actions
- `button`
- `buttons`
- `confirmation`

### Inputs
- `input`
- `password`
- `textarea`

### Selection
- `select`
- `radio`
- `checkbox`
- `toggle`

### Interactive
- `rating`
- `slider`
- `date`
- `tags`
- `color_picker`

### Data & Advanced
- `file_upload`
- `progress`
- `list`
- `conditional`
- `form`

---

## Message Formats

### Preferred (Composable)
The server can return an array of widgets for flexible, nested layouts:

```json
{
  "status": "success",
  "widgets": [
    {
      "type": "card",
      "children": [
        { "type": "text", "props": { "content": "Welcome!", "format": "plain" } },
        {
          "type": "buttons",
          "props": {
            "options": [
              { "id": "start", "text": "Get Started", "value": "start" }
            ]
          }
        }
      ]
    }
  ]
}
```

### Legacy (Still Supported)
Legacy single-widget messages are still supported:

```json
{
  "text": "Choose an option",
  "sender": "bot",
  "widget": {
    "type": "buttons",
    "options": [
      { "id": "opt1", "text": "Option 1", "value": "opt1" }
    ]
  }
}
```

---

## Widget Events

### `widgetInteraction` (Primary)
Dispatched when a user interacts with a widget (button click, select change, etc.).

```javascript
document.addEventListener("widgetInteraction", (event) => {
  console.log(event.detail);
});
```

Example payloads:

```json
{
  "widgetId": "chat-widget-xyz",
  "optionId": "start",
  "optionValue": "start",
  "optionText": "Get Started",
  "widgetType": "buttons"
}
```

```json
{
  "widgetId": "chat-widget-xyz",
  "value": "hello@example.com",
  "inputType": "text",
  "widgetType": "input"
}
```

```json
{
  "widgetId": "chat-widget-xyz",
  "rating": 4,
  "maxRating": 5,
  "iconType": "stars",
  "widgetType": "rating"
}
```

### `widgetValueChanged` (Form Coordination)
Emitted by input-like widgets on value change. Used by `form` to collect values.

```javascript
document.addEventListener("widgetValueChanged", (event) => {
  console.log(event.detail);
});
```

Example payload:

```json
{
  "widgetId": "chat-widget-xyz",
  "value": "Alice",
  "widgetType": "input"
}
```

---

## Form Widget

The `form` widget is a container that coordinates child inputs and emits a single `widgetInteraction` when an action button is pressed.

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    { "type": "input", "props": { "placeholder": "Your name" } },
    { "type": "input", "props": { "placeholder": "Your email" } },
    {
      "type": "buttons",
      "props": { "options": [{ "id": "submit", "text": "Submit" }] }
    }
  ]
}
```

---

## Extending the Widget System

### 1) Create a Widget Class
Create a new file under `src/modules/widgets/`:

```javascript
import { BaseWidget } from "./base-widget.js";

export class MyCustomWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment("Invalid custom widget data");
    }

    const el = document.createElement("div");
    el.className = "widget-custom";
    el.textContent = this.widgetData.props?.label || "Custom Widget";
    return el;
  }

  validate() {
    return super.validate() && this.widgetData.type === "custom";
  }
}
```

### 2) Register the Widget
Add it to the factory:

```javascript
import { MyCustomWidget } from "./my-custom-widget.js";

WidgetFactory.registerWidget("custom", MyCustomWidget);
```

### 3) Export It
Add to `src/modules/widgets/index.js`:

```javascript
export { MyCustomWidget } from "./my-custom-widget.js";
```

---

## Best Practices

- Validate input in `validate()` to avoid runtime errors.
- Use `props` for widget options and configuration.
- Dispatch interactions via `handleInteraction()` for consistent event payloads.
- Use `emitValueChange()` for value-based widgets to support forms.
- Prefer composable `widgets` array responses for new integrations.

---

## See Also

- `docs/overview.md`
- `docs/composition-recipes.md`
- `docs/form-composition-examples.md`
- `docs/backend-integration-guide.md`
