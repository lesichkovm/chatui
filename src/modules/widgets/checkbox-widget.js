import { BaseWidget } from './base-widget.js';

/**
 * Checkbox Widget (Composable)
 * A standalone checkbox widget for multi-select options
 * Can be used in containers or standalone
 */
export class CheckboxWidget extends BaseWidget {
  /**
   * Create the DOM element for the checkbox widget
   * @returns {HTMLElement|Comment} Checkbox container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid checkbox widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-checkbox-container';
    
    const props = this.widgetData.props || {};
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const layout = props.layout || 'vertical';
    const allowEmpty = props.allowEmpty !== false;
    const showSubmitButton = props.showSubmitButton !== false; // Default to true for backward compatibility
    
    // Create checkbox container
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'widget-checkbox-options';
    
    // Apply layout
    if (layout === 'horizontal') {
      checkboxContainer.style.display = 'flex';
      checkboxContainer.style.flexWrap = 'wrap';
      checkboxContainer.style.gap = '12px';
    } else {
      checkboxContainer.style.display = 'flex';
      checkboxContainer.style.flexDirection = 'column';
      checkboxContainer.style.gap = '8px';
    }
    
    // Create checkboxes
    const options = props.options || [];
    options.forEach((option, index) => {
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.className = 'widget-checkbox-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'widget-checkbox';
      checkbox.id = `checkbox-${this.widgetId}-${option.id}`;
      checkbox.value = option.value || option.id;
      checkbox.setAttribute('data-option-id', option.id);
      
      if (option.checked) {
        checkbox.checked = true;
      }
      
      if (props.disabled || option.disabled) {
        checkbox.disabled = true;
        checkbox.classList.add('widget-checkbox-disabled');
      }
      
      const label = document.createElement('label');
      label.className = 'widget-checkbox-label';
      label.htmlFor = `checkbox-${this.widgetId}-${option.id}`;
      label.textContent = option.text || option.label;
      
      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(label);
      checkboxContainer.appendChild(checkboxWrapper);
    });
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-checkbox-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-checkbox-disabled');
      }
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!submitButton || !submitButton.disabled) {
        const checkboxes = checkboxContainer.querySelectorAll('.widget-checkbox');
        const selectedOptions = [];
        
        checkboxes.forEach(checkbox => {
          if (checkbox.checked) {
            const optionId = checkbox.getAttribute('data-option-id');
            const optionData = options.find(opt => opt.id === optionId);
            if (optionData) {
              selectedOptions.push({
                id: optionData.id,
                value: optionData.value || optionData.id,
                text: optionData.text || optionData.label
              });
            }
          }
        });
        
        if (selectedOptions.length > 0 || allowEmpty) {
          // Disable all checkboxes and submit button if specified
          if (props.disableOnSubmit !== false) {
            checkboxes.forEach(cb => {
              cb.disabled = true;
              cb.classList.add('widget-checkbox-disabled');
            });
            if (submitButton) {
              submitButton.disabled = true;
              submitButton.classList.add('widget-checkbox-disabled');
            }
          }
          
          this.handleInteraction({
            selectedOptions,
            widgetType: 'checkbox'
          });
        }
      }
    };
    
    // Add event listener
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    // Apply custom styles if provided
    if (props.optionsStyle) {
      Object.assign(checkboxContainer.style, props.optionsStyle);
    }
    
    if (props.buttonStyle && submitButton) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    container.appendChild(checkboxContainer);
    if (submitButton) {
      container.appendChild(submitButton);
    }
    
    return container;
  }

  /**
   * Validate checkbox widget data structure
   * @returns {boolean} True if data contains required properties for checkbox widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'checkbox' && 
           this.widgetData.props &&
           Array.isArray(this.widgetData.props.options) &&
           this.widgetData.props.options.length > 0;
  }

  /**
   * Get the current value of the checkbox widget
   * @returns {Array} Array of selected option values
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const checkboxes = container.querySelectorAll('.widget-checkbox:checked');
      const selectedValues = [];
      checkboxes.forEach(checkbox => {
        selectedValues.push(checkbox.value);
      });
      return selectedValues;
    }
    return [];
  }

  /**
   * Set the value of the checkbox widget
   * @param {Array} values - Array of values to select
   */
  setValue(values) {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const checkboxes = container.querySelectorAll('.widget-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.checked = values.includes(checkbox.value);
      });
    }
  }
}
