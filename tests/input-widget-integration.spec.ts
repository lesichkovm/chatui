import { test, expect } from '@playwright/test';

test.describe('Input Widget Integration Tests (Mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a simple test page instead of demo page
    await page.goto('/tests/test.html');
    
    // Wait for the chat widget button to load
    await page.waitForSelector('[id^="chat-widget-"][id$="-button"]', { timeout: 10000 });
    
    // Open the chat widget
    await page.locator('[id^="chat-widget-"][id$="-button"]').first().click();
    await page.waitForSelector('[id^="chat-widget-"][id$="-window"]', { timeout: 5000 });
    
    // Bypass test environment detection to allow API calls
    await page.evaluate(() => {
      // Find the chat widget script element and access its instance
      const scriptElement = document.querySelector('script[id^="chat-widget-"]');
      if (scriptElement && (scriptElement as any)._chatWidgetInstance) {
        const widget = (scriptElement as any)._chatWidgetInstance;
        if (widget && widget.api) {
          // Override the isTestEnvironment method to always return false
          widget.api.isTestEnvironment = () => false;
          
          // Add debugging to see what responses are being processed
          const originalAddMessage = widget.addMessage.bind(widget);
          widget.addMessage = function(text, sender, widgetData) {
            console.log('addMessage called with:', { text, sender, widgetData });
            return originalAddMessage(text, sender, widgetData);
          };
        }
      }
    });
    
    // Mock the API response for input widget
    await page.route('**/api/handshake**', async (route) => {
      const url = route.request().url();
      const callbackMatch = url.match(/callback=([^&]+)/);
      const callbackName = callbackMatch ? callbackMatch[1] : 'handshakeCallback';
      
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `${callbackName}({
          "status": "success",
          "session_key": "test-session-key"
        });`
      });
    });
    
    await page.route('**/api/messages**', async (route) => {
      const url = route.request().url();
      const callbackMatch = url.match(/callback=([^&]+)/);
      const messageMatch = url.match(/message=([^&]+)/);
      const callbackName = callbackMatch ? decodeURIComponent(callbackMatch[1]) : 'mockCallback';
      const message = messageMatch ? decodeURIComponent(messageMatch[1]) : '';
      
      console.log('API Mock called with message:', message, 'callback:', callbackName);
      
      if (message === 'show input') {
        // Return mock response with input widget
        const response = `${callbackName}({
          "text": "Please enter your email address:",
          "widget": {
            "type": "input",
            "inputType": "email",
            "placeholder": "Enter your email...",
            "buttonText": "Submit"
          }
        });`;
        console.log('Sending response:', response);
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: response
        });
      } else if (message && message.includes('@')) {
        // Return mock response for email submission
        const response = `${callbackName}({
          "text": "Thank you! We received your email: ${message}",
          "sender": "bot"
        });`;
        console.log('Sending response:', response);
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: response
        });
      } else {
        // Default echo response
        const response = `${callbackName}({
          "text": "Echo: ${message}",
          "sender": "bot"
        });`;
        console.log('Sending response:', response);
        await route.fulfill({
          status: 200,
          contentType: 'application/javascript',
          body: response
        });
      }
    });
  });

  test('should disable input widget after submission', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for the bot response and input widget to appear
    // Wait for bot message first
    await page.waitForSelector('[id^="chat-widget-"][id*="-message-"]:has-text("Please enter your email")', { timeout: 10000 });
    
    // Then wait for the input widget within the message
    const messageContainer = page.locator('[id^="chat-widget-"][id*="-message-"]:has(.widget-input)').first();
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
    await page.waitForSelector('[id^="chat-widget-"][id*="-message-"]:has-text("Please enter your email")', { timeout: 10000 });
    
    const messageContainer = page.locator('[id^="chat-widget-"][id*="-message-"]:has(.widget-input)').first();
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
    await page.waitForSelector('[id^="chat-widget-"][id*="-message-"]:has-text("Please enter your email")', { timeout: 10000 });
    
    const messageContainer = page.locator('[id^="chat-widget-"][id*="-message-"]:has(.widget-input)').first();
    await expect(messageContainer).toBeVisible({ timeout: 5000 });
    
    // Get the input element and submit button within the message
    const inputElement = messageContainer.locator('.widget-input-element');
    const submitButton = messageContainer.locator('.widget-input-submit');
    
    // Try to submit empty input
    await submitButton.click();
    
    // Verify both are still enabled (no submission occurred)
    await expect(inputElement).toBeEnabled();
    await expect(submitButton).toBeEnabled();
  });

  test('should show visual feedback when disabled', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[id^="chat-widget-"][id$="-input"]', 'show input');
    await page.locator('[id^="chat-widget-"][id$="-send"]').click();
    
    // Wait for the bot response and input widget to appear
    await page.waitForSelector('[id^="chat-widget-"][id*="-message-"]:has-text("Please enter your email")', { timeout: 10000 });
    
    const messageContainer = page.locator('[id^="chat-widget-"][id*="-message-"]:has(.widget-input)').first();
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
});
