export class ChatAPI {
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

  performHandshake(onSuccess) {
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
    const sessionKey = this.getSessionKey();
    const callbackName = "connectCallback_" + Date.now();
    const url = `${this.serverUrl}/api/messages?callback=${callbackName}&type=connect&session_key=${encodeURIComponent(
      sessionKey
    )}`;

    this._injectScript(url, callbackName, (response) => {
      if (onMessage) onMessage(response.text, "bot");
    });
  }

  sendMessage(message, onResponse) {
    const sessionKey = this.getSessionKey();
    const callbackName = "chatCallback_" + Date.now();
    const url = `${this.serverUrl}/api/messages?callback=${callbackName}&message=${encodeURIComponent(
      message
    )}&session_key=${encodeURIComponent(sessionKey)}`;

    this._injectScript(url, callbackName, (response) => {
      if (onResponse) onResponse(response.text, "bot");
    });
  }

  _injectScript(url, callbackName, handler) {
    const script = document.createElement("script");
    script.src = url;
    
    // Add error handling
    script.onerror = () => {
      console.error(`ChatWidget: Failed to load ${url}`);
      // Clean up global callback to avoid memory leaks
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