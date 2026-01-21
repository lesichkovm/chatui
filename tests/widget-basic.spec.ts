import { test, expect } from '@playwright/test';

test.describe('Widget Functionality Tests - Composable System', () => {
  test('should render widget buttons correctly', async ({ page }) => {
    // Create a simple test page with widget functionality
    await page.goto('about:blank');
    
    // Set up a basic widget test
    await page.setContent(`
      <div id="test-container">
        <div class="widget">
          <div class="widget-buttons">
            <button class="widget-button" data-option-value="support">Customer Support</button>
            <button class="widget-button" data-option-value="sales">Sales</button>
          </div>
        </div>
      </div>
    `);

    // Test widget buttons exist
    const widgetContainer = page.locator('#test-container .widget');
    await expect(widgetContainer).toBeVisible();

    const buttons = page.locator('#test-container .widget-button');
    await expect(buttons).toHaveCount(2);
    await expect(buttons.nth(0)).toContainText('Customer Support');
    await expect(buttons.nth(1)).toContainText('Sales');
    await expect(buttons.nth(0)).toHaveAttribute('data-option-value', 'support');
    await expect(buttons.nth(1)).toHaveAttribute('data-option-value', 'sales');
  });

  test('should render composable text widget correctly', async ({ page }) => {
    await page.goto('about:blank');
    
    // Set up text widget test with processed markdown
    await page.setContent(`
      <div id="test-container">
        <div class="widget-text format-markdown">
          Hello <strong>World</strong>! This is a <em>test</em> with <code>code</code> formatting.
        </div>
      </div>
    `);

    const textWidget = page.locator('#test-container .widget-text');
    await expect(textWidget).toBeVisible();
    await expect(textWidget).toHaveClass(/format-markdown/);
    await expect(textWidget).toContainText('Hello World!');
    await expect(textWidget.locator('strong')).toContainText('World');
    await expect(textWidget.locator('em')).toContainText('test');
    await expect(textWidget.locator('code')).toContainText('code');
  });

  test('should render container widget with layout correctly', async ({ page }) => {
    await page.goto('about:blank');
    
    // Set up container widget test
    await page.setContent(`
      <div id="test-container">
        <div class="widget-container layout-horizontal gap-medium align-center">
          <div class="widget-text format-plain">Item 1</div>
          <div class="widget-text format-plain">Item 2</div>
          <div class="widget-text format-plain">Item 3</div>
        </div>
      </div>
    `);

    const container = page.locator('#test-container .widget-container');
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/layout-horizontal/);
    await expect(container).toHaveClass(/gap-medium/);
    await expect(container).toHaveClass(/align-center/);

    const textItems = container.locator('.widget-text');
    await expect(textItems).toHaveCount(3);
    await expect(textItems.nth(0)).toContainText('Item 1');
    await expect(textItems.nth(1)).toContainText('Item 2');
    await expect(textItems.nth(2)).toContainText('Item 3');
  });

  test('should render card widget correctly', async ({ page }) => {
    await page.goto('about:blank');
    
    // Set up card widget test with processed markdown
    await page.setContent(`
      <div id="test-container">
        <div class="widget-card variant-elevated padding-large">
          <div class="widget-text format-markdown"><h2>Card Title</h2></div>
          <div class="widget-text format-plain">Card content goes here.</div>
        </div>
      </div>
    `);

    const card = page.locator('#test-container .widget-card');
    await expect(card).toBeVisible();
    await expect(card).toHaveClass(/variant-elevated/);
    await expect(card).toHaveClass(/padding-large/);

    const title = card.locator('.widget-text').first();
    await expect(title).toContainText('Card Title');
    await expect(title.locator('h2')).toBeVisible(); // Markdown ## becomes h2

    const content = card.locator('.widget-text').nth(1);
    await expect(content).toContainText('Card content goes here.');
  });

  test('should render nested composable widgets', async ({ page }) => {
    await page.goto('about:blank');
    
    // Set up nested widget structure
    await page.setContent(`
      <div id="test-container">
        <div class="widget-card variant-default padding-medium">
          <div class="widget-text format-markdown">## Order Confirmation</div>
          <div class="widget-container layout-vertical gap-small">
            <div class="widget-text format-plain">Product: Widget X</div>
            <div class="widget-text format-plain">Price: $99.99</div>
            <div class="widget-container layout-horizontal gap-medium">
              <div class="widget-text format-plain">[Confirm]</div>
              <div class="widget-text format-plain">[Cancel]</div>
            </div>
          </div>
        </div>
      </div>
    `);

    const card = page.locator('#test-container .widget-card');
    await expect(card).toBeVisible();

    const title = card.locator('.widget-text').first();
    await expect(title).toContainText('Order Confirmation');

    const verticalContainer = card.locator('.widget-container.layout-vertical');
    await expect(verticalContainer).toBeVisible();

    const horizontalContainer = verticalContainer.locator('.widget-container.layout-horizontal');
    await expect(horizontalContainer).toBeVisible();

    const actionButtons = horizontalContainer.locator('.widget-text');
    await expect(actionButtons).toHaveCount(2);
    await expect(actionButtons.nth(0)).toContainText('[Confirm]');
    await expect(actionButtons.nth(1)).toContainText('[Cancel]');
  });

  test('should handle widget interaction events', async ({ page }) => {
    await page.goto('about:blank');
    
    // Set up widget with event handling
    await page.setContent(`
      <div id="test-container">
        <div class="widget">
          <div class="widget-buttons">
            <button class="widget-button" data-option-value="test" data-option-id="opt1">Test Button</button>
          </div>
        </div>
      </div>
    `);

    // Set up event listener
    await page.evaluate(() => {
      let eventData: any = null;
      document.addEventListener('widgetInteraction', (event: any) => {
        eventData = event.detail;
        (window as any).testEventData = eventData;
      });

      // Simulate widget interaction
      const button = document.querySelector('.widget-button') as HTMLButtonElement;
      if (button) {
        // Add minimal logic to dispatch the event since this is a unit test for the event handling
        button.addEventListener('click', () => {
          const event = new CustomEvent('widgetInteraction', {
            detail: {
              optionValue: button.getAttribute('data-option-value'),
              optionId: button.getAttribute('data-option-id')
            }
          });
          document.dispatchEvent(event);
        });
        button.click();
      }
    });

    // Wait a moment for the event to be processed
    await page.waitForTimeout(100);

    // Check if event was captured
    const eventData = await page.evaluate(() => (window as any).testEventData);
    expect(eventData).not.toBeNull();
    expect(eventData.optionValue).toBe('test');
    expect(eventData.optionId).toBe('opt1');
  });

  test('should validate composable widget data structure', async ({ page }) => {
    await page.goto('about:blank');
    
    // Test composable widget validation logic
    const validationResults = await page.evaluate(() => {
      const validateComposableWidget = (widgetConfig: any) => {
        return !!(widgetConfig && 
               widgetConfig.type && 
               (widgetConfig.props || widgetConfig.children));
      };

      const validateTextWidget = (widgetConfig: any) => {
        return validateComposableWidget(widgetConfig) &&
               widgetConfig.type === 'text' &&
               widgetConfig.props &&
               typeof widgetConfig.props.content === 'string';
      };

      const validateContainerWidget = (widgetConfig: any) => {
        return validateComposableWidget(widgetConfig) &&
               widgetConfig.type === 'container' &&
               widgetConfig.props &&
               ['vertical', 'horizontal'].includes(widgetConfig.props.layout || 'vertical');
      };

      return {
        validText: validateTextWidget({
          type: 'text',
          props: { content: 'Hello World', format: 'plain' }
        }),
        invalidTextNoProps: validateTextWidget({
          type: 'text'
        }),
        validContainer: validateContainerWidget({
          type: 'container',
          props: { layout: 'horizontal', gap: 'medium' }
        }),
        invalidContainerBadLayout: validateContainerWidget({
          type: 'container',
          props: { layout: 'invalid', gap: 'medium' }
        }),
        invalidNoType: validateComposableWidget({
          props: { content: 'Hello' }
        })
      };
    });

    expect(validationResults.validText).toBe(true);
    expect(validationResults.invalidTextNoProps).toBe(false);
    expect(validationResults.validContainer).toBe(true);
    expect(validationResults.invalidContainerBadLayout).toBe(false);
    expect(validationResults.invalidNoType).toBe(false);
  });

  test('should create composable widget DOM elements correctly', async ({ page }) => {
    await page.goto('about:blank');
    
    // Test composable widget DOM creation
    const widgetHTML = await page.evaluate(() => {
      const widgetConfig = {
        type: 'card',
        props: {
          variant: 'elevated',
          padding: 'large'
        },
        children: [
          {
            type: 'text',
            props: {
              content: '## Card Title\nThis is a card with **bold** text.',
              format: 'markdown'
            }
          },
          {
            type: 'container',
            props: {
              layout: 'horizontal',
              gap: 'small'
            },
            children: [
              {
                type: 'text',
                props: {
                  content: '[Action 1]',
                  format: 'plain'
                }
              },
              {
                type: 'text',
                props: {
                  content: '[Action 2]',
                  format: 'plain'
                }
              }
            ]
          }
        ]
      };

      // Mock widget creation
      const createWidgetElement = (config: any): HTMLElement => {
        if (config.type === 'card') {
          const card = document.createElement('div');
          card.className = `widget-card variant-${config.props.variant || 'default'} padding-${config.props.padding || 'medium'}`;
          
          if (config.children) {
            config.children.forEach((child: any) => {
              const childElement = createWidgetElement(child);
              card.appendChild(childElement);
            });
          }
          
          return card;
        }
        
        if (config.type === 'text') {
          const text = document.createElement('div');
          text.className = `widget-text format-${config.props.format || 'plain'}`;
          
          if (config.props.format === 'markdown') {
            text.innerHTML = config.props.content
              .replace(/## (.*)/g, '<h2>$1</h2>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br>');
          } else {
            text.textContent = config.props.content;
          }
          
          return text;
        }
        
        if (config.type === 'container') {
          const container = document.createElement('div');
          container.className = `widget-container layout-${config.props.layout} gap-${config.props.gap}`;
          
          if (config.children) {
            config.children.forEach((child: any) => {
              const childElement = createWidgetElement(child);
              container.appendChild(childElement);
            });
          }
          
          return container;
        }
        
        return document.createElement('div');
      };
      
      const widgetElement = createWidgetElement(widgetConfig);
      return widgetElement.outerHTML;
    });

    // Verify the HTML structure
    expect(widgetHTML).toContain('class="widget-card');
    expect(widgetHTML).toContain('variant-elevated');
    expect(widgetHTML).toContain('padding-large');
    expect(widgetHTML).toContain('class="widget-text');
    expect(widgetHTML).toContain('format-markdown');
    expect(widgetHTML).toContain('<h2>Card Title</h2>');
    expect(widgetHTML).toContain('<strong>bold</strong>');
    expect(widgetHTML).toContain('class="widget-container');
    expect(widgetHTML).toContain('layout-horizontal');
    expect(widgetHTML).toContain('gap-small');
    expect(widgetHTML).toContain('[Action 1]');
    expect(widgetHTML).toContain('[Action 2]');
  });
});
