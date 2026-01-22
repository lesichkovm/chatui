---
path: modules/tags-widget.md
page-type: module
summary: Tag input and management widget with autocomplete, validation, and custom rendering.
tags: [widget, input, tags, autocomplete, multi-select]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Tags Widget

Advanced tag input and management component with autocomplete, validation, and flexible customization options.

## Features

- **Tag Input**: Dynamic tag creation and management
- **Autocomplete**: Built-in tag suggestions and completion
- **Validation**: Custom tag validation rules
- **Duplicate Prevention**: Automatic duplicate detection
- **Custom Rendering**: Custom tag templates and styling
- **Keyboard Navigation**: Full keyboard accessibility
- **Drag & Drop**: Optional tag reordering

## Configuration

```javascript
{
  type: 'tags',
  config: {
    placeholder: 'Add tags...',
    required: false,
    maxTags: null, // Maximum number of tags
    allowDuplicates: false,
    autocomplete: false,
    suggestions: ['javascript', 'python', 'react', 'vue'],
    validation: (tag) => {
      // Custom validation logic
      return tag.length >= 2 && tag.length <= 20;
    },
    transform: (tag) => {
      // Transform tag before adding
      return tag.toLowerCase().trim();
    },
    onChange: (tags) => console.log('Tags changed:', tags),
    onSubmit: (tags) => console.log('Tags submitted:', tags)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | string | 'Add tags...' | Input placeholder text |
| `required` | boolean | false | Whether tags are required |
| `maxTags` | number | null | Maximum number of tags |
| `allowDuplicates` | boolean | false | Allow duplicate tags |
| `autocomplete` | boolean | false | Enable autocomplete |
| `suggestions` | array | [] | Autocomplete suggestions |
| `delimiter` | string | ',' | Tag delimiter character |

## Methods

### getValue()
Returns the current array of tags.

```javascript
const tags = tagsWidget.getValue();
console.log(tags); // ['javascript', 'python', 'react']
```

### setValue(tags)
Sets the tags array.

```javascript
tagsWidget.setValue(['javascript', 'python']);
```

### addTag(tag)
Adds a single tag.

```javascript
tagsWidget.addTag('react');
```

### removeTag(tag)
Removes a tag by value or index.

```javascript
tagsWidget.removeTag('react');
// or by index
tagsWidget.removeTag(0);
```

### clearTags()
Removes all tags.

```javascript
tagsWidget.clearTags();
```

### getTagCount()
Returns the number of tags.

```javascript
const count = tagsWidget.getTagCount();
console.log(count); // 3
```

### hasTag(tag)
Checks if a tag exists.

```javascript
const hasReact = tagsWidget.hasTag('react');
console.log(hasReact); // true
```

### focus()
Focuses the tag input field.

```javascript
tagsWidget.focus();
```

## Events

### change
Fired when tags change.

```javascript
window.addEventListener('chatwidget:tags:change', (e) => {
  const { widgetId, tags, action, tag } = e.detail;
  console.log(`Tags ${widgetId} changed:`, tags);
  console.log(`Action: ${action}, Tag: ${tag}`);
});
```

### add
Fired when a tag is added.

```javascript
window.addEventListener('chatwidget:tags:add', (e) => {
  const { widgetId, tag } = e.detail;
  console.log(`Tag added: ${tag}`);
});
```

### remove
Fired when a tag is removed.

```javascript
window.addEventListener('chatwidget:tags:remove', (e) => {
  const { widgetId, tag } = e.detail;
  console.log(`Tag removed: ${tag}`);
});
```

### submit
Fired when tags are submitted.

```javascript
window.addEventListener('chatwidget:tags:submit', (e) => {
  const { widgetId, tags } = e.detail;
  console.log(`Tags submitted:`, tags);
});
```

## Styling

The tags widget uses CSS custom properties:

```css
.chatui-tags {
  --tags-bg: #ffffff;
  --tags-border: #e1e5e9;
  --tags-border-focus: #007bff;
  --tags-padding: 8px;
  --tags-border-radius: 6px;
}

.chatui-tag {
  --tag-bg: #007bff;
  --tag-text: #ffffff;
  --tag-border-radius: 16px;
  --tag-padding: 4px 8px;
  --tag-margin: 4px;
  --tag-font-size: 12px;
}

.chatui-tag-remove {
  --tag-remove-color: #ffffff;
  --tag-remove-hover: #dc3545;
}
```

## Accessibility

- **ARIA Attributes**: `aria-label`, `aria-describedby`, `aria-expanded`
- **Keyboard Navigation**: Arrow keys, Enter, Escape, Backspace, Delete
- **Screen Reader**: Announces tag additions and removals
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Proper focus handling for input and tags

## Examples

### Basic Tags Input
```javascript
{
  type: 'tags',
  config: {
    placeholder: 'Add your skills...',
    maxTags: 5
  }
}
```

### With Autocomplete
```javascript
{
  type: 'tags',
  config: {
    placeholder: 'Select technologies...',
    autocomplete: true,
    suggestions: [
      'javascript', 'typescript', 'python', 'java',
      'react', 'vue', 'angular', 'svelte',
      'node.js', 'express', 'django', 'flask'
    ]
  }
}
```

### With Validation
```javascript
{
  type: 'tags',
  config: {
    placeholder: 'Add categories...',
    validation: (tag) => {
      // Only allow alphanumeric tags, min 2 chars, max 20 chars
      return /^[a-z0-9]{2,20}$/i.test(tag);
    },
    transform: (tag) => {
      return tag.toLowerCase().trim();
    },
    onChange: (tags) => {
      console.log('Valid tags:', tags);
    }
  }
}
```

### Custom Styling
```javascript
{
  type: 'tags',
  config: {
    placeholder: 'Add labels...',
    suggestions: ['urgent', 'bug', 'feature', 'enhancement'],
    customStyles: {
      tag: {
        backgroundColor: '#28a745',
        color: '#ffffff'
      }
    }
  }
}
```

## Integration

### Programmatic Creation
```javascript
const tags = chat.addWidget('tags', {
  placeholder: 'Add tags...',
  maxTags: 10,
  autocomplete: true,
  suggestions: ['javascript', 'python', 'react']
});
```

### Dynamic Suggestions
```javascript
// Load suggestions from API
fetch('/api/tags/suggestions')
  .then(response => response.json())
  .then(suggestions => {
    tagsWidget.setSuggestions(suggestions);
  });
```

### Event Handling
```javascript
window.addEventListener('chatwidget:tags:change', (e) => {
  const { tags } = e.detail;
  // Save tags to backend
  saveUserTags(tags);
});
```

## Keyboard Navigation

### Tag Navigation
- **Left/Right Arrow**: Navigate between tags
- **Enter**: Select autocomplete suggestion
- **Escape**: Close autocomplete

### Tag Management
- **Backspace**: Remove last tag when input is empty
- **Delete**: Remove focused tag

### Input Focus
- **Tab**: Focus input field
- **Shift + Tab**: Move to previous focusable element

## Advanced Features

### Custom Tag Rendering
```javascript
{
  type: 'tags',
  config: {
    renderTag: (tag, removeTag) => {
      return `
        <span class="custom-tag">
          <span class="tag-icon">🏷️</span>
          ${tag}
          <button class="tag-remove">×</button>
        </span>
      `;
    }
  }
}
```

### Async Suggestions
```javascript
{
  type: 'tags',
  config: {
    asyncSuggestions: async (query) => {
      const response = await fetch(`/api/tags/search?q=${query}`);
      return response.json();
    }
  }
}
```

### Tag Groups
```javascript
{
  type: 'tags',
  config: {
    suggestions: [
      { value: 'javascript', group: 'Languages' },
      { value: 'react', group: 'Frameworks' },
      { value: 'node.js', group: 'Runtimes' }
    ]
  }
}
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly with virtual keyboard handling
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Autocomplete Debouncing**: Prevents excessive API calls
- **Virtual Scrolling**: Efficient for large suggestion lists
- **Event Optimization**: Efficient event handling
- **Memory Management**: Proper cleanup of suggestions

## See Also

- [Select Widget](select-widget.md) - Dropdown selection with multi-select
- [Checkbox Widget](checkbox-widget.md) - Multiple selection with checkboxes
- [Input Widget](input-widget.md) - Single text input
