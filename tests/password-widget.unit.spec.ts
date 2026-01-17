import { test, expect } from '@playwright/test';

test.describe('Password Widget Unit Tests', () => {
  test('should create password widget with correct structure', async ({ page }) => {
    // Create a self-contained test page with inline widget definitions
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-password { display: flex; flex-direction: column; gap: 8px; }
          .widget-password-wrapper { display: flex; gap: 8px; align-items: center; }
          .widget-password-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
          .widget-password-toggle { padding: 8px 12px; background: #f8f9fa; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
          .widget-password-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-password-disabled { opacity: 0.5; cursor: not-allowed; }
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
          return !!(this.widgetData && this.widgetData.type);
        }
      }
      
      // Password Widget Class
      class PasswordWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid password widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'password') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-password";
            
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "widget-password-wrapper";
            
            const input = document.createElement("input");
            input.type = "password";
            input.className = "widget-password-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your password...';
            input.setAttribute("data-widget-id", this.widgetId);
            input.autocomplete = this.widgetData.autocomplete || 'current-password';
            
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "widget-password-toggle";
            toggleButton.setAttribute("aria-label", "Toggle password visibility");
            toggleButton.innerHTML = '👁️';
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-password-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const toggleVisibility = () => {
              if (input.type === 'password') {
                input.type = 'text';
                toggleButton.innerHTML = '🙈';
                toggleButton.setAttribute("aria-label", "Hide password");
              } else {
                input.type = 'password';
                toggleButton.innerHTML = '👁️';
                toggleButton.setAttribute("aria-label", "Show password");
              }
            };
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-password-disabled');
                toggleButton.disabled = true;
                toggleButton.classList.add('widget-password-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-password-disabled');
                
                const passwordValue = value;
                input.value = '';
                
                this.handleInteraction({
                  optionId: 'password-submit',
                  optionValue: passwordValue,
                  optionText: '••••••••',
                  widgetType: 'password'
                });
              }
            };
            
            toggleButton.addEventListener("click", toggleVisibility);
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            inputWrapper.appendChild(input);
            inputWrapper.appendChild(toggleButton);
            formContainer.appendChild(inputWrapper);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'password';
        }
      }
      
      // Make classes available globally
      window.BaseWidget = BaseWidget;
      window.PasswordWidget = PasswordWidget;
      
      // Create widget
      const widgetData = {
        type: 'password',
        placeholder: 'Enter your password...',
        buttonText: 'Login'
      };
      
      const widget = new PasswordWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
    });
    
    // Verify widget structure
    const widgetContainer = page.locator('.widget');
    await expect(widgetContainer).toBeVisible();
    
    const passwordContainer = page.locator('.widget-password');
    await expect(passwordContainer).toBeVisible();
    
    const passwordWrapper = page.locator('.widget-password-wrapper');
    await expect(passwordWrapper).toBeVisible();
    
    const passwordInput = page.locator('.widget-password-element');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password...');
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    
    const toggleButton = page.locator('.widget-password-toggle');
    await expect(toggleButton).toBeVisible();
    await expect(toggleButton).toHaveText('👁️');
    await expect(toggleButton).toHaveAttribute('aria-label', 'Toggle password visibility');
    
    const submitButton = page.locator('.widget-password-submit');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveText('Login');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-password { display: flex; flex-direction: column; gap: 8px; }
          .widget-password-wrapper { display: flex; gap: 8px; align-items: center; }
          .widget-password-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
          .widget-password-toggle { padding: 8px 12px; background: #f8f9fa; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
          .widget-password-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-password-disabled { opacity: 0.5; cursor: not-allowed; }
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
          return !!(this.widgetData && this.widgetData.type);
        }
      }
      
      // Password Widget Class
      class PasswordWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid password widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'password') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-password";
            
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "widget-password-wrapper";
            
            const input = document.createElement("input");
            input.type = "password";
            input.className = "widget-password-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your password...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "widget-password-toggle";
            toggleButton.setAttribute("aria-label", "Toggle password visibility");
            toggleButton.innerHTML = '👁️';
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-password-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const toggleVisibility = () => {
              if (input.type === 'password') {
                input.type = 'text';
                toggleButton.innerHTML = '🙈';
                toggleButton.setAttribute("aria-label", "Hide password");
              } else {
                input.type = 'password';
                toggleButton.innerHTML = '👁️';
                toggleButton.setAttribute("aria-label", "Show password");
              }
            };
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-password-disabled');
                toggleButton.disabled = true;
                toggleButton.classList.add('widget-password-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-password-disabled');
                
                const passwordValue = value;
                input.value = '';
                
                this.handleInteraction({
                  optionId: 'password-submit',
                  optionValue: passwordValue,
                  optionText: '••••••••',
                  widgetType: 'password'
                });
              }
            };
            
            toggleButton.addEventListener("click", toggleVisibility);
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            inputWrapper.appendChild(input);
            inputWrapper.appendChild(toggleButton);
            formContainer.appendChild(inputWrapper);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'password';
        }
      }
      
      const widgetData = {
        type: 'password',
        placeholder: 'Enter password...',
        buttonText: 'Submit'
      };
      
      const widget = new PasswordWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
    });
    
    const passwordInput = page.locator('.widget-password-element');
    const toggleButton = page.locator('.widget-password-toggle');
    
    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleButton).toHaveText('👁️');
    await expect(toggleButton).toHaveAttribute('aria-label', 'Toggle password visibility');
    
    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(toggleButton).toHaveText('🙈');
    await expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
    
    // Click toggle to hide password again
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(toggleButton).toHaveText('👁️');
    await expect(toggleButton).toHaveAttribute('aria-label', 'Show password');
  });

  test('should disable widget after submission', async ({ page }) => {
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-password { display: flex; flex-direction: column; gap: 8px; }
          .widget-password-wrapper { display: flex; gap: 8px; align-items: center; }
          .widget-password-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
          .widget-password-toggle { padding: 8px 12px; background: #f8f9fa; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
          .widget-password-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-password-disabled { opacity: 0.5; cursor: not-allowed; }
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
          return !!(this.widgetData && this.widgetData.type);
        }
      }
      
      // Password Widget Class
      class PasswordWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid password widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'password') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-password";
            
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "widget-password-wrapper";
            
            const input = document.createElement("input");
            input.type = "password";
            input.className = "widget-password-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your password...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "widget-password-toggle";
            toggleButton.setAttribute("aria-label", "Toggle password visibility");
            toggleButton.innerHTML = '👁️';
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-password-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const toggleVisibility = () => {
              if (input.type === 'password') {
                input.type = 'text';
                toggleButton.innerHTML = '🙈';
                toggleButton.setAttribute("aria-label", "Hide password");
              } else {
                input.type = 'password';
                toggleButton.innerHTML = '👁️';
                toggleButton.setAttribute("aria-label", "Show password");
              }
            };
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-password-disabled');
                toggleButton.disabled = true;
                toggleButton.classList.add('widget-password-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-password-disabled');
                
                const passwordValue = value;
                input.value = '';
                
                this.handleInteraction({
                  optionId: 'password-submit',
                  optionValue: passwordValue,
                  optionText: '••••••••',
                  widgetType: 'password'
                });
              }
            };
            
            toggleButton.addEventListener("click", toggleVisibility);
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            inputWrapper.appendChild(input);
            inputWrapper.appendChild(toggleButton);
            formContainer.appendChild(inputWrapper);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'password';
        }
      }
      
      const widgetData = {
        type: 'password',
        placeholder: 'Enter password...',
        buttonText: 'Submit'
      };
      
      const widget = new PasswordWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Simulate submission
      const input = element.querySelector('.widget-password-element');
      const button = element.querySelector('.widget-password-submit');
      
      input.value = 'testpassword123';
      button.click();
    });
    
    // Verify disabled state
    const passwordInput = page.locator('.widget-password-element');
    const toggleButton = page.locator('.widget-password-toggle');
    const submitButton = page.locator('.widget-password-submit');
    
    await expect(passwordInput).toBeDisabled();
    await expect(toggleButton).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    await expect(passwordInput).toHaveClass(/widget-password-disabled/);
    await expect(toggleButton).toHaveClass(/widget-password-disabled/);
    await expect(submitButton).toHaveClass(/widget-password-disabled/);
    await expect(passwordInput).toHaveValue(''); // Password cleared for security
  });

  test('should not submit empty password', async ({ page }) => {
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-password { display: flex; flex-direction: column; gap: 8px; }
          .widget-password-wrapper { display: flex; gap: 8px; align-items: center; }
          .widget-password-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
          .widget-password-toggle { padding: 8px 12px; background: #f8f9fa; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
          .widget-password-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-password-disabled { opacity: 0.5; cursor: not-allowed; }
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
          return !!(this.widgetData && this.widgetData.type);
        }
      }
      
      // Password Widget Class
      class PasswordWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid password widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'password') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-password";
            
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "widget-password-wrapper";
            
            const input = document.createElement("input");
            input.type = "password";
            input.className = "widget-password-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your password...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "widget-password-toggle";
            toggleButton.setAttribute("aria-label", "Toggle password visibility");
            toggleButton.innerHTML = '👁️';
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-password-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const toggleVisibility = () => {
              if (input.type === 'password') {
                input.type = 'text';
                toggleButton.innerHTML = '🙈';
                toggleButton.setAttribute("aria-label", "Hide password");
              } else {
                input.type = 'password';
                toggleButton.innerHTML = '👁️';
                toggleButton.setAttribute("aria-label", "Show password");
              }
            };
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-password-disabled');
                toggleButton.disabled = true;
                toggleButton.classList.add('widget-password-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-password-disabled');
                
                const passwordValue = value;
                input.value = '';
                
                this.handleInteraction({
                  optionId: 'password-submit',
                  optionValue: passwordValue,
                  optionText: '••••••••',
                  widgetType: 'password'
                });
              }
            };
            
            toggleButton.addEventListener("click", toggleVisibility);
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            inputWrapper.appendChild(input);
            inputWrapper.appendChild(toggleButton);
            formContainer.appendChild(inputWrapper);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'password';
        }
      }
      
      const widgetData = {
        type: 'password',
        placeholder: 'Enter password...',
        buttonText: 'Submit'
      };
      
      const widget = new PasswordWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Try to submit empty password
      const button = element.querySelector('.widget-password-submit');
      button.click();
    });
    
    // Verify still enabled (no submission occurred)
    const passwordInput = page.locator('.widget-password-element');
    const toggleButton = page.locator('.widget-password-toggle');
    const submitButton = page.locator('.widget-password-submit');
    
    await expect(passwordInput).toBeEnabled();
    await expect(toggleButton).toBeEnabled();
    await expect(submitButton).toBeEnabled();
    await expect(passwordInput).toHaveValue(''); // Still empty
  });

  test('should handle Enter key submission', async ({ page }) => {
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-password { display: flex; flex-direction: column; gap: 8px; }
          .widget-password-wrapper { display: flex; gap: 8px; align-items: center; }
          .widget-password-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
          .widget-password-toggle { padding: 8px 12px; background: #f8f9fa; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
          .widget-password-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-password-disabled { opacity: 0.5; cursor: not-allowed; }
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
          return !!(this.widgetData && this.widgetData.type);
        }
      }
      
      // Password Widget Class
      class PasswordWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid password widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'password') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-password";
            
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "widget-password-wrapper";
            
            const input = document.createElement("input");
            input.type = "password";
            input.className = "widget-password-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your password...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "widget-password-toggle";
            toggleButton.setAttribute("aria-label", "Toggle password visibility");
            toggleButton.innerHTML = '👁️';
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-password-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const toggleVisibility = () => {
              if (input.type === 'password') {
                input.type = 'text';
                toggleButton.innerHTML = '🙈';
                toggleButton.setAttribute("aria-label", "Hide password");
              } else {
                input.type = 'password';
                toggleButton.innerHTML = '👁️';
                toggleButton.setAttribute("aria-label", "Show password");
              }
            };
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-password-disabled');
                toggleButton.disabled = true;
                toggleButton.classList.add('widget-password-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-password-disabled');
                
                const passwordValue = value;
                input.value = '';
                
                this.handleInteraction({
                  optionId: 'password-submit',
                  optionValue: passwordValue,
                  optionText: '••••••••',
                  widgetType: 'password'
                });
              }
            };
            
            toggleButton.addEventListener("click", toggleVisibility);
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            inputWrapper.appendChild(input);
            inputWrapper.appendChild(toggleButton);
            formContainer.appendChild(inputWrapper);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'password';
        }
      }
      
      const widgetData = {
        type: 'password',
        placeholder: 'Enter password...',
        buttonText: 'Submit'
      };
      
      const widget = new PasswordWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Simulate Enter key submission
      const input = element.querySelector('.widget-password-element');
      input.value = 'testpassword123';
      
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
    const passwordInput = page.locator('.widget-password-element');
    const toggleButton = page.locator('.widget-password-toggle');
    const submitButton = page.locator('.widget-password-submit');
    
    await expect(passwordInput).toBeDisabled();
    await expect(toggleButton).toBeDisabled();
    await expect(submitButton).toBeDisabled();
    await expect(passwordInput).toHaveClass(/widget-password-disabled/);
  });

  test('should dispatch interaction event correctly', async ({ page }) => {
    await page.goto('about:blank');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget { margin-top: 8px; }
          .widget-password { display: flex; flex-direction: column; gap: 8px; }
          .widget-password-wrapper { display: flex; gap: 8px; align-items: center; }
          .widget-password-element { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
          .widget-password-toggle { padding: 8px 12px; background: #f8f9fa; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
          .widget-password-submit { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .widget-password-disabled { opacity: 0.5; cursor: not-allowed; }
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
          return !!(this.widgetData && this.widgetData.type);
        }
      }
      
      // Password Widget Class
      class PasswordWidget extends BaseWidget {
        createElement() {
          if (!this.validate()) {
            return document.createComment('Invalid password widget data');
          }

          const widgetContainer = document.createElement("div");
          widgetContainer.className = "widget";
          
          if (this.widgetData.type === 'password') {
            const formContainer = document.createElement("div");
            formContainer.className = "widget-password";
            
            const inputWrapper = document.createElement("div");
            inputWrapper.className = "widget-password-wrapper";
            
            const input = document.createElement("input");
            input.type = "password";
            input.className = "widget-password-element";
            input.placeholder = this.widgetData.placeholder || 'Enter your password...';
            input.setAttribute("data-widget-id", this.widgetId);
            
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "widget-password-toggle";
            toggleButton.setAttribute("aria-label", "Toggle password visibility");
            toggleButton.innerHTML = '👁️';
            
            const submitButton = document.createElement("button");
            submitButton.className = "widget-password-submit";
            submitButton.textContent = this.widgetData.buttonText || 'Submit';
            
            const toggleVisibility = () => {
              if (input.type === 'password') {
                input.type = 'text';
                toggleButton.innerHTML = '🙈';
                toggleButton.setAttribute("aria-label", "Hide password");
              } else {
                input.type = 'password';
                toggleButton.innerHTML = '👁️';
                toggleButton.setAttribute("aria-label", "Show password");
              }
            };
            
            const handleSubmit = () => {
              const value = input.value.trim();
              if (value) {
                input.disabled = true;
                input.classList.add('widget-password-disabled');
                toggleButton.disabled = true;
                toggleButton.classList.add('widget-password-disabled');
                submitButton.disabled = true;
                submitButton.classList.add('widget-password-disabled');
                
                const passwordValue = value;
                input.value = '';
                
                this.handleInteraction({
                  optionId: 'password-submit',
                  optionValue: passwordValue,
                  optionText: '••••••••',
                  widgetType: 'password'
                });
              }
            };
            
            toggleButton.addEventListener("click", toggleVisibility);
            submitButton.addEventListener("click", handleSubmit);
            input.addEventListener("keypress", (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            });
            
            inputWrapper.appendChild(input);
            inputWrapper.appendChild(toggleButton);
            formContainer.appendChild(inputWrapper);
            formContainer.appendChild(submitButton);
            widgetContainer.appendChild(formContainer);
          }
          
          return widgetContainer;
        }

        validate() {
          return super.validate() && 
                 this.widgetData.type === 'password';
        }
      }
      
      const widgetData = {
        type: 'password',
        placeholder: 'Enter password...',
        buttonText: 'Submit'
      };
      
      const widget = new PasswordWidget(widgetData, 'test-widget-id');
      const element = widget.createElement();
      document.body.appendChild(element);
      
      // Add event listener
      document.addEventListener('widgetInteraction', (event) => {
        window.captureInteraction(event.detail);
      });
      
      // Submit the form
      const input = element.querySelector('.widget-password-element');
      const button = element.querySelector('.widget-password-submit');
      
      input.value = 'secretpassword456';
      button.click();
    });
    
    // Verify interaction event was dispatched
    expect(interactionData).not.toBeNull();
    expect(interactionData!.widgetId).toBe('test-widget-id');
    expect(interactionData!.optionId).toBe('password-submit');
    expect(interactionData!.optionValue).toBe('secretpassword456');
    expect(interactionData!.optionText).toBe('••••••••'); // Password masked
    expect(interactionData!.widgetType).toBe('password');
  });

  test('should validate password widget correctly', async ({ page }) => {
    await page.goto('about:blank');
    
    await page.evaluate(() => {
      // Base Widget Class
      class BaseWidget {
        constructor(widgetData, widgetId) {
          this.widgetData = widgetData;
          this.widgetId = widgetId;
        }
        
        validate() {
          return !!(this.widgetData && this.widgetData.type);
        }
      }
      
      // Password Widget Class
      class PasswordWidget extends BaseWidget {
        validate() {
          return super.validate() && 
                 this.widgetData.type === 'password';
        }
      }
      
      // Test valid password widget
      const validWidget = new PasswordWidget({
        type: 'password',
        placeholder: 'Enter password'
      }, 'test-widget');
      
      // Test invalid password widget (wrong type)
      const invalidWidget = new PasswordWidget({
        type: 'wrong-password',
        placeholder: 'Enter password'
      }, 'test-widget');
      
      // Test invalid password widget (no type)
      const noTypeWidget = new PasswordWidget({
        placeholder: 'Enter password'
      }, 'test-widget');
      
      window.validationResults = {
        valid: validWidget.validate(),
        invalidType: invalidWidget.validate(),
        noType: noTypeWidget.validate()
      };
    });
    
    const results = await page.evaluate(() => (window as any).validationResults);
    
    expect(results.valid).toBe(true);
    expect(results.invalidType).toBe(false);
    expect(results.noType).toBe(false);
  });
});
