/**
 * ChatAPI class for handling JSONP-based communication with chat server
 * Provides basic chat functionality using JSONP requests for cross-domain compatibility
 */
export class ChatAPI {
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
    return (
      typeof window !== "undefined" &&
      window.location &&
      window.location.hostname === "localhost" &&
      window.location.port === "32000"
    );
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
        // Check if response contains widget data
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
      // Simulate a delayed response in test environment
      setTimeout(() => {
        if (onResponse) {
          // Simple test response
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
        // Check if response contains widget data
        if (response.widget) {
          onResponse(response.text, "bot", response.widget);
        } else {
          onResponse(response.text, "bot");
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

    window[callbackName] = function (response) {
      handler(response);
      delete window[callbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };

    document.body.appendChild(script);
  }
}
