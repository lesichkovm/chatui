import { BaseWidget } from './base-widget.js';

/**
 * Password Widget
 * Renders a secure password input field with toggle visibility option
 * Extends BaseWidget to provide password input interaction
 */
export class PasswordWidget extends BaseWidget {
  /**
   * Create the DOM element for the password widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
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
      
      // Toggle password visibility
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
          // Disable all controls after submission
          input.disabled = true;
          input.classList.add('widget-password-disabled');
          toggleButton.disabled = true;
          toggleButton.classList.add('widget-password-disabled');
          submitButton.disabled = true;
          submitButton.classList.add('widget-password-disabled');
          
          // Clear the password field for security
          const passwordValue = value;
          input.value = '';
          
          this.handleInteraction({
            optionId: 'password-submit',
            optionValue: passwordValue,
            optionText: '••••••••', // Mask the password in display
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

  /**
   * Validate password widget data structure
   * @returns {boolean} True if data contains required properties for password widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'password';
  }
}
