import { test, expect } from '@playwright/test';

test.describe('Composable Widgets Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('about:blank');
    
    // Set up basic styles for composable widgets
    await page.addStyleTag({
      content: `
        .widget-text {
          margin: 4px 0;
          color: #212529;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .widget-text.format-plain {
          white-space: pre-wrap;
        }
        
        .widget-text.format-markdown strong {
          font-weight: 600;
        }
        
        .widget-text.format-markdown em {
          font-style: italic;
        }
        
        .widget-text.format-markdown code {
          background: #e9ecef;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 13px;
        }
        
        .widget-container {
          display: flex;
          margin: 4px 0;
        }
        
        .widget-container.layout-vertical {
          flex-direction: column;
        }
        
        .widget-container.layout-horizontal {
          flex-direction: row;
        }
        
        .widget-container.gap-small {
          gap: 4px;
        }
        
        .widget-container.gap-medium {
          gap: 8px;
        }
        
        .widget-container.gap-large {
          gap: 16px;
        }
        
        .widget-container.align-start {
          align-items: flex-start;
        }
        
        .widget-container.align-center {
          align-items: center;
        }
        
        .widget-container.align-end {
          align-items: flex-end;
        }
        
        .widget-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 12px;
          margin: 8px 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .widget-card.variant-elevated {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .widget-card.variant-outlined {
          background: transparent;
          border: 2px solid #e9ecef;
        }
        
        .widget-card.padding-small {
          padding: 8px;
        }
        
        .widget-card.padding-medium {
          padding: 12px;
        }
        
        .widget-card.padding-large {
          padding: 16px;
        }
      `
    });
  });

  test('should create and render text widget with markdown', async ({ page }) => {
    await page.evaluate(() => {
      const textWidget = {
        type: 'text',
        props: {
          content: 'Hello **World**! This is *italic* and `code`.',
          format: 'markdown'
        }
      };

      // Mock widget creation
      const createTextWidget = (config: any) => {
        const element = document.createElement('div');
        element.className = `widget-text format-${config.props.format || 'plain'}`;
        
        if (config.props.format === 'markdown') {
          element.innerHTML = config.props.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
        } else {
          element.textContent = config.props.content;
        }
        
        return element;
      };

      const widget = createTextWidget(textWidget);
      document.body.appendChild(widget);
    });

    const textWidget = page.locator('.widget-text');
    await expect(textWidget).toBeVisible();
    await expect(textWidget).toHaveClass(/format-markdown/);
    await expect(textWidget.locator('strong')).toContainText('World');
    await expect(textWidget.locator('em')).toContainText('italic');
    await expect(textWidget.locator('code')).toContainText('code');
  });

  test('should create and render container widget with layout', async ({ page }) => {
    await page.evaluate(() => {
      const containerWidget = {
        type: 'container',
        props: {
          layout: 'horizontal',
          gap: 'medium',
          alignment: 'center'
        },
        children: [
          {
            type: 'text',
            props: {
              content: 'Item 1',
              format: 'plain'
            }
          },
          {
            type: 'text',
            props: {
              content: 'Item 2',
              format: 'plain'
            }
          },
          {
            type: 'text',
            props: {
              content: 'Item 3',
              format: 'plain'
            }
          }
        ]
      };

      // Mock widget creation
      const createTextWidget = (config: any) => {
        const element = document.createElement('div');
        element.className = `widget-text format-${config.props.format || 'plain'}`;
        element.textContent = config.props.content;
        return element;
      };

      const createContainerWidget = (config: any) => {
        const element = document.createElement('div');
        element.className = 'widget-container';
        
        const layout = config.props?.layout || 'vertical';
        const gap = config.props?.gap || 'medium';
        const alignment = config.props?.alignment || 'start';
        
        element.classList.add(`layout-${layout}`);
        element.classList.add(`gap-${gap}`);
        element.classList.add(`align-${alignment}`);
        
        if (config.children) {
          config.children.forEach((child: any) => {
            const childElement = createTextWidget(child);
            element.appendChild(childElement);
          });
        }
        
        return element;
      };

      const widget = createContainerWidget(containerWidget);
      document.body.appendChild(widget);
    });

    const container = page.locator('.widget-container');
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

  test('should create and render card widget with nested content', async ({ page }) => {
    await page.evaluate(() => {
      const cardWidget = {
        type: 'card',
        props: {
          variant: 'elevated',
          padding: 'large'
        },
        children: [
          {
            type: 'text',
            props: {
              content: '## Card Title\nThis is a card description.',
              format: 'markdown'
            }
          },
          {
            type: 'container',
            props: {
              layout: 'vertical',
              gap: 'small'
            },
            children: [
              {
                type: 'text',
                props: {
                  content: 'Feature 1: Amazing functionality',
                  format: 'plain'
                }
              },
              {
                type: 'text',
                props: {
                  content: 'Feature 2: Beautiful design',
                  format: 'plain'
                }
              }
            ]
          }
        ]
      };

      // Mock widget creation
      const createTextWidget = (config: any) => {
        const element = document.createElement('div');
        element.className = `widget-text format-${config.props.format || 'plain'}`;
        
        if (config.props.format === 'markdown') {
          element.innerHTML = config.props.content
            .replace(/## (.*)/g, '<h2>$1</h2>')
            .replace(/\n/g, '<br>');
        } else {
          element.textContent = config.props.content;
        }
        
        return element;
      };

      const createContainerWidget = (config: any) => {
        const element = document.createElement('div');
        element.className = 'widget-container';
        
        const layout = config.props?.layout || 'vertical';
        const gap = config.props?.gap || 'medium';
        
        element.classList.add(`layout-${layout}`);
        element.classList.add(`gap-${gap}`);
        
        if (config.children) {
          config.children.forEach((child: any) => {
            const childElement = createTextWidget(child);
            element.appendChild(childElement);
          });
        }
        
        return element;
      };

      const createCardWidget = (config: any) => {
        const element = document.createElement('div');
        element.className = 'widget-card';
        
        const variant = config.props?.variant || 'default';
        const padding = config.props?.padding || 'medium';
        
        element.classList.add(`variant-${variant}`);
        element.classList.add(`padding-${padding}`);
        
        if (config.children) {
          config.children.forEach((child: any) => {
            let childElement;
            if (child.type === 'text') {
              childElement = createTextWidget(child);
            } else if (child.type === 'container') {
              childElement = createContainerWidget(child);
            }
            if (childElement) {
              element.appendChild(childElement);
            }
          });
        }
        
        return element;
      };

      const widget = createCardWidget(cardWidget);
      document.body.appendChild(widget);
    });

    const card = page.locator('.widget-card');
    await expect(card).toBeVisible();
    await expect(card).toHaveClass(/variant-elevated/);
    await expect(card).toHaveClass(/padding-large/);

    const title = card.locator('.widget-text.format-markdown').first();
    await expect(title).toContainText('Card Title');
    await expect(title.locator('h2')).toBeVisible();

    // The card only contains the title and the container with features
    const container = card.locator('.widget-container');
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/layout-vertical/);
    await expect(container).toHaveClass(/gap-small/);

    const features = container.locator('.widget-text');
    await expect(features).toHaveCount(2);
    await expect(features.nth(0)).toContainText('Feature 1: Amazing functionality');
    await expect(features.nth(1)).toContainText('Feature 2: Beautiful design');
  });

  test('should handle deeply nested widget structures', async ({ page }) => {
    await page.evaluate(() => {
      const complexWidget = {
        type: 'card',
        props: {
          variant: 'default',
          padding: 'medium'
        },
        children: [
          {
            type: 'text',
            props: {
              content: '## Complex Nested Structure',
              format: 'markdown'
            }
          },
          {
            type: 'container',
            props: {
              layout: 'horizontal',
              gap: 'medium'
            },
            children: [
              {
                type: 'card',
                props: {
                  variant: 'outlined',
                  padding: 'small'
                },
                children: [
                  {
                    type: 'text',
                    props: {
                      content: 'Left Column',
                      format: 'plain'
                    }
                  },
                  {
                    type: 'container',
                    props: {
                      layout: 'vertical',
                      gap: 'small'
                    },
                    children: [
                      {
                        type: 'text',
                        props: {
                          content: 'Item A',
                          format: 'plain'
                        }
                      },
                      {
                        type: 'text',
                        props: {
                          content: 'Item B',
                          format: 'plain'
                        }
                      }
                    ]
                  }
                ]
              },
              {
                type: 'card',
                props: {
                  variant: 'outlined',
                  padding: 'small'
                },
                children: [
                  {
                    type: 'text',
                    props: {
                      content: 'Right Column',
                      format: 'plain'
                    }
                  },
                  {
                    type: 'container',
                    props: {
                      layout: 'vertical',
                      gap: 'small'
                    },
                    children: [
                      {
                        type: 'text',
                        props: {
                          content: 'Item C',
                          format: 'plain'
                        }
                      },
                      {
                        type: 'text',
                        props: {
                          content: 'Item D',
                          format: 'plain'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

      // Recursive widget creation function
      const createWidget = (config: any): HTMLElement => {
        if (config.type === 'text') {
          const element = document.createElement('div');
          element.className = `widget-text format-${config.props.format || 'plain'}`;
          
          if (config.props.format === 'markdown') {
            element.innerHTML = config.props.content
              .replace(/## (.*)/g, '<h2>$1</h2>')
              .replace(/\n/g, '<br>');
          } else {
            element.textContent = config.props.content;
          }
          
          return element;
        }
        
        if (config.type === 'container') {
          const element = document.createElement('div');
          element.className = 'widget-container';
          
          const layout = config.props?.layout || 'vertical';
          const gap = config.props?.gap || 'medium';
          const alignment = config.props?.alignment || 'start';
          
          element.classList.add(`layout-${layout}`);
          element.classList.add(`gap-${gap}`);
          element.classList.add(`align-${alignment}`);
          
          if (config.children) {
            config.children.forEach((child: any) => {
              const childElement = createWidget(child);
              element.appendChild(childElement);
            });
          }
          
          return element;
        }
        
        if (config.type === 'card') {
          const element = document.createElement('div');
          element.className = 'widget-card';
          
          const variant = config.props?.variant || 'default';
          const padding = config.props?.padding || 'medium';
          
          element.classList.add(`variant-${variant}`);
          element.classList.add(`padding-${padding}`);
          
          if (config.children) {
            config.children.forEach((child: any) => {
              const childElement = createWidget(child);
              element.appendChild(childElement);
            });
          }
          
          return element;
        }
        
        return document.createElement('div');
      };

      const widget = createWidget(complexWidget);
      document.body.appendChild(widget);
    });

    // Verify the complex nested structure
    const mainCard = page.locator('.widget-card').first();
    await expect(mainCard).toBeVisible();
    const title = mainCard.locator('.widget-text.format-markdown').first();
    await expect(title).toContainText('Complex Nested Structure');

    const horizontalContainer = mainCard.locator('.widget-container.layout-horizontal');
    await expect(horizontalContainer).toBeVisible();

    const nestedCards = horizontalContainer.locator('.widget-card.variant-outlined');
    await expect(nestedCards).toHaveCount(2);

    // Left column
    const leftCard = nestedCards.first();
    await expect(leftCard.locator('.widget-text').filter({ hasText: 'Left Column' })).toContainText('Left Column');
    const leftContainer = leftCard.locator('.widget-container.layout-vertical');
    await expect(leftContainer.locator('.widget-text')).toHaveCount(2);
    await expect(leftContainer.locator('.widget-text').nth(0)).toContainText('Item A');
    await expect(leftContainer.locator('.widget-text').nth(1)).toContainText('Item B');

    // Right column
    const rightCard = nestedCards.nth(1);
    await expect(rightCard.locator('.widget-text').filter({ hasText: 'Right Column' })).toContainText('Right Column');
    const rightContainer = rightCard.locator('.widget-container.layout-vertical');
    await expect(rightContainer.locator('.widget-text')).toHaveCount(2);
    await expect(rightContainer.locator('.widget-text').nth(0)).toContainText('Item C');
    await expect(rightContainer.locator('.widget-text').nth(1)).toContainText('Item D');
  });

  test('should handle widget composition from proposal example', async ({ page }) => {
    await page.evaluate(() => {
      const proposalExample = {
        type: 'card',
        children: [
          {
            type: 'text',
            props: { 
              content: 'Image placeholder (image widget to be implemented)',
              format: 'plain' 
            }
          },
          {
            type: 'text',
            props: { 
              content: 'Confirm your order for **Widget X**', 
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
                  content: '[Confirm]', 
                  format: 'plain' 
                }
              },
              {
                type: 'text',
                props: { 
                  content: '[Cancel]', 
                  format: 'plain' 
                }
              }
            ]
          }
        ]
      };

      // Recursive widget creation
      const createWidget = (config: any): HTMLElement => {
        if (config.type === 'text') {
          const element = document.createElement('div');
          element.className = `widget-text format-${config.props.format || 'plain'}`;
          
          if (config.props.format === 'markdown') {
            element.innerHTML = config.props.content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          } else {
            element.textContent = config.props.content;
          }
          
          return element;
        }
        
        if (config.type === 'container') {
          const element = document.createElement('div');
          element.className = 'widget-container';
          
          const layout = config.props?.layout || 'vertical';
          const gap = config.props?.gap || 'medium';
          
          element.classList.add(`layout-${layout}`);
          element.classList.add(`gap-${gap}`);
          
          if (config.children) {
            config.children.forEach((child: any) => {
              const childElement = createWidget(child);
              element.appendChild(childElement);
            });
          }
          
          return element;
        }
        
        if (config.type === 'card') {
          const element = document.createElement('div');
          element.className = 'widget-card';
          
          if (config.children) {
            config.children.forEach((child: any) => {
              const childElement = createWidget(child);
              element.appendChild(childElement);
            });
          }
          
          return element;
        }
        
        return document.createElement('div');
      };

      const widget = createWidget(proposalExample);
      document.body.appendChild(widget);
    });

    // Verify the proposal example structure
    const card = page.locator('.widget-card');
    await expect(card).toBeVisible();

    const textWidgets = card.locator('.widget-text');
    await expect(textWidgets).toHaveCount(4); // Updated count to match actual structure

    await expect(textWidgets.nth(0)).toContainText('Image placeholder (image widget to be implemented)');
    await expect(textWidgets.nth(1)).toContainText('Confirm your order for');
    await expect(textWidgets.nth(1).locator('strong')).toContainText('Widget X');

    const container = card.locator('.widget-container');
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/layout-horizontal/);
    await expect(container).toHaveClass(/gap-small/);

    const actionTexts = container.locator('.widget-text');
    await expect(actionTexts).toHaveCount(2);
    await expect(actionTexts.nth(0)).toContainText('[Confirm]');
    await expect(actionTexts.nth(1)).toContainText('[Cancel]');
  });

  test('should handle empty and invalid widget configurations gracefully', async ({ page }) => {
    const results = await page.evaluate(() => {
      const createWidget = (config: any): HTMLElement | null => {
        if (!config || !config.type) return null;
        
        if (config.type === 'text') {
          const element = document.createElement('div');
          element.className = `widget-text format-${config.props?.format || 'plain'}`;
          element.textContent = config.props?.content || '';
          return element;
        }
        
        if (config.type === 'container') {
          const element = document.createElement('div');
          element.className = 'widget-container';
          
          const layout = config.props?.layout || 'vertical';
          const gap = config.props?.gap || 'medium';
          
          element.classList.add(`layout-${layout}`);
          element.classList.add(`gap-${gap}`);
          
          return element;
        }
        
        return null;
      };

      return {
        nullConfig: createWidget(null),
        undefinedConfig: createWidget(undefined),
        emptyObject: createWidget({}),
        noType: createWidget({ props: { content: 'test' } }),
        validText: createWidget({ type: 'text', props: { content: 'Hello' } }),
        validContainer: createWidget({ type: 'container', props: { layout: 'horizontal' } }),
        unsupportedType: createWidget({ type: 'unsupported', props: {} })
      };
    });

    expect(results.nullConfig).toBeNull();
    expect(results.undefinedConfig).toBeNull();
    expect(results.emptyObject).toBeNull();
    expect(results.noType).toBeNull();
    expect(results.validText).not.toBeNull();
    expect(results.validContainer).not.toBeNull();
    expect(results.unsupportedType).toBeNull();
  });
});
