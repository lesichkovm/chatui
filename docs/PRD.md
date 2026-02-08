# ChatUI Widget - Product Requirements Document (PRD)

**Version**: 1.0.0
**Date**: 2026-02-08
**Status**: Living Document
**Owner**: ChatUI Team

---

## 1. Executive Summary

ChatUI is a professional, ultra-lightweight, API-agnostic chat UI widget built with pure Vanilla JavaScript. It enables any website to embed a fully interactive conversational interface via a single `<script>` tag or programmatic API call, with zero external dependencies and no framework lock-in.

The product targets SMBs, enterprise legacy systems, and SaaS platforms that need a modern chat experience without adopting heavy frontend frameworks. ChatUI differentiates through its ~12KB core footprint, hybrid transport layer (WebSocket/CORS/JSONP), composable widget system, and sub-60-second integration time.

---

## 2. Product Vision

**Vision Statement**: Be the fastest, lightest, and most universally compatible embeddable chat widget on the market - enabling any website to add rich conversational experiences in under 60 seconds.

**Core Principles**:
- **Zero dependencies** - No React, Vue, jQuery, or any external library
- **API-agnostic** - Works with any backend, any protocol
- **Performance-first** - Maintain <15KB compressed core
- **Universal compatibility** - Works on any website regardless of tech stack
- **Progressive enhancement** - Graceful degradation across browsers and network conditions

---

## 3. Target Users

### 3.1 Small to Medium Businesses (SMBs)
- Limited development resources
- Need quick implementation without dedicated frontend teams
- Budget-conscious, prefer lightweight solutions over enterprise SaaS (Intercom, Zendesk)

### 3.2 Enterprise with Legacy Systems
- Cannot adopt modern frameworks easily
- Require custom backend integration and on-premises deployment
- Need security, compliance, and JSONP support for restricted environments

### 3.3 SaaS Platforms & Developer Tools
- API service providers needing a white-label chat frontend
- Development agencies building client solutions
- Open-source projects requiring embeddable chat

---

## 4. Product Architecture

### 4.1 High-Level Architecture

```
chatui/
├── src/
│   ├── entry.js                          # Global API + auto-init
│   ├── config/                           # Configuration defaults
│   ├── modules/
│   │   ├── chat-widget.class.js          # Main orchestrator (28KB)
│   │   ├── api.js                        # Hybrid transport layer (24KB)
│   │   ├── api-cors.js                   # CORS-specific transport (12KB)
│   │   ├── api-legacy.js                 # Legacy JSONP transport (10KB)
│   │   ├── ui.js                         # DOM rendering + styles (40KB)
│   │   ├── theme.js                      # Theme system (6KB)
│   │   ├── utils.js                      # Shared utilities
│   │   └── widgets/                      # Composable widget system
│   │       ├── base-widget.js            # Abstract base class
│   │       ├── widget-factory.js         # Widget registry + creation
│   │       ├── widget-types.js           # Type constants
│   │       └── [26 widget implementations]
│   └── utils/                            # Additional utilities
├── dist/                                 # Build output
│   ├── chat-widget.js                    # Unminified bundle
│   └── chat-widget.min.js               # Minified bundle
├── demo/                                 # Demo server + examples
├── tests/                                # Playwright E2E tests (54 files)
└── docs/                                 # Documentation
```

### 4.2 Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `entry.js` | Global `ChatUI` API, auto-initialization from script tags, MutationObserver for dynamic scripts |
| `chat-widget.class.js` | Main orchestrator: lifecycle, config parsing, coordination between API/UI/Theme |
| `api.js` | Hybrid transport: protocol detection, WebSocket management, CORS/JSONP routing |
| `api-cors.js` | CORS (fetch) transport with automatic JSONP fallback |
| `api-legacy.js` | JSONP transport for legacy/restricted environments |
| `ui.js` | DOM rendering, message display, input handling, scoped CSS injection |
| `theme.js` | Theme resolution, CSS variable application, localStorage persistence |
| `widgets/` | Composable widget tree: factory pattern, base class, 26 widget types |

### 4.3 Build System

- **Bundler**: esbuild
- **Format**: IIFE (browser-ready)
- **Outputs**: `dist/chat-widget.js` (unminified), `dist/chat-widget.min.js` (minified)
- **Additional**: Copies to `netlify/dist/` for hosted demo site

---

## 5. Functional Requirements

### 5.1 Initialization (FR-INIT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-INIT-01 | Widget initializes via `<script>` tag with `data-*` attributes | P0 |
| FR-INIT-02 | Widget initializes programmatically via `ChatUI.init(config)` | P0 |
| FR-INIT-03 | Auto-detect and initialize all `<script id="chat-widget*">` on DOMContentLoaded | P0 |
| FR-INIT-04 | Detect dynamically added script tags via MutationObserver | P1 |
| FR-INIT-05 | Support multiple independent widget instances on a single page | P1 |
| FR-INIT-06 | Legacy `window.createChatWidget()` factory function | P2 |

### 5.2 Display Modes (FR-DISPLAY)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DISPLAY-01 | **Popup mode**: Floating chat button in a configurable corner (bottom-right, bottom-left, top-right, top-left) | P0 |
| FR-DISPLAY-02 | **Fullpage mode**: Embedded in a target container via CSS selector | P0 |
| FR-DISPLAY-03 | Popup opens/closes on button click with `chat.open()` / `chat.close()` API | P0 |
| FR-DISPLAY-04 | Configurable header title | P1 |

### 5.3 Transport Layer (FR-TRANSPORT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TRANSPORT-01 | Automatic protocol detection from `serverUrl` (`ws://`/`wss://` vs `http://`/`https://`) | P0 |
| FR-TRANSPORT-02 | **WebSocket**: Full-duplex communication with handshake, connect, message, typing, and read_receipt events | P0 |
| FR-TRANSPORT-03 | **CORS (fetch)**: POST-based communication to `/api/handshake` and `/api/messages` | P0 |
| FR-TRANSPORT-04 | **JSONP fallback**: Automatic fallback when CORS fails; randomized callback names | P0 |
| FR-TRANSPORT-05 | Session management via `session_key` across all transports | P0 |
| FR-TRANSPORT-06 | WebSocket streaming support (`message:stream` type) | P1 |
| FR-TRANSPORT-07 | Typing indicators over WebSocket | P1 |
| FR-TRANSPORT-08 | Read receipts over WebSocket | P2 |

### 5.4 Message System (FR-MSG)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-MSG-01 | Render plain text messages from user and bot | P0 |
| FR-MSG-02 | Support **composable widget format**: `{ widgets: [...] }` with nested widget trees | P0 |
| FR-MSG-03 | Support **legacy format**: `{ text, sender, widget }` with single widget | P0 |
| FR-MSG-04 | Display waiting indicator (animated dots) during message sending | P1 |
| FR-MSG-05 | Auto-scroll to latest message | P1 |
| FR-MSG-06 | Auto-resizing textarea input | P1 |

### 5.5 Widget System (FR-WIDGET)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-WIDGET-01 | Recursive widget tree rendering via `WidgetFactory` | P0 |
| FR-WIDGET-02 | `BaseWidget` abstract class with `createElement()`, `validate()`, `handleInteraction()`, `emitValueChange()` | P0 |
| FR-WIDGET-03 | Emit `widgetInteraction` DOM event on user actions | P0 |
| FR-WIDGET-04 | Emit `widgetValueChanged` DOM event for form coordination | P0 |
| FR-WIDGET-05 | Extensible: register custom widgets via `WidgetFactory.registerWidget()` | P1 |

#### Supported Widget Types (26 types)

| Category | Widgets |
|----------|---------|
| **Content & Layout** | `text`, `container`, `card`, `row`, `column`, `image`*, `icon`* |
| **Actions** | `button`, `buttons`, `confirmation` |
| **Inputs** | `input`, `password`, `textarea` |
| **Selection** | `select`, `radio`, `checkbox`, `toggle` |
| **Interactive** | `rating`, `slider`, `date`, `tags`, `color_picker` |
| **Data & Advanced** | `file_upload`, `progress`, `list`, `conditional`, `form` |

*\* `image` and `icon` are placeholders that map to container behavior.*

### 5.6 Theme System (FR-THEME)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-THEME-01 | Two built-in themes: `default` and `branded` | P0 |
| FR-THEME-02 | Two modes per theme: `light` and `dark` | P0 |
| FR-THEME-03 | Configuration via `data-theme` and `data-theme-mode` attributes | P0 |
| FR-THEME-04 | Mode-specific color overrides via `data-color-light`, `data-bg-color-dark`, etc. | P1 |
| FR-THEME-05 | CSS variable overrides (`--chat-primary`, `--chat-bg`, `--chat-surface`, `--chat-text`, `--chat-border`) | P1 |
| FR-THEME-06 | Runtime switching via `setTheme()`, `setThemeMode()`, `toggleThemeMode()` | P1 |
| FR-THEME-07 | Inspect current config via `getThemeConfig()` | P1 |
| FR-THEME-08 | Persist theme/mode to `localStorage` per widget ID | P2 |
| FR-THEME-09 | Respect `prefers-color-scheme` system preference when no explicit mode is set | P2 |
| FR-THEME-10 | Legacy `data-mode` and `data-color` attribute support | P2 |

#### Theme Color Palettes

| Token | Default Light | Default Dark | Branded Light | Branded Dark |
|-------|--------------|-------------|---------------|-------------|
| Primary | `#007bff` | `#4dabf7` | `#6366f1` | `#818cf8` |
| Background | `#ffffff` | `#1a1a1a` | `#ffffff` | `#0f172a` |
| Surface | `#f8f9fa` | `#2d2d2d` | `#f5f3ff` | `#1e293b` |
| Text | `#212529` | `#ffffff` | `#1e1b4b` | `#f1f5f9` |
| Border | `#e9ecef` | `#404040` | `#e0e7ff` | `#334155` |

### 5.7 Events (FR-EVENT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EVENT-01 | `widgetInteraction` - Dispatched on widget user actions (button clicks, form submits, etc.) | P0 |
| FR-EVENT-02 | `widgetValueChanged` - Dispatched on input value changes for form coordination | P0 |
| FR-EVENT-03 | `chatwidget:error` - Global error event | P1 |
| FR-EVENT-04 | `chatwidget:typing` - WebSocket typing indicator event | P2 |
| FR-EVENT-05 | `chatwidget:read_receipt` - WebSocket read receipt event | P2 |

---

## 6. Non-Functional Requirements

### 6.1 Performance (NFR-PERF)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-01 | Core bundle size (compressed) | <15KB |
| NFR-PERF-02 | Full bundle with all widgets (minified) | ~70KB |
| NFR-PERF-03 | Page load impact | <100ms |
| NFR-PERF-04 | Theme switching latency | <50ms |
| NFR-PERF-05 | Google Lighthouse score | 95+ |

### 6.2 Compatibility (NFR-COMPAT)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-COMPAT-01 | Browser market share coverage | 95%+ |
| NFR-COMPAT-02 | Mobile browser support | Full |
| NFR-COMPAT-03 | Works alongside any frontend framework | Yes |
| NFR-COMPAT-04 | No global namespace pollution (beyond `ChatUI` and `createChatWidget`) | Yes |

### 6.3 Security (NFR-SEC)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SEC-01 | XSS prevention via input sanitization | All user inputs |
| NFR-SEC-02 | Widget data validation before rendering | All widget types |
| NFR-SEC-03 | JSONP callback randomization and validation | All JSONP requests |
| NFR-SEC-04 | CORS requests use `Content-Type: application/json` | All CORS requests |
| NFR-SEC-05 | CSP (Content Security Policy) compatibility | Target |
| NFR-SEC-06 | Scoped CSS to prevent style leakage | All styles |

### 6.4 Accessibility (NFR-A11Y)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-A11Y-01 | WCAG 2.2 Level AA compliance | Target |
| NFR-A11Y-02 | Minimum touch target size | 24px |
| NFR-A11Y-03 | Focus trapping in popup mode | Yes |
| NFR-A11Y-04 | Keyboard navigable widgets | All interactive widgets |

### 6.5 Quality (NFR-QA)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-QA-01 | E2E test coverage (Playwright) | 54 test files |
| NFR-QA-02 | Every widget type has dedicated test spec | Yes |
| NFR-QA-03 | Transport layer tests (CORS, JSONP, WebSocket) | Yes |
| NFR-QA-04 | Theme system tests | Yes |
| NFR-QA-05 | Bug resolution time (critical) | <48 hours |

---

## 7. API Specification

### 7.1 JavaScript API

```javascript
// Initialize
const widget = ChatUI.init({
  id: "support-chat",
  displayMode: "popup",           // "popup" | "fullpage"
  position: "bottom-right",       // "bottom-right" | "bottom-left" | "top-right" | "top-left"
  title: "Chat with us",
  primaryColor: "#007bff",
  targetSelector: "#chat-container", // fullpage mode only
  serverUrl: "https://your-server.com"
});

// Lifecycle
widget.open();
widget.close();

// Theme
widget.setTheme("branded");       // "default" | "branded"
widget.setThemeMode("dark");      // "light" | "dark"
widget.toggleThemeMode();
widget.getThemeConfig();           // returns { theme, mode, colors }
```

### 7.2 HTML Data Attributes

| Attribute | Maps To | Default |
|-----------|---------|---------|
| `data-server-url` | `serverUrl` | `http://localhost:3000` |
| `data-display` | `displayMode` | `popup` |
| `data-position` | `position` | `bottom-right` |
| `data-title` | `title` | `Chat with us` |
| `data-color` | `primaryColor` | `#007bff` |
| `data-target` | `targetSelector` | `null` |
| `data-theme` | theme name | `default` |
| `data-theme-mode` | theme mode | `light` |

### 7.3 Backend Protocol

| Transport | Handshake | Messages | Fallback |
|-----------|-----------|----------|----------|
| **WebSocket** | JSON `{ type: "handshake" }` | JSON `{ type: "message", payload }` | N/A |
| **CORS** | `POST /api/handshake` | `POST /api/messages` | JSONP |
| **JSONP** | `GET /api/handshake?callback=cb` | `GET /api/messages?callback=cb&message=...` | N/A |

---

## 8. Current State (Completed Features)

| Feature | Status | Notes |
|---------|--------|-------|
| Modular ES6 architecture | Done | Class-based with decoupled UI/API/Widget layers |
| 26 composable widget types | Done | Full widget tree with recursive rendering |
| Hybrid transport (WS/CORS/JSONP) | Done | Automatic protocol detection and fallback |
| Popup + Fullpage display modes | Done | Configurable via data attributes or API |
| Theme system (light/dark, default/branded) | Done | CSS variables, runtime switching, localStorage persistence |
| WebSocket real-time features | Done | Typing indicators, read receipts, streaming |
| E2E test suite | Done | 54 Playwright test files |
| Waiting message indicators | Done | Animated dots during message sending |
| Auto-resizing textarea | Done | Dynamic height adjustment |
| XSS prevention and sanitization | Done | Input sanitization, widget data validation |
| Demo server and documentation site | Done | Netlify-hosted at chatui.lesichkov.co.uk |

---

## 9. Roadmap

### Phase 1: AI Readiness (0-3 months)

| Feature | Priority | Effort | Description |
|---------|----------|--------|-------------|
| Streaming response UI | High | 20h | Character-by-character rendering for LLM responses |
| Reasoning/thought blocks | High | 10h | Collapsible sections for chain-of-thought display |

### Phase 2: Ecosystem & Enterprise (4-6 months)

| Feature | Priority | Effort | Description |
|---------|----------|--------|-------------|
| Plugin architecture | High | 60h | Hook-based system for custom widgets and integrations |
| Rich content (Markdown, media) | Medium | 30h | Native Markdown parsing, image carousels, video previews |

### Future Phases

| Feature | Priority | Effort | Description |
|---------|----------|--------|-------------|
| Framework wrappers | Medium | 40h each | `@chatui/react`, `@chatui/vue`, `@chatui/svelte` |
| Analytics dashboard | Medium | 80h | Usage metrics, performance monitoring, business intelligence |
| Internationalization (i18n) | Medium | 20h | Multi-language support, RTL, locale-aware formatting |
| Modular bundling | Medium | 20h | Tree-shaking for selective widget inclusion |

---

## 10. Success Metrics

### Technical KPIs

| Metric | Target |
|--------|--------|
| Core bundle size (compressed) | <15KB |
| Full bundle (minified) | <80KB |
| Page load impact | <100ms |
| Browser compatibility | 95%+ market share |
| WebSocket connection success rate | 98%+ |
| Lighthouse score | 95+ |

### Business KPIs

| Metric | Target |
|--------|--------|
| Integration time | <60 seconds (basic), <5 minutes (custom) |
| Adoption | 1,000+ implementations in first 6 months |
| Enterprise customers | 50+ with analytics features |
| Community plugins | 20+ by month 6 |
| Developer satisfaction | 4.5/5 |

### Quality KPIs

| Metric | Target |
|--------|--------|
| Documentation coverage | 90%+ |
| E2E test coverage | Every widget type + transport + theme |
| Bug resolution (critical) | <48 hours |
| Release frequency | Bi-weekly |

---

## 11. Monetization Strategy

| Tier | Offering | Price |
|------|----------|-------|
| **Free / Open Source** | Core widget, all widget types, all transports, themes | Free |
| **SaaS Analytics** | Usage insights, dashboards, performance monitoring | $49/month |
| **Plugin Marketplace** | Premium third-party plugins (30% revenue share) | Variable |
| **Enterprise** | Custom integrations, dedicated infrastructure, SLA guarantees | $5,000+/year |

---

## 12. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Bundle size bloat from new features | High | Medium | Code splitting, tree shaking, size budgets |
| Performance regression | High | Low | Automated Lighthouse CI, performance benchmarks |
| Browser compatibility breakage | Medium | Low | Comprehensive Playwright test matrix |
| Security vulnerabilities (XSS, injection) | High | Low | Regular audits, CSP compliance, sanitization |
| Competitive pressure (Intercom, Alibaba ChatUI) | Medium | High | Focus on performance, simplicity, and zero-dependency differentiator |
| Framework ecosystem demand | Medium | High | Planned wrapper packages without bloating core |

---

## 13. Glossary

| Term | Definition |
|------|-----------|
| **CORS** | Cross-Origin Resource Sharing - browser mechanism for secure cross-domain HTTP requests |
| **JSONP** | JSON with Padding - legacy technique for cross-domain requests via `<script>` tags |
| **Widget Tree** | Recursive JSON structure where widgets can contain child widgets |
| **Composable Format** | Preferred message format using `{ widgets: [...] }` array for nested layouts |
| **Legacy Format** | Original message format using `{ text, sender, widget }` for single-widget messages |
| **Transport** | Communication protocol layer (WebSocket, CORS fetch, or JSONP) |
| **Theme Mode** | Light or dark visual appearance |
| **Widget Factory** | Registry pattern that maps widget type strings to widget class constructors |

---

## 14. References

- [Project Website](https://chatui.lesichkov.co.uk/)
- `docs/overview.md` - Architectural overview
- `docs/widget-system.md` - Widget system reference
- `docs/theme-system.md` - Theme system reference
- `docs/backend-integration-guide.md` - Backend protocol specification
- `docs/composition-recipes.md` - Widget composition examples
- `docs/form-composition-examples.md` - Form widget patterns
- `docs/product-update-proposal.md` - Strategic modernization proposal
- `docs/future-update-proposals.md` - Future feature proposals
- `docs/swot-analysis-alibaba-chatui.md` - Competitive analysis
