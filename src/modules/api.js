import { LegacyAPI as ChatAPI } from "./api-legacy.js";
import { CorsAPI } from "./api-cors.js";

/**
 * HybridChatAPI extends ChatAPI with WebSocket and CORS support
 * Automatically detects and uses WebSocket when available, falls back to CORS then JSONP
 */
export class HybridChatAPI extends ChatAPI {
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
    // Always call super first
    super(config);

    this.config = config;
    this.serverUrl = config.serverUrl;
    this.debug = config.debug || false;
    this.timeout = config.timeout || 5000;
    this.fallbackRetries = config.fallbackRetries || 2;
    this.forceJsonP = config.forceJsonP || false;
    this.preferJsonP = config.preferJsonP || false;

    this.wsConnection = null;
    this.connectionType = this.detectConnectionType(config.serverUrl);
    this.messageQueue = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.fallbackAttempts = 0;

    // Initialize appropriate API instance
    this.initializeApi();
  }

  /**
   * Initialize the appropriate API instance based on configuration
   * @private
   */
  initializeApi() {
    if (this.connectionType === "websocket") {
      // For WebSocket, we use the parent ChatAPI
      this.apiType = "websocket";
    } else {
      // For HTTP/HTTPS, choose between CORS and JSONP
      if (this.forceJsonP || this.preferJsonP) {
        // Use JSONP (legacy behavior)
        this.apiType = "jsonp";
      } else {
        // Use CORS API by default
        this.corsApi = new CorsAPI(this.config);
        this.apiType = "cors";
      }
    }
  }

  /**
   * Detect connection type based on server URL protocol with security enforcement
   * @private
   * @param {string} serverUrl - Server URL to analyze
   * @returns {string} Connection type ('websocket' or 'http')
   */
  detectConnectionType(serverUrl) {
    try {
      const url = new URL(serverUrl);

      if (url.protocol === "wss:") {
        return "websocket";
      } else if (url.protocol === "ws:") {
        // Warn about insecure WebSocket protocol
        console.warn(
          "ChatWidget: Insecure WebSocket protocol (ws:) detected. Please use WSS for secure connections.",
        );
        // In production, reject insecure connections
        if (this.isProductionEnvironmentSafe()) {
          console.error(
            "ChatWidget: Insecure WebSocket connections not allowed in production",
          );
          return "http"; // Fallback to HTTP-based methods
        }
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
    if (this.isTestEnvironment()) {
      this.setSessionKey("test-session-key");
      if (onSuccess) onSuccess();
      return;
    }

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
        // CORS succeeded, copy session key to parent
        this.setSessionKey(this.corsApi.getSessionKey());
        if (onSuccess) onSuccess();
      },
      (error) => {
        // CORS failed, try fallback to JSONP
        if (this.shouldFallbackToJSONP(error)) {
          this.fallbackToJSONP();
          super.performHandshake(onSuccess);
        } else {
          console.error("ChatWidget: Handshake failed", error);
          if (onError) onError(error);
        }
      },
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

    // Check for CORS-specific errors
    return (
      errorMessage.includes("CORS_ERROR") ||
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("Network request failed")
    );
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

    this.initWebSocket()
      .then(() => {
        if (!this.wsConnection) return;

        this.wsConnection.send(
          JSON.stringify({
            type: "handshake",
            timestamp: Date.now(),
          }),
        );

        this.wsConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "handshake" && data.status === "success") {
              this.setSessionKey(data.session_key);
              if (onSuccess) onSuccess();
            }
          } catch (error) {
            console.error(
              "ChatWidget: Invalid WebSocket message format:",
              error,
            );
            if (this.debug) {
              console.error("Received data:", event.data);
            }
          }
        };
      })
      .catch((error) => {
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
        // CORS failed, try fallback to JSONP
        if (this.shouldFallbackToJSONP(error)) {
          this.fallbackToJSONP();
          super.connect(onMessage);
        } else {
          console.error("ChatWidget: Connect failed", error);
        }
      },
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
      this.wsConnection.send(
        JSON.stringify({
          type: "connect",
          session_key: this.getSessionKey(),
          timestamp: Date.now(),
        }),
      );

      // Set up message handler even if already connected
      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle both old format (status: success) and new format (type: message)
          if (
            data.type === "message" ||
            (data.status === "success" && (data.widgets || data.text))
          ) {
            if (onMessage) {
              if (data.widgets && Array.isArray(data.widgets)) {
                // New composable widget format
                onMessage(data.widgets, "bot");
              } else if (data.text) {
                // Backward compatibility: old format with text field
                if (data.widget) {
                  onMessage(data.text, "bot", data.widget);
                } else {
                  onMessage(data.text, "bot");
                }
              }
            }
          } else if (data.type === "typing") {
            this.handleTypingIndicator(data);
          } else if (data.type === "read_receipt") {
            this.handleReadReceipt(data);
          }
        } catch (error) {
          console.error("ChatWidget: Invalid WebSocket message format:", error);
          if (this.debug) {
            console.error("Received data:", event.data);
          }
        }
      };
      return;
    }

    this.initWebSocket()
      .then(() => {
        this.wsConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle both old format (status: success) and new format (type: message)
            if (
              data.type === "message" ||
              (data.status === "success" && (data.widgets || data.text))
            ) {
              if (onMessage) {
                if (data.widgets && Array.isArray(data.widgets)) {
                  // New composable widget format
                  onMessage(data.widgets, "bot");
                } else if (data.text) {
                  // Backward compatibility: old format with text field
                  if (data.widget) {
                    onMessage(data.text, "bot", data.widget);
                  } else {
                    onMessage(data.text, "bot");
                  }
                }
              }
            } else if (data.type === "typing") {
              this.handleTypingIndicator(data);
            } else if (data.type === "read_receipt") {
              this.handleReadReceipt(data);
            }
          } catch (error) {
            console.error(
              "ChatWidget: Invalid WebSocket message format:",
              error,
            );
            if (this.debug) {
              console.error("Received data:", event.data);
            }
          }
        };
      })
      .catch((error) => {
        console.error("ChatWidget: WebSocket connection failed", error);
      });
  }

  /**
   * Send message using appropriate connection method
   * @param {string} message - The message to send
   * @param {Function} onSuccess - Callback function for server response
   * @param {Function} [onError] - Optional error callback
   * @param {string} onSuccess.text - Response text
   * @param {string} onSuccess.sender - Response sender ('bot')
   * @param {Object} [onSuccess.widget] - Optional widget data
   */
  sendMessage(message, onSuccess, onError) {
    if (this.connectionType === "websocket") {
      this.sendWebSocketMessage(message, onSuccess, onError);
    } else if (this.apiType === "cors") {
      this.sendMessageCors(message, onSuccess, onError);
    } else {
      super.sendMessage(message, onSuccess, onError);
    }
  }

  /**
   * Send message via CORS with fallback to JSONP
   * @private
   * @param {string} message - The message to send
   * @param {Function} onSuccess - Callback function for server response
   * @param {Function} [onError] - Optional error callback
   */
  sendMessageCors(message, onSuccess, onError) {
    this.corsApi.sendMessage(
      message,
      (text, sender, widget) => {
        if (onSuccess) {
          onSuccess(text, sender, widget);
        }
      },
      (error) => {
        // If error callback provided, call it
        if (onError) {
          onError(error);
          return;
        }

        // CORS failed, try fallback to JSONP
        if (this.shouldFallbackToJSONP(error)) {
          this.fallbackToJSONP();
          super.sendMessage(message, onSuccess, onError);
        } else {
          console.error("ChatWidget: SendMessage failed", error);
        }
      },
    );
  }

  /**
   * Send message via WebSocket
   * @private
   * @param {string} message - The message to send
   * @param {Function} onResponse - Callback function for server response
   */
  sendWebSocketMessage(message, onSuccess, onError) {
    if (this.isTestEnvironment()) {
      return;
    }

    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(
        JSON.stringify({
          type: "message",
          payload: message,
          session_key: this.getSessionKey(),
          timestamp: Date.now(),
        }),
      );

      if (onSuccess) {
        this.wsConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle both old format (status: success) and new format (type: message)
            if (
              data.type === "message" ||
              data.type === "message:stream" ||
              (data.status === "success" && (data.widgets || data.text))
            ) {
              if (data.widgets && Array.isArray(data.widgets)) {
                // New composable widget format
                onSuccess(data.widgets, "bot");
              } else if (data.text) {
                // Backward compatibility: old format with text field
                if (data.widget) {
                  onSuccess(data.text, "bot", data.widget);
                } else {
                  onSuccess(data.text, "bot");
                }
              }
            }
          } catch (error) {
            console.error(
              "ChatWidget: Invalid WebSocket message format:",
              error,
            );
            if (onError) {
              onError(error);
            }
            if (this.debug) {
              console.error("Received data:", event.data);
            }
          }
        };
      }
    } else {
      console.warn("ChatWidget: WebSocket not connected, queuing message");
      this.messageQueue.push({ message, onSuccess, onError });
    }
  }

  /**
   * Send typing indicator via WebSocket
   * @param {boolean} isTyping - Whether the user is typing
   */
  sendTypingIndicator(isTyping) {
    if (
      this.connectionType === "websocket" &&
      this.wsConnection?.readyState === WebSocket.OPEN
    ) {
      this.wsConnection.send(
        JSON.stringify({
          type: "typing",
          payload: { typing: isTyping },
          session_key: this.getSessionKey(),
          timestamp: Date.now(),
        }),
      );
    }
  }

  /**
   * Send read receipt via WebSocket
   * @param {string} messageId - ID of the message to mark as read
   */
  sendReadReceipt(messageId) {
    if (
      this.connectionType === "websocket" &&
      this.wsConnection?.readyState === WebSocket.OPEN
    ) {
      this.wsConnection.send(
        JSON.stringify({
          type: "read_receipt",
          payload: { message_id: messageId },
          session_key: this.getSessionKey(),
          timestamp: Date.now(),
        }),
      );
    }
  }

  /**
   * Initialize WebSocket connection with security validation
   * @returns {Promise} Promise that resolves when connection is established
   */
  initWebSocket() {
    return new Promise((resolve, reject) => {
      if (this.wsConnection?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      try {
        // Validate WebSocket URL and enforce secure connection
        const validatedUrl = this.validateWebSocketUrl(this.serverUrl);
        if (!validatedUrl) {
          reject(
            new Error(
              "Invalid or insecure WebSocket URL. Must use WSS protocol.",
            ),
          );
          return;
        }

        // Create WebSocket with security options
        this.wsConnection = new WebSocket(validatedUrl);

        this.wsConnection.onopen = () => {
          this.reconnectAttempts = 0;
          this.flushMessageQueue();
          console.log("ChatWidget: Secure WebSocket connection established");
          resolve();
        };

        this.wsConnection.onerror = (error) => {
          console.error("ChatWidget: WebSocket error", error);
          reject(error);
        };

        this.wsConnection.onclose = (event) => {
          // Log close event for security monitoring
          console.warn("ChatWidget: WebSocket connection closed", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });

          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.initWebSocket();
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };
      } catch (error) {
        console.error("ChatWidget: Failed to initialize WebSocket", error);
        reject(error);
      }
    });
  }

  /**
   * Validate WebSocket URL for security compliance
   * @private
   * @param {string} url - WebSocket URL to validate
   * @returns {string|null} Validated URL or null if invalid
   */
  validateWebSocketUrl(url) {
    try {
      const wsUrl = new URL(url);

      // Enforce WSS (secure) protocol, but allow ws:// in non-production for testing
      if (wsUrl.protocol !== "wss:" && wsUrl.protocol !== "ws:") {
        console.warn(
          "ChatWidget: Invalid WebSocket protocol. Only WS and WSS are allowed.",
        );
        return null;
      }

      // Warn about insecure protocol but allow it in non-production
      if (wsUrl.protocol === "ws:" && this.isProductionEnvironmentSafe()) {
        console.warn(
          "ChatWidget: Insecure WebSocket protocol detected. Only WSS is allowed in production.",
        );
        return null;
      }

      // Validate hostname (prevent localhost in production)
      if (this.isProductionEnvironment() && this.isLocalhost(wsUrl.hostname)) {
        console.warn(
          "ChatWidget: Localhost WebSocket not allowed in production",
        );
        return null;
      }

      // Validate port ranges
      const port =
        parseInt(wsUrl.port) || (wsUrl.protocol === "wss:" ? 443 : 80);
      if (port < 1 || port > 65535) {
        console.warn("ChatWidget: Invalid WebSocket port");
        return null;
      }

      // Ensure URL doesn't contain suspicious patterns
      if (this.containsSuspiciousPatterns(wsUrl.toString())) {
        console.warn("ChatWidget: WebSocket URL contains suspicious patterns");
        return null;
      }

      return wsUrl.toString();
    } catch (error) {
      console.error("ChatWidget: Invalid WebSocket URL format", error);
      return null;
    }
  }

  /**
   * Check if hostname is localhost
   * @private
   * @param {string} hostname - Hostname to check
   * @returns {boolean} True if hostname is localhost
   */
  isLocalhost(hostname) {
    const localhostPatterns = ["localhost", "127.0.0.1", "::1", "0.0.0.0"];

    return (
      localhostPatterns.includes(hostname.toLowerCase()) ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.")
    );
  }

  /**
   * Check if URL contains suspicious patterns
   * @private
   * @param {string} url - URL to check
   * @returns {boolean} True if suspicious patterns found
   */
  containsSuspiciousPatterns(url) {
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i,
      /<script/i,
      /onload=/i,
      /onerror=/i,
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(url));
  }

  /**
   * Check if running in production environment (safe version)
   * @private
   * @returns {boolean} True if in production
   */
  isProductionEnvironmentSafe() {
    // Check if location object exists (not available in test environments)
    if (typeof location === "undefined") {
      return false; // Assume not in production if location is undefined
    }

    // Check various indicators of production environment
    return (
      location.protocol === "https:" ||
      (location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1" &&
        !location.hostname.startsWith("192.168.") &&
        !location.hostname.startsWith("10.") &&
        !location.hostname.startsWith("172.16."))
    );
  }

  /**
   * Check if running in production environment
   * @private
   * @returns {boolean} True if in production
   */
  isProductionEnvironment() {
    return this.isProductionEnvironmentSafe();
  }

  /**
   * Send queued messages when WebSocket reconnects
   * @private
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { message, onSuccess, onError } = this.messageQueue.shift();
      this.sendWebSocketMessage(message, onSuccess, onError);
    }
  }

  /**
   * Handle typing indicator events
   * @private
   * @param {Object} data - Typing indicator data
   */
  handleTypingIndicator(data) {
    const event = new CustomEvent("chatwidget:typing", {
      detail: { typing: data.payload.typing },
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
      detail: { message_id: data.payload.message_id },
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
}
