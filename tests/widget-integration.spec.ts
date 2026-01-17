import { test, expect } from '@playwright/test';

test.describe('Widget Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5500/demo/widget-demo.html');
    
    // Wait for widget to load
    await page.waitForSelector('[id^="chat-widget-"]');
    
    // Open the chat widget
    await page.click('[id^="chat-widget-"] .button');
    await page.waitForSelector('[id^="chat-widget-"] .window-open');
  });

  test('should handle complete widget interaction flow', async ({ page }) => {
    const textarea = page.locator('[id^="chat-widget-"] .textarea');
    const sendButton = page.locator('[id^="chat-widget-"] .send');
    
    // Start the widget flow
    await textarea.fill('menu');
    await sendButton.click();
    
    // Wait for initial widget
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Click through the flow: menu -> support -> urgent_support
    const allButtons1 = page.locator('[id^="chat-widget-"] .widget-button');
    const supportButton = allButtons1.filter({ hasText: 'Customer Support' });
    await supportButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    const allButtons2 = page.locator('[id^="chat-widget-"] .widget-button');
    const urgentButton = allButtons2.filter({ hasText: 'Urgent Issue' });
    await urgentButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Verify the complete flow
    const userMessages = page.locator('[id^="chat-widget-"] .user-message');
    await expect(userMessages).toHaveCount(3);
    await expect(userMessages.nth(0)).toContainText('menu');
    await expect(userMessages.nth(1)).toContainText('Customer Support');
    await expect(userMessages.nth(2)).toContainText('Urgent Issue');
  });

  test('should handle widget interaction events', async ({ page }) => {
    const textarea = page.locator('[id^="chat-widget-"] .textarea');
    const sendButton = page.locator('[id^="chat-widget-"] .send');
    
    // Set up event listener
    let eventData: any = null;
    await page.evaluate(() => {
      document.addEventListener('widgetInteraction', (event: any) => {
        (window as any).lastWidgetEvent = event.detail;
      });
    });
    
    // Trigger widget interaction
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    const allButtons = page.locator('[id^="chat-widget-"] .widget-button');
    const salesButton = allButtons.filter({ hasText: 'Sales Inquiry' });
    await salesButton.click();
    
    // Check event data
    eventData = await page.evaluate(() => (window as any).lastWidgetEvent);
    expect(eventData).not.toBeNull();
    expect(eventData.optionText).toBe('Sales Inquiry');
    expect(eventData.optionValue).toBe('sales');
    expect(eventData.widgetType).toBe('buttons');
  });

  test('should maintain widget state during navigation', async ({ page }) => {
    const textarea = page.locator('[id^="chat-widget-"] .textarea');
    const sendButton = page.locator('[id^="chat-widget-"] .send');
    
    // Start widget flow
    await textarea.fill('options');
    await sendButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Verify initial state
    const buttons1 = page.locator('[id^="chat-widget-"] .widget-button');
    await expect(buttons1).toHaveCount(3);
    
    // Navigate to different widget
    const allButtons1 = page.locator('[id^="chat-widget-"] .widget-button');
    const productButton = allButtons1.filter({ hasText: 'Product Information' });
    await productButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Go back to main menu
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Verify main menu is displayed correctly
    const buttons2 = page.locator('[id^="chat-widget-"] .widget-button');
    await expect(buttons2).toHaveCount(4);
    await expect(buttons2.nth(0)).toContainText('Customer Support');
  });

  test('should handle rapid widget interactions', async ({ page }) => {
    const textarea = page.locator('[id^="chat-widget-"] .textarea');
    const sendButton = page.locator('[id^="chat-widget-"] .send');
    
    // Start widget
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Rapidly click multiple buttons
    const buttons = page.locator('[id^="chat-widget-"] .widget-button');
    
    await buttons.nth(0).click(); // Customer Support
    await page.waitForTimeout(100);
    
    await buttons.nth(1).click(); // Sales Inquiry  
    await page.waitForTimeout(100);
    
    await buttons.nth(2).click(); // Technical Help
    await page.waitForTimeout(100);
    
    // Verify all interactions were processed
    const userMessages = page.locator('[id^="chat-widget-"] .user-message');
    await expect(userMessages).toHaveCount(4); // menu + 3 button clicks
  });

  test('should handle widget errors gracefully', async ({ page }) => {
    const textarea = page.locator('[id^="chat-widget-"] .textarea');
    const sendButton = page.locator('[id^="chat-widget-"] .send');
    
    // Send message that might cause issues
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Verify widget is still functional after potential errors
    const buttons = page.locator('[id^="chat-widget-"] .widget-button');
    await expect(buttons).toHaveCount(4);
    
    // Click a button to ensure it still works
    await buttons.nth(0).click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Verify response
    const botMessages = page.locator('[id^="chat-widget-"] .bot-message');
    await expect(botMessages.last()).toContainText('Connecting you to customer support');
  });

  test('should handle widget accessibility', async ({ page }) => {
    const textarea = page.locator('[id^="chat-widget-"] .textarea');
    const sendButton = page.locator('[id^="chat-widget-"] .send');
    
    // Trigger widget
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Check accessibility attributes
    const buttons = page.locator('[id^="chat-widget-"] .widget-button');
    
    // Verify buttons have proper attributes for accessibility
    await expect(buttons.nth(0)).toHaveAttribute('data-option-id');
    await expect(buttons.nth(0)).toHaveAttribute('data-option-value');
    
    // Check if buttons are focusable
    await buttons.nth(0).focus();
    await expect(buttons.nth(0)).toBeFocused();
    
    // Test keyboard navigation
    await buttons.nth(0).press('Enter');
    await page.waitForSelector('[id^="chat-widget-"] .widget');
    
    // Verify interaction worked
    const userMessages = page.locator('[id^="chat-widget-"] .user-message');
    await expect(userMessages.last()).toContainText('Customer Support');
  });
});
