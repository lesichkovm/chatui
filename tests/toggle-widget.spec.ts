import { test, expect } from '@playwright/test';

test.describe('Toggle Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create toggle widget', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ToggleWidget } from '/src/modules/widgets/toggle-widget.js';
        window.ToggleWidget = ToggleWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const ToggleWidget = window.ToggleWidget;
      const widget = new ToggleWidget({
        type: 'toggle',
        props: { label: 'Notifications', defaultValue: true }
      }, 'tg-1');
      document.body.appendChild(widget.createElement());
    });

    await expect(page.locator('.widget-toggle-label')).toHaveText('Notifications');
    await expect(page.locator('.widget-toggle-input')).toBeChecked();
    await expect(page.locator('.widget-toggle-slider')).toHaveClass(/active/);
    await expect(page.locator('.widget-toggle-value')).toHaveText('ON');
  });

  test('should handle toggle and submission', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ToggleWidget } from '/src/modules/widgets/toggle-widget.js';
        window.ToggleWidget = ToggleWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ToggleWidget = window.ToggleWidget;
        const widget = new ToggleWidget({ type: 'toggle' }, 'tg-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve((e as CustomEvent).detail);
        });

        const slider = element.querySelector('.widget-toggle-slider') as HTMLElement;
        slider.click(); // Turn ON (default was false)
        
        (element.querySelector('.widget-toggle-submit') as HTMLButtonElement).click();
      });
    });

    expect(result.value).toBe(true);
  });
});
