---
path: form-composition-examples.md
page-type: tutorial
summary: Practical form examples using the current composable widget schema.
tags: [forms, composition, widgets, examples]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# Form Composition Examples

This document provides practical examples for building forms using the **composable widget schema**. All widgets are defined with `type`, configured via `props`, and composed through `children`.

> **Schema Reminder**
```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    { "type": "text", "props": { "content": "Hello", "format": "plain" } }
  ]
}
```

---

## Basic Form Example

### Simple Contact Form

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    {
      "type": "input",
      "props": {
        "placeholder": "Enter your name",
        "required": true
      }
    },
    {
      "type": "input",
      "props": {
        "type": "email",
        "placeholder": "Enter your email",
        "required": true
      }
    },
    {
      "type": "textarea",
      "props": {
        "placeholder": "Enter your message",
        "rows": 4,
        "required": true
      }
    },
    {
      "type": "buttons",
      "props": {
        "options": [
          { "id": "submit", "text": "Send Message", "value": "submit" },
          { "id": "cancel", "text": "Cancel", "value": "cancel" }
        ]
      }
    }
  ]
}
```

---

## Advanced Form Examples

### User Registration Form

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "large" },
  "children": [
    {
      "type": "container",
      "props": { "layout": "horizontal", "gap": "medium" },
      "children": [
        {
          "type": "input",
          "props": { "placeholder": "First Name", "required": true }
        },
        {
          "type": "input",
          "props": { "placeholder": "Last Name", "required": true }
        }
      ]
    },
    {
      "type": "input",
      "props": {
        "type": "email",
        "placeholder": "Email Address",
        "required": true
      }
    },
    {
      "type": "password",
      "props": {
        "placeholder": "Password",
        "required": true
      }
    },
    {
      "type": "password",
      "props": {
        "placeholder": "Confirm Password",
        "required": true
      }
    },
    {
      "type": "checkbox",
      "props": {
        "options": [
          { "id": "terms", "text": "I agree to the Terms and Conditions", "value": "accepted" }
        ],
        "required": true
      }
    },
    {
      "type": "buttons",
      "props": {
        "options": [
          { "id": "register", "text": "Create Account", "value": "register" },
          { "id": "reset", "text": "Reset Form", "value": "reset" }
        ]
      }
    }
  ]
}
```

### Customer Survey Form

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "large" },
  "children": [
    {
      "type": "text",
      "props": {
        "content": "Customer Satisfaction Survey",
        "format": "plain"
      }
    },
    {
      "type": "radio",
      "props": {
        "question": "How satisfied are you with our service?",
        "options": [
          { "id": "very-satisfied", "text": "Very Satisfied", "value": "very" },
          { "id": "satisfied", "text": "Satisfied", "value": "satisfied" },
          { "id": "neutral", "text": "Neutral", "value": "neutral" },
          { "id": "dissatisfied", "text": "Dissatisfied", "value": "dissatisfied" }
        ]
      }
    },
    {
      "type": "rating",
      "props": {
        "label": "Rate our product quality",
        "maxRating": 5,
        "showSubmitButton": true
      }
    },
    {
      "type": "checkbox",
      "props": {
        "question": "Which features do you use most? (Select all that apply)",
        "options": [
          { "id": "feature-a", "text": "Feature A", "value": "feature_a" },
          { "id": "feature-b", "text": "Feature B", "value": "feature_b" },
          { "id": "feature-c", "text": "Feature C", "value": "feature_c" }
        ]
      }
    },
    {
      "type": "textarea",
      "props": {
        "placeholder": "Additional comments or suggestions...",
        "rows": 4
      }
    },
    {
      "type": "buttons",
      "props": {
        "options": [
          { "id": "submit-survey", "text": "Submit Survey", "value": "submit" },
          { "id": "skip", "text": "Skip Survey", "value": "skip" }
        ]
      }
    }
  ]
}
```

---

## Container Widget in Form Mode

### Container Coordinating Inputs

```json
{
  "type": "container",
  "props": {
    "layout": "vertical",
    "gap": "medium",
    "formMode": true
  },
  "children": [
    {
      "type": "input",
      "props": {
        "placeholder": "Username",
        "required": true
      }
    },
    {
      "type": "password",
      "props": {
        "placeholder": "Password",
        "required": true
      }
    },
    {
      "type": "buttons",
      "props": {
        "options": [
          { "id": "login", "text": "Login", "value": "login" },
          { "id": "forgot", "text": "Forgot Password?", "value": "forgot" }
        ]
      }
    }
  ]
}
```

---

## Multi-Step Forms

### Product Configuration Wizard

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "large" },
  "children": [
    {
      "type": "text",
      "props": {
        "content": "Step 1: Basic Information",
        "format": "plain"
      }
    },
    {
      "type": "form",
      "props": { "layout": "vertical", "gap": "medium" },
      "children": [
        {
          "type": "input",
          "props": {
            "placeholder": "Product Name",
            "required": true
          }
        },
        {
          "type": "select",
          "props": {
            "placeholder": "Product Category",
            "options": [
              { "id": "electronics", "text": "Electronics", "value": "electronics" },
              { "id": "clothing", "text": "Clothing", "value": "clothing" },
              { "id": "books", "text": "Books", "value": "books" }
            ]
          }
        },
        {
          "type": "buttons",
          "props": {
            "options": [
              { "id": "next-step", "text": "Next Step →", "value": "next" }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Conditional Logic in Forms

### Dynamic Form Based on Selection

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    {
      "type": "select",
      "props": {
        "placeholder": "Account Type",
        "options": [
          { "id": "personal", "text": "Personal Account", "value": "personal" },
          { "id": "business", "text": "Business Account", "value": "business" }
        ]
      }
    },
    {
      "type": "conditional",
      "props": {
        "condition": "account-type === \"business\"",
        "children": [
          {
            "type": "input",
            "props": {
              "placeholder": "Company Name",
              "required": true
            }
          },
          {
            "type": "input",
            "props": {
              "placeholder": "Tax ID",
              "required": true
            }
          }
        ]
      }
    },
    {
      "type": "buttons",
      "props": {
        "options": [
          { "id": "create-account", "text": "Create Account", "value": "create" },
          { "id": "cancel", "text": "Cancel", "value": "cancel" }
        ]
      }
    }
  ]
}
```

---

## Notes & Best Practices

- Put all widget configuration in `props`.
- Use `children` to compose multiple widgets into a form.
- Prefer `form` when you want **one submission** that includes multiple fields.
- Use `buttons` inside `form` to trigger submission.

---

## See Also

- `docs/widget-system.md`
- `docs/composition-recipes.md`
- `docs/backend-integration-guide.md`
