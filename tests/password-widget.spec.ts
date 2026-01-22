import { test, expect } from '@playwright/test';

test.describe('Password Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create password widget with toggle', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { PasswordWidget } from '/src/modules/widgets/password-widget.js';
        window.PasswordWidget = PasswordWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const PasswordWidget = window.PasswordWidget;
      const widget = new PasswordWidget({
        type: 'password',
        props: { placeholder: 'Secret' }
      }, 'pw-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-password-input');
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveAttribute('placeholder', 'Secret');

    const toggle = page.locator('.widget-password-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText('👁️');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { PasswordWidget } from '/src/modules/widgets/password-widget.js';
        window.PasswordWidget = PasswordWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const PasswordWidget = window.PasswordWidget;
      const widget = new PasswordWidget({ type: 'password' }, 'pw-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-password-input');
    const toggle = page.locator('.widget-password-toggle');

    await toggle.click();
    await expect(input).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveText('🙈');

    await toggle.click();
    await expect(input).toHaveAttribute('type', 'password');
    await expect(toggle).toHaveText('👁️');
  });

  test('should handle submission and clear field', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { PasswordWidget } from '/src/modules/widgets/password-widget.js';
        window.PasswordWidget = PasswordWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const PasswordWidget = window.PasswordWidget;
        const widget = new PasswordWidget({ type: 'password' }, 'pw-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve({
            eventDetail: (e as CustomEvent).detail,
            inputValueAfter: (element.querySelector('.widget-password-input') as HTMLInputElement).value
          });
        });

        const input = element.querySelector('.widget-password-input') as HTMLInputElement;
        input.value = 'mypassword';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        input.dispatchEvent(event);
      });
    });

    expect(result.eventDetail).toEqual({
      value: 'mypassword',
      maskedValue: '••••••••••',
      widgetType: 'password',
      widgetId: 'pw-1'
    });
    expect(result.inputValueAfter).toBe('');
  });

  test('should validate required password', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { PasswordWidget } from '/src/modules/widgets/password-widget.js';
        window.PasswordWidget = PasswordWidget;
      </script>
    `);

    const hasErrorClass = await page.evaluate(() => {
       // @ts-ignore
      const PasswordWidget = window.PasswordWidget;
      const widget = new PasswordWidget({
        type: 'password',
        props: { required: true, showSubmitButton: true }
      }, 'pw-1');
      const element = widget.createElement();
      document.body.appendChild(element);

      (element.querySelector('.widget-password-submit') as HTMLButtonElement).click();
      
      const input = element.querySelector('.widget-password-input') as HTMLInputElement;
      return input.classList.contains('widget-password-error');
    });

    expect(hasErrorClass).toBe(true);
  });
});
