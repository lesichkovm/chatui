---
path: modules/progress-widget.md
page-type: module
summary: Progress indicator widget with bar, circle, and step-based visualizations.
tags: [widget, progress, indicator, bar, circle, steps]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Progress Widget

Visual progress indicator component supporting bar, circle, and step-based progress visualizations with extensive customization options.

## Features

- **Multiple Types**: Bar, circle, and step progress indicators
- **Animations**: Smooth progress transitions and animations
- **Customizable**: Flexible styling and labeling options
- **Accessible**: Screen reader compatible with proper ARIA
- **Responsive**: Adapts to different screen sizes
- **States**: Loading, success, error, and indeterminate states

## Configuration

```javascript
{
  type: 'progress',
  config: {
    type: 'bar', // 'bar', 'circle', 'steps'
    value: 0, // 0-100 for bar/circle, current step for steps
    max: 100, // Maximum value for bar/circle, total steps for steps
    showLabel: true,
    showPercentage: true,
    animated: true,
    color: '#007bff',
    backgroundColor: '#e9ecef',
    size: 'medium', // 'small', 'medium', 'large'
    steps: [], // For step progress: ['Step 1', 'Step 2', 'Step 3']
    onChange: (value) => console.log('Progress changed:', value),
    onComplete: () => console.log('Progress complete')
  }
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | 'bar' | Progress type: 'bar', 'circle', 'steps' |
| `value` | number | 0 | Current progress value |
| `max` | number | 100 | Maximum value or total steps |
| `showLabel` | boolean | true | Show progress label |
| `showPercentage` | boolean | true | Show percentage for bar/circle |
| `animated` | boolean | true | Enable animations |
| `color` | string | '#007bff' | Progress color |
| `backgroundColor` | string | '#e9ecef' | Background color |
| `size` | string | 'medium' | Component size |

## Methods

### getValue()
Returns the current progress value.

```javascript
const value = progressWidget.getValue();
console.log(value); // 75
```

### setValue(value)
Sets the progress value.

```javascript
progressWidget.setValue(75);
```

### getPercentage()
Returns the progress as a percentage.

```javascript
const percentage = progressWidget.getPercentage();
console.log(percentage); // 75
```

### increment(amount)
Increments the progress by specified amount.

```javascript
progressWidget.increment(10);
```

### decrement(amount)
Decrements the progress by specified amount.

```javascript
progressWidget.decrement(5);
```

### reset()
Resets progress to initial value.

```javascript
progressWidget.reset();
```

### complete()
Sets progress to 100% and triggers completion.

```javascript
progressWidget.complete();
```

### isComplete()
Returns whether progress is complete.

```javascript
const complete = progressWidget.isComplete();
console.log(complete); // true
```

## Events

### change
Fired when progress value changes.

```javascript
window.addEventListener('chatwidget:progress:change', (e) => {
  const { widgetId, value, percentage } = e.detail;
  console.log(`Progress ${widgetId} changed:`, value, percentage);
});
```

### complete
Fired when progress reaches 100%.

```javascript
window.addEventListener('chatwidget:progress:complete', (e) => {
  const { widgetId } = e.detail;
  console.log(`Progress ${widgetId} completed`);
});
```

### reset
Fired when progress is reset.

```javascript
window.addEventListener('chatwidget:progress:reset', (e) => {
  const { widgetId } = e.detail;
  console.log(`Progress ${widgetId} reset`);
});
```

## Progress Types

### Bar Progress
Linear horizontal progress bar.

```javascript
{
  type: 'progress',
  config: {
    type: 'bar',
    value: 60,
    showPercentage: true,
    animated: true,
    color: '#28a745'
  }
}
```

### Circle Progress
Circular progress indicator.

```javascript
{
  type: 'progress',
  config: {
    type: 'circle',
    value: 75,
    size: 'large',
    showLabel: true,
    color: '#007bff'
  }
}
```

### Steps Progress
Step-based progress indicator.

```javascript
{
  type: 'progress',
  config: {
    type: 'steps',
    value: 2, // Current step (0-based)
    steps: ['Upload', 'Process', 'Review', 'Complete'],
    showLabels: true,
    animated: true
  }
}
```

## Styling

The progress widget uses CSS custom properties:

```css
.chatui-progress-bar {
  --progress-bg: #e9ecef;
  --progress-fill: #007bff;
  --progress-height: 8px;
  --progress-border-radius: 4px;
  --progress-animation-duration: 0.3s;
}

.chatui-progress-circle {
  --progress-circle-size: 120px;
  --progress-circle-stroke-width: 8px;
  --progress-circle-bg: #e9ecef;
  --progress-circle-fill: #007bff;
}

.chatui-progress-steps {
  --step-bg: #e9ecef;
  --step-bg-active: #007bff;
  --step-bg-complete: #28a745;
  --step-text: #495057;
  --step-text-active: #ffffff;
  --step-text-complete: #ffffff;
  --step-connector: #dee2e6;
  --step-connector-active: #007bff;
}
```

## Accessibility

- **ARIA Attributes**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- **Screen Reader**: Announces progress changes and completion
- **High Contrast**: Supports high contrast mode
- **Keyboard**: Accessible when interactive elements are included

## Examples

### Basic Progress Bar
```javascript
{
  type: 'progress',
  config: {
    type: 'bar',
    value: 45,
    showPercentage: true,
    color: '#28a745'
  }
}
```

### Animated Circle Progress
```javascript
{
  type: 'progress',
  config: {
    type: 'circle',
    value: 80,
    size: 'large',
    animated: true,
    showLabel: true,
    color: '#17a2b8'
  }
}
```

### Multi-Step Process
```javascript
{
  type: 'progress',
  config: {
    type: 'steps',
    value: 1,
    steps: [
      { label: 'Cart', icon: 'fas fa-shopping-cart' },
      { label: 'Shipping', icon: 'fas fa-truck' },
      { label: 'Payment', icon: 'fas fa-credit-card' },
      { label: 'Complete', icon: 'fas fa-check' }
    ],
    showLabels: true,
    showIcons: true
  }
}
```

### File Upload Progress
```javascript
{
  type: 'progress',
  config: {
    type: 'bar',
    value: 0,
    showLabel: true,
    label: 'Uploading file...',
    color: '#007bff',
    onChange: (value) => {
      updateUploadStatus(value);
    },
    onComplete: () => {
      showUploadSuccess();
    }
  }
}
```

### Loading Indicator
```javascript
{
  type: 'progress',
  config: {
    type: 'bar',
    value: null, // Indeterminate
    animated: true,
    showLabel: true,
    label: 'Loading...'
  }
}
```

## Integration

### Programmatic Creation
```javascript
const progress = chat.addWidget('progress', {
  type: 'bar',
  value: 0,
  showPercentage: true,
  color: '#28a745'
});

// Update progress based on async operation
async function processTask() {
  for (let i = 0; i <= 100; i += 10) {
    progress.setValue(i);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}
```

### Dynamic Updates
```javascript
// Update progress based on file upload
function updateUploadProgress(bytesLoaded, bytesTotal) {
  const percentage = Math.round((bytesLoaded / bytesTotal) * 100);
  progressWidget.setValue(percentage);
}

// Complete progress when done
function uploadComplete() {
  progressWidget.complete();
  showSuccessMessage('Upload completed!');
}
```

### Event Handling
```javascript
window.addEventListener('chatwidget:progress:change', (e) => {
  const { percentage } = e.detail;
  // Update related UI elements
  updateStatusIndicator(percentage);
});

window.addEventListener('chatwidget:progress:complete', (e) => {
  // Handle completion
  enableNextButton();
  showCompletionAnimation();
});
```

## Advanced Features

### Custom Labels
```javascript
{
  type: 'progress',
  config: {
    type: 'bar',
    value: 60,
    label: (value) => `Processing ${value}%...`,
    showLabel: true
  }
}
```

### Gradient Colors
```javascript
{
  type: 'progress',
  config: {
    type: 'bar',
    value: 75,
    gradient: ['#007bff', '#0056b3'],
    animated: true
  }
}
```

### Step Validation
```javascript
{
  type: 'progress',
  config: {
    type: 'steps',
    value: 2,
    steps: ['Personal Info', 'Address', 'Payment', 'Review'],
    stepValidation: (stepIndex) => {
      // Return whether step is valid
      return validateStep(stepIndex);
    }
  }
}
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Mobile**: Responsive design with touch support
- **Legacy**: Basic functionality with polyfills

## Performance Considerations

- **Animation Efficiency**: Smooth CSS transitions without layout thrashing
- **Update Optimization**: Efficient value updates with debouncing
- **Memory Management**: Proper cleanup of animation frames
- **Render Optimization**: Minimal DOM updates during progress changes

## See Also

- [Slider Widget](slider-widget.md) - Interactive range slider
- [File Upload Widget](file-upload-widget.md) - File upload with progress
- [Loading Patterns](../conventions.md#loading) - Loading state patterns
