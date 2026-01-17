import { test, expect } from '@playwright/test';

test.describe('Chat Widget - Message Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
  });

  test('should type message in input field', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    await expect(messageInput).toBeVisible();
    
    await messageInput.fill('Hello, this is a test message');
    
    const inputValue = await messageInput.inputValue();
    expect(inputValue).toBe('Hello, this is a test message');
  });

  test('should clear input field after sending message', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    await messageInput.fill('Test message');
    await sendButton.click();
    
    const inputValue = await messageInput.inputValue();
    expect(inputValue).toBe('');
  });

  test('should display sent message in chat window', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    const testMessage = 'Hello, this is a test message';
    await messageInput.fill(testMessage);
    await sendButton.click();
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    await expect(messagesContainer).toBeVisible();
    
    const messageElements = messagesContainer.locator('[id^="chat-widget-1-message-"]');
    const count = await messageElements.count();
    expect(count).toBeGreaterThan(0);
    
    const lastMessage = messageElements.last();
    const messageText = await lastMessage.textContent();
    expect(messageText).toContain(testMessage);
  });

  test('should not send empty message', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    await messageInput.fill('');
    await sendButton.click();
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    const messageElements = messagesContainer.locator('[id^="chat-widget-1-message-"]');
    const count = await messageElements.count();
    
    expect(count).toBe(0);
  });

  test('should send message on Enter key press', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    
    const testMessage = 'Message sent with Enter key';
    await messageInput.fill(testMessage);
    await messageInput.press('Enter');
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    const messageElements = messagesContainer.locator('[id^="chat-widget-1-message-"]');
    const count = await messageElements.count();
    expect(count).toBeGreaterThan(0);
    
    const lastMessage = messageElements.last();
    const messageText = await lastMessage.textContent();
    expect(messageText).toContain(testMessage);
  });

  test('should display multiple messages in order', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    const messages = ['First message', 'Second message', 'Third message'];
    
    for (const message of messages) {
      await messageInput.fill(message);
      await sendButton.click();
      // Wait for the response to arrive before sending next message
      await page.waitForTimeout(150);
    }
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    
    // We should have user messages and bot responses, but no waiting messages
    const allMessages = messagesContainer.locator('[id^="chat-widget-1-message-"]');
    const userMessages = messagesContainer.locator('.user-message');
    const botMessages = messagesContainer.locator('.bot-message:not(.waiting-message)');
    
    const userMessageCount = await userMessages.count();
    const botMessageCount = await botMessages.count();
    
    // Should have 3 user messages and 3 bot responses
    expect(userMessageCount).toBe(messages.length);
    expect(botMessageCount).toBe(messages.length);
    
    // Verify user messages are in order
    for (let i = 0; i < messages.length; i++) {
      const userMessage = userMessages.nth(i);
      const messageText = await userMessage.textContent();
      expect(messageText).toContain(messages[i]);
    }
  });

  test('should scroll to latest message', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    for (let i = 0; i < 10; i++) {
      await messageInput.fill(`Message ${i + 1}`);
      await sendButton.click();
      // Wait for response before sending next message
      await page.waitForTimeout(150);
    }
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    const lastMessage = messagesContainer.locator('.user-message').last();
    
    await expect(lastMessage).toBeInViewport();
  });

  test('should maintain message history when closing and reopening', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    const testMessage = 'Persistent message';
    await messageInput.fill(testMessage);
    await sendButton.click();
    
    // Wait for response
    await page.waitForTimeout(150);
    
    const closeButton = page.locator('#chat-widget-1-close');
    await closeButton.click();
    
    const chatWindow = page.locator('#chat-widget-1-window');
    await expect(chatWindow).not.toBeVisible();
    
    await widgetButton.click();
    await expect(chatWindow).toBeVisible();
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    const userMessages = messagesContainer.locator('.user-message');
    const count = await userMessages.count();
    expect(count).toBeGreaterThan(0);
    
    const lastUserMessage = userMessages.last();
    const messageText = await lastUserMessage.textContent();
    expect(messageText).toContain(testMessage);
  });

  test('should show waiting message when sending message', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    const testMessage = 'Test waiting message';
    await messageInput.fill(testMessage);
    
    // Click send and check for waiting message immediately
    await sendButton.click();
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    
    // Check that waiting message appears
    const waitingMessage = messagesContainer.locator('.waiting-message');
    await expect(waitingMessage).toBeVisible();
    
    // Check that waiting message has the correct structure
    const waitingDots = waitingMessage.locator('.waiting-dots');
    await expect(waitingDots).toBeVisible();
    
    const dots = waitingDots.locator('.dot');
    await expect(dots).toHaveCount(3);
    
    // Verify waiting message has bot message styling
    await expect(waitingMessage).toHaveClass(/bot-message/);
  });

  test('should remove waiting message when response arrives', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    const testMessage = 'Test waiting removal';
    await messageInput.fill(testMessage);
    
    // Click send
    await sendButton.click();
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    
    // Check that waiting message appears
    const waitingMessage = messagesContainer.locator('.waiting-message');
    await expect(waitingMessage).toBeVisible();
    
    // Wait for the response to arrive (in test environment, this should be quick)
    await page.waitForTimeout(100);
    
    // Check that waiting message is removed and replaced with bot response
    await expect(waitingMessage).not.toBeVisible();
    
    // Verify bot message is present
    const botMessages = messagesContainer.locator('.bot-message:not(.waiting-message)');
    const botMessageCount = await botMessages.count();
    expect(botMessageCount).toBeGreaterThan(0);
  });

  test('should show waiting message for widget interactions', async ({ page }) => {
    const widgetButton = page.locator('#chat-widget-1-button');
    await widgetButton.click();
    
    const messageInput = page.locator('#chat-widget-1-input');
    const sendButton = page.locator('#chat-widget-1-send');
    
    // Send a message that might trigger a widget
    await messageInput.fill('show buttons');
    await sendButton.click();
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    
    // Wait for potential widget to appear
    await page.waitForTimeout(100);
    
    // Look for any widget buttons
    const widgetButtons = page.locator('.widget-button');
    const buttonCount = await widgetButtons.count();
    
    if (buttonCount > 0) {
      // Click the first widget button
      await widgetButtons.first().click();
      
      // Check that waiting message appears after widget interaction
      const waitingMessage = messagesContainer.locator('.waiting-message');
      await expect(waitingMessage).toBeVisible();
    }
  });
});
