---
path: modules/card-widget.md
page-type: module
summary: Card widget for displaying content in structured, visually appealing containers.
tags: [module, widget, card, content, display, layout]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Card Widget

The Card Widget provides a flexible container for displaying content in a structured, visually appealing format. It's ideal for presenting information, media, and interactive elements in a consistent and organized manner.

## Overview

The Card Widget creates a contained area with optional header, content, footer, and action sections. It supports various visual styles, layouts, and interactive behaviors, making it perfect for displaying product information, user profiles, article previews, and more.

## Key Features

- **Flexible Structure**: Header, content, footer, and action sections
- **Multiple Variants**: Default, elevated, outlined, and filled styles
- **Media Support**: Images, avatars, and custom content
- **Interactive Elements**: Built-in action buttons and links
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA roles and keyboard navigation

## Configuration Options

### Basic Configuration

```javascript
{
    type: 'card',
    props: {
        variant: 'default',               // Visual variant
        padding: 'medium',                // Internal padding
        elevation: 'medium',               // Shadow elevation
        borderRadius: 'medium',           // Border radius
        header: null,                      // Header content
        title: null,                       // Card title
        subtitle: null,                   // Card subtitle
        description: null,                // Card description
        image: null,                       // Card image
        avatar: null,                      // Avatar image
        actions: [],                      // Action buttons
        footer: null,                      // Footer content
        clickable: false,                  // Make entire card clickable
        href: null,                        // Link URL
        target: '_self',                   // Link target
        className: 'custom-card',         // Additional CSS classes
        style: {},                         // Inline styles
        children: []                       // Child widgets
    }
}
```

## Card Variants

### 1. Default Variant

Standard card with subtle styling:

```javascript
{
    type: 'card',
    props: {
        variant: 'default',
        title: 'Card Title',
        description: 'This is a default card with standard styling.',
        actions: [
            {
                text: 'Learn More',
                variant: 'primary'
            }
        ]
    }
}
```

### 2. Elevated Variant

Card with prominent shadow:

```javascript
{
    type: 'card',
    props: {
        variant: 'elevated',
        elevation: 'high',
        title: 'Elevated Card',
        description: 'This card has a prominent shadow for emphasis.',
        image: '/images/elevated-card.jpg'
    }
}
```

### 3. Outlined Variant

Card with border instead of shadow:

```javascript
{
    type: 'card',
    props: {
        variant: 'outlined',
        title: 'Outlined Card',
        description: 'This card uses a border for visual separation.',
        borderColor: '#dee2e6'
    }
}
```

### 4. Filled Variant

Card with background color:

```javascript
{
    type: 'card',
    props: {
        variant: 'filled',
        backgroundColor: '#f8f9fa',
        title: 'Filled Card',
        description: 'This card has a filled background.'
    }
}
```

## Card Structure

### Basic Card Structure

```javascript
{
    type: 'card',
    props: {
        title: 'Product Name',
        subtitle: '$29.99',
        description: 'This is a great product with amazing features.',
        image: '/images/product.jpg',
        actions: [
            {
                text: 'Add to Cart',
                variant: 'primary'
            },
            {
                text: 'View Details',
                variant: 'ghost'
            }
        ]
    }
}
```

### Card with Header

```javascript
{
    type: 'card',
    props: {
        header: {
            title: 'User Profile',
            avatar: '/images/avatar.jpg',
            subtitle: 'John Doe'
        },
        content: {
            description: 'Software developer with 5 years of experience in web development.'
        },
        actions: [
            {
                text: 'Follow',
                variant: 'primary'
            }
        ]
    }
}
```

### Card with Footer

```javascript
{
    type: 'card',
    props: {
        title: 'Article Title',
        description: 'This is an interesting article about technology and innovation.',
        footer: {
            left: 'Published 2 days ago',
            right: '5 min read'
        },
        actions: [
            {
                text: 'Read More',
                variant: 'primary'
            }
        ]
    }
}
```

## Media Integration

### Image Cards

```javascript
{
    type: 'card',
    props: {
        title: 'Beautiful Landscape',
        subtitle: 'Nature Photography',
        image: {
            src: '/images/landscape.jpg',
            alt: 'Mountain landscape',
            height: '200px',
            objectFit: 'cover'
        },
        description: 'A stunning view of mountains during sunset.',
        actions: [
            {
                text: 'View Full Size',
                variant: 'secondary'
            }
        ]
    }
}
```

### Avatar Cards

```javascript
{
    type: 'card',
    props: {
        avatar: {
            src: '/images/avatar.jpg',
            alt: 'User avatar',
            size: 'large'
        },
        title: 'Jane Smith',
        subtitle: 'Product Designer',
        description: 'Creating beautiful and functional user interfaces.',
        actions: [
            {
                text: 'View Profile',
                variant: 'ghost'
            },
            {
                text: 'Message',
                variant: 'primary'
            }
        ]
    }
}
```

## Interactive Cards

### Clickable Cards

```javascript
{
    type: 'card',
    props: {
        clickable: true,
        href: '/product/123',
        target: '_blank',
        title: 'Product Link',
        description: 'Click this card to view product details.',
        image: '/images/product.jpg'
    }
}
```

### Hover Effects

```javascript
{
    type: 'card',
    props: {
        title: 'Interactive Card',
        description: 'This card has hover effects.',
        variant: 'elevated',
        hover: {
            elevation: 'high',
            transform: 'translateY(-4px)'
        },
        onClick: () => console.log('Card clicked')
    }
}
```

## Usage Examples

### Product Card

```javascript
{
    type: 'card',
    props: {
        variant: 'elevated',
        title: 'Premium Widget',
        subtitle: '$99.99',
        image: {
            src: '/images/widget-premium.jpg',
            alt: 'Premium Widget',
            height: '180px'
        },
        description: 'Advanced widget with premium features and priority support.',
        badge: {
            text: 'Best Seller',
            variant: 'success'
        },
        actions: [
            {
                text: 'Add to Cart',
                variant: 'primary',
                icon: 'cart'
            },
            {
                text: 'Compare',
                variant: 'ghost'
            }
        ],
        footer: {
            left: '⭐ 4.8 (234 reviews)',
            right: 'Free Shipping'
        }
    }
}
```

### User Profile Card

```javascript
{
    type: 'card',
    props: {
        variant: 'default',
        avatar: {
            src: '/images/user-avatar.jpg',
            alt: 'User Avatar',
            size: 'xlarge'
        },
        title: 'Michael Johnson',
        subtitle: 'Senior Developer',
        description: 'Full-stack developer specializing in React and Node.js. Passionate about creating scalable web applications.',
        stats: [
            { label: 'Projects', value: '47' },
            { label: 'Experience', value: '8 years' },
            { label: 'Technologies', value: '15+' }
        ],
        actions: [
            {
                text: 'View Portfolio',
                variant: 'primary'
            },
            {
                text: 'Connect',
                variant: 'secondary'
            }
        ]
    }
}
```

### Article Preview Card

```javascript
{
    type: 'card',
    props: {
        variant: 'outlined',
        title: 'The Future of Web Development',
        subtitle: 'Technology Trends',
        description: 'Exploring the latest trends and technologies shaping the future of web development, including AI integration, WebAssembly, and more.',
        image: {
            src: '/images/article-preview.jpg',
            alt: 'Article preview',
            height: '160px'
        },
        metadata: {
            author: 'Sarah Chen',
            date: 'March 15, 2024',
            readTime: '8 min read'
        },
        actions: [
            {
                text: 'Read Article',
                variant: 'primary'
            },
            {
                text: 'Save',
                variant: 'ghost'
            }
        ],
        footer: {
            left: '234 views',
            right: '42 comments'
        }
    }
}
```

### Feature Card

```javascript
{
    type: 'card',
    props: {
        variant: 'filled',
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        icon: {
            name: 'rocket',
            size: 'large',
            color: '#2196f3'
        },
        title: 'Fast Performance',
        description: 'Optimized for speed with lazy loading, caching, and efficient rendering to ensure the best user experience.',
        features: [
            'Lightning-fast loading',
            'Optimized images',
            'Efficient code splitting'
        ],
        actions: [
            {
                text: 'Learn More',
                variant: 'primary'
            }
        ]
    }
}
```

## Advanced Features

### Stats Card

```javascript
{
    type: 'card',
    props: {
        variant: 'elevated',
        title: 'Monthly Revenue',
        subtitle: 'March 2024',
        stats: [
            {
                label: 'Revenue',
                value: '$45,678',
                change: '+12.5%',
                trend: 'up'
            },
            {
                label: 'Orders',
                value: '1,234',
                change: '+8.3%',
                trend: 'up'
            }
        ],
        chart: {
            type: 'line',
            data: [/* chart data */],
            height: '100px'
        },
        actions: [
            {
                text: 'View Report',
                variant: 'secondary'
            }
        ]
    }
}
```

### Testimonial Card

```javascript
{
    type: 'card',
    props: {
        variant: 'default',
        quote: 'This product completely transformed how we work. The intuitive interface and powerful features made our team more productive than ever.',
        author: {
            name: 'Emily Rodriguez',
            title: 'CEO at TechCorp',
            avatar: '/images/emily-avatar.jpg'
        },
        rating: 5,
        company: 'TechCorp',
        actions: [
            {
                text: 'Read Full Story',
                variant: 'ghost'
            }
        ]
    }
}
```

### Pricing Card

```javascript
{
    type: 'card',
    props: {
        variant: 'elevated',
        featured: true,
        title: 'Pro Plan',
        subtitle: '$29/month',
        description: 'Perfect for growing teams with advanced features and priority support.',
        features: [
            'Unlimited projects',
            'Advanced analytics',
            'Priority support',
            'Custom integrations',
            'Team collaboration'
        ],
        badge: {
            text: 'Most Popular',
            variant: 'primary'
        },
        actions: [
            {
                text: 'Start Free Trial',
                variant: 'primary',
                size: 'large'
            }
        ],
        footer: 'No credit card required'
    }
}
```

## State Management

### Card State

```javascript
class CardWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.state = {
            hovered: false,
            clicked: false,
            loading: false,
            expanded: false
        };
    }
    
    setHovered(hovered) {
        this.setState({ hovered });
        this.updateCardStyle();
    }
    
    setClicked(clicked) {
        this.setState({ clicked });
        setTimeout(() => {
            this.setState({ clicked: false });
        }, 200);
    }
    
    toggleExpanded() {
        this.setState(prev => ({ expanded: !prev.expanded }));
    }
}
```

### Dynamic Content

```javascript
class CardWidget {
    updateContent(newContent) {
        this.props = { ...this.props, ...newContent };
        this.render();
        this.emit('content:updated', { content: newContent });
    }
    
    addAction(action) {
        this.props.actions = [...(this.props.actions || []), action];
        this.renderActions();
    }
    
    removeAction(index) {
        this.props.actions = this.props.actions.filter((_, i) => i !== index);
        this.renderActions();
    }
}
```

## Performance Optimization

### Lazy Loading

```javascript
{
    type: 'card',
    props: {
        title: 'Lazy Loaded Card',
        lazy: true,
        threshold: 200,                  // Load when 200px from viewport
        image: {
            src: '/images/lazy-image.jpg',
            loading: 'lazy'
        },
        description: 'This card content will be loaded when needed.'
    }
}
```

### Memoized Rendering

```javascript
class CardWidget {
    shouldUpdate(newProps, newState) {
        return (
            newProps.title !== this.props.title ||
            newProps.description !== this.props.description ||
            newState.hovered !== this.state.hovered ||
            newState.expanded !== this.state.expanded
        );
    }
}
```

## Accessibility

### ARIA Roles

```javascript
render() {
    this.element = this.createElement('article', 'card-widget');
    
    // Set appropriate ARIA role
    this.setAriaAttribute('role', 'article');
    
    if (this.props.clickable) {
        this.setAriaAttribute('role', 'button');
        this.setAriaAttribute('tabindex', '0');
    }
    
    return this.element;
}
```

### Keyboard Navigation

```javascript
setupKeyboardNavigation() {
    if (this.props.clickable) {
        this.element.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.handleClick(event);
                    break;
            }
        });
    }
}
```

## Error Handling

### Missing Content

```javascript
{
    type: 'card',
    props: {
        title: 'Card with Missing Content',
        description: null,                // Missing description
        image: null,                      // Missing image
        fallback: {
            type: 'container',
            props: {
                layout: 'vertical',
                gap: 'medium',
                children: [
                    {
                        type: 'text',
                        props: {
                            content: 'Content not available',
                            format: 'plain'
                        }
                    }
                ]
            }
        }
    }
}
```

### Image Loading Error

```javascript
class CardWidget {
    handleImageError() {
        this.setState({ imageError: true });
        this.showFallbackImage();
    }
    
    showFallbackImage() {
        const fallbackImage = this.createElement('div', 'image-fallback');
        fallbackImage.textContent = 'Image not available';
        this.imageContainer.appendChild(fallbackImage);
    }
}
```

## Best Practices

### 1. Use Clear Hierarchy
```javascript
// ✅ Good - Clear visual hierarchy
{
    type: 'card',
    props: {
        title: 'Clear, Descriptive Title',
        subtitle: 'Supporting information',
        description: 'Detailed description that provides context.'
    }
}

// ❌ Avoid - Poor hierarchy
{
    type: 'card',
    props: {
        title: 'Title',
        description: 'All information mixed together without clear structure.'
    }
}
```

### 2. Provide Meaningful Actions
```javascript
// ✅ Good - Clear, actionable buttons
{
    type: 'card',
    props: {
        actions: [
            {
                text: 'View Details',
                variant: 'primary'
            },
            {
                text: 'Save for Later',
                variant: 'ghost'
            }
        ]
    }
}
```

### 3. Use Appropriate Media
```javascript
// ✅ Good - Optimized images
{
    type: 'card',
    props: {
        image: {
            src: '/images/optimized-image.webp',
            alt: 'Descriptive alt text',
            loading: 'lazy',
            sizes: '(max-width: 768px) 100vw, 50vw'
        }
    }
}
```

### 4. Consider Accessibility
```javascript
// ✅ Good - Accessible card
{
    type: 'card',
    props: {
        title: 'Accessible Card',
        ariaLabel: 'Product: Premium Widget, Price: $99.99',
        clickable: true,
        actions: [
            {
                text: 'View Details',
                ariaLabel: 'View product details for Premium Widget'
            }
        ]
    }
}
```

## Integration Examples

### Product Grid

```javascript
{
    type: 'container',
    props: {
        layout: 'grid',
        columns: 3,
        gap: 'large',
        children: products.map(product => ({
            type: 'card',
            props: {
                title: product.name,
                subtitle: product.price,
                image: product.image,
                description: product.description,
                actions: [
                    {
                        text: 'Add to Cart',
                        variant: 'primary'
                    }
                ]
            }
        }))
    }
}
```

### Dashboard Cards

```javascript
{
    type: 'container',
    props: {
        layout: 'grid',
        columns: 2,
        gap: 'medium',
        children: [
            {
                type: 'card',
                props: {
                    title: 'Total Revenue',
                    subtitle: '$123,456',
                    description: 'Revenue increased by 15% this month',
                    variant: 'filled',
                    backgroundColor: '#e8f5e8'
                }
            },
            {
                type: 'card',
                props: {
                    title: 'Active Users',
                    subtitle: '1,234',
                    description: '23% increase from last month',
                    variant: 'filled',
                    backgroundColor: '#e3f2fd'
                }
            }
        ]
    }
}
```

## See Also

- [Base Widget](base-widget.md) - Base widget class and patterns
- [Container Widget](container-widget.md) - For grouping cards
- [Buttons Widget](buttons-widget.md) - For card actions
- [Image Widget](image-widget.md) - For card images
- [List Widget](list-widget.md) - For card lists
- [Composition Recipes](../composition-recipes.md) - Advanced composition patterns
