import { test, expect } from '@playwright/test';

test.describe('Chat Widget - Message Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo.html');
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
    }
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    const messageElements = messagesContainer.locator('[id^="chat-widget-1-message-"]');
    const count = await messageElements.count();
    expect(count).toBe(messages.length);
    
    for (let i = 0; i < messages.length; i++) {
      const messageElement = messageElements.nth(i);
      const messageText = await messageElement.textContent();
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
    }
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    const lastMessage = messagesContainer.locator('[id^="chat-widget-1-message-"]').last();
    
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
    
    await widgetButton.click();
    
    const chatWindow = page.locator('#chat-widget-1-window');
    await expect(chatWindow).not.toBeVisible();
    
    await widgetButton.click();
    await expect(chatWindow).toBeVisible();
    
    const messagesContainer = page.locator('#chat-widget-1-messages');
    const messageElements = messagesContainer.locator('[id^="chat-widget-1-message-"]');
    const count = await messageElements.count();
    expect(count).toBeGreaterThan(0);
    
    const lastMessage = messageElements.last();
    const messageText = await lastMessage.textContent();
    expect(messageText).toContain(testMessage);
  });
});
