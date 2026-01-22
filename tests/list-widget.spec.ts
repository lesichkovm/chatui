import { test, expect } from '@playwright/test';

test.describe('List Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create basic list with strings', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ListWidget } from '/src/modules/widgets/list-widget.js';
        window.ListWidget = ListWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const ListWidget = window.ListWidget;
      const widget = new ListWidget({
        type: 'list',
        props: {
          header: 'My List',
          items: ['Item 1', 'Item 2'],
          footer: 'End of list'
        }
      }, 'li-1');
      document.body.appendChild(widget.createElement());
    });

    await expect(page.locator('.widget-list-header')).toHaveText('My List');
    await expect(page.locator('.widget-list-footer')).toHaveText('End of list');
    
    const items = page.locator('.widget-list-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveText('Item 1');
    await expect(items.nth(1)).toHaveText('Item 2');
  });

  test('should use item template with interpolation', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ListWidget } from '/src/modules/widgets/list-widget.js';
        window.ListWidget = ListWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const ListWidget = window.ListWidget;
      const widget = new ListWidget({
        type: 'list',
        props: {
          items: [
            { id: 1, name: 'Alice', role: 'Admin' },
            { id: 2, name: 'Bob', role: 'User' }
          ],
          itemTemplate: {
            type: 'card',
            title: '{{name}}',
            subtitle: 'Role: {{role}}'
          }
        }
      }, 'li-1');
      document.body.appendChild(widget.createElement());
    });

    const firstItem = page.locator('.widget-list-item').nth(0);
    await expect(firstItem.locator('.widget-list-item-title')).toHaveText('Alice');
    await expect(firstItem.locator('.widget-list-item-subtitle')).toHaveText('Role: Admin');
  });

  test('should handle single selection', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ListWidget } from '/src/modules/widgets/list-widget.js';
        window.ListWidget = ListWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ListWidget = window.ListWidget;
        const widget = new ListWidget({
          type: 'list',
          props: {
            items: ['A', 'B'],
            selectable: true
          }
        }, 'li-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        document.addEventListener('widgetInteraction', (e) => {
          if ((e as CustomEvent).detail.action === 'selectionChange') {
            resolve((e as CustomEvent).detail);
          }
        });

        (element.querySelectorAll('.widget-list-item')[1] as HTMLElement).click();
      });
    });

    expect(result.selectedIndices).toEqual([1]);
    expect(result.selectedItems).toEqual(['B']);
    
    const selectedCount = await page.locator('.widget-list-item.selected').count();
    expect(selectedCount).toBe(1);
  });

  test('should handle multi-selection', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ListWidget } from '/src/modules/widgets/list-widget.js';
        window.ListWidget = ListWidget;
      </script>
    `);

    await page.evaluate(() => {
      // @ts-ignore
      const ListWidget = window.ListWidget;
      const widget = new ListWidget({
        type: 'list',
        props: {
          items: ['A', 'B', 'C'],
          selectable: true,
          multiSelect: true
        }
      }, 'li-1');
      document.body.appendChild(widget.createElement());
    });

    const items = page.locator('.widget-list-item');
    await items.nth(0).click();
    await items.nth(2).click();

    await expect(items.nth(0)).toHaveClass(/selected/);
    await expect(items.nth(1)).not.toHaveClass(/selected/);
    await expect(items.nth(2)).toHaveClass(/selected/);

    const checkboxes = page.locator('.widget-list-item-checkbox');
    await expect(checkboxes.nth(0)).toBeChecked();
    await expect(checkboxes.nth(2)).toBeChecked();
  });

  test('should handle action buttons', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ListWidget } from '/src/modules/widgets/list-widget.js';
        window.ListWidget = ListWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        const ListWidget = window.ListWidget;
        const widget = new ListWidget({
          type: 'list',
          props: {
            items: ['Item 1'],
            selectable: true,
            actions: [{ text: 'Submit', action: 'submit_list', data: { foo: 'bar' } }]
          }
        }, 'li-1');
        const element = widget.createElement();
        document.body.appendChild(element);

        // Select first item
        (element.querySelector('.widget-list-item') as HTMLElement).click();

        document.addEventListener('widgetInteraction', (e) => {
          if ((e as CustomEvent).detail.action === 'submit_list') {
            resolve((e as CustomEvent).detail);
          }
        });

        (element.querySelector('.widget-list-action') as HTMLButtonElement).click();
      });
    });

    expect(result.action).toBe('submit_list');
    expect(result.selectedItems).toEqual(['Item 1']);
    expect(result.actionData).toEqual({ foo: 'bar' });
  });
});
