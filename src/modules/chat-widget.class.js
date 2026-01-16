import { ChatAPI } from './api.js';
import { injectStyles, createWidgetDOM } from './ui.js';

export class ChatWidget {
  constructor(scriptElement) {
    if (scriptElement._chatWidgetInitialized) return;
    scriptElement._chatWidgetInitialized = true;

    this.scriptElement = scriptElement;
    this.widgetId =
      scriptElement.id ||
      "chat-widget-" + Math.random().toString(36).substr(2, 9);

    // Config
    this.config = {
      mode: scriptElement.getAttribute("data-mode") || "popup",
      position: scriptElement.getAttribute("data-position") || "bottom-right",
      primaryColor: scriptElement.getAttribute("data-color") || "#007bff",
      title: scriptElement.getAttribute("data-title") || "Chat with us",
      targetSelector: scriptElement.getAttribute("data-target"),
      serverUrl:
        scriptElement.getAttribute("data-server-url") ||
        "http://localhost:3000",
    };

    this.api = new ChatAPI({ serverUrl: this.config.serverUrl });
    this.isOpen = false;

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

    // Get elements
    this.messagesContainer = this.chatWindow.querySelector(".messages");
    this.textarea = this.chatWindow.querySelector(".textarea");
    this.sendButton = this.chatWindow.querySelector(".send");
    this.closeButton = this.chatWindow.querySelector(".close");

    this.bindEvents();
    this.api.performHandshake();
    this.api.connect((text, sender) => this.addMessage(text, sender));
  }

  bindEvents() {
    // Toggle logic
    if (this.chatButton) {
      this.chatButton.addEventListener("click", () => this.toggle());
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => this.close());
    }

    // Send logic
    this.textarea.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.sendButton.addEventListener("click", () => this.sendMessage());

    // Auto resize
    this.setupTextareaAutoResize();
  }

  setupTextareaAutoResize() {
    // Set initial height
    this.textarea.style.height = "auto";
    this.textarea.style.height = this.textarea.scrollHeight + "px";

    // Setup resize observer
    const resizeObserver = new ResizeObserver(() => {
      const maxHeight = 150; // Maximum height before scrolling
      this.textarea.style.height = "auto";
      const newHeight = Math.min(this.textarea.scrollHeight, maxHeight);
      this.textarea.style.height = newHeight + "px";
      this.textarea.style.overflowY =
        this.textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    });

    resizeObserver.observe(this.textarea);
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.chatWindow.classList.add("window-open");
    if (this.chatButton) {
      this.chatButton.style.display = "flex"; // Keep logic from legacy
      this._updateButtonPosition(true);
    }
  }

  close() {
    this.isOpen = false;
    this.chatWindow.classList.remove("window-open");
    if (this.chatButton) {
      this.chatButton.style.display = "flex";
      this._updateButtonPosition(false);
    }
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

  sendMessage() {
    const message = this.textarea.value.trim();
    if (message) {
      this.addMessage(message, "user");
      this.api.sendMessage(message, (text, sender) =>
        this.addMessage(text, sender)
      );
      this.textarea.value = "";
      this.textarea.style.height = "auto";
    }
  }

  addMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}-message`;
    messageElement.id = `${this.widgetId}-message-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    messageElement.innerHTML = text.replace(/\n/g, "<br>");
    this.messagesContainer.appendChild(messageElement);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}
