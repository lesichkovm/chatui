import { BaseWidget } from './base-widget.js';

/**
 * Radio Widget (Composable)
 * A standalone radio button widget for single selection
 * Can be used in containers or standalone
 */
export class RadioWidget extends BaseWidget {
  /**
   * Create the DOM element for the radio widget
   * @returns {HTMLElement|Comment} Radio container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid radio widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-radio-container';
    
    const props = this.widgetData.props || {};
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const layout = props.layout || 'vertical';
    const radioName = `radio-${this.widgetId}`;
    
    // Create radio options container
    const radioContainer = document.createElement('div');
    radioContainer.className = 'widget-radio-options';
    
    // Apply layout
    if (layout === 'horizontal') {
      radioContainer.style.display = 'flex';
      radioContainer.style.flexWrap = 'wrap';
      radioContainer.style.gap = '12px';
    } else {
      radioContainer.style.display = 'flex';
      radioContainer.style.flexDirection = 'column';
      radioContainer.style.gap = '8px';
    }
    
    // Create radio buttons
    const options = props.options || [];
    options.forEach((option, index) => {
      const radioWrapper = document.createElement('div');
      radioWrapper.className = 'widget-radio-item';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.className = 'widget-radio';
      radio.name = radioName;
      radio.id = `radio-${this.widgetId}-${option.id}`;
      radio.value = option.value || option.id;
      radio.setAttribute('data-option-id', option.id);
      
      if (option.checked) {
        radio.checked = true;
      }
      
      if (props.disabled || option.disabled) {
        radio.disabled = true;
        radio.classList.add('widget-radio-disabled');
      }
      
      const label = document.createElement('label');
      label.className = 'widget-radio-label';
      label.htmlFor = `radio-${this.widgetId}-${option.id}`;
      label.textContent = option.text || option.label;
      
      radioWrapper.appendChild(radio);
      radioWrapper.appendChild(label);
      radioContainer.appendChild(radioWrapper);
    });
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'widget-radio-submit';
    submitButton.textContent = buttonText;
    submitButton.classList.add(`variant-${variant}`);
    submitButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      submitButton.disabled = true;
      submitButton.classList.add('widget-radio-disabled');
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!submitButton.disabled) {
        const selectedRadio = radioContainer.querySelector('.widget-radio:checked');
        
        if (selectedRadio) {
          const optionId = selectedRadio.getAttribute('data-option-id');
          const optionData = options.find(opt => opt.id === optionId);
          
          if (optionData) {
            // Disable all radios and submit button if specified
            if (props.disableOnSubmit !== false) {
              const allRadios = radioContainer.querySelectorAll('.widget-radio');
              allRadios.forEach(radio => {
                radio.disabled = true;
                radio.classList.add('widget-radio-disabled');
              });
              submitButton.disabled = true;
              submitButton.classList.add('widget-radio-disabled');
            }
            
            this.handleInteraction({
              selectedOption: {
                id: optionData.id,
                value: optionData.value || optionData.id,
                text: optionData.text || optionData.label
              },
              widgetType: 'radio'
            });
          }
        }
      }
    };
    
    // Add event listener
    submitButton.addEventListener('click', handleSubmit);
    
    // Apply custom styles if provided
    if (props.optionsStyle) {
      Object.assign(radioContainer.style, props.optionsStyle);
    }
    
    if (props.buttonStyle) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    container.appendChild(radioContainer);
    container.appendChild(submitButton);
    
    return container;
  }

  /**
   * Validate radio widget data structure
   * @returns {boolean} True if data contains required properties for radio widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'radio' && 
           this.widgetData.props &&
           Array.isArray(this.widgetData.props.options) &&
           this.widgetData.props.options.length > 0;
  }
}
