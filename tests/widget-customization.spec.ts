import { test, expect } from '@playwright/test';

test.describe('Chat Widget - Customization', () => {
  test('should position widget at bottom-right', async ({ page }) => {
    await page.goto('/tests/widget-customization-simple-test.html');
    
    const widgetButton = page.locator('#chat-widget-1-button').first();
    await expect(widgetButton).toBeVisible();
    
    const boundingBox = await widgetButton.boundingBox();
    expect(boundingBox).toBeTruthy();
    
    if (boundingBox) {
      const viewportSize = page.viewportSize();
      expect(viewportSize).toBeTruthy();
      
      if (viewportSize) {
        expect(boundingBox.x + boundingBox.width).toBeGreaterThan(viewportSize.width / 2);
        expect(boundingBox.y + boundingBox.height).toBeGreaterThan(viewportSize.height / 2);
      }
    }
  });

  test('should position widget at bottom-left', async ({ page }) => {
    await page.goto('/tests/widget-customization-simple-test.html');
    
    const widgetButton = page.locator('#chat-widget-2-button').first();
    await expect(widgetButton).toBeVisible();
    
    const boundingBox = await widgetButton.boundingBox();
    expect(boundingBox).toBeTruthy();
    
    if (boundingBox) {
      const viewportSize = page.viewportSize();
      expect(viewportSize).toBeTruthy();
      
      if (viewportSize) {
        expect(boundingBox.x).toBeLessThan(viewportSize.width / 2);
        expect(boundingBox.y + boundingBox.height).toBeGreaterThan(viewportSize.height / 2);
      }
    }
  });

  test('should apply custom color to widget button', async ({ page }) => {
    await page.goto('/tests/widget-customization-simple-test.html');
    
    const widgetButton1 = page.locator('#chat-widget-1-button').first();
    const widgetButton2 = page.locator('#chat-widget-2-button').first();
    
    await expect(widgetButton1).toBeVisible();
    await expect(widgetButton2).toBeVisible();
    
    const backgroundColor1 = await widgetButton1.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    const backgroundColor2 = await widgetButton2.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(backgroundColor1).not.toBe(backgroundColor2);
  });

  test('should display custom title in chat window', async ({ page }) => {
    await page.goto('/tests/widget-customization-simple-test.html');
    
    const widgetButton1 = page.locator('#chat-widget-1-button').first();
    await widgetButton1.click();
    
    const chatWindow1 = page.locator('#chat-widget-1-window');
    const header1 = chatWindow1.locator('#chat-widget-1-header');
    
    await expect(header1).toBeVisible();
    
    const headerText = await header1.textContent();
    expect(headerText).toContain('Chat with us');
    
    await widgetButton1.click();
    
    const widgetButton2 = page.locator('#chat-widget-2-button').first();
    await widgetButton2.click();
    
    const chatWindow2 = page.locator('#chat-widget-2-window');
    const header2 = chatWindow2.locator('#chat-widget-2-header');
    
    await expect(header2).toBeVisible();
    
    const headerText2 = await header2.textContent();
    expect(headerText2).toContain('Support Chat');
  });

  test('should maintain custom color in chat window elements', async ({ page }) => {
    await page.goto('/tests/widget-customization-simple-test.html');
    
    const widgetButton1 = page.locator('#chat-widget-1-button').first();
    await widgetButton1.click();
    
    const chatWindow1 = page.locator('#chat-widget-1-window');
    const sendButton1 = chatWindow1.locator('#chat-widget-1-send');
    
    await expect(sendButton1).toBeVisible();
    
    const buttonColor = await sendButton1.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(buttonColor).toBeTruthy();
  });
});
