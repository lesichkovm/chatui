---
path: modules/widget-types.md
page-type: module
summary: Widget type definitions and registry system for dynamic widget management.
tags: [widget, types, registry, factory, system]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Widget Types

Widget type definitions and registry system that enables dynamic widget creation, management, and extension capabilities.

## Features

- **Type Registry**: Centralized widget type registration
- **Dynamic Loading**: Runtime widget type discovery
- **Type Validation**: Widget type validation and verification
- **Extensible**: Easy addition of new widget types
- **Metadata**: Rich type metadata and descriptions

## Core Widget Types

### Input Widgets
- **input**: Single-line text input
- **textarea**: Multi-line text input
- **password**: Secure password input
- **text**: Static text display

### Selection Widgets
- **select**: Dropdown selection
- **radio**: Radio button group
- **checkbox**: Checkbox group
- **toggle**: Binary toggle switch

### Interactive Widgets
- **rating**: Star/emoji rating
- **date**: Date picker
- **color-picker**: Color selection
- **slider**: Numeric range slider
- **tags**: Tag input and management

### Action Widgets
- **button**: Interactive button
- **buttons**: Enhanced button group
- **confirmation**: Yes/No dialog
- **file-upload**: File upload interface

### Display & Layout Widgets
- **card**: Content display card
- **progress**: Progress indicator
- **container**: Layout container
- **list**: Dynamic list component
- **conditional**: Dynamic content rendering

## Type Registry

The widget types registry manages all available widget types:

```javascript
// Register a new widget type
WidgetTypes.register('custom-widget', CustomWidgetClass, {
  category: 'custom',
  description: 'Custom widget component',
  config: {
    // Default configuration schema
  }
});

// Get widget type information
const typeInfo = WidgetTypes.getType('input');
console.log(typeInfo); // { class: InputWidget, category: 'input', ... }

// List all widget types
const allTypes = WidgetTypes.getAllTypes();
console.log(allTypes); // ['input', 'textarea', 'password', ...]

// Get widgets by category
const inputWidgets = WidgetTypes.getByCategory('input');
console.log(inputWidgets); // ['input', 'textarea', 'password', 'text']
```

## Type Definition Structure

### Basic Type Definition
```javascript
{
  name: 'input',
  class: InputWidget,
  category: 'input',
  description: 'Single-line text input component',
  config: {
    placeholder: 'Enter text...',
    required: false,
    validation: null
  },
  metadata: {
    version: '1.0.0',
    author: 'ChatUI Team',
    tags: ['input', 'text', 'form']
  }
}
```

### Advanced Type Definition
```javascript
{
  name: 'rating',
  class: RatingWidget,
  category: 'interactive',
  description: 'Interactive rating component with stars, emojis, or hearts',
  config: {
    max: 5,
    type: 'star', // 'star', 'emoji', 'heart'
    required: false,
    onChange: null,
    onSubmit: null
  },
  metadata: {
    version: '1.2.0',
    author: 'ChatUI Team',
    tags: ['rating', 'interactive', 'feedback'],
    examples: [
      {
        name: 'Star Rating',
        config: { max: 5, type: 'star' }
      },
      {
        name: 'Emoji Rating',
        config: { max: 5, type: 'emoji' }
      }
    ]
  }
}
```

## Widget Categories

### Input Category
Widgets for data input and text entry:
- `input`: Single-line text input
- `textarea`: Multi-line text input
- `password`: Secure password input
- `text`: Static text display

### Selection Category
Widgets for option selection:
- `select`: Dropdown selection
- `radio`: Radio button group
- `checkbox`: Checkbox group
- `toggle`: Binary toggle switch

### Interactive Category
Widgets for interactive elements:
- `rating`: Rating component
- `date`: Date picker
- `color-picker`: Color selection
- `slider`: Range slider
- `tags`: Tag management

### Action Category
Widgets for user actions:
- `button`: Interactive button
- `buttons`: Button group
- `confirmation`: Confirmation dialog
- `file-upload`: File upload

### Display Category
Widgets for content display:
- `card`: Content card
- `progress`: Progress indicator
- `container`: Layout container
- `list`: Dynamic list
- `conditional`: Conditional content

## Type Validation

### Schema Validation
```javascript
// Validate widget configuration against type schema
const isValid = WidgetTypes.validateConfig('input', {
  placeholder: 'Enter text',
  required: true
});
console.log(isValid); // true
```

### Type Verification
```javascript
// Verify widget type exists
const exists = WidgetTypes.hasType('input');
console.log(exists); // true

// Get type metadata
const metadata = WidgetTypes.getMetadata('rating');
console.log(metadata); // { version: '1.2.0', author: 'ChatUI Team', ... }
```

## Dynamic Type Loading

### Runtime Registration
```javascript
// Register widget type at runtime
class CustomWidget extends BaseWidget {
  static get type() { return 'custom'; }
  // ... widget implementation
}

WidgetTypes.register('custom', CustomWidget, {
  category: 'custom',
  description: 'Custom widget component',
  config: {
    customProperty: 'default'
  }
});
```

### Type Discovery
```javascript
// Discover available widget types
const availableTypes = WidgetTypes.discover();
console.log(availableTypes);
// [
//   { name: 'input', category: 'input', description: '...' },
//   { name: 'textarea', category: 'input', description: '...' },
//   ...
// ]
```

## Type Metadata

### Version Information
```javascript
const typeInfo = WidgetTypes.getType('rating');
console.log(typeInfo.metadata.version); // '1.2.0'
console.log(typeInfo.metadata.author); // 'ChatUI Team'
```

### Tags and Categories
```javascript
// Get all tags for a type
const tags = WidgetTypes.getTags('rating');
console.log(tags); // ['rating', 'interactive', 'feedback']

// Get types by tag
const interactiveTypes = WidgetTypes.getByTag('interactive');
console.log(interactiveTypes); // ['rating', 'date', 'color-picker', 'slider', 'tags']
```

### Examples and Documentation
```javascript
// Get type examples
const examples = WidgetTypes.getExamples('rating');
console.log(examples);
// [
//   { name: 'Star Rating', config: { max: 5, type: 'star' } },
//   { name: 'Emoji Rating', config: { max: 5, type: 'emoji' } }
// ]
```

## Type Management

### Update Type
```javascript
// Update existing widget type
WidgetTypes.update('input', {
  description: 'Enhanced text input with validation',
  config: {
    placeholder: 'Enter text...',
    required: false,
    validation: null,
    maxLength: 1000
  }
});
```

### Remove Type
```javascript
// Remove widget type (use with caution)
WidgetTypes.unregister('deprecated-widget');
```

### Type Dependencies
```javascript
// Define type dependencies
WidgetTypes.register('advanced-widget', AdvancedWidget, {
  category: 'advanced',
  dependencies: ['input', 'button'],
  description: 'Advanced widget requiring input and button'
});
```

## Integration with Widget Factory

The widget types system integrates seamlessly with the widget factory:

```javascript
// Create widget using type registry
const widget = WidgetFactory.create('input', {
  placeholder: 'Enter your name',
  required: true
});

// Create widget with type validation
try {
  const widget = WidgetFactory.create('unknown-type', {});
} catch (error) {
  console.error('Unknown widget type:', error.message);
}
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Registry Efficiency**: Fast type lookup and validation
- **Memory Management**: Efficient type storage and cleanup
- **Validation Optimization**: Cached validation results
- **Dynamic Loading**: Lazy loading of widget types

## Security Considerations

- **Type Validation**: Prevents registration of malicious widget types
- **Config Sanitization**: Validates widget configurations
- **Access Control**: Optional access control for type registration

## See Also

- [Widget Factory](widget-factory.md) - Widget creation and management
- [Base Widget](base-widget.md) - Abstract base widget class
- [Widget Development Guide](../conventions.md#widget-development) - Creating custom widgets
