import { HybridChatAPI } from "./api.js";
import { injectStyles, createWidgetDOM, appendMessage } from "./ui.js";
import { ThemeManager } from "./theme.js";
import { adjustColor } from "./utils.js";

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
    this.widgetId = config.id || "chat-widget-" + crypto.randomUUID();

    // Rate limiting configuration
    this.lastMessageTime = 0;
    this.minMessageInterval = 1000; // 1 second between messages
    this.maxMessageLength = 10000; // Maximum message length

    // Error handling configuration
    this.maxRetries = 3; // Maximum retry attempts
    this.retryDelay = 2000; // Base retry delay in milliseconds
    this.retryCount = 0; // Current retry count
    this.messageQueue = []; // Queue for failed messages
    this.currentErrorElement = null; // Current error message element

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
      isOpen: this.config.displayMode === "fullpage",
      messages: [],
    };

    this.hasConnected = false;

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
      this.config,
    );

    this.container = container;
    this.chatWindow = chatWindow;
    this.chatButton = chatButton;

    // Set theme data attributes
    this.container.setAttribute("data-theme", this.config.theme);
    this.container.setAttribute("data-mode", this.config.themeMode);

    // Apply custom colors from data attributes if present
    this.applyCustomColors();

    // Get elements
    this.messagesContainer = this.chatWindow.querySelector(".messages");
    this.textarea = this.chatWindow.querySelector(".textarea");
    this.sendButton = this.chatWindow.querySelector(".send");
    this.closeButton = this.chatWindow.querySelector(".close");

    this.bindEvents();

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

    // Connect immediately if widget is open (e.g. fullpage mode)
    if (this.state.isOpen) {
      this.initializeConnection();
    }
  }

  /**
   * Initialize connection to the server
   * @private
   */
  initializeConnection() {
    if (this.hasConnected) return;
    this.hasConnected = true;

    // Perform handshake with error handling
    this.api.performHandshake(
      // Success callback
      () => {
        // Handshake successful - connection established
        this.clearError();

        // Connect with error handling after successful handshake
        this.api.connect(
          // Message callback
          (text, sender, widgetData) =>
            this.addMessage(text, sender, widgetData),
          // Error callback
          (error) => {
            console.error("ChatWidget: Connection failed", error);
            this.showError(
              "Connection to server lost. Attempting to reconnect...",
            );
          },
        );
      },
      // Error callback
      (error) => {
        console.error("ChatWidget: Handshake failed", error);
        this.showError(
          "Failed to connect to chat server. Some features may not work.",
        );
      },
    );
  }

  /**
   * Apply custom colors from data attributes via inline styles
   */
  applyCustomColors() {
    if (this.scriptElement) {
      const mode = this.config.themeMode;
      const suffix = mode === "light" ? "-light" : "-dark";

      const colorMap = {
        [`data-color${suffix}`]: "--chat-primary",
        [`data-bg-color${suffix}`]: "--chat-bg",
        [`data-surface-color${suffix}`]: "--chat-surface",
        [`data-text-color${suffix}`]: "--chat-text",
        [`data-border-color${suffix}`]: "--chat-border",
      };

      // Also check for generic attributes without mode suffix (fallback)
      const genericColorMap = {
        "data-color": "--chat-primary",
        "data-bg-color": "--chat-bg",
        "data-surface-color": "--chat-surface",
        "data-text-color": "--chat-text",
        "data-border-color": "--chat-border",
      };

      // First check mode-specific attributes
      for (const [attr, cssVar] of Object.entries(colorMap)) {
        const value = this.scriptElement.getAttribute(attr);
        if (value) {
          this.container.style.setProperty(cssVar, value);

          // Also set --chat-primary-dark if primary color is customized
          if (cssVar === "--chat-primary") {
            this.container.style.setProperty(
              "--chat-primary-dark",
              adjustColor(value, -20),
            );
          }
        }
      }

      // Then check generic attributes as fallback
      for (const [attr, cssVar] of Object.entries(genericColorMap)) {
        const value = this.scriptElement.getAttribute(attr);
        if (value && !this.container.style.getPropertyValue(cssVar)) {
          this.container.style.setProperty(cssVar, value);

          // Also set --chat-primary-dark if primary color is customized
          if (cssVar === "--chat-primary") {
            this.container.style.setProperty(
              "--chat-primary-dark",
              adjustColor(value, -20),
            );
          }
        }
      }
    }

    // Apply explicitColor from config if it was provided programmatically (not from theme default)
    if (
      this.config.explicitColor &&
      !this.container.style.getPropertyValue("--chat-primary")
    ) {
      this.container.style.setProperty(
        "--chat-primary",
        this.config.explicitColor,
      );
      this.container.style.setProperty(
        "--chat-primary-dark",
        adjustColor(this.config.explicitColor, -20),
      );
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
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open the chat widget
   */
  open() {
    this.setState({ isOpen: true });
    
    // Connect if not already connected
    if (!this.hasConnected) {
      this.initializeConnection();
    }

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
   * Send a message to the chat server with comprehensive error handling
   * @param {string} [text] - Optional message text (uses textarea value if not provided)
   */
  sendMessage(text) {
    const message = text || this.textarea.value.trim();

    // Check for empty message first
    if (!message) {
      return;
    }

    // Apply rate limiting
    const now = Date.now();
    if (now - this.lastMessageTime < this.minMessageInterval) {
      this.showError("Please wait before sending another message.");
      return;
    }

    // Apply message length validation
    if (message.length > this.maxMessageLength) {
      this.showError(
        `Message too long. Maximum length is ${this.maxMessageLength} characters.`,
      );
      return;
    }

    this.lastMessageTime = now;
    this.addMessage(message, "user");

    // Add waiting placeholder message
    const waitingMessageId = this.addWaitingMessage();

    // Send message with error handling
    this.api.sendMessage(
      message,
      // Success callback
      (text2, sender, widgetData) => {
        // Remove waiting message and add real response
        this.removeWaitingMessage(waitingMessageId);
        this.addMessage(text2, sender, widgetData);
        this.clearError();
      },
      // Error callback
      (error) => {
        // Remove waiting message
        this.removeWaitingMessage(waitingMessageId);

        // Handle different types of errors
        this.handleMessageError(error, message);
      },
    );

    if (!text) {
      this.textarea.value = "";
      this.textarea.style.height = "auto";
    }
  }

  /**
   * Handle widget interaction events with error handling
   * @private
   * @param {Object} interaction - Interaction data from widget
   */
  handleWidgetInteraction(interaction) {
    // Send the selected option value as a message
    // Determine the display text based on available properties
    const messageText = interaction.optionText || interaction.value || interaction.label || "";
    
    if (messageText) {
      this.addMessage(messageText, "user");
    }

    // Add waiting placeholder message
    const waitingMessageId = this.addWaitingMessage();

    // Send the option value to the API with error handling
    // Use value (InputWidget) or optionValue (ButtonWidget/SelectWidget)
    const messageToSend = interaction.value !== undefined ? interaction.value : interaction.optionValue;
    
    this.api.sendMessage(
      messageToSend,
      // Success callback
      (text, sender, widgetData) => {
        // Remove waiting message and add real response
        this.removeWaitingMessage(waitingMessageId);
        this.addMessage(text, sender, widgetData);
        this.clearError();
      },
      // Error callback
      (error) => {
        // Remove waiting message
        this.removeWaitingMessage(waitingMessageId);

        // Handle different types of errors
        this.handleMessageError(error, interaction.optionValue);
      },
    );
  }

  /**
   * Handle message sending errors with user-friendly feedback
   * @private
   * @param {Error} error - The error that occurred
   * @param {string} originalMessage - The original message that failed to send
   */
  handleMessageError(error, originalMessage) {
    console.error("ChatWidget: Message sending failed", error);

    // Categorize error types and provide appropriate user feedback
    let userMessage = "Failed to send message. Please try again.";
    let shouldRetry = false;

    if (
      error.message.includes("CORS_ERROR") ||
      error.message.includes("Failed to fetch")
    ) {
      userMessage =
        "Network error. Please check your connection and try again.";
      shouldRetry = true;
    } else if (error.message.includes("timeout")) {
      userMessage =
        "Request timed out. The server may be busy. Please try again.";
      shouldRetry = true;
    } else if (error.message.includes("rate limit")) {
      userMessage =
        "Too many messages sent. Please wait a moment before trying again.";
    } else if (error.message.includes("session")) {
      userMessage = "Session expired. Please refresh the page and try again.";
    } else if (error.message.includes("handshake")) {
      userMessage = "Connection to server failed. Please refresh the page.";
    } else if (
      error.message.includes("WebSocket") ||
      error.message.includes("connection")
    ) {
      userMessage = "Connection lost. Attempting to reconnect...";
      shouldRetry = true;
    }

    // Show error message to user
    this.showError(userMessage);

    // Add failed message indicator
    this.addFailedMessageIndicator(originalMessage);

    // Queue message for retry if appropriate
    if (shouldRetry && this.retryCount < this.maxRetries) {
      this.queueMessageForRetry(originalMessage);
    }
  }

  /**
   * Show error message to user
   * @private
   * @param {string} message - Error message to display
   */
  showError(message) {
    // Remove existing error message
    this.clearError();

    // Create error message element
    const errorElement = document.createElement("div");
    errorElement.className = "chat-error-message";
    errorElement.textContent = message;
    errorElement.style.cssText = `
      background-color: #fee;
      color: #c33;
      padding: 8px 12px;
      border-radius: 4px;
      margin: 8px 0;
      font-size: 14px;
      border-left: 4px solid #c33;
      animation: slideIn 0.3s ease-out;
    `;

    // Insert error message at the top of messages container
    if (this.messagesContainer) {
      this.messagesContainer.insertBefore(
        errorElement,
        this.messagesContainer.firstChild,
      );
      this.currentErrorElement = errorElement;

      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.clearError();
      }, 5000);
    }

    // Dispatch error event for external handling
    window.dispatchEvent(
      new CustomEvent("chatwidget:error", {
        detail: { message, timestamp: Date.now() },
      }),
    );
  }

  /**
   * Clear current error message
   * @private
   */
  clearError() {
    if (this.currentErrorElement && this.currentErrorElement.parentNode) {
      this.currentErrorElement.parentNode.removeChild(this.currentErrorElement);
      this.currentErrorElement = null;
    }
  }

  /**
   * Add failed message indicator
   * @private
   * @param {string} message - The message that failed
   */
  addFailedMessageIndicator(message) {
    const failedElement = document.createElement("div");
    failedElement.className = "chat-failed-message";
    
    const container = document.createElement("div");
    container.style.cssText = "color: #666; font-style: italic; font-size: 12px; margin: 4px 0;";
    
    const textSpan = document.createElement("span");
    textSpan.textContent = `Failed to send: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}"`;
    
    const retryBtn = document.createElement("button");
    retryBtn.className = "retry-btn";
    retryBtn.textContent = "Retry";
    retryBtn.style.cssText = "margin-left: 8px; padding: 2px 6px; font-size: 11px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;";
    
    container.appendChild(textSpan);
    container.appendChild(retryBtn);
    failedElement.appendChild(container);

    // Add retry functionality
    retryBtn.addEventListener("click", () => {
      this.sendMessage(message);
      failedElement.remove();
    });

    // Add to messages container
    if (this.messagesContainer) {
      this.messagesContainer.appendChild(failedElement);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  /**
   * Queue message for retry
   * @private
   * @param {string} message - Message to queue
   */
  queueMessageForRetry(message) {
    if (!this.messageQueue) {
      this.messageQueue = [];
    }

    this.messageQueue.push({
      message,
      timestamp: Date.now(),
      retryCount: 0,
    });

    // Attempt to retry after delay
    setTimeout(() => {
      this.processMessageQueue();
    }, this.retryDelay);
  }

  /**
   * Process queued messages for retry
   * @private
   */
  processMessageQueue() {
    if (!this.messageQueue || this.messageQueue.length === 0) {
      return;
    }

    const queuedMessage = this.messageQueue.shift();

    // Check if we should retry this message
    if (queuedMessage.retryCount < this.maxRetries) {
      queuedMessage.retryCount++;

      // Try to send the message again
      this.api.sendMessage(
        queuedMessage.message,
        // Success callback
        (text, sender, widgetData) => {
          this.addMessage(text, sender, widgetData);
          this.clearError();
          // Continue processing queue
          if (this.messageQueue.length > 0) {
            setTimeout(() => this.processMessageQueue(), 1000);
          }
        },
        // Error callback
        (error) => {
          console.error("ChatWidget: Retry failed", error);
          // Re-queue with higher delay
          setTimeout(
            () => {
              this.queueMessageForRetry(queuedMessage.message);
            },
            this.retryDelay * Math.pow(2, queuedMessage.retryCount),
          );
        },
      );
    } else {
      // Max retries reached, show permanent error
      this.showError(
        `Failed to send message after ${this.maxRetries} attempts. Please check your connection.`,
      );
    }
  }

  /**
   * Add a message to the chat
   * @param {string} text - Message text
   * @param {string} sender - Message sender ('user' or 'bot')
   * @param {Object} [widgetData] - Optional widget data for bot messages
   */
  addMessage(text, sender, widgetData = null) {
    // Check if text is actually a widget configuration (Array or Object with widgets)
    const isWidgetConfig = Array.isArray(text) || (typeof text === 'object' && text !== null && text.widgets);
    
    // Use text as-is if it's a widget config, otherwise ensure it's a string
    const messageContent = isWidgetConfig ? text : (text === null || text === undefined ? "" : String(text));

    const messageObj = { text: messageContent, sender, timestamp: Date.now(), widgetData };
    this.state.messages.push(messageObj);
    appendMessage(
      this.messagesContainer,
      messageContent,
      sender,
      this.widgetId,
      widgetData,
    );
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
    this.container.setAttribute("data-theme", theme);
    this.config.theme = theme;
  }

  /**
   * Set the theme mode (light or dark)
   * @param {string} mode - Mode name ('light' or 'dark')
   */
  setThemeMode(mode) {
    this.themeManager.setMode(mode);
    this.container.setAttribute("data-mode", mode);
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
    this.container.setAttribute("data-mode", newMode);
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

  /**
   * Destroy the widget instance and clean up resources
   * Prevents memory leaks by removing event listeners and cleaning up references
   */
  destroy() {
    // Remove event listeners
    if (this.chatButton) {
      this.chatButton.removeEventListener("click", this.handlers.toggle);
    }

    if (this.closeButton) {
      this.closeButton.removeEventListener("click", this.handlers.close);
    }

    if (this.textarea) {
      this.textarea.removeEventListener("keypress", this.handlers.keypress);
    }

    if (this.sendButton) {
      this.sendButton.removeEventListener("click", this.handlers.send);
    }

    // Clean up ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Clean up WebSocket connection
    if (this.api && this.api.disconnect) {
      this.api.disconnect();
    }

    // Clear message queue
    if (this.api && this.api.messageQueue) {
      this.api.messageQueue.length = 0;
    }

    // Remove DOM elements
    if (this.chatWindow && this.chatWindow.parentNode) {
      this.chatWindow.parentNode.removeChild(this.chatWindow);
    }

    if (this.chatButton && this.chatButton.parentNode) {
      this.chatButton.parentNode.removeChild(this.chatButton);
    }

    // Clear references
    this.chatWindow = null;
    this.chatButton = null;
    this.closeButton = null;
    this.textarea = null;
    this.sendButton = null;
    this.messagesContainer = null;
    this.api = null;
    this.config = null;
    this.handlers = null;
  }
}
