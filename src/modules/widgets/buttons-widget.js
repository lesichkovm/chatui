import { BaseWidget } from './base-widget.js';
import { WIDGET_TYPES } from './widget-types.js';

/**
 * Buttons Widget
 * Renders clickable button options for user selection
 * Extends BaseWidget to provide button-based interaction
 */
export class ButtonsWidget extends BaseWidget {
  /**
   * Create the DOM element for the buttons widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid buttons widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === WIDGET_TYPES.BUTTONS && this.widgetData.options) {
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
          // Disable all buttons in this widget after one is clicked
          const allButtons = buttonsContainer.querySelectorAll('.widget-button');
          allButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('widget-button-disabled');
          });
          
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

  /**
   * Validate buttons widget data structure
   * @returns {boolean} True if data contains required properties for buttons widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === WIDGET_TYPES.BUTTONS && 
           Array.isArray(this.widgetData.options) &&
           this.widgetData.options.length > 0;
  }
}
