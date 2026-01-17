/**
 * CORS-based API implementation using modern fetch API
 * Provides secure, modern HTTP communication with proper error handling
 */
export class CorsAPI {
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
    this.timeout = config.timeout || 5000;
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
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      // Check for CORS issues
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response content type. Expected JSON.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Detect CORS-specific errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('CORS_ERROR: ' + error.message);
      } else if (error.name === 'AbortError') {
        throw new Error('TIMEOUT_ERROR: Request timed out');
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
        method: 'POST',
        body: JSON.stringify({ type: 'handshake', timestamp: Date.now() })
      });

      if (response.status === "success") {
        this.setSessionKey(response.session_key);
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Handshake failed: Invalid response status');
      }
    } catch (error) {
      if (this.debug) {
        console.error('ChatWidget: CORS handshake failed', error);
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
        method: 'POST',
        body: JSON.stringify({
          type: 'connect',
          session_key: sessionKey,
          timestamp: Date.now()
        })
      });

      if (onMessage) {
        if (response.widget) {
          onMessage(response.text, "bot", response.widget);
        } else {
          onMessage(response.text, "bot");
        }
      }
    } catch (error) {
      if (this.debug) {
        console.error('ChatWidget: CORS connect failed', error);
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
      // Simulate a delayed response in test environment
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
        method: 'POST',
        body: JSON.stringify({
          type: 'message',
          message: message,
          session_key: sessionKey,
          timestamp: Date.now()
        })
      });

      if (onResponse) {
        if (response.widget) {
          onResponse(response.text, "bot", response.widget);
        } else {
          onResponse(response.text, "bot");
        }
      }
    } catch (error) {
      if (this.debug) {
        console.error('ChatWidget: CORS sendMessage failed', error);
      }
      if (onError) onError(error);
    }
  }
}
