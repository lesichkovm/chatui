---
path: rating-widget.md
page-type: module
summary: Interactive rating widget with stars, emojis, or hearts for collecting user ratings.
tags: [widget, rating, stars, interactive, feedback]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Rating Widget

The Rating Widget provides an interactive rating system with customizable icons (stars, emojis, or hearts) for collecting user feedback and ratings.

## Features

- **Multiple Icon Types**: Stars, emojis, or hearts for rating display
- **Flexible Rating Scale**: Configurable maximum rating value
- **Interactive Hover Effects**: Visual feedback on hover with preview
- **Submit Integration**: Built-in submit button with validation
- **Rating Display**: Optional current rating display (e.g., "Rating: 3/5")
- **Styling Options**: Multiple variants and sizes for customization
- **State Management**: Default values and disable on submit functionality

## Usage

### Basic Star Rating
```javascript
{
  type: 'rating',
  props: {
    label: 'Rate your experience',
    maxRating: 5,
    buttonText: 'Submit Rating'
  }
}
```

### Emoji Rating with Default Value
```javascript
{
  type: 'rating',
  props: {
    label: 'How are you feeling today?',
    iconType: 'emojis',
    maxRating: 5,
    defaultValue: 4,
    buttonText: 'Submit Mood',
    variant: 'primary',
    size: 'large'
  }
}
```

### Heart Rating System
```javascript
{
  type: 'rating',
  props: {
    label: 'How much do you love this?',
    iconType: 'hearts',
    maxRating: 3,
    buttonText: 'Send Love',
    showRating: true,
    variant: 'secondary'
  }
}
```

## Properties

### Core Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | `'Rate this'` | Label text displayed above rating |
| `maxRating` | number | `5` | Maximum rating value (number of icons) |
| `buttonText` | string | `'Submit'` | Text displayed on submit button |

### Icon Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `iconType` | string | `'stars'` | Icon type ('stars', 'emojis', 'hearts') |
| `defaultValue` | number | `0` | Initial selected rating |

### Display Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showRating` | boolean | `true` | Show current rating display text |

### Behavior Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disableOnSubmit` | boolean | `true` | Disable all stars after submission |
| `disabled` | boolean | `false` | Initial disabled state |

### Styling Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | string | `'primary'` | Color variant (primary, secondary) |
| `size` | string | `'medium'` | Size variant (small, medium, large) |
| `starsStyle` | object | `{}` | Custom CSS styles for stars container |
| `buttonStyle` | object | `{}` | Custom CSS styles for submit button |
| `style` | object | `{}` | Custom CSS styles for main container |

## Icon Types

### Stars (Default)
- Uses star symbols (★) for rating
- Filled stars for selected rating
- Empty stars for unselected rating

### Emojis
- Uses emoji progression from sad to happy
- Emoji mapping: 😢 → 😕 → 😐 → 🙂 → 😊
- Automatically scales based on max rating

### Hearts
- Uses heart symbols (♥) for rating
- Filled hearts for selected rating
- Good for "like" or "love" type ratings

## Events

### Interaction Event
The widget emits an interaction event when the user submits their rating:

```javascript
{
  rating: 4,
  maxRating: 5,
  iconType: "stars",
  widgetType: "rating"
}
```

## Styling Classes

### Container Classes
- `.widget-rating-container`: Main container element
- `.widget-rating-stars`: Stars container
- `.widget-rating-label`: Label element
- `.widget-rating-display`: Rating display text

### Star Classes
- `.widget-rating-star`: Individual star/button element
- `.widget-rating-star.active`: Active/selected state
- `.widget-rating-disabled`: Disabled state

### Button Classes
- `.widget-rating-submit`: Submit button
- `.widget-rating-disabled`: Disabled button state
- `.variant-{variant}`: Variant styling
- `.size-{size}`: Size styling

## Examples

### Product Rating
```javascript
{
  type: 'rating',
  props: {
    label: 'Rate this product',
    maxRating: 5,
    iconType: 'stars',
    defaultValue: 0,
    buttonText: 'Submit Review',
    showRating: true,
    variant: 'primary',
    size: 'medium',
    starsStyle: {
      justifyContent: 'center',
      gap: '4px'
    }
  }
}
```

### Customer Satisfaction
```javascript
{
  type: 'rating',
  props: {
    label: 'How satisfied are you with our service?',
    iconType: 'emojis',
    maxRating: 5,
    buttonText: 'Submit Feedback',
    variant: 'secondary',
    size: 'large',
    showRating: false
  }
}
```

### Content Rating
```javascript
{
  type: 'rating',
  props: {
    label: 'Do you find this content helpful?',
    iconType: 'hearts',
    maxRating: 3,
    buttonText: 'Submit',
    variant: 'primary',
    size: 'small',
    disableOnSubmit: false
  }
}
```

### Restaurant Rating
```javascript
{
  type: 'rating',
  props: {
    label: 'Rate your dining experience',
    maxRating: 5,
    iconType: 'stars',
    defaultValue: 5,
    buttonText: 'Submit Rating',
    showRating: true,
    variant: 'primary',
    size: 'large',
    buttonStyle: {
      marginTop: '16px'
    }
  }
}
```

## Accessibility

- Each star/button is keyboard accessible
- Hover states provide visual feedback
- Current rating is announced to screen readers
- Proper labeling with descriptive text
- Disabled states are properly indicated

## Validation

- Rating must be greater than 0 for submission
- Disabled stars cannot be interacted with
- Submit button is disabled until rating is selected
- Form validation prevents empty submissions

## Behavior Details

### Hover Interaction
- Hovering over stars highlights up to that position
- Moving mouse away restores current selection
- Visual feedback helps users understand rating scale

### Selection Behavior
- Clicking a star sets the rating
- Multiple clicks can change selection before submission
- Default value can be pre-selected

### Submit Behavior
- Submit button validates rating > 0
- Can disable all stars after submission
- Emits interaction event with rating data

## See Also

- [Base Widget](base-widget.md) - Core widget functionality
- [Button Widget](button-widget.md) - Standalone button component
- [Container Widget](container-widget.md) - For creating rating forms with additional fields
