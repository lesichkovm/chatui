import { BaseWidget } from './base-widget.js';

/**
 * Select Dropdown Widget
 * Renders a dropdown select menu
 */
export class SelectWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid select widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'select' && this.widgetData.options) {
      const selectContainer = document.createElement("div");
      selectContainer.className = "widget-select";
      
      const select = document.createElement("select");
      select.className = "widget-select-element";
      select.setAttribute("data-widget-id", this.widgetId);
      
      // Add default option if specified
      if (this.widgetData.placeholder) {
        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent = this.widgetData.placeholder;
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        select.appendChild(placeholderOption);
      }
      
      this.widgetData.options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        optionElement.setAttribute("data-option-id", option.id);
        select.appendChild(optionElement);
      });
      
      select.addEventListener("change", () => {
        const selectedOption = select.options[select.selectedIndex];
        const optionData = this.widgetData.options.find(opt => opt.id === selectedOption.getAttribute('data-option-id'));
        
        if (optionData) {
          // Disable the select element after selection
          select.disabled = true;
          select.classList.add('widget-select-disabled');
          
          this.handleInteraction({
            optionId: optionData.id,
            optionValue: optionData.value,
            optionText: optionData.text,
            widgetType: 'select'
          });
        }
      });
      
      selectContainer.appendChild(select);
      widgetContainer.appendChild(selectContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'select' && 
           Array.isArray(this.widgetData.options) &&
           this.widgetData.options.length > 0;
  }
}
