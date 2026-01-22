import { test, expect } from '@playwright/test';

test.describe('Container Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create container with flex layout', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ContainerWidget } from '/src/modules/widgets/container-widget.js';
        window.ContainerWidget = ContainerWidget;
      </script>
    `);

    const style = await page.evaluate(() => {
      // @ts-ignore
      const ContainerWidget = window.ContainerWidget;
      const widgetData = {
        type: 'container',
        props: {
          layout: 'horizontal',
          gap: 'large',
          alignment: 'center',
          verticalAlignment: 'end'
        }
      };
      const widget = new ContainerWidget(widgetData, 'cont-1');
      const element = widget.createElement();
      return element.getAttribute('style');
    });

    expect(style).toContain('display: flex;');
    expect(style).toContain('flex-direction: row;');
    expect(style).toContain('gap: 24px;');
    expect(style).toContain('justify-content: center;');
    expect(style).toContain('align-items: flex-end;');
  });

  test('should create container with grid layout', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ContainerWidget } from '/src/modules/widgets/container-widget.js';
        window.ContainerWidget = ContainerWidget;
      </script>
    `);

    const computedStyle = await page.evaluate(() => {
      // @ts-ignore
      const ContainerWidget = window.ContainerWidget;
      const widgetData = {
        type: 'container',
        props: {
          layout: 'grid',
          columns: 3,
          gap: 'small',
          alignment: 'stretch'
        }
      };
      const widget = new ContainerWidget(widgetData, 'cont-1');
      const element = widget.createElement();
      document.body.appendChild(element);
      const style = window.getComputedStyle(element);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap,
        justifyItems: style.justifyItems,
        alignItems: style.alignItems
      };
    });

    expect(computedStyle.display).toBe('grid');
    // Note: grid-template-columns might be computed to pixels, so we just check it's set
    expect(computedStyle.gridTemplateColumns).not.toBe('none');
    expect(computedStyle.gap).toBe('8px');
    expect(computedStyle.justifyItems).toBe('stretch');
    expect(computedStyle.alignItems).toBe('stretch');
  });

  test('should collect form values in form mode', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ContainerWidget } from '/src/modules/widgets/container-widget.js';
        window.ContainerWidget = ContainerWidget;
      </script>
    `);

    const values = await page.evaluate(() => {
      // @ts-ignore
      const ContainerWidget = window.ContainerWidget;
      const widgetData = {
        type: 'container',
        props: { formMode: true }
      };
      const widget = new ContainerWidget(widgetData, 'form-1');
      const element = widget.createElement();
      document.body.appendChild(element);

      // Add mock input child
      const inputChild = document.createElement('div');
      inputChild.setAttribute('data-widget-id', 'input-1');
      const input = document.createElement('input');
      input.className = 'widget-input-element';
      input.value = 'hello';
      inputChild.appendChild(input);
      element.appendChild(inputChild);

      return widget.collectFormValues();
    });

    expect(values).toEqual({ 'input-1': 'hello' });
  });

  test('should handle form action when button is clicked in form mode', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ContainerWidget } from '/src/modules/widgets/container-widget.js';
        window.ContainerWidget = ContainerWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ContainerWidget = window.ContainerWidget;
        const widgetData = {
          type: 'container',
          props: { formMode: true }
        };
        const widget = new ContainerWidget(widgetData, 'form-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        // Add mock input
        const inputChild = document.createElement('div');
        inputChild.setAttribute('data-widget-id', 'name');
        const input = document.createElement('input');
        input.className = 'widget-input-element';
        input.value = 'John Doe';
        inputChild.appendChild(input);
        element.appendChild(inputChild);

        // Add mock button
        const buttonChild = document.createElement('div');
        buttonChild.setAttribute('data-widget-id', 'submit-btn');
        element.appendChild(buttonChild);

        document.addEventListener('widgetInteraction', (e) => {
          if ((e as CustomEvent).detail.widgetType === 'container-form') {
            resolve((e as CustomEvent).detail);
          }
        });

        // Simulate button interaction
        const event = new CustomEvent('widgetInteraction', {
          detail: {
            widgetId: 'submit-btn',
            widgetType: 'button',
            optionId: 'submit'
          }
        });
        document.dispatchEvent(event);
      });
    });

    expect(result.formData).toEqual({ name: 'John Doe', 'submit-btn': undefined });
    expect(result.action).toBe('submit');
  });

  test('should reset form values', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ContainerWidget } from '/src/modules/widgets/container-widget.js';
        window.ContainerWidget = ContainerWidget;
      </script>
    `);

    const valueAfterReset = await page.evaluate(() => {
      // @ts-ignore
      const ContainerWidget = window.ContainerWidget;
      const widgetData = {
        type: 'container',
        props: { formMode: true }
      };
      const widget = new ContainerWidget(widgetData, 'form-1');
      const element = widget.createElement();
      document.body.appendChild(element);

      const input = document.createElement('input');
      input.className = 'widget-input-element';
      input.value = 'filled';
      element.appendChild(input);

      widget.reset();
      return input.value;
    });

    expect(valueAfterReset).toBe('');
  });
});
