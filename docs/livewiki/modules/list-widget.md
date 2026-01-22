---
path: modules/list-widget.md
page-type: module
summary: Dynamic list widget for displaying and managing collections of items with various layouts and interactions.
tags: [module, widget, list, dynamic, collection, layout]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# List Widget

The List Widget provides a powerful and flexible way to display collections of items with support for multiple layouts, selection modes, custom templates, and interactive actions. It's ideal for displaying data tables, product catalogs, task lists, and any collection-based content.

## Overview

The List Widget transforms an array of data items into a structured, interactive list with customizable rendering, selection capabilities, and built-in actions. It supports vertical, horizontal, and grid layouts with responsive behavior.

## Key Features

- **Multiple Layouts**: Vertical, horizontal, and grid layout options
- **Selection Modes**: Single, multi-select, and no selection
- **Custom Templates**: Flexible item rendering with built-in and custom templates
- **Interactive Actions**: Built-in action buttons for common operations
- **Dynamic Updates**: Real-time item updates without full re-render
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support

## Configuration Options

### Basic Configuration

```javascript
{
    type: 'list',
    props: {
        header: 'List Title',              // Optional header text
        layout: 'vertical',                // Layout: 'vertical', 'horizontal', 'grid'
        selectable: true,                  // Enable item selection
        multiSelect: false,                // Allow multiple selections
        items: [...],                      // Array of item objects
        itemTemplate: {...},               // Template for rendering items
        actions: [...],                    // Action buttons
        emptyState: {...},                 // Content when no items
        loadingState: {...},               // Content while loading
        pageSize: 20,                      // Items per page (pagination)
        sortable: false,                   // Enable drag-and-drop sorting
        filterable: true,                  // Enable search/filter
        searchable: true                   // Enable search functionality
    }
}
```

### Item Data Structure

```javascript
const items = [
    {
        id: 1,                             // Required unique identifier
        title: 'Item Title',               // Display title
        subtitle: 'Item subtitle',         // Optional subtitle
        description: 'Detailed description', // Optional description
        metadata: {                        // Additional metadata
            category: 'example',
            status: 'active',
            priority: 'high'
        },
        selectable: true,                  // Whether item can be selected
        disabled: false,                   // Whether item is disabled
        actions: [...]                     // Item-specific actions
    }
];
```

## Layout Options

### 1. Vertical Layout

Default layout for traditional lists:

```javascript
{
    type: 'list',
    props: {
        layout: 'vertical',
        gap: 'medium',                    // Gap between items: 'small', 'medium', 'large'
        alignItems: 'stretch',             // Item alignment
        items: [...]
    }
}
```

### 2. Horizontal Layout

For horizontal scrolling lists:

```javascript
{
    type: 'list',
    props: {
        layout: 'horizontal',
        wrap: false,                      // Wrap to next line
        spacing: 'medium',                // Spacing between items
        items: [...]
    }
}
```

### 3. Grid Layout

For card-based layouts:

```javascript
{
    type: 'list',
    props: {
        layout: 'grid',
        columns: 3,                       // Number of columns
        gap: 'medium',                    // Grid gap
        responsive: {                      // Responsive breakpoints
            mobile: 1,
            tablet: 2,
            desktop: 3
        },
        items: [...]
    }
}
```

## Item Templates

### 1. Text Template

Simple text-based rendering:

```javascript
itemTemplate: {
    type: 'text',
    text: '{{title}} - {{status}}',
    format: 'plain'
}
```

### 2. Card Template

Rich card-based rendering:

```javascript
itemTemplate: {
    type: 'card',
    title: '{{title}}',
    subtitle: '{{subtitle}}',
    description: '{{description}}',
    image: '{{imageUrl}}',
    actions: [
        {
            text: 'View',
            variant: 'primary',
            action: 'view'
        }
    ]
}
```

### 3. Custom Template

Advanced custom rendering:

```javascript
itemTemplate: {
    type: 'custom',
    render: (item, index, isSelected) => {
        const element = document.createElement('div');
        element.className = `custom-item ${isSelected ? 'selected' : ''}`;
        
        element.innerHTML = `
            <div class="item-header">
                <h3>${item.title}</h3>
                <span class="status ${item.status}">${item.status}</span>
            </div>
            <div class="item-content">
                <p>${item.description}</p>
                <div class="item-meta">
                    <span class="category">${item.metadata.category}</span>
                    <span class="date">${item.createdAt}</span>
                </div>
            </div>
        `;
        
        return element;
    }
}
```

### 4. Widget Template

Using other widgets as templates:

```javascript
itemTemplate: {
    type: 'container',
    props: {
        layout: 'horizontal',
        gap: 'small',
        children: [
            {
                type: 'text',
                props: {
                    content: '{{title}}',
                    format: 'plain'
                }
            },
            {
                type: 'button',
                props: {
                    label: 'Select',
                    variant: 'secondary',
                    size: 'small'
                }
            }
        ]
    }
}
```

## Selection Modes

### 1. Single Selection

```javascript
{
    type: 'list',
    props: {
        selectable: true,
        multiSelect: false,
        items: [...],
        onSelect: (selectedItem) => {
            console.log('Selected:', selectedItem);
        }
    }
}
```

### 2. Multi-Selection

```javascript
{
    type: 'list',
    props: {
        selectable: true,
        multiSelect: true,
        items: [...],
        onSelect: (selectedItems) => {
            console.log('Selected items:', selectedItems);
        }
    }
}
```

### 3. No Selection

```javascript
{
    type: 'list',
    props: {
        selectable: false,
        items: [...]
    }
}
```

## Actions

### Global Actions

Actions that apply to selected items or the entire list:

```javascript
actions: [
    {
        text: 'Add New',
        variant: 'primary',
        icon: 'plus',
        action: 'add',
        position: 'header'              // 'header' or 'footer'
    },
    {
        text: 'Delete Selected',
        variant: 'danger',
        icon: 'trash',
        action: 'delete',
        requiresSelection: true,
        position: 'footer'
    },
    {
        text: 'Export',
        variant: 'secondary',
        icon: 'download',
        action: 'export',
        position: 'footer'
    }
]
```

### Item-Specific Actions

Actions for individual items:

```javascript
// In item data
{
    id: 1,
    title: 'Item 1',
    actions: [
        {
            text: 'Edit',
            variant: 'primary',
            action: 'edit'
        },
        {
            text: 'Delete',
            variant: 'danger',
            action: 'delete'
        }
    ]
}

// Or in template
itemTemplate: {
    type: 'card',
    actions: [
        {
            text: 'View Details',
            variant: 'primary',
            action: 'view'
        },
        {
            text: 'Remove',
            variant: 'secondary',
            action: 'remove'
        }
    ]
}
```

## Usage Examples

### Simple Task List

```javascript
{
    type: 'list',
    props: {
        header: 'Task List',
        layout: 'vertical',
        selectable: true,
        items: [
            { id: 1, title: 'Complete project', status: 'pending', priority: 'high' },
            { id: 2, title: 'Review code', status: 'in-progress', priority: 'medium' },
            { id: 3, title: 'Deploy to production', status: 'completed', priority: 'low' }
        ],
        itemTemplate: {
            type: 'text',
            text: '{{title}} - {{status}} ({{priority}} priority)',
            format: 'plain'
        },
        actions: [
            {
                text: 'Complete Selected',
                variant: 'primary',
                action: 'complete',
                requiresSelection: true
            }
        ]
    }
}
```

### Product Catalog

```javascript
{
    type: 'list',
    props: {
        header: 'Product Catalog',
        layout: 'grid',
        columns: 3,
        selectable: true,
        multiSelect: true,
        items: [
            {
                id: 1,
                name: 'Widget Pro',
                price: '$99',
                description: 'Advanced widget tool',
                image: '/images/widget-pro.jpg',
                category: 'tools'
            },
            {
                id: 2,
                name: 'Widget Lite',
                price: '$49',
                description: 'Basic widget tool',
                image: '/images/widget-lite.jpg',
                category: 'tools'
            }
        ],
        itemTemplate: {
            type: 'card',
            title: '{{name}}',
            subtitle: '{{price}}',
            description: '{{description}}',
            image: '{{image}}'
        },
        actions: [
            {
                text: 'Add to Cart',
                variant: 'primary',
                action: 'addToCart'
            },
            {
                text: 'Compare',
                variant: 'secondary',
                action: 'compare'
            }
        ]
    }
}
```

### User Activity Feed

```javascript
{
    type: 'list',
    props: {
        header: 'Recent Activity',
        layout: 'vertical',
        selectable: false,
        items: [
            {
                id: 1,
                action: 'Logged in',
                user: 'John Doe',
                timestamp: '2 hours ago',
                type: 'login'
            },
            {
                id: 2,
                action: 'Updated profile',
                user: 'Jane Smith',
                timestamp: '1 day ago',
                type: 'profile'
            }
        ],
        itemTemplate: {
            type: 'custom',
            render: (item) => {
                const element = document.createElement('div');
                element.className = 'activity-item';
                
                element.innerHTML = `
                    <div class="activity-icon ${item.type}">
                        ${this.getActivityIcon(item.type)}
                    </div>
                    <div class="activity-content">
                        <strong>${item.user}</strong> ${item.action.toLowerCase()}
                        <div class="activity-time">${item.timestamp}</div>
                    </div>
                `;
                
                return element;
            }
        }
    }
}
```

### Data Table

```javascript
{
    type: 'list',
    props: {
        header: 'Sales Report',
        layout: 'vertical',
        selectable: true,
        items: [
            {
                id: 1,
                product: 'Widget A',
                sales: 1500,
                revenue: '$15,000',
                growth: '+12%'
            },
            {
                id: 2,
                product: 'Widget B',
                sales: 2300,
                revenue: '$23,000',
                growth: '+8%'
            }
        ],
        itemTemplate: {
            type: 'custom',
            render: (item) => {
                const row = document.createElement('div');
                row.style.display = 'grid';
                row.style.gridTemplateColumns = '2fr 1fr 1fr 1fr';
                row.style.gap = '12px';
                row.style.padding = '8px';
                row.style.borderBottom = '1px solid #eee';
                
                const growthColor = item.growth.startsWith('+') ? 'green' : 'red';
                
                row.innerHTML = `
                    <div><strong>${item.product}</strong></div>
                    <div>${item.sales}</div>
                    <div>${item.revenue}</div>
                    <div style="color: ${growthColor}">${item.growth}</div>
                `;
                
                return row;
            }
        },
        actions: [
            {
                text: 'Export Data',
                variant: 'primary',
                action: 'export'
            }
        ]
    }
}
```

## Advanced Features

### Pagination

```javascript
{
    type: 'list',
    props: {
        header: 'Large Dataset',
        layout: 'vertical',
        pageSize: 20,
        currentPage: 1,
        totalItems: 1000,
        items: [...], // Current page items
        pagination: {
            show: true,
            position: 'bottom',
            type: 'numbered'  // 'numbered', 'load-more', 'infinite-scroll'
        }
    }
}
```

### Search and Filter

```javascript
{
    type: 'list',
    props: {
        header: 'Searchable List',
        searchable: true,
        filterable: true,
        searchPlaceholder: 'Search items...',
        filters: [
            {
                key: 'category',
                label: 'Category',
                options: ['all', 'tools', 'templates', 'components']
            },
            {
                key: 'status',
                label: 'Status',
                options: ['all', 'active', 'inactive', 'pending']
            }
        ],
        items: [...]
    }
}
```

### Sorting

```javascript
{
    type: 'list',
    props: {
        header: 'Sortable List',
        sortable: true,
        sortOptions: [
            { key: 'title', label: 'Name', direction: 'asc' },
            { key: 'createdAt', label: 'Date', direction: 'desc' },
            { key: 'priority', label: 'Priority', direction: 'desc' }
        ],
        defaultSort: { key: 'createdAt', direction: 'desc' },
        items: [...]
    }
}
```

### Drag and Drop

```javascript
{
    type: 'list',
    props: {
        header: 'Draggable List',
        layout: 'vertical',
        draggable: true,
        dragHandle: '.drag-handle',
        onReorder: (oldIndex, newIndex, item) => {
            console.log(`Moved item from ${oldIndex} to ${newIndex}`);
        },
        items: [...]
    }
}
```

## State Management

### Internal State

```javascript
class ListWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.state = {
            items: config.items || [],
            selectedItems: new Set(),
            currentPage: 1,
            sortBy: null,
            filterBy: null,
            searchQuery: '',
            loading: false
        };
    }
    
    // Item management
    addItem(item) {
        this.state.items.push(item);
        this.render();
    }
    
    removeItem(itemId) {
        this.state.items = this.state.items.filter(item => item.id !== itemId);
        this.render();
    }
    
    updateItem(itemId, updates) {
        const item = this.state.items.find(item => item.id === itemId);
        if (item) {
            Object.assign(item, updates);
            this.render();
        }
    }
}
```

### Selection Management

```javascript
class ListWidget {
    selectItem(itemId, multiSelect = false) {
        if (multiSelect) {
            this.state.selectedItems.add(itemId);
        } else {
            this.state.selectedItems.clear();
            this.state.selectedItems.add(itemId);
        }
        
        this.updateSelectionUI();
        this.emit('selection:change', {
            selectedItems: Array.from(this.state.selectedItems)
        });
    }
    
    deselectItem(itemId) {
        this.state.selectedItems.delete(itemId);
        this.updateSelectionUI();
        this.emit('selection:change', {
            selectedItems: Array.from(this.state.selectedItems)
        });
    }
}
```

## Performance Optimization

### Virtual Scrolling

```javascript
{
    type: 'list',
    props: {
        header: 'Large List',
        layout: 'vertical',
        virtualScrolling: true,
        itemHeight: 60,              // Fixed item height for virtual scrolling
        bufferSize: 10,               // Extra items to render above/below viewport
        items: [...],                 // Can be thousands of items
        threshold: 100               // Enable virtual scrolling after this many items
    }
}
```

### Lazy Loading

```javascript
{
    type: 'list',
    props: {
        header: 'Lazy Loaded List',
        layout: 'vertical',
        lazy: true,
        loadMore: (page, limit) => {
            return fetchItems(page, limit);
        },
        items: [],                   // Initial empty or first page
        hasMore: true
    }
}
```

### Memoization

```javascript
class ListWidget {
    memoizeRender(item, index) {
        const key = `${item.id}-${item.version || 0}`;
        
        if (this.renderCache.has(key)) {
            return this.renderCache.get(key);
        }
        
        const rendered = this.renderItem(item, index);
        this.renderCache.set(key, rendered);
        return rendered;
    }
}
```

## Accessibility

### Keyboard Navigation

```javascript
class ListWidget {
    setupKeyboardNavigation() {
        this.element.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.navigateItems(-1);
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    this.navigateItems(1);
                    event.preventDefault();
                    break;
                case 'Home':
                    this.navigateToItem(0);
                    event.preventDefault();
                    break;
                case 'End':
                    this.navigateToItem(this.state.items.length - 1);
                    event.preventDefault();
                    break;
                case 'Enter':
                case ' ':
                    this.selectCurrentItem();
                    event.preventDefault();
                    break;
            }
        });
    }
}
```

### ARIA Attributes

```javascript
render() {
    this.element = this.createElement('div', 'list-widget');
    
    // Set ARIA attributes
    this.setAriaAttribute('role', 'list');
    this.setAriaAttribute('label', this.props.header || 'List');
    this.setAriaAttribute('multiselectable', this.props.multiSelect);
    
    return this.element;
}

renderItem(item, index) {
    const itemElement = this.createElement('div', 'list-item');
    
    itemElement.setAttribute('role', 'option');
    itemElement.setAttribute('aria-selected', this.state.selectedItems.has(item.id));
    itemElement.setAttribute('aria-posinset', index + 1);
    itemElement.setAttribute('aria-setsize', this.state.items.length);
    
    return itemElement;
}
```

## Error Handling

### Empty State

```javascript
{
    type: 'list',
    props: {
        header: 'My List',
        items: [],
        emptyState: {
            type: 'container',
            props: {
                layout: 'vertical',
                gap: 'medium',
                children: [
                    {
                        type: 'text',
                        props: {
                            content: 'No items found',
                            format: 'plain'
                        }
                    },
                    {
                        type: 'button',
                        props: {
                            label: 'Add First Item',
                            variant: 'primary'
                        }
                    }
                ]
            }
        }
    }
}
```

### Loading State

```javascript
{
    type: 'list',
    props: {
        header: 'Loading List',
        loading: true,
        loadingState: {
            type: 'container',
            props: {
                layout: 'vertical',
                gap: 'medium',
                children: [
                    {
                        type: 'progress',
                        props: {
                            label: 'Loading items...',
                            indeterminate: true
                        }
                    }
                ]
            }
        }
    }
}
```

### Error State

```javascript
{
    type: 'list',
    props: {
        header: 'Error List',
        error: 'Failed to load items',
        errorState: {
            type: 'container',
            props: {
                layout: 'vertical',
                gap: 'medium',
                children: [
                    {
                        type: 'text',
                        props: {
                            content: 'Failed to load items. Please try again.',
                            format: 'plain'
                        }
                    },
                    {
                        type: 'button',
                        props: {
                            label: 'Retry',
                            variant: 'primary'
                        }
                    }
                ]
            }
        }
    }
}
```

## Best Practices

### 1. Use Unique IDs
```javascript
// ✅ Good - Stable unique IDs
items: [
    { id: 'item-123', title: 'Item 1' },
    { id: 'item-456', title: 'Item 2' }
]

// ❌ Avoid - Unstable or duplicate IDs
items: [
    { id: 1, title: 'Item 1' },
    { id: 1, title: 'Item 2' }  // Duplicate ID
]
```

### 2. Provide Meaningful Templates
```javascript
// ✅ Good - Clear and informative
itemTemplate: {
    type: 'card',
    title: '{{title}}',
    subtitle: '{{category}} - {{status}}',
    description: '{{description}}'
}

// ❌ Avoid - Unclear or minimal
itemTemplate: {
    type: 'text',
    text: '{{title}}'
}
```

### 3. Handle Empty States
```javascript
// ✅ Good - Always provide empty state
{
    items: [],
    emptyState: { type: 'no-items-message', props: {} }
}
```

### 4. Optimize for Large Datasets
```javascript
// ✅ Good - Use virtual scrolling for large lists
{
    virtualScrolling: true,
    itemHeight: 60,
    threshold: 100
}
```

## Integration Examples

### E-commerce Product Grid

```javascript
{
    type: 'list',
    props: {
        header: 'Featured Products',
        layout: 'grid',
        columns: 3,
        selectable: true,
        multiSelect: true,
        items: products,
        itemTemplate: {
            type: 'card',
            title: '{{name}}',
            subtitle: '{{price}}',
            image: '{{imageUrl}}',
            badge: '{{discount}}% OFF'
        },
        actions: [
            {
                text: 'Add Selected to Cart',
                variant: 'primary',
                action: 'addToCart',
                requiresSelection: true
            },
            {
                text: 'Compare Selected',
                variant: 'secondary',
                action: 'compare',
                requiresSelection: true
            }
        ]
    }
}
```

### Task Management Dashboard

```javascript
{
    type: 'list',
    props: {
        header: 'My Tasks',
        layout: 'vertical',
        sortable: true,
        filterable: true,
        items: tasks,
        itemTemplate: {
            type: 'custom',
            render: (task) => this.renderTaskItem(task)
        },
        actions: [
            {
                text: 'Add Task',
                variant: 'primary',
                action: 'add',
                position: 'header'
            },
            {
                text: 'Complete Selected',
                variant: 'success',
                action: 'complete',
                requiresSelection: true
            }
        ]
    }
}
```

## See Also

- [Base Widget](base-widget.md) - Base widget class and patterns
- [Card Widget](card-widget.md) - For card-based item templates
- [Container Widget](container-widget.md) - For grouping list items
- [Widget Factory](widget-factory.md) - Widget creation and management
- [Composition Recipes](../composition-recipes.md) - Advanced composition patterns
- [Data Flow](../data_flow.md) - How list updates flow through the system
