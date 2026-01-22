import { test, expect } from '@playwright/test';

test.describe('Base Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should initialize with widget data and ID', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { BaseWidget } from '/src/modules/widgets/base-widget.js';
        
        // Expose to window for testing
        window.BaseWidget = BaseWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      // @ts-ignore
      const BaseWidget = window.BaseWidget;
      const widgetData = { type: 'test' };
      const widgetId = 'test-id';
      const widget = new BaseWidget(widgetData, widgetId);
      
      return {
        widgetData: widget.widgetData,
        widgetId: widget.widgetId
      };
    });

    expect(result.widgetData).toEqual({ type: 'test' });
    expect(result.widgetId).toBe('test-id');
  });

  test('should throw error when calling createElement directly', async ({ page }) => {
     await page.setContent(`
      <script type="module">
        import { BaseWidget } from '/src/modules/widgets/base-widget.js';
        window.BaseWidget = BaseWidget;
      </script>
    `);

    const error = await page.evaluate(() => {
       // @ts-ignore
      const BaseWidget = window.BaseWidget;
      const widget = new BaseWidget({ type: 'test' }, 'id');
      try {
        widget.createElement();
        return null;
      } catch (e) {
        return e.message;
      }
    });

    expect(error).toBe('createElement() must be implemented by subclass');
  });

  test('should return same element in getChildrenContainer by default', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { BaseWidget } from '/src/modules/widgets/base-widget.js';
        window.BaseWidget = BaseWidget;
      </script>
    `);

    const isSameElement = await page.evaluate(() => {
       // @ts-ignore
      const BaseWidget = window.BaseWidget;
      const widget = new BaseWidget({ type: 'test' }, 'id');
      const element = document.createElement('div');
      const container = widget.getChildrenContainer(element);
      return element === container;
    });

    expect(isSameElement).toBe(true);
  });

  test('should dispatch widgetInteraction event', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { BaseWidget } from '/src/modules/widgets/base-widget.js';
        window.BaseWidget = BaseWidget;
      </script>
    `);

    const eventData = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const BaseWidget = window.BaseWidget;
        const widget = new BaseWidget({ type: 'test' }, 'test-id');
        
        document.addEventListener('widgetInteraction', (e) => {
          resolve(e.detail);
        });

        widget.handleInteraction({
          type: 'click',
          value: 'btn-1'
        });
      });
    });

    expect(eventData).toEqual({
      widgetId: 'test-id',
      type: 'click',
      value: 'btn-1'
    });
  });

  test('should dispatch widgetValueChanged event', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { BaseWidget } from '/src/modules/widgets/base-widget.js';
        window.BaseWidget = BaseWidget;
      </script>
    `);

    const eventData = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const BaseWidget = window.BaseWidget;
        const widget = new BaseWidget({ type: 'test-type' }, 'test-id');
        
        document.addEventListener('widgetValueChanged', (e) => {
          resolve(e.detail);
        });

        widget.emitValueChange('new-value');
      });
    });

    expect(eventData).toEqual({
      widgetId: 'test-id',
      value: 'new-value',
      widgetType: 'test-type'
    });
  });

  test('should validate widget data', async ({ page }) => {
     await page.setContent(`
      <script type="module">
        import { BaseWidget } from '/src/modules/widgets/base-widget.js';
        window.BaseWidget = BaseWidget;
      </script>
    `);

    const validationResults = await page.evaluate(() => {
      // @ts-ignore
      const BaseWidget = window.BaseWidget;
      
      const validWidget = new BaseWidget({ type: 'test' }, 'id1');
      const invalidWidget1 = new BaseWidget({}, 'id2');
      const invalidWidget2 = new BaseWidget(null, 'id3');
      
      return {
        valid: validWidget.validate(),
        invalid1: invalidWidget1.validate(),
        invalid2: invalidWidget2.validate()
      };
    });

    expect(validationResults.valid).toBeTruthy();
    expect(validationResults.invalid1).toBeFalsy();
    expect(validationResults.invalid2).toBeFalsy();
  });
});
