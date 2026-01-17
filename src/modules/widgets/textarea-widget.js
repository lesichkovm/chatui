import { BaseWidget } from './base-widget.js';

/**
 * Textarea Widget
 * Renders a multi-line text input for longer responses
 */
export class TextareaWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid textarea widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'textarea') {
      const formContainer = document.createElement("div");
      formContainer.className = "widget-textarea";
      
      const textarea = document.createElement("textarea");
      textarea.className = "widget-textarea-element";
      textarea.placeholder = this.widgetData.placeholder || 'Enter your response...';
      textarea.rows = this.widgetData.rows || 4;
      textarea.setAttribute("data-widget-id", this.widgetId);
      
      if (this.widgetData.maxLength) {
        textarea.maxLength = this.widgetData.maxLength;
      }
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-textarea-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      const handleSubmit = () => {
        const value = textarea.value.trim();
        if (value) {
          textarea.disabled = true;
          textarea.classList.add('widget-textarea-disabled');
          submitButton.disabled = true;
          submitButton.classList.add('widget-textarea-disabled');
          
          this.handleInteraction({
            optionId: 'textarea-submit',
            optionValue: value,
            optionText: value,
            widgetType: 'textarea'
          });
          textarea.value = '';
        }
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      textarea.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handleSubmit();
        }
      });
      
      formContainer.appendChild(textarea);
      formContainer.appendChild(submitButton);
      widgetContainer.appendChild(formContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'textarea';
  }
}
