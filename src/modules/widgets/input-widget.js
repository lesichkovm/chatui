import { BaseWidget } from './base-widget.js';
import { sanitizeStyleProps } from '../../utils/security.js';
import { getWidgetDefaults, applyMigrationConfig, getMigrationWarning } from '../../config/widget-defaults.js';

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

    // Apply migration configuration
    const widgetData = applyMigrationConfig(this.widgetData);
    
    // Check for migration warnings
    const warning = getMigrationWarning(widgetData);
    if (warning) {
      console.warn(warning);
    }

    const container = document.createElement('div');
    container.className = 'widget-input-container';
    
    const props = widgetData.props || {};
    const defaults = getWidgetDefaults('input');
    const inputType = props.type || 'text';
    const placeholder = props.placeholder || 'Enter your response...';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    
    // Breaking Change: Default to no submit button (Phase 3)
    const showSubmitButton = props.showSubmitButton === true; // Only show if explicitly set to true
    
    // Create input element
    const input = document.createElement('input');
    input.type = inputType;
    input.className = 'widget-input-element';
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
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-input-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-input-disabled');
      }
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!input.disabled && (!submitButton || !submitButton.disabled)) {
        const value = input.value.trim();
        
        // Validate if required
        if (props.required && !value) {
          input.classList.add('widget-input-error');
          return;
        }
        
        if (value || !props.required) {
          // Disable input and submit button after submission if specified
          if (props.disableOnSubmit !== false) {
            input.disabled = true;
            input.classList.add('widget-input-disabled');
            if (submitButton) {
              submitButton.disabled = true;
              submitButton.classList.add('widget-input-disabled');
            }
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
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    });
    
    // Clear error state on input and emit value change
    input.addEventListener('input', () => {
      input.classList.remove('widget-input-error');
      this.emitValueChange(input.value);
    });
    
    // Apply custom styles if provided
    if (props.inputStyle) {
      const sanitizedInputStyle = sanitizeStyleProps(props.inputStyle);
      Object.assign(input.style, sanitizedInputStyle);
    }
    
    if (submitButton && props.buttonStyle) {
      const sanitizedButtonStyle = sanitizeStyleProps(props.buttonStyle);
      Object.assign(submitButton.style, sanitizedButtonStyle);
    }
    
    if (props.style) {
      const sanitizedStyle = sanitizeStyleProps(props.style);
      Object.assign(container.style, sanitizedStyle);
    }
    
    // Add elements to container
    container.appendChild(input);
    if (submitButton) {
      container.appendChild(submitButton);
    }
    
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

  /**
   * Get the current value of the input widget
   * @returns {string} Current input value
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const input = container.querySelector('.widget-input-element');
      return input ? input.value : '';
    }
    return '';
  }

  /**
   * Set the value of the input widget
   * @param {string} value - Value to set
   */
  setValue(value) {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const input = container.querySelector('.widget-input-element');
      if (input) {
        input.value = value;
      }
    }
  }
}
