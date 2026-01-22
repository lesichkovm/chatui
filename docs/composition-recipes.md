# Composition Recipes

This guide provides practical examples and patterns for composing widgets using the ChatUI widget system.

## Table of Contents

1. [Basic Composition](#basic-composition)
2. [Conditional Logic](#conditional-logic)
3. [Dynamic Lists](#dynamic-lists)
4. [Form Patterns](#form-patterns)
5. [Data Display](#data-display)
6. [Interactive Workflows](#interactive-workflows)

## Basic Composition

### Container with Text and Button

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'medium',
    children: [
      {
        type: 'text',
        props: {
          content: 'Welcome to our application!',
          format: 'plain'
        }
      },
      {
        type: 'button',
        props: {
          label: 'Get Started',
          variant: 'primary',
          size: 'large'
        }
      }
    ]
  }
}
```

### Card with Multiple Widgets

```javascript
{
  type: 'card',
  props: {
    variant: 'default',
    padding: 'medium',
    children: [
      {
        type: 'text',
        props: {
          content: '**User Profile**',
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
              type: 'input',
              props: {
                type: 'text',
                placeholder: 'Enter your name',
                buttonText: 'Save',
                variant: 'secondary'
              }
            },
            {
              type: 'textarea',
              props: {
                placeholder: 'Enter your bio',
                buttonText: 'Update Bio',
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

## Conditional Logic

### Show/Hide Based on User Input

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'medium',
    children: [
      {
        type: 'input',
        props: {
          type: 'text',
          placeholder: 'Enter "admin" to see advanced options',
          buttonText: 'Submit'
        }
      },
      {
        type: 'conditional',
        props: {
          condition: 'showIf:value',
          children: [
            {
              type: 'text',
              props: {
                content: '**Admin Panel**\nAdvanced settings available',
                format: 'markdown'
              }
            },
            {
              type: 'toggle',
              props: {
                label: 'Enable debug mode',
                buttonText: 'Apply'
              }
            }
          ],
          fallback: {
            type: 'text',
            props: {
              content: '_Admin access required_',
              format: 'markdown'
            }
          }
        }
      }
    ]
  }
}
```

### Complex Conditions

```javascript
{
  type: 'conditional',
  props: {
    condition: {
      operator: 'and',
      conditions: [
        'showIf:userRole',
        { operator: 'greaterThan', key: 'userLevel', value: 5 }
      ]
    },
    children: [
      {
        type: 'text',
        props: {
          content: 'Premium features unlocked!',
          format: 'plain'
        }
      }
    ]
  }
}
```

## Dynamic Lists

### Simple Item List

```javascript
{
  type: 'list',
  props: {
    header: 'Task List',
    layout: 'vertical',
    selectable: true,
    items: [
      { id: 1, title: 'Complete project', status: 'pending' },
      { id: 2, title: 'Review code', status: 'in-progress' },
      { id: 3, title: 'Deploy to production', status: 'completed' }
    ],
    itemTemplate: {
      type: 'text',
      text: '{{title}} - {{status}}'
    },
    actions: [
      {
        text: 'Complete Selected',
        variant: 'primary',
        action: 'complete'
      }
    ]
  }
}
```

### Card-based List

```javascript
{
  type: 'list',
  props: {
    header: 'Product Catalog',
    layout: 'grid',
    selectable: true,
    multiSelect: true,
    items: [
      { id: 1, name: 'Widget Pro', price: '$99', description: 'Advanced widget tool' },
      { id: 2, name: 'Widget Lite', price: '$49', description: 'Basic widget tool' },
      { id: 3, name: 'Widget Enterprise', price: '$299', description: 'Full-featured solution' }
    ],
    itemTemplate: {
      type: 'card',
      title: '{{name}}',
      subtitle: '{{price}}',
      description: '{{description}}'
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

### Custom List Rendering

```javascript
{
  type: 'list',
  props: {
    header: 'Custom Items',
    layout: 'horizontal',
    items: [
      { id: 1, color: '#ff0000', label: 'Red' },
      { id: 2, color: '#00ff00', label: 'Green' },
      { id: 3, color: '#0000ff', label: 'Blue' }
    ],
    itemTemplate: {
      type: 'custom',
      render: (item) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '8px';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '20px';
        colorBox.style.height = '20px';
        colorBox.style.backgroundColor = item.color;
        colorBox.style.borderRadius = '4px';
        
        const label = document.createElement('span');
        label.textContent = item.label;
        
        div.appendChild(colorBox);
        div.appendChild(label);
        
        return div;
      }
    }
  }
}
```

## Form Patterns

### Multi-step Form

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'large',
    children: [
      {
        type: 'text',
        props: {
          content: '## Step 1: Personal Information',
          format: 'markdown'
        }
      },
      {
        type: 'container',
        props: {
          layout: 'vertical',
          gap: 'medium',
          children: [
            {
              type: 'input',
              props: {
                type: 'text',
                placeholder: 'First Name',
                buttonText: 'Next',
                variant: 'primary'
              }
            },
            {
              type: 'input',
              props: {
                type: 'text',
                placeholder: 'Last Name',
                buttonText: 'Next',
                variant: 'primary'
              }
            }
          ]
        }
      },
      {
        type: 'conditional',
        props: {
          condition: 'showIf:firstName',
          children: [
            {
              type: 'text',
              props: {
                content: '## Step 2: Contact Information',
                format: 'markdown'
              }
            },
            {
              type: 'input',
              props: {
                type: 'email',
                placeholder: 'Email Address',
                buttonText: 'Next',
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

### Survey Form

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'medium',
    children: [
      {
        type: 'text',
        props: {
          content: '## Customer Satisfaction Survey',
          format: 'markdown'
        }
      },
      {
        type: 'rating',
        props: {
          label: 'How satisfied are you with our service?',
          buttonText: 'Continue',
          maxRating: 5
        }
      },
      {
        type: 'conditional',
        props: {
          condition: {
            operator: 'lessThan',
            key: 'rating',
            value: 4
          },
          children: [
            {
              type: 'textarea',
              props: {
                placeholder: 'Please tell us how we can improve',
                buttonText: 'Submit Feedback',
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

## Data Display

### User Dashboard

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'large',
    children: [
      {
        type: 'card',
        props: {
          variant: 'default',
          children: [
            {
              type: 'text',
              props: {
                content: '**User Statistics**',
                format: 'markdown'
              }
            },
            {
              type: 'container',
              props: {
                layout: 'horizontal',
                gap: 'medium',
                children: [
                  {
                    type: 'progress',
                    props: {
                      label: 'Profile Completion',
                      value: 75,
                      max: 100,
                      showPercentage: true
                    }
                  },
                  {
                    type: 'progress',
                    props: {
                      label: 'Activity Score',
                      value: 850,
                      max: 1000,
                      showPercentage: true
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        type: 'list',
        props: {
          header: 'Recent Activity',
          layout: 'vertical',
          items: [
            { id: 1, action: 'Logged in', time: '2 hours ago' },
            { id: 2, action: 'Updated profile', time: '1 day ago' },
            { id: 3, action: 'Completed task', time: '3 days ago' }
          ],
          itemTemplate: {
            type: 'card',
            title: '{{action}}',
            subtitle: '{{time}}'
          }
        }
      }
    ]
  }
}
```

### Data Table Alternative

```javascript
{
  type: 'list',
  props: {
    header: 'Sales Report',
    layout: 'vertical',
    selectable: true,
    items: [
      { id: 1, product: 'Widget A', sales: 1500, revenue: '$15,000', growth: '+12%' },
      { id: 2, product: 'Widget B', sales: 2300, revenue: '$23,000', growth: '+8%' },
      { id: 3, product: 'Widget C', sales: 980, revenue: '$9,800', growth: '-3%' }
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
        
        row.innerHTML = `
          <div><strong>${item.product}</strong></div>
          <div>${item.sales}</div>
          <div>${item.revenue}</div>
          <div style="color: ${item.growth.startsWith('+') ? 'green' : 'red'}">${item.growth}</div>
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

## Interactive Workflows

### Wizard Flow

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'large',
    children: [
      {
        type: 'text',
        props: {
          content: '## Setup Wizard',
          format: 'markdown'
        }
      },
      {
        type: 'conditional',
        props: {
          condition: 'showIf:step',
          children: [
            {
              type: 'container',
              props: {
                layout: 'vertical',
                gap: 'medium',
                children: [
                  {
                    type: 'text',
                    props: {
                      content: '### Step 1: Choose Plan',
                      format: 'markdown'
                    }
                  },
                  {
                    type: 'radio',
                    props: {
                      options: [
                        { id: 'free', text: 'Free Plan', value: 'free' },
                        { id: 'pro', text: 'Pro Plan ($10/month)', value: 'pro' },
                        { id: 'enterprise', text: 'Enterprise Plan', value: 'enterprise' }
                      ],
                      buttonText: 'Continue'
                    }
                  }
                ]
              }
            ]
          },
          fallback: {
            type: 'button',
            props: {
              label: 'Start Setup',
              variant: 'primary',
              size: 'large'
            }
          }
        }
      }
    ]
  }
}
```

### Dynamic Content Based on Selection

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'medium',
    children: [
      {
        type: 'select',
        props: {
          placeholder: 'Choose a category',
          options: [
            { id: 'tech', text: 'Technology', value: 'tech' },
            { id: 'art', text: 'Art & Design', value: 'art' },
            { id: 'music', text: 'Music', value: 'music' }
          ]
        }
      },
      {
        type: 'conditional',
        props: {
          condition: 'value',
          children: [
            {
              type: 'list',
              props: {
                header: 'Recommended Items',
                layout: 'horizontal',
                selectable: true,
                items: [], // This would be populated based on the selection
                itemTemplate: {
                  type: 'card',
                  title: '{{name}}',
                  subtitle: '{{category}}'
                }
              }
            }
          ]
        }
      }
    ]
  }
}
```

## Best Practices

1. **Use meaningful container names** - Organize related widgets in logical containers
2. **Leverage conditional logic** - Show/hide content based on user interactions
3. **Choose appropriate layouts** - Use vertical for forms, horizontal for options, grid for cards
4. **Provide fallbacks** - Always include fallback content for conditional widgets
5. **Keep templates simple** - Use clear, readable template strings
6. **Handle loading states** - Use conditional widgets to show loading indicators
7. **Test interactions** - Ensure all widget interactions work as expected in compositions

## Advanced Tips

- **Nested conditionals**: Use conditional widgets inside other conditional widgets for complex logic
- **Dynamic list updates**: Use the `updateItems()` method to refresh list content
- **State management**: Leverage the conditional widget's state system for complex workflows
- **Custom rendering**: Use custom list item templates for unique display requirements
- **Performance**: Avoid deeply nested compositions when possible for better performance
