import { test, expect } from '@playwright/test';

test.describe('Input Widget Unit Tests', () => {
  test('should create input widget with correct structure', async ({ page }) => {
    // Create a self-contained test page with inline widget definitions
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-input { display: flex; flex-direction: column; gap: 8px; }
          .widget-input-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
          .widget-input-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-input-disabled { opacity: 0.5; cursor: not-allowed; }
        </style>
      </head>
      <body></body>
      </html>
    `);
    
    // Define widget classes inline and create widget
    await page.evaluate(() => {
      // Base Widget Class
      class BaseWidget {
        constructor(widgetData, widgetId) {
          this.widgetData = widgetData;
          this.widgetId = widgetId;
        }
        
        createElement() {
          throw new Error('createElement() must be implemented by subclass');
        }
        
        handleInteraction(interaction) {
          const event = new CustomEvent("widgetInteraction", {
            detail: {
              widgetId: this.widgetId,
              ...interaction
            }
          });
          document.dispatchEvent(event);
        }
        
        validate() {
          return this.widgetData && this.widgetData.type;
        }
      }
      
      // Input Widget Class
      class InputWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid input widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'input') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-input";
            
            const input = document.createElement("input");
            input.type = this.widgetData.inputType || 'text';
            input.className = "widget-input-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your response...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-input-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-input-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-input-disabled');
                
                this.handleInteraction({
                  optionId: 'input-submit',
                  optionValue: value,
                  optionText: value,
                  widgetType: 'input'
                });
                input.value = '';
              }
            };
            
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            formContainer.appendChild(input);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'input';
        }
      }
      
      // Make classes available globally
      window.BaseWidget = BaseWidget;
      window.InputWidget = InputWidget;
      
      // Create widget
      const widgetData = {
        type: 'input',
        inputType: 'email',
        placeholder: 'Enter your email...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
    });
    
    // Verify widget structure
    const widgetContainer = page.locator('.widget');
    await expect(widgetContainer).toBeVisible();
    
    const inputElement = page.locator('.widget-input-element');
    await expect(inputElement).toBeVisible();
    await expect(inputElement).toHaveAttribute('type', 'email');
    await expect(inputElement).toHaveAttribute('placeholder', 'Enter your email...');
    
    const submitButton = page.locator('.widget-input-submit');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Submit');
  });

  test('should disable widget after submission', async ({ page }) => {
    // Create a self-contained test page with inline widget definitions
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-input { display: flex; flex-direction: column; gap: 8px; }
          .widget-input-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
          .widget-input-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-input-disabled { opacity: 0.5; cursor: not-allowed; }
        </style>
      </head>
      <body></body>
      </html>
    `);
    
    await page.evaluate(() => {
      // Base Widget Class
      class BaseWidget {
        constructor(widgetData, widgetId) {
          this.widgetData = widgetData;
          this.widgetId = widgetId;
        }
        
        createElement() {
          throw new Error('createElement() must be implemented by subclass');
        }
        
        handleInteraction(interaction) {
          const event = new CustomEvent("widgetInteraction", {
            detail: {
              widgetId: this.widgetId,
              ...interaction
            }
          });
          document.dispatchEvent(event);
        }
        
        validate() {
          return this.widgetData && this.widgetData.type;
        }
      }
      
      // Input Widget Class
      class InputWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid input widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'input') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-input";
            
            const input = document.createElement("input");
            input.type = this.widgetData.inputType || 'text';
            input.className = "widget-input-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your response...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-input-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-input-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-input-disabled');
                
                this.handleInteraction({
                  optionId: 'input-submit',
                  optionValue: value,
                  optionText: value,
                  widgetType: 'input'
                });
                input.value = '';
              }
            };
            
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            formContainer.appendChild(input);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'input';
        }
      }
      
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Simulate submission
      const input = element.querySelector('.widget-input-element');
      const button = element.querySelector('.widget-input-submit');
      
      input.value = 'test input';
      button.click();
    });
    
    // Verify disabled state
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
    await expect(inputElement).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    await expect(inputElement).toHaveClass(/widget-input-disabled/);
    await expect(submitButton).toHaveClass(/widget-input-disabled/);
  });

  test('should not submit empty input', async ({ page }) => {
    // Create a self-contained test page with inline widget definitions
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-input { display: flex; flex-direction: column; gap: 8px; }
          .widget-input-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
          .widget-input-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-input-disabled { opacity: 0.5; cursor: not-allowed; }
        </style>
      </head>
      <body></body>
      </html>
    `);
    
    await page.evaluate(() => {
      // Base Widget Class
      class BaseWidget {
        constructor(widgetData, widgetId) {
          this.widgetData = widgetData;
          this.widgetId = widgetId;
        }
        
        createElement() {
          throw new Error('createElement() must be implemented by subclass');
        }
        
        handleInteraction(interaction) {
          const event = new CustomEvent("widgetInteraction", {
            detail: {
              widgetId: this.widgetId,
              ...interaction
            }
          });
          document.dispatchEvent(event);
        }
        
        validate() {
          return this.widgetData && this.widgetData.type;
        }
      }
      
      // Input Widget Class
      class InputWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid input widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'input') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-input";
            
            const input = document.createElement("input");
            input.type = this.widgetData.inputType || 'text';
            input.className = "widget-input-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your response...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-input-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-input-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-input-disabled');
                
                this.handleInteraction({
                  optionId: 'input-submit',
                  optionValue: value,
                  optionText: value,
                  widgetType: 'input'
                });
                input.value = '';
              }
            };
            
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            formContainer.appendChild(input);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'input';
        }
      }
      
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Try to submit empty input
      const button = element.querySelector('.widget-input-submit');
      button.click();
    });
    
    // Verify still enabled (no submission occurred)
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
    await expect(inputElement).toBeEnabled();
    await expect(submitButton).toBeEnabled();
    await expect(inputElement).toHaveValue(''); // Still empty
  });

  test('should handle Enter key submission', async ({ page }) => {
    // Create a self-contained test page with inline widget definitions
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-input { display: flex; flex-direction: column; gap: 8px; }
          .widget-input-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
          .widget-input-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-input-disabled { opacity: 0.5; cursor: not-allowed; }
        </style>
      </head>
      <body></body>
      </html>
    `);
    
    await page.evaluate(() => {
      // Base Widget Class
      class BaseWidget {
        constructor(widgetData, widgetId) {
          this.widgetData = widgetData;
          this.widgetId = widgetId;
        }
        
        createElement() {
          throw new Error('createElement() must be implemented by subclass');
        }
        
        handleInteraction(interaction) {
          const event = new CustomEvent("widgetInteraction", {
            detail: {
              widgetId: this.widgetId,
              ...interaction
            }
          });
          document.dispatchEvent(event);
        }
        
        validate() {
          return this.widgetData && this.widgetData.type;
        }
      }
      
      // Input Widget Class
      class InputWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid input widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'input') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-input";
            
            const input = document.createElement("input");
            input.type = this.widgetData.inputType || 'text';
            input.className = "widget-input-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your response...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-input-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-input-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-input-disabled');
                
                this.handleInteraction({
                  optionId: 'input-submit',
                  optionValue: value,
                  optionText: value,
                  widgetType: 'input'
                });
                input.value = '';
              }
            };
            
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            formContainer.appendChild(input);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'input';
        }
      }
      
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Simulate Enter key submission
      const input = element.querySelector('.widget-input-element');
      input.value = 'test input';
      
      // Create and dispatch Enter key event
      const enterEvent = new KeyboardEvent('keypress', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      input.dispatchEvent(enterEvent);
    });
    
    // Verify disabled state after Enter submission
    const inputElement = page.locator('.widget-input-element');
    const submitButton = page.locator('.widget-input-submit');
    
    await expect(inputElement).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    await expect(inputElement).toHaveClass(/widget-input-disabled/);
  });

  test('should dispatch interaction event correctly', async ({ page }) => {
    // Create a self-contained test page with inline widget definitions
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-input { display: flex; flex-direction: column; gap: 8px; }
          .widget-input-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
          .widget-input-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-input-disabled { opacity: 0.5; cursor: not-allowed; }
        </style>
      </head>
      <body></body>
      </html>
    `);
    
    // Set up event listener
    let interactionData: any = null;
    await page.exposeFunction('captureInteraction', (data: any) => {
      interactionData = data;
    });
    
    await page.evaluate(() => {
      // Base Widget Class
      class BaseWidget {
        constructor(widgetData, widgetId) {
          this.widgetData = widgetData;
          this.widgetId = widgetId;
        }
        
        createElement() {
          throw new Error('createElement() must be implemented by subclass');
        }
        
        handleInteraction(interaction) {
          const event = new CustomEvent("widgetInteraction", {
            detail: {
              widgetId: this.widgetId,
              ...interaction
            }
          });
          document.dispatchEvent(event);
        }
        
        validate() {
          return this.widgetData && this.widgetData.type;
        }
      }
      
      // Input Widget Class
      class InputWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid input widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'input') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-input";
            
            const input = document.createElement("input");
            input.type = this.widgetData.inputType || 'text';
            input.className = "widget-input-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your response...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-input-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-input-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-input-disabled');
                
                this.handleInteraction({
                  optionId: 'input-submit',
                  optionValue: value,
                  optionText: value,
                  widgetType: 'input'
                });
                input.value = '';
              }
            };
            
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            formContainer.appendChild(input);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'input';
        }
      }
      
      const widgetData = {
        type: 'input',
        inputType: 'text',
        placeholder: 'Enter text...',
        buttonText: 'Submit'
      };
      
      const widget = new InputWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Add event listener
      document.addEventListener('widgetInteraction', (event) => {
        window.captureInteraction(event.detail);
      });
      
      // Submit the form
      const input = element.querySelector('.widget-input-element');
      const button = element.querySelector('.widget-input-submit');
      
      input.value = 'test@example.com';
      button.click();
    });
    
    // Verify interaction event was dispatched
    expect(interactionData).not.toBeNull();
    expect(interactionData!.widgetId).toBe('test-widget-id');
    expect(interactionData!.optionId).toBe('input-submit');
    expect(interactionData!.optionValue).toBe('test@example.com');
    expect(interactionData!.optionText).toBe('test@example.com');
    expect(interactionData!.widgetType).toBe('input');
  });
});
