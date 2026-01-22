---
path: composition-recipes.md
page-type: tutorial
summary: Practical examples and patterns for composing widgets using the ChatUI widget system.
tags: [tutorial, composition, patterns, widgets, examples]
created: 2026-01-22
updated: 2026-01-22
version: 2.0.0
---

# Composition Recipes

This guide provides practical examples and patterns for composing widgets using the **current composable widget schema**. Every widget is defined by `type`, configured via `props`, and nested using `children`.

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    { "type": "text", "props": { "content": "Hello", "format": "plain" } }
  ]
}
```

> **Important:** Put all widget configuration inside `props`. Use `children` only for widgets that compose other widgets (e.g., `container`, `card`, `form`, `conditional`, `list` templates).

---

## Table of Contents

1. [Basic Composition](#basic-composition)
2. [Conditional Logic](#conditional-logic)
3. [Dynamic Lists](#dynamic-lists)
4. [Form Patterns](#form-patterns)
5. [Data Display](#data-display)
6. [Interactive Workflows](#interactive-workflows)
7. [Responsive Layouts](#responsive-layouts)

---

## Basic Composition

### Container with Text + Buttons

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    {
      "type": "text",
      "props": {
        "content": "Welcome to our application!",
        "format": "plain"
      }
    },
    {
      "type": "buttons",
      "props": {
        "options": [
          { "id": "start", "text": "Get Started", "value": "start" },
          { "id": "learn", "text": "Learn More", "value": "learn" }
        ]
      }
    }
  ]
}
```

### Card with Nested Widgets

```json
{
  "type": "card",
  "props": { "variant": "default", "padding": "medium" },
  "children": [
    {
      "type": "text",
      "props": { "content": "**User Profile**", "format": "markdown" }
    },
    {
      "type": "container",
      "props": { "layout": "vertical", "gap": "small" },
      "children": [
        {
          "type": "input",
          "props": {
            "placeholder": "Enter your name",
            "showSubmitButton": true,
            "buttonText": "Save"
          }
        },
        {
          "type": "textarea",
          "props": {
            "placeholder": "Enter your bio",
            "showSubmitButton": true,
            "buttonText": "Update Bio"
          }
        }
      ]
    }
  ]
}
```

---

## Conditional Logic

### Show/Hide Based on Input

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    {
      "type": "input",
      "props": {
        "placeholder": "Enter \"admin\" to see advanced options",
        "showSubmitButton": true,
        "buttonText": "Submit"
      }
    },
    {
      "type": "conditional",
      "props": {
        "condition": "showIf:value",
        "children": [
          {
            "type": "text",
            "props": {
              "content": "**Admin Panel**\\nAdvanced settings available",
              "format": "markdown"
            }
          },
          {
            "type": "toggle",
            "props": { "label": "Enable debug mode" }
          }
        ],
        "fallback": {
          "type": "text",
          "props": { "content": "_Admin access required_", "format": "markdown" }
        }
      }
    }
  ]
}
```

### Complex Conditions

```json
{
  "type": "conditional",
  "props": {
    "condition": {
      "operator": "and",
      "conditions": [
        "showIf:userRole",
        { "operator": "greaterThan", "key": "userLevel", "value": 5 }
      ]
    },
    "children": [
      {
        "type": "text",
        "props": { "content": "Premium features unlocked!", "format": "plain" }
      }
    ]
  }
}
```

---

## Dynamic Lists

### Simple Task List

```json
{
  "type": "list",
  "props": {
    "header": "Task List",
    "layout": "vertical",
    "selectable": true,
    "items": [
      { "id": 1, "title": "Complete project", "status": "pending" },
      { "id": 2, "title": "Review code", "status": "in-progress" },
      { "id": 3, "title": "Deploy to production", "status": "completed" }
    ],
    "itemTemplate": {
      "type": "text",
      "props": { "content": "{{title}} - {{status}}", "format": "plain" }
    },
    "actions": [
      { "text": "Complete Selected", "variant": "primary", "action": "complete" }
    ]
  }
}
```

### Card Grid List

```json
{
  "type": "list",
  "props": {
    "header": "Product Catalog",
    "layout": "grid",
    "selectable": true,
    "multiSelect": true,
    "items": [
      { "id": 1, "name": "Widget Pro", "price": "$99", "description": "Advanced widget tool" },
      { "id": 2, "name": "Widget Lite", "price": "$49", "description": "Basic widget tool" },
      { "id": 3, "name": "Widget Enterprise", "price": "$299", "description": "Full-featured solution" }
    ],
    "itemTemplate": {
      "type": "card",
      "props": {
        "title": "{{name}}",
        "subtitle": "{{price}}",
        "description": "{{description}}"
      }
    },
    "actions": [
      { "text": "Add to Cart", "variant": "primary", "action": "addToCart" },
      { "text": "Compare", "variant": "secondary", "action": "compare" }
    ]
  }
}
```

---

## Form Patterns

### Contact Form (Form Widget)

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    {
      "type": "input",
      "props": { "placeholder": "Enter your name", "required": true }
    },
    {
      "type": "input",
      "props": { "type": "email", "placeholder": "Enter your email", "required": true }
    },
    {
      "type": "textarea",
      "props": { "placeholder": "Enter your message", "rows": 4, "required": true }
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

### Horizontal Grouping Inside a Form

```json
{
  "type": "form",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    {
      "type": "container",
      "props": { "layout": "horizontal", "gap": "medium" },
      "children": [
        { "type": "input", "props": { "placeholder": "First Name", "required": true } },
        { "type": "input", "props": { "placeholder": "Last Name", "required": true } }
      ]
    },
    {
      "type": "buttons",
      "props": { "options": [{ "id": "continue", "text": "Continue", "value": "continue" }] }
    }
  ]
}
```

---

## Data Display

### Summary Card with Progress

```json
{
  "type": "card",
  "props": { "variant": "default", "padding": "medium" },
  "children": [
    { "type": "text", "props": { "content": "Onboarding Progress", "format": "plain" } },
    { "type": "progress", "props": { "value": 60, "max": 100, "showPercentage": true } },
    { "type": "text", "props": { "content": "Step 3 of 5 completed", "format": "plain" } }
  ]
}
```

---

## Interactive Workflows

### Rating + Follow‑up Feedback

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "medium" },
  "children": [
    {
      "type": "rating",
      "props": {
        "label": "How satisfied are you?",
        "maxRating": 5,
        "showSubmitButton": true
      }
    },
    {
      "type": "conditional",
      "props": {
        "condition": { "operator": "lessThan", "key": "rating", "value": 4 },
        "children": [
          {
            "type": "textarea",
            "props": { "placeholder": "What could we improve?", "rows": 3, "showSubmitButton": true }
          }
        ]
      }
    }
  ]
}
```

### Multi‑Step Wizard (Step 1)

```json
{
  "type": "container",
  "props": { "layout": "vertical", "gap": "large" },
  "children": [
    { "type": "text", "props": { "content": "## Step 1: Basics", "format": "markdown" } },
    { "type": "input", "props": { "placeholder": "Product Name", "required": true } },
    {
      "type": "select",
      "props": {
        "placeholder": "Product Category",
        "options": [
          { "id": "electronics", "text": "Electronics", "value": "electronics" },
          { "id": "books", "text": "Books", "value": "books" },
          { "id": "home", "text": "Home & Garden", "value": "home" }
        ]
      }
    },
    { "type": "buttons", "props": { "options": [{ "id": "next", "text": "Next Step →", "value": "next" }] } }
  ]
}
```

---

## Responsive Layouts

### Two‑Column Grid

```json
{
  "type": "card",
  "props": { "padding": "medium" },
  "children": [
    {
      "type": "container",
      "props": { "layout": "grid", "columns": 2, "gap": "medium" },
      "children": [
        { "type": "input", "props": { "placeholder": "City" } },
        { "type": "input", "props": { "placeholder": "Postal Code" } },
        {
          "type": "select",
          "props": {
            "placeholder": "Country",
            "options": [
              { "id": "us", "text": "United States", "value": "US" },
              { "id": "uk", "text": "United Kingdom", "value": "UK" }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Notes & Best Practices

- Put all configuration in `props` (not in the root of the widget object).
- Use `children` for composition with container-like widgets.
- Prefer `form` when multiple inputs should submit together.
- Include `buttons` inside a form to trigger submission.
- Prefer the **composable `widgets` array** in backend responses.

---

## See Also

- `docs/widget-system.md`
- `docs/form-composition-examples.md`
- `docs/backend-integration-guide.md`
