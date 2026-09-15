/**
 * Base API functionality shared between LegacyAPI and CorsAPI
 * Provides session management and environment detection
 */
export class BaseAPI {
  /**
   * Get the stored session key from sessionStorage
   * @returns {string} The stored session key or empty string
   */
  getSessionKey() {
    if (typeof sessionStorage !== "undefined") {
      return sessionStorage.getItem("chat_session_key") || "";
    }

    // Fallback for test environment - use localStorage mock if available
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("chat_session_key") || "";
    }

    // Fallback for test environment using global mock
    if (
      this.isTestEnvironment() &&
      typeof global !== "undefined" &&
      global.localStorage
    ) {
      return global.localStorage.getItem("chat_session_key") || "";
    }

    return "";
  }

  /**
   * Store a session key in sessionStorage (more secure than localStorage)
   * @param {string} key - The session key to store
   */
  setSessionKey(key) {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("chat_session_key", key);
    } else if (typeof localStorage !== "undefined") {
      localStorage.setItem("chat_session_key", key);
    } else if (
      this.isTestEnvironment() &&
      typeof global !== "undefined" &&
      global.localStorage
    ) {
      // Fallback for test environment using global mock
      global.localStorage.setItem("chat_session_key", key);
    }
  }

  /**
   * Resolve a configured endpoint URL against the server URL
   * Absolute URLs (http/https) are used as-is; paths are resolved against
   * serverUrl. Falls back to the default path when the value is missing or
   * invalid.
   * @protected
   * @param {string} [url] - Configured endpoint URL or path
   * @param {string} defaultPath - Default path appended to serverUrl
   * @returns {string} Resolved endpoint URL
   */
  _resolveEndpointUrl(url, defaultPath) {
    if (!url) {
      return `${this.serverUrl}${defaultPath}`;
    }
    try {
      return new URL(url, `${this.serverUrl}/`).toString();
    } catch (error) {
      console.warn(
        `ChatWidget: Invalid endpoint URL "${url}", falling back to ${defaultPath}`,
      );
      return `${this.serverUrl}${defaultPath}`;
    }
  }

  /**
   * Append a query string to a URL, using "&" when the URL already has one
   * @protected
   * @param {string} url - Base URL
   * @param {string} query - Query string without leading "?"
   * @returns {string} URL with the query appended
   */
  _appendQuery(url, query) {
    return url + (url.includes("?") ? "&" : "?") + query;
  }

  /**
   * Check if running in test environment (localhost:32000)
   * @returns {boolean} True if in test environment
   */
  isTestEnvironment() {
    return (
      (typeof window !== "undefined" && window.__CHAT_WIDGET_TEST_MODE__) ||
      (typeof window !== "undefined" &&
        window.location &&
        window.location.hostname === "localhost" &&
        window.location.port === "32000")
    );
  }
}
