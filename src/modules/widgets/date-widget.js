import { BaseWidget } from './base-widget.js';

/**
 * Date Widget (Composable)
 * A standalone date picker widget for date selection
 * Can be used in containers or standalone
 */
export class DateWidget extends BaseWidget {
  /**
   * Create the DOM element for the date widget
   * @returns {HTMLElement|Comment} Date container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid date widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-date-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Select a date';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const inputType = props.inputType || 'date';
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.className = 'widget-date-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create date input
    const dateInput = document.createElement('input');
    dateInput.type = inputType;
    dateInput.className = 'widget-date-input';
    
    // Apply variant and size classes
    dateInput.classList.add(`variant-${variant}`);
    dateInput.classList.add(`size-${size}`);
    
    // Set date constraints
    if (props.minDate) dateInput.min = props.minDate;
    if (props.maxDate) dateInput.max = props.maxDate;
    if (props.defaultValue) dateInput.value = props.defaultValue;
    
    // Set disabled state
    if (props.disabled) {
      dateInput.disabled = true;
      dateInput.classList.add('widget-date-disabled');
    }
    
    // Create formatted date display
    let dateDisplay = null;
    if (props.showFormatted !== false && inputType === 'date') {
      dateDisplay = document.createElement('div');
      dateDisplay.className = 'widget-date-display';
      dateDisplay.classList.add(`variant-${variant}`);
      dateDisplay.classList.add(`size-${size}`);
      
      const updateDateDisplay = () => {
        if (dateInput.value) {
          const date = new Date(dateInput.value);
          dateDisplay.textContent = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } else {
          dateDisplay.textContent = '';
        }
      };
      
      dateInput.addEventListener('change', updateDateDisplay);
      updateDateDisplay(); // Initial display
    }
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'widget-date-submit';
    submitButton.textContent = buttonText;
    submitButton.classList.add(`variant-${variant}`);
    submitButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      submitButton.disabled = true;
      submitButton.classList.add('widget-date-disabled');
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!dateInput.disabled && !submitButton.disabled) {
        const value = dateInput.value;
        
        // Validate if required
        if (props.required && !value) {
          dateInput.classList.add('widget-date-error');
          return;
        }
        
        if (value || !props.required) {
          // Disable date input and submit button if specified
          if (props.disableOnSubmit !== false) {
            dateInput.disabled = true;
            dateInput.classList.add('widget-date-disabled');
            submitButton.disabled = true;
            submitButton.classList.add('widget-date-disabled');
          }
          
          // Format date for interaction
          let formattedValue = value;
          if (props.formatDate && value) {
            const date = new Date(value);
            formattedValue = date.toLocaleDateString(props.locale || 'en-US', props.formatOptions);
          }
          
          this.handleInteraction({
            value: value,
            formattedValue: formattedValue,
            inputType: inputType,
            widgetType: 'date'
          });
        }
      }
    };
    
    // Add event listeners
    submitButton.addEventListener('click', handleSubmit);
    dateInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    });
    
    // Clear error state on input
    dateInput.addEventListener('change', () => {
      dateInput.classList.remove('widget-date-error');
    });
    
    // Apply custom styles if provided
    if (props.inputStyle) {
      Object.assign(dateInput.style, props.inputStyle);
    }
    
    if (props.buttonStyle) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    container.appendChild(labelElement);
    container.appendChild(dateInput);
    if (dateDisplay) {
      container.appendChild(dateDisplay);
    }
    container.appendChild(submitButton);
    
    return container;
  }

  /**
   * Validate date widget data structure
   * @returns {boolean} True if data contains required properties for date widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'date';
  }
}
