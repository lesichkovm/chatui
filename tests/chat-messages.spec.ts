import { test, expect } from "@playwright/test";

test.describe("Chat Widget - Message Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tests/test.html");
  });

  test("should type message in input field", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    await expect(messageInput).toBeVisible();

    await messageInput.fill("Hello, this is a test message");

    const inputValue = await messageInput.inputValue();
    expect(inputValue).toBe("Hello, this is a test message");
  });

  test("should clear input field after sending message", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    await messageInput.fill("Test message");
    await sendButton.click();

    const inputValue = await messageInput.inputValue();
    expect(inputValue).toBe("");
  });

  test("should display sent message in chat window", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    const testMessage = "Hello, this is a test message";
    await messageInput.fill(testMessage);
    await sendButton.click();

    const messagesContainer = page.locator("#chat-widget-1-messages");
    await expect(messagesContainer).toBeVisible();

    // Verify the user message is present in the list
    const userMessage = messagesContainer.locator(`.user-message:has-text("${testMessage}")`);
    await expect(userMessage).toBeVisible();
  });

  test("should not send empty message", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    // Wait for widget to settle and get initial message count
    await page.waitForTimeout(500);

    // Count messages before attempting to send empty message
    const messagesContainer = page.locator("#chat-widget-1-messages");
    const messageElementsBefore = messagesContainer.locator(
      '[id^="chat-widget-1-message-"]',
    );
    const countBefore = await messageElementsBefore.count();

    // Try to send empty message
    await messageInput.fill("");
    await sendButton.click();

    // Count messages after attempting to send empty
    await page.waitForTimeout(300);
    const messageElementsAfter = messagesContainer.locator(
      '[id^="chat-widget-1-message-"]',
    );
    const countAfter = await messageElementsAfter.count();

    // Message count should NOT increase when sending empty message
    expect(countAfter).toBe(countBefore);
  });

  test("should send message on Enter key press", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");

    const testMessage = "Message sent with Enter key";
    await messageInput.fill(testMessage);
    await messageInput.press("Enter");

    const messagesContainer = page.locator("#chat-widget-1-messages");
    
    // Verify the user message is present
    const userMessage = messagesContainer.locator(`.user-message:has-text("${testMessage}")`);
    await expect(userMessage).toBeVisible();
  });

  test("should display multiple messages in order", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    // Set up test environment to ensure proper responses
    await page.evaluate(() => {
      const scriptElement = document.querySelector(
        'script[id^="chat-widget-"]',
      );
      if (scriptElement && (scriptElement as any)._chatWidgetInstance) {
        const widget = (scriptElement as any)._chatWidgetInstance;
        if (widget && widget.api) {
          widget.api.isTestEnvironment = () => true;
          widget.minMessageInterval = 100; // 100ms instead of 1s
        }
      }
    });

    const messages = ["First message", "Second message", "Third message"];

    for (const message of messages) {
      await messageInput.fill(message);
      await sendButton.click();
      await page.waitForTimeout(150);
      await page.waitForTimeout(300);
    }

    const messagesContainer = page.locator("#chat-widget-1-messages");
    const userMessages = messagesContainer.locator(".user-message");
    const userMessageCount = await userMessages.count();

    expect(userMessageCount).toBeGreaterThanOrEqual(messages.length);

    // Verify user messages are present in order
    for (let i = 0; i < messages.length; i++) {
      const userMessage = userMessages.nth(userMessageCount - messages.length + i);
      await expect(userMessage).toContainText(messages[i]);
    }
  });

  test("should scroll to latest message", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    for (let i = 0; i < 10; i++) {
      await messageInput.fill(`Message ${i + 1}`);
      await sendButton.click();
      await page.waitForTimeout(150);
    }

    const messagesContainer = page.locator("#chat-widget-1-messages");
    const lastMessage = messagesContainer.locator(".user-message").last();

    await expect(lastMessage).toBeInViewport();
  });

  test("should maintain message history when closing and reopening", async ({
    page,
  }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    const testMessage = "Persistent message";
    await messageInput.fill(testMessage);
    await sendButton.click();

    await page.waitForTimeout(150);

    const closeButton = page.locator("#chat-widget-1-close");
    await closeButton.click();

    const chatWindow = page.locator("#chat-widget-1-window");
    await expect(chatWindow).not.toBeVisible();

    await widgetButton.click();
    await expect(chatWindow).toBeVisible();

    const messagesContainer = page.locator("#chat-widget-1-messages");
    const userMessage = messagesContainer.locator(`.user-message:has-text("${testMessage}")`);
    await expect(userMessage).toBeVisible();
  });

  test("should show waiting message when sending message", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    // Increase delay to catch the waiting message
    await page.evaluate(() => {
      const scriptElement = document.querySelector('script[id^="chat-widget-"]');
      if (scriptElement && (scriptElement as any)._chatWidgetInstance) {
        const widget = (scriptElement as any)._chatWidgetInstance;
        widget.api.sendMessage = (msg, onSuccess) => {
          setTimeout(() => {
            if (onSuccess) onSuccess(`Echo: ${msg}`, 'bot');
          }, 1000);
        };
      }
    });

    await messageInput.fill("Test waiting message");
    await sendButton.click();

    const messagesContainer = page.locator("#chat-widget-1-messages");
    const waitingMessage = messagesContainer.locator(".waiting-message");
    await expect(waitingMessage).toBeVisible();

    const waitingDots = waitingMessage.locator(".waiting-dots");
    await expect(waitingDots).toBeVisible();
    await expect(waitingDots.locator(".dot")).toHaveCount(3);
  });

  test("should remove waiting message when response arrives", async ({
    page,
  }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    // Set up delayed response
    await page.evaluate(() => {
      const scriptElement = document.querySelector('script[id^="chat-widget-"]');
      if (scriptElement && (scriptElement as any)._chatWidgetInstance) {
        const widget = (scriptElement as any)._chatWidgetInstance;
        widget.api.sendMessage = (msg, onSuccess) => {
          setTimeout(() => {
            if (onSuccess) onSuccess(`Response to: ${msg}`, 'bot');
          }, 500);
        };
      }
    });

    await messageInput.fill("Test waiting removal");
    await sendButton.click();

    const messagesContainer = page.locator("#chat-widget-1-messages");
    const waitingMessage = messagesContainer.locator(".waiting-message");
    await expect(waitingMessage).toBeVisible();

    // Wait for bot response
    await page.waitForSelector(".bot-message:not(.waiting-message)", { timeout: 5000 });

    // Verify waiting message is gone
    await expect(waitingMessage).not.toBeVisible();
    
    const botMessages = messagesContainer.locator(".bot-message:not(.waiting-message)");
    await expect(botMessages.last()).toContainText("Response to: Test waiting removal");
  });

  test("should show waiting message for widget interactions", async ({
    page,
  }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    // Setup delayed response for all API calls
    await page.evaluate(() => {
      const scriptElement = document.querySelector('script[id^="chat-widget-"]');
      if (scriptElement && (scriptElement as any)._chatWidgetInstance) {
        const widget = (scriptElement as any)._chatWidgetInstance;
        widget.api.sendMessage = (msg, onSuccess) => {
          // If it's a widget request
          if (msg === "show buttons") {
            const data = {
              type: "buttons",
              props: { options: [{ id: "opt1", text: "Click Me", value: "clicked" }] }
            };
            setTimeout(() => onSuccess("Here are buttons:", "bot", data), 100);
          } else {
            // For other interactions, delay more so we can see the waiting dots
            setTimeout(() => onSuccess(`Action: ${msg}`, "bot"), 1000);
          }
        };
      }
    });

    await messageInput.fill("show buttons");
    await sendButton.click();

    // Wait for buttons to appear
    const widgetButton1 = page.locator(".widget-button").first();
    await expect(widgetButton1).toBeVisible();

    // Click widget button
    await widgetButton1.click();

    // Check for waiting message
    const waitingMessage = page.locator(".waiting-message");
    await expect(waitingMessage).toBeVisible();
  });

  test("should render composable widget array from bot", async ({ page }) => {
    const widgetButton = page.locator("#chat-widget-1-button");
    await widgetButton.click();

    const messageInput = page.locator("#chat-widget-1-input");
    const sendButton = page.locator("#chat-widget-1-send");

    // Set up mock to return a widget array (new format)
    await page.evaluate(() => {
      const scriptElement = document.querySelector('script[id^="chat-widget-"]');
      if (scriptElement && (scriptElement as any)._chatWidgetInstance) {
        const widget = (scriptElement as any)._chatWidgetInstance;
        widget.api.sendMessage = (msg, onSuccess) => {
          const widgets = [
            {
              type: 'text',
              props: { content: 'Dynamic Text', format: 'plain' }
            },
            {
              type: 'input',
              props: { placeholder: 'Dynamic Input' }
            }
          ];
          // Simulate receiving widgets array as the first argument
          setTimeout(() => onSuccess(widgets, 'bot'), 100);
        };
      }
    });

    await messageInput.fill("trigger widgets");
    await sendButton.click();

    const messagesContainer = page.locator("#chat-widget-1-messages");
    
    // Check that we DON'T see [object Object]
    // Filter for bot messages that are NOT waiting messages
    const lastBotMessage = messagesContainer.locator(".bot-message:not(.waiting-message)").last();
    await expect(lastBotMessage).toBeVisible();
    const content = await lastBotMessage.innerHTML();
    
    // This is the key check for the shortcoming: it should NOT be stringified objects
    expect(content).not.toContain("[object Object]");

    // Verify individual widgets are rendered
    const widgetText = lastBotMessage.locator(".widget-text");
    const widgetInput = lastBotMessage.locator(".widget-input-element");
    
    await expect(widgetText).toHaveText("Dynamic Text");
    await expect(widgetInput).toHaveAttribute("placeholder", "Dynamic Input");
  });
});