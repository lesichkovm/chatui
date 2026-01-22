# Form Composition Examples

This document provides practical examples of how to use the new composable widget system to create sophisticated forms and multi-widget interactions.

## Basic Form Example

### Simple Contact Form
```javascript
{
  type: 'form',
  props: {
    layout: 'vertical',
    gap: 'medium'
  },
  children: [
    {
      type: 'input',
      props: {
        placeholder: 'Enter your name',
        showSubmitButton: false,
        required: true
      }
    },
    {
      type: 'input',
      props: {
        type: 'email',
        placeholder: 'Enter your email',
        showSubmitButton: false,
        required: true
      }
    },
    {
      type: 'textarea',
      props: {
        placeholder: 'Enter your message',
        showSubmitButton: false,
        rows: 4,
        required: true
      }
    },
    {
      type: 'buttons',
      props: {
        options: [
          { id: 'submit', text: 'Send Message', variant: 'primary' },
          { id: 'cancel', text: 'Cancel', variant: 'secondary' }
        ]
      }
    }
  ]
}
```

**Result**: A clean contact form where all inputs are collected and submitted together when the user clicks "Send Message".

## Advanced Form Examples

### User Registration Form with Validation
```javascript
{
  type: 'form',
  props: {
    layout: 'vertical',
    gap: 'large'
  },
  children: [
    {
      type: 'container',
      props: {
        layout: 'horizontal',
        gap: 'medium'
      },
      children: [
        {
          type: 'input',
          props: {
            placeholder: 'First Name',
            showSubmitButton: false,
            required: true
          }
        },
        {
          type: 'input',
          props: {
            placeholder: 'Last Name',
            showSubmitButton: false,
            required: true
          }
        }
      ]
    },
    {
      type: 'input',
      props: {
        type: 'email',
        placeholder: 'Email Address',
        showSubmitButton: false,
        required: true
      }
    },
    {
      type: 'password',
      props: {
        placeholder: 'Password',
        showSubmitButton: false,
        required: true
      }
    },
    {
      type: 'password',
      props: {
        placeholder: 'Confirm Password',
        showSubmitButton: false,
        required: true
      }
    },
    {
      type: 'checkbox',
      props: {
        options: [
          { id: 'terms', text: 'I agree to the Terms and Conditions' }
        ],
        showSubmitButton: false,
        required: true
      }
    },
    {
      type: 'buttons',
      props: {
        options: [
          { id: 'register', text: 'Create Account', variant: 'primary' },
          { id: 'reset', text: 'Reset Form', variant: 'secondary' }
        ]
      }
    }
  ]
}
```

### Survey Form with Multiple Question Types
```javascript
{
  type: 'form',
  props: {
    layout: 'vertical',
    gap: 'large'
  },
  children: [
    {
      type: 'text',
      props: {
        text: 'Customer Satisfaction Survey',
        style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }
      }
    },
    {
      type: 'radio',
      props: {
        question: 'How satisfied are you with our service?',
        options: [
          { id: 'very-satisfied', text: 'Very Satisfied' },
          { id: 'satisfied', text: 'Satisfied' },
          { id: 'neutral', text: 'Neutral' },
          { id: 'dissatisfied', text: 'Dissatisfied' },
          { id: 'very-dissatisfied', text: 'Very Dissatisfied' }
        ],
        showSubmitButton: false
      }
    },
    {
      type: 'rating',
      props: {
        question: 'Rate our product quality',
        maxRating: 5,
        showSubmitButton: false
      }
    },
    {
      type: 'checkbox',
      props: {
        question: 'Which features do you use most? (Select all that apply)',
        options: [
          { id: 'feature-a', text: 'Feature A' },
          { id: 'feature-b', text: 'Feature B' },
          { id: 'feature-c', text: 'Feature C' },
          { id: 'feature-d', text: 'Feature D' }
        ],
        showSubmitButton: false
      }
    },
    {
      type: 'textarea',
      props: {
        placeholder: 'Additional comments or suggestions...',
        showSubmitButton: false,
        rows: 4
      }
    },
    {
      type: 'buttons',
      props: {
        options: [
          { id: 'submit-survey', text: 'Submit Survey', variant: 'primary' },
          { id: 'skip', text: 'Skip Survey', variant: 'secondary' }
        ]
      }
    }
  ]
}
```

## Container Widget Form Mode

### Using Container Widget as Form
```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'medium',
    formMode: true  // Enable form coordination
  },
  children: [
    {
      type: 'input',
      props: {
        placeholder: 'Username',
        showSubmitButton: false
      }
    },
    {
      type: 'password',
      props: {
        placeholder: 'Password',
        showSubmitButton: false
      }
    },
    {
      type: 'buttons',
      props: {
        options: [
          { id: 'login', text: 'Login', variant: 'primary' },
          { id: 'forgot', text: 'Forgot Password?', variant: 'link' }
        ]
      }
    }
  ]
}
```

## Complex Multi-Step Forms

### Product Configuration Wizard
```javascript
{
  type: 'container',
  props: {
    layout: 'vertical',
    gap: 'large'
  },
  children: [
    {
      type: 'text',
      props: {
        text: 'Step 1: Basic Information',
        style: { fontSize: '16px', fontWeight: 'bold' }
      }
    },
    {
      type: 'form',
      props: {
        layout: 'vertical',
        gap: 'medium'
      },
      children: [
        {
          type: 'input',
          props: {
            placeholder: 'Product Name',
            showSubmitButton: false,
            required: true
          }
        },
        {
          type: 'select',
          props: {
            question: 'Product Category',
            options: [
              { id: 'electronics', text: 'Electronics' },
              { id: 'clothing', text: 'Clothing' },
              { id: 'books', text: 'Books' },
              { id: 'home', text: 'Home & Garden' }
            ],
            showSubmitButton: false
          }
        },
        {
          type: 'buttons',
          props: {
            options: [
              { id: 'next-step', text: 'Next Step →', variant: 'primary' }
            ]
          }
        }
      ]
    }
  ]
}
```

## Interactive Forms with Conditional Logic

### Dynamic Form with Conditional Fields
```javascript
{
  type: 'form',
  props: {
    layout: 'vertical',
    gap: 'medium'
  },
  children: [
    {
      type: 'select',
      props: {
        question: 'Account Type',
        options: [
          { id: 'personal', text: 'Personal Account' },
          { id: 'business', text: 'Business Account' }
        ],
        showSubmitButton: false
      }
    },
    {
      type: 'conditional',
      props: {
        condition: 'account-type === "business"',
        children: [
          {
            type: 'input',
            props: {
              placeholder: 'Company Name',
              showSubmitButton: false,
              required: true
            }
          },
          {
            type: 'input',
            props: {
              placeholder: 'Tax ID',
              showSubmitButton: false,
              required: true
            }
          }
        ]
      }
    },
    {
      type: 'buttons',
      props: {
        options: [
          { id: 'create-account', text: 'Create Account', variant: 'primary' },
          { id: 'cancel', text: 'Cancel', variant: 'secondary' }
        ]
      }
    }
  ]
}
```

## Data Collection Forms

### Event Registration Form
```javascript
{
  type: 'form',
  props: {
    layout: 'vertical',
    gap: 'medium'
  },
  children: [
    {
      type: 'container',
      props: {
        layout: 'horizontal',
        gap: 'medium'
      },
      children: [
        {
          type: 'input',
          props: {
            placeholder: 'First Name',
            showSubmitButton: false,
            required: true
          }
        },
        {
          type: 'input',
          props: {
            placeholder: 'Last Name',
            showSubmitButton: false,
            required: true
          }
        }
      ]
    },
    {
      type: 'input',
      props: {
        type: 'email',
        placeholder: 'Email Address',
        showSubmitButton: false,
        required: true
      }
    },
    {
      type: 'date',
      props: {
        question: 'Date of Birth',
        showSubmitButton: false
      }
    },
    {
      type: 'select',
      props: {
        question: 'T-Shirt Size',
        options: [
          { id: 'xs', text: 'XS' },
          { id: 's', text: 'S' },
          { id: 'm', text: 'M' },
          { id: 'l', text: 'L' },
          { id: 'xl', text: 'XL' },
          { id: 'xxl', text: 'XXL' }
        ],
        showSubmitButton: false
      }
    },
    {
      type: 'checkbox',
      props: {
        question: 'Dietary Restrictions',
        options: [
          { id: 'vegetarian', text: 'Vegetarian' },
          { id: 'vegan', text: 'Vegan' },
          { id: 'gluten-free', text: 'Gluten-Free' },
          { id: 'none', text: 'None' }
        ],
        showSubmitButton: false
      }
    },
    {
      type: 'buttons',
      props: {
        options: [
          { id: 'register', text: 'Register for Event', variant: 'primary' },
          { id: 'save-later', text: 'Save for Later', variant: 'secondary' }
        ]
      }
    }
  ]
}
```

## Best Practices

### 1. Always Set `showSubmitButton: false` for Composable Forms
```javascript
// ❌ Wrong - Individual widgets will submit separately
{
  type: 'input',
  props: {
    placeholder: 'Name'
    // Missing showSubmitButton: false
  }
}

// ✅ Correct - Widget participates in form submission
{
  type: 'input',
  props: {
    placeholder: 'Name',
    showSubmitButton: false
  }
}
```

### 2. Use Container Widgets for Layout
```javascript
{
  type: 'form',
  props: {
    layout: 'vertical',
    gap: 'medium'
  },
  children: [
    {
      type: 'container',
      props: {
        layout: 'horizontal',
        gap: 'small'
      },
      children: [
        // Multiple fields in same row
      ]
    }
  ]
}
```

### 3. Provide Clear Action Buttons
```javascript
{
  type: 'buttons',
  props: {
    options: [
      { id: 'submit', text: 'Submit Form', variant: 'primary' },
      { id: 'cancel', text: 'Cancel', variant: 'secondary' },
      { id: 'save-draft', text: 'Save Draft', variant: 'tertiary' }
    ]
  }
}
```

### 4. Handle Form Data on Backend
The form will submit all widget values in a structured format:

```javascript
// Example form submission data
{
  action: 'submit',
  formData: {
    'widget-1': 'John Doe',
    'widget-2': 'john@example.com',
    'widget-3': 'This is the message content',
    'widget-4': ['option1', 'option2'], // Checkbox values
    'widget-5': 4 // Rating value
  },
  widgetType: 'form'
}
```

## Migration from Legacy Format

### Before (Legacy)
```javascript
{
  text: "Please enter your information:",
  widget: {
    type: "input",
    props: {
      placeholder: "Your name"
    }
  }
}
```

### After (Composable)
```javascript
{
  widgets: [
    {
      type: "text",
      props: {
        text: "Please enter your information:"
      }
    },
    {
      type: "form",
      props: {
        layout: "vertical",
        gap: "medium"
      },
      children: [
        {
          type: "input",
          props: {
            placeholder: "Your name",
            showSubmitButton: false
          }
        },
        {
          type: "buttons",
          props: {
            options: [
              { id: "submit", text: "Submit", variant: "primary" }
            ]
          }
        }
      ]
    }
  ]
}
```

These examples demonstrate the full power of the composable widget system, enabling complex form interactions while maintaining clean, maintainable code structure.
