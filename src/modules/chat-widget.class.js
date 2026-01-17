import { HybridChatAPI } from './hybrid-api.js';
import { injectStyles, createWidgetDOM, appendMessage } from './ui.js';
import { ThemeManager } from './theme.js';
import { adjustColor } from './utils.js';

/**
 * Main ChatWidget class that orchestrates the entire chat interface
 * Handles initialization, UI rendering, message management, and user interactions
 */
export class ChatWidget {
  /**
   * Create a new ChatWidget instance
   * @param {HTMLElement|Object} input - Script element or configuration object
   * @param {Object} [input.config] - Configuration if input is an object
   * @param {string} [input.config.id] - Widget ID
   * @param {string} [input.config.displayMode] - Display mode ('popup' or 'fullpage')
   * @param {string} [input.config.position] - Position for popup mode
   * @param {string} [input.config.primaryColor] - Primary color for the widget
   * @param {string} [input.config.title] - Widget title
   * @param {string} [input.config.targetSelector] - Target element selector for fullpage mode
   * @param {string} [input.config.serverUrl] - Server URL for chat API
   */
  constructor(input) {
    let config = {};
    let scriptElement = null;

    if (input instanceof HTMLElement && input.tagName === "SCRIPT") {
      scriptElement = input;
      if (scriptElement._chatWidgetInitialized) return;
      scriptElement._chatWidgetInitialized = true;

      const displayMode = scriptElement.getAttribute("data-display") || null;

      config = {
        id: scriptElement.id,
        displayMode: displayMode,
        position: scriptElement.getAttribute("data-position"),
        primaryColor: scriptElement.getAttribute("data-color"),
        title: scriptElement.getAttribute("data-title"),
        targetSelector: scriptElement.getAttribute("data-target"),
        serverUrl: scriptElement.getAttribute("data-server-url"),
        forceJsonP: scriptElement.getAttribute("data-force-jsonp") === "true",
        preferJsonP: scriptElement.getAttribute("data-prefer-jsonp") === "true",
      };
    } else {
      config = input || {};
    }

    this.scriptElement = scriptElement;
    this.widgetId =
      config.id || "chat-widget-" + Math.random().toString(36).substr(2, 9);

    // Capture explicit color from config (programmatic)
    const explicitColor = config.primaryColor || config.color;

    // Initialize theme manager
    this.themeManager = new ThemeManager(this.widgetId, scriptElement);
    const themeConfig = this.themeManager.getThemeConfig();

    this.config = {
      displayMode: config.displayMode || config.mode || "popup",
      position: config.position || "bottom-right",
      primaryColor: explicitColor || themeConfig.colors.primary,
      explicitColor: explicitColor, // Store this to know if we should force it as inline style
      title: config.title || "Chat with us",
      targetSelector: config.targetSelector || config.target || null,
      serverUrl: config.serverUrl || "http://localhost:3000",
      theme: themeConfig.theme,
      themeMode: themeConfig.mode,
      themeColors: themeConfig.colors,
    };

    this.api = new HybridChatAPI({ serverUrl: this.config.serverUrl });

    // State initialization
    this.state = {
      isOpen: false,
      messages: [],
    };

    this.init();

    // Store instance on script element for external access
    if (this.scriptElement) {
      this.scriptElement._chatWidgetInstance = this;
    }
  }

  /**
   * Initialize the widget
   * @private
   */
  init() {
    injectStyles(this.widgetId, this.config);
    const { container, chatWindow, chatButton } = createWidgetDOM(
      this.widgetId,
      this.config
    );

    this.container = container;
    this.chatWindow = chatWindow;
    this.chatButton = chatButton;

    // Set theme data attributes
    this.container.setAttribute('data-theme', this.config.theme);
    this.container.setAttribute('data-mode', this.config.themeMode);

    // Apply custom colors from data attributes if present
    this.applyCustomColors();

    // Get elements
    this.messagesContainer = this.chatWindow.querySelector(".messages");
    this.textarea = this.chatWindow.querySelector(".textarea");
    this.sendButton = this.chatWindow.querySelector(".send");
    this.closeButton = this.chatWindow.querySelector(".close");

    this.bindEvents();
    this.api.performHandshake();
    this.api.connect((text, sender, widgetData) => this.addMessage(text, sender, widgetData));

    // Listen for widget interactions
    document.addEventListener("widgetInteraction", (event) => {
      if (event.detail.widgetId === this.widgetId) {
        this.handleWidgetInteraction(event.detail);
      }
    });

    // Watch for system theme changes
    this.themeManager.watchSystemTheme((newMode) => {
      this.setThemeMode(newMode);
    });
  }

  /**
   * Apply custom colors from data attributes via inline styles
   */
  applyCustomColors() {
    if (this.scriptElement) {
      const mode = this.config.themeMode;
      const suffix = mode === 'light' ? '-light' : '-dark';

      const colorMap = {
        [`data-color${suffix}`]: '--chat-primary',
        [`data-bg-color${suffix}`]: '--chat-bg',
        [`data-surface-color${suffix}`]: '--chat-surface',
        [`data-text-color${suffix}`]: '--chat-text',
        [`data-border-color${suffix}`]: '--chat-border',
      };

      // Also check for generic attributes without mode suffix (fallback)
      const genericColorMap = {
        'data-color': '--chat-primary',
        'data-bg-color': '--chat-bg',
        'data-surface-color': '--chat-surface',
        'data-text-color': '--chat-text',
        'data-border-color': '--chat-border',
      };

      // First check mode-specific attributes
      for (const [attr, cssVar] of Object.entries(colorMap)) {
        const value = this.scriptElement.getAttribute(attr);
        if (value) {
          this.container.style.setProperty(cssVar, value);

          // Also set --chat-primary-dark if primary color is customized
          if (cssVar === '--chat-primary') {
            this.container.style.setProperty('--chat-primary-dark', adjustColor(value, -20));
          }
        }
      }

      // Then check generic attributes as fallback
      for (const [attr, cssVar] of Object.entries(genericColorMap)) {
        const value = this.scriptElement.getAttribute(attr);
        if (value && !this.container.style.getPropertyValue(cssVar)) {
          this.container.style.setProperty(cssVar, value);

          // Also set --chat-primary-dark if primary color is customized
          if (cssVar === '--chat-primary') {
            this.container.style.setProperty('--chat-primary-dark', adjustColor(value, -20));
          }
        }
      }
    }

    // Apply explicitColor from config if it was provided programmatically (not from theme default)
    if (this.config.explicitColor && !this.container.style.getPropertyValue('--chat-primary')) {
      this.container.style.setProperty('--chat-primary', this.config.explicitColor);
      this.container.style.setProperty('--chat-primary-dark', adjustColor(this.config.explicitColor, -20));
    }
  }

  /**
   * Update widget state and trigger re-render
   * @param {Object} newState - New state properties to merge
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * Render the widget based on current state
   * @private
   */
  render() {
    if (this.state.isOpen) {
      this.chatWindow.classList.add("window-open");
      if (this.chatButton) {
        this._updateButtonPosition(true);
        this.chatButton.style.display = "none";
      }
    } else {
      this.chatWindow.classList.remove("window-open");
      if (this.chatButton) {
        this._updateButtonPosition(false);
        this.chatButton.style.display = "flex";
      }
    }
  }

  /**
   * Bind event handlers to DOM elements
   * @private
   */
  bindEvents() {
    this.handlers = {
      toggle: () => this.toggle(),
      close: () => this.close(),
      send: () => this.sendMessage(),
      keypress: (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      },
    };

    if (this.chatButton) {
      this.chatButton.addEventListener("click", this.handlers.toggle);
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.handlers.close);
    }

    this.textarea.addEventListener("keypress", this.handlers.keypress);
    this.sendButton.addEventListener("click", this.handlers.send);

    // Auto resize
    this.setupTextareaAutoResize();
  }

  /**
   * Setup auto-resize behavior for textarea
   * @private
   */
  setupTextareaAutoResize() {
    // Set initial height
    this.textarea.style.height = "auto";
    this.textarea.style.height = this.textarea.scrollHeight + "px";

    const resizeObserver = new ResizeObserver(() => {
      const maxHeight = 150; // Maximum height before scrolling
      this.textarea.style.height = "auto";
      const newHeight = Math.min(this.textarea.scrollHeight, maxHeight);
      this.textarea.style.height = newHeight + "px";
      this.textarea.style.overflowY =
        this.textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    });

    resizeObserver.observe(this.textarea);
    this.resizeObserver = resizeObserver;
  }

  /**
   * Toggle widget open/closed state
   */
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  /**
   * Open the chat widget
   */
  open() {
    this.setState({ isOpen: true });
    // Focus input after opening
    setTimeout(() => {
      if (this.textarea) this.textarea.focus();
    }, 100);
  }

  /**
   * Close the chat widget
   */
  close() {
    this.setState({ isOpen: false });
  }

  /**
   * Update button position based on widget state
   * @private
   * @param {boolean} isOpen - Whether the widget is open
   */
  _updateButtonPosition(isOpen) {
    const { position } = this.config;
    if (isOpen) {
      if (position.includes("bottom") && position.includes("right")) {
        this.chatButton.style.cssText = "bottom: 520px; right: 20px;";
      } else if (position.includes("bottom") && position.includes("left")) {
        this.chatButton.style.cssText = "bottom: 520px; left: 20px;";
      } else if (position.includes("top") && position.includes("right")) {
        this.chatButton.style.cssText = "top: 20px; right: 380px;";
      } else if (position.includes("top") && position.includes("left")) {
        this.chatButton.style.cssText = "top: 20px; left: 380px;";
      }
    } else {
      this.chatButton.style.cssText = `
        ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
        ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
      `;
    }
  }

  /**
   * Send a message to the chat server
   * @param {string} [text] - Optional message text (uses textarea value if not provided)
   */
  sendMessage(text) {
    const message = text || this.textarea.value.trim();
    if (message) {
      this.addMessage(message, "user");
      
      // Add waiting placeholder message
      const waitingMessageId = this.addWaitingMessage();
      
      this.api.sendMessage(message, (text2, sender, widgetData) => {
        // Remove waiting message and add real response
        this.removeWaitingMessage(waitingMessageId);
        this.addMessage(text2, sender, widgetData);
      });
      if (!text) {
        this.textarea.value = "";
        this.textarea.style.height = "auto";
      }
    }
  }

  /**
   * Handle widget interaction events
   * @private
   * @param {Object} interaction - Interaction data from widget
   */
  handleWidgetInteraction(interaction) {
    // Send the selected option value as a message
    const messageText = interaction.optionText;
    this.addMessage(messageText, "user");

    // Add waiting placeholder message
    const waitingMessageId = this.addWaitingMessage();

    // Send the option value to the API
    this.api.sendMessage(interaction.optionValue, (text, sender, widgetData) => {
      // Remove waiting message and add real response
      this.removeWaitingMessage(waitingMessageId);
      this.addMessage(text, sender, widgetData);
    });
  }

  /**
   * Add a message to the chat
   * @param {string} text - Message text
   * @param {string} sender - Message sender ('user' or 'bot')
   * @param {Object} [widgetData] - Optional widget data for bot messages
   */
  addMessage(text, sender, widgetData = null) {
    const messageObj = { text, sender, timestamp: Date.now(), widgetData };
    this.state.messages.push(messageObj);
    appendMessage(this.messagesContainer, text, sender, this.widgetId, widgetData);
  }

  /**
   * Add a waiting placeholder message
   * @private
   * @returns {string} The ID of the waiting message element
   */
  addWaitingMessage() {
    const waitingMessageId = `${this.widgetId}-waiting-${Date.now()}`;
    const waitingElement = document.createElement("div");
    waitingElement.className = "message bot-message waiting-message";
    waitingElement.id = waitingMessageId;
    
    // Create animated dots indicator
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "waiting-dots";
    dotsContainer.innerHTML = `
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    `;
    
    waitingElement.appendChild(dotsContainer);
    this.messagesContainer.appendChild(waitingElement);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    return waitingMessageId;
  }

  /**
   * Remove a waiting placeholder message
   * @private
   * @param {string} waitingMessageId - The ID of the waiting message to remove
   */
  removeWaitingMessage(waitingMessageId) {
    const waitingElement = document.getElementById(waitingMessageId);
    if (waitingElement) {
      waitingElement.remove();
    }
  }

  /**
   * Get the underlying WebSocket connection
   * @returns {WebSocket|null}
   */
  get ws() {
    return this.api.wsConnection;
  }

  /**
   * Send a typing indicator to the server
   * @param {boolean} isTyping - Whether the user is typing
   */
  sendTypingIndicator(isTyping) {
    if (this.api.sendTypingIndicator) {
      this.api.sendTypingIndicator(isTyping);
    }
  }

  /**
   * Set the theme (default or branded)
   * @param {string} theme - Theme name ('default' or 'branded')
   */
  setTheme(theme) {
    this.themeManager.setTheme(theme);
    this.container.setAttribute('data-theme', theme);
    this.config.theme = theme;
  }

  /**
   * Set the theme mode (light or dark)
   * @param {string} mode - Mode name ('light' or 'dark')
   */
  setThemeMode(mode) {
    this.themeManager.setMode(mode);
    this.container.setAttribute('data-mode', mode);
    this.config.themeMode = mode;
    // Reapply custom colors for the new mode
    this.applyCustomColors();
  }

  /**
   * Toggle between light and dark mode
   * @returns {string} The new mode
   */
  toggleThemeMode() {
    const newMode = this.themeManager.toggleMode();
    this.container.setAttribute('data-mode', newMode);
    this.config.themeMode = newMode;
    // Reapply custom colors for the new mode
    this.applyCustomColors();
    return newMode;
  }

  /**
   * Get current theme configuration
   * @returns {Object} Theme configuration
   */
  getThemeConfig() {
    return {
      theme: this.config.theme,
      mode: this.config.themeMode,
      colors: this.config.themeColors,
    };
  }
}
