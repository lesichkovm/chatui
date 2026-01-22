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
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'widget-checkbox-submit';
    submitButton.textContent = buttonText;
    submitButton.classList.add(`variant-${variant}`);
    submitButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      submitButton.disabled = true;
      submitButton.classList.add('widget-checkbox-disabled');
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!submitButton.disabled) {
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
            submitButton.disabled = true;
            submitButton.classList.add('widget-checkbox-disabled');
          }
          
          this.handleInteraction({
            selectedOptions,
            widgetType: 'checkbox'
          });
        }
      }
    };
    
    // Add event listener
    submitButton.addEventListener('click', handleSubmit);
    
    // Apply custom styles if provided
    if (props.optionsStyle) {
      Object.assign(checkboxContainer.style, props.optionsStyle);
    }
    
    if (props.buttonStyle) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    container.appendChild(checkboxContainer);
    container.appendChild(submitButton);
    
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
}
