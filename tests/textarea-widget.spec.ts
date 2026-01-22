import { test, expect } from '@playwright/test';

test.describe('Textarea Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create textarea widget', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TextareaWidget } from '/src/modules/widgets/textarea-widget.js';
        window.TextareaWidget = TextareaWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const TextareaWidget = window.TextareaWidget;
      const widget = new TextareaWidget({
        type: 'textarea',
        props: { placeholder: 'Long text', rows: 6, maxLength: 100 }
      }, 'ta-1');
      document.body.appendChild(widget.createElement());
    });

    const textarea = page.locator('.widget-textarea');
    await expect(textarea).toHaveAttribute('placeholder', 'Long text');
    await expect(textarea).toHaveAttribute('rows', '6');
    await expect(textarea).toHaveAttribute('maxlength', '100');

    await expect(page.locator('.widget-textarea-counter')).toHaveText('0 / 100');
  });

  test('should update counter and handle submission', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TextareaWidget } from '/src/modules/widgets/textarea-widget.js';
        window.TextareaWidget = TextareaWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const TextareaWidget = window.TextareaWidget;
        const widget = new TextareaWidget({ 
          type: 'textarea', 
          props: { maxLength: 50, showSubmitButton: true } 
        }, 'ta-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve({
            eventDetail: (e as CustomEvent).detail,
            counterText: (element.querySelector('.widget-textarea-counter') as HTMLElement).textContent
          });
        });

        const textarea = element.querySelector('.widget-textarea') as HTMLTextAreaElement;
        textarea.value = 'Hello world';
        textarea.dispatchEvent(new Event('input'));
        
        (element.querySelector('.widget-textarea-submit') as HTMLButtonElement).click();
      });
    });

    expect(result.counterText).toBe('11 / 50');
    expect(result.eventDetail.value).toBe('Hello world');
  });
});
