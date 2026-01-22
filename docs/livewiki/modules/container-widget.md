---
path: modules/container-widget.md
page-type: module
summary: Container widget for grouping and organizing other widgets with flexible layouts and styling.
tags: [module, widget, container, layout, grouping, organization]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Container Widget

The Container Widget provides a flexible layout system for grouping and organizing other widgets. It supports various layout patterns, spacing controls, and styling options to create well-structured user interfaces.

## Overview

The Container Widget is the fundamental building block for creating complex layouts in ChatUI. It acts as a parent container that can hold multiple child widgets, arranging them according to specified layout rules and applying consistent styling and spacing.

## Key Features

- **Multiple Layouts**: Vertical, horizontal, and grid layout options
- **Flexible Spacing**: Configurable gaps and padding between items
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Nested Support**: Containers can contain other containers
- **Styling Options**: Background, borders, and visual styling
- **Accessibility**: Proper ARIA roles and keyboard navigation

## Configuration Options

### Basic Configuration

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',              // Layout: 'vertical', 'horizontal', 'grid'
        gap: 'medium',                   // Spacing between children
        padding: 'medium',               // Internal padding
        alignItems: 'stretch',           // Alignment of children
        justifyContent: 'flex-start',     // Justification of children
        children: [...],                 // Array of child widgets
        className: 'custom-container',   // Additional CSS classes
        style: {},                       // Inline styles
        responsive: {},                  // Responsive breakpoints
        scrollable: false,               // Enable scrolling
        maxWidth: 'none',                // Maximum width
        minWidth: 'auto',                // Minimum width
        height: 'auto',                  // Container height
        background: 'transparent',       // Background color/style
        border: 'none',                  // Border styling
        borderRadius: '0'                // Border radius
    }
}
```

## Layout Options

### 1. Vertical Layout

Default layout for stacking widgets vertically:

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'medium',                   // 'none', 'small', 'medium', 'large', 'xlarge'
        alignItems: 'stretch',           // 'flex-start', 'center', 'flex-end', 'stretch'
        children: [
            {
                type: 'text',
                props: {
                    content: 'Header Text',
                    format: 'plain'
                }
            },
            {
                type: 'input',
                props: {
                    placeholder: 'Enter value'
                }
            },
            {
                type: 'button',
                props: {
                    label: 'Submit',
                    variant: 'primary'
                }
            }
        ]
    }
}
```

### 2. Horizontal Layout

For arranging widgets side by side:

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'small',
        alignItems: 'center',           // Vertical alignment
        justifyContent: 'space-between', // Horizontal justification
        wrap: false,                     // Wrap to next line
        children: [
            {
                type: 'text',
                props: {
                    content: 'Label:',
                    format: 'plain'
                }
            },
            {
                type: 'input',
                props: {
                    placeholder: 'Value'
                }
            },
            {
                type: 'button',
                props: {
                    label: 'Go',
                    variant: 'secondary'
                }
            }
        ]
    }
}
```

### 3. Grid Layout

For complex grid arrangements:

```javascript
{
    type: 'container',
    props: {
        layout: 'grid',
        columns: 3,                      // Number of columns
        rows: 'auto',                    // Number of rows (auto or number)
        gap: 'medium',                   // Grid gap
        gridTemplate: 'auto',            // Custom grid template
        responsive: {                     // Responsive breakpoints
            mobile: { columns: 1, gap: 'small' },
            tablet: { columns: 2, gap: 'medium' },
            desktop: { columns: 3, gap: 'medium' }
        },
        children: [
            { type: 'card', props: { title: 'Card 1' } },
            { type: 'card', props: { title: 'Card 2' } },
            { type: 'card', props: { title: 'Card 3' } },
            { type: 'card', props: { title: 'Card 4' } },
            { type: 'card', props: { title: 'Card 5' } },
            { type: 'card', props: { title: 'Card 6' } }
        ]
    }
}
```

## Spacing and Sizing

### Gap Options

Control spacing between child widgets:

```javascript
{
    type: 'container',
    props: {
        gap: 'none',                     // No spacing
        // gap: 'small',                  // 8px spacing
        // gap: 'medium',                 // 16px spacing (default)
        // gap: 'large',                  // 24px spacing
        // gap: 'xlarge',                 // 32px spacing
        // gap: 12,                       // Custom pixel value
        children: [...]
    }
}
```

### Padding Options

Control internal padding of the container:

```javascript
{
    type: 'container',
    props: {
        padding: 'none',                 // No padding
        // padding: 'small',              // 8px padding
        // padding: 'medium',             // 16px padding (default)
        // padding: 'large',              // 24px padding
        // padding: 'xlarge',             // 32px padding
        // padding: {                     // Different padding per side
        //     top: 'medium',
        //     right: 'large',
        //     bottom: 'medium',
        //     left: 'large'
        // },
        children: [...]
    }
}
```

### Sizing Options

Control container dimensions:

```javascript
{
    type: 'container',
    props: {
        width: '100%',                   // Width: 'auto', '100%', '50%', '300px', etc.
        height: 'auto',                  // Height: 'auto', '100%', '200px', etc.
        maxWidth: '1200px',              // Maximum width
        minWidth: '300px',                // Minimum width
        maxHeight: '800px',              // Maximum height
        minHeight: '200px',              // Minimum height
        aspectRatio: '16/9',             // Aspect ratio
        grow: 1,                         // Flex grow factor
        shrink: 1,                       // Flex shrink factor
        basis: 'auto',                   // Flex basis
        children: [...]
    }
}
```

## Alignment and Justification

### Vertical Alignment (for horizontal layout)

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        alignItems: 'center',            // 'flex-start', 'center', 'flex-end', 'stretch', 'baseline'
        children: [
            { type: 'text', props: { content: 'Short' } },
            { type: 'text', props: { content: 'Taller content' } },
            { type: 'button', props: { label: 'Button' } }
        ]
    }
}
```

### Horizontal Justification (for horizontal layout)

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        justifyContent: 'space-between', // 'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'
        children: [
            { type: 'text', props: { content: 'Left' } },
            { type: 'text', props: { content: 'Center' } },
            { type: 'text', props: { content: 'Right' } }
        ]
    }
}
```

### Grid Alignment

```javascript
{
    type: 'container',
    props: {
        layout: 'grid',
        alignItems: 'stretch',          // Grid item alignment
        justifyContent: 'center',        // Grid justification
        gridAutoFlow: 'row',             // 'row', 'column', 'row dense', 'column dense'
        children: [...]
    }
}
```

## Styling Options

### Background and Borders

```javascript
{
    type: 'container',
    props: {
        background: '#f8f9fa',          // Background color
        backgroundColor: '#f8f9fa',      // Alternative syntax
        backgroundImage: 'url(image.jpg)', // Background image
        backgroundSize: 'cover',         // 'cover', 'contain', 'auto'
        backgroundPosition: 'center',     // Background position
        border: '1px solid #dee2e6',     // Border shorthand
        borderTop: '2px solid #007bff',   // Individual borders
        borderRight: '1px solid #dee2e6',
        borderBottom: '1px solid #dee2e6',
        borderLeft: '1px solid #dee2e6',
        borderRadius: '8px',              // Border radius
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Box shadow
        children: [...]
    }
}
```

### Visual Effects

```javascript
{
    type: 'container',
    props: {
        opacity: 0.8,                    // Opacity (0-1)
        visibility: 'visible',            // 'visible', 'hidden'
        transform: 'translateY(10px)',   // CSS transform
        transition: 'all 0.3s ease',     // CSS transition
        animation: 'fadeIn 0.5s ease-in', // CSS animation
        backdropFilter: 'blur(5px)',      // Backdrop filter
        mixBlendMode: 'normal',           // Blend mode
        zIndex: 1,                        // Stack order
        children: [...]
    }
}
```

## Responsive Design

### Breakpoint Configuration

```javascript
{
    type: 'container',
    props: {
        layout: 'grid',
        columns: 3,
        gap: 'medium',
        responsive: {
            // Mobile breakpoint (0-768px)
            mobile: {
                layout: 'vertical',
                gap: 'small',
                padding: 'small'
            },
            // Tablet breakpoint (768-1024px)
            tablet: {
                layout: 'grid',
                columns: 2,
                gap: 'medium'
            },
            // Desktop breakpoint (1024px+)
            desktop: {
                layout: 'grid',
                columns: 3,
                gap: 'large'
            }
        },
        children: [...]
    }
}
```

### Conditional Responsive Properties

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'medium',
        responsive: {
            mobile: {
                layout: 'vertical',
                gap: 'small'
            }
        },
        children: [...]
    }
}
```

## Usage Examples

### Basic Form Container

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'medium',
        padding: 'large',
        maxWidth: '400px',
        children: [
            {
                type: 'text',
                props: {
                    content: '## User Registration',
                    format: 'markdown'
                }
            },
            {
                type: 'input',
                props: {
                    type: 'text',
                    placeholder: 'First Name',
                    required: true
                }
            },
            {
                type: 'input',
                props: {
                    type: 'email',
                    placeholder: 'Email Address',
                    required: true
                }
            },
            {
                type: 'password',
                props: {
                    placeholder: 'Password',
                    required: true
                }
            },
            {
                type: 'button',
                props: {
                    label: 'Register',
                    variant: 'primary',
                    size: 'large'
                }
            }
        ]
    }
}
```

### Card Layout Container

```javascript
{
    type: 'container',
    props: {
        layout: 'grid',
        columns: 3,
        gap: 'large',
        padding: 'medium',
        responsive: {
            mobile: { columns: 1 },
            tablet: { columns: 2 }
        },
        children: [
            {
                type: 'card',
                props: {
                    title: 'Feature 1',
                    description: 'Description of feature 1',
                    variant: 'default'
                }
            },
            {
                type: 'card',
                props: {
                    title: 'Feature 2',
                    description: 'Description of feature 2',
                    variant: 'default'
                }
            },
            {
                type: 'card',
                props: {
                    title: 'Feature 3',
                    description: 'Description of feature 3',
                    variant: 'default'
                }
            }
        ]
    }
}
```

### Navigation Bar Container

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'small',
        padding: 'medium',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        children: [
            {
                type: 'container',
                props: {
                    layout: 'horizontal',
                    gap: 'small',
                    alignItems: 'center',
                    children: [
                        {
                            type: 'text',
                            props: {
                                content: '**Logo**',
                                format: 'markdown'
                            }
                        }
                    ]
                }
            },
            {
                type: 'container',
                props: {
                    layout: 'horizontal',
                    gap: 'small',
                    children: [
                        {
                            type: 'button',
                            props: {
                                label: 'Home',
                                variant: 'ghost'
                            }
                        },
                        {
                            type: 'button',
                            props: {
                                label: 'About',
                                variant: 'ghost'
                            }
                        },
                        {
                            type: 'button',
                            props: {
                                label: 'Contact',
                                variant: 'primary'
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

### Sidebar Layout

```javascript
{
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'large',
        height: '100%',
        children: [
            {
                type: 'container',
                props: {
                    layout: 'vertical',
                    gap: 'medium',
                    width: '250px',
                    background: '#f8f9fa',
                    padding: 'medium',
                    borderRadius: '8px',
                    children: [
                        {
                            type: 'text',
                            props: {
                                content: '## Menu',
                                format: 'markdown'
                            }
                        },
                        {
                            type: 'container',
                            props: {
                                layout: 'vertical',
                                gap: 'small',
                                children: [
                                    {
                                        type: 'button',
                                        props: {
                                            label: 'Dashboard',
                                            variant: 'ghost',
                                            align: 'left'
                                        }
                                    },
                                    {
                                        type: 'button',
                                        props: {
                                            label: 'Settings',
                                            variant: 'ghost',
                                            align: 'left'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                type: 'container',
                props: {
                    layout: 'vertical',
                    gap: 'medium',
                    grow: 1,
                    children: [
                        {
                            type: 'text',
                            props: {
                                content: '## Main Content',
                                format: 'markdown'
                            }
                        },
                        {
                            type: 'text',
                            props: {
                                content: 'This is the main content area.',
                                format: 'plain'
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

## Advanced Features

### Scrollable Container

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        height: '300px',
        scrollable: true,
        overflow: 'auto',                  // 'auto', 'scroll', 'hidden'
        children: [
            // Many child widgets that might overflow
            ...largeItemList
        ]
    }
}
```

### Animated Container

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'medium',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)',
        opacity: 1,
        children: [...],
        onHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
    }
}
```

### Conditional Container

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'medium',
        visible: true,                    // Control visibility
        display: 'flex',                   // Control display property
        children: [
            {
                type: 'conditional',
                props: {
                    condition: 'showIf:userLoggedIn',
                    children: [
                        { type: 'user-profile', props: {} }
                    ],
                    fallback: [
                        { type: 'login-form', props: {} }
                    ]
                }
            }
        ]
    }
}
```

## State Management

### Dynamic Children

```javascript
class ContainerWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.children = config.children || [];
        this.childInstances = new Map();
    }
    
    addChild(childConfig, index = this.children.length) {
        this.children.splice(index, 0, childConfig);
        this.renderChild(childConfig, index);
    }
    
    removeChild(index) {
        const child = this.children[index];
        if (child) {
            this.children.splice(index, 1);
            this.removeChildInstance(child.id);
        }
    }
    
    updateChild(index, newConfig) {
        this.children[index] = newConfig;
        this.renderChild(newConfig, index);
    }
}
```

### Layout State

```javascript
class ContainerWidget {
    updateLayout(newLayout) {
        this.props.layout = newLayout;
        this.applyLayoutClasses();
        this.emit('layout:changed', { layout: newLayout });
    }
    
    applyLayoutClasses() {
        const element = this.element;
        
        // Remove existing layout classes
        element.classList.remove('layout-vertical', 'layout-horizontal', 'layout-grid');
        
        // Add new layout class
        element.classList.add(`layout-${this.props.layout}`);
    }
}
```

## Performance Optimization

### Lazy Loading Children

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'medium',
        lazy: true,                      // Enable lazy loading
        lazyThreshold: 200,              // Pixels from viewport to load
        children: [
            // Children will be rendered when near viewport
            ...manyChildren
        ]
    }
}
```

### Virtual Container

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        height: '400px',
        virtual: true,                   // Enable virtual rendering
        itemHeight: 60,                  // Fixed child height
        bufferSize: 5,                   // Extra items to render
        children: [...manyChildren]
    }
}
```

## Accessibility

### ARIA Roles

```javascript
render() {
    this.element = this.createElement('div', 'container-widget');
    
    // Set appropriate ARIA role based on layout
    const role = this.getAriaRole();
    this.setAriaAttribute('role', role);
    
    // Set label if provided
    if (this.props.ariaLabel) {
        this.setAriaAttribute('label', this.props.ariaLabel);
    }
    
    return this.element;
}

getAriaRole() {
    switch (this.props.layout) {
        case 'horizontal':
            return 'toolbar';
        case 'grid':
            return 'grid';
        case 'vertical':
        default:
            return 'group';
    }
}
```

### Keyboard Navigation

```javascript
setupKeyboardNavigation() {
    this.element.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowRight':
                if (this.props.layout === 'horizontal') {
                    this.navigateChildren(1);
                    event.preventDefault();
                }
                break;
            case 'ArrowLeft':
                if (this.props.layout === 'horizontal') {
                    this.navigateChildren(-1);
                    event.preventDefault();
                }
                break;
            case 'ArrowDown':
                if (this.props.layout === 'vertical' || this.props.layout === 'grid') {
                    this.navigateChildren(1);
                    event.preventDefault();
                }
                break;
            case 'ArrowUp':
                if (this.props.layout === 'vertical' || this.props.layout === 'grid') {
                    this.navigateChildren(-1);
                    event.preventDefault();
                }
                break;
        }
    });
}
```

## Error Handling

### Invalid Layout

```javascript
class ContainerWidget {
    validateLayout(layout) {
        const validLayouts = ['vertical', 'horizontal', 'grid'];
        if (!validLayouts.includes(layout)) {
            console.warn(`Invalid layout: ${layout}. Using 'vertical' instead.`);
            return 'vertical';
        }
        return layout;
    }
}
```

### Invalid Children

```javascript
class ContainerWidget {
    validateChildren(children) {
        if (!Array.isArray(children)) {
            console.warn('Children must be an array');
            return [];
        }
        
        return children.filter(child => {
            if (!child || !child.type) {
                console.warn('Invalid child widget:', child);
                return false;
            }
            return true;
        });
    }
}
```

## Best Practices

### 1. Use Semantic Layouts
```javascript
// ✅ Good - Semantic structure
{
    type: 'container',
    props: {
        layout: 'vertical',
        role: 'form',                    // Semantic role
        children: [...formFields]
    }
}

// ❌ Avoid - Non-semantic nesting
{
    type: 'container',
    props: {
        layout: 'vertical',
        children: [
            { type: 'container', props: { children: [...] } },  // Unnecessary nesting
            { type: 'container', props: { children: [...] } }
        ]
    }
}
```

### 2. Responsive Design
```javascript
// ✅ Good - Always consider mobile
{
    type: 'container',
    props: {
        layout: 'grid',
        columns: 3,
        responsive: {
            mobile: { columns: 1 },
            tablet: { columns: 2 }
        }
    }
}
```

### 3. Proper Spacing
```javascript
// ✅ Good - Consistent spacing
{
    type: 'container',
    props: {
        gap: 'medium',
        padding: 'medium'
    }
}

// ❌ Avoid - No spacing
{
    type: 'container',
    props: {
        gap: 'none',
        padding: 'none'
    }
}
```

### 4. Accessibility First
```javascript
// ✅ Good - Include accessibility
{
    type: 'container',
    props: {
        layout: 'horizontal',
        ariaLabel: 'Navigation menu',
        role: 'toolbar'
    }
}
```

## Integration Examples

### Form Layout

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'large',
        padding: 'large',
        maxWidth: '500px',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        children: [
            {
                type: 'container',
                props: {
                    layout: 'vertical',
                    gap: 'medium',
                    children: [
                        { type: 'text', props: { content: '## Contact Form', format: 'markdown' } },
                        { type: 'input', props: { placeholder: 'Name', required: true } },
                        { type: 'input', props: { type: 'email', placeholder: 'Email', required: true } },
                        { type: 'textarea', props: { placeholder: 'Message', required: true } }
                    ]
                }
            },
            {
                type: 'container',
                props: {
                    layout: 'horizontal',
                    gap: 'medium',
                    justifyContent: 'flex-end',
                    children: [
                        { type: 'button', props: { label: 'Cancel', variant: 'ghost' } },
                        { type: 'button', props: { label: 'Send', variant: 'primary' } }
                    ]
                }
            }
        ]
    }
}
```

### Dashboard Layout

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'large',
        height: '100%',
        children: [
            {
                type: 'container',
                props: {
                    layout: 'horizontal',
                    gap: 'medium',
                    justifyContent: 'space-between',
                    children: [
                        { type: 'text', props: { content: '## Dashboard', format: 'markdown' } },
                        { type: 'button', props: { label: 'Refresh', variant: 'secondary' } }
                    ]
                }
            },
            {
                type: 'container',
                props: {
                    layout: 'grid',
                    columns: 2,
                    gap: 'large',
                    responsive: { mobile: { columns: 1 } },
                    children: [
                        { type: 'stats-card', props: { title: 'Revenue', value: '$12,345' } },
                        { type: 'stats-card', props: { title: 'Users', value: '1,234' } },
                        { type: 'chart-card', props: { title: 'Growth' } },
                        { type: 'activity-card', props: { title: 'Recent Activity' } }
                    ]
                }
            }
        ]
    }
}
```

## See Also

- [Base Widget](base-widget.md) - Base widget class and patterns
- [Card Widget](card-widget.md) - For card-based content
- [Conditional Widget](conditional-widget.md) - For conditional rendering
- [List Widget](list-widget.md) - For list-based layouts
- [Widget Factory](widget-factory.md) - Widget creation and management
- [Composition Recipes](../composition-recipes.md) - Advanced composition patterns
