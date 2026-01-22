---
path: modules/text-widget.md
page-type: module
summary: Static text display widget with formatting options and markdown support.
tags: [widget, display, text, formatting, markdown]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Text Widget

Static text display component with rich formatting options, markdown support, and flexible styling capabilities.

## Features

- **Rich Text**: Support for formatted text content
- **Markdown**: Built-in markdown parsing and rendering
- **HTML Support**: Safe HTML rendering with sanitization
- **Styling**: Customizable appearance and typography
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Screen reader compatible

## Configuration

```javascript
{
  type: 'text',
  config: {
    content: 'Hello, World!',
    format: 'plain', // 'plain', 'markdown', 'html'
    style: 'body', // 'heading', 'subheading', 'body', 'caption'
    size: 'medium', // 'small', 'medium', 'large'
    weight: 'normal', // 'normal', 'bold', 'light'
    color: null, // CSS color value
    align: 'left', // 'left', 'center', 'right', 'justify'
    truncate: false, // Enable text truncation
    maxLines: null, // Maximum lines to display
    selectable: true, // Allow text selection
    linkify: false // Auto-detect and convert URLs to links
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | string | '' | Text content to display |
| `format` | string | 'plain' | Content format: 'plain', 'markdown', 'html' |
| `style` | string | 'body' | Text style preset |
| `size` | string | 'medium' | Text size variant |
| `weight` | string | 'normal' | Font weight |
| `color` | string | null | Custom text color |
| `align` | string | 'left' | Text alignment |
| `truncate` | boolean | false | Enable text truncation |
| `maxLines` | number | null | Maximum lines to display |
| `selectable` | boolean | true | Allow text selection |
| `linkify` | boolean | false | Auto-convert URLs to links |

## Methods

### setContent(content)
Updates the text content.

```javascript
textWidget.setContent('New text content');
```

### getContent()
Returns the current text content.

```javascript
const content = textWidget.getContent();
console.log(content); // "Current text content"
```

### setFormat(format)
Changes the content format and re-renders.

```javascript
textWidget.setFormat('markdown');
```

### setStyle(style)
Updates the text style.

```javascript
textWidget.setStyle('heading');
```

## Events

### content-change
Fired when the text content changes.

```javascript
window.addEventListener('chatwidget:text:content-change', (e) => {
  const { widgetId, content } = e.detail;
  console.log(`Text ${widgetId} content changed:`, content);
});
```

### render-complete
Fired when the text is fully rendered.

```javascript
window.addEventListener('chatwidget:text:render-complete', (e) => {
  const { widgetId, format } = e.detail;
  console.log(`Text ${widgetId} rendered as ${format}`);
});
```

## Content Formats

### Plain Text
Simple text without formatting.

```javascript
{
  type: 'text',
  config: {
    content: 'This is plain text content.',
    format: 'plain'
  }
}
```

### Markdown
Support for common markdown syntax.

```javascript
{
  type: 'text',
  config: {
    content: '# Heading\n\n**Bold text** and *italic text*.\n\n- List item 1\n- List item 2',
    format: 'markdown'
  }
}
```

### HTML
Safe HTML rendering with sanitization.

```javascript
{
  type: 'text',
  config: {
    content: '<p><strong>Bold text</strong> and <em>italic text</em></p>',
    format: 'html'
  }
}
```

## Style Presets

### Heading
Large, bold text for headings.

```javascript
{
  type: 'text',
  config: {
    content: 'Main Title',
    style: 'heading',
    size: 'large',
    weight: 'bold'
  }
}
```

### Subheading
Medium-sized text for subheadings.

```javascript
{
  type: 'text',
  config: {
    content: 'Section Title',
    style: 'subheading',
    size: 'medium',
    weight: 'bold'
  }
}
```

### Body
Standard body text.

```javascript
{
  type: 'text',
  config: {
    content: 'Regular paragraph text content.',
    style: 'body',
    size: 'medium',
    weight: 'normal'
  }
}
```

### Caption
Small text for captions and notes.

```javascript
{
  type: 'text',
  config: {
    content: 'Optional caption text.',
    style: 'caption',
    size: 'small',
    weight: 'normal'
  }
}
```

## Styling

The text widget uses CSS custom properties:

```css
.chatui-text {
  --text-color: #495057;
  --text-color-heading: #212529;
  --text-color-caption: #6c757d;
  --text-font-size-small: 12px;
  --text-font-size-medium: 14px;
  --text-font-size-large: 18px;
  --text-font-weight-normal: 400;
  --text-font-weight-bold: 700;
  --text-font-weight-light: 300;
  --text-line-height: 1.5;
  --text-margin: 0 0 16px 0;
}
```

## Markdown Support

The text widget supports common markdown features:

### Text Formatting
- **Bold**: `**text**` or `__text__`
- *Italic*: `*text*` or `_text_`
- ***Bold Italic***: `***text***`
- ~~Strikethrough~~: `~~text~~`

### Headers
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Lists
```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

### Links
```markdown
[Link text](https://example.com)
```

### Code
```markdown
`Inline code`

```
Code block
```
```

## Accessibility

- **Semantic HTML**: Proper heading structure
- **Screen Reader**: Compatible with screen readers
- **Keyboard**: Full keyboard navigation
- **High Contrast**: Supports high contrast mode
- **Text Scaling**: Respects browser text size settings

## Security

### HTML Sanitization
When using HTML format, content is sanitized to prevent XSS:
- Removes dangerous tags (`<script>`, `<iframe>`, etc.)
- Removes event handlers
- Validates URLs and protocols
- Escapes unsafe characters

### Link Safety
- Validates link URLs
- Adds `rel="noopener noreferrer"` to external links
- Checks for malicious protocols

## Examples

### Simple Message
```javascript
{
  type: 'text',
  config: {
    content: 'Thank you for your message! We\'ll respond shortly.',
    style: 'body',
    align: 'center'
  }
}
```

### Formatted Heading
```javascript
{
  type: 'text',
  config: {
    content: '## Welcome to Chat Support\n\nHow can we help you today?',
    format: 'markdown',
    style: 'heading'
  }
}
```

### Truncated Text
```javascript
{
  type: 'text',
  config: {
    content: 'This is a very long text that will be truncated if it exceeds the maximum number of lines specified.',
    truncate: true,
    maxLines: 2
  }
}
```

### Linked Text
```javascript
{
  type: 'text',
  config: {
    content: 'Visit our [website](https://example.com) for more information.',
    format: 'markdown',
    linkify: true
  }
}
```

## Integration

### Programmatic Creation
```javascript
const text = chat.addWidget('text', {
  content: 'Hello, User!',
  style: 'heading',
  align: 'center'
});
```

### Dynamic Updates
```javascript
// Update content based on user interaction
textWidget.setContent(`Welcome, ${userName}!`);

// Change format for rich content
textWidget.setFormat('markdown');
textWidget.setContent('**Success!** Your message was sent.');
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Responsive design with touch support
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Markdown Parsing**: Efficient parsing with caching
- **HTML Sanitization**: Fast sanitization with allowlists
- **Rendering**: Optimized DOM updates
- **Memory**: Proper cleanup of references

## See Also

- [Card Widget](card-widget.md) - Structured content display
- [Container Widget](container-widget.md) - Layout container
- [Markdown Guide](../conventions.md#markdown) - Markdown syntax reference
