import { test, expect } from '@playwright/test';

test.describe('Select Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create select widget with options', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { SelectWidget } from '/src/modules/widgets/select-widget.js';
        window.SelectWidget = SelectWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const SelectWidget = window.SelectWidget;
      const widgetData = {
        type: 'select',
        props: {
          placeholder: 'Choose one',
          options: [
            { id: 'opt1', text: 'Option 1', value: 'v1' },
            { id: 'opt2', text: 'Option 2', value: 'v2' }
          ]
        }
      };
      const widget = new SelectWidget(widgetData, 'sl-1');
      document.body.appendChild(widget.createElement());
    });

    const select = page.locator('.widget-select');
    const options = select.locator('option');
    await expect(options).toHaveCount(3); // placeholder + 2 options
    await expect(options.nth(0)).toHaveText('Choose one');
    await expect(options.nth(1)).toHaveText('Option 1');
  });

  test('should handle selection change', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { SelectWidget } from '/src/modules/widgets/select-widget.js';
        window.SelectWidget = SelectWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        const SelectWidget = window.SelectWidget;
        const widgetData = {
          type: 'select',
          props: {
            disableOnSelect: false,
            options: [
              { id: 'opt1', text: 'Option 1', value: 'v1' },
              { id: 'opt2', text: 'Option 2', value: 'v2' }
            ]
          }
        };
        const widget = new SelectWidget(widgetData, 'sl-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        const timeout = setTimeout(() => {
          const select = element.querySelector('.widget-select') as HTMLSelectElement;
          reject(new Error(`Interaction event not received. Select value: ${select.value}, Index: ${select.selectedIndex}`));
        }, 2000);

        document.addEventListener('widgetInteraction', (e) => {
          const detail = (e as CustomEvent).detail;
          if (detail.widgetId === 'sl-1') {
            clearTimeout(timeout);
            resolve(detail);
          }
        });

        const select = element.querySelector('.widget-select') as HTMLSelectElement;
        // Setting value doesn't always trigger change, but we dispatch it manually
        select.value = 'v2';
        select.dispatchEvent(new Event('change'));
      });
    });

    expect(result).toEqual({
      optionId: 'opt2',
      optionValue: 'v2',
      optionText: 'Option 2',
      widgetType: 'select',
      widgetId: 'sl-1'
    });
  });

  test('should support manual submit when disableOnSelect is true', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { SelectWidget } from '/src/modules/widgets/select-widget.js';
        window.SelectWidget = SelectWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const SelectWidget = window.SelectWidget;
        const widgetData = {
          type: 'select',
          props: {
            disableOnSelect: true, // This prop name in the class is used to defer interaction
            options: [{ id: 'opt1', text: 'Option 1', value: 'v1' }]
          }
        };
        const widget = new SelectWidget(widgetData, 'sl-1');
        const element = widget.createElement();
        document.body.appendChild(element);
        widget.element = element;

        document.addEventListener('widgetInteraction', (e) => {
          resolve((e as CustomEvent).detail);
        });

        const select = element.querySelector('.widget-select') as HTMLSelectElement;
        select.value = 'v1';
        select.dispatchEvent(new Event('change'));
        
        // At this point interaction should NOT have fired if disableOnSelect is true logic works
        // But the class implementation says: if (!disableOnSelect) this.handleInteraction(...)
        
        widget.submit();
      });
    });

    expect(result).toEqual({
      optionId: 'opt1',
      optionValue: 'v1',
      optionText: 'Option 1',
      widgetType: 'select',
      widgetId: 'sl-1'
    });
  });
});
