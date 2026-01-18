import { BaseWidget } from './base-widget.js';

/**
 * Toggle Widget
 * Renders an on/off switch for binary choices
 * Extends BaseWidget to provide toggle-based interaction
 */
export class ToggleWidget extends BaseWidget {
  /**
   * Create the DOM element for the toggle widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid toggle widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'toggle') {
      const toggleContainer = document.createElement("div");
      toggleContainer.className = "widget-toggle";
      
      const label = document.createElement("label");
      label.className = "widget-toggle-label";
      label.textContent = this.widgetData.label || 'Enable';
      
      const toggleWrapper = document.createElement("div");
      toggleWrapper.className = "widget-toggle-wrapper";
      
      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.className = "widget-toggle-input";
      toggle.setAttribute("data-widget-id", this.widgetId);
      
      if (this.widgetData.defaultValue === true) {
        toggle.checked = true;
      }
      
      const toggleSlider = document.createElement("span");
      toggleSlider.className = "widget-toggle-slider";
      
      // Add click handler to slider to toggle the checkbox
      toggleSlider.addEventListener("click", () => {
        toggle.checked = !toggle.checked;
      });
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-toggle-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      const handleSubmit = () => {
        const value = toggle.checked;
        
        toggle.disabled = true;
        toggle.classList.add('widget-toggle-disabled');
        submitButton.disabled = true;
        submitButton.classList.add('widget-toggle-disabled');
        
        this.handleInteraction({
          optionId: 'toggle-submit',
          optionValue: value,
          optionText: value ? 'enabled' : 'disabled',
          widgetType: 'toggle'
        });
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      toggleWrapper.appendChild(toggle);
      toggleWrapper.appendChild(toggleSlider);
      toggleContainer.appendChild(label);
      toggleContainer.appendChild(toggleWrapper);
      toggleContainer.appendChild(submitButton);
      widgetContainer.appendChild(toggleContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'toggle';
  }
}
