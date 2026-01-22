import { test, expect } from '@playwright/test';

test.describe('Form Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create form container with layout', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { FormWidget } from '/src/modules/widgets/form-widget.js';
        window.FormWidget = FormWidget;
      </script>
    `);

    const style = await page.evaluate(() => {
      // @ts-ignore
      const FormWidget = window.FormWidget;
      const widget = new FormWidget({
        type: 'form',
        props: { layout: 'horizontal', gap: 'large' }
      }, 'form-1');
      const element = widget.createElement();
      return element.getAttribute('style');
    });

    expect(style).toContain('display: flex;');
    expect(style).toContain('flex-direction: row;');
    expect(style).toContain('gap: 24px;');
  });

  test('should collect values from child inputs', async ({ page }) => {
     await page.setContent(`
      <script type="module">
        import { FormWidget } from '/src/modules/widgets/form-widget.js';
        window.FormWidget = FormWidget;
      </script>
    `);

    const values = await page.evaluate(() => {
      // @ts-ignore
      const FormWidget = window.FormWidget;
      const widget = new FormWidget({ type: 'form' }, 'form-1');
      const element = widget.createElement();
      document.body.appendChild(element);

      // Add mock input
      const inputChild = document.createElement('div');
      inputChild.setAttribute('data-widget-id', 'username');
      const input = document.createElement('input');
      input.className = 'widget-input-element';
      input.value = 'testuser';
      inputChild.appendChild(input);
      element.appendChild(inputChild);

      return widget.collectFormValues();
    });

    expect(values).toEqual({ username: 'testuser' });
  });

  test('should handle form submission action', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { FormWidget } from '/src/modules/widgets/form-widget.js';
        window.FormWidget = FormWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        const FormWidget = window.FormWidget;
        const widget = new FormWidget({ type: 'form' }, 'form-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        // Add mock input
        const inputChild = document.createElement('div');
        inputChild.setAttribute('data-widget-id', 'email');
        const input = document.createElement('input');
        input.className = 'widget-input-element';
        input.value = 'test@example.com';
        inputChild.appendChild(input);
        element.appendChild(inputChild);

        // Add mock button container
        const buttonChild = document.createElement('div');
        buttonChild.setAttribute('data-widget-id', 'submit-btn');
        element.appendChild(buttonChild);

        const timeout = setTimeout(() => {
          reject(new Error('Interaction event not received within 2s'));
        }, 2000);

        document.addEventListener('widgetInteraction', (e) => {
          const detail = (e as CustomEvent).detail;
          if (detail.widgetType === 'form') {
            clearTimeout(timeout);
            resolve(detail);
          }
        });

        // Simulate child button interaction
        const event = new CustomEvent('widgetInteraction', {
          detail: {
            widgetId: 'submit-btn',
            widgetType: 'button',
            action: 'submit'
          }
        });
        document.dispatchEvent(event);
      });
    });

    expect(result.formData).toEqual({ email: 'test@example.com', 'submit-btn': undefined });
    expect(result.action).toBe('submit');
  });

  test('should reset form fields', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { FormWidget } from '/src/modules/widgets/form-widget.js';
        window.FormWidget = FormWidget;
      </script>
    `);

    const valueAfterReset = await page.evaluate(() => {
       // @ts-ignore
      const FormWidget = window.FormWidget;
      const widget = new FormWidget({ type: 'form' }, 'form-1');
      const element = widget.createElement();
      document.body.appendChild(element);

      const input = document.createElement('input');
      input.className = 'widget-input-element';
      input.value = 'to-be-cleared';
      element.appendChild(input);

      widget.reset();
      return input.value;
    });

    expect(valueAfterReset).toBe('');
  });
});