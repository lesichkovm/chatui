import { BaseWidget } from './base-widget.js';

/**
 * Buttons Widget
 * Renders clickable button options
 */
export class ButtonsWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid buttons widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'buttons' && this.widgetData.options) {
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "widget-buttons";
      
      this.widgetData.options.forEach(option => {
        const button = document.createElement("button");
        button.className = "widget-button";
        button.textContent = option.text;
        button.setAttribute("data-widget-id", this.widgetId);
        button.setAttribute("data-option-id", option.id);
        button.setAttribute("data-option-value", option.value);
        
        button.addEventListener("click", () => {
          this.handleInteraction({
            optionId: option.id,
            optionValue: option.value,
            optionText: option.text,
            widgetType: 'buttons'
          });
        });
        
        buttonsContainer.appendChild(button);
      });
      
      widgetContainer.appendChild(buttonsContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'buttons' && 
           Array.isArray(this.widgetData.options) &&
           this.widgetData.options.length > 0;
  }
}
