import { test, expect } from '@playwright/test';

test.describe('Button Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create valid button element', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonWidget } from '/src/modules/widgets/button-widget.js';
        window.ButtonWidget = ButtonWidget;
      </script>
    `);

    const buttonHtml = await page.evaluate(() => {
      // @ts-ignore
      const ButtonWidget = window.ButtonWidget;
      const widgetData = {
        type: 'button',
        props: {
          label: 'Click Me',
          variant: 'secondary',
          size: 'large',
          value: 'btn-value'
        }
      };
      const widget = new ButtonWidget(widgetData, 'btn-id');
      return widget.createElement().outerHTML;
    });

    expect(buttonHtml).toContain('class="widget-button variant-secondary size-large"');
    expect(buttonHtml).toContain('Click Me');
    expect(buttonHtml).toContain('data-value="btn-value"');
  });

  test('should handle invalid data gracefully', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonWidget } from '/src/modules/widgets/button-widget.js';
        window.ButtonWidget = ButtonWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      // @ts-ignore
      const ButtonWidget = window.ButtonWidget;
      const widget = new ButtonWidget({ type: 'button' }, 'btn-id'); // Missing props
      const element = widget.createElement();
      return {
        nodeType: element.nodeType,
        text: element.textContent
      };
    });

    expect(result.nodeType).toBe(8); // Comment node
    expect(result.text).toBe('Invalid button widget data');
  });

  test('should apply disabled state', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonWidget } from '/src/modules/widgets/button-widget.js';
        window.ButtonWidget = ButtonWidget;
      </script>
    `);

    const isDisabled = await page.evaluate(() => {
      // @ts-ignore
      const ButtonWidget = window.ButtonWidget;
      const widgetData = {
        type: 'button',
        props: {
          label: 'Disabled',
          disabled: true
        }
      };
      const widget = new ButtonWidget(widgetData, 'btn-id');
      const element = widget.createElement();
      return element.disabled && element.classList.contains('widget-button-disabled');
    });

    expect(isDisabled).toBe(true);
  });

  test('should handle click interaction and disable self', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonWidget } from '/src/modules/widgets/button-widget.js';
        window.ButtonWidget = ButtonWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ButtonWidget = window.ButtonWidget;
        const widgetData = {
          type: 'button',
          props: {
            label: 'Submit',
            value: 'submit-val'
          }
        };
        const widget = new ButtonWidget(widgetData, 'btn-id');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
           resolve({
             eventDetail: e.detail,
             isDisabled: element.disabled
           });
        });

        element.click();
      });
    });

    expect(result.eventDetail).toEqual({
      widgetId: 'btn-id',
      value: 'submit-val',
      label: 'Submit',
      widgetType: 'button'
    });
    expect(result.isDisabled).toBe(true);
  });

  test('should not disable on click if configured', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonWidget } from '/src/modules/widgets/button-widget.js';
        window.ButtonWidget = ButtonWidget;
      </script>
    `);

    const isDisabled = await page.evaluate(() => {
       // @ts-ignore
      const ButtonWidget = window.ButtonWidget;
      const widgetData = {
        type: 'button',
        props: {
          label: 'Toggle',
          disableOnClick: false
        }
      };
      const widget = new ButtonWidget(widgetData, 'btn-id');
      const element = widget.createElement();
      element.click(); // no await needed for sync click
      return element.disabled;
    });

    expect(isDisabled).toBe(false);
  });

  test('should apply custom styles', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonWidget } from '/src/modules/widgets/button-widget.js';
        window.ButtonWidget = ButtonWidget;
      </script>
    `);

    const color = await page.evaluate(() => {
      // @ts-ignore
      const ButtonWidget = window.ButtonWidget;
      const widgetData = {
        type: 'button',
        props: {
          label: 'Styled',
          style: { color: 'red' }
        }
      };
      const widget = new ButtonWidget(widgetData, 'btn-id');
      const element = widget.createElement();
      return element.style.color;
    });

    expect(color).toBe('red');
  });
});
