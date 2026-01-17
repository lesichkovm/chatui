import { test, expect } from '@playwright/test';

test.describe('Input Widget Unit Tests', () => {
  test('should create input widget with correct structure', async ({ page }) => {
    // Load the widget module directly
    await page.goto('data:text/html,<html><head><script src="/src/modules/widgets/input-widget.js" type="module"></script></head><body></body></html>');
    
    // Create widget directly in the page
    await page.evaluate(() => {
      const widgetData = {
        type: 'input',
        inputType: 'email',
        placeholder: 'Enter your email...',
        buttonText: 'Submit'
      };
      
      // Import and create widget (assuming it's exported)
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
    });
    
    // Verify widget structure
    const widgetContainer = page.locator('.widget');
    await expect(widgetContainer).toBeVisible();
    
    const inputElement = page.locator('.widget-input-element');
    await expect(inputElement).toBeVisible();
    await expect(inputElement).toHaveAttribute('type', 'email');
    await expect(inputElement).toHaveAttribute('placeholder', 'Enter your email...');
    
    const submitButton = page.locator('.widget-input-submit');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Submit');
  });

  test('should disable widget after submission', async ({ page }) => {
    // Create widget directly
    await page.goto('data:text/html,<html><head><script src="/src/modules/widgets/input-widget.js" type="module"></script></head><body></body></html>');
    
    await page.evaluate(() => {
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Simulate submission
      const input = element.querySelector('.widget-input-element');
      const button = element.querySelector('.widget-input-submit');
      
      input.value = 'test input';
      button.click();
    });
    
    // Verify disabled state
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
    await expect(inputElement).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    await expect(inputElement).toHaveClass(/widget-input-disabled/);
    await expect(submitButton).toHaveClass(/widget-input-disabled/);
  });

  test('should not submit empty input', async ({ page }) => {
    await page.goto('data:text/html,<html><head><script src="/src/modules/widgets/input-widget.js" type="module"></script></head><body></body></html>');
    
    await page.evaluate(() => {
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Try to submit empty input
      const button = element.querySelector('.widget-input-submit');
      button.click();
    });
    
    // Verify still enabled (no submission occurred)
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
    await expect(inputElement).toBeEnabled();
    await expect(submitButton).toBeEnabled();
    await expect(inputElement).toHaveValue(''); // Still empty
  });

  test('should handle Enter key submission', async ({ page }) => {
    await page.goto('data:text/html,<html><head><script src="/src/modules/widgets/input-widget.js" type="module"></script></head><body></body></html>');
    
    await page.evaluate(() => {
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Simulate Enter key submission
      const input = element.querySelector('.widget-input-element');
      input.value = 'test input';
      
      // Create and dispatch Enter key event
      const enterEvent = new KeyboardEvent('keypress', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      input.dispatchEvent(enterEvent);
    });
    
    // Verify disabled state after Enter submission
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
    await expect(inputElement).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    await expect(inputElement).toHaveClass(/widget-input-disabled/);
  });

  test('should dispatch interaction event correctly', async ({ page }) => {
    await page.goto('data:text/html,<html><head><script src="/src/modules/widgets/input-widget.js" type="module"></script></head><body></body></html>');
    
    // Set up event listener
    let interactionData = null;
    await page.exposeFunction('captureInteraction', (data) => {
      interactionData = data;
    });
    
    await page.evaluate(() => {
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Add event listener
      document.addEventListener('widgetInteraction', (event) => {
        window.captureInteraction(event.detail);
      });
      
      // Submit the form
      const input = element.querySelector('.widget-input-element');
      const button = element.querySelector('.widget-input-submit');
      
      input.value = 'test@example.com';
      button.click();
    });
    
    // Verify interaction event was dispatched
    expect(interactionData).not.toBeNull();
    expect(interactionData.widgetId).toBe('test-widget-id');
    expect(interactionData.optionId).toBe('input-submit');
    expect(interactionData.optionValue).toBe('test@example.com');
    expect(interactionData.optionText).toBe('test@example.com');
    expect(interactionData.widgetType).toBe('input');
  });
});
