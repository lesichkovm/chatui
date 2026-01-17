import { BaseWidget } from './base-widget.js';

/**
 * Input Form Widget
 * Renders a simple input form with a submit button
 */
export class InputWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid input widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'input') {
      const formContainer = document.createElement("div");
      formContainer.className = "widget-input";
      
      const input = document.createElement("input");
      input.type = this.widgetData.inputType || 'text';
      input.className = "widget-input-element";
      input.placeholder = this.widgetData.placeholder || 'Enter your response...';
      input.setAttribute("data-widget-id", this.widgetId);
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-input-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      const handleSubmit = () => {
        const value = input.value.trim();
        if (value) {
          // Disable both input and submit button after submission
          input.disabled = true;
          input.classList.add('widget-input-disabled');
          submitButton.disabled = true;
          submitButton.classList.add('widget-input-disabled');
          
          this.handleInteraction({
            optionId: 'input-submit',
            optionValue: value,
            optionText: value,
            widgetType: 'input'
          });
          input.value = '';
        }
      };
      
      submitButton.addEventListener("click", handleSubmit);
      input.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      });
      
      formContainer.appendChild(input);
      formContainer.appendChild(submitButton);
      widgetContainer.appendChild(formContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'input';
  }
}
