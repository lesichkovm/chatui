(() => {
  // src/modules/api.js
  var ChatAPI = class {
    constructor(config) {
      this.serverUrl = config.serverUrl;
      this.debug = config.debug || false;
    }
    getSessionKey() {
      return localStorage.getItem("chat_session_key") || "";
    }
    setSessionKey(key) {
      localStorage.setItem("chat_session_key", key);
    }
    isTestEnvironment() {
      return typeof window !== "undefined" && window.location && window.location.hostname === "localhost" && window.location.port === "32000";
    }
    performHandshake(onSuccess) {
      if (this.isTestEnvironment()) {
        this.setSessionKey("test-session-key");
        if (onSuccess) onSuccess();
        return;
      }
      const callbackName = "handshakeCallback_" + Date.now();
      const url = `${this.serverUrl}/api/handshake?callback=${callbackName}`;
      this._injectScript(url, callbackName, (response) => {
        if (response.status === "success") {
          this.setSessionKey(response.session_key);
          if (onSuccess) onSuccess();
        }
      });
    }
    connect(onMessage) {
      if (this.isTestEnvironment()) {
        return;
      }
      const sessionKey = this.getSessionKey();
      const callbackName = "connectCallback_" + Date.now();
      const url = `${this.serverUrl}/api/messages?callback=${callbackName}&type=connect&session_key=${encodeURIComponent(
        sessionKey
      )}`;
      this._injectScript(url, callbackName, (response) => {
        if (onMessage) {
          if (response.widget) {
            onMessage(response.text, "bot", response.widget);
          } else {
            onMessage(response.text, "bot");
          }
        }
      });
    }
    sendMessage(message, onResponse) {
      if (this.isTestEnvironment()) {
        return;
      }
      const sessionKey = this.getSessionKey();
      const callbackName = "chatCallback_" + Date.now();
      const url = `${this.serverUrl}/api/messages?callback=${callbackName}&message=${encodeURIComponent(
        message
      )}&session_key=${encodeURIComponent(sessionKey)}`;
      this._injectScript(url, callbackName, (response) => {
        if (onResponse) {
          if (response.widget) {
            onResponse(response.text, "bot", response.widget);
          } else {
            onResponse(response.text, "bot");
          }
        }
      });
    }
    _injectScript(url, callbackName, handler) {
      const script = document.createElement("script");
      script.src = url;
      script.onerror = () => {
        console.error(`ChatWidget: Failed to load ${url}`);
        if (window[callbackName]) {
          delete window[callbackName];
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
      window[callbackName] = function(response) {
        handler(response);
        delete window[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
      document.body.appendChild(script);
    }
  };

  // src/modules/utils.js
  function adjustColor(color, amount) {
    return color.replace(/^#/, "").replace(
      /../g,
      (color2) => ("0" + Math.min(255, Math.max(0, parseInt(color2, 16) + amount)).toString(16)).substr(-2)
    ).replace(/^/, "#");
  }

  // src/modules/widgets/base-widget.js
  var BaseWidget = class {
    constructor(widgetData, widgetId) {
      this.widgetData = widgetData;
      this.widgetId = widgetId;
    }
    /**
     * Create the DOM element for this widget
     * @returns {HTMLElement} The widget DOM element
     */
    createElement() {
      throw new Error("createElement() must be implemented by subclass");
    }
    /**
     * Handle widget interaction
     * @param {Object} interaction - Interaction data
     */
    handleInteraction(interaction) {
      const event = new CustomEvent("widgetInteraction", {
        detail: {
          widgetId: this.widgetId,
          ...interaction
        }
      });
      document.dispatchEvent(event);
    }
    /**
     * Validate widget data
     * @returns {boolean} True if data is valid
     */
    validate() {
      return this.widgetData && this.widgetData.type;
    }
  };

  // src/modules/widgets/buttons-widget.js
  var ButtonsWidget = class extends BaseWidget {
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid buttons widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "buttons" && this.widgetData.options) {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "widget-buttons";
        this.widgetData.options.forEach((option) => {
          const button = document.createElement("button");
          button.className = "widget-button";
          button.textContent = option.text;
          button.setAttribute("data-widget-id", this.widgetId);
          button.setAttribute("data-option-id", option.id);
          button.setAttribute("data-option-value", option.value);
          button.addEventListener("click", () => {
            const allButtons = buttonsContainer.querySelectorAll(".widget-button");
            allButtons.forEach((btn) => {
              btn.disabled = true;
              btn.classList.add("widget-button-disabled");
            });
            this.handleInteraction({
              optionId: option.id,
              optionValue: option.value,
              optionText: option.text,
              widgetType: "buttons"
            });
          });
          buttonsContainer.appendChild(button);
        });
        widgetContainer.appendChild(buttonsContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "buttons" && Array.isArray(this.widgetData.options) && this.widgetData.options.length > 0;
    }
  };

  // src/modules/widgets/select-widget.js
  var SelectWidget = class extends BaseWidget {
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid select widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "select" && this.widgetData.options) {
        const selectContainer = document.createElement("div");
        selectContainer.className = "widget-select";
        const select = document.createElement("select");
        select.className = "widget-select-element";
        select.setAttribute("data-widget-id", this.widgetId);
        if (this.widgetData.placeholder) {
          const placeholderOption = document.createElement("option");
          placeholderOption.value = "";
          placeholderOption.textContent = this.widgetData.placeholder;
          placeholderOption.disabled = true;
          placeholderOption.selected = true;
          select.appendChild(placeholderOption);
        }
        this.widgetData.options.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option.value;
          optionElement.textContent = option.text;
          optionElement.setAttribute("data-option-id", option.id);
          select.appendChild(optionElement);
        });
        select.addEventListener("change", () => {
          const selectedOption = select.options[select.selectedIndex];
          const optionData = this.widgetData.options.find((opt) => opt.id === selectedOption.getAttribute("data-option-id"));
          if (optionData) {
            select.disabled = true;
            select.classList.add("widget-select-disabled");
            this.handleInteraction({
              optionId: optionData.id,
              optionValue: optionData.value,
              optionText: optionData.text,
              widgetType: "select"
            });
          }
        });
        selectContainer.appendChild(select);
        widgetContainer.appendChild(selectContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "select" && Array.isArray(this.widgetData.options) && this.widgetData.options.length > 0;
    }
  };

  // src/modules/widgets/input-widget.js
  var InputWidget = class extends BaseWidget {
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid input widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "input") {
        const formContainer = document.createElement("div");
        formContainer.className = "widget-input";
        const input = document.createElement("input");
        input.type = this.widgetData.inputType || "text";
        input.className = "widget-input-element";
        input.placeholder = this.widgetData.placeholder || "Enter your response...";
        input.setAttribute("data-widget-id", this.widgetId);
        const submitButton = document.createElement("button");
        submitButton.className = "widget-input-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        const handleSubmit = () => {
          const value = input.value.trim();
          if (value) {
            this.handleInteraction({
              optionId: "input-submit",
              optionValue: value,
              optionText: value,
              widgetType: "input"
            });
            input.value = "";
          }
        };
        submitButton.addEventListener("click", handleSubmit);
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        });
        formContainer.appendChild(input);
        formContainer.appendChild(submitButton);
        widgetContainer.appendChild(formContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "input";
    }
  };

  // src/modules/widgets/widget-factory.js
  var WidgetFactory2 = class {
    static widgetTypes = /* @__PURE__ */ new Map([
      ["buttons", ButtonsWidget],
      ["select", SelectWidget],
      ["input", InputWidget]
    ]);
    /**
     * Register a new widget type
     * @param {string} type - Widget type identifier
     * @param {class} WidgetClass - Widget class constructor
     */
    static registerWidget(type, WidgetClass) {
      this.widgetTypes.set(type, WidgetClass);
    }
    /**
     * Create a widget instance
     * @param {Object} widgetData - Widget configuration data
     * @param {string} widgetId - Widget container ID
     * @returns {BaseWidget|null} Widget instance or null if type not supported
     */
    static createWidget(widgetData, widgetId) {
      if (!widgetData || !widgetData.type) {
        console.warn("Invalid widget data:", widgetData);
        return null;
      }
      const WidgetClass = this.widgetTypes.get(widgetData.type);
      if (!WidgetClass) {
        console.warn(`Unsupported widget type: ${widgetData.type}`);
        return null;
      }
      try {
        return new WidgetClass(widgetData, widgetId);
      } catch (error) {
        console.error(`Error creating widget of type ${widgetData.type}:`, error);
        return null;
      }
    }
    /**
     * Get list of supported widget types
     * @returns {string[]} Array of supported widget type names
     */
    static getSupportedTypes() {
      return Array.from(this.widgetTypes.keys());
    }
  };

  // src/modules/ui.js
  function injectStyles(widgetId, primaryColor, mode) {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
    /* Scope all styles to the widget ID */
    #${widgetId} {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      /* Add CSS variables scoped to this widget */
      --chat-primary-color: ${primaryColor};
      --chat-primary-color-dark: ${adjustColor(primaryColor, -20)};
    }

    /* Scoped CSS Reset */
    #${widgetId} * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    
    #${widgetId} .button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background-color: var(--chat-primary-color);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
      position: fixed;
      z-index: 10000;
    }
    
    #${widgetId} .button:hover {
      transform: scale(1.1);
      background-color: var(--chat-primary-color-dark);
    }
    
    #${widgetId} .window {
      display: none;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      flex-direction: column;
      overflow: hidden;
      position: fixed;
      z-index: 9998;
    }

    #${widgetId}.fullpage {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    #${widgetId}.fullpage .window {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      border-radius: 0;
      box-shadow: none;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    
    #${widgetId} .window-open {
      display: flex;
    }
    
    #${widgetId} .header {
      padding: 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    
    #${widgetId} .header h3 {
      margin: 0;
      font-size: 16px;
      color: #212529;
    }
    
    #${widgetId} .close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      line-height: 1;
      display: ${mode === "fullpage" ? "none" : "block"};
    }
    
    #${widgetId} .messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
    }
    
    #${widgetId} .message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    #${widgetId} .user-message {
      background: var(--chat-primary-color);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    
    #${widgetId} .bot-message {
      background: #f1f3f5;
      color: #212529;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    #${widgetId} .input {
      padding: 16px;
      border-top: 1px solid #e9ecef;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
      background: white;
    }
    
    #${widgetId} .textarea {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      resize: none;
      min-height: 38px;
      max-height: 150px;
      font-family: inherit;
      line-height: 1.4;
      overflow-y: auto; /* Allow scrolling in textarea */
    }
    
    #${widgetId} .textarea:focus {
      border-color: var(--chat-primary-color);
    }
    
    #${widgetId} .send {
      padding: 8px 16px;
      background: var(--chat-primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
      height: 38px;
      white-space: nowrap;
    }
    
    #${widgetId} .send:hover {
      background: var(--chat-primary-color-dark);
    }
    
    #${widgetId} .widget {
      margin-top: 8px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    
    #${widgetId} .widget-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    #${widgetId} .widget-button {
      padding: 8px 12px;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      transition: all 0.2s ease;
    }
    
    #${widgetId} .widget-button:hover {
      background: var(--chat-primary-color);
      color: white;
      border-color: var(--chat-primary-color);
    }
    
    #${widgetId} .widget-button:active {
      transform: translateY(1px);
    }
    
    #${widgetId} .widget-button:disabled,
    #${widgetId} .widget-button-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #f8f9fa;
      color: #6c757d;
      border-color: #dee2e6;
    }
    
    #${widgetId} .widget-button:disabled:hover,
    #${widgetId} .widget-button-disabled:hover {
      background: #f8f9fa;
      color: #6c757d;
      border-color: #dee2e6;
      transform: none;
    }
    
    #${widgetId} .widget-select {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-select-element {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      outline: none;
      cursor: pointer;
    }
    
    #${widgetId} .widget-select-element:focus {
      border-color: var(--chat-primary-color);
    }
    
    #${widgetId} .widget-select-element:disabled,
    #${widgetId} .widget-select-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #f8f9fa;
      color: #6c757d;
    }
    
    #${widgetId} .widget-select-element:disabled:hover,
    #${widgetId} .widget-select-disabled:hover {
      background: #f8f9fa;
      border-color: #dee2e6;
    }
    
    #${widgetId} .widget-input {
      margin-top: 8px;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    #${widgetId} .widget-input-element {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
    }
    
    #${widgetId} .widget-input-element:focus {
      border-color: var(--chat-primary-color);
    }
    
    #${widgetId} .widget-input-submit {
      padding: 8px 16px;
      background: var(--chat-primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-input-submit:hover {
      background: var(--chat-primary-color-dark);
    }
  `;
    document.head.appendChild(styleElement);
  }
  function createWidgetDOM(widgetId, config) {
    const { mode, position, title, targetSelector } = config;
    const container = document.createElement("div");
    container.id = widgetId;
    container.className = mode;
    const chatWindow = document.createElement("div");
    chatWindow.className = "window";
    chatWindow.id = `${widgetId}-window`;
    if (mode === "popup") {
      chatWindow.style.cssText = `
      ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
    `;
    }
    chatWindow.innerHTML = `
    <div class="header" id="${widgetId}-header">
      <h3>${title}</h3>
      ${mode === "popup" ? `<button type="button" class="close" id="${widgetId}-close" aria-label="Close chat">\xD7</button>` : ""}
    </div>
    <div class="messages" id="${widgetId}-messages" role="log" aria-live="polite" aria-atomic="false"></div>
    <div class="input">
      <textarea class="textarea" id="${widgetId}-input" placeholder="Type your message... (Shift+Enter for new line)" rows="1" aria-label="Type a message"></textarea>
      <button type="button" class="send" id="${widgetId}-send" aria-label="Send message">Send</button>
    </div>
  `;
    let chatButton = null;
    if (mode === "popup") {
      chatButton = document.createElement("button");
      chatButton.className = "button";
      chatButton.id = `${widgetId}-button`;
      chatButton.type = "button";
      chatButton.setAttribute("aria-label", "Toggle chat window");
      chatButton.style.cssText = `
      ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
    `;
      chatButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
      </svg>
    `;
      container.appendChild(chatButton);
    }
    container.appendChild(chatWindow);
    if (mode === "fullpage" && targetSelector) {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.appendChild(container);
      } else {
        console.error(`Target element "${targetSelector}" not found`);
        document.body.appendChild(container);
      }
    } else {
      document.body.appendChild(container);
    }
    return { container, chatWindow, chatButton };
  }
  function appendMessage(container, text, sender, widgetId, widgetData = null) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}-message`;
    messageElement.id = `${widgetId}-message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageContent = document.createElement("div");
    messageContent.innerHTML = text.replace(/\n/g, "<br>");
    messageElement.appendChild(messageContent);
    if (widgetData && sender === "bot") {
      const widgetElement = createWidgetElement(widgetData, widgetId);
      messageElement.appendChild(widgetElement);
    }
    container.appendChild(messageElement);
    container.scrollTop = container.scrollHeight;
  }
  function createWidgetElement(widgetData, widgetId) {
    const widget = WidgetFactory2.createWidget(widgetData, widgetId);
    if (!widget) {
      return document.createComment(`Unsupported widget type: ${widgetData?.type}`);
    }
    return widget.createElement();
  }

  // src/modules/chat-widget.class.js
  var ChatWidget = class {
    constructor(input) {
      let config = {};
      let scriptElement = null;
      if (input instanceof HTMLElement && input.tagName === "SCRIPT") {
        scriptElement = input;
        if (scriptElement._chatWidgetInitialized) return;
        scriptElement._chatWidgetInitialized = true;
        config = {
          id: scriptElement.id,
          mode: scriptElement.getAttribute("data-mode"),
          position: scriptElement.getAttribute("data-position"),
          primaryColor: scriptElement.getAttribute("data-color"),
          title: scriptElement.getAttribute("data-title"),
          targetSelector: scriptElement.getAttribute("data-target"),
          serverUrl: scriptElement.getAttribute("data-server-url")
        };
      } else {
        config = input || {};
      }
      this.scriptElement = scriptElement;
      this.widgetId = config.id || "chat-widget-" + Math.random().toString(36).substr(2, 9);
      this.config = {
        mode: config.mode || "popup",
        position: config.position || "bottom-right",
        primaryColor: config.primaryColor || config.color || "#007bff",
        title: config.title || "Chat with us",
        targetSelector: config.targetSelector || config.target || null,
        serverUrl: config.serverUrl || "http://localhost:3000"
      };
      this.api = new ChatAPI({ serverUrl: this.config.serverUrl });
      this.state = {
        isOpen: false,
        messages: []
      };
      this.init();
    }
    init() {
      injectStyles(this.widgetId, this.config.primaryColor, this.config.mode);
      const { container, chatWindow, chatButton } = createWidgetDOM(
        this.widgetId,
        this.config
      );
      this.container = container;
      this.chatWindow = chatWindow;
      this.chatButton = chatButton;
      this.messagesContainer = this.chatWindow.querySelector(".messages");
      this.textarea = this.chatWindow.querySelector(".textarea");
      this.sendButton = this.chatWindow.querySelector(".send");
      this.closeButton = this.chatWindow.querySelector(".close");
      this.bindEvents();
      this.api.performHandshake();
      this.api.connect((text, sender, widgetData) => this.addMessage(text, sender, widgetData));
      document.addEventListener("widgetInteraction", (event) => {
        if (event.detail.widgetId === this.widgetId) {
          this.handleWidgetInteraction(event.detail);
        }
      });
    }
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.render();
    }
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
        }
      };
      if (this.chatButton) {
        this.chatButton.addEventListener("click", this.handlers.toggle);
      }
      if (this.closeButton) {
        this.closeButton.addEventListener("click", this.handlers.close);
      }
      this.textarea.addEventListener("keypress", this.handlers.keypress);
      this.sendButton.addEventListener("click", this.handlers.send);
      this.setupTextareaAutoResize();
    }
    setupTextareaAutoResize() {
      this.textarea.style.height = "auto";
      this.textarea.style.height = this.textarea.scrollHeight + "px";
      const resizeObserver = new ResizeObserver(() => {
        const maxHeight = 150;
        this.textarea.style.height = "auto";
        const newHeight = Math.min(this.textarea.scrollHeight, maxHeight);
        this.textarea.style.height = newHeight + "px";
        this.textarea.style.overflowY = this.textarea.scrollHeight > maxHeight ? "auto" : "hidden";
      });
      resizeObserver.observe(this.textarea);
      this.resizeObserver = resizeObserver;
    }
    toggle() {
      this.setState({ isOpen: !this.state.isOpen });
    }
    open() {
      this.setState({ isOpen: true });
      setTimeout(() => {
        if (this.textarea) this.textarea.focus();
      }, 100);
    }
    close() {
      this.setState({ isOpen: false });
    }
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
    sendMessage(text) {
      const message = text || this.textarea.value.trim();
      if (message) {
        this.addMessage(message, "user");
        this.api.sendMessage(
          message,
          (text2, sender, widgetData) => this.addMessage(text2, sender, widgetData)
        );
        if (!text) {
          this.textarea.value = "";
          this.textarea.style.height = "auto";
        }
      }
    }
    handleWidgetInteraction(interaction) {
      const messageText = interaction.optionText;
      this.addMessage(messageText, "user");
      this.api.sendMessage(
        interaction.optionValue,
        (text, sender, widgetData) => this.addMessage(text, sender, widgetData)
      );
    }
    addMessage(text, sender, widgetData = null) {
      const messageObj = { text, sender, timestamp: Date.now(), widgetData };
      this.state.messages.push(messageObj);
      appendMessage(this.messagesContainer, text, sender, this.widgetId, widgetData);
    }
  };

  // src/entry.js
  window.createChatWidget = function(scriptElement) {
    return new ChatWidget(scriptElement);
  };
  window.ChatUI = {
    init: function(config) {
      return new ChatWidget(config);
    }
  };
  document.addEventListener("DOMContentLoaded", function() {
    const scripts = document.querySelectorAll('script[id^="chat-widget"]');
    scripts.forEach((script) => {
      if (script.src && script.src !== window.location.href) {
        return;
      }
      window.createChatWidget(script);
    });
  });
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeName === "SCRIPT" && node.id && node.id.startsWith("chat-widget")) {
          if (node.src && node.src !== window.location.href) {
            return;
          }
          window.createChatWidget(node);
        }
      });
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  if (document.currentScript && document.currentScript.id && document.currentScript.id.startsWith("chat-widget")) {
    window.createChatWidget(document.currentScript);
  }
})();
