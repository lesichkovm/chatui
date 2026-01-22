---
path: composition-recipes.md
page-type: tutorial
summary: Practical examples and patterns for composing widgets using the ChatUI widget system.
tags: [tutorial, composition, patterns, widgets, examples]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Composition Recipes

This guide provides practical examples and patterns for composing widgets using the ChatUI widget system. Learn how to create complex user interfaces by combining different widgets and leveraging advanced features like conditional logic, dynamic lists, and responsive layouts.

## Table of Contents

1. [Basic Composition](#basic-composition)
2. [Conditional Logic](#conditional-logic)
3. [Dynamic Lists](#dynamic-lists)
4. [Form Patterns](#form-patterns)
5. [Data Display](#data-display)
6. [Interactive Workflows](#interactive-workflows)
7. [Responsive Design](#responsive-design)
8. [Advanced Patterns](#advanced-patterns)

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
        type: 'buttons',
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
    title: 'User Profile',
    children: [
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

### Progressive Form Steps

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

### Product Catalog with Cards

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

### Multi-step Form with Validation

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
          content: '## User Registration',
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
                required: true,
                validation: {
                  minLength: 2,
                  pattern: '[A-Za-z]+'
                }
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
                required: true,
                validation: {
                  minLength: 8
                }
              }
            },
            {
              type: 'conditional',
              props: {
                condition: {
                  operator: 'equals',
                  key: 'password',
                  value: 'confirm-password'
                },
                children: [
                  {
                    type: 'buttons',
                    props: {
                      label: 'Register',
                      variant: 'primary',
                      size: 'large',
                      loading: false
                    }
                  }
                ],
                fallback: [
                  {
                    type: 'password',
                    props: {
                      placeholder: 'Confirm Password',
                      required: true
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
```

### Survey Form with Conditional Questions

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
          maxRating: 5,
          required: true
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
                variant: 'primary',
                required: true
              }
            }
          ],
          fallback: [
            {
              type: 'text',
              props: {
                content: 'Thank you for your positive feedback!',
                format: 'plain'
              }
            },
            {
              type: 'checkbox',
              props: {
                label: 'Would you like to recommend us?',
                options: [
                  { id: 'yes', text: 'Yes, definitely!' },
                  { id: 'maybe', text: 'Maybe' },
                  { id: 'no', text: 'No' }
                ]
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

### User Dashboard with Stats

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
          variant: 'elevated',
          title: 'User Statistics',
          children: [
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
            { id: 1, action: 'Logged in', time: '2 hours ago', type: 'login' },
            { id: 2, action: 'Updated profile', time: '1 day ago', type: 'profile' },
            { id: 3, action: 'Completed task', time: '3 days ago', type: 'task' }
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

### Data Table with Custom Rendering

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

## Interactive Workflows

### Wizard Flow with Steps

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
            }
          ],
          fallback: {
            type: 'buttons',
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

## Responsive Design

### Mobile-First Layout

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'medium',
    responsive: {
      mobile: {
        layout: 'vertical',
        gap: 'small'
      },
      tablet: {
        layout: 'horizontal',
        gap: 'medium'
      },
      desktop: {
        layout: 'grid',
        columns: 2,
        gap: 'large'
      }
    },
    children: [
      {
        type: 'card',
        props: {
          title: 'Feature 1',
          description: 'Description of feature 1'
        }
      },
      {
        type: 'card',
        props: {
          title: 'Feature 2',
          description: 'Description of feature 2'
        }
      }
    ]
  }
}
```

### Adaptive Grid Layout

```javascript
{
  type: 'list',
  props: {
    header: 'Product Gallery',
    layout: 'grid',
    columns: 4,
    responsive: {
      mobile: { columns: 1 },
      tablet: { columns: 2 },
      desktop: { columns: 3 },
      widescreen: { columns: 4 }
    },
    items: products,
    itemTemplate: {
      type: 'card',
      title: '{{name}}',
      image: '{{imageUrl}}'
    }
  }
}
```

## Advanced Patterns

### Nested Conditionals

```javascript
{
  type: 'conditional',
  props: {
    condition: 'showIf:userType',
    children: [
      {
        type: 'conditional',
        props: {
          condition: {
            operator: 'equals',
            key: 'userType',
            value: 'admin'
          },
          children: [
            { type: 'admin-controls', props: {} }
          ],
          fallback: [
            {
              type: 'conditional',
              props: {
                condition: {
                  operator: 'equals',
                  key: 'userType',
                  value: 'moderator'
                },
                children: [
                  { type: 'moderator-controls', props: {} }
                ],
                fallback: [
                  { type: 'user-controls', props: {} }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
```

### Multi-branch Conditions

```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'medium',
    children: [
      {
        type: 'conditional',
        props: {
          condition: { operator: 'equals', key: 'plan', value: 'free' },
          children: [{ type: 'free-features', props: {} }]
        }
      },
      {
        type: 'conditional',
        props: {
          condition: { operator: 'equals', key: 'plan', value: 'pro' },
          children: [{ type: 'pro-features', props: {} }]
        }
      },
      {
        type: 'conditional',
        props: {
          condition: { operator: 'equals', key: 'plan', value: 'enterprise' },
          children: [{ type: 'enterprise-features', props: {} }]
        }
      }
    ]
  }
}
```

### Dynamic Form with Real-time Validation

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
          type: 'email',
          placeholder: 'Email Address',
          required: true,
          validation: {
            pattern: '^[^@]+@[^@]+\.[^@]+$',
            message: 'Please enter a valid email address'
          },
          onValidate: (isValid, value) => {
            if (isValid) {
              // Show success state
              this.emit('email:valid', value);
            } else {
              // Show error state
              this.emit('email:invalid', value);
            }
          }
        }
      },
      {
        type: 'conditional',
        props: {
          condition: 'showIf:emailValid',
          children: [
            {
              type: 'buttons',
              props: {
                label: 'Continue',
                variant: 'primary',
                disabled: false
              }
            }
          ],
          fallback: [
            {
              type: 'buttons',
              props: {
                label: 'Continue',
                variant: 'primary',
                disabled: true
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

### 1. Use Meaningful Container Names
- Organize related widgets in logical containers
- Use descriptive names for container purposes
- Keep container depth reasonable (avoid excessive nesting)

### 2. Leverage Conditional Logic
- Show/hide content based on user interactions
- Provide fallbacks for all conditional widgets
- Use conditions to create progressive disclosure

### 3. Choose Appropriate Layouts
- Use vertical for forms and sequential content
- Use horizontal for options and controls
- Use grid for cards and galleries

### 4. Provide Fallbacks
- Always include fallback content for conditional widgets
- Handle empty states for lists
- Provide loading states for async operations

### 5. Keep Templates Simple
- Use clear, readable template strings
- Avoid overly complex custom render functions
- Test templates with various data scenarios

### 6. Handle Loading States
- Use conditional widgets to show loading indicators
- Provide skeleton screens for better UX
- Implement proper error handling

### 7. Test Interactions
- Ensure all widget interactions work as expected
- Test keyboard navigation and accessibility
- Validate form submissions and data flow

## Performance Tips

### 1. Lazy Loading
```javascript
{
  type: 'conditional',
  props: {
    condition: 'showWhenVisible',
    lazy: true,  // Only render when condition is true and visible
    children: [/* Heavy content */]
  }
}
```

### 2. Virtual Scrolling for Large Lists
```javascript
{
  type: 'list',
  props: {
    virtualScrolling: true,
    itemHeight: 60,
    bufferSize: 10,
    items: largeDataset
  }
}
```

### 3. Debounce Search
```javascript
{
  type: 'input',
  props: {
    placeholder: 'Search...',
    debounce: 300,  // Debounce input changes
    onChange: (value) => this.performSearch(value)
  }
}
```

## See Also

- [Widget Factory](modules/widget-factory.md) - Widget creation and management
- [Conditional Widget](modules/conditional-widget.md) - Conditional rendering
- [List Widget](modules/list-widget.md) - Dynamic lists
- [Container Widget](modules/container-widget.md) - Layout containers
- [Card Widget](modules/card-widget.md) - Content cards
- [Buttons Widget](modules/buttons-widget.md) - Interactive buttons
- [API Reference](api_reference.md) - Complete API documentation
