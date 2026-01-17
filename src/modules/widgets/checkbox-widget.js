import { BaseWidget } from './base-widget.js';

/**
 * Checkbox Widget
 * Renders multiple checkboxes for multi-select options
 */
export class CheckboxWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid checkbox widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'checkbox' && this.widgetData.options) {
      const checkboxContainer = document.createElement("div");
      checkboxContainer.className = "widget-checkbox";
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-checkbox-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      this.widgetData.options.forEach(option => {
        const checkboxWrapper = document.createElement("div");
        checkboxWrapper.className = "widget-checkbox-item";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "widget-checkbox-element";
        checkbox.id = `checkbox-${this.widgetId}-${option.id}`;
        checkbox.value = option.value;
        checkbox.setAttribute("data-widget-id", this.widgetId);
        checkbox.setAttribute("data-option-id", option.id);
        
        if (option.checked) {
          checkbox.checked = true;
        }
        
        const label = document.createElement("label");
        label.className = "widget-checkbox-label";
        label.htmlFor = `checkbox-${this.widgetId}-${option.id}`;
        label.textContent = option.text;
        
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        checkboxContainer.appendChild(checkboxWrapper);
      });
      
      const handleSubmit = () => {
        const checkboxes = checkboxContainer.querySelectorAll('.widget-checkbox-element');
        const selectedOptions = [];
        
        checkboxes.forEach(checkbox => {
          if (checkbox.checked) {
            const optionId = checkbox.getAttribute('data-option-id');
            const optionData = this.widgetData.options.find(opt => opt.id === optionId);
            if (optionData) {
              selectedOptions.push({
                optionId: optionData.id,
                optionValue: optionData.value,
                optionText: optionData.text
              });
            }
          }
        });
        
        if (selectedOptions.length > 0 || this.widgetData.allowEmpty !== false) {
          const allCheckboxes = checkboxContainer.querySelectorAll('.widget-checkbox-element');
          allCheckboxes.forEach(cb => {
            cb.disabled = true;
            cb.classList.add('widget-checkbox-disabled');
          });
          submitButton.disabled = true;
          submitButton.classList.add('widget-checkbox-disabled');
          
          this.handleInteraction({
            selectedOptions,
            widgetType: 'checkbox'
          });
        }
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      checkboxContainer.appendChild(submitButton);
      widgetContainer.appendChild(checkboxContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'checkbox' && 
           Array.isArray(this.widgetData.options) &&
           this.widgetData.options.length > 0;
  }
}
