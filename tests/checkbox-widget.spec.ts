import { test, expect } from '@playwright/test';

test.describe('Checkbox Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create checkbox widget with options and submit button', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CheckboxWidget } from '/src/modules/widgets/checkbox-widget.js';
        window.CheckboxWidget = CheckboxWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const CheckboxWidget = window.CheckboxWidget;
      const widgetData = {
        type: 'checkbox',
        props: {
          buttonText: 'Save Selections',
          options: [
            { id: 'opt1', text: 'Option 1', value: 'val1', checked: true },
            { id: 'opt2', label: 'Option 2', value: 'val2' }
          ]
        }
      };
      const widget = new CheckboxWidget(widgetData, 'cb-1');
      document.body.appendChild(widget.createElement());
    });

    const checkboxes = page.locator('.widget-checkbox');
    await expect(checkboxes).toHaveCount(2);
    await expect(checkboxes.nth(0)).toBeChecked();
    await expect(checkboxes.nth(1)).not.toBeChecked();

    const labels = page.locator('.widget-checkbox-label');
    await expect(labels.nth(0)).toHaveText('Option 1');
    await expect(labels.nth(1)).toHaveText('Option 2');

    const submitBtn = page.locator('.widget-checkbox-submit');
    await expect(submitBtn).toHaveText('Save Selections');
  });

  test('should handle horizontal layout', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CheckboxWidget } from '/src/modules/widgets/checkbox-widget.js';
        window.CheckboxWidget = CheckboxWidget;
      </script>
    `);

    const style = await page.evaluate(() => {
      // @ts-ignore
      const CheckboxWidget = window.CheckboxWidget;
      const widgetData = {
        type: 'checkbox',
        props: {
          layout: 'horizontal',
          options: [{ id: '1', text: '1' }]
        }
      };
      const widget = new CheckboxWidget(widgetData, 'cb-1');
      const element = widget.createElement();
      const optionsContainer = element.querySelector('.widget-checkbox-options') as HTMLElement;
      return optionsContainer.getAttribute('style');
    });

    expect(style).toContain('display: flex;');
    expect(style).toContain('flex-wrap: wrap;');
    expect(style).toContain('gap: 12px;');
  });

  test('should handle disabled state', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CheckboxWidget } from '/src/modules/widgets/checkbox-widget.js';
        window.CheckboxWidget = CheckboxWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const CheckboxWidget = window.CheckboxWidget;
      const widgetData = {
        type: 'checkbox',
        props: {
          disabled: true,
          options: [
            { id: 'opt1', text: 'Option 1' },
            { id: 'opt2', text: 'Option 2', disabled: false } // Should still be disabled because parent is disabled
          ]
        }
      };
      const widget = new CheckboxWidget(widgetData, 'cb-1');
      document.body.appendChild(widget.createElement());
    });

    const checkboxes = page.locator('.widget-checkbox');
    await expect(checkboxes.nth(0)).toBeDisabled();
    await expect(checkboxes.nth(1)).toBeDisabled();
    
    const submitBtn = page.locator('.widget-checkbox-submit');
    await expect(submitBtn).toBeDisabled();
  });

  test('should handle individual option disabled state', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CheckboxWidget } from '/src/modules/widgets/checkbox-widget.js';
        window.CheckboxWidget = CheckboxWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const CheckboxWidget = window.CheckboxWidget;
      const widgetData = {
        type: 'checkbox',
        props: {
          options: [
            { id: 'opt1', text: 'Enabled' },
            { id: 'opt2', text: 'Disabled', disabled: true }
          ]
        }
      };
      const widget = new CheckboxWidget(widgetData, 'cb-1');
      document.body.appendChild(widget.createElement());
    });

    await expect(page.locator('.widget-checkbox').nth(0)).toBeEnabled();
    await expect(page.locator('.widget-checkbox').nth(1)).toBeDisabled();
  });

  test('should handle submit interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CheckboxWidget } from '/src/modules/widgets/checkbox-widget.js';
        window.CheckboxWidget = CheckboxWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const CheckboxWidget = window.CheckboxWidget;
        const widgetData = {
          type: 'checkbox',
          props: {
            options: [
              { id: 'opt1', text: 'Option 1', value: 'v1' },
              { id: 'opt2', text: 'Option 2', value: 'v2' }
            ]
          }
        };
        const widget = new CheckboxWidget(widgetData, 'cb-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        // Check the second one
        (element.querySelector('#checkbox-cb-1-opt2') as HTMLInputElement).checked = true;

        document.addEventListener('widgetInteraction', (e) => {
          resolve({
            eventDetail: (e as CustomEvent).detail,
            isSubmitDisabled: (element.querySelector('.widget-checkbox-submit') as HTMLButtonElement).disabled,
            isCheckboxDisabled: (element.querySelector('#checkbox-cb-1-opt2') as HTMLInputElement).disabled
          });
        });

        (element.querySelector('.widget-checkbox-submit') as HTMLButtonElement).click();
      });
    });

    expect(result.eventDetail.selectedOptions).toEqual([
      { id: 'opt2', value: 'v2', text: 'Option 2' }
    ]);
    expect(result.isSubmitDisabled).toBe(true);
    expect(result.isCheckboxDisabled).toBe(true);
  });

  test('should respect allowEmpty prop', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CheckboxWidget } from '/src/modules/widgets/checkbox-widget.js';
        window.CheckboxWidget = CheckboxWidget;
      </script>
    `);

    const interactionCount = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const CheckboxWidget = window.CheckboxWidget;
        let count = 0;
        document.addEventListener('widgetInteraction', () => {
          count++;
        });

        const widgetData = {
          type: 'checkbox',
          props: {
            allowEmpty: false,
            options: [{ id: '1', text: '1' }]
          }
        };
        const widget = new CheckboxWidget(widgetData, 'cb-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        const submit = element.querySelector('.widget-checkbox-submit') as HTMLButtonElement;
        submit.click(); // Should NOT trigger because empty and allowEmpty=false
        
        // Wait a bit and resolve
        setTimeout(() => resolve(count), 100);
      });
    });

    expect(interactionCount).toBe(0);
  });

  test('should hide submit button if showSubmitButton is false', async ({ page }) => {
     await page.setContent(`
      <script type="module">
        import { CheckboxWidget } from '/src/modules/widgets/checkbox-widget.js';
        window.CheckboxWidget = CheckboxWidget;
      </script>
    `);

    const hasSubmit = await page.evaluate(() => {
       // @ts-ignore
      const CheckboxWidget = window.CheckboxWidget;
      const widgetData = {
        type: 'checkbox',
        props: {
          showSubmitButton: false,
          options: [{ id: '1', text: '1' }]
        }
      };
      const widget = new CheckboxWidget(widgetData, 'cb-1');
      const element = widget.createElement();
      return !!element.querySelector('.widget-checkbox-submit');
    });

    expect(hasSubmit).toBe(false);
  });
});
