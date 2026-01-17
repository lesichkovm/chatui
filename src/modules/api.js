import { ChatAPI } from './api-legacy.js';
import { CorsAPI } from './api-cors.js';

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
    if (this.connectionType === 'websocket') {
      // For WebSocket, we use the parent ChatAPI
      this.apiType = 'websocket';
    } else {
      // For HTTP/HTTPS, choose between CORS and JSONP
      if (this.forceJsonP || this.preferJsonP) {
        // Use JSONP (legacy behavior)
        this.apiType = 'jsonp';
      } else {
        // Use CORS API by default
        this.corsApi = new CorsAPI(this.config);
        this.apiType = 'cors';
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
      
      if (url.protocol === 'wss:' || url.protocol === 'ws:') {
        return 'websocket';
      } else if (url.protocol === 'https:' || url.protocol === 'http:') {
        return 'http';
      }
    } catch (error) {
      console.warn('ChatWidget: Invalid server URL, defaulting to HTTP');
    }
    
    return 'http';
  }

  /**
   * Perform handshake using appropriate connection method
   * @param {Function} onSuccess - Callback function called on successful handshake
   */
  performHandshake(onSuccess) {
    if (this.connectionType === 'websocket') {
      this.performWebSocketHandshake(onSuccess);
    } else if (this.apiType === 'cors') {
      this.performCorsHandshake(onSuccess);
    } else {
      super.performHandshake(onSuccess);
    }
  }

  /**
   * Perform CORS handshake with fallback to JSONP
   * @private
   * @param {Function} onSuccess - Callback function called on successful handshake
   */
  performCorsHandshake(onSuccess) {
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
          console.error('ChatWidget: Handshake failed', error);
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
    
    // Check for CORS-specific errors
    return errorMessage.includes('CORS_ERROR') || 
           errorMessage.includes('Failed to fetch') ||
           errorMessage.includes('Network request failed');
  }

  /**
   * Fallback from CORS to JSONP API
   */
  fallbackToJSONP() {
    this.fallbackAttempts++;
    this.apiType = 'jsonp';
    console.warn('ChatWidget: Falling back to JSONP due to CORS issues');
  }

  /**
   * Perform WebSocket-specific handshake
   * @private
   * @param {Function} onSuccess - Callback function called on successful handshake
   */
  performWebSocketHandshake(onSuccess) {
    if (this.isTestEnvironment()) {
      this.setSessionKey('test-session-key');
      if (onSuccess) onSuccess();
      return;
    }

    this.initWebSocket().then(() => {
      if (!this.wsConnection) return;
      
      this.wsConnection.send(JSON.stringify({
        type: 'handshake',
        timestamp: Date.now()
      }));

      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'handshake' && data.status === 'success') {
          this.setSessionKey(data.session_key);
          if (onSuccess) onSuccess();
        }
      };
    }).catch((error) => {
      console.error('ChatWidget: WebSocket handshake failed', error);
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
    if (this.connectionType === 'websocket') {
      this.connectWebSocket(onMessage);
    } else if (this.apiType === 'cors') {
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
          console.error('ChatWidget: Connect failed', error);
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
        type: 'connect',
        session_key: this.getSessionKey(),
        timestamp: Date.now()
      }));
      
      // Set up message handler even if already connected
      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          if (onMessage) {
            if (data.widget) {
              onMessage(data.text, 'bot', data.widget);
            } else {
              onMessage(data.text, 'bot');
            }
          }
        } else if (data.type === 'typing') {
          this.handleTypingIndicator(data);
        } else if (data.type === 'read_receipt') {
          this.handleReadReceipt(data);
        }
      };
      return;
    }

    this.initWebSocket().then(() => {
      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          if (onMessage) {
            if (data.widget) {
              onMessage(data.text, 'bot', data.widget);
            } else {
              onMessage(data.text, 'bot');
            }
          }
        } else if (data.type === 'typing') {
          this.handleTypingIndicator(data);
        } else if (data.type === 'read_receipt') {
          this.handleReadReceipt(data);
        }
      };
    }).catch((error) => {
      console.error('ChatWidget: WebSocket connection failed', error);
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
    if (this.connectionType === 'websocket') {
      this.sendWebSocketMessage(message, onResponse);
    } else if (this.apiType === 'cors') {
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
        // CORS failed, try fallback to JSONP
        if (this.shouldFallbackToJSONP(error)) {
          this.fallbackToJSONP();
          super.sendMessage(message, onResponse);
        } else {
          console.error('ChatWidget: SendMessage failed', error);
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
        type: 'message',
        payload: message,
        session_key: this.getSessionKey(),
        timestamp: Date.now()
      }));

      if (onResponse) {
        this.wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'message' || data.type === 'message:stream') {
            if (data.widget) {
              onResponse(data.text, 'bot', data.widget);
            } else {
              onResponse(data.text, 'bot');
            }
          }
        };
      }
    } else {
      console.warn('ChatWidget: WebSocket not connected, queuing message');
      this.messageQueue.push({ message, onResponse });
    }
  }

  /**
   * Send typing indicator via WebSocket
   * @param {boolean} isTyping - Whether the user is typing
   */
  sendTypingIndicator(isTyping) {
    if (this.connectionType === 'websocket' && this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: 'typing',
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
    if (this.connectionType === 'websocket' && this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: 'read_receipt',
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
          console.error('ChatWidget: WebSocket error', error);
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
    const event = new CustomEvent('chatwidget:typing', {
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
    const event = new CustomEvent('chatwidget:read_receipt', {
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
}
