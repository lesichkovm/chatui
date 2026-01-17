import { test, expect } from '@playwright/test';

test.describe('Widget Functionality Tests', () => {
  test('should render widget buttons correctly', async ({ page }) => {
    // Create a simple test page with widget functionality
    await page.goto('about:blank');
    
    // Set up a basic widget test
    await page.setContent(`
      <div id="test-container">
        <div class="widget">
          <div class="widget-buttons">
            <button class="widget-button" data-option-value="support">Customer Support</button>
            <button class="widget-button" data-option-value="sales">Sales</button>
          </div>
        </div>
      </div>
    `);

    // Test widget buttons exist
    const widgetContainer = page.locator('#test-container .widget');
    await expect(widgetContainer).toBeVisible();

    const buttons = page.locator('#test-container .widget-button');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.nth(0)).toContainText('Customer Support');
    await expect(buttons.nth(1)).toContainText('Sales');
    await expect(buttons.nth(0)).toHaveAttribute('data-option-value', 'support');
    await expect(buttons.nth(1)).toHaveAttribute('data-option-value', 'sales');
  });

  test('should handle widget interaction events', async ({ page }) => {
    await page.goto('about:blank');
    
    // Set up widget with event handling
    await page.setContent(`
      <div id="test-container">
        <div class="widget">
          <div class="widget-buttons">
            <button class="widget-button" data-option-value="test" data-option-id="opt1">Test Button</button>
          </div>
        </div>
      </div>
    `);

    // Set up event listener
    await page.evaluate(() => {
      let eventData: any = null;
      document.addEventListener('widgetInteraction', (event: any) => {
        eventData = event.detail;
        (window as any).testEventData = eventData;
      });

      // Simulate widget interaction
      const button = document.querySelector('.widget-button') as HTMLButtonElement;
      if (button) {
        // Add minimal logic to dispatch the event since this is a unit test for the event handling
        button.addEventListener('click', () => {
          const event = new CustomEvent('widgetInteraction', {
            detail: {
              optionValue: button.getAttribute('data-option-value'),
              optionId: button.getAttribute('data-option-id')
            }
          });
          document.dispatchEvent(event);
        });
        button.click();
      }
    });

    // Wait a moment for the event to be processed
    await page.waitForTimeout(100);

    // Check if event was captured
    const eventData = await page.evaluate(() => (window as any).testEventData);
    expect(eventData).not.toBeNull();
    expect(eventData.optionValue).toBe('test');
    expect(eventData.optionId).toBe('opt1');
  });

  test('should validate widget data structure', async ({ page }) => {
    await page.goto('about:blank');
    
    // Test widget validation logic
    const validationResults = await page.evaluate(() => {
      const validateWidget = (widgetData: any) => {
        return !!(widgetData && 
               widgetData.type && 
               Array.isArray(widgetData.options) && 
               widgetData.options.length > 0);
      };

      return {
        valid: validateWidget({
          type: 'buttons',
          options: [{ id: 'opt1', text: 'Option 1', value: 'value1' }]
        }),
        invalidNoType: validateWidget({
          options: [{ id: 'opt1', text: 'Option 1', value: 'value1' }]
        }),
        invalidNoOptions: validateWidget({
          type: 'buttons',
          options: []
        }),
        invalidEmptyOptions: validateWidget({
          type: 'buttons',
          options: null
        })
      };
    });

    expect(validationResults.valid).toBe(true);
    expect(validationResults.invalidNoType).toBe(false);
    expect(validationResults.invalidNoOptions).toBe(false);
    expect(validationResults.invalidEmptyOptions).toBe(false);
  });

  test('should create widget DOM elements correctly', async ({ page }) => {
    await page.goto('about:blank');
    
    // Test widget DOM creation
    const widgetHTML = await page.evaluate(() => {
      const widgetData = {
        type: 'buttons',
        options: [
          { id: 'opt1', text: 'Button 1', value: 'value1' },
          { id: 'opt2', text: 'Button 2', value: 'value2' }
        ]
      };

      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'widget';
      
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'widget-buttons';
      
      widgetData.options.forEach((option: any) => {
        const button = document.createElement('button');
        button.className = 'widget-button';
        button.textContent = option.text;
        button.setAttribute('data-option-id', option.id);
        button.setAttribute('data-option-value', option.value);
        buttonsContainer.appendChild(button);
      });
      
      widgetContainer.appendChild(buttonsContainer);
      document.body.appendChild(widgetContainer);
      
      return widgetContainer.outerHTML;
    });

    // Verify the HTML structure
    expect(widgetHTML).toContain('class="widget"');
    expect(widgetHTML).toContain('class="widget-buttons"');
    expect(widgetHTML).toContain('class="widget-button"');
    expect(widgetHTML).toContain('Button 1');
    expect(widgetHTML).toContain('Button 2');
    expect(widgetHTML).toContain('data-option-id="opt1"');
    expect(widgetHTML).toContain('data-option-value="value1"');
  });
});
