import { test, expect } from '@playwright/test';

test.describe('Tags Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create tags widget with initial tags', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TagsWidget } from '/src/modules/widgets/tags-widget.js';
        window.TagsWidget = TagsWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const TagsWidget = window.TagsWidget;
      const widgetData = {
        type: 'tags',
        props: {
          label: 'Skillset',
          initialTags: ['React', 'TypeScript']
        }
      };
      const widget = new TagsWidget(widgetData, 'tg-1');
      document.body.appendChild(widget.createElement());
    });

    const tags = page.locator('.widget-tag');
    await expect(tags).toHaveCount(2);
    await expect(tags.nth(0)).toContainText('React');
    await expect(tags.nth(1)).toContainText('TypeScript');

    const submitBtn = page.locator('.widget-tags-submit');
    await expect(submitBtn).toBeEnabled();
  });

  test('should add tag on Enter', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TagsWidget } from '/src/modules/widgets/tags-widget.js';
        window.TagsWidget = TagsWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const TagsWidget = window.TagsWidget;
      const widget = new TagsWidget({ type: 'tags' }, 'tg-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-tags-input');
    await input.fill('NewTag');
    await input.press('Enter');

    const tags = page.locator('.widget-tag');
    await expect(tags).toHaveCount(1);
    await expect(tags).toContainText('NewTag');
    await expect(input).toHaveValue('');
  });

  test('should remove tag on click', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TagsWidget } from '/src/modules/widgets/tags-widget.js';
        window.TagsWidget = TagsWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const TagsWidget = window.TagsWidget;
      const widget = new TagsWidget({ type: 'tags', props: { initialTags: ['Tag1'] } }, 'tg-1');
      document.body.appendChild(widget.createElement());
    });

    await page.locator('.widget-tag-remove').click();
    await expect(page.locator('.widget-tag')).toHaveCount(0);
  });

  test('should show suggestions', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TagsWidget } from '/src/modules/widgets/tags-widget.js';
        window.TagsWidget = TagsWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const TagsWidget = window.TagsWidget;
      const widget = new TagsWidget({ 
        type: 'tags', 
        props: { suggestions: ['Java', 'JavaScript', 'Python'] } 
      }, 'tg-1');
      document.body.appendChild(widget.createElement());
    });

    const input = page.locator('.widget-tags-input');
    await input.fill('Java');

    const suggestions = page.locator('.widget-tags-suggestion');
    await expect(suggestions).toHaveCount(2); // Java and JavaScript
    
    await suggestions.nth(1).click(); // Click JavaScript
    await expect(page.locator('.widget-tag')).toContainText('JavaScript');
    await expect(page.locator('.widget-tags-suggestions')).not.toBeVisible();
  });

  test('should handle submission', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { TagsWidget } from '/src/modules/widgets/tags-widget.js';
        window.TagsWidget = TagsWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const TagsWidget = window.TagsWidget;
        const widget = new TagsWidget({ 
          type: 'tags', 
          props: { initialTags: ['T1', 'T2'] } 
        }, 'tg-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve((e as CustomEvent).detail);
        });

        (element.querySelector('.widget-tags-submit') as HTMLButtonElement).click();
      });
    });

    expect(result).toEqual({
      tags: ['T1', 'T2'],
      count: 2,
      joinedTags: 'T1, T2',
      widgetType: 'tags',
      widgetId: 'tg-1'
    });
  });
});
