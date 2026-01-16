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

  isDevEnvironment() {
    return (
      this.serverUrl === "http://localhost:3000" &&
      typeof window !== "undefined" &&
      window.location &&
      window.location.hostname === "localhost"
    );
  }

  performHandshake(onSuccess) {
    if (this.isDevEnvironment()) {
      this.setSessionKey("test-session-key");
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
    if (this.isDevEnvironment()) {
      return;
    }

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
    if (this.isDevEnvironment()) {
      return;
    }

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
