(() => {
  // src/modules/api-legacy.js
  var ChatAPI = class {
    /**
     * Create a new ChatAPI instance
     * @param {Object} config - Configuration object
     * @param {string} config.serverUrl - Base URL for the chat server
     * @param {boolean} [config.debug=false] - Enable debug logging
     */
    constructor(config) {
      this.serverUrl = config.serverUrl;
      this.debug = config.debug || false;
    }
    /**
     * Get the stored session key from localStorage
     * @returns {string} The session key or empty string if not found
     */
    getSessionKey() {
      return localStorage.getItem("chat_session_key") || "";
    }
    /**
     * Store a session key in localStorage
     * @param {string} key - The session key to store
     */
    setSessionKey(key) {
      localStorage.setItem("chat_session_key", key);
    }
    /**
     * Check if running in test environment (localhost:32000)
     * @returns {boolean} True if in test environment
     */
    isTestEnvironment() {
      return typeof window !== "undefined" && window.location && window.location.hostname === "localhost" && window.location.port === "32000";
    }
    /**
     * Perform initial handshake with server to establish session
     * @param {Function} onSuccess - Callback function called on successful handshake
     */
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
    /**
     * Connect to the chat server to receive messages
     * @param {Function} onMessage - Callback function for incoming messages
     * @param {string} onMessage.text - Message text
     * @param {string} onMessage.sender - Message sender ('bot')
     * @param {Object} [onMessage.widget] - Optional widget data
     */
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
    /**
     * Send a message to the chat server
     * @param {string} message - The message to send
     * @param {Function} onResponse - Callback function for server response
     * @param {string} onResponse.text - Response text
     * @param {string} onResponse.sender - Response sender ('bot')
     * @param {Object} [onResponse.widget] - Optional widget data
     */
    sendMessage(message, onResponse) {
      if (this.isTestEnvironment()) {
        setTimeout(() => {
          if (onResponse) {
            onResponse(`Test response to: ${message}`, "bot");
          }
        }, 100);
        return;
      }
      const sessionKey = this.getSessionKey();
      const callbackName = "chatCallback_" + Date.now();
      const url = `${this.serverUrl}/api/messages?callback=${callbackName}&message=${encodeURIComponent(
        message
      )}&type=message&session_key=${encodeURIComponent(sessionKey)}`;
      this._injectScript(url, callbackName, (response) => {
        if (onResponse) {
          if (response.text !== void 0 && response.text !== null) {
            if (response.widget) {
              onResponse(response.text, "bot", response.widget);
            } else {
              onResponse(response.text, "bot");
            }
          } else {
            console.error("ChatWidget: Legacy API received response without text field", response);
          }
        }
      });
    }
    /**
     * Inject a script tag for JSONP request
     * @private
     * @param {string} url - The URL for the JSONP request
     * @param {string} callbackName - Name of the global callback function
     * @param {Function} handler - Function to handle the response
     */
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

  // src/modules/api-cors.js
  var CorsAPI = class {
    /**
     * Create a new CorsAPI instance
     * @param {Object} config - Configuration object
     * @param {string} config.serverUrl - Base URL for the chat server
     * @param {boolean} [config.debug=false] - Enable debug logging
     * @param {number} [config.timeout=5000] - Request timeout in milliseconds
     */
    constructor(config) {
      this.serverUrl = config.serverUrl;
      this.debug = config.debug || false;
      this.timeout = config.timeout || 5e3;
    }
    /**
     * Get the stored session key from localStorage
     * @returns {string} The session key or empty string if not found
     */
    getSessionKey() {
      return localStorage.getItem("chat_session_key") || "";
    }
    /**
     * Store a session key in localStorage
     * @param {string} key - The session key to store
     */
    setSessionKey(key) {
      localStorage.setItem("chat_session_key", key);
    }
    /**
     * Check if running in test environment (localhost:32000)
     * @returns {boolean} True if in test environment
     */
    isTestEnvironment() {
      return typeof window !== "undefined" && window.location && window.location.hostname === "localhost" && window.location.port === "32000";
    }
    /**
     * Perform HTTP request with timeout and CORS error detection
     * @private
     * @param {string} url - Request URL
     * @param {Object} options - Fetch options
     * @returns {Promise} Promise that resolves with response data
     */
    async _fetchWithTimeout(url, options = {}) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...options.headers
          }
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response content type. Expected JSON.");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
          throw new Error("CORS_ERROR: " + error.message);
        } else if (error.name === "AbortError") {
          throw new Error("TIMEOUT_ERROR: Request timed out");
        } else {
          throw error;
        }
      }
    }
    /**
     * Perform initial handshake with server to establish session
     * @param {Function} onSuccess - Callback function called on successful handshake
     * @param {Function} onError - Callback function called on error (for fallback detection)
     */
    async performHandshake(onSuccess, onError) {
      if (this.isTestEnvironment()) {
        this.setSessionKey("test-session-key");
        if (onSuccess) onSuccess();
        return;
      }
      const url = `${this.serverUrl}/api/handshake`;
      try {
        const response = await this._fetchWithTimeout(url, {
          method: "POST",
          body: JSON.stringify({ type: "handshake", timestamp: Date.now() })
        });
        if (response.status === "success") {
          this.setSessionKey(response.session_key);
          if (onSuccess) onSuccess();
        } else {
          throw new Error("Handshake failed: Invalid response status");
        }
      } catch (error) {
        if (this.debug) {
          console.error("ChatWidget: CORS handshake failed", error);
        }
        if (onError) onError(error);
      }
    }
    /**
     * Connect to the chat server to receive messages
     * @param {Function} onMessage - Callback function for incoming messages
     * @param {string} onMessage.text - Message text
     * @param {string} onMessage.sender - Message sender ('bot')
     * @param {Object} [onMessage.widget] - Optional widget data
     * @param {Function} onError - Callback function called on error (for fallback detection)
     */
    async connect(onMessage, onError) {
      if (this.isTestEnvironment()) {
        return;
      }
      const sessionKey = this.getSessionKey();
      const url = `${this.serverUrl}/api/messages`;
      try {
        const response = await this._fetchWithTimeout(url, {
          method: "POST",
          body: JSON.stringify({
            type: "connect",
            session_key: sessionKey,
            timestamp: Date.now()
          })
        });
        if (onMessage) {
          if (response.status === "success" && response.text) {
            if (response.widget) {
              onMessage(response.text, "bot", response.widget);
            } else {
              onMessage(response.text, "bot");
            }
          } else if (response.status === "error") {
            throw new Error(response.message || "Server returned error response");
          }
        }
      } catch (error) {
        if (this.debug) {
          console.error("ChatWidget: CORS connect failed", error);
        }
        if (onError) onError(error);
      }
    }
    /**
     * Send a message to the chat server
     * @param {string} message - The message to send
     * @param {Function} onResponse - Callback function for server response
     * @param {string} onResponse.text - Response text
     * @param {string} onResponse.sender - Response sender ('bot')
     * @param {Object} [onResponse.widget] - Optional widget data
     * @param {Function} onError - Callback function called on error (for fallback detection)
     */
    async sendMessage(message, onResponse, onError) {
      if (this.isTestEnvironment()) {
        setTimeout(() => {
          if (onResponse) {
            onResponse(`Test response to: ${message}`, "bot");
          }
        }, 100);
        return;
      }
      const sessionKey = this.getSessionKey();
      const url = `${this.serverUrl}/api/messages`;
      try {
        const response = await this._fetchWithTimeout(url, {
          method: "POST",
          body: JSON.stringify({
            type: "message",
            message,
            session_key: sessionKey,
            timestamp: Date.now()
          })
        });
        if (onResponse) {
          if (response.status === "success" && response.text) {
            if (response.widget) {
              onResponse(response.text, "bot", response.widget);
            } else {
              onResponse(response.text, "bot");
            }
          } else if (response.status === "error") {
            throw new Error(response.message || "Server returned error response");
          }
        }
      } catch (error) {
        if (this.debug) {
          console.error("ChatWidget: CORS sendMessage failed", error);
        }
        if (onError) onError(error);
      }
    }
  };

  // src/modules/api.js
  var HybridChatAPI = class extends ChatAPI {
    /**
     * Create a new HybridChatAPI instance
     * @param {Object} config - Configuration object
     * @param {string} config.serverUrl - Base URL for the chat server
     * @param {boolean} [config.debug=false] - Enable debug logging
     * @param {boolean} [config.preferJsonP=false] - Prefer JSONP over CORS (legacy)
     * @param {boolean} [config.forceJsonP=false] - Force JSONP only (no CORS)
     * @param {number} [config.timeout=5000] - CORS request timeout
     * @param {number} [config.fallbackRetries=2] - Number of fallback attempts
     */
    constructor(config) {
      super(config);
      this.config = config;
      this.serverUrl = config.serverUrl;
      this.debug = config.debug || false;
      this.timeout = config.timeout || 5e3;
      this.fallbackRetries = config.fallbackRetries || 2;
      this.forceJsonP = config.forceJsonP || false;
      this.preferJsonP = config.preferJsonP || false;
      this.wsConnection = null;
      this.connectionType = this.detectConnectionType(config.serverUrl);
      this.messageQueue = [];
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectDelay = 1e3;
      this.fallbackAttempts = 0;
      this.initializeApi();
    }
    /**
     * Initialize the appropriate API instance based on configuration
     * @private
     */
    initializeApi() {
      if (this.connectionType === "websocket") {
        this.apiType = "websocket";
      } else {
        if (this.forceJsonP || this.preferJsonP) {
          this.apiType = "jsonp";
        } else {
          this.corsApi = new CorsAPI(this.config);
          this.apiType = "cors";
        }
      }
    }
    /**
     * Detect connection type based on server URL protocol
     * @private
     * @param {string} serverUrl - Server URL to analyze
     * @returns {string} Connection type ('websocket' or 'http')
     */
    detectConnectionType(serverUrl) {
      try {
        const url = new URL(serverUrl);
        if (url.protocol === "wss:" || url.protocol === "ws:") {
          return "websocket";
        } else if (url.protocol === "https:" || url.protocol === "http:") {
          return "http";
        }
      } catch (error) {
        console.warn("ChatWidget: Invalid server URL, defaulting to HTTP");
      }
      return "http";
    }
    /**
     * Perform handshake using appropriate connection method
     * @param {Function} onSuccess - Callback function called on successful handshake
     * @param {Function} onError - Callback function called on handshake error
     */
    performHandshake(onSuccess, onError) {
      if (this.connectionType === "websocket") {
        this.performWebSocketHandshake(onSuccess, onError);
      } else if (this.apiType === "cors") {
        this.performCorsHandshake(onSuccess, onError);
      } else {
        super.performHandshake(onSuccess);
      }
    }
    /**
     * Perform CORS handshake with fallback to JSONP
     * @private
     * @param {Function} onSuccess - Callback function called on successful handshake
     * @param {Function} onError - Callback function called on handshake error
     */
    performCorsHandshake(onSuccess, onError) {
      this.corsApi.performHandshake(
        () => {
          this.setSessionKey(this.corsApi.getSessionKey());
          if (onSuccess) onSuccess();
        },
        (error) => {
          if (this.shouldFallbackToJSONP(error)) {
            this.fallbackToJSONP();
            super.performHandshake(onSuccess);
          } else {
            console.error("ChatWidget: Handshake failed", error);
            if (onError) onError(error);
          }
        }
      );
    }
    /**
     * Check if we should fallback to JSONP based on error
     * @param {Error} error - The error that occurred
     * @returns {boolean} True if should fallback to JSONP
     */
    shouldFallbackToJSONP(error) {
      if (this.fallbackAttempts >= this.fallbackRetries) {
        return false;
      }
      const errorMessage = error.message;
      return errorMessage.includes("CORS_ERROR") || errorMessage.includes("Failed to fetch") || errorMessage.includes("Network request failed");
    }
    /**
     * Fallback from CORS to JSONP API
     */
    fallbackToJSONP() {
      this.fallbackAttempts++;
      this.apiType = "jsonp";
      console.warn("ChatWidget: Falling back to JSONP due to CORS issues");
    }
    /**
     * Perform WebSocket-specific handshake
     * @private
     * @param {Function} onSuccess - Callback function called on successful handshake
     * @param {Function} onError - Callback function called on handshake error
     */
    performWebSocketHandshake(onSuccess, onError) {
      if (this.isTestEnvironment()) {
        this.setSessionKey("test-session-key");
        if (onSuccess) onSuccess();
        return;
      }
      this.initWebSocket().then(() => {
        if (!this.wsConnection) return;
        this.wsConnection.send(JSON.stringify({
          type: "handshake",
          timestamp: Date.now()
        }));
        this.wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "handshake" && data.status === "success") {
            this.setSessionKey(data.session_key);
            if (onSuccess) onSuccess();
          }
        };
      }).catch((error) => {
        console.error("ChatWidget: WebSocket handshake failed", error);
        if (onError) onError(error);
      });
    }
    /**
     * Connect using appropriate connection method
     * @param {Function} onMessage - Callback function for incoming messages
     * @param {string} onMessage.text - Message text
     * @param {string} onMessage.sender - Message sender ('bot')
     * @param {Object} [onMessage.widget] - Optional widget data
     */
    connect(onMessage) {
      if (this.connectionType === "websocket") {
        this.connectWebSocket(onMessage);
      } else if (this.apiType === "cors") {
        this.connectCors(onMessage);
      } else {
        super.connect(onMessage);
      }
    }
    /**
     * Connect via CORS with fallback to JSONP
     * @private
     * @param {Function} onMessage - Callback function for incoming messages
     */
    connectCors(onMessage) {
      this.corsApi.connect(
        (text, sender, widget) => {
          if (onMessage) {
            onMessage(text, sender, widget);
          }
        },
        (error) => {
          if (this.shouldFallbackToJSONP(error)) {
            this.fallbackToJSONP();
            super.connect(onMessage);
          } else {
            console.error("ChatWidget: Connect failed", error);
          }
        }
      );
    }
    /**
     * Connect via WebSocket
     * @private
     * @param {Function} onMessage - Callback function for incoming messages
     */
    connectWebSocket(onMessage) {
      if (this.isTestEnvironment()) {
        return;
      }
      if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({
          type: "connect",
          session_key: this.getSessionKey(),
          timestamp: Date.now()
        }));
        this.wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "message") {
            if (onMessage) {
              if (data.widget) {
                onMessage(data.text, "bot", data.widget);
              } else {
                onMessage(data.text, "bot");
              }
            }
          } else if (data.type === "typing") {
            this.handleTypingIndicator(data);
          } else if (data.type === "read_receipt") {
            this.handleReadReceipt(data);
          }
        };
        return;
      }
      this.initWebSocket().then(() => {
        this.wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "message") {
            if (onMessage) {
              if (data.widget) {
                onMessage(data.text, "bot", data.widget);
              } else {
                onMessage(data.text, "bot");
              }
            }
          } else if (data.type === "typing") {
            this.handleTypingIndicator(data);
          } else if (data.type === "read_receipt") {
            this.handleReadReceipt(data);
          }
        };
      }).catch((error) => {
        console.error("ChatWidget: WebSocket connection failed", error);
      });
    }
    /**
     * Send message using appropriate connection method
     * @param {string} message - The message to send
     * @param {Function} onResponse - Callback function for server response
     * @param {string} onResponse.text - Response text
     * @param {string} onResponse.sender - Response sender ('bot')
     * @param {Object} [onResponse.widget] - Optional widget data
     */
    sendMessage(message, onResponse) {
      if (this.connectionType === "websocket") {
        this.sendWebSocketMessage(message, onResponse);
      } else if (this.apiType === "cors") {
        this.sendMessageCors(message, onResponse);
      } else {
        super.sendMessage(message, onResponse);
      }
    }
    /**
     * Send message via CORS with fallback to JSONP
     * @private
     * @param {string} message - The message to send
     * @param {Function} onResponse - Callback function for server response
     */
    sendMessageCors(message, onResponse) {
      this.corsApi.sendMessage(
        message,
        (text, sender, widget) => {
          if (onResponse) {
            onResponse(text, sender, widget);
          }
        },
        (error) => {
          if (this.shouldFallbackToJSONP(error)) {
            this.fallbackToJSONP();
            super.sendMessage(message, onResponse);
          } else {
            console.error("ChatWidget: SendMessage failed", error);
          }
        }
      );
    }
    /**
     * Send message via WebSocket
     * @private
     * @param {string} message - The message to send
     * @param {Function} onResponse - Callback function for server response
     */
    sendWebSocketMessage(message, onResponse) {
      if (this.isTestEnvironment()) {
        return;
      }
      if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({
          type: "message",
          payload: message,
          session_key: this.getSessionKey(),
          timestamp: Date.now()
        }));
        if (onResponse) {
          this.wsConnection.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "message" || data.type === "message:stream") {
              if (data.widget) {
                onResponse(data.text, "bot", data.widget);
              } else {
                onResponse(data.text, "bot");
              }
            }
          };
        }
      } else {
        console.warn("ChatWidget: WebSocket not connected, queuing message");
        this.messageQueue.push({ message, onResponse });
      }
    }
    /**
     * Send typing indicator via WebSocket
     * @param {boolean} isTyping - Whether the user is typing
     */
    sendTypingIndicator(isTyping) {
      if (this.connectionType === "websocket" && this.wsConnection?.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({
          type: "typing",
          payload: { typing: isTyping },
          session_key: this.getSessionKey(),
          timestamp: Date.now()
        }));
      }
    }
    /**
     * Send read receipt via WebSocket
     * @param {string} messageId - ID of the message to mark as read
     */
    sendReadReceipt(messageId) {
      if (this.connectionType === "websocket" && this.wsConnection?.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify({
          type: "read_receipt",
          payload: { message_id: messageId },
          session_key: this.getSessionKey(),
          timestamp: Date.now()
        }));
      }
    }
    /**
     * Initialize WebSocket connection
     * @returns {Promise} Promise that resolves when connection is established
     */
    initWebSocket() {
      return new Promise((resolve, reject) => {
        if (this.wsConnection?.readyState === WebSocket.OPEN) {
          resolve();
          return;
        }
        try {
          this.wsConnection = new WebSocket(this.serverUrl);
          this.wsConnection.onopen = () => {
            this.reconnectAttempts = 0;
            this.flushMessageQueue();
            resolve();
          };
          this.wsConnection.onerror = (error) => {
            console.error("ChatWidget: WebSocket error", error);
            reject(error);
          };
          this.wsConnection.onclose = () => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              setTimeout(() => {
                this.reconnectAttempts++;
                this.initWebSocket();
              }, this.reconnectDelay * this.reconnectAttempts);
            }
          };
        } catch (error) {
          reject(error);
        }
      });
    }
    /**
     * Send queued messages when WebSocket reconnects
     * @private
     */
    flushMessageQueue() {
      while (this.messageQueue.length > 0) {
        const { message, onResponse } = this.messageQueue.shift();
        this.sendWebSocketMessage(message, onResponse);
      }
    }
    /**
     * Handle typing indicator events
     * @private
     * @param {Object} data - Typing indicator data
     */
    handleTypingIndicator(data) {
      const event = new CustomEvent("chatwidget:typing", {
        detail: { typing: data.payload.typing }
      });
      window.dispatchEvent(event);
    }
    /**
     * Handle read receipt events
     * @private
     * @param {Object} data - Read receipt data
     */
    handleReadReceipt(data) {
      const event = new CustomEvent("chatwidget:read_receipt", {
        detail: { message_id: data.payload.message_id }
      });
      window.dispatchEvent(event);
    }
    /**
     * Close WebSocket connection
     */
    disconnect() {
      if (this.wsConnection) {
        this.wsConnection.close();
        this.wsConnection = null;
      }
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
    /**
     * Create a new widget instance
     * @param {Object} widgetData - Widget configuration data
     * @param {string} widgetId - Widget ID for scoping
     */
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
     * Handle widget interaction and dispatch custom event
     * @param {Object} interaction - Interaction data
     * @param {string} interaction.type - Type of interaction
     * @param {string} interaction.value - Interaction value
     * @param {string} [interaction.text] - Display text for the interaction
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
     * Validate widget data structure
     * @returns {boolean} True if data contains required type property
     */
    validate() {
      return this.widgetData && this.widgetData.type;
    }
  };

  // src/modules/widgets/widget-types.js
  var WIDGET_TYPES = {
    BUTTONS: "buttons",
    SELECT: "select",
    INPUT: "input",
    PASSWORD: "password",
    CHECKBOX: "checkbox",
    TEXTAREA: "textarea",
    SLIDER: "slider",
    RATING: "rating",
    TOGGLE: "toggle",
    DATE: "date",
    TAGS: "tags",
    FILE_UPLOAD: "file_upload",
    COLOR_PICKER: "color_picker",
    CONFIRMATION: "confirmation",
    RADIO: "radio",
    PROGRESS: "progress"
  };
  var LEGACY_WIDGET_TYPES = {
    FILE: "file",
    COLOR: "color"
  };
  var SERVER_TYPE_MAPPINGS = {
    [WIDGET_TYPES.FILE_UPLOAD]: LEGACY_WIDGET_TYPES.FILE,
    [WIDGET_TYPES.COLOR_PICKER]: LEGACY_WIDGET_TYPES.COLOR
  };
  var WIDGET_TYPE_MAPPINGS = {
    [LEGACY_WIDGET_TYPES.FILE]: WIDGET_TYPES.FILE_UPLOAD,
    [LEGACY_WIDGET_TYPES.COLOR]: WIDGET_TYPES.COLOR_PICKER
  };

  // src/modules/widgets/buttons-widget.js
  var ButtonsWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the buttons widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid buttons widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === WIDGET_TYPES.BUTTONS && this.widgetData.options) {
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
    /**
     * Validate buttons widget data structure
     * @returns {boolean} True if data contains required properties for buttons widget
     */
    validate() {
      return super.validate() && this.widgetData.type === WIDGET_TYPES.BUTTONS && Array.isArray(this.widgetData.options) && this.widgetData.options.length > 0;
    }
  };

  // src/modules/widgets/select-widget.js
  var SelectWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the select widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
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
    /**
     * Validate select widget data structure
     * @returns {boolean} True if data contains required properties for select widget
     */
    validate() {
      return super.validate() && this.widgetData.type === "select" && Array.isArray(this.widgetData.options) && this.widgetData.options.length > 0;
    }
  };

  // src/modules/widgets/input-widget.js
  var InputWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the input widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
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
            input.disabled = true;
            input.classList.add("widget-input-disabled");
            submitButton.disabled = true;
            submitButton.classList.add("widget-input-disabled");
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
    /**
     * Validate input widget data structure
     * @returns {boolean} True if data contains required properties for input widget
     */
    validate() {
      return super.validate() && this.widgetData.type === "input";
    }
  };

  // src/modules/widgets/password-widget.js
  var PasswordWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the password widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid password widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "password") {
        const formContainer = document.createElement("div");
        formContainer.className = "widget-password";
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "widget-password-wrapper";
        const input = document.createElement("input");
        input.type = "password";
        input.className = "widget-password-element";
        input.placeholder = this.widgetData.placeholder || "Enter your password...";
        input.setAttribute("data-widget-id", this.widgetId);
        input.autocomplete = this.widgetData.autocomplete || "current-password";
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "widget-password-toggle";
        toggleButton.setAttribute("aria-label", "Toggle password visibility");
        toggleButton.innerHTML = "\u{1F441}\uFE0F";
        const submitButton = document.createElement("button");
        submitButton.className = "widget-password-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        const toggleVisibility = () => {
          if (input.type === "password") {
            input.type = "text";
            toggleButton.innerHTML = "\u{1F648}";
            toggleButton.setAttribute("aria-label", "Hide password");
          } else {
            input.type = "password";
            toggleButton.innerHTML = "\u{1F441}\uFE0F";
            toggleButton.setAttribute("aria-label", "Show password");
          }
        };
        const handleSubmit = () => {
          const value = input.value.trim();
          if (value) {
            input.disabled = true;
            input.classList.add("widget-password-disabled");
            toggleButton.disabled = true;
            toggleButton.classList.add("widget-password-disabled");
            submitButton.disabled = true;
            submitButton.classList.add("widget-password-disabled");
            const passwordValue = value;
            input.value = "";
            this.handleInteraction({
              optionId: "password-submit",
              optionValue: passwordValue,
              optionText: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              // Mask the password in display
              widgetType: "password"
            });
          }
        };
        toggleButton.addEventListener("click", toggleVisibility);
        submitButton.addEventListener("click", handleSubmit);
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        });
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(toggleButton);
        formContainer.appendChild(inputWrapper);
        formContainer.appendChild(submitButton);
        widgetContainer.appendChild(formContainer);
      }
      return widgetContainer;
    }
    /**
     * Validate password widget data structure
     * @returns {boolean} True if data contains required properties for password widget
     */
    validate() {
      return super.validate() && this.widgetData.type === "password";
    }
  };

  // src/modules/widgets/checkbox-widget.js
  var CheckboxWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the checkbox widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid checkbox widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "checkbox" && this.widgetData.options) {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "widget-checkbox";
        const submitButton = document.createElement("button");
        submitButton.className = "widget-checkbox-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        this.widgetData.options.forEach((option) => {
          const checkboxWrapper = document.createElement("div");
          checkboxWrapper.className = "widget-checkbox-item";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "widget-checkbox-element";
          checkbox.id = `checkbox-${this.widgetId}-${option.id}`;
          checkbox.value = option.value;
          checkbox.setAttribute("data-widget-id", this.widgetId);
          checkbox.setAttribute("data-option-id", option.id);
          if (option.checked) {
            checkbox.checked = true;
          }
          const label = document.createElement("label");
          label.className = "widget-checkbox-label";
          label.htmlFor = `checkbox-${this.widgetId}-${option.id}`;
          label.textContent = option.text;
          checkboxWrapper.appendChild(checkbox);
          checkboxWrapper.appendChild(label);
          checkboxContainer.appendChild(checkboxWrapper);
        });
        const handleSubmit = () => {
          const checkboxes = checkboxContainer.querySelectorAll(".widget-checkbox-element");
          const selectedOptions = [];
          checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              const optionId = checkbox.getAttribute("data-option-id");
              const optionData = this.widgetData.options.find((opt) => opt.id === optionId);
              if (optionData) {
                selectedOptions.push({
                  optionId: optionData.id,
                  optionValue: optionData.value,
                  optionText: optionData.text
                });
              }
            }
          });
          if (selectedOptions.length > 0 || this.widgetData.allowEmpty !== false) {
            const allCheckboxes = checkboxContainer.querySelectorAll(".widget-checkbox-element");
            allCheckboxes.forEach((cb) => {
              cb.disabled = true;
              cb.classList.add("widget-checkbox-disabled");
            });
            submitButton.disabled = true;
            submitButton.classList.add("widget-checkbox-disabled");
            this.handleInteraction({
              selectedOptions,
              widgetType: "checkbox"
            });
          }
        };
        submitButton.addEventListener("click", handleSubmit);
        checkboxContainer.appendChild(submitButton);
        widgetContainer.appendChild(checkboxContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "checkbox" && Array.isArray(this.widgetData.options) && this.widgetData.options.length > 0;
    }
  };

  // src/modules/widgets/textarea-widget.js
  var TextareaWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the textarea widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid textarea widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "textarea") {
        const formContainer = document.createElement("div");
        formContainer.className = "widget-textarea";
        const textarea = document.createElement("textarea");
        textarea.className = "widget-textarea-element";
        textarea.placeholder = this.widgetData.placeholder || "Enter your response...";
        textarea.rows = this.widgetData.rows || 4;
        textarea.setAttribute("data-widget-id", this.widgetId);
        if (this.widgetData.maxLength) {
          textarea.maxLength = this.widgetData.maxLength;
        }
        const submitButton = document.createElement("button");
        submitButton.className = "widget-textarea-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        const handleSubmit = () => {
          const value = textarea.value.trim();
          if (value) {
            textarea.disabled = true;
            textarea.classList.add("widget-textarea-disabled");
            submitButton.disabled = true;
            submitButton.classList.add("widget-textarea-disabled");
            this.handleInteraction({
              optionId: "textarea-submit",
              optionValue: value,
              optionText: value,
              widgetType: "textarea"
            });
            textarea.value = "";
          }
        };
        submitButton.addEventListener("click", handleSubmit);
        textarea.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            handleSubmit();
          }
        });
        formContainer.appendChild(textarea);
        formContainer.appendChild(submitButton);
        widgetContainer.appendChild(formContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "textarea";
    }
  };

  // src/modules/widgets/slider-widget.js
  var SliderWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the slider widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid slider widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "slider") {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "widget-slider";
        const label = document.createElement("label");
        label.className = "widget-slider-label";
        label.textContent = this.widgetData.label || "Select a value";
        const sliderWrapper = document.createElement("div");
        sliderWrapper.className = "widget-slider-wrapper";
        const slider = document.createElement("input");
        slider.type = "range";
        slider.className = "widget-slider-element";
        slider.min = this.widgetData.min || 0;
        slider.max = this.widgetData.max || 100;
        slider.step = this.widgetData.step || 1;
        slider.value = this.widgetData.defaultValue || Math.floor((slider.min + slider.max) / 2);
        slider.setAttribute("data-widget-id", this.widgetId);
        const valueDisplay = document.createElement("div");
        valueDisplay.className = "widget-slider-value";
        valueDisplay.textContent = slider.value;
        const submitButton = document.createElement("button");
        submitButton.className = "widget-slider-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        slider.addEventListener("input", () => {
          valueDisplay.textContent = slider.value;
        });
        const handleSubmit = () => {
          const value = parseFloat(slider.value);
          slider.disabled = true;
          slider.classList.add("widget-slider-disabled");
          submitButton.disabled = true;
          submitButton.classList.add("widget-slider-disabled");
          this.handleInteraction({
            optionId: "slider-submit",
            optionValue: value,
            optionText: value.toString(),
            widgetType: "slider"
          });
        };
        submitButton.addEventListener("click", handleSubmit);
        sliderWrapper.appendChild(slider);
        sliderWrapper.appendChild(valueDisplay);
        sliderContainer.appendChild(label);
        sliderContainer.appendChild(sliderWrapper);
        sliderContainer.appendChild(submitButton);
        widgetContainer.appendChild(sliderContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "slider" && typeof this.widgetData.min === "number" && typeof this.widgetData.max === "number" && this.widgetData.max > this.widgetData.min;
    }
  };

  // src/modules/widgets/rating-widget.js
  var RatingWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the rating widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid rating widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "rating") {
        const ratingContainer = document.createElement("div");
        ratingContainer.className = "widget-rating";
        const label = document.createElement("div");
        label.className = "widget-rating-label";
        label.textContent = this.widgetData.label || "Rate this";
        const starsContainer = document.createElement("div");
        starsContainer.className = "widget-rating-stars";
        const maxRating = this.widgetData.maxRating || 5;
        const iconType = this.widgetData.iconType || "stars";
        for (let i = 1; i <= maxRating; i++) {
          const star = document.createElement("button");
          star.className = "widget-rating-star";
          star.setAttribute("data-rating", i);
          star.setAttribute("data-widget-id", this.widgetId);
          if (iconType === "emojis") {
            star.textContent = "\u2B50";
          } else {
            star.innerHTML = "\u2605";
          }
          star.addEventListener("mouseenter", () => {
            this.highlightStars(starsContainer, i);
          });
          star.addEventListener("mouseleave", () => {
            this.resetStars(starsContainer);
          });
          star.addEventListener("click", () => {
            this.selectRating(starsContainer, i);
            const allStars = starsContainer.querySelectorAll(".widget-rating-star");
            allStars.forEach((s) => {
              s.disabled = true;
              s.classList.add("widget-rating-disabled");
            });
            this.handleInteraction({
              optionId: "rating-submit",
              optionValue: i,
              optionText: `${i} star${i > 1 ? "s" : ""}`,
              widgetType: "rating"
            });
          });
          starsContainer.appendChild(star);
        }
        ratingContainer.appendChild(label);
        ratingContainer.appendChild(starsContainer);
        widgetContainer.appendChild(ratingContainer);
      }
      return widgetContainer;
    }
    highlightStars(container, rating) {
      const stars = container.querySelectorAll(".widget-rating-star");
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add("widget-rating-star-hover");
        } else {
          star.classList.remove("widget-rating-star-hover");
        }
      });
    }
    resetStars(container) {
      const stars = container.querySelectorAll(".widget-rating-star");
      stars.forEach((star) => {
        star.classList.remove("widget-rating-star-hover");
      });
    }
    selectRating(container, rating) {
      const stars = container.querySelectorAll(".widget-rating-star");
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add("widget-rating-star-selected");
        } else {
          star.classList.remove("widget-rating-star-selected");
        }
      });
    }
    validate() {
      return super.validate() && this.widgetData.type === "rating" && typeof this.widgetData.maxRating === "number" && this.widgetData.maxRating > 0;
    }
  };

  // src/modules/widgets/toggle-widget.js
  var ToggleWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the toggle widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid toggle widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "toggle") {
        const toggleContainer = document.createElement("div");
        toggleContainer.className = "widget-toggle";
        const label = document.createElement("label");
        label.className = "widget-toggle-label";
        label.textContent = this.widgetData.label || "Enable";
        const toggleWrapper = document.createElement("div");
        toggleWrapper.className = "widget-toggle-wrapper";
        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.className = "widget-toggle-input";
        toggle.setAttribute("data-widget-id", this.widgetId);
        if (this.widgetData.defaultValue === true) {
          toggle.checked = true;
        }
        const toggleSlider = document.createElement("span");
        toggleSlider.className = "widget-toggle-slider";
        toggleSlider.addEventListener("click", () => {
          toggle.checked = !toggle.checked;
        });
        const submitButton = document.createElement("button");
        submitButton.className = "widget-toggle-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        const handleSubmit = () => {
          const value = toggle.checked;
          toggle.disabled = true;
          toggle.classList.add("widget-toggle-disabled");
          submitButton.disabled = true;
          submitButton.classList.add("widget-toggle-disabled");
          this.handleInteraction({
            optionId: "toggle-submit",
            optionValue: value,
            optionText: value ? "enabled" : "disabled",
            widgetType: "toggle"
          });
        };
        submitButton.addEventListener("click", handleSubmit);
        toggleWrapper.appendChild(toggle);
        toggleWrapper.appendChild(toggleSlider);
        toggleContainer.appendChild(label);
        toggleContainer.appendChild(toggleWrapper);
        toggleContainer.appendChild(submitButton);
        widgetContainer.appendChild(toggleContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "toggle";
    }
  };

  // src/modules/widgets/date-widget.js
  var DateWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the date widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid date widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "date") {
        const dateContainer = document.createElement("div");
        dateContainer.className = "widget-date";
        const label = document.createElement("label");
        label.className = "widget-date-label";
        label.textContent = this.widgetData.label || "Select a date";
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.className = "widget-date-element";
        dateInput.setAttribute("data-widget-id", this.widgetId);
        if (this.widgetData.minDate) {
          dateInput.min = this.widgetData.minDate;
        }
        if (this.widgetData.maxDate) {
          dateInput.max = this.widgetData.maxDate;
        }
        if (this.widgetData.placeholder) {
          dateInput.placeholder = this.widgetData.placeholder;
        }
        const submitButton = document.createElement("button");
        submitButton.className = "widget-date-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        const handleSubmit = () => {
          const value = dateInput.value;
          if (value) {
            dateInput.disabled = true;
            dateInput.classList.add("widget-date-disabled");
            submitButton.disabled = true;
            submitButton.classList.add("widget-date-disabled");
            this.handleInteraction({
              optionId: "date-submit",
              optionValue: value,
              optionText: value,
              widgetType: "date"
            });
          }
        };
        submitButton.addEventListener("click", handleSubmit);
        dateInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        });
        dateContainer.appendChild(label);
        dateContainer.appendChild(dateInput);
        dateContainer.appendChild(submitButton);
        widgetContainer.appendChild(dateContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "date";
    }
  };

  // src/modules/widgets/tags-widget.js
  var TagsWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the tags widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid tags widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "tags") {
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "widget-tags";
        const label = document.createElement("label");
        label.className = "widget-tags-label";
        label.textContent = this.widgetData.label || "Add tags";
        const inputWrapper = document.createElement("div");
        inputWrapper.className = "widget-tags-input-wrapper";
        const tagsDisplay = document.createElement("div");
        tagsDisplay.className = "widget-tags-display";
        const input = document.createElement("input");
        input.type = "text";
        input.className = "widget-tags-input";
        input.placeholder = this.widgetData.placeholder || "Type and press Enter to add tag";
        input.setAttribute("data-widget-id", this.widgetId);
        const suggestionsList = document.createElement("ul");
        suggestionsList.className = "widget-tags-suggestions";
        suggestionsList.style.display = "none";
        const maxTags = this.widgetData.maxTags || 10;
        let tags = [];
        const renderTags = () => {
          tagsDisplay.innerHTML = "";
          tags.forEach((tag, index) => {
            const tagElement = document.createElement("span");
            tagElement.className = "widget-tag";
            tagElement.textContent = tag;
            const removeButton = document.createElement("button");
            removeButton.className = "widget-tag-remove";
            removeButton.textContent = "\xD7";
            removeButton.addEventListener("click", () => {
              tags.splice(index, 1);
              renderTags();
            });
            tagElement.appendChild(removeButton);
            tagsDisplay.appendChild(tagElement);
          });
        };
        const showSuggestions = (query) => {
          if (!this.widgetData.suggestions || !query) {
            suggestionsList.style.display = "none";
            return;
          }
          const filtered = this.widgetData.suggestions.filter(
            (s) => s.toLowerCase().includes(query.toLowerCase()) && !tags.includes(s)
          );
          if (filtered.length > 0) {
            suggestionsList.innerHTML = "";
            filtered.forEach((suggestion) => {
              const li = document.createElement("li");
              li.className = "widget-tags-suggestion";
              li.textContent = suggestion;
              li.addEventListener("click", () => {
                if (tags.length < maxTags) {
                  tags.push(suggestion);
                  renderTags();
                  input.value = "";
                  suggestionsList.style.display = "none";
                }
              });
              suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = "block";
          } else {
            suggestionsList.style.display = "none";
          }
        };
        input.addEventListener("input", () => {
          showSuggestions(input.value);
        });
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const value = input.value.trim();
            if (value && tags.length < maxTags && !tags.includes(value)) {
              tags.push(value);
              renderTags();
              input.value = "";
              suggestionsList.style.display = "none";
            }
          } else if (e.key === "Backspace" && !input.value && tags.length > 0) {
            tags.pop();
            renderTags();
          }
        });
        const submitButton = document.createElement("button");
        submitButton.className = "widget-tags-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        const handleSubmit = () => {
          if (tags.length > 0) {
            input.disabled = true;
            input.classList.add("widget-tags-disabled");
            submitButton.disabled = true;
            submitButton.classList.add("widget-tags-disabled");
            this.handleInteraction({
              optionId: "tags-submit",
              optionValue: tags,
              optionText: tags.join(", "),
              widgetType: "tags"
            });
          }
        };
        submitButton.addEventListener("click", handleSubmit);
        inputWrapper.appendChild(tagsDisplay);
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(suggestionsList);
        tagsContainer.appendChild(label);
        tagsContainer.appendChild(inputWrapper);
        tagsContainer.appendChild(submitButton);
        widgetContainer.appendChild(tagsContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "tags";
    }
  };

  // src/modules/widgets/file-upload-widget.js
  var FileUploadWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the file upload widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid file upload widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === LEGACY_WIDGET_TYPES.FILE) {
        const uploadContainer = document.createElement("div");
        uploadContainer.className = "widget-file-upload";
        const label = document.createElement("label");
        label.className = "widget-file-label";
        label.textContent = this.widgetData.label || "Upload a file";
        const dropZone = document.createElement("div");
        dropZone.className = "widget-file-dropzone";
        const dropZoneContent = document.createElement("div");
        dropZoneContent.className = "widget-file-dropzone-content";
        dropZoneContent.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <p>Drag and drop files here or click to select</p>
      `;
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.className = "widget-file-input";
        fileInput.setAttribute("data-widget-id", this.widgetId);
        fileInput.style.display = "none";
        if (this.widgetData.accept) {
          fileInput.accept = this.widgetData.accept;
        }
        if (this.widgetData.maxFiles) {
          fileInput.multiple = this.widgetData.maxFiles > 1;
        }
        const fileList = document.createElement("div");
        fileList.className = "widget-file-list";
        let selectedFiles = [];
        const maxFiles = this.widgetData.maxFiles || 1;
        const maxSize = this.widgetData.maxSize || 10 * 1024 * 1024;
        const renderFiles = () => {
          fileList.innerHTML = "";
          selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement("div");
            fileItem.className = "widget-file-item";
            const fileName = document.createElement("span");
            fileName.className = "widget-file-name";
            fileName.textContent = file.name;
            const fileSize = document.createElement("span");
            fileSize.className = "widget-file-size";
            fileSize.textContent = this.formatFileSize(file.size);
            const removeButton = document.createElement("button");
            removeButton.className = "widget-file-remove";
            removeButton.textContent = "\xD7";
            removeButton.addEventListener("click", () => {
              selectedFiles.splice(index, 1);
              renderFiles();
            });
            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileItem.appendChild(removeButton);
            fileList.appendChild(fileItem);
          });
        };
        dropZone.addEventListener("click", () => {
          fileInput.click();
        });
        dropZone.addEventListener("dragover", (e) => {
          e.preventDefault();
          dropZone.classList.add("widget-file-dropzone-active");
        });
        dropZone.addEventListener("dragleave", () => {
          dropZone.classList.remove("widget-file-dropzone-active");
        });
        dropZone.addEventListener("drop", (e) => {
          e.preventDefault();
          dropZone.classList.remove("widget-file-dropzone-active");
          const files = Array.from(e.dataTransfer.files);
          this.addFiles(files);
        });
        fileInput.addEventListener("change", () => {
          const files = Array.from(fileInput.files);
          this.addFiles(files);
          fileInput.value = "";
        });
        this.addFiles = (files) => {
          files.forEach((file) => {
            if (selectedFiles.length >= maxFiles) return;
            if (file.size > maxSize) {
              alert(`File ${file.name} exceeds maximum size of ${this.formatFileSize(maxSize)}`);
              return;
            }
            if (!selectedFiles.some((f) => f.name === file.name)) {
              selectedFiles.push(file);
            }
          });
          renderFiles();
        };
        const submitButton = document.createElement("button");
        submitButton.className = "widget-file-submit";
        submitButton.textContent = this.widgetData.buttonText || "Upload";
        const handleSubmit = () => {
          if (selectedFiles.length > 0) {
            const fileData = selectedFiles.map((file) => ({
              name: file.name,
              size: file.size,
              type: file.type
            }));
            dropZone.classList.add("widget-file-disabled");
            submitButton.disabled = true;
            submitButton.classList.add("widget-file-disabled");
            const fileNames = selectedFiles.map((file) => file.name).join(", ");
            this.handleInteraction({
              optionId: "file-upload",
              optionValue: fileData,
              optionText: fileNames || `${selectedFiles.length} file(s)`,
              widgetType: "file"
            });
          }
        };
        submitButton.addEventListener("click", handleSubmit);
        dropZone.appendChild(dropZoneContent);
        uploadContainer.appendChild(label);
        uploadContainer.appendChild(dropZone);
        uploadContainer.appendChild(fileList);
        uploadContainer.appendChild(submitButton);
        uploadContainer.appendChild(fileInput);
        widgetContainer.appendChild(uploadContainer);
      }
      return widgetContainer;
    }
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    }
    validate() {
      return super.validate() && this.widgetData.type === LEGACY_WIDGET_TYPES.FILE;
    }
  };

  // src/modules/widgets/color-picker-widget.js
  var ColorPickerWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the color picker widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid color picker widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === LEGACY_WIDGET_TYPES.COLOR) {
        const colorContainer = document.createElement("div");
        colorContainer.className = "widget-color-picker";
        const label = document.createElement("label");
        label.className = "widget-color-label";
        label.textContent = this.widgetData.label || "Select a color";
        const colorWrapper = document.createElement("div");
        colorWrapper.className = "widget-color-wrapper";
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.className = "widget-color-input";
        colorInput.setAttribute("data-widget-id", this.widgetId);
        if (this.widgetData.defaultColor) {
          colorInput.value = this.widgetData.defaultColor;
        }
        const colorDisplay = document.createElement("div");
        colorDisplay.className = "widget-color-display";
        colorDisplay.style.backgroundColor = colorInput.value;
        colorDisplay.textContent = colorInput.value.toUpperCase();
        const presetContainer = document.createElement("div");
        presetContainer.className = "widget-color-presets";
        if (this.widgetData.presetColors && this.widgetData.presetColors.length > 0) {
          this.widgetData.presetColors.forEach((color) => {
            const preset = document.createElement("button");
            preset.className = "widget-color-preset";
            preset.style.backgroundColor = color;
            preset.setAttribute("data-color", color);
            preset.addEventListener("click", () => {
              colorInput.value = color;
              colorDisplay.style.backgroundColor = color;
              colorDisplay.textContent = color.toUpperCase();
            });
            presetContainer.appendChild(preset);
          });
        }
        const submitButton = document.createElement("button");
        submitButton.className = "widget-color-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        colorInput.addEventListener("input", () => {
          colorDisplay.style.backgroundColor = colorInput.value;
          colorDisplay.textContent = colorInput.value.toUpperCase();
        });
        const handleSubmit = () => {
          const value = colorInput.value;
          colorInput.disabled = true;
          colorInput.classList.add("widget-color-disabled");
          submitButton.disabled = true;
          submitButton.classList.add("widget-color-disabled");
          this.handleInteraction({
            optionId: "color-submit",
            optionValue: value,
            optionText: value.toUpperCase(),
            widgetType: "color"
          });
        };
        submitButton.addEventListener("click", handleSubmit);
        colorWrapper.appendChild(colorInput);
        colorWrapper.appendChild(colorDisplay);
        colorContainer.appendChild(label);
        colorContainer.appendChild(colorWrapper);
        if (this.widgetData.presetColors && this.widgetData.presetColors.length > 0) {
          colorContainer.appendChild(presetContainer);
        }
        colorContainer.appendChild(submitButton);
        widgetContainer.appendChild(colorContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === LEGACY_WIDGET_TYPES.COLOR;
    }
  };

  // src/modules/widgets/confirmation-widget.js
  var ConfirmationWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the confirmation widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid confirmation widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "confirmation") {
        const confirmationContainer = document.createElement("div");
        confirmationContainer.className = "widget-confirmation";
        const message = document.createElement("div");
        message.className = "widget-confirmation-message";
        message.textContent = this.widgetData.message || "Are you sure?";
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "widget-confirmation-buttons";
        const cancelButton = document.createElement("button");
        cancelButton.className = "widget-confirmation-cancel";
        cancelButton.textContent = this.widgetData.cancelText || "Cancel";
        const confirmButton = document.createElement("button");
        confirmButton.className = "widget-confirmation-confirm";
        confirmButton.textContent = this.widgetData.confirmText || "Confirm";
        const handleCancel = () => {
          cancelButton.disabled = true;
          cancelButton.classList.add("widget-confirmation-disabled");
          confirmButton.disabled = true;
          confirmButton.classList.add("widget-confirmation-disabled");
          this.handleInteraction({
            optionId: "confirmation-cancel",
            optionValue: false,
            optionText: "cancelled",
            widgetType: "confirmation"
          });
        };
        const handleConfirm = () => {
          cancelButton.disabled = true;
          cancelButton.classList.add("widget-confirmation-disabled");
          confirmButton.disabled = true;
          confirmButton.classList.add("widget-confirmation-disabled");
          this.handleInteraction({
            optionId: "confirmation-confirm",
            optionValue: true,
            optionText: "confirmed",
            widgetType: "confirmation"
          });
        };
        cancelButton.addEventListener("click", handleCancel);
        confirmButton.addEventListener("click", handleConfirm);
        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(confirmButton);
        confirmationContainer.appendChild(message);
        confirmationContainer.appendChild(buttonsContainer);
        widgetContainer.appendChild(confirmationContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "confirmation" && this.widgetData.message;
    }
  };

  // src/modules/widgets/radio-widget.js
  var RadioWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the radio widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid radio widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "radio" && this.widgetData.options) {
        const radioContainer = document.createElement("div");
        radioContainer.className = "widget-radio";
        const submitButton = document.createElement("button");
        submitButton.className = "widget-radio-submit";
        submitButton.textContent = this.widgetData.buttonText || "Submit";
        this.widgetData.options.forEach((option) => {
          const radioWrapper = document.createElement("div");
          radioWrapper.className = "widget-radio-item";
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = `radio-${this.widgetId}`;
          radio.className = "widget-radio-element";
          radio.id = `radio-${this.widgetId}-${option.id}`;
          radio.value = option.value;
          radio.setAttribute("data-widget-id", this.widgetId);
          radio.setAttribute("data-option-id", option.id);
          if (option.checked) {
            radio.checked = true;
          }
          const label = document.createElement("label");
          label.className = "widget-radio-label";
          label.htmlFor = `radio-${this.widgetId}-${option.id}`;
          label.textContent = option.text;
          radioWrapper.appendChild(radio);
          radioWrapper.appendChild(label);
          radioContainer.appendChild(radioWrapper);
        });
        const handleSubmit = () => {
          const selectedRadio = radioContainer.querySelector(".widget-radio-element:checked");
          if (selectedRadio) {
            const optionId = selectedRadio.getAttribute("data-option-id");
            const optionData = this.widgetData.options.find((opt) => opt.id === optionId);
            if (optionData) {
              const allRadios = radioContainer.querySelectorAll(".widget-radio-element");
              allRadios.forEach((r) => {
                r.disabled = true;
                r.classList.add("widget-radio-disabled");
              });
              submitButton.disabled = true;
              submitButton.classList.add("widget-radio-disabled");
              this.handleInteraction({
                optionId: optionData.id,
                optionValue: optionData.value,
                optionText: optionData.text,
                widgetType: "radio"
              });
            }
          }
        };
        submitButton.addEventListener("click", handleSubmit);
        radioContainer.appendChild(submitButton);
        widgetContainer.appendChild(radioContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "radio" && Array.isArray(this.widgetData.options) && this.widgetData.options.length > 0;
    }
  };

  // src/modules/widgets/progress-widget.js
  var ProgressWidget = class extends BaseWidget {
    /**
     * Create the DOM element for the progress widget
     * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
     */
    createElement() {
      if (!this.validate()) {
        return document.createComment("Invalid progress widget data");
      }
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "widget";
      if (this.widgetData.type === "progress") {
        const progressContainer = document.createElement("div");
        progressContainer.className = "widget-progress";
        const label = document.createElement("div");
        label.className = "widget-progress-label";
        label.textContent = this.widgetData.label || "Progress";
        const progressBarWrapper = document.createElement("div");
        progressBarWrapper.className = "widget-progress-bar-wrapper";
        const progressBar = document.createElement("div");
        progressBar.className = "widget-progress-bar";
        const value = this.widgetData.value || 0;
        const max = this.widgetData.max || 100;
        const percentage = Math.min(Math.max(value / max * 100, 0), 100);
        progressBar.style.width = `${percentage}%`;
        const progressText = document.createElement("div");
        progressText.className = "widget-progress-text";
        progressText.textContent = `${value} / ${max}`;
        if (this.widgetData.showPercentage !== false) {
          progressText.textContent += ` (${Math.round(percentage)}%)`;
        }
        progressBarWrapper.appendChild(progressBar);
        progressContainer.appendChild(label);
        progressContainer.appendChild(progressBarWrapper);
        progressContainer.appendChild(progressText);
        widgetContainer.appendChild(progressContainer);
      }
      return widgetContainer;
    }
    validate() {
      return super.validate() && this.widgetData.type === "progress" && typeof this.widgetData.value === "number" && typeof this.widgetData.max === "number" && this.widgetData.max > 0;
    }
  };

  // src/modules/widgets/widget-factory.js
  var WidgetFactory2 = class {
    /**
     * Map of widget type identifiers to their corresponding classes
     * @static
     * @type {Map<string, BaseWidget>}
     */
    static widgetTypes = /* @__PURE__ */ new Map([
      [WIDGET_TYPES.BUTTONS, ButtonsWidget],
      [WIDGET_TYPES.SELECT, SelectWidget],
      [WIDGET_TYPES.INPUT, InputWidget],
      [WIDGET_TYPES.PASSWORD, PasswordWidget],
      [WIDGET_TYPES.CHECKBOX, CheckboxWidget],
      [WIDGET_TYPES.TEXTAREA, TextareaWidget],
      [WIDGET_TYPES.SLIDER, SliderWidget],
      [WIDGET_TYPES.RATING, RatingWidget],
      [WIDGET_TYPES.TOGGLE, ToggleWidget],
      [WIDGET_TYPES.DATE, DateWidget],
      [WIDGET_TYPES.TAGS, TagsWidget],
      [LEGACY_WIDGET_TYPES.FILE, FileUploadWidget],
      [LEGACY_WIDGET_TYPES.COLOR, ColorPickerWidget],
      [WIDGET_TYPES.CONFIRMATION, ConfirmationWidget],
      [WIDGET_TYPES.RADIO, RadioWidget],
      [WIDGET_TYPES.PROGRESS, ProgressWidget]
    ]);
    /**
     * Register a new widget type
     * @static
     * @param {string} type - Widget type identifier
     * @param {class} WidgetClass - Widget class constructor extending BaseWidget
     */
    static registerWidget(type, WidgetClass) {
      this.widgetTypes.set(type, WidgetClass);
    }
    /**
     * Create a widget instance based on data type
     * @static
     * @param {Object} widgetData - Widget configuration data
     * @param {string} widgetData.type - Widget type identifier
     * @param {string} widgetId - Widget container ID for scoping
     * @returns {BaseWidget|null} Widget instance or null if type not supported
     */
    static createWidget(widgetData, widgetId) {
      if (!widgetData || !widgetData.type) {
        console.warn("Invalid widget data:", widgetData);
        return null;
      }
      const widgetType = SERVER_TYPE_MAPPINGS[widgetData.type] || widgetData.type;
      const WidgetClass = this.widgetTypes.get(widgetType);
      if (!WidgetClass) {
        console.warn(`Unsupported widget type: ${widgetData.type} (mapped to: ${widgetType})`);
        return null;
      }
      try {
        const mappedWidgetData = { ...widgetData, type: widgetType };
        return new WidgetClass(mappedWidgetData, widgetId);
      } catch (error) {
        console.error(`Error creating widget of type ${widgetData.type}:`, error);
        return null;
      }
    }
    /**
     * Get list of all supported widget types
     * @static
     * @returns {string[]} Array of supported widget type names
     */
    static getSupportedTypes() {
      return Array.from(this.widgetTypes.keys());
    }
  };

  // src/modules/ui.js
  function injectStyles(widgetId, themeConfig) {
    const styleElement = document.createElement("style");
    styleElement.id = `${widgetId}-styles`;
    styleElement.textContent = `
    /* Scope all styles to the widget ID */
    #${widgetId} {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    /* Theme: Default - Light Mode */
    #${widgetId}[data-theme="default"][data-mode="light"] {
      --chat-primary: #007bff;
      --chat-bg: #ffffff;
      --chat-surface: #f8f9fa;
      --chat-text: #212529;
      --chat-border: #e9ecef;
      --chat-primary-dark: ${adjustColor("#007bff", -20)};
    }

    /* Theme: Default - Dark Mode */
    #${widgetId}[data-theme="default"][data-mode="dark"] {
      --chat-primary: #4dabf7;
      --chat-bg: #1a1a1a;
      --chat-surface: #2d2d2d;
      --chat-text: #ffffff;
      --chat-border: #404040;
      --chat-primary-dark: ${adjustColor("#4dabf7", -20)};
    }

    /* Theme: Branded - Light Mode */
    #${widgetId}[data-theme="branded"][data-mode="light"] {
      --chat-primary: #6366f1;
      --chat-bg: #ffffff;
      --chat-surface: #f5f3ff;
      --chat-text: #1e1b4b;
      --chat-border: #e0e7ff;
      --chat-primary-dark: ${adjustColor("#6366f1", -20)};
    }

    /* Theme: Branded - Dark Mode */
    #${widgetId}[data-theme="branded"][data-mode="dark"] {
      --chat-primary: #818cf8;
      --chat-bg: #0f172a;
      --chat-surface: #1e293b;
      --chat-text: #f1f5f9;
      --chat-border: #334155;
      --chat-primary-dark: ${adjustColor("#818cf8", -20)};
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
      background-color: var(--chat-primary);
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
      background-color: var(--chat-primary-dark);
    }
    
    #${widgetId} .window {
      display: none;
      width: 350px;
      height: 500px;
      background: var(--chat-bg);
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
      background: var(--chat-surface);
      border-bottom: 1px solid var(--chat-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    
    #${widgetId} .header h3 {
      margin: 0;
      font-size: 16px;
      color: var(--chat-text);
    }
    
    #${widgetId} .close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--chat-text);
      opacity: 0.6;
      padding: 0;
      line-height: 1;
      display: block;
    }
    
    #${widgetId}.fullpage .close {
      display: none;
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
      background: var(--chat-primary);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    
    #${widgetId} .bot-message {
      background: var(--chat-surface);
      color: var(--chat-text);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    #${widgetId} .input {
      padding: 16px;
      border-top: 1px solid var(--chat-border);
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
      background: var(--chat-bg);
    }
    
    #${widgetId} .textarea {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      resize: none;
      min-height: 38px;
      max-height: 150px;
      font-family: inherit;
      line-height: 1.4;
      overflow-y: auto;
      background: var(--chat-bg);
      color: var(--chat-text);
    }
    
    #${widgetId} .textarea:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .send {
      padding: 8px 16px;
      background: var(--chat-primary);
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
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget {
      margin-top: 8px;
      padding: 12px;
      background: var(--chat-surface);
      border-radius: 8px;
      border: 1px solid var(--chat-border);
    }
    
    #${widgetId} .widget-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    #${widgetId} .widget-button {
      padding: 8px 12px;
      background: var(--chat-bg);
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      transition: all 0.2s ease;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-button:hover {
      background: var(--chat-primary);
      color: white;
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-button:active {
      transform: translateY(1px);
    }
    
    #${widgetId} .widget-button:disabled,
    #${widgetId} .widget-button-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-button:disabled:hover,
    #${widgetId} .widget-button-disabled:hover {
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
      transform: none;
    }
    
    #${widgetId} .widget-select {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-select-element {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
      cursor: pointer;
    }
    
    #${widgetId} .widget-select-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-select-element:disabled,
    #${widgetId} .widget-select-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-select-element:disabled:hover,
    #${widgetId} .widget-select-disabled:hover {
      background: var(--chat-surface);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-rating {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-rating-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-rating-stars {
      display: flex;
      gap: 4px;
    }
    
    #${widgetId} .widget-rating-star {
      background: var(--chat-bg);
      border: 1px solid var(--chat-border);
      border-radius: 4px;
      cursor: pointer;
      font-size: 24px;
      padding: 0px 10px 4px 10px;
      color: var(--chat-text);
      transition: all 0.2s ease;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      min-height: 40px;
      vertical-align: middle;
      box-sizing: border-box;
    }
    
    #${widgetId} .widget-rating-star:hover,
    #${widgetId} .widget-rating-star-hover {
      background: var(--chat-surface);
      border-color: var(--chat-primary);
      color: var(--chat-primary);
      transform: scale(1.05);
    }
    
    #${widgetId} .widget-rating-star-selected {
      background: var(--chat-primary) !important;
      color: white !important;
      border-color: var(--chat-primary) !important;
    }
    
    #${widgetId} .widget-rating-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
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
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-input-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-input-submit {
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-input-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-input-element:disabled,
    #${widgetId} .widget-input-element.widget-input-disabled,
    #${widgetId} .widget-input-submit:disabled,
    #${widgetId} .widget-input-submit.widget-input-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-input-element:disabled:hover,
    #${widgetId} .widget-input-element.widget-input-disabled:hover,
    #${widgetId} .widget-input-submit:disabled:hover,
    #${widgetId} .widget-input-submit.widget-input-disabled:hover {
      background: var(--chat-surface);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-confirmation {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-confirmation-message {
      font-size: 14px;
      margin-bottom: 12px;
      color: var(--chat-text);
      line-height: 1.4;
    }
    
    #${widgetId} .widget-confirmation-buttons {
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }
    
    #${widgetId} .widget-confirmation-cancel,
    #${widgetId} .widget-confirmation-confirm {
      padding: 6px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      background: var(--chat-bg);
      color: var(--chat-text);
      flex: 1;
      min-width: 80px;
    }
    
    #${widgetId} .widget-confirmation-cancel:hover,
    #${widgetId} .widget-confirmation-confirm:hover {
      background: var(--chat-surface);
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-confirmation-confirm {
      background: var(--chat-primary);
      color: white;
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-confirmation-confirm:hover {
      background: var(--chat-primary-dark);
      border-color: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-confirmation-cancel:disabled,
    #${widgetId} .widget-confirmation-confirm:disabled,
    #${widgetId} .widget-confirmation-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--chat-surface);
      color: var(--chat-text);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-confirmation-cancel:disabled:hover,
    #${widgetId} .widget-confirmation-confirm:disabled:hover,
    #${widgetId} .widget-confirmation-disabled:hover {
      background: var(--chat-surface);
      border-color: var(--chat-border);
    }
    
    #${widgetId} .widget-checkbox {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-checkbox-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    #${widgetId} .widget-checkbox-element {
      margin-right: 8px;
    }
    
    #${widgetId} .widget-checkbox-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-checkbox-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-textarea {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-textarea-element {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      line-height: 1.4;
      resize: vertical;
      min-height: 80px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-textarea-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-textarea-submit {
      margin-top: 8px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-textarea-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-slider {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-slider-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-slider-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #${widgetId} .widget-slider-element {
      flex: 1;
      height: 6px;
      background: var(--chat-border);
      border-radius: 3px;
      outline: none;
      -webkit-appearance: none;
    }
    
    #${widgetId} .widget-slider-element::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: var(--chat-primary);
      border-radius: 50%;
      cursor: pointer;
    }
    
    #${widgetId} .widget-slider-element::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: var(--chat-primary);
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    
    #${widgetId} .widget-slider-value {
      font-size: 14px;
      color: var(--chat-text);
      min-width: 40px;
      text-align: center;
    }
    
    #${widgetId} .widget-slider-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-slider-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-toggle {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-toggle-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-toggle-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #${widgetId} .widget-toggle-input {
      display: none;
    }
    
    #${widgetId} .widget-toggle-slider {
      position: relative;
      width: 50px;
      height: 26px;
      background: var(--chat-border);
      border-radius: 13px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-toggle-slider::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.2s ease;
    }
    
    #${widgetId} .widget-toggle-input:checked + .widget-toggle-slider {
      background: var(--chat-primary);
    }
    
    #${widgetId} .widget-toggle-input:checked + .widget-toggle-slider::before {
      transform: translateX(24px);
    }
    
    #${widgetId} .widget-toggle-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-toggle-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-date {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-date-element {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-date-element:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-date-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-date-submit {
      width: 100%;
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-date-submit:hover:not(:disabled) {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-date-element.widget-date-disabled,
    #${widgetId} .widget-date-submit.widget-date-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    #${widgetId} .widget-tags {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-tags-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-tags-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    #${widgetId} .widget-tags-display {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    
    #${widgetId} .widget-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--chat-surface);
      border: 1px solid var(--chat-border);
      border-radius: 4px;
      font-size: 12px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-tag-remove {
      background: none;
      border: none;
      color: var(--chat-text);
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      line-height: 1;
      opacity: 0.7;
    }
    
    #${widgetId} .widget-tag-remove:hover {
      opacity: 1;
    }
    
    #${widgetId} .widget-tags-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-size: 14px;
      background: var(--chat-bg);
      color: var(--chat-text);
      outline: none;
    }
    
    #${widgetId} .widget-tags-input:focus {
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-tags-suggestions {
      list-style: none;
      margin: 4px 0 0 0;
      padding: 0;
      border: 1px solid var(--chat-border);
      border-radius: 4px;
      background: var(--chat-bg);
      max-height: 120px;
      overflow-y: auto;
    }
    
    #${widgetId} .widget-tags-suggestion {
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-tags-suggestion:hover {
      background: var(--chat-surface);
    }
    
    #${widgetId} .widget-tags-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-tags-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-file {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-file-upload {
      border: 2px dashed var(--chat-border);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--chat-bg);
    }
    
    #${widgetId} .widget-file-upload:hover {
      border-color: var(--chat-primary);
      background: var(--chat-surface);
    }
    
    #${widgetId} .widget-file-upload.dragover {
      border-color: var(--chat-primary);
      background: var(--chat-surface);
    }
    
    #${widgetId} .widget-file-input {
      display: none;
    }
    
    #${widgetId} .widget-file-info {
      margin-top: 12px;
      font-size: 14px;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-color {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-color-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #${widgetId} .widget-color-element {
      width: 50px;
      height: 40px;
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      padding: 2px;
      background: var(--chat-bg);
    }
    
    #${widgetId} .widget-color-element::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    #${widgetId} .widget-color-element::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
    
    #${widgetId} .widget-color-value {
      font-size: 14px;
      color: var(--chat-text);
      font-family: monospace;
    }
    
    #${widgetId} .widget-radio {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-radio-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    #${widgetId} .widget-radio-element {
      margin-right: 8px;
    }
    
    #${widgetId} .widget-radio-submit {
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--chat-primary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    #${widgetId} .widget-radio-submit:hover {
      background: var(--chat-primary-dark);
    }
    
    #${widgetId} .widget-progress {
      margin-top: 8px;
    }
    
    #${widgetId} .widget-progress-bar {
      width: 100%;
      height: 8px;
      background: var(--chat-border);
      border-radius: 4px;
      overflow: hidden;
    }
    
    #${widgetId} .widget-progress-fill {
      height: 100%;
      background: var(--chat-primary);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    #${widgetId} .widget-progress-label {
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--chat-text);
    }

    /* Color Picker Widget Styles */
    #${widgetId} .widget-color-picker {
      margin-top: 8px;
      padding: 16px;
      background: var(--chat-surface);
      border-radius: 8px;
      border: 1px solid var(--chat-border);
    }
    
    #${widgetId} .widget-color-label {
      display: block;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--chat-text);
    }
    
    #${widgetId} .widget-color-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    #${widgetId} .widget-color-input {
      width: 50px;
      height: 40px;
      border: 2px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      background: var(--chat-bg);
      padding: 0;
    }
    
    #${widgetId} .widget-color-input::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    #${widgetId} .widget-color-input::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
    
    #${widgetId} .widget-color-display {
      flex: 1;
      padding: 8px 12px;
      background: var(--chat-bg);
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      font-family: monospace;
      font-size: 14px;
      color: var(--chat-text);
      text-align: center;
    }
    
    #${widgetId} .widget-color-presets {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    
    #${widgetId} .widget-color-preset {
      width: 32px;
      height: 32px;
      border: 2px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    #${widgetId} .widget-color-preset:hover {
      border-color: var(--chat-primary);
      transform: scale(1.1);
    }
    
    #${widgetId} .widget-color-submit {
      width: 100%;
      padding: 10px 16px;
      background: var(--chat-bg);
      color: var(--chat-text);
      border: 1px solid var(--chat-border);
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    #${widgetId} .widget-color-submit:hover:not(:disabled) {
      background: var(--chat-primary);
      color: white;
      border-color: var(--chat-primary);
    }
    
    #${widgetId} .widget-color-input.widget-color-disabled,
    #${widgetId} .widget-color-submit.widget-color-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Waiting message styles */
    #${widgetId} .waiting-message {
      background: var(--chat-surface);
      color: var(--chat-text);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      padding: 12px 16px;
      min-width: 60px;
    }

    #${widgetId} .waiting-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    #${widgetId} .waiting-dots .dot {
      width: 8px;
      height: 8px;
      background: var(--chat-text);
      border-radius: 50%;
      opacity: 0.3;
      animation: waitingDotPulse 1.4s infinite ease-in-out both;
    }

    #${widgetId} .waiting-dots .dot:nth-child(1) {
      animation-delay: -0.32s;
    }

    #${widgetId} .waiting-dots .dot:nth-child(2) {
      animation-delay: -0.16s;
    }

    #${widgetId} .waiting-dots .dot:nth-child(3) {
      animation-delay: 0s;
    }

    @keyframes waitingDotPulse {
      0%, 80%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      40% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
    document.head.appendChild(styleElement);
  }
  function createWidgetDOM(widgetId, config) {
    const { displayMode, position, title, targetSelector } = config;
    const container = document.createElement("div");
    container.id = widgetId;
    container.className = displayMode;
    const chatWindow = document.createElement("div");
    chatWindow.className = "window";
    chatWindow.id = `${widgetId}-window`;
    if (displayMode === "popup") {
      chatWindow.style.cssText = `
      ${position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${position.includes("right") ? "right: 20px;" : "left: 20px;"}
    `;
    }
    chatWindow.innerHTML = `
    <div class="header" id="${widgetId}-header">
      <h3>${title}</h3>
      ${displayMode === "popup" ? `<button type="button" class="close" id="${widgetId}-close" aria-label="Close chat">\xD7</button>` : ""}
    </div>
    <div class="messages" id="${widgetId}-messages" role="log" aria-live="polite" aria-atomic="false"></div>
    <div class="input">
      <textarea class="textarea" id="${widgetId}-input" placeholder="Type your message... (Shift+Enter for new line)" rows="1" aria-label="Type a message"></textarea>
      <button type="button" class="send" id="${widgetId}-send" aria-label="Send message">Send</button>
    </div>
  `;
    let chatButton = null;
    if (displayMode === "popup") {
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
    if (displayMode === "fullpage" && targetSelector) {
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

  // src/modules/theme.js
  var THEMES = {
    default: {
      light: {
        primary: "#007bff",
        bg: "#ffffff",
        surface: "#f8f9fa",
        text: "#212529",
        border: "#e9ecef"
      },
      dark: {
        primary: "#4dabf7",
        bg: "#1a1a1a",
        surface: "#2d2d2d",
        text: "#ffffff",
        border: "#404040"
      }
    },
    branded: {
      light: {
        primary: "#6366f1",
        bg: "#ffffff",
        surface: "#f5f3ff",
        text: "#1e1b4b",
        border: "#e0e7ff"
      },
      dark: {
        primary: "#818cf8",
        bg: "#0f172a",
        surface: "#1e293b",
        text: "#f1f5f9",
        border: "#334155"
      }
    }
  };
  var ThemeManager = class {
    constructor(widgetId, scriptElement) {
      this.widgetId = widgetId;
      this.scriptElement = scriptElement;
      this.storageKey = `chat-widget-${widgetId}-theme`;
      this.modeStorageKey = `chat-widget-${widgetId}-mode`;
    }
    /**
     * Get theme configuration from data attributes or defaults
     */
    getThemeConfig() {
      const theme = this.getTheme();
      const mode = this.getMode();
      const customColors = this.getCustomColors(mode);
      const defaultColors = THEMES[theme]?.[mode] || THEMES.default[mode];
      return {
        theme,
        mode,
        colors: { ...defaultColors, ...customColors }
      };
    }
    /**
     * Get theme name from data attribute, localStorage, or default
     */
    getTheme() {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme && THEMES[savedTheme]) {
        return savedTheme;
      }
      if (this.scriptElement) {
        const dataTheme = this.scriptElement.getAttribute("data-theme");
        if (dataTheme && THEMES[dataTheme]) {
          return dataTheme;
        }
      }
      return "default";
    }
    /**
     * Get mode (light/dark) from data attribute, localStorage, system preference, or default
     */
    getMode() {
      const savedMode = localStorage.getItem(this.modeStorageKey);
      if (savedMode === "light" || savedMode === "dark") {
        return savedMode;
      }
      if (this.scriptElement) {
        const themeMode = this.scriptElement.getAttribute("data-theme-mode");
        if (themeMode === "light" || themeMode === "dark") {
          return themeMode;
        }
        const dataMode = this.scriptElement.getAttribute("data-mode");
        if (dataMode === "light" || dataMode === "dark") {
          return dataMode;
        }
      }
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    }
    /**
     * Get custom colors from data attributes
     */
    getCustomColors(mode) {
      if (!this.scriptElement) return {};
      const colors = {};
      const suffix = mode === "light" ? "-light" : "-dark";
      const colorMap = {
        [`data-color${suffix}`]: "primary",
        [`data-bg-color${suffix}`]: "bg",
        [`data-surface-color${suffix}`]: "surface",
        [`data-text-color${suffix}`]: "text",
        [`data-border-color${suffix}`]: "border"
      };
      const genericColorMap = {
        "data-color": "primary",
        "data-bg-color": "bg",
        "data-surface-color": "surface",
        "data-text-color": "text",
        "data-border-color": "border"
      };
      for (const [attr, prop] of Object.entries(colorMap)) {
        const value = this.scriptElement.getAttribute(attr);
        if (value) {
          colors[prop] = value;
        }
      }
      for (const [attr, prop] of Object.entries(genericColorMap)) {
        const value = this.scriptElement.getAttribute(attr);
        if (value && !colors[prop]) {
          colors[prop] = value;
        }
      }
      return colors;
    }
    /**
     * Set theme and persist to localStorage
     */
    setTheme(theme) {
      if (!THEMES[theme]) {
        console.warn(`Unknown theme: ${theme}`);
        return;
      }
      localStorage.setItem(this.storageKey, theme);
    }
    /**
     * Set mode and persist to localStorage
     */
    setMode(mode) {
      if (mode !== "light" && mode !== "dark") {
        console.warn(`Invalid mode: ${mode}`);
        return;
      }
      localStorage.setItem(this.modeStorageKey, mode);
    }
    /**
     * Toggle between light and dark mode
     */
    toggleMode() {
      const currentMode = this.getMode();
      const newMode = currentMode === "light" ? "dark" : "light";
      this.setMode(newMode);
      return newMode;
    }
    /**
     * Listen for system theme changes
     */
    watchSystemTheme(callback) {
      if (!window.matchMedia) return;
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => {
        if (!localStorage.getItem(this.modeStorageKey)) {
          const newMode = e.matches ? "dark" : "light";
          callback(newMode);
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
      } else {
        mediaQuery.addListener(handler);
      }
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handler);
        } else {
          mediaQuery.removeListener(handler);
        }
      };
    }
  };

  // src/modules/chat-widget.class.js
  var ChatWidget = class {
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
          displayMode,
          position: scriptElement.getAttribute("data-position"),
          primaryColor: scriptElement.getAttribute("data-color"),
          title: scriptElement.getAttribute("data-title"),
          targetSelector: scriptElement.getAttribute("data-target"),
          serverUrl: scriptElement.getAttribute("data-server-url"),
          forceJsonP: scriptElement.getAttribute("data-force-jsonp") === "true",
          preferJsonP: scriptElement.getAttribute("data-prefer-jsonp") === "true"
        };
      } else {
        config = input || {};
      }
      this.scriptElement = scriptElement;
      this.widgetId = config.id || "chat-widget-" + Math.random().toString(36).substr(2, 9);
      const explicitColor = config.primaryColor || config.color;
      this.themeManager = new ThemeManager(this.widgetId, scriptElement);
      const themeConfig = this.themeManager.getThemeConfig();
      this.config = {
        displayMode: config.displayMode || config.mode || "popup",
        position: config.position || "bottom-right",
        primaryColor: explicitColor || themeConfig.colors.primary,
        explicitColor,
        // Store this to know if we should force it as inline style
        title: config.title || "Chat with us",
        targetSelector: config.targetSelector || config.target || null,
        serverUrl: config.serverUrl || "http://localhost:3000",
        theme: themeConfig.theme,
        themeMode: themeConfig.mode,
        themeColors: themeConfig.colors
      };
      this.api = new HybridChatAPI({ serverUrl: this.config.serverUrl });
      this.state = {
        isOpen: false,
        messages: []
      };
      this.init();
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
      this.container.setAttribute("data-theme", this.config.theme);
      this.container.setAttribute("data-mode", this.config.themeMode);
      this.applyCustomColors();
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
        const suffix = mode === "light" ? "-light" : "-dark";
        const colorMap = {
          [`data-color${suffix}`]: "--chat-primary",
          [`data-bg-color${suffix}`]: "--chat-bg",
          [`data-surface-color${suffix}`]: "--chat-surface",
          [`data-text-color${suffix}`]: "--chat-text",
          [`data-border-color${suffix}`]: "--chat-border"
        };
        const genericColorMap = {
          "data-color": "--chat-primary",
          "data-bg-color": "--chat-bg",
          "data-surface-color": "--chat-surface",
          "data-text-color": "--chat-text",
          "data-border-color": "--chat-border"
        };
        for (const [attr, cssVar] of Object.entries(colorMap)) {
          const value = this.scriptElement.getAttribute(attr);
          if (value) {
            this.container.style.setProperty(cssVar, value);
            if (cssVar === "--chat-primary") {
              this.container.style.setProperty("--chat-primary-dark", adjustColor(value, -20));
            }
          }
        }
        for (const [attr, cssVar] of Object.entries(genericColorMap)) {
          const value = this.scriptElement.getAttribute(attr);
          if (value && !this.container.style.getPropertyValue(cssVar)) {
            this.container.style.setProperty(cssVar, value);
            if (cssVar === "--chat-primary") {
              this.container.style.setProperty("--chat-primary-dark", adjustColor(value, -20));
            }
          }
        }
      }
      if (this.config.explicitColor && !this.container.style.getPropertyValue("--chat-primary")) {
        this.container.style.setProperty("--chat-primary", this.config.explicitColor);
        this.container.style.setProperty("--chat-primary-dark", adjustColor(this.config.explicitColor, -20));
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
    /**
     * Setup auto-resize behavior for textarea
     * @private
     */
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
        const waitingMessageId = this.addWaitingMessage();
        this.api.sendMessage(message, (text2, sender, widgetData) => {
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
      const messageText = interaction.optionText;
      this.addMessage(messageText, "user");
      const waitingMessageId = this.addWaitingMessage();
      this.api.sendMessage(interaction.optionValue, (text, sender, widgetData) => {
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
        colors: this.config.themeColors
      };
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
