import { test, expect } from '@playwright/test';

test.describe('Conditional Widget Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should evaluate simple string conditions', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ConditionalWidget } from '/src/modules/widgets/conditional-widget.js';
        window.ConditionalWidget = ConditionalWidget;
      </script>
    `);

    const results = await page.evaluate(() => {
      // @ts-ignore
      const ConditionalWidget = window.ConditionalWidget;
      const widget = new ConditionalWidget({ type: 'conditional' }, 'cond-1');
      const evaluator = widget.createEvaluator();
      
      const state = new Map();
      state.set('isActive', true);
      state.set('category', 'test');
      
      return {
        showIfActive: evaluator('showIf:isActive', state),
        hideIfActive: evaluator('hideIf:isActive', state),
        showIfInactive: evaluator('showIf:isInactive', state),
        categoryEquals: evaluator('category:test', state),
        categoryNotEquals: evaluator('category:other', state),
        booleanCheck: evaluator('isActive', state)
      };
    });

    expect(results.showIfActive).toBe(true);
    expect(results.hideIfActive).toBe(false);
    expect(results.showIfInactive).toBe(false);
    expect(results.categoryEquals).toBe(true);
    expect(results.categoryNotEquals).toBe(false);
    expect(results.booleanCheck).toBe(true);
  });

  test('should evaluate complex object conditions', async ({ page }) => {
     await page.setContent(`
      <script type="module">
        import { ConditionalWidget } from '/src/modules/widgets/conditional-widget.js';
        window.ConditionalWidget = ConditionalWidget;
      </script>
    `);

    const results = await page.evaluate(() => {
      // @ts-ignore
      const ConditionalWidget = window.ConditionalWidget;
      const widget = new ConditionalWidget({ type: 'conditional' }, 'cond-1');
      const evaluator = widget.createEvaluator();
      
      const state = new Map();
      state.set('count', 10);
      state.set('text', 'hello world');
      
      return {
        greaterThan: evaluator({ operator: 'greaterThan', key: 'count', value: 5 }, state),
        lessThan: evaluator({ operator: 'lessThan', key: 'count', value: 5 }, state),
        equals: evaluator({ operator: 'equals', key: 'count', value: 10 }, state),
        notEquals: evaluator({ operator: 'notEquals', key: 'count', value: 5 }, state),
        contains: evaluator({ operator: 'contains', key: 'text', value: 'hello' }, state),
        andTrue: evaluator({ 
          operator: 'and', 
          conditions: [
            { operator: 'greaterThan', key: 'count', value: 5 },
            { operator: 'contains', key: 'text', value: 'world' }
          ]
        }, state),
        orTrue: evaluator({
          operator: 'or',
          conditions: [
            { operator: 'lessThan', key: 'count', value: 5 },
            { operator: 'equals', key: 'count', value: 10 }
          ]
        }, state)
      };
    });

    expect(results.greaterThan).toBe(true);
    expect(results.lessThan).toBe(false);
    expect(results.equals).toBe(true);
    expect(results.notEquals).toBe(true);
    expect(results.contains).toBe(true);
    expect(results.andTrue).toBe(true);
    expect(results.orTrue).toBe(true);
  });

  test('should update visibility based on state changes', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ConditionalWidget } from '/src/modules/widgets/conditional-widget.js';
        window.ConditionalWidget = ConditionalWidget;
      </script>
    `);

    const result = await page.evaluate(() => {
      // @ts-ignore
      const ConditionalWidget = window.ConditionalWidget;
      const widgetData = {
        type: 'conditional',
        props: {
          condition: 'showIf:isVisible',
          fallback: [{ type: 'text', props: { content: 'Fallback' } }]
        }
      };
      const widget = new ConditionalWidget(widgetData, 'cond-1');
      
      // We need to bypass renderChildren because it uses dynamic import of WidgetFactory
      widget.renderChildren = (container, children) => {
        container.textContent = 'Content';
      };

      const element = widget.createElement();
      document.body.appendChild(element);

      const content = element.querySelector('.widget-conditional-content') as HTMLElement;
      const fallback = element.querySelector('.widget-conditional-fallback') as HTMLElement;

      const initialState = {
        contentDisplay: content.style.display,
        fallbackDisplay: fallback.style.display
      };

      // Update state manually (since setupStateListeners uses widgetInteraction)
      widget.state.set('isVisible', true);
      widget.updateVisibility(element, content, fallback, widgetData.props.condition);

      const updatedState = {
        contentDisplay: content.style.display,
        fallbackDisplay: fallback.style.display
      };

      return { initialState, updatedState };
    });

    expect(result.initialState.contentDisplay).toBe('none');
    expect(result.initialState.fallbackDisplay).toBe('');
    
    expect(result.updatedState.contentDisplay).toBe('');
    expect(result.updatedState.fallbackDisplay).toBe('none');
  });

  test('should respond to widgetInteraction events', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { ConditionalWidget } from '/src/modules/widgets/conditional-widget.js';
        window.ConditionalWidget = ConditionalWidget;
      </script>
    `);

    const isVisible = await page.evaluate(() => {
      // @ts-ignore
      const ConditionalWidget = window.ConditionalWidget;
      const widgetData = {
        type: 'conditional',
        props: { condition: 'showIf:triggered' }
      };
      const widget = new ConditionalWidget(widgetData, 'cond-1');
      widget.renderChildren = () => {};
      
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Dispatch interaction event
      const event = new CustomEvent('widgetInteraction', {
        detail: {
          widgetId: 'cond-1',
          triggered: true
        }
      });
      document.dispatchEvent(event);
      
      const content = element.querySelector('.widget-conditional-content') as HTMLElement;
      return content.style.display === '';
    });

    expect(isVisible).toBe(true);
  });
});
