import { test, expect } from '@playwright/test';

test.describe('Progress Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create progress widget with percentage', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ProgressWidget } from '/src/modules/widgets/progress-widget.js';
        window.ProgressWidget = ProgressWidget;
      </script>
    `);

    const barWidth = await page.evaluate(() => {
      // @ts-ignore
      const ProgressWidget = window.ProgressWidget;
      const widgetData = {
        type: 'progress',
        props: {
          label: 'Loading...',
          value: 75,
          max: 100
        }
      };
      const widget = new ProgressWidget(widgetData, 'pr-1');
      const element = widget.createElement();
      document.body.appendChild(element);
      return (element.querySelector('.widget-progress-bar') as HTMLElement).style.width;
    });

    expect(barWidth).toBe('75%');
    await expect(page.locator('.widget-progress-label')).toHaveText('Loading...');
    await expect(page.locator('.widget-progress-text')).toHaveText('75 / 100 (75%)');
  });

  test('should handle status indicator', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ProgressWidget } from '/src/modules/widgets/progress-widget.js';
        window.ProgressWidget = ProgressWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const ProgressWidget = window.ProgressWidget;
      const widgetData = {
        type: 'progress',
        props: {
          value: 100,
          max: 100,
          showStatus: true
        }
      };
      const widget = new ProgressWidget(widgetData, 'pr-1');
      document.body.appendChild(widget.createElement());
    });

    const status = page.locator('.widget-progress-status');
    await expect(status).toHaveText('Complete');
    await expect(status).toHaveClass(/complete/);
    await expect(page.locator('.widget-progress-bar')).toHaveClass(/complete/);
  });

  test('should validate progress data', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ProgressWidget } from '/src/modules/widgets/progress-widget.js';
        window.ProgressWidget = ProgressWidget;
      </script>
    `);

    const results = await page.evaluate(() => {
       // @ts-ignore
      const ProgressWidget = window.ProgressWidget;
      
      const valid = new ProgressWidget({ type: 'progress', props: { value: 10, max: 100 } }, 'id1').validate();
      const invalidNoProps = new ProgressWidget({ type: 'progress' }, 'id2').validate();
      const invalidMaxZero = new ProgressWidget({ type: 'progress', props: { value: 10, max: 0 } }, 'id3').validate();
      
      return { valid, invalidNoProps, invalidMaxZero };
    });

    expect(results.valid).toBe(true);
    expect(results.invalidNoProps).toBe(false);
    expect(results.invalidMaxZero).toBe(false);
  });

  test('should apply custom styles to bar and wrapper', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ProgressWidget } from '/src/modules/widgets/progress-widget.js';
        window.ProgressWidget = ProgressWidget;
      </script>
    `);

    const styles = await page.evaluate(() => {
       // @ts-ignore
      const ProgressWidget = window.ProgressWidget;
      const widgetData = {
        type: 'progress',
        props: {
          value: 50,
          max: 100,
          barStyle: { backgroundColor: 'green' },
          wrapperStyle: { height: '20px' }
        }
      };
      const widget = new ProgressWidget(widgetData, 'pr-1');
      const element = widget.createElement();
      return {
        barBg: (element.querySelector('.widget-progress-bar') as HTMLElement).style.backgroundColor,
        wrapperHeight: (element.querySelector('.widget-progress-bar-wrapper') as HTMLElement).style.height
      };
    });

    expect(styles.barBg).toBe('green');
    expect(styles.wrapperHeight).toBe('20px');
  });
});
