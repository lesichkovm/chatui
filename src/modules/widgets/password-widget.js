import { BaseWidget } from './base-widget.js';

/**
 * Password Widget (Composable)
 * A standalone password input widget with toggle visibility option
 * Can be used in containers or standalone
 */
export class PasswordWidget extends BaseWidget {
  /**
   * Create the DOM element for the password widget
   * @returns {HTMLElement|Comment} Password container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid password widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-password-container';
    
    const props = this.widgetData.props || {};
    const placeholder = props.placeholder || 'Enter your password...';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const autocomplete = props.autocomplete || 'current-password';
    
    // Create input wrapper
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'widget-password-wrapper';
    
    // Create password input
    const input = document.createElement('input');
    input.type = 'password';
    input.className = 'widget-password-input';
    input.placeholder = placeholder;
    input.autocomplete = autocomplete;
    
    // Apply variant and size classes
    input.classList.add(`variant-${variant}`);
    input.classList.add(`size-${size}`);
    
    // Set disabled state
    if (props.disabled) {
      input.disabled = true;
      input.classList.add('widget-password-disabled');
    }
    
    // Create toggle visibility button
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'widget-password-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle password visibility');
    toggleButton.innerHTML = '👁️';
    toggleButton.classList.add(`variant-${variant}`);
    toggleButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      toggleButton.disabled = true;
      toggleButton.classList.add('widget-password-disabled');
    }
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'widget-password-submit';
    submitButton.textContent = buttonText;
    submitButton.classList.add(`variant-${variant}`);
    submitButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      submitButton.disabled = true;
      submitButton.classList.add('widget-password-disabled');
    }
    
    // Toggle password visibility
    const toggleVisibility = () => {
      if (!toggleButton.disabled) {
        if (input.type === 'password') {
          input.type = 'text';
          toggleButton.innerHTML = '🙈';
          toggleButton.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          toggleButton.innerHTML = '👁️';
          toggleButton.setAttribute('aria-label', 'Show password');
        }
      }
    };
    
    // Handle submission
    const handleSubmit = () => {
      if (!input.disabled && !submitButton.disabled) {
        const value = input.value.trim();
        
        // Validate if required
        if (props.required && !value) {
          input.classList.add('widget-password-error');
          return;
        }
        
        if (value || !props.required) {
          // Disable all controls after submission if specified
          if (props.disableOnSubmit !== false) {
            input.disabled = true;
            input.classList.add('widget-password-disabled');
            toggleButton.disabled = true;
            toggleButton.classList.add('widget-password-disabled');
            submitButton.disabled = true;
            submitButton.classList.add('widget-password-disabled');
          }
          
          // Clear the password field for security
          const passwordValue = value;
          input.value = '';
          
          this.handleInteraction({
            value: passwordValue,
            maskedValue: '•'.repeat(passwordValue.length),
            widgetType: 'password'
          });
        }
      }
    };
    
    // Add event listeners
    toggleButton.addEventListener('click', toggleVisibility);
    submitButton.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    });
    
    // Clear error state on input
    input.addEventListener('input', () => {
      input.classList.remove('widget-password-error');
    });
    
    // Apply custom styles if provided
    if (props.inputStyle) {
      Object.assign(input.style, props.inputStyle);
    }
    
    if (props.toggleStyle) {
      Object.assign(toggleButton.style, props.toggleStyle);
    }
    
    if (props.buttonStyle) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(toggleButton);
    container.appendChild(inputWrapper);
    container.appendChild(submitButton);
    
    return container;
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
