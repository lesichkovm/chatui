import { test, expect } from '@playwright/test';

// Extend Window interface for test environment
declare global {
  interface Window {
    testWidgetFactory: {
      createWidget: (widgetConfig: any, widgetId: string) => HTMLElement | null;
    };
  }
}

test.describe('Widget Factory Tests - Composable System', () => {
  test.beforeEach(async ({ page }) => {
    // Load the widget system in a test environment
    await page.goto('about:blank');
    await page.evaluate(() => {
      // Base widget class mock
      class BaseWidget {
        widgetData: any;
        widgetId: string;
        
        constructor(widgetData: any, widgetId: string) {
          this.widgetData = widgetData;
          this.widgetId = widgetId;
        }
        
        createElement() {
          throw new Error('createElement() must be implemented by subclass');
        }
        
        getChildrenContainer(element: HTMLElement) {
          return element;
        }
      }
      
      // Mock widget classes
      class ButtonsWidget extends BaseWidget {
        createElement() {
          const div = document.createElement('div');
          div.className = 'widget';
          const container = document.createElement('div');
          container.className = 'widget-buttons';
          
          // Handle legacy format with options array
          if (this.widgetData.options) {
            this.widgetData.options.forEach((option: any) => {
              const button = document.createElement('button');
              button.className = 'widget-button';
              button.textContent = option.text;
              button.setAttribute('data-option-value', option.value);
              container.appendChild(button);
            });
          }
          
          div.appendChild(container);
          return div;
        }
        
        validate() {
          return this.widgetData.type === 'buttons' && 
                 Array.isArray(this.widgetData.options) && 
                 this.widgetData.options.length > 0;
        }
      }
      
      class SelectWidget extends BaseWidget {
        createElement() {
          const div = document.createElement('div');
          div.className = 'widget';
          const select = document.createElement('select');
          select.className = 'widget-select-element';
          
          if (this.widgetData.options) {
            this.widgetData.options.forEach((option: any) => {
              const optionEl = document.createElement('option');
              optionEl.value = option.value;
              optionEl.textContent = option.text;
              select.appendChild(optionEl);
            });
          }
          
          div.appendChild(select);
          return div;
        }
        
        validate() {
          return this.widgetData.type === 'select' && 
                 Array.isArray(this.widgetData.options) && 
                 this.widgetData.options.length > 0;
        }
      }
      
      class ContainerWidget extends BaseWidget {
        createElement() {
          const element = document.createElement('div');
          element.className = 'widget-container';
          
          const layout = this.widgetData.props?.layout || 'vertical';
          const gap = this.widgetData.props?.gap || 'medium';
          const alignment = this.widgetData.props?.alignment || 'start';
          
          element.classList.add(`layout-${layout}`);
          element.classList.add(`gap-${gap}`);
          element.classList.add(`align-${alignment}`);
          
          return element;
        }
      }
      
      class TextWidget extends BaseWidget {
        createElement() {
          const element = document.createElement('div');
          element.className = 'widget-text';
          
          const content = this.widgetData.props?.content || '';
          const format = this.widgetData.props?.format || 'plain';
          
          element.classList.add(`format-${format}`);
          
          if (format === 'markdown') {
            element.innerHTML = content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code>$1</code>')
              .replace(/\n/g, '<br>');
          } else {
            element.textContent = content;
          }
          
          return element;
        }
      }
      
      class CardWidget extends BaseWidget {
        createElement() {
          const element = document.createElement('div');
          element.className = 'widget-card';
          
          const variant = this.widgetData.props?.variant || 'default';
          const padding = this.widgetData.props?.padding || 'medium';
          
          element.classList.add(`variant-${variant}`);
          element.classList.add(`padding-${padding}`);
          
          return element;
        }
      }
      
      // Mock the widget system for testing with new composable architecture
      (window as any).testWidgetFactory = {
        createWidget: function(widgetConfig: any, widgetId: string) {
          console.log('Creating widget with config:', widgetConfig);
          if (!widgetConfig || !widgetConfig.type) {
            console.log('Invalid widget config:', widgetConfig);
            return null;
          }
          
          // Widget type registry
          const widgetTypes = new Map([
            ['buttons', ButtonsWidget],
            ['select', SelectWidget],
            ['container', ContainerWidget],
            ['text', TextWidget],
            ['card', CardWidget]
          ]);
          
          const WidgetClass = widgetTypes.get(widgetConfig.type);
          if (!WidgetClass) {
            console.log('No widget class found for type:', widgetConfig.type);
            return null;
          }
          
          try {
            const widgetInstance = new WidgetClass(widgetConfig, widgetId);
            const element = widgetInstance.createElement();
            
            // Recursively process children if present
            if (widgetConfig.children && Array.isArray(widgetConfig.children)) {
              const childrenContainer = widgetInstance.getChildrenContainer ? 
                                    widgetInstance.getChildrenContainer(element) : 
                                    element;
              
              widgetConfig.children.forEach((childConfig: any) => {
                const childElement = this.createWidget(childConfig, widgetId);
                if (childElement) {
                  childrenContainer.appendChild(childElement);
                }
              });
            }
            
            console.log('Widget created successfully:', element);
            return element;
          } catch (error) {
            console.error(`Error creating widget of type ${widgetConfig.type}:`, error);
            return null;
          }
        }
      };
    });
  });

  test('should create buttons widget successfully', async ({ page }) => {
    const widgetConfig = {
      type: 'buttons',
      options: [
        { id: 'opt1', text: 'Option 1', value: 'value1' },
        { id: 'opt2', text: 'Option 2', value: 'value2' }
      ]
    };

    const element = await page.evaluate((config) => {
      console.log('Creating widget with config:', config);
      const result = window.testWidgetFactory.createWidget(config, 'test-widget');
      console.log('Widget creation result:', result);
      return result ? result.outerHTML : null;
    }, widgetConfig);

    expect(element).not.toBeNull();
    expect(element!).toContain('widget-buttons');
    expect(element!).toContain('Option 1');
    expect(element!).toContain('Option 2');
  });

  test('should create select widget successfully', async ({ page }) => {
    const widgetConfig = {
      type: 'select',
      options: [
        { id: 'opt1', text: 'Option 1', value: 'value1' },
        { id: 'opt2', text: 'Option 2', value: 'value2' }
      ]
    };

    const element = await page.evaluate((config) => {
      return window.testWidgetFactory.createWidget(config, 'test-widget')?.outerHTML || null;
    }, widgetConfig);

    expect(element).not.toBeNull();
    expect(element!).toContain('widget-select-element');
    expect(element!).toContain('Option 1');
    expect(element!).toContain('Option 2');
  });

  test('should create text widget successfully', async ({ page }) => {
    const widgetConfig = {
      type: 'text',
      props: {
        content: 'Hello **World**!',
        format: 'markdown'
      }
    };

    const element = await page.evaluate((config) => {
      return window.testWidgetFactory.createWidget(config, 'test-widget')?.outerHTML || null;
    }, widgetConfig);

    expect(element).not.toBeNull();
    expect(element!).toContain('widget-text');
    expect(element!).toContain('<strong>World</strong>');
  });

  test('should create container widget successfully', async ({ page }) => {
    const widgetConfig = {
      type: 'container',
      props: {
        layout: 'horizontal',
        gap: 'small',
        alignment: 'center'
      }
    };

    const element = await page.evaluate((config) => {
      return window.testWidgetFactory.createWidget(config, 'test-widget')?.outerHTML || null;
    }, widgetConfig);

    expect(element).not.toBeNull();
    expect(element!).toContain('widget-container');
    expect(element!).toContain('layout-horizontal');
    expect(element!).toContain('gap-small');
    expect(element!).toContain('align-center');
  });

  test('should create card widget successfully', async ({ page }) => {
    const widgetConfig = {
      type: 'card',
      props: {
        variant: 'elevated',
        padding: 'large'
      }
    };

    const element = await page.evaluate((config) => {
      return window.testWidgetFactory.createWidget(config, 'test-widget')?.outerHTML || null;
    }, widgetConfig);

    expect(element).not.toBeNull();
    expect(element!).toContain('widget-card');
    expect(element!).toContain('variant-elevated');
    expect(element!).toContain('padding-large');
  });

  test('should create nested widgets recursively', async ({ page }) => {
    const widgetConfig = {
      type: 'card',
      props: {
        variant: 'default',
        padding: 'medium'
      },
      children: [
        {
          type: 'text',
          props: {
            content: 'Card Title',
            format: 'plain'
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
            }
          ]
        }
      ]
    };

    const element = await page.evaluate((config) => {
      return window.testWidgetFactory.createWidget(config, 'test-widget')?.outerHTML || null;
    }, widgetConfig);

    expect(element).not.toBeNull();
    expect(element!).toContain('widget-card');
    expect(element!).toContain('Card Title');
    expect(element!).toContain('widget-container');
    expect(element!).toContain('layout-horizontal');
    expect(element!).toContain('Item 1');
    expect(element!).toContain('Item 2');
  });

  test('should return null for unsupported widget type', async ({ page }) => {
    const widgetConfig = {
      type: 'unsupported',
      options: []
    };

    const element = await page.evaluate((config) => {
      return window.testWidgetFactory.createWidget(config, 'test-widget');
    }, widgetConfig);

    expect(element).toBeNull();
  });

  test('should return null for invalid widget data', async ({ page }) => {
    const element = await page.evaluate(() => {
      return window.testWidgetFactory.createWidget(null, 'test-widget');
    });

    expect(element).toBeNull();
  });

  test('should handle complex nested structure from proposal', async ({ page }) => {
    const widgetConfig = {
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

    const element = await page.evaluate((config) => {
      return window.testWidgetFactory.createWidget(config, 'test-widget')?.outerHTML || null;
    }, widgetConfig);

    expect(element).not.toBeNull();
    expect(element!).toContain('widget-card');
    expect(element!).toContain('<strong>Widget X</strong>');
    expect(element!).toContain('layout-horizontal');
    expect(element!).toContain('[Confirm]');
    expect(element!).toContain('[Cancel]');
  });
});
