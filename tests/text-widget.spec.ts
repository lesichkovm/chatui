import { test, expect } from '@playwright/test';

test.describe('Text Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render plain text', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TextWidget } from '/src/modules/widgets/text-widget.js';
        window.TextWidget = TextWidget;
      </script>
    `);

    const text = await page.evaluate(() => {
      // @ts-ignore
      const TextWidget = window.TextWidget;
      const widget = new TextWidget({
        type: 'text',
        props: { content: 'Hello World', format: 'plain' }
      }, 'txt-1');
      return widget.createElement().textContent;
    });

    expect(text).toBe('Hello World');
  });

  test('should parse basic markdown', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TextWidget } from '/src/modules/widgets/text-widget.js';
        window.TextWidget = TextWidget;
      </script>
    `);

    const html = await page.evaluate(() => {
      // @ts-ignore
      const TextWidget = window.TextWidget;
      const widget = new TextWidget({
        type: 'text',
        props: { 
          content: '**Bold** *Italic* `Code`\nNew Line', 
          format: 'markdown' 
        }
      }, 'txt-1');
      return widget.createElement().innerHTML;
    });

    expect(html).toContain('<strong>Bold</strong>');
    expect(html).toContain('<em>Italic</em>');
    expect(html).toContain('<code>Code</code>');
    expect(html).toContain('<br>');
  });

  test('should sanitize HTML content', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TextWidget } from '/src/modules/widgets/text-widget.js';
        window.TextWidget = TextWidget;
      </script>
    `);

    const html = await page.evaluate(() => {
       // @ts-ignore
      const TextWidget = window.TextWidget;
      const widget = new TextWidget({
        type: 'text',
        props: { 
          content: '<b>Safe</b><script>alert("xss")</script>', 
          format: 'html' 
        }
      }, 'txt-1');
      return widget.createElement().innerHTML;
    });

    expect(html).toContain('<b>Safe</b>');
    expect(html).not.toContain('<script>');
  });

  test('should apply custom styles', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TextWidget } from '/src/modules/widgets/text-widget.js';
        window.TextWidget = TextWidget;
      </script>
    `);

    const color = await page.evaluate(() => {
       // @ts-ignore
      const TextWidget = window.TextWidget;
      const widget = new TextWidget({
        type: 'text',
        props: { 
          content: 'Styled', 
          style: { color: 'blue' } 
        }
      }, 'txt-1');
      return widget.createElement().style.color;
    });

    expect(color).toBe('blue');
  });
});
