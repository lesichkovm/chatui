import { test, expect } from '@playwright/test';

test.describe('Chat Widget - Multiple Widgets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/multiple-widgets-test.html');
  });

  test('should load multiple widgets on same page', async ({ page }) => {
    const widgetButton1 = page.locator('#chat-widget-1-button');
    const widgetButton2 = page.locator('#chat-widget-2-button');
    
    await expect(widgetButton1).toBeVisible();
    await expect(widgetButton2).toBeVisible();
  });

  test('should open first widget independently', async ({ page }) => {
    const widgetButton1 = page.locator('#chat-widget-1-button');
    await widgetButton1.click();
    
    const chatWindow1 = page.locator('#chat-widget-1-window');
    await expect(chatWindow1).toBeVisible();
    
    const chatWindow2 = page.locator('#chat-widget-2-window');
    await expect(chatWindow2).not.toBeVisible();
  });

  test('should open second widget independently', async ({ page }) => {
    const widgetButton2 = page.locator('#chat-widget-2-button');
    await widgetButton2.click();
    
    const chatWindow2 = page.locator('#chat-widget-2-window');
    await expect(chatWindow2).toBeVisible();
    
    const chatWindow1 = page.locator('#chat-widget-1-window');
    await expect(chatWindow1).not.toBeVisible();
  });

  test('should allow both widgets to be open simultaneously', async ({ page }) => {
    const widgetButton1 = page.locator('#chat-widget-1-button');
    const widgetButton2 = page.locator('#chat-widget-2-button');
    
    await widgetButton1.click();
    await widgetButton2.click();
    
    const chatWindow1 = page.locator('#chat-widget-1-window');
    const chatWindow2 = page.locator('#chat-widget-2-window');
    
    await expect(chatWindow1).toBeVisible();
    await expect(chatWindow2).toBeVisible();
  });

  test('should maintain separate states for each widget', async ({ page }) => {
    const widgetButton1 = page.locator('#chat-widget-1-button');
    const widgetButton2 = page.locator('#chat-widget-2-button');
    
    await widgetButton1.click();
    await widgetButton2.click();
    
    const chatWindow1 = page.locator('#chat-widget-1-window');
    const chatWindow2 = page.locator('#chat-widget-2-window');
    
    await expect(chatWindow1).toBeVisible();
    await expect(chatWindow2).toBeVisible();
    
    await widgetButton1.click();
    
    await expect(chatWindow1).not.toBeVisible();
    await expect(chatWindow2).toBeVisible();
    
    await widgetButton2.click();
    
    await expect(chatWindow1).not.toBeVisible();
    await expect(chatWindow2).not.toBeVisible();
  });

  test('should have different positions for each widget', async ({ page }) => {
    const widgetButton1 = page.locator('#chat-widget-1-button');
    const widgetButton2 = page.locator('#chat-widget-2-button');
    
    const boundingBox1 = await widgetButton1.boundingBox();
    const boundingBox2 = await widgetButton2.boundingBox();
    
    expect(boundingBox1).toBeTruthy();
    expect(boundingBox2).toBeTruthy();
    
    if (boundingBox1 && boundingBox2) {
      expect(boundingBox1.x).not.toBe(boundingBox2.x);
    }
  });

  test('should have different colors for each widget', async ({ page }) => {
    const widgetButton1 = page.locator('#chat-widget-1-button');
    const widgetButton2 = page.locator('#chat-widget-2-button');
    
    const backgroundColor1 = await widgetButton1.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    const backgroundColor2 = await widgetButton2.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(backgroundColor1).not.toBe(backgroundColor2);
  });

  test('should have different titles for each widget', async ({ page }) => {
    const widgetButton1 = page.locator('#chat-widget-1-button');
    const widgetButton2 = page.locator('#chat-widget-2-button');
    
    await widgetButton1.click();
    await widgetButton2.click();
    
    const header1 = page.locator('#chat-widget-1-header');
    const header2 = page.locator('#chat-widget-2-header');
    
    const headerText1 = await header1.textContent();
    const headerText2 = await header2.textContent();
    
    expect(headerText1).not.toBe(headerText2);
    expect(headerText1).toContain('Chat with us');
    expect(headerText2).toContain('Support Chat');
  });
});
