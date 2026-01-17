import { BaseWidget } from './base-widget.js';

/**
 * Date Widget
 * Renders a date picker for selecting dates
 * Extends BaseWidget to provide date selection interaction
 */
export class DateWidget extends BaseWidget {
  /**
   * Create the DOM element for the date widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid date widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'date') {
      const dateContainer = document.createElement("div");
      dateContainer.className = "widget-date";
      
      const label = document.createElement("label");
      label.className = "widget-date-label";
      label.textContent = this.widgetData.label || 'Select a date';
      
      const dateInput = document.createElement("input");
      dateInput.type = "date";
      dateInput.className = "widget-date-element";
      dateInput.setAttribute("data-widget-id", this.widgetId);
      
      if (this.widgetData.minDate) {
        dateInput.min = this.widgetData.minDate;
      }
      
      if (this.widgetData.maxDate) {
        dateInput.max = this.widgetData.maxDate;
      }
      
      if (this.widgetData.placeholder) {
        dateInput.placeholder = this.widgetData.placeholder;
      }
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-date-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      const handleSubmit = () => {
        const value = dateInput.value;
        
        if (value) {
          dateInput.disabled = true;
          dateInput.classList.add('widget-date-disabled');
          submitButton.disabled = true;
          submitButton.classList.add('widget-date-disabled');
          
          this.handleInteraction({
            optionId: 'date-submit',
            optionValue: value,
            optionText: value,
            widgetType: 'date'
          });
        }
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      dateInput.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      });
      
      dateContainer.appendChild(label);
      dateContainer.appendChild(dateInput);
      dateContainer.appendChild(submitButton);
      widgetContainer.appendChild(dateContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'date';
  }
}
