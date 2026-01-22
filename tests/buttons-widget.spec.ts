import { test, expect } from '@playwright/test';

test.describe('Buttons Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create a default buttons widget', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonsWidget } from '/src/modules/widgets/buttons-widget.js';
        window.ButtonsWidget = ButtonsWidget;
      </script>
    `);

    const widgetHtml = await page.evaluate(() => {
      // @ts-ignore
      const ButtonsWidget = window.ButtonsWidget;
      const widgetData = {
        type: 'buttons',
        props: {
          options: [
            { id: 'opt1', text: 'Option 1', value: 'val1' },
            { id: 'opt2', label: 'Label 2', value: 'val2' }
          ]
        }
      };
      const widget = new ButtonsWidget(widgetData, 'buttons-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      return element.outerHTML;
    });

    expect(widgetHtml).toContain('class="widget-buttons-container"');
    expect(widgetHtml).toContain('display: flex;');
    expect(widgetHtml).toContain('flex-direction: column;');
    expect(widgetHtml).toContain('gap: 8px;');
    expect(widgetHtml).toContain('justify-content: flex-start;');
    expect(widgetHtml).toContain('align-items: stretch;');

    const buttons = page.locator('.widget-buttons-container .widget-button');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.nth(0)).toContainText('Option 1');
    await expect(buttons.nth(0)).toHaveAttribute('data-option-id', 'opt1');
    await expect(buttons.nth(0)).toHaveAttribute('data-option-value', 'val1');
    await expect(buttons.nth(1)).toContainText('Label 2');
    await expect(buttons.nth(1)).toHaveAttribute('data-option-id', 'opt2');
    await expect(buttons.nth(1)).toHaveAttribute('data-option-value', 'val2');
  });

  test('should handle horizontal layout and alignment', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonsWidget } from '/src/modules/widgets/buttons-widget.js';
        window.ButtonsWidget = ButtonsWidget;
      </script>
    `);

    const containerStyle = await page.evaluate(() => {
      // @ts-ignore
      const ButtonsWidget = window.ButtonsWidget;
      const widgetData = {
        type: 'buttons',
        props: {
          layout: 'horizontal',
          gap: 'medium',
          alignment: 'center',
          verticalAlignment: 'center',
          options: [
            { id: 'btn1', text: 'Btn 1' },
            { id: 'btn2', text: 'Btn 2' }
          ]
        }
      };
      const widget = new ButtonsWidget(widgetData, 'buttons-id');
      const container = widget.createElement();
      document.body.appendChild(container);
      return container.getAttribute('style');
    });

    expect(containerStyle).toContain('display: flex;');
    expect(containerStyle).toContain('flex-direction: row;');
    expect(containerStyle).toContain('justify-content: center;');
    expect(containerStyle).toContain('align-items: center;');
    expect(containerStyle).toContain('gap: 16px;');
  });

  test('should apply button variants, sizes, and disabled states', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonsWidget } from '/src/modules/widgets/buttons-widget.js';
        window.ButtonsWidget = ButtonsWidget;
      </script>
    `);

    const buttonClasses = await page.evaluate(() => {
      // @ts-ignore
      const ButtonsWidget = window.ButtonsWidget;
      const widgetData = {
        type: 'buttons',
        props: {
          variant: 'secondary',
          size: 'large',
          options: [
            { id: 'btn1', text: 'Primary', variant: 'primary', size: 'medium', disabled: false },
            { id: 'btn2', text: 'Secondary Disabled', disabled: true },
            { id: 'btn3', text: 'Inherited Size', variant: 'tertiary' }
          ]
        }
      };
      const widget = new ButtonsWidget(widgetData, 'buttons-id');
      const container = widget.createElement();
      const buttons = container.querySelectorAll('.widget-button');
      return Array.from(buttons).map(btn => ({
        className: btn.className,
        textContent: btn.textContent,
        disabled: btn.disabled,
        variant: btn.classList.contains('variant-primary') ? 'primary' : 
                 btn.classList.contains('variant-secondary') ? 'secondary' : 
                 btn.classList.contains('variant-tertiary') ? 'tertiary' : 'default',
        size: btn.classList.contains('size-large') ? 'large' : 
              btn.classList.contains('size-medium') ? 'medium' : 'default'
      }));
    });

    expect(buttonClasses[0]).toEqual({
      className: 'widget-button variant-primary size-medium',
      textContent: 'Primary',
      disabled: false,
      variant: 'primary',
      size: 'medium'
    });
    expect(buttonClasses[1]).toEqual({
      className: 'widget-button variant-secondary size-large widget-button-disabled',
      textContent: 'Secondary Disabled',
      disabled: true,
      variant: 'secondary',
      size: 'large'
    });
    expect(buttonClasses[2]).toEqual({
      className: 'widget-button variant-tertiary size-large',
      textContent: 'Inherited Size',
      disabled: false,
      variant: 'tertiary',
      size: 'large'
    });
  });

  test('should handle button click interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonsWidget } from '/src/modules/widgets/buttons-widget.js';
        window.ButtonsWidget = ButtonsWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ButtonsWidget = window.ButtonsWidget;
        const widgetData = {
          type: 'buttons',
          props: {
            options: [
              { id: 'opt1', text: 'First', value: 'v1' },
              { id: 'opt2', text: 'Second', value: 'v2' }
            ]
          }
        };
        const widget = new ButtonsWidget(widgetData, 'buttons-id');
        const container = widget.createElement();
        document.body.appendChild(container);

        document.addEventListener('widgetInteraction', (e) => {
          resolve({
            eventDetail: (e as CustomEvent).detail,
            disabledButtons: Array.from(container.querySelectorAll('.widget-button')).map((btn: any) => btn.disabled)
          });
        });

        const firstButton = container.querySelector('.widget-button') as HTMLButtonElement;
        firstButton.click();
      });
    });

    expect(result.eventDetail).toEqual({
      widgetId: 'buttons-id',
      optionId: 'opt1',
      optionValue: 'v1',
      optionText: 'First',
      widgetType: 'buttons'
    });
    expect(result.disabledButtons).toEqual([true, true]);
  });

  test('should apply custom styles to container and buttons', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonsWidget } from '/src/modules/widgets/buttons-widget.js';
        window.ButtonsWidget = ButtonsWidget;
      </script>
    `);

    const styles = await page.evaluate(() => {
      // @ts-ignore
      const ButtonsWidget = window.ButtonsWidget;
      const widgetData = {
        type: 'buttons',
        props: {
          style: { backgroundColor: 'lightblue', padding: '20px' },
          buttonStyle: { color: 'rgb(0, 0, 139)', fontWeight: 'bold' }, // darkblue is rgb(0, 0, 139) in some browsers
          options: [
            { id: 'btn1', text: 'Styled Btn', style: { border: '2px solid green' } },
            { id: 'btn2', text: 'Inherited Style' }
          ]
        }
      };
      const widget = new ButtonsWidget(widgetData, 'buttons-id');
      const container = widget.createElement();
      const buttons = container.querySelectorAll('.widget-button');
      return {
        containerStyle: container.getAttribute('style'),
        button1Style: buttons[0].getAttribute('style'),
        button2Style: buttons[1].getAttribute('style')
      };
    });

    expect(styles.containerStyle).toContain('background-color: lightblue;');
    expect(styles.containerStyle).toContain('padding: 20px;');
    
    // Check inherited button styles on second button
    expect(styles.button2Style).toContain('color: rgb(0, 0, 139)');
    expect(styles.button2Style).toContain('font-weight: bold;');
    
    // Check specific style on first button
    expect(styles.button1Style).toContain('border: 2px solid green;');
  });

  test('should validate buttons widget data', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ButtonsWidget } from '/src/modules/widgets/buttons-widget.js';
        window.ButtonsWidget = ButtonsWidget;
      </script>
    `);

    const validationResults = await page.evaluate(() => {
      // @ts-ignore
      const ButtonsWidget = window.ButtonsWidget;
      
      const validWidget = new ButtonsWidget({
        type: 'buttons',
        props: { options: [{ id: 'opt1', text: 'Valid' }] }
      }, 'id1');

      const invalidWidgetNoProps = new ButtonsWidget({ type: 'buttons' }, 'id2');
      const invalidWidgetNoOptions = new ButtonsWidget({ type: 'buttons', props: {} }, 'id3');
      const invalidWidgetEmptyOptions = new ButtonsWidget({ type: 'buttons', props: { options: [] } }, 'id4');
      const invalidWidgetWrongType = new ButtonsWidget({ type: 'button', props: { options: [{ id: 'opt1', text: 'Invalid' }] } }, 'id5');
      
      return {
        valid: validWidget.validate(),
        invalidNoProps: invalidWidgetNoProps.validate(),
        invalidNoOptions: invalidWidgetNoOptions.validate(),
        invalidEmptyOptions: invalidWidgetEmptyOptions.validate(),
        invalidWrongType: invalidWidgetWrongType.validate()
      };
    });

    expect(validationResults.valid).toBe(true);
    expect(validationResults.invalidNoProps).toBe(false);
    expect(validationResults.invalidNoOptions).toBe(false);
    expect(validationResults.invalidEmptyOptions).toBe(false);
    expect(validationResults.invalidWrongType).toBe(false);
  });
});