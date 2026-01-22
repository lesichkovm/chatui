import { test, expect } from '@playwright/test';

test.describe('Color Picker Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create color picker widget with default values', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ColorPickerWidget } from '/src/modules/widgets/color-picker-widget.js';
        window.ColorPickerWidget = ColorPickerWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const ColorPickerWidget = window.ColorPickerWidget;
      const widgetData = {
        type: 'color',
        props: {
          label: 'Pick Color',
          defaultColor: '#ff0000'
        }
      };
      const widget = new ColorPickerWidget(widgetData, 'cp-1');
      document.body.appendChild(widget.createElement());
    });

    const label = page.locator('.widget-color-picker-label');
    await expect(label).toHaveText('Pick Color');

    const input = page.locator('.widget-color-input');
    await expect(input).toHaveValue('#ff0000');

    const display = page.locator('.widget-color-display');
    await expect(display).toHaveText('#FF0000');
    await expect(display).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  });

  test('should render preset colors', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ColorPickerWidget } from '/src/modules/widgets/color-picker-widget.js';
        window.ColorPickerWidget = ColorPickerWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const ColorPickerWidget = window.ColorPickerWidget;
      const widgetData = {
        type: 'color',
        props: {
          presetColors: ['#ff0000', '#00ff00', '#0000ff']
        }
      };
      const widget = new ColorPickerWidget(widgetData, 'cp-1');
      document.body.appendChild(widget.createElement());
    });

    const presets = page.locator('.widget-color-preset');
    await expect(presets).toHaveCount(3);
    await expect(presets.nth(0)).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    await expect(presets.nth(1)).toHaveCSS('background-color', 'rgb(0, 255, 0)');
    await expect(presets.nth(2)).toHaveCSS('background-color', 'rgb(0, 0, 255)');
  });

  test('should update display when preset is clicked', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ColorPickerWidget } from '/src/modules/widgets/color-picker-widget.js';
        window.ColorPickerWidget = ColorPickerWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const ColorPickerWidget = window.ColorPickerWidget;
      const widgetData = {
        type: 'color',
        props: {
          presetColors: ['#00ff00']
        }
      };
      const widget = new ColorPickerWidget(widgetData, 'cp-1');
      document.body.appendChild(widget.createElement());
    });

    await page.locator('.widget-color-preset').click();

    const input = page.locator('.widget-color-input');
    await expect(input).toHaveValue('#00ff00');

    const display = page.locator('.widget-color-display');
    await expect(display).toHaveText('#00FF00');
  });

  test('should handle submit interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ColorPickerWidget } from '/src/modules/widgets/color-picker-widget.js';
        window.ColorPickerWidget = ColorPickerWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ColorPickerWidget = window.ColorPickerWidget;
        const widgetData = {
          type: 'color',
          props: {
            defaultColor: '#0000ff'
          }
        };
        const widget = new ColorPickerWidget(widgetData, 'cp-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve({
            eventDetail: (e as CustomEvent).detail,
            isDisabled: (element.querySelector('.widget-color-input') as HTMLInputElement).disabled
          });
        });

        (element.querySelector('.widget-color-picker-submit') as HTMLButtonElement).click();
      });
    });

    expect(result.eventDetail).toEqual({
      action: 'submit',
      color: '#0000ff',
      hex: '#0000FF',
      rgb: { r: 0, g: 0, b: 255 },
      widgetType: 'color',
      widgetId: 'cp-1'
    });
    expect(result.isDisabled).toBe(true);
  });

  test('should trigger onColorChange interaction if enabled', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ColorPickerWidget } from '/src/modules/widgets/color-picker-widget.js';
        window.ColorPickerWidget = ColorPickerWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ColorPickerWidget = window.ColorPickerWidget;
        const widgetData = {
          type: 'color',
          props: {
            onColorChange: true,
            presetColors: ['#ff00ff']
          }
        };
        const widget = new ColorPickerWidget(widgetData, 'cp-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          if ((e as CustomEvent).detail.action === 'colorChange') {
            resolve((e as CustomEvent).detail);
          }
        });

        (element.querySelector('.widget-color-preset') as HTMLButtonElement).click();
      });
    });

    expect(result).toEqual({
      action: 'colorChange',
      color: '#ff00ff',
      hex: '#FF00FF',
      widgetType: 'color',
      widgetId: 'cp-1'
    });
  });

  test('should support getValue and setValue', async ({ page }) => {
     await page.setContent(`
      <script type="module">
        import { ColorPickerWidget } from '/src/modules/widgets/color-picker-widget.js';
        window.ColorPickerWidget = ColorPickerWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
       // @ts-ignore
      const ColorPickerWidget = window.ColorPickerWidget;
      const widget = new ColorPickerWidget({ type: 'color' }, 'cp-1');
      const element = widget.createElement();
      document.body.appendChild(element);
      widget.element = element; // Need to set this or it tries to find by data-widget-id

      widget.setValue('#123456');
      const val = widget.getValue();
      return val;
    });

    expect(result).toBe('#123456');
  });
});
