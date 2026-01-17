import { BaseWidget } from './base-widget.js';

/**
 * Radio Widget
 * Renders radio buttons for single selection from multiple options
 * Extends BaseWidget to provide radio button-based interaction
 */
export class RadioWidget extends BaseWidget {
  /**
   * Create the DOM element for the radio widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid radio widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'radio' && this.widgetData.options) {
      const radioContainer = document.createElement("div");
      radioContainer.className = "widget-radio";
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-radio-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      this.widgetData.options.forEach(option => {
        const radioWrapper = document.createElement("div");
        radioWrapper.className = "widget-radio-item";
        
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `radio-${this.widgetId}`;
        radio.className = "widget-radio-element";
        radio.id = `radio-${this.widgetId}-${option.id}`;
        radio.value = option.value;
        radio.setAttribute("data-widget-id", this.widgetId);
        radio.setAttribute("data-option-id", option.id);
        
        if (option.checked) {
          radio.checked = true;
        }
        
        const label = document.createElement("label");
        label.className = "widget-radio-label";
        label.htmlFor = `radio-${this.widgetId}-${option.id}`;
        label.textContent = option.text;
        
        radioWrapper.appendChild(radio);
        radioWrapper.appendChild(label);
        radioContainer.appendChild(radioWrapper);
      });
      
      const handleSubmit = () => {
        const selectedRadio = radioContainer.querySelector('.widget-radio-element:checked');
        
        if (selectedRadio) {
          const optionId = selectedRadio.getAttribute('data-option-id');
          const optionData = this.widgetData.options.find(opt => opt.id === optionId);
          
          if (optionData) {
            const allRadios = radioContainer.querySelectorAll('.widget-radio-element');
            allRadios.forEach(r => {
              r.disabled = true;
              r.classList.add('widget-radio-disabled');
            });
            submitButton.disabled = true;
            submitButton.classList.add('widget-radio-disabled');
            
            this.handleInteraction({
              optionId: optionData.id,
              optionValue: optionData.value,
              optionText: optionData.text,
              widgetType: 'radio'
            });
          }
        }
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      radioContainer.appendChild(submitButton);
      widgetContainer.appendChild(radioContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'radio' && 
           Array.isArray(this.widgetData.options) &&
           this.widgetData.options.length > 0;
  }
}
