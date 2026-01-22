import { test, expect } from '@playwright/test';

test.describe('Input Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create input widget with placeholder', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { InputWidget } from '/src/modules/widgets/input-widget.js';
        window.InputWidget = InputWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const InputWidget = window.InputWidget;
      const widget = new InputWidget({
        type: 'input',
        props: { placeholder: 'Your Name' }
      }, 'in-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-input-element');
    await expect(input).toHaveAttribute('placeholder', 'Your Name');
    await expect(page.locator('.widget-input-submit')).toHaveCount(0); // Phase 3: hidden by default
  });

  test('should show submit button if enabled', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { InputWidget } from '/src/modules/widgets/input-widget.js';
        window.InputWidget = InputWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const InputWidget = window.InputWidget;
      const widget = new InputWidget({
        type: 'input',
        props: { showSubmitButton: true, buttonText: 'Go' }
      }, 'in-1');
      document.body.appendChild(widget.createElement());
    });

    const submitBtn = page.locator('.widget-input-submit');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveText('Go');
  });

  test('should emit value change on input', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { InputWidget } from '/src/modules/widgets/input-widget.js';
        window.InputWidget = InputWidget;
      </script>
    `);

    const value = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const InputWidget = window.InputWidget;
        const widget = new InputWidget({ type: 'input' }, 'in-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetValueChanged', (e) => {
          if ((e as CustomEvent).detail.widgetId === 'in-1') {
            resolve((e as CustomEvent).detail.value);
          }
        });

        const input = element.querySelector('.widget-input-element') as HTMLInputElement;
        input.value = 'test val';
        input.dispatchEvent(new Event('input'));
      });
    });

    expect(value).toBe('test val');
  });

  test('should handle submission on Enter', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { InputWidget } from '/src/modules/widgets/input-widget.js';
        window.InputWidget = InputWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const InputWidget = window.InputWidget;
        const widget = new InputWidget({ type: 'input' }, 'in-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve((e as CustomEvent).detail);
        });

        const input = element.querySelector('.widget-input-element') as HTMLInputElement;
        input.value = 'submitted message';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        input.dispatchEvent(event);
      });
    });

    expect(result).toEqual({
      value: 'submitted message',
      inputType: 'text',
      widgetType: 'input',
      widgetId: 'in-1'
    });
  });

  test('should validate required prop', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { InputWidget } from '/src/modules/widgets/input-widget.js';
        window.InputWidget = InputWidget;
      </script>
    `);

    const hasErrorClass = await page.evaluate(() => {
      // @ts-ignore
      const InputWidget = window.InputWidget;
      const widget = new InputWidget({
        type: 'input',
        props: { required: true, showSubmitButton: true }
      }, 'in-1');
      const element = widget.createElement();
      document.body.appendChild(element);

      (element.querySelector('.widget-input-submit') as HTMLButtonElement).click();
      
      const input = element.querySelector('.widget-input-element') as HTMLInputElement;
      return input.classList.contains('widget-input-error');
    });

    expect(hasErrorClass).toBe(true);
  });
});
