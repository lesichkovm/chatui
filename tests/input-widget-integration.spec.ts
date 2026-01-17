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
    
    // Use test environment mode to bypass API calls entirely
    await page.evaluate(() => {
      // Find the chat widget script element and access its instance
      const scriptElement = document.querySelector('script[id^="chat-widget-"]');
      if (scriptElement && (scriptElement as any)._chatWidgetInstance) {
        const widget = (scriptElement as any)._chatWidgetInstance;
        if (widget && widget.api) {
          // Force test environment mode to bypass API calls
          widget.api.isTestEnvironment = () => true;
          
          // Mock the handshake and connect methods to simulate successful API calls
          const originalPerformHandshake = widget.api.performHandshake.bind(widget.api);
          widget.api.performHandshake = function(onSuccess: any) {
            console.log('Mock handshake called');
            if (onSuccess) onSuccess();
          };
          
          const originalConnect = widget.api.connect.bind(widget.api);
          widget.api.connect = function(onMessage: any) {
            console.log('Mock connect called');
            // Simulate initial welcome message
            if (onMessage) {
              onMessage("Hello! I'm here to help. Type 'show input' to see the input widget.", "bot");
            }
          };
          
          const originalSendMessage = widget.api.sendMessage.bind(widget.api);
          widget.api.sendMessage = function(message: string, onResponse: any) {
            console.log('Mock sendMessage called with:', message);
            
            // Simulate input widget response
            if (message === 'show input') {
              if (onResponse) {
                onResponse("Please enter your email address:", "bot", {
                  type: "input",
                  inputType: "email",
                  placeholder: "Enter your email...",
                  buttonText: "Submit"
                });
              }
            } else if (message && message.includes('@')) {
              if (onResponse) {
                onResponse(`Thank you! We've received your email: ${message}`, "bot");
              }
            } else {
              if (onResponse) {
                onResponse(`Echo: ${message}`, "bot");
              }
            }
          };
          
          // Add debugging to see what responses are being processed
          const originalAddMessage = widget.addMessage.bind(widget);
          widget.addMessage = function(text: any, sender: any, widgetData: any) {
            console.log('addMessage called with:', { text, sender, widgetData });
            return originalAddMessage(text, sender, widgetData);
          };
        }
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
    await expect(inputElement).toHaveCSS('opacity', '0.5');
    await expect(submitButton).toHaveCSS('opacity', '0.5');
    await expect(inputElement).toHaveCSS('cursor', 'not-allowed');
  });
});
