import { test, expect } from '@playwright/test';

test.describe('Chat Widget - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
  });

  test('should load chat widget button on page', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]');
    await expect(widgetButton).toBeVisible();
  });

  test('should open chat window when button is clicked', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    await widgetButton.click();
    
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');
    await expect(chatWindow).toBeVisible();
  });

  test('should close chat window when close button is clicked', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    await widgetButton.click();
    
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');
    await expect(chatWindow).toBeVisible();
    
    const closeButton = chatWindow.locator('[id^="chat-widget-"][id$="-close"]');
    await closeButton.click();
    
    await expect(chatWindow).not.toBeVisible();
  });

  test('should toggle chat window visibility on button click', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');
    const closeButton = chatWindow.locator('[id^="chat-widget-"][id$="-close"]');
    
    await expect(chatWindow).not.toBeVisible();
    
    // Open chat
    await widgetButton.click();
    await expect(chatWindow).toBeVisible();
    await expect(widgetButton).not.toBeVisible();
    
    // Close chat via close button (since main button is hidden)
    await closeButton.click();
    await expect(chatWindow).not.toBeVisible();
    await expect(widgetButton).toBeVisible();

    // Re-open chat
    await widgetButton.click();
    await expect(chatWindow).toBeVisible();
  });

  test('should display chat window header with title', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    await widgetButton.click();
    
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');
    const header = chatWindow.locator('[id^="chat-widget-"][id$="-header"]');
    await expect(header).toBeVisible();
  });

  test('should display message input area', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    await widgetButton.click();
    
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');
    const messageInput = chatWindow.locator('[id^="chat-widget-"][id$="-input"]');
    await expect(messageInput).toBeVisible();
  });

  test('should display send button', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    await widgetButton.click();
    
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');
    const sendButton = chatWindow.locator('[id^="chat-widget-"][id$="-send"]');
    await expect(sendButton).toBeVisible();
  });
});
