import { test, expect } from '@playwright/test';

test.describe('Rating Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create rating widget with stars', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { RatingWidget } from '/src/modules/widgets/rating-widget.js';
        window.RatingWidget = RatingWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const RatingWidget = window.RatingWidget;
      const widgetData = {
        type: 'rating',
        props: {
          label: 'Your Rating',
          maxRating: 5,
          defaultValue: 3
        }
      };
      const widget = new RatingWidget(widgetData, 'rt-1');
      document.body.appendChild(widget.createElement());
    });

    const stars = page.locator('.widget-rating-star');
    await expect(stars).toHaveCount(5);
    await expect(stars.nth(0)).toHaveClass(/active/);
    await expect(stars.nth(2)).toHaveClass(/active/);
    await expect(stars.nth(3)).not.toHaveClass(/active/);

    await expect(page.locator('.widget-rating-display')).toHaveText('Rating: 3/5');
  });

  test('should handle star click interaction', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { RatingWidget } from '/src/modules/widgets/rating-widget.js';
        window.RatingWidget = RatingWidget;
      </script>
    `);

    await page.evaluate(() => {
       // @ts-ignore
      const RatingWidget = window.RatingWidget;
      const widget = new RatingWidget({ type: 'rating' }, 'rt-1');
      document.body.appendChild(widget.createElement());
    });

    const fourthStar = page.locator('.widget-rating-star').nth(3);
    await fourthStar.click();

    await expect(page.locator('.widget-rating-star.active')).toHaveCount(4);
    await expect(page.locator('.widget-rating-display')).toHaveText('Rating: 4/5');
  });

  test('should support hearts and emojis', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { RatingWidget } from '/src/modules/widgets/rating-widget.js';
        window.RatingWidget = RatingWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
       // @ts-ignore
      const RatingWidget = window.RatingWidget;
      const heartWidget = new RatingWidget({ type: 'rating', props: { iconType: 'hearts' } }, 'h-1');
      const emojiWidget = new RatingWidget({ type: 'rating', props: { iconType: 'emojis', maxRating: 5 } }, 'e-1');
      
      return {
        heartChar: heartWidget.createElement().querySelector('.widget-rating-star').textContent,
        emojiChar: emojiWidget.createElement().querySelector('.widget-rating-star').textContent
      };
    });

    expect(result.heartChar).toBe('♥');
    expect(['😢', '😕', '😐', '🙂', '😊']).toContain(result.emojiChar);
  });

  test('should handle submission', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { RatingWidget } from '/src/modules/widgets/rating-widget.js';
        window.RatingWidget = RatingWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const RatingWidget = window.RatingWidget;
        const widgetData = {
          type: 'rating',
          props: { defaultValue: 4 }
        };
        const widget = new RatingWidget(widgetData, 'rt-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          resolve((e as CustomEvent).detail);
        });

        (element.querySelector('.widget-rating-submit') as HTMLButtonElement).click();
      });
    });

    expect(result).toEqual({
      rating: 4,
      maxRating: 5,
      iconType: 'stars',
      widgetType: 'rating',
      widgetId: 'rt-1'
    });
  });
});
