import { test, expect } from '@playwright/test';

test.describe('Input Widget Disable After Submission', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the input widget demo page
    await page.goto('demo/widgets/input-widget-demo.html');
    
    // Wait for the chat widget to load
    await page.waitForSelector('#chat-widget', { timeout: 10000 });
    
    // Open the chat widget
    await page.click('[data-testid="chat-button"]');
    await page.waitForSelector('[data-testid="chat-container"]', { timeout: 5000 });
  });

  test('should disable input widget after submission', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[data-testid="chat-input"]', 'show input');
    await page.click('[data-testid="chat-send-button"]');
    
    // Wait for the input widget to appear
    await page.waitForSelector('.widget-input', { timeout: 5000 });
    
    // Get the input element and submit button
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
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
    await page.fill('[data-testid="chat-input"]', 'show input');
    await page.click('[data-testid="chat-send-button"]');
    
    // Wait for the input widget to appear
    await page.waitForSelector('.widget-input', { timeout: 5000 });
    
    // Get the input element
    const inputElement = page.locator('.widget-input-element');
    
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
    await page.fill('[data-testid="chat-input"]', 'show input');
    await page.click('[data-testid="chat-send-button"]');
    
    // Wait for the input widget to appear
    await page.waitForSelector('.widget-input', { timeout: 5000 });
    
    // Get the input element and submit button
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
    // Try to submit empty input
    await submitButton.click();
    
    // Verify both are still enabled (no submission occurred)
    await expect(inputElement).toBeEnabled();
    await expect(submitButton).toBeEnabled();
  });

  test('should show visual feedback when disabled', async ({ page }) => {
    // Type "show input" to trigger the input widget
    await page.fill('[data-testid="chat-input"]', 'show input');
    await page.click('[data-testid="chat-send-button"]');
    
    // Wait for the input widget to appear
    await page.waitForSelector('.widget-input', { timeout: 5000 });
    
    // Get the input element and submit button
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
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
