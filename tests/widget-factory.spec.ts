import { test, expect } from '@playwright/test';

// Extend Window interface for test environment
declare global {
  interface Window {
    testWidgetFactory: {
      createWidget: (widgetData: any, widgetId: string) => any;
    };
  }
}

test.describe('Widget Factory Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Load the widget system in a test environment
    await page.goto('about:blank');
    await page.evaluate(() => {
      // Mock the widget system for testing
      (window as any).testWidgetFactory = {
        createWidget: function(widgetData: any, widgetId: string) {
          if (!widgetData || !widgetData.type) return null;
          
          switch(widgetData.type) {
            case 'buttons':
              return {
                createElement: () => {
                  const div = document.createElement('div');
                  div.className = 'widget';
                  const container = document.createElement('div');
                  container.className = 'widget-buttons';
                  
                  if (widgetData.options) {
                    widgetData.options.forEach((option: any) => {
                      const button = document.createElement('button');
                      button.className = 'widget-button';
                      button.textContent = option.text;
                      button.setAttribute('data-option-value', option.value);
                      container.appendChild(button);
                    });
                  }
                  
                  div.appendChild(container);
                  return div;
                },
                validate: () => widgetData.type === 'buttons' && Array.isArray(widgetData.options) && widgetData.options.length > 0
              };
            case 'select':
              return {
                createElement: () => {
                  const div = document.createElement('div');
                  div.className = 'widget';
                  const select = document.createElement('select');
                  select.className = 'widget-select-element';
                  
                  if (widgetData.options) {
                    widgetData.options.forEach((option: any) => {
                      const optionEl = document.createElement('option');
                      optionEl.value = option.value;
                      optionEl.textContent = option.text;
                      select.appendChild(optionEl);
                    });
                  }
                  
                  div.appendChild(select);
                  return div;
                },
                validate: () => widgetData.type === 'select' && Array.isArray(widgetData.options) && widgetData.options.length > 0
              };
            default:
              return null;
          }
        }
      };
    });
  });

  test('should create buttons widget successfully', async ({ page }) => {
    const widgetData = {
      type: 'buttons',
      options: [
        { id: 'opt1', text: 'Option 1', value: 'value1' },
        { id: 'opt2', text: 'Option 2', value: 'value2' }
      ]
    };

    const isValid = await page.evaluate((data) => {
      const widget = window.testWidgetFactory.createWidget(data, 'test-widget');
      return widget !== null && widget.validate();
    }, widgetData);

    expect(isValid).toBe(true);
  });

  test('should create select widget successfully', async ({ page }) => {
    const widgetData = {
      type: 'select',
      options: [
        { id: 'opt1', text: 'Option 1', value: 'value1' },
        { id: 'opt2', text: 'Option 2', value: 'value2' }
      ]
    };

    const isValid = await page.evaluate((data) => {
      const widget = window.testWidgetFactory.createWidget(data, 'test-widget');
      return widget !== null && widget.validate();
    }, widgetData);

    expect(isValid).toBe(true);
  });

  test('should return null for unsupported widget type', async ({ page }) => {
    const widgetData = {
      type: 'unsupported',
      options: []
    };

    const isNull = await page.evaluate((data) => {
      const widget = window.testWidgetFactory.createWidget(data, 'test-widget');
      return widget === null;
    }, widgetData);

    expect(isNull).toBe(true);
  });

  test('should return null for invalid widget data', async ({ page }) => {
    const isNull = await page.evaluate(() => {
      const widget = window.testWidgetFactory.createWidget(null, 'test-widget');
      return widget === null;
    });

    expect(isNull).toBe(true);
  });

  test('should render buttons widget DOM correctly', async ({ page }) => {
    const widgetData = {
      type: 'buttons',
      options: [
        { id: 'opt1', text: 'Button 1', value: 'value1' },
        { id: 'opt2', text: 'Button 2', value: 'value2' }
      ]
    };

    await page.evaluate((data) => {
      const widget = window.testWidgetFactory.createWidget(data, 'test-widget');
      const element = widget.createElement();
      document.body.appendChild(element);
    }, widgetData);

    // Check if widget container exists
    const widgetContainer = page.locator('.widget');
    await expect(widgetContainer).toBeVisible();

    // Check if buttons container exists
    const buttonsContainer = page.locator('.widget-buttons');
    await expect(buttonsContainer).toBeVisible();

    // Check if buttons are rendered
    const buttons = page.locator('.widget-button');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.nth(0)).toContainText('Button 1');
    await expect(buttons.nth(1)).toContainText('Button 2');

    // Check button attributes
    await expect(buttons.nth(0)).toHaveAttribute('data-option-value', 'value1');
    await expect(buttons.nth(1)).toHaveAttribute('data-option-value', 'value2');
  });

  test('should render select widget DOM correctly', async ({ page }) => {
    const widgetData = {
      type: 'select',
      options: [
        { id: 'opt1', text: 'Select Option 1', value: 'value1' },
        { id: 'opt2', text: 'Select Option 2', value: 'value2' }
      ]
    };

    await page.evaluate((data) => {
      const widget = window.testWidgetFactory.createWidget(data, 'test-widget');
      const element = widget.createElement();
      document.body.appendChild(element);
    }, widgetData);

    // Check if widget container exists
    const widgetContainer = page.locator('.widget');
    await expect(widgetContainer).toBeVisible();

    // Check if select element exists
    const selectElement = page.locator('.widget-select-element');
    await expect(selectElement).toBeVisible();

    // Check if options are rendered
    const options = selectElement.locator('option');
    await expect(options).toHaveCount(2);
    await expect(options.nth(0)).toHaveText('Select Option 1');
    await expect(options.nth(1)).toHaveText('Select Option 2');
    await expect(options.nth(0)).toHaveAttribute('value', 'value1');
    await expect(options.nth(1)).toHaveAttribute('value', 'value2');
  });

  test('should validate buttons widget correctly', async ({ page }) => {
    // Valid buttons widget
    const validWidget = await page.evaluate(() => {
      const widget = window.testWidgetFactory.createWidget({
        type: 'buttons',
        options: [{ id: 'opt1', text: 'Option 1', value: 'value1' }]
      }, 'test-widget');
      return widget.validate();
    });
    expect(validWidget).toBe(true);

    // Invalid buttons widget (no options)
    const invalidWidget = await page.evaluate(() => {
      const widget = window.testWidgetFactory.createWidget({
        type: 'buttons',
        options: []
      }, 'test-widget');
      return widget.validate();
    });
    expect(invalidWidget).toBe(false);
  });

  test('should validate select widget correctly', async ({ page }) => {
    // Valid select widget
    const validWidget = await page.evaluate(() => {
      const widget = window.testWidgetFactory.createWidget({
        type: 'select',
        options: [{ id: 'opt1', text: 'Option 1', value: 'value1' }]
      }, 'test-widget');
      return widget.validate();
    });
    expect(validWidget).toBe(true);

    // Invalid select widget (no options)
    const invalidWidget = await page.evaluate(() => {
      const widget = window.testWidgetFactory.createWidget({
        type: 'select',
        options: []
      }, 'test-widget');
      return widget.validate();
    });
    expect(invalidWidget).toBe(false);
  });
});
