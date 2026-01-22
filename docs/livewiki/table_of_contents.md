---
path: table_of_contents.md
page-type: overview
summary: Master index of all LiveWiki documentation pages with descriptions and links.
tags: [contents, index, navigation, overview]
created: 2026-01-22
updated: 2026-01-22
version: 1.3.0
---

# Table of Contents

Complete index of all ChatUI LiveWiki documentation pages with descriptions and quick navigation links.

## 📚 Core Documentation

### Getting Started
- **[Overview](overview.md)** - High-level introduction and strategic positioning of ChatUI
- **[Getting Started](getting_started.md)** - Step-by-step setup and integration guide
- **[Architecture](architecture.md)** - System architecture, design patterns, and technical decisions
- **[API Reference](api_reference.md)** - Complete API documentation with examples
- **[Data Flow](data_flow.md)** - How data moves through the ChatUI system
- **[Configuration](configuration.md)** - All configuration options and customization
- **[Development](development.md)** - Development workflow, testing, and contributing
- **[Troubleshooting](troubleshooting.md)** - Common issues, errors, and solutions
- **[Composition Recipes](composition-recipes.md)** - Practical examples and patterns for widget composition

## 🧩 Module Documentation

### Core Modules
- **[ChatWidget Class](modules/chat-widget-class.md)** - Main orchestrator class for the widget system
- **[API Module](modules/api.md)** - Transport-agnostic communication layer
- **[UI Module](modules/ui.md)** - DOM management, rendering, and user interactions
- **[Theme System](modules/theme.md)** - Dynamic theming and visual customization
- **[Utilities](modules/utils.md)** - Helper functions and common utilities

### Transport Modules
- **[CORS API](modules/api-cors.md)** - Modern fetch-based CORS transport implementation
- **[Legacy API](modules/api-legacy.md)** - JSONP transport for legacy server compatibility

### Widget System
- **[Widget Factory](modules/widget-factory.md)** - Widget creation and management system
- **[Base Widget](modules/base-widget.md)** - Abstract base class for all widget components

### Widget Components

#### Interactive Controls
- **[Interactive Menu System](modules/interactive-menu.md)** - Advanced menu system with color picker, position selector, and sound toggle

#### Input Widgets
- **[Input Widget](modules/input-widget.md)** - Interactive input with validation and submit functionality
- **[Textarea Widget](modules/textarea-widget.md)** - Multi-line text input component
- **[Password Widget](modules/password-widget.md)** - Secure password input with masking
- **[Text Widget](modules/text-widget.md)** - Static text display component

#### Selection Widgets
- **[Select Widget](modules/select-widget.md)** - Dropdown selection component
- **[Radio Widget](modules/radio-widget.md)** - Single selection radio button group
- **[Checkbox Widget](modules/checkbox-widget.md)** - Multiple selection checkbox group
- **[Toggle Widget](modules/toggle-widget.md)** - Binary on/off toggle switch

#### Interactive Widgets
- **[Rating Widget](modules/rating-widget.md)** - Star/emoji/heart rating component
- **[Date Widget](modules/date-widget.md)** - Date picker with validation and formatting
- **[Color Picker Widget](modules/color-picker-widget.md)** - Color selection tool
- **[Slider Widget](modules/slider-widget.md)** - Numeric range slider component
- **[Tags Widget](modules/tags-widget.md)** - Tag input and management system

#### Action Widgets
- **[Button Widget](modules/button-widget.md)** - Interactive button component
- **[Buttons Widget](modules/buttons-widget.md)** - Enhanced button group with variants
- **[Confirmation Widget](modules/confirmation-widget.md)** - Yes/No confirmation dialog
- **[File Upload Widget](modules/file-upload-widget.md)** - File upload with preview

#### Display & Layout Widgets
- **[Card Widget](modules/card-widget.md)** - Content display card component
- **[Progress Widget](modules/progress-widget.md)** - Progress indicator component
- **[Container Widget](modules/container-widget.md)** - Generic container for widget grouping
- **[List Widget](modules/list-widget.md)** - Dynamic list component for collections
- **[Conditional Widget](modules/conditional-widget.md)** - Dynamic content rendering

#### Core Widget System
- **[Base Widget](modules/base-widget.md)** - Abstract base class for all widget components
- **[Widget Factory](modules/widget-factory.md)** - Widget creation and management system
- **[Widget Types](modules/widget-types.md)** - Widget type definitions and registry

## 🤖 LLM & Developer Resources

### AI Optimization
- **[LLM Context](llm-context.md)** - Complete codebase summary optimized for LLM consumption
- **[Cheatsheet](cheatsheet.md)** - Quick reference guide for common operations
- **[Conventions](conventions.md)** - Coding standards and development conventions

## 📖 Quick Navigation

### By Topic

#### **Setup & Integration**
1. [Overview](overview.md) - Understand what ChatUI is
2. [Getting Started](getting_started.md) - Install and integrate
3. [Configuration](configuration.md) - Customize your widget
4. [API Reference](api_reference.md) - Learn the API

#### **Development**
1. [Architecture](architecture.md) - Understand the system design
2. [Development](development.md) - Set up development environment
3. [Conventions](conventions.md) - Follow coding standards
4. [Troubleshooting](troubleshooting.md) - Solve common problems

#### **Advanced Topics**
1. [Data Flow](data_flow.md) - Understand data movement
2. [Widget Factory](modules/widget-factory.md) - Create custom widgets
3. [Theme System](modules/theme.md) - Advanced theming
4. [LLM Context](llm-context.md) - AI development context

#### **Reference**
1. [Cheatsheet](cheatsheet.md) - Quick reference
2. [API Reference](api_reference.md) - Complete API docs
3. [Module Documentation](modules/) - All module details
4. [Table of Contents](table_of_contents.md) - This page

### By Audience

#### **For Beginners**
- [Overview](overview.md) - What is ChatUI?
- [Getting Started](getting_started.md) - Quick setup guide
- [Cheatsheet](cheatsheet.md) - Common operations
- [Troubleshooting](troubleshooting.md) - Get help with problems

#### **For Developers**
- [Architecture](architecture.md) - System design
- [Development](development.md) - Development workflow
- [API Reference](api_reference.md) - Complete API
- [Conventions](conventions.md) - Coding standards

#### **For Designers**
- [Theme System](modules/theme.md) - Visual customization
- [Configuration](configuration.md) - Styling options
- [UI Module](modules/ui.md) - UI components
- [Widget Components](modules/) - Interactive elements

#### **For AI/LLM**
- [LLM Context](llm-context.md) - Complete context
- [Architecture](architecture.md) - System understanding
- [API Reference](api_reference.md) - Interface knowledge
- [Data Flow](data_flow.md) - Data movement patterns

## 🔍 Search Guide

### Looking For Something Specific?

#### **How to integrate ChatUI?**
→ [Getting Started](getting_started.md)

#### **How to customize appearance?**
→ [Theme System](modules/theme.md) or [Configuration](configuration.md)

#### **How to create custom widgets?**
→ [Widget Factory](modules/widget-factory.md) and [Base Widget](modules/base-widget.md)

#### **How to handle server communication?**
→ [API Module](modules/api.md) and [Data Flow](data_flow.md)

#### **How to debug problems?**
→ [Troubleshooting](troubleshooting.md)

#### **How to contribute?**
→ [Development](development.md) and [Conventions](conventions.md)

#### **Quick syntax reference?**
→ [Cheatsheet](cheatsheet.md)

#### **Complete system overview?**
→ [LLM Context](llm-context.md)

## 📋 Document Categories

### **📖 Learning Materials**
- Tutorials and guides for getting started
- Step-by-step integration instructions
- Best practices and patterns

### **🔧 Technical Documentation**
- API reference and method documentation
- Architecture and design explanations
- Module and component documentation

### **🎨 Customization Guides**
- Theme system documentation
- Configuration options
- Styling and appearance customization

### **🐛 Problem Solving**
- Troubleshooting common issues
- Error handling and debugging
- FAQ and solutions

### **🤖 AI Resources**
- LLM-optimized documentation
- Complete system context
- Development patterns for AI

## 🗂️ Document Metadata

### **Page Types**
- **overview** - High-level introductions and summaries
- **tutorial** - Step-by-step guides and instructions
- **reference** - Complete API and technical documentation
- **module** - Specific module and component documentation

### **Tags**
- **getting-started** - Beginner-friendly content
- **advanced** - Complex topics and features
- **api** - API documentation and references
- **widgets** - Widget component documentation
- **development** - Development and contribution guides
- **llm** - AI and LLM-focused content

### **Version Information**
All documents are versioned with the ChatUI release version:
- Current version: **1.2.0**
- Last updated: **2026-01-22**
- Format version: **LiveWiki v1.0**

## 🚀 Quick Start Paths

### **30-Second Integration**
1. [Getting Started](getting_started.md) - Copy the HTML snippet
2. [Configuration](configuration.md) - Set your server URL
3. [API Reference](api_reference.md) - Learn basic methods

### **Custom Widget Development**
1. [Base Widget](modules/base-widget.md) - Understand the base class
2. [Widget Factory](modules/widget-factory.md) - Learn factory pattern
3. [Development](development.md) - Set up development environment
4. [Conventions](conventions.md) - Follow coding standards

### **Theme Customization**
1. [Theme System](modules/theme.md) - Understand theming
2. [Configuration](configuration.md) - Set theme options
3. [UI Module](modules/ui.md) - Understand UI structure
4. [Cheatsheet](cheatsheet.md) - Quick CSS reference

### **Server Integration**
1. [API Reference](api_reference.md) - Server API requirements
2. [Data Flow](data_flow.md) - Understand communication
3. [Architecture](architecture.md) - System design
4. [Troubleshooting](troubleshooting.md) - Solve connection issues

## 📊 Documentation Statistics

- **Total Pages**: 45+
- **Core Documentation**: 9 pages
- **Module Documentation**: 30+ pages
- **Widget Components**: 26+ widgets
- **LLM Resources**: 3 pages
- **Reference Materials**: 5 pages

### **Most Referenced Pages**
1. [Getting Started](getting_started.md) - Integration guide
2. [API Reference](api_reference.md) - Complete API
3. [Configuration](configuration.md) - Customization options
4. [Widget Factory](modules/widget-factory.md) - Widget creation
5. [Cheatsheet](cheatsheet.md) - Quick reference
6. [Troubleshooting](troubleshooting.md) - Problem solving

## 🔗 External Links

### **Related Resources**
- [ChatUI GitHub Repository](https://github.com/lesichkovm/chatui) - Source code and issues
- [Live Demo](https://chatui-demo.example.com) - Interactive demo
- [Playwright Documentation](https://playwright.dev) - Testing framework
- [Docsify Documentation](https://docsify.js.org) - Documentation generator

### **Community**
- [Discussions](https://github.com/lesichkovm/chatui/discussions) - Community discussions
- [Issues](https://github.com/lesichkovm/chatui/issues) - Bug reports and feature requests
- [Wiki](https://github.com/lesichkovm/chatui/wiki) - Additional documentation

---

**Tip**: Use the sidebar navigation for quick access to any page, or use your browser's search function (Ctrl+F) to find specific topics within this documentation.

**Last Updated**: 2026-01-22  
**Version**: 1.2.0  
**Format**: LiveWiki v1.0
