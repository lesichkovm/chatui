import { test, expect } from '@playwright/test';

test.describe('Input Widget Disable After Submission (Mocked)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a simple test page
    await page.goto('/tests/test.html');
    
    // Wait for the chat widget button to load
    await page.waitForSelector('[id^="chat-widget-"][id$="-button"]', { timeout: 10000 });
    
    // Open the chat widget
    await page.locator('[id^="chat-widget-"][id$="-button"]').first().click();
    await page.waitForSelector('[id^="chat-widget-"][id$="-window"]', { timeout: 5000 });
    
    // Mock the API response for input widget
    await page.route('**/api/messages**', async (route) => {
      const url = new URL(route.request().url());
      const message = url.searchParams.get('message');
      
      if (message === 'show input') {
        // Return mock response with input widget
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: `mockCallback({
            "text": "Please enter your email address:",
            "widget": {
              "type": "input",
              "inputType": "email",
              "placeholder": "Enter your email...",
              "buttonText": "Submit"
            }
          });`
        });
      } else if (message && message.includes('@')) {
        // Return mock response for email submission
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: `mockCallback({
            "text": "Thank you! We received your email: ${message}",
            "sender": "bot"
          });`
        });
      } else {
        // Default echo response
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: `mockCallback({
            "text": "Echo: ${message}",
            "sender": "bot"
          });`
        });
      }
    });
  });

  test('should disable input widget after submission', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for the bot response and input widget to appear
    await page.waitForSelector('[id^="chat-widget-"][id$="-message"]:has-text("Please enter your email")', { timeout: 5000 });
    
    const messageContainer = page.locator('[id^="chat-widget-"][id$="-message"]:has(.widget-input)').first();
    await expect(messageContainer).toBeVisible({ timeout: 5000 });
    
    // Get the input element and submit button within the message
    const inputElement = messageContainer.locator('.widget-input-element');
    const submitButton = messageContainer.locator('.widget-input-submit');
    
    // Verify both are enabled before submission
    await expect(inputElement).toBeEnabled();
    await expect(submitButton).toBeEnabled();
    
    // Fill in the input field
    await inputElement.fill('test@example.com');
    
    // Click the submit button
    await submitButton.click();
    
    // Verify both are disabled after submission
    await expect(inputElement).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    
    // Verify they have the disabled class
    await expect(inputElement).toHaveClass(/widget-input-disabled/);
    await expect(submitButton).toHaveClass(/widget-input-disabled/);
  });

  test('should disable input widget after Enter key submission', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for the bot response and input widget to appear
    await page.waitForSelector('[id^="chat-widget-"][id$="-message"]:has-text("Please enter your email")', { timeout: 5000 });
    
    const messageContainer = page.locator('[id^="chat-widget-"][id$="-message"]:has(.widget-input)').first();
    await expect(messageContainer).toBeVisible({ timeout: 5000 });
    
    // Get the input element within the message
    const inputElement = messageContainer.locator('.widget-input-element');
    
    // Verify it's enabled before submission
    await expect(inputElement).toBeEnabled();
    
    // Fill in the input field and press Enter
    await inputElement.fill('test@example.com');
    await inputElement.press('Enter');
    
    // Verify the input is disabled after submission
    await expect(inputElement).toBeDisabled();
    await expect(inputElement).toHaveClass(/widget-input-disabled/);
  });

  test('should not submit empty input', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for the bot response and input widget to appear
    await page.waitForSelector('[id^="chat-widget-"][id$="-message"]:has-text("Please enter your email")', { timeout: 5000 });
    
    const messageContainer = page.locator('[id^="chat-widget-"][id$="-message"]:has(.widget-input)').first();
    await expect(messageContainer).toBeVisible({ timeout: 5000 });
    
    // Get the input element and submit button within the message
    const inputElement = messageContainer.locator('.widget-input-element');
    const submitButton = messageContainer.locator('.widget-input-submit');
    
    // Try to submit empty input
    await submitButton.click();
    
    // Verify both are still enabled (no submission occurred)
    await expect(inputElement).toBeEnabled();
    await expect(submitButton).toBeEnabled();
    
    // Verify no new message was sent (should still be the same number of messages)
    const messages = page.locator('[id^="chat-widget-"][id$="-message"]');
    await expect(messages).toHaveCount(2); // Initial welcome + widget message
  });

  test('should show visual feedback when disabled', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for the bot response and input widget to appear
    await page.waitForSelector('[id^="chat-widget-"][id$="-message"]:has-text("Please enter your email")', { timeout: 5000 });
    
    const messageContainer = page.locator('[id^="chat-widget-"][id$="-message"]:has(.widget-input)').first();
    await expect(messageContainer).toBeVisible({ timeout: 5000 });
    
    // Get the input element and submit button within the message
    const inputElement = messageContainer.locator('.widget-input-element');
    const submitButton = messageContainer.locator('.widget-input-submit');
    
    // Fill in the input field
    await inputElement.fill('test@example.com');
    
    // Click the submit button
    await submitButton.click();
    
    // Verify visual feedback for disabled state
    await expect(inputElement).toHaveCSS('opacity', '0.6');
    await expect(submitButton).toHaveCSS('opacity', '0.6');
    await expect(inputElement).toHaveCSS('cursor', 'not-allowed');
  });

  test('should handle multiple input widgets independently', async ({ page }) => {
    // Send first "show input"
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for first widget
    await page.waitForSelector('[id^="chat-widget-"][id$="-message"]:has-text("Please enter your email")', { timeout: 5000 });
    
    // Send second "show input"
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for second widget
    const messages = page.locator('[id^="chat-widget-"][id$="-message"]:has(.widget-input)');
    await expect(messages).toHaveCount(2);
    
    // Get both widgets
    const firstWidget = messages.first();
    const secondWidget = messages.last();
    
    // Submit first widget
    const firstInput = firstWidget.locator('.widget-input-element');
    const firstSubmit = firstWidget.locator('.widget-input-submit');
    
    await firstInput.fill('first@example.com');
    await firstSubmit.click();
    
    // Verify first widget is disabled but second is still enabled
    await expect(firstInput).toBeDisabled();
    await expect(firstSubmit).toBeDisabled();
    
    const secondInput = secondWidget.locator('.widget-input-element');
    const secondSubmit = secondWidget.locator('.widget-input-submit');
    await expect(secondInput).toBeEnabled();
    await expect(secondSubmit).toBeEnabled();
    
    // Submit second widget
    await secondInput.fill('second@example.com');
    await secondSubmit.click();
    
    // Verify both are now disabled
    await expect(secondInput).toBeDisabled();
    await expect(secondSubmit).toBeDisabled();
  });
});
