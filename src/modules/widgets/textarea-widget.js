import { BaseWidget } from './base-widget.js';
import { applyMigrationConfig, getMigrationWarning } from '../../config/widget-defaults.js';

/**
 * Textarea Widget (Composable)
 * A standalone textarea widget for multi-line text input
 * Can be used in containers or standalone
 */
export class TextareaWidget extends BaseWidget {
  /**
   * Create the DOM element for the textarea widget
   * @returns {HTMLElement|Comment} Textarea container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid textarea widget data');
    }

    // Apply migration configuration
    const widgetData = applyMigrationConfig(this.widgetData);
    
    // Check for migration warnings
    const warning = getMigrationWarning(widgetData);
    if (warning) {
      console.warn(warning);
    }

    const container = document.createElement('div');
    container.className = 'widget-textarea-container';
    
    const props = widgetData.props || {};
    const placeholder = props.placeholder || 'Enter your response...';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const rows = props.rows || 4;
    const maxLength = props.maxLength;
    const resize = props.resize || 'vertical';
    
    // Breaking Change: Default to no submit button (Phase 3)
    const showSubmitButton = props.showSubmitButton === true; // Only show if explicitly set to true
    
    // Create textarea element
    const textarea = document.createElement('textarea');
    textarea.className = 'widget-textarea';
    textarea.placeholder = placeholder;
    textarea.rows = rows;
    
    // Apply variant and size classes
    textarea.classList.add(`variant-${variant}`);
    textarea.classList.add(`size-${size}`);
    
    // Set textarea properties
    if (maxLength) textarea.maxLength = maxLength;
    if (props.required) textarea.required = props.required;
    if (props.readonly) textarea.readOnly = props.readonly;
    
    // Set resize behavior
    textarea.style.resize = resize;
    
    // Set disabled state
    if (props.disabled) {
      textarea.disabled = true;
      textarea.classList.add('widget-textarea-disabled');
    }
    
    // Create character counter if maxLength is set
    let counterElement = null;
    if (maxLength && props.showCounter !== false) {
      counterElement = document.createElement('div');
      counterElement.className = 'widget-textarea-counter';
      counterElement.textContent = `0 / ${maxLength}`;
      counterElement.style.fontSize = '12px';
      counterElement.style.color = '#666';
      counterElement.style.textAlign = 'right';
      counterElement.style.marginTop = '4px';
    }
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-textarea-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-textarea-disabled');
      }
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!textarea.disabled && (!submitButton || !submitButton.disabled)) {
        const value = textarea.value.trim();
        
        // Validate if required
        if (props.required && !value) {
          textarea.classList.add('widget-textarea-error');
          return;
        }
        
        if (value || !props.required) {
          // Disable both textarea and submit button after submission if specified
          if (props.disableOnSubmit !== false) {
            textarea.disabled = true;
            textarea.classList.add('widget-textarea-disabled');
            if (submitButton) {
              submitButton.disabled = true;
              submitButton.classList.add('widget-textarea-disabled');
            }
          }
          
          this.handleInteraction({
            value: value,
            length: value.length,
            widgetType: 'textarea'
          });
          
          // Clear textarea if specified
          if (props.clearOnSubmit !== false) {
            textarea.value = '';
            if (counterElement) {
              counterElement.textContent = `0 / ${maxLength}`;
            }
          }
        }
      }
    };
    
    // Add event listeners
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleSubmit();
      }
    });
    
    // Update character counter
    if (counterElement) {
      textarea.addEventListener('input', () => {
        const currentLength = textarea.value.length;
        counterElement.textContent = `${currentLength} / ${maxLength}`;
        
        // Update counter color based on length
        if (currentLength > maxLength * 0.9) {
          counterElement.style.color = '#dc3545';
        } else if (currentLength > maxLength * 0.7) {
          counterElement.style.color = '#ffc107';
        } else {
          counterElement.style.color = '#666';
        }
        
        // Clear error state
        textarea.classList.remove('widget-textarea-error');
      });
    }
    
    // Clear error state on input and emit value change
    textarea.addEventListener('input', () => {
      textarea.classList.remove('widget-textarea-error');
      this.emitValueChange(textarea.value);
    });
    
    // Apply custom styles if provided
    if (props.textareaStyle) {
      Object.assign(textarea.style, props.textareaStyle);
    }
    
    if (props.buttonStyle && submitButton) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    container.appendChild(textarea);
    if (counterElement) {
      container.appendChild(counterElement);
    }
    if (submitButton) {
      container.appendChild(submitButton);
    }
    
    return container;
  }

  /**
   * Validate textarea widget data structure
   * @returns {boolean} True if data contains required properties for textarea widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'textarea';
  }

  /**
   * Get the current value of the textarea widget
   * @returns {string} Current textarea value
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const textarea = container.querySelector('.widget-textarea');
      return textarea ? textarea.value : '';
    }
    return '';
  }

  /**
   * Set the value of the textarea widget
   * @param {string} value - Value to set
   */
  setValue(value) {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const textarea = container.querySelector('.widget-textarea');
      if (textarea) {
        textarea.value = value;
      }
    }
  }
}
