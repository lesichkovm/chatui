import { test, expect } from '@playwright/test';

test.describe('Slider Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create slider widget with default values', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { SliderWidget } from '/src/modules/widgets/slider-widget.js';
        window.SliderWidget = SliderWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const SliderWidget = window.SliderWidget;
      const widgetData = {
        type: 'slider',
        props: {
          label: 'Volume',
          min: 0,
          max: 100,
          defaultValue: 50
        }
      };
      const widget = new SliderWidget(widgetData, 'sl-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-slider');
    await expect(input).toHaveAttribute('min', '0');
    await expect(input).toHaveAttribute('max', '100');
    await expect(input).toHaveValue('50');

    await expect(page.locator('.widget-slider-value')).toHaveText('50');
  });

  test('should update value display on input', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { SliderWidget } from '/src/modules/widgets/slider-widget.js';
        window.SliderWidget = SliderWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const SliderWidget = window.SliderWidget;
      const widget = new SliderWidget({ type: 'slider', props: { min: 0, max: 100, defaultValue: 0 } }, 'sl-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-slider');
    await input.fill('75'); // Playwright's fill for range input dispatches 'input' and 'change'
    
    await expect(page.locator('.widget-slider-value')).toHaveText('75');
  });

  test('should handle submit interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { SliderWidget } from '/src/modules/widgets/slider-widget.js';
        window.SliderWidget = SliderWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const SliderWidget = window.SliderWidget;
        const widget = new SliderWidget({ type: 'slider', props: { defaultValue: 30 } }, 'sl-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve((e as CustomEvent).detail);
        });

        (element.querySelector('.widget-slider-submit') as HTMLButtonElement).click();
      });
    });

    expect(result).toEqual({
      value: 30,
      min: 0,
      max: 100,
      step: 1,
      widgetType: 'slider',
      widgetId: 'sl-1'
    });
  });

  test('should support getValue and setValue', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { SliderWidget } from '/src/modules/widgets/slider-widget.js';
        window.SliderWidget = SliderWidget;
      </script>
    `);

    const value = await page.evaluate(() => {
       // @ts-ignore
      const SliderWidget = window.SliderWidget;
      const widget = new SliderWidget({ type: 'slider', props: { min: 0, max: 100 } }, 'sl-1');
      const element = widget.createElement();
      document.body.appendChild(element);
      widget.element = element;

      widget.setValue(88);
      return widget.getValue();
    });

    expect(value).toBe(88);
    await expect(page.locator('.widget-slider-value')).toHaveText('88');
  });
});
