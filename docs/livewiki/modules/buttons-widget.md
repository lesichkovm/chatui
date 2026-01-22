---
path: modules/buttons-widget.md
page-type: module
summary: Enhanced buttons widget with multiple variants, sizes, and interactive states.
tags: [module, widget, buttons, interactive, actions]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Buttons Widget

The Buttons Widget provides enhanced button components with multiple variants, sizes, loading states, and interactive behaviors. It's designed for creating consistent, accessible, and visually appealing action buttons throughout the ChatUI interface.

## Overview

The Buttons Widget extends basic button functionality with rich customization options, including different visual styles, sizes, icons, loading states, and comprehensive accessibility support. It can be used as standalone buttons or grouped together.

## Key Features

- **Multiple Variants**: Primary, secondary, ghost, danger, and more
- **Flexible Sizing**: Small, medium, large, and custom sizes
- **Icon Support**: Built-in icon integration and positioning
- **Loading States**: Visual feedback during async operations
- **Disabled States**: Clear visual indication when disabled
- **Accessibility**: Full keyboard navigation and screen reader support
- **Group Support**: Button groups for related actions

## Configuration Options

### Basic Configuration

```javascript
{
    type: 'buttons',
    props: {
        label: 'Button Text',             // Button text
        variant: 'primary',               // Visual variant
        size: 'medium',                   // Button size
        disabled: false,                  // Disabled state
        loading: false,                   // Loading state
        icon: 'none',                     // Icon name or position
        iconPosition: 'left',             // Icon position
        fullWidth: false,                 // Full width button
        onClick: () => {},                // Click handler
        className: 'custom-button',       // Additional CSS classes
        style: {},                        // Inline styles
        ariaLabel: 'Button description',  // Accessibility label
        tabIndex: 0,                      // Tab index
        type: 'button'                    // HTML button type
    }
}
```

## Button Variants

### 1. Primary Variant

Main action button with prominent styling:

```javascript
{
    type: 'buttons',
    props: {
        label: 'Submit',
        variant: 'primary',
        onClick: () => console.log('Primary action')
    }
}
```

### 2. Secondary Variant

Secondary action with less prominent styling:

```javascript
{
    type: 'buttons',
    props: {
        label: 'Cancel',
        variant: 'secondary',
        onClick: () => console.log('Secondary action')
    }
}
```

### 3. Ghost Variant

Minimal styling with transparent background:

```javascript
{
    type: 'buttons',
    props: {
        label: 'Learn More',
        variant: 'ghost',
        onClick: () => console.log('Ghost action')
    }
}
```

### 4. Danger Variant

For destructive actions:

```javascript
{
    type: 'buttons',
    props: {
        label: 'Delete',
        variant: 'danger',
        onClick: () => console.log('Danger action')
    }
}
```

### 5. Success Variant

For positive actions:

```javascript
{
    type: 'buttons',
    props: {
        label: 'Save',
        variant: 'success',
        onClick: () => console.log('Success action')
    }
}
```

## Button Sizes

### Size Options

```javascript
// Small button
{
    type: 'buttons',
    props: {
        label: 'Small',
        size: 'small'
    }
}

// Medium button (default)
{
    type: 'buttons',
    props: {
        label: 'Medium',
        size: 'medium'
    }
}

// Large button
{
    type: 'buttons',
    props: {
        label: 'Large',
        size: 'large'
    }
}

// Extra large button
{
    type: 'buttons',
    props: {
        label: 'Extra Large',
        size: 'xlarge'
    }
}
```

## Icon Integration

### Icon Positioning

```javascript
// Icon on the left
{
    type: 'buttons',
    props: {
        label: 'Download',
        icon: 'download',
        iconPosition: 'left'
    }
}

// Icon on the right
{
    type: 'buttons',
    props: {
        label: 'Next',
        icon: 'arrow-right',
        iconPosition: 'right'
    }
}

// Icon only
{
    type: 'buttons',
    props: {
        icon: 'close',
        ariaLabel: 'Close'
    }
}

// Icon above text
{
    type: 'buttons',
    props: {
        label: 'Upload',
        icon: 'upload',
        iconPosition: 'top'
    }
}
```

## Interactive States

### Loading State

```javascript
{
    type: 'buttons',
    props: {
        label: 'Submit',
        loading: true,
        onClick: async () => {
            // Button will show loading state during async operation
            await submitForm();
        }
    }
}
```

### Disabled State

```javascript
{
    type: 'buttons',
    props: {
        label: 'Disabled Button',
        disabled: true,
        onClick: () => {
            // This won't be called when disabled
        }
    }
}
```

### Active State

```javascript
{
    type: 'buttons',
    props: {
        label: 'Active',
        active: true,
        onClick: () => console.log('Active button')
    }
}
```

## Button Groups

### Horizontal Button Group

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'small',
        children: [
            {
                type: 'buttons',
                props: {
                    label: 'Previous',
                    variant: 'ghost'
                }
            },
            {
                type: 'buttons',
                props: {
                    label: 'Next',
                    variant: 'primary'
                }
            }
        ]
    }
}
```

### Vertical Button Group

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'small',
        children: [
            {
                type: 'buttons',
                props: {
                    label: 'Option 1',
                    variant: 'ghost',
                    fullWidth: true
                }
            },
            {
                type: 'buttons',
                props: {
                    label: 'Option 2',
                    variant: 'ghost',
                    fullWidth: true
                }
            },
            {
                type: 'buttons',
                props: {
                    label: 'Option 3',
                    variant: 'ghost',
                    fullWidth: true
                }
            }
        ]
    }
}
```

## Usage Examples

### Form Actions

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'medium',
        justifyContent: 'flex-end',
        children: [
            {
                type: 'buttons',
                props: {
                    label: 'Cancel',
                    variant: 'ghost',
                    onClick: () => this.cancelForm()
                }
            },
            {
                type: 'buttons',
                props: {
                    label: 'Submit',
                    variant: 'primary',
                    onClick: () => this.submitForm()
                }
            }
        ]
    }
}
```

### Navigation Actions

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'small',
        children: [
            {
                type: 'buttons',
                props: {
                    icon: 'home',
                    variant: 'ghost',
                    ariaLabel: 'Home'
                }
            },
            {
                type: 'buttons',
                props: {
                    icon: 'settings',
                    variant: 'ghost',
                    ariaLabel: 'Settings'
                }
            },
            {
                type: 'buttons',
                props: {
                    icon: 'user',
                    variant: 'ghost',
                    ariaLabel: 'Profile'
                }
            }
        ]
    }
}
```

### Action Buttons with Icons

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'medium',
        children: [
            {
                type: 'buttons',
                props: {
                    label: 'Download Report',
                    icon: 'download',
                    iconPosition: 'left',
                    variant: 'primary',
                    fullWidth: true,
                    onClick: () => this.downloadReport()
                }
            },
            {
                type: 'buttons',
                props: {
                    label: 'Share',
                    icon: 'share',
                    iconPosition: 'left',
                    variant: 'secondary',
                    fullWidth: true,
                    onClick: () => this.shareContent()
                }
            },
            {
                type: 'buttons',
                props: {
                    label: 'Delete',
                    icon: 'trash',
                    iconPosition: 'left',
                    variant: 'danger',
                    fullWidth: true,
                    onClick: () => this.deleteItem()
                }
            }
        ]
    }
}
```

### Loading Actions

```javascript
{
    type: 'buttons',
    props: {
        label: 'Save Changes',
        variant: 'primary',
        loading: false,
        onClick: async () => {
            // Set loading state
            this.setState({ loading: true });
            
            try {
                await this.saveChanges();
                this.showSuccess('Changes saved successfully');
            } catch (error) {
                this.showError('Failed to save changes');
            } finally {
                // Clear loading state
                this.setState({ loading: false });
            }
        }
    }
}
```

## Advanced Features

### Custom Styling

```javascript
{
    type: 'buttons',
    props: {
        label: 'Custom Styled',
        variant: 'primary',
        style: {
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 24px',
            fontWeight: 'bold'
        },
        onClick: () => console.log('Custom styled button')
    }
}
```

### Toggle Button

```javascript
{
    type: 'buttons',
    props: {
        label: 'Toggle Me',
        variant: 'ghost',
        active: false,
        onClick: () => {
            this.setState(prev => ({ active: !prev.active }));
        }
    }
}
```

### Dropdown Button

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'none',
        children: [
            {
                type: 'buttons',
                props: {
                    label: 'Actions',
                    variant: 'primary',
                    borderRadius: '8px 0 0 8px'
                }
            },
            {
                type: 'buttons',
                props: {
                    icon: 'chevron-down',
                    variant: 'primary',
                    borderRadius: '0 8px 8px 0',
                    onClick: () => this.showDropdown()
                }
            }
        ]
    }
}
```

## State Management

### Button State

```javascript
class ButtonsWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.state = {
            loading: false,
            disabled: false,
            active: false,
            clicked: false
        };
    }
    
    setLoading(loading) {
        this.setState({ loading });
        this.updateButtonState();
    }
    
    setDisabled(disabled) {
        this.setState({ disabled });
        this.updateButtonState();
    }
    
    setActive(active) {
        this.setState({ active });
        this.updateButtonState();
    }
}
```

### Event Handling

```javascript
class ButtonsWidget {
    handleClick(event) {
        if (this.state.disabled || this.state.loading) {
            event.preventDefault();
            return;
        }
        
        // Add clicked animation
        this.setState({ clicked: true });
        setTimeout(() => {
            this.setState({ clicked: false });
        }, 150);
        
        // Emit click event
        this.emit('click', {
            button: this,
            event: event
        });
        
        // Call custom handler
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }
}
```

## Accessibility

### ARIA Attributes

```javascript
render() {
    this.element = this.createElement('button', 'button-widget');
    
    // Set ARIA attributes
    this.setAriaAttribute('label', this.props.ariaLabel || this.props.label);
    this.setAriaAttribute('pressed', this.state.active);
    this.setAriaAttribute('disabled', this.state.disabled);
    this.setAriaAttribute('busy', this.state.loading);
    
    // Set button type
    this.element.type = this.props.type || 'button';
    
    return this.element;
}
```

### Keyboard Navigation

```javascript
setupKeyboardNavigation() {
    this.element.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                this.handleClick(event);
                break;
            case 'Escape':
                if (this.props.onEscape) {
                    this.props.onEscape();
                }
                break;
        }
    });
}
```

### Screen Reader Support

```javascript
announceStateChange(oldState, newState) {
    if (oldState.loading !== newState.loading) {
        if (newState.loading) {
            this.announceToScreenReader('Loading, please wait');
        } else {
            this.announceToScreenReader('Loading complete');
        }
    }
    
    if (oldState.disabled !== newState.disabled) {
        if (newState.disabled) {
            this.announceToScreenReader('Button disabled');
        } else {
            this.announceToScreenReader('Button enabled');
        }
    }
}
```

## Performance Optimization

### Debounced Clicks

```javascript
class ButtonsWidget {
    constructor(config) {
        super(config);
        this.debouncedClick = this.debounce(this.handleClick, 100);
    }
    
    handleClick(event) {
        if (this.props.debounce) {
            this.debouncedClick(event);
        } else {
            this.handleClickDirect(event);
        }
    }
}
```

### Memoized Rendering

```javascript
class ButtonsWidget {
    shouldUpdate(newProps, newState) {
        return (
            newProps.label !== this.props.label ||
            newProps.variant !== this.props.variant ||
            newProps.size !== this.props.size ||
            newState.loading !== this.state.loading ||
            newState.disabled !== this.state.disabled
        );
    }
}
```

## Error Handling

### Invalid Configuration

```javascript
class ButtonsWidget {
    validateConfig(config) {
        const errors = [];
        
        if (!config.label && !config.icon) {
            errors.push('Button must have either label or icon');
        }
        
        if (config.variant && !this.isValidVariant(config.variant)) {
            errors.push(`Invalid variant: ${config.variant}`);
        }
        
        if (config.size && !this.isValidSize(config.size)) {
            errors.push(`Invalid size: ${config.size}`);
        }
        
        return errors;
    }
    
    isValidVariant(variant) {
        const validVariants = ['primary', 'secondary', 'ghost', 'danger', 'success'];
        return validVariants.includes(variant);
    }
}
```

## Best Practices

### 1. Use Clear Labels
```javascript
// ✅ Good - Clear, actionable labels
{
    type: 'buttons',
    props: {
        label: 'Download Report',
        variant: 'primary'
    }
}

// ❌ Avoid - Unclear labels
{
    type: 'buttons',
    props: {
        label: 'Click Here',
        variant: 'primary'
    }
}
```

### 2. Provide Loading Feedback
```javascript
// ✅ Good - Show loading state for async actions
{
    type: 'buttons',
    props: {
        label: 'Submit',
        loading: this.state.submitting,
        onClick: async () => {
            this.setState({ submitting: true });
            await this.submit();
            this.setState({ submitting: false });
        }
    }
}
```

### 3. Use Appropriate Variants
```javascript
// ✅ Good - Use semantic variants
{
    type: 'buttons',
    props: {
        label: 'Delete',
        variant: 'danger'  // Destructive action
    }
}

{
    type: 'buttons',
    props: {
        label: 'Save',
        variant: 'primary'  // Primary action
    }
}
```

### 4. Include Accessibility Labels
```javascript
// ✅ Good - Include aria labels for icon-only buttons
{
    type: 'buttons',
    props: {
        icon: 'close',
        ariaLabel: 'Close dialog'
    }
}
```

## Integration Examples

### Modal Actions

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'medium',
        justifyContent: 'flex-end',
        children: [
            {
                type: 'buttons',
                props: {
                    label: 'Cancel',
                    variant: 'ghost',
                    onClick: () => this.closeModal()
                }
            },
            {
                type: 'buttons',
                props: {
                    label: 'Confirm',
                    variant: 'primary',
                    onClick: () => this.confirmAction()
                }
            }
        ]
    }
}
```

### Toolbar Actions

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'small',
        background: '#f8f9fa',
        padding: 'medium',
        borderRadius: '8px',
        children: [
            {
                type: 'buttons',
                props: {
                    icon: 'bold',
                    variant: 'ghost',
                    ariaLabel: 'Bold text',
                    active: this.state.bold
                }
            },
            {
                type: 'buttons',
                props: {
                    icon: 'italic',
                    variant: 'ghost',
                    ariaLabel: 'Italic text',
                    active: this.state.italic
                }
            },
            {
                type: 'buttons',
                props: {
                    icon: 'link',
                    variant: 'ghost',
                    ariaLabel: 'Insert link'
                }
            }
        ]
    }
}
```

## See Also

- [Base Widget](base-widget.md) - Base widget class and patterns
- [Container Widget](container-widget.md) - For grouping buttons
- [Input Widget](input-widget.md) - For form inputs
- [Widget Factory](widget-factory.md) - Widget creation and management
- [Composition Recipes](../composition-recipes.md) - Advanced composition patterns
