/**
 * Composable Widget Tests
 * Tests for the new widget composition functionality
 */

import { WidgetFactory } from '../src/modules/widgets/widget-factory.js';
import { WIDGET_TYPES } from '../src/modules/widgets/widget-types.js';

/**
 * Test suite for composable widget functionality
 */
export class ComposableWidgetTests {
  constructor() {
    this.testResults = [];
    this.setupTestEnvironment();
  }

  /**
   * Setup test environment
   */
  setupTestEnvironment() {
    // Create a test container
    this.testContainer = document.createElement('div');
    this.testContainer.id = 'test-container';
    this.testContainer.style.display = 'none';
    document.body.appendChild(this.testContainer);
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🧪 Starting Composable Widget Tests...');
    
    try {
      await this.testConfigurableButtonVisibility();
      await this.testFormWidgetCreation();
      await this.testFormValueCollection();
      await this.testWidgetValueInterface();
      await this.testSelectWidgetDisableOnSelect();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  /**
   * Test configurable button visibility
   */
  async testConfigurableButtonVisibility() {
    this.runTest('Input Widget - showSubmitButton: true', () => {
      const widgetConfig = {
        type: 'input',
        props: {
          placeholder: 'Test input',
          showSubmitButton: true
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-input-true');
      this.testContainer.appendChild(widget);

      const submitButton = widget.querySelector('.widget-input-submit');
      return submitButton !== null;
    });

    this.runTest('Input Widget - showSubmitButton: false', () => {
      const widgetConfig = {
        type: 'input',
        props: {
          placeholder: 'Test input',
          showSubmitButton: false
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-input-false');
      this.testContainer.appendChild(widget);

      const submitButton = widget.querySelector('.widget-input-submit');
      return submitButton === null;
    });

    this.runTest('Input Widget - DEFAULT BEHAVIOR (Phase 3 Breaking Change)', () => {
      const widgetConfig = {
        type: 'input',
        props: {
          placeholder: 'Test input'
          // No showSubmitButton specified - should default to false in Phase 3
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-input-default');
      this.testContainer.appendChild(widget);

      const submitButton = widget.querySelector('.widget-input-submit');
      // Should be null because default is now false (breaking change)
      return submitButton === null;
    });

    this.runTest('Checkbox Widget - showSubmitButton: false', () => {
      const widgetConfig = {
        type: 'checkbox',
        props: {
          showSubmitButton: false,
          options: [
            { id: 'cb1', text: 'Option 1', value: 'opt1' }
          ]
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-checkbox-false');
      this.testContainer.appendChild(widget);

      const submitButton = widget.querySelector('.widget-checkbox-submit');
      return submitButton === null;
    });
  }

  /**
   * Test FormWidget creation
   */
  async testFormWidgetCreation() {
    this.runTest('Form Widget Creation', () => {
      const formConfig = {
        type: 'form',
        props: {
          layout: 'vertical',
          gap: 'medium'
        }
      };

      const form = WidgetFactory.createWidget(formConfig, 'test-form');
      this.testContainer.appendChild(form);

      return form.classList.contains('widget-form-container');
    });

    this.runTest('Form Widget with Children', () => {
      const formConfig = {
        type: 'form',
        props: {
          layout: 'vertical'
        },
        children: [
          {
            type: 'input',
            props: {
              placeholder: 'Test input',
              showSubmitButton: false
            }
          },
          {
            type: 'buttons',
            props: {
              options: [
                { id: 'submit', text: 'Submit' }
              ]
            }
          }
        ]
      };

      const form = WidgetFactory.createWidget(formConfig, 'test-form-with-children');
      this.testContainer.appendChild(form);

      const input = form.querySelector('.widget-input-element');
      const button = form.querySelector('.widget-button');
      
      return input !== null && button !== null;
    });
  }

  /**
   * Test form value collection
   */
  async testFormValueCollection() {
    this.runTest('Form Value Collection', async () => {
      const formConfig = {
        type: 'form',
        props: {
          layout: 'vertical'
        },
        children: [
          {
            type: 'input',
            props: {
              placeholder: 'Test input',
              showSubmitButton: false
            }
          },
          {
            type: 'textarea',
            props: {
              placeholder: 'Test textarea',
              showSubmitButton: false
            }
          }
        ]
      };

      const form = WidgetFactory.createWidget(formConfig, 'test-form-values');
      this.testContainer.appendChild(form);

      // Set some values
      const input = form.querySelector('.widget-input-element');
      const textarea = form.querySelector('.widget-textarea');
      
      input.value = 'test input value';
      textarea.value = 'test textarea value';

      // Create a form instance to test value collection
      const { FormWidget } = await import('../src/modules/widgets/form-widget.js');
      const formInstance = new FormWidget(
        { type: 'form' },
        'test-form-values'
      );
      formInstance.element = form;

      const values = formInstance.collectFormValues();
      
      return values[input.getAttribute('data-widget-id')] === 'test input value' &&
             values[textarea.getAttribute('data-widget-id')] === 'test textarea value';
    });
  }

  /**
   * Test widget value interface
   */
  async testWidgetValueInterface() {
    this.runTest('Input Widget getValue()', async () => {
      const widgetConfig = {
        type: 'input',
        props: {
          placeholder: 'Test input',
          showSubmitButton: false
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-input-value');
      this.testContainer.appendChild(widget);

      const input = widget.querySelector('.widget-input-element');
      input.value = 'test value';

      // Create widget instance to test getValue
      const { InputWidget } = await import('../src/modules/widgets/input-widget.js');
      const widgetInstance = new InputWidget(
        widgetConfig,
        'test-input-value'
      );
      widgetInstance.element = widget;

      return widgetInstance.getValue() === 'test value';
    });

    this.runTest('Select Widget getValue()', async () => {
      const widgetConfig = {
        type: 'select',
        props: {
          options: [
            { id: 'opt1', text: 'Option 1', value: 'option1' },
            { id: 'opt2', text: 'Option 2', value: 'option2' }
          ]
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-select-value');
      this.testContainer.appendChild(widget);

      const select = widget.querySelector('.widget-select');
      select.value = 'option1';

      // Create widget instance to test getValue
      const { SelectWidget } = await import('../src/modules/widgets/select-widget.js');
      const widgetInstance = new SelectWidget(
        widgetConfig,
        'test-select-value'
      );
      widgetInstance.element = widget;

      return widgetInstance.getValue() === 'option1';
    });
  }

  /**
   * Test SelectWidget disableOnSelect functionality
   */
  async testSelectWidgetDisableOnSelect() {
    this.runTest('Select Widget - disableOnSelect: true', () => {
      const widgetConfig = {
        type: 'select',
        props: {
          disableOnSelect: true,
          options: [
            { id: 'opt1', text: 'Option 1', value: 'option1' }
          ]
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-select-disable');
      this.testContainer.appendChild(widget);

      const select = widget.querySelector('.widget-select');
      
      // Track if interaction event is fired
      let interactionFired = false;
      const interactionHandler = (event) => {
        if (event.detail.widgetId === 'test-select-disable') {
          interactionFired = true;
        }
      };
      document.addEventListener('widgetInteraction', interactionHandler);

      // Trigger change event
      select.value = 'option1';
      select.dispatchEvent(new Event('change'));

      // Clean up
      document.removeEventListener('widgetInteraction', interactionHandler);

      // Should not fire interaction when disableOnSelect is true
      return !interactionFired;
    });

    this.runTest('Select Widget - disableOnSelect: false', () => {
      const widgetConfig = {
        type: 'select',
        props: {
          disableOnSelect: false,
          options: [
            { id: 'opt1', text: 'Option 1', value: 'option1' }
          ]
        }
      };

      const widget = WidgetFactory.createWidget(widgetConfig, 'test-select-enable');
      this.testContainer.appendChild(widget);

      const select = widget.querySelector('.widget-select');
      
      // Track if interaction event is fired
      let interactionFired = false;
      const interactionHandler = (event) => {
        if (event.detail.widgetId === 'test-select-enable') {
          interactionFired = true;
        }
      };
      document.addEventListener('widgetInteraction', interactionHandler);

      // Trigger change event
      select.value = 'option1';
      select.dispatchEvent(new Event('change'));

      // Clean up
      document.removeEventListener('widgetInteraction', interactionHandler);

      // Should fire interaction when disableOnSelect is false
      return interactionFired;
    });
  }

  /**
   * Run a single test
   */
  async runTest(testName, testFunction) {
    try {
      const result = await testFunction();
      if (result) {
        this.testResults.push({ name: testName, status: 'PASS' });
        console.log(`✅ ${testName}`);
      } else {
        this.testResults.push({ name: testName, status: 'FAIL', message: 'Test returned false' });
        console.log(`❌ ${testName} - Test returned false`);
      }
    } catch (error) {
      this.testResults.push({ name: testName, status: 'ERROR', message: error.message });
      console.log(`❌ ${testName} - ${error.message}`);
    }
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('\n📊 Test Results:');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const errors = this.testResults.filter(r => r.status === 'ERROR').length;
    
    console.log(`Total: ${this.testResults.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Errors: ${errors}`);
    
    if (failed > 0 || errors > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => r.status !== 'PASS')
        .forEach(r => console.log(`  - ${r.name}: ${r.message || r.status}`));
    }
    
    // Clean up
    document.body.removeChild(this.testContainer);
  }
}

// Export for use in browser or Node.js
if (typeof window !== 'undefined') {
  window.ComposableWidgetTests = ComposableWidgetTests;
}
