---
path: modules/conditional-widget.md
page-type: module
summary: Conditional widget for dynamic content rendering based on conditions and state.
tags: [module, widget, conditional, logic, dynamic]
created: 2026-01-22
updated: 2026-01-22
version: 1.0.0
---

# Conditional Widget

The Conditional Widget provides powerful conditional rendering capabilities, allowing widgets to be shown or hidden based on user input, application state, or complex logical conditions. It's essential for creating dynamic, responsive user interfaces.

## Overview

The Conditional Widget evaluates conditions and renders different widget sets based on the evaluation result. It supports simple value comparisons, complex logical operators, and nested conditions for sophisticated UI flows.

## Key Features

- **Simple Conditions**: Basic value-based conditional rendering
- **Complex Logic**: Support for AND, OR, and nested logical operations
- **Fallback Content**: Default content when conditions aren't met
- **Dynamic Updates**: Real-time re-evaluation when conditions change
- **Nested Support**: Conditional widgets can contain other conditional widgets

## Configuration Options

### Basic Configuration

```javascript
{
    type: 'conditional',
    props: {
        condition: 'showIf:value',        // Condition to evaluate
        children: [...],                 // Widgets to show when condition is true
        fallback: {...},                 // Widget to show when condition is false (optional)
        operator: 'equals',              // Comparison operator (default: 'equals')
        key: 'fieldName',                // Field key for value comparison
        value: 'expectedValue'           // Expected value for comparison
    }
}
```

### Advanced Configuration

```javascript
{
    type: 'conditional',
    props: {
        condition: {
            operator: 'and',             // Logical operator: 'and', 'or', 'not'
            conditions: [
                'showIf:userRole',      // Simple condition
                {                        // Complex condition
                    operator: 'greaterThan',
                    key: 'userLevel',
                    value: 5
                }
            ]
        },
        children: [...],
        fallback: {...}
    }
}
```

## Condition Types

### 1. Simple Value Conditions

String-based conditions for basic comparisons:

```javascript
// Show if value exists
condition: 'showIf:fieldName'

// Show if value equals specific value
condition: 'equals:fieldName:expectedValue'

// Show if value doesn't equal
condition: 'notEquals:fieldName:expectedValue'
```

### 2. Comparison Operators

Numeric and string comparisons:

```javascript
{
    operator: 'greaterThan',    // >
    key: 'score',
    value: 80
}

{
    operator: 'lessThan',       // <
    key: 'age',
    value: 18
}

{
    operator: 'greaterThanOrEqual',  // >=
    key: 'items',
    value: 5
}

{
    operator: 'lessThanOrEqual',     // <=
    key: 'attempts',
    value: 3
}
```

### 3. String Operations

String-specific comparisons:

```javascript
{
    operator: 'contains',
    key: 'email',
    value: '@company.com'
}

{
    operator: 'startsWith',
    key: 'username',
    value: 'admin'
}

{
    operator: 'endsWith',
    key: 'filename',
    value: '.pdf'
}

{
    operator: 'matches',
    key: 'phone',
    value: /^\d{3}-\d{3}-\d{4}$/
}
```

### 4. Array Operations

Array-based conditions:

```javascript
{
    operator: 'includes',
    key: 'tags',
    value: 'important'
}

{
    operator: 'length',
    key: 'items',
    operator: 'greaterThan',
    value: 0
}

{
    operator: 'isEmpty',
    key: 'list'
}
```

### 5. Logical Combinations

Complex logical operations:

```javascript
{
    operator: 'and',
    conditions: [
        'showIf:firstName',
        'showIf:lastName',
        {
            operator: 'greaterThan',
            key: 'age',
            value: 18
        }
    ]
}

{
    operator: 'or',
    conditions: [
        'showIf:isAdmin',
        'showIf:isModerator'
    ]
}

{
    operator: 'not',
    conditions: ['showIf:isBlocked']
}
```

## Usage Examples

### Basic Show/Hide

```javascript
{
    type: 'conditional',
    props: {
        condition: 'showIf:userType',
        children: [
            {
                type: 'text',
                props: {
                    content: 'Welcome back, user!',
                    format: 'plain'
                }
            }
        ],
        fallback: {
            type: 'text',
            props: {
                content: 'Please log in to continue.',
                format: 'plain'
            }
        }
    }
}
```

### Admin Panel Access

```javascript
{
    type: 'conditional',
    props: {
        condition: {
            operator: 'and',
            conditions: [
                'showIf:userRole',
                {
                    operator: 'equals',
                    key: 'userRole',
                    value: 'admin'
                }
            ]
        },
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
                                content: '**Admin Panel**',
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
                    ]
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
```

### Progressive Form Steps

```javascript
{
    type: 'conditional',
    props: {
        condition: 'showIf:firstName',
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

### Content Based on Rating

```javascript
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
        ],
        fallback: {
            type: 'text',
            props: {
                content: 'Thank you for your positive feedback!',
                format: 'plain'
            }
        }
    }
}
```

## State Management

### Condition Evaluation

The Conditional Widget maintains internal state for condition evaluation:

```javascript
class ConditionalWidget extends BaseWidget {
    constructor(config) {
        super(config);
        this.conditionState = {
            currentCondition: null,
            lastEvaluation: false,
            dependentFields: []
        };
    }
    
    evaluateCondition() {
        const result = this.evaluateConditionExpression(this.props.condition);
        this.conditionState.lastEvaluation = result;
        this.updateVisibility(result);
        return result;
    }
}
```

### Dynamic Updates

The widget automatically re-evaluates when dependent fields change:

```javascript
setupEventListeners() {
    // Listen for changes in dependent fields
    this.props.dependentFields?.forEach(fieldKey => {
        this.on(`field:change:${fieldKey}`, () => {
            this.evaluateCondition();
        });
    });
}
```

## Performance Considerations

### Efficient Re-evaluation

```javascript
class ConditionalWidget {
    shouldReevaluate(changedField) {
        // Only re-evaluate if changed field affects condition
        return this.conditionState.dependentFields.includes(changedField);
    }
    
    debounceEvaluation() {
        clearTimeout(this.evaluationTimeout);
        this.evaluationTimeout = setTimeout(() => {
            this.evaluateCondition();
        }, 50);
    }
}
```

### Lazy Loading

```javascript
{
    type: 'conditional',
    props: {
        condition: 'showIf:premiumUser',
        lazy: true,                    // Only render children when condition is true
        children: [
            {
                type: 'premium-features',
                props: { /* Heavy component */ }
            }
        ]
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
                        { type: 'user-controls', props: {} }
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

## Error Handling

### Invalid Conditions

```javascript
class ConditionalWidget {
    evaluateCondition(condition) {
        try {
            return this.parseAndEvaluate(condition);
        } catch (error) {
            console.warn('Invalid condition:', condition, error);
            return false; // Default to hidden on error
        }
    }
}
```

### Missing Dependencies

```javascript
{
    type: 'conditional',
    props: {
        condition: 'showIf:nonExistentField',
        fallback: {
            type: 'text',
            props: {
                content: 'Configuration error: Missing dependency',
                format: 'plain'
            }
        }
    }
}
```

## Accessibility

### ARIA Attributes

```javascript
render() {
    this.element = this.createElement('div', 'conditional-widget');
    
    // Set appropriate ARIA attributes
    this.setAriaAttribute('live', 'polite');
    this.setAriaAttribute('atomic', 'true');
    
    return this.element;
}
```

### Screen Reader Announcements

```javascript
updateVisibility(isVisible) {
    if (isVisible) {
        this.announceToScreenReader('Content is now visible');
    } else {
        this.announceToScreenReader('Content is now hidden');
    }
}
```

## Best Practices

### 1. Use Meaningful Conditions
```javascript
// ✅ Good - Clear intent
condition: 'showIf:isAdmin'

// ❌ Avoid - Unclear purpose
condition: 'showIf:x'
```

### 2. Provide Fallbacks
```javascript
// ✅ Good - Always provide fallback
{
    condition: 'showIf:premium',
    children: [/* premium content */],
    fallback: { type: 'upgrade-prompt', props: {} }
}

// ❌ Avoid - No fallback
{
    condition: 'showIf:premium',
    children: [/* premium content */]
}
```

### 3. Keep Conditions Simple
```javascript
// ✅ Good - Simple and readable
condition: {
    operator: 'and',
    conditions: ['showIf:admin', 'showIf:active']
}

// ❌ Avoid - Overly complex
condition: {
    operator: 'and',
    conditions: [
        { operator: 'or', conditions: ['showIf:a', 'showIf:b'] },
        { operator: 'not', conditions: ['showIf:c'] }
    ]
}
```

### 4. Use Lazy Loading for Heavy Content
```javascript
// ✅ Good - Lazy load heavy components
{
    condition: 'showIf:advanced',
    lazy: true,
    children: [{ type: 'heavy-dashboard', props: {} }]
}
```

## Integration Examples

### Survey Flow

```javascript
{
    type: 'container',
    props: {
        layout: 'vertical',
        gap: 'medium',
        children: [
            {
                type: 'rating',
                props: {
                    label: 'How satisfied are you?',
                    buttonText: 'Continue'
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
                                placeholder: 'Tell us how to improve',
                                buttonText: 'Submit'
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

### User Type Detection

```javascript
{
    type: 'conditional',
    props: {
        condition: 'showIf:userRole',
        children: [
            {
                type: 'conditional',
                props: {
                    condition: { operator: 'equals', key: 'userRole', value: 'developer' },
                    children: [{ type: 'developer-tools', props: {} }],
                    fallback: [
                        {
                            type: 'conditional',
                            props: {
                                condition: { operator: 'equals', key: 'userRole', value: 'designer' },
                                children: [{ type: 'design-tools', props: {} }],
                                fallback: [{ type: 'basic-tools', props: {} }]
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```

## See Also

- [Base Widget](base-widget.md) - Base widget class and patterns
- [Container Widget](container-widget.md) - For grouping conditional content
- [Widget Factory](widget-factory.md) - Widget creation and management
- [Composition Recipes](../composition-recipes.md) - Advanced composition patterns
- [Data Flow](../data_flow.md) - How conditional updates flow through the system
