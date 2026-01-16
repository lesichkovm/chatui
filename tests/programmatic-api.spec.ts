import { test, expect } from '@playwright/test';

test.describe('Chat Widget - Programmatic API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/programmatic-test.html');
  });

  test('should initialize via ChatUI.init', async ({ page }) => {
    await page.evaluate(() => {
      window.chatInstance = window.ChatUI.init({
        id: 'prog-widget',
        title: 'Programmatic Chat',
        color: '#ff5722'
      });
    });

    const widgetButton = page.locator('#prog-widget-button');
    await expect(widgetButton).toBeVisible();
    
    const backgroundColor = await widgetButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    // rgb(255, 87, 34) is #ff5722
    expect(backgroundColor).toBe('rgb(255, 87, 34)');
  });

  test('should open and close via API', async ({ page }) => {
    await page.evaluate(() => {
      window.chatInstance = window.ChatUI.init({ id: 'prog-widget' });
    });

    const chatWindow = page.locator('#prog-widget-window');
    await expect(chatWindow).not.toBeVisible();

    await page.evaluate(() => {
      window.chatInstance.open();
    });
    await expect(chatWindow).toBeVisible();

    await page.evaluate(() => {
      window.chatInstance.close();
    });
    await expect(chatWindow).not.toBeVisible();
  });

  test('should send message via API', async ({ page }) => {
    await page.evaluate(() => {
      window.chatInstance = window.ChatUI.init({ id: 'prog-widget' });
      window.chatInstance.open();
    });

    const testMessage = 'Programmatic hello';
    await page.evaluate((msg) => {
      window.chatInstance.sendMessage(msg);
    }, testMessage);

    const messages = page.locator('#prog-widget-messages');
    await expect(messages).toContainText(testMessage);
  });
});
