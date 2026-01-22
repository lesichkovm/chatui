---
path: modules/select-widget.md
page-type: module
summary: Dropdown selection widget with search, grouping, and multi-select capabilities.
tags: [widget, selection, dropdown, select, multi-select]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Select Widget

Dropdown selection component with search functionality, option grouping, and comprehensive customization options.

## Features

- **Dropdown Interface**: Classic dropdown selection
- **Search**: Built-in search/filter functionality
- **Grouping**: Support for option groups
- **Multi-Select**: Optional multiple selection mode
- **Custom Rendering**: Custom option templates
- **Keyboard Navigation**: Full keyboard accessibility
- **Virtual Scrolling**: Efficient handling of large option lists

## Configuration

```javascript
{
  type: 'select',
  config: {
    placeholder: 'Select an option',
    required: false,
    multiple: false,
    searchable: false,
    clearable: true,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      {
        label: 'Group 1',
        options: [
          { value: 'group1-1', label: 'Group 1 Option 1' },
          { value: 'group1-2', label: 'Group 1 Option 2' }
        ]
      }
    ],
    maxSelected: null, // For multi-select
    onChange: (value) => console.log('Changed:', value),
    onSubmit: (value) => console.log('Submitted:', value)
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | string | 'Select an option' | Placeholder text |
| `required` | boolean | false | Whether selection is required |
| `multiple` | boolean | false | Enable multi-select mode |
| `searchable` | boolean | false | Enable search functionality |
| `clearable` | boolean | true | Allow clearing selection |
| `options` | array | [] | Array of options or groups |
| `maxSelected` | number | null | Maximum selections for multi-select |
| `loading` | boolean | false | Show loading state |

## Option Structure

### Simple Option
```javascript
{
  value: 'option-value',
  label: 'Option Label',
  disabled: false,
  description: 'Optional description',
  icon: 'icon-class'
}
```

### Option Group
```javascript
{
  label: 'Group Label',
  disabled: false,
  options: [
    { value: 'group-opt1', label: 'Group Option 1' },
    { value: 'group-opt2', label: 'Group Option 2' }
  ]
}
```

## Methods

### getValue()
Returns the current selected value(s).

```javascript
const value = selectWidget.getValue();
console.log(value); // "option1" or ["option1", "option2"]
```

### setValue(value)
Sets the selected value(s).

```javascript
selectWidget.setValue('option1');
// For multi-select
selectWidget.setValue(['option1', 'option2']);
```

### getSelectedOptions()
Returns the full selected option objects.

```javascript
const options = selectWidget.getSelectedOptions();
console.log(options); // [{ value: 'option1', label: 'Option 1' }]
```

### addOption(option)
Adds a new option to the list.

```javascript
selectWidget.addOption({
  value: 'new-option',
  label: 'New Option'
});
```

### removeOption(value)
Removes an option by value.

```javascript
selectWidget.removeOption('option1');
```

### open()
Opens the dropdown.

```javascript
selectWidget.open();
```

### close()
Closes the dropdown.

```javascript
selectWidget.close();
```

### focus()
Focuses the select input.

```javascript
selectWidget.focus();
```

## Events

### change
Fired when selection changes.

```javascript
window.addEventListener('chatwidget:select:change', (e) => {
  const { widgetId, value, selectedOptions } = e.detail;
  console.log(`Select ${widgetId} changed:`, value, selectedOptions);
});
```

### open
Fired when dropdown opens.

```javascript
window.addEventListener('chatwidget:select:open', (e) => {
  const { widgetId } = e.detail;
  console.log(`Select ${widgetId} opened`);
});
```

### close
Fired when dropdown closes.

```javascript
window.addEventListener('chatwidget:select:close', (e) => {
  const { widgetId } = e.detail;
  console.log(`Select ${widgetId} closed`);
});
```

### search
Fired when search query changes.

```javascript
window.addEventListener('chatwidget:select:search', (e) => {
  const { widgetId, query } = e.detail;
  console.log(`Search query: ${query}`);
});
```

## Styling

The select widget uses CSS custom properties:

```css
.chatui-select {
  --select-bg: #ffffff;
  --select-border: #e1e5e9;
  --select-border-focus: #007bff;
  --select-text: #495057;
  --select-placeholder: #6c757d;
  --select-padding: 12px;
  --select-border-radius: 6px;
  --select-font-size: 14px;
}

.chatui-select-dropdown {
  --dropdown-bg: #ffffff;
  --dropdown-border: #e1e5e9;
  --dropdown-shadow: 0 4px 12px rgba(0,0,0,0.15);
  --dropdown-max-height: 300px;
}

.chatui-select-option {
  --option-bg: transparent;
  --option-bg-hover: #f8f9fa;
  --option-bg-selected: #007bff;
  --option-text: #495057;
  --option-text-selected: #ffffff;
  --option-padding: 10px 12px;
}
```

## Accessibility

- **ARIA Attributes**: Proper `aria-label`, `aria-expanded`, `aria-selected`
- **Keyboard Navigation**: Arrow keys, Enter, Escape, Tab
- **Screen Reader**: Announces selection changes and options
- **High Contrast**: Supports high contrast mode
- **Focus Management**: Proper focus trapping in dropdown

## Examples

### Basic Select
```javascript
{
  type: 'select',
  config: {
    placeholder: 'Choose a country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' }
    ]
  }
}
```

### With Search
```javascript
{
  type: 'select',
  config: {
    placeholder: 'Search and select...',
    searchable: true,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      // ... many more options
    ]
  }
}
```

### Multi-Select
```javascript
{
  type: 'select',
  config: {
    placeholder: 'Select skills',
    multiple: true,
    maxSelected: 3,
    options: [
      { value: 'js', label: 'JavaScript' },
      { value: 'py', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'csharp', label: 'C#' }
    ]
  }
}
```

### Grouped Options
```javascript
{
  type: 'select',
  config: {
    placeholder: 'Select a product',
    options: [
      {
        label: 'Electronics',
        options: [
          { value: 'laptop', label: 'Laptop' },
          { value: 'phone', label: 'Smartphone' }
        ]
      },
      {
        label: 'Books',
        options: [
          { value: 'fiction', label: 'Fiction' },
          { value: 'non-fiction', label: 'Non-Fiction' }
        ]
      }
    ]
  }
}
```

## Integration

### Programmatic Creation
```javascript
const select = chat.addWidget('select', {
  placeholder: 'Select a category',
  searchable: true,
  options: [
    { value: 'tech', label: 'Technology' },
    { value: 'health', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' }
  ]
});
```

### Dynamic Options
```javascript
// Load options from API
fetch('/api/categories')
  .then(response => response.json())
  .then(categories => {
    selectWidget.setOptions(categories.map(cat => ({
      value: cat.id,
      label: cat.name
    })));
  });
```

### Event Handling
```javascript
window.addEventListener('chatwidget:select:change', (e) => {
  const { value } = e.detail;
  // Load subcategories based on selection
  loadSubcategories(value);
});
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Touch-friendly dropdown with native feel
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Virtual Scrolling**: Efficient for large option lists
- **Search Debouncing**: Prevents excessive filtering
- **Event Optimization**: Efficient event handling
- **Memory Management**: Proper cleanup of options

## See Also

- [Radio Widget](radio-widget.md) - Single selection with radio buttons
- [Checkbox Widget](checkbox-widget.md) - Multiple selection with checkboxes
- [Form Widget](form-widget.md) - Form container with validation
