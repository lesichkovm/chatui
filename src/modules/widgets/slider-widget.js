import { BaseWidget } from './base-widget.js';

/**
 * Slider Widget (Composable)
 * A standalone slider widget for numeric range selection
 * Can be used in containers or standalone
 */
export class SliderWidget extends BaseWidget {
  /**
   * Create the DOM element for the slider widget
   * @returns {HTMLElement|Comment} Slider container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid slider widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-slider-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Select a value';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const min = props.min || 0;
    const max = props.max || 100;
    const step = props.step || 1;
    const defaultValue = props.defaultValue || Math.floor((min + max) / 2);
    const showValue = props.showValue !== false;
    const showSubmitButton = props.showSubmitButton !== false; // Default to true for backward compatibility
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.className = 'widget-slider-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create slider wrapper
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'widget-slider-wrapper';
    
    // Create slider input
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'widget-slider';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = defaultValue;
    
    // Apply variant and size classes
    slider.classList.add(`variant-${variant}`);
    slider.classList.add(`size-${size}`);
    
    // Set disabled state
    if (props.disabled) {
      slider.disabled = true;
      slider.classList.add('widget-slider-disabled');
    }
    
    // Create value display
    let valueDisplay = null;
    if (showValue) {
      valueDisplay = document.createElement('div');
      valueDisplay.className = 'widget-slider-value';
      valueDisplay.textContent = defaultValue;
      valueDisplay.classList.add(`variant-${variant}`);
      valueDisplay.classList.add(`size-${size}`);
    }
    
    // Create submit button conditionally
    let submitButton = null;
    if (showSubmitButton) {
      submitButton = document.createElement('button');
      submitButton.className = 'widget-slider-submit';
      submitButton.textContent = buttonText;
      submitButton.classList.add(`variant-${variant}`);
      submitButton.classList.add(`size-${size}`);
      
      if (props.disabled) {
        submitButton.disabled = true;
        submitButton.classList.add('widget-slider-disabled');
      }
    }
    
    // Update value display
    const updateValue = () => {
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
      }
    };
    
    slider.addEventListener('input', updateValue);
    
    // Handle submission
    const handleSubmit = () => {
      if (!slider.disabled && (!submitButton || !submitButton.disabled)) {
        const value = parseFloat(slider.value);
        
        // Disable slider and submit button if specified
        if (props.disableOnSubmit !== false) {
          slider.disabled = true;
          slider.classList.add('widget-slider-disabled');
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add('widget-slider-disabled');
          }
        }
        
        this.handleInteraction({
          value: value,
          min: min,
          max: max,
          step: step,
          widgetType: 'slider'
        });
      }
    };
    
    // Add event listener
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }
    
    // Apply custom styles if provided
    if (props.sliderStyle) {
      Object.assign(slider.style, props.sliderStyle);
    }
    
    if (props.buttonStyle && submitButton) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    container.appendChild(labelElement);
    sliderWrapper.appendChild(slider);
    if (valueDisplay) {
      sliderWrapper.appendChild(valueDisplay);
    }
    container.appendChild(sliderWrapper);
    if (submitButton) {
      container.appendChild(submitButton);
    }
    
    return container;
  }

  /**
   * Validate slider widget data structure
   * @returns {boolean} True if data contains required properties for slider widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'slider';
  }

  /**
   * Get the current value of the slider widget
   * @returns {number} Current slider value
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const slider = container.querySelector('.widget-slider');
      return slider ? parseFloat(slider.value) : 0;
    }
    return 0;
  }

  /**
   * Set the value of the slider widget
   * @param {number} value - Value to set
   */
  setValue(value) {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const slider = container.querySelector('.widget-slider');
      const valueDisplay = container.querySelector('.widget-slider-value');
      if (slider) {
        slider.value = value;
        if (valueDisplay) {
          valueDisplay.textContent = value;
        }
      }
    }
  }
}
