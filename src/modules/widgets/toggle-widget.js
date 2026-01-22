import { BaseWidget } from './base-widget.js';

/**
 * Toggle Widget (Composable)
 * A standalone toggle switch widget for binary choices
 * Can be used in containers or standalone
 */
export class ToggleWidget extends BaseWidget {
  /**
   * Create the DOM element for the toggle widget
   * @returns {HTMLElement|Comment} Toggle container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid toggle widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-toggle-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Enable';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const defaultValue = props.defaultValue || false;
    let currentValue = defaultValue;
    const showSubmitButton = props.showSubmitButton !== false; // Default to true for backward compatibility
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.className = 'widget-toggle-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create toggle wrapper
    const toggleWrapper = document.createElement('div');
    toggleWrapper.className = 'widget-toggle-wrapper';
    
    // Create toggle input (hidden checkbox)
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.className = 'widget-toggle-input';
    toggleInput.checked = currentValue;
    
    // Create toggle slider (visual element)
    const toggleSlider = document.createElement('span');
    toggleSlider.className = 'widget-toggle-slider';
    toggleSlider.classList.add(`variant-${variant}`);
    toggleSlider.classList.add(`size-${size}`);
    
    // Set disabled state
    if (props.disabled) {
      toggleInput.disabled = true;
      toggleSlider.classList.add('widget-toggle-disabled');
    }
    
    // Handle toggle interaction
    const handleToggle = () => {
      if (!props.disabled) {
        currentValue = !currentValue;
        toggleInput.checked = currentValue;
        toggleSlider.classList.toggle('active', currentValue);
        
        // Update display if present
        if (valueDisplay) {
          valueDisplay.textContent = currentValue ? 'ON' : 'OFF';
        }
      }
    };
    
    // Add click handlers
    toggleSlider.addEventListener('click', handleToggle);
    labelElement.addEventListener('click', (e) => {
      e.preventDefault();
      handleToggle();
    });
    
    // Create value display
    let valueDisplay = null;
    if (props.showValue !== false) {
      valueDisplay = document.createElement('div');
      valueDisplay.className = 'widget-toggle-value';
      valueDisplay.textContent = currentValue ? 'ON' : 'OFF';
      valueDisplay.classList.add(`variant-${variant}`);
      valueDisplay.classList.add(`size-${size}`);
    }
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-toggle-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-toggle-disabled');
      }
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!submitButton || !submitButton.disabled) {
        // Disable toggle and submit button if specified
        if (props.disableOnSubmit !== false) {
          toggleInput.disabled = true;
          toggleSlider.classList.add('widget-toggle-disabled');
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('widget-toggle-disabled');
          }
        }
        
        this.handleInteraction({
          value: currentValue,
          label: label,
          widgetType: 'toggle'
        });
      }
    };
    
    // Add event listener
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    // Set initial state
    if (currentValue) {
      toggleSlider.classList.add('active');
    }
    
    // Apply custom styles if provided
    if (props.toggleStyle) {
      Object.assign(toggleSlider.style, props.toggleStyle);
    }
    
    if (props.buttonStyle && submitButton) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    toggleWrapper.appendChild(toggleInput);
    toggleWrapper.appendChild(toggleSlider);
    
    container.appendChild(labelElement);
    container.appendChild(toggleWrapper);
    if (valueDisplay) {
      container.appendChild(valueDisplay);
    }
    if (submitButton) {
      container.appendChild(submitButton);
    }
    
    return container;
  }

  /**
   * Validate toggle widget data structure
   * @returns {boolean} True if data contains required properties for toggle widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'toggle';
  }

  /**
   * Get the current value of the toggle widget
   * @returns {boolean} Current toggle state
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const toggleInput = container.querySelector('.widget-toggle-input');
      return toggleInput ? toggleInput.checked : false;
    }
    return false;
  }

  /**
   * Set the value of the toggle widget
   * @param {boolean} value - Toggle state to set
   */
  setValue(value) {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const toggleInput = container.querySelector('.widget-toggle-input');
      const toggleSlider = container.querySelector('.widget-toggle-slider');
      const valueDisplay = container.querySelector('.widget-toggle-value');
      
      if (toggleInput) {
        toggleInput.checked = value;
        if (toggleSlider) {
          toggleSlider.classList.toggle('active', value);
        }
        if (valueDisplay) {
          valueDisplay.textContent = value ? 'ON' : 'OFF';
        }
      }
    }
  }
}
