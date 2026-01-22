import { test, expect } from '@playwright/test';

test.describe('Card Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create card element with default classes', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CardWidget } from '/src/modules/widgets/card-widget.js';
        window.CardWidget = CardWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      // @ts-ignore
      const CardWidget = window.CardWidget;
      const widget = new CardWidget({ type: 'card' }, 'card-1');
      const element = widget.createElement();
      return {
        className: element.className
      };
    });

    expect(result.className).toContain('widget-card');
    expect(result.className).toContain('variant-default');
    expect(result.className).toContain('padding-medium');
  });

  test('should apply variant and padding props', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CardWidget } from '/src/modules/widgets/card-widget.js';
        window.CardWidget = CardWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      // @ts-ignore
      const CardWidget = window.CardWidget;
      const widget = new CardWidget({
        type: 'card',
        props: {
          variant: 'elevated',
          padding: 'large'
        }
      }, 'card-1');
      const element = widget.createElement();
      return {
        className: element.className
      };
    });

    expect(result.className).toContain('variant-elevated');
    expect(result.className).toContain('padding-large');
  });

  test('should apply custom styles', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { CardWidget } from '/src/modules/widgets/card-widget.js';
        window.CardWidget = CardWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      // @ts-ignore
      const CardWidget = window.CardWidget;
      const widget = new CardWidget({
        type: 'card',
        props: {
          style: {
            backgroundColor: 'red',
            borderRadius: '10px'
          }
        }
      }, 'card-1');
      const element = widget.createElement();
      return {
        backgroundColor: element.style.backgroundColor,
        borderRadius: element.style.borderRadius
      };
    });

    expect(result.backgroundColor).toBe('red');
    expect(result.borderRadius).toBe('10px');
  });
});
