import { test, expect } from '@playwright/test';

test.describe('Radio Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create radio widget with options', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { RadioWidget } from '/src/modules/widgets/radio-widget.js';
        window.RadioWidget = RadioWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const RadioWidget = window.RadioWidget;
      const widgetData = {
        type: 'radio',
        props: {
          options: [
            { id: 'opt1', text: 'Option 1', value: 'v1', checked: true },
            { id: 'opt2', text: 'Option 2', value: 'v2' }
          ]
        }
      };
      const widget = new RadioWidget(widgetData, 'rd-1');
      document.body.appendChild(widget.createElement());
    });

    const radios = page.locator('.widget-radio');
    await expect(radios).toHaveCount(2);
    await expect(radios.nth(0)).toBeChecked();
    await expect(radios.nth(1)).not.toBeChecked();
    
    // Check names are same
    const name1 = await radios.nth(0).getAttribute('name');
    const name2 = await radios.nth(1).getAttribute('name');
    expect(name1).toBe(name2);
    expect(name1).toBe('radio-rd-1');
  });

  test('should handle submit interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { RadioWidget } from '/src/modules/widgets/radio-widget.js';
        window.RadioWidget = RadioWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const RadioWidget = window.RadioWidget;
        const widgetData = {
          type: 'radio',
          props: {
            options: [
              { id: 'opt1', text: 'Option 1', value: 'v1' },
              { id: 'opt2', text: 'Option 2', value: 'v2' }
            ]
          }
        };
        const widget = new RadioWidget(widgetData, 'rd-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        // Select second radio
        (element.querySelectorAll('.widget-radio')[1] as HTMLInputElement).checked = true;

        document.addEventListener('widgetInteraction', (e) => {
          resolve((e as CustomEvent).detail);
        });

        (element.querySelector('.widget-radio-submit') as HTMLButtonElement).click();
      });
    });

    expect(result.selectedOption).toEqual({
      id: 'opt2',
      value: 'v2',
      text: 'Option 2'
    });
  });

  test('should support getValue and setValue', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { RadioWidget } from '/src/modules/widgets/radio-widget.js';
        window.RadioWidget = RadioWidget;
      </script>
    `);

    const value = await page.evaluate(() => {
       // @ts-ignore
      const RadioWidget = window.RadioWidget;
      const widget = new RadioWidget({
        type: 'radio',
        props: { options: [{ id: '1', value: 'v1' }, { id: '2', value: 'v2' }] }
      }, 'rd-1');
      const element = widget.createElement();
      document.body.appendChild(element);
      widget.element = element;

      widget.setValue('v2');
      return widget.getValue();
    });

    expect(value).toBe('v2');
  });
});
