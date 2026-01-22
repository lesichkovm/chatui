import { test, expect } from '@playwright/test';

test.describe('Date Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create date widget with default values', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { DateWidget } from '/src/modules/widgets/date-widget.js';
        window.DateWidget = DateWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const DateWidget = window.DateWidget;
      const widgetData = {
        type: 'date',
        props: {
          label: 'Birth Date',
          defaultValue: '2000-01-01'
        }
      };
      const widget = new DateWidget(widgetData, 'dt-1');
      document.body.appendChild(widget.createElement());
    });

    const label = page.locator('.widget-date-label');
    await expect(label).toHaveText('Birth Date');

    const input = page.locator('.widget-date-input');
    await expect(input).toHaveAttribute('type', 'date');
    await expect(input).toHaveValue('2000-01-01');

    const display = page.locator('.widget-date-display');
    await expect(display).toHaveText('Saturday, January 1, 2000');
  });

  test('should handle min and max date constraints', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { DateWidget } from '/src/modules/widgets/date-widget.js';
        window.DateWidget = DateWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const DateWidget = window.DateWidget;
      const widgetData = {
        type: 'date',
        props: {
          minDate: '2023-01-01',
          maxDate: '2023-12-31'
        }
      };
      const widget = new DateWidget(widgetData, 'dt-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-date-input');
    await expect(input).toHaveAttribute('min', '2023-01-01');
    await expect(input).toHaveAttribute('max', '2023-12-31');
  });

  test('should handle submit interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { DateWidget } from '/src/modules/widgets/date-widget.js';
        window.DateWidget = DateWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const DateWidget = window.DateWidget;
        const widgetData = {
          type: 'date',
          props: {
            defaultValue: '2023-05-20',
            formatDate: true,
            formatOptions: { year: 'numeric', month: 'short', day: 'numeric' }
          }
        };
        const widget = new DateWidget(widgetData, 'dt-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve({
            eventDetail: (e as CustomEvent).detail,
            isDisabled: (element.querySelector('.widget-date-input') as HTMLInputElement).disabled
          });
        });

        (element.querySelector('.widget-date-submit') as HTMLButtonElement).click();
      });
    });

    expect(result.eventDetail).toEqual({
      value: '2023-05-20',
      formattedValue: 'May 20, 2023',
      inputType: 'date',
      widgetType: 'date',
      widgetId: 'dt-1'
    });
    expect(result.isDisabled).toBe(true);
  });

  test('should validate required field', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { DateWidget } from '/src/modules/widgets/date-widget.js';
        window.DateWidget = DateWidget;
      </script>
    `);

    const hasErrorClass = await page.evaluate(() => {
      // @ts-ignore
      const DateWidget = window.DateWidget;
      const widgetData = {
        type: 'date',
        props: { required: true }
      };
      const widget = new DateWidget(widgetData, 'dt-1');
      const element = widget.createElement();
      document.body.appendChild(element);

      (element.querySelector('.widget-date-submit') as HTMLButtonElement).click();
      
      const input = element.querySelector('.widget-date-input') as HTMLInputElement;
      return input.classList.contains('widget-date-error');
    });

    expect(hasErrorClass).toBe(true);
  });

  test('should support datetime-local input type', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { DateWidget } from '/src/modules/widgets/date-widget.js';
        window.DateWidget = DateWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const DateWidget = window.DateWidget;
      const widgetData = {
        type: 'date',
        props: { inputType: 'datetime-local' }
      };
      const widget = new DateWidget(widgetData, 'dt-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-date-input');
    await expect(input).toHaveAttribute('type', 'datetime-local');
    
    // Formatted display should be hidden for non-date types
    const display = page.locator('.widget-date-display');
    await expect(display).toHaveCount(0);
  });
});
