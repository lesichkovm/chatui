import { test, expect } from '@playwright/test';

test.describe('Chat Button Visibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/test.html');
  });

  test('should hide chat button when chat window is open', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');

    // Initial state: Button visible, Window hidden
    await expect(widgetButton).toBeVisible();
    await expect(chatWindow).not.toBeVisible();

    // Click to open
    await widgetButton.click();

    // Expected state: Window visible, Button HIDDEN
    await expect(chatWindow).toBeVisible();
    await expect(widgetButton).not.toBeVisible();
  });

    test('should show chat button when chat window is closed via close button', async ({ page }) => {
    const widgetButton = page.locator('[id^="chat-widget-"][id$="-button"]').first();
    const chatWindow = page.locator('[id^="chat-widget-"][id$="-window"]');

    // Open chat
    await widgetButton.click();
    await expect(chatWindow).toBeVisible();

    // Close chat
    const closeButton = chatWindow.locator('[id^="chat-widget-"][id$="-close"]');
    await closeButton.click();

    // Expected state: Window hidden, Button VISIBLE
    await expect(chatWindow).not.toBeVisible();
    await expect(widgetButton).toBeVisible();
  });
});
