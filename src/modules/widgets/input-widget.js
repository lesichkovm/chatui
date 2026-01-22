import { BaseWidget } from './base-widget.js';

/**
 * Input Widget (Composable)
 * A standalone input widget with submit functionality
 * Can be used in containers or standalone
 */
export class InputWidget extends BaseWidget {
  /**
   * Create the DOM element for the input widget
   * @returns {HTMLElement|Comment} Input container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid input widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-input-container';
    
    const props = this.widgetData.props || {};
    const inputType = props.type || 'text';
    const placeholder = props.placeholder || 'Enter your response...';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    
    // Create input element
    const input = document.createElement('input');
    input.type = inputType;
    input.className = 'widget-input';
    input.placeholder = placeholder;
    
    // Apply variant and size classes
    input.classList.add(`variant-${variant}`);
    input.classList.add(`size-${size}`);
    
    // Set additional input properties
    if (props.maxLength) input.maxLength = props.maxLength;
    if (props.required) input.required = props.required;
    if (props.pattern) input.pattern = props.pattern;
    if (props.min) input.min = props.min;
    if (props.max) input.max = props.max;
    if (props.step) input.step = props.step;
    
    // Set disabled state
    if (props.disabled) {
      input.disabled = true;
      input.classList.add('widget-input-disabled');
    }
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'widget-input-submit';
    submitButton.textContent = buttonText;
    submitButton.classList.add(`variant-${variant}`);
    submitButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      submitButton.disabled = true;
      submitButton.classList.add('widget-input-disabled');
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!input.disabled && !submitButton.disabled) {
        const value = input.value.trim();
        
        // Validate if required
        if (props.required && !value) {
          input.classList.add('widget-input-error');
          return;
        }
        
        if (value || !props.required) {
          // Disable both input and submit button after submission if specified
          if (props.disableOnSubmit !== false) {
            input.disabled = true;
            input.classList.add('widget-input-disabled');
            submitButton.disabled = true;
            submitButton.classList.add('widget-input-disabled');
          }
          
          this.handleInteraction({
            value: value,
            inputType: inputType,
            widgetType: 'input'
          });
          
          // Clear input if specified
          if (props.clearOnSubmit !== false) {
            input.value = '';
          }
        }
      }
    };
    
    // Add event listeners
    submitButton.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    });
    
    // Clear error state on input
    input.addEventListener('input', () => {
      input.classList.remove('widget-input-error');
    });
    
    // Apply custom styles if provided
    if (props.inputStyle) {
      Object.assign(input.style, props.inputStyle);
    }
    
    if (props.buttonStyle) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Add elements to container
    container.appendChild(input);
    container.appendChild(submitButton);
    
    return container;
  }

  /**
   * Validate input widget data structure
   * @returns {boolean} True if data contains required properties for input widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'input';
  }
}
