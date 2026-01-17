import { adjustColor } from './utils.js';

export function injectStyles(widgetId, primaryColor, mode) {
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
  `;
  document.head.appendChild(styleElement);
}

export function createWidgetDOM(widgetId, config) {
  const { mode, position, title, targetSelector } = config;

  // Create the widget container
  const container = document.createElement("div");
  container.id = widgetId;
  container.className = mode;

  // Create chat window
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
      ${
        mode === "popup" ? `<button type="button" class="close" id="${widgetId}-close" aria-label="Close chat">×</button>` : ""
      }
    </div>
    <div class="messages" id="${widgetId}-messages" role="log" aria-live="polite" aria-atomic="false"></div>
    <div class="input">
      <textarea class="textarea" id="${widgetId}-input" placeholder="Type your message... (Shift+Enter for new line)" rows="1" aria-label="Type a message"></textarea>
      <button type="button" class="send" id="${widgetId}-send" aria-label="Send message">Send</button>
    </div>
  `;

  let chatButton = null;

  if (mode === "popup") {
    // Create chat button for popup mode
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

  // Append the widget to the target element or body
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

export function appendMessage(container, text, sender, widgetId, widgetData = null) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}-message`;
  messageElement.id = `${widgetId}-message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create message content
  const messageContent = document.createElement("div");
  messageContent.innerHTML = text.replace(/\n/g, "<br>");
  messageElement.appendChild(messageContent);
  
  // Add widget if present
  if (widgetData && sender === "bot") {
    const widgetElement = createWidgetElement(widgetData, widgetId);
    messageElement.appendChild(widgetElement);
  }
  
  container.appendChild(messageElement);
  container.scrollTop = container.scrollHeight;
}

function createWidgetElement(widgetData, widgetId) {
  const widgetContainer = document.createElement("div");
  widgetContainer.className = "widget";
  
  if (widgetData.type === "buttons" && widgetData.options) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "widget-buttons";
    
    widgetData.options.forEach(option => {
      const button = document.createElement("button");
      button.className = "widget-button";
      button.textContent = option.text;
      button.setAttribute("data-widget-id", widgetId);
      button.setAttribute("data-option-id", option.id);
      button.setAttribute("data-option-value", option.value);
      
      button.addEventListener("click", () => {
        // Dispatch custom event for widget interaction
        const event = new CustomEvent("widgetInteraction", {
          detail: {
            widgetId: widgetId,
            optionId: option.id,
            optionValue: option.value,
            optionText: option.text
          }
        });
        document.dispatchEvent(event);
      });
      
      buttonsContainer.appendChild(button);
    });
    
    widgetContainer.appendChild(buttonsContainer);
  }
  
  return widgetContainer;
}
