import { BaseWidget } from './base-widget.js';
import { LEGACY_WIDGET_TYPES } from './widget-types.js';

/**
 * Color Picker Widget
 * Renders a color selection for visual preferences
 * Extends BaseWidget to provide color selection interaction
 */
export class ColorPickerWidget extends BaseWidget {
  /**
   * Create the DOM element for the color picker widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid color picker widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === LEGACY_WIDGET_TYPES.COLOR) {
      const colorContainer = document.createElement("div");
      colorContainer.className = "widget-color-picker";
      
      const label = document.createElement("label");
      label.className = "widget-color-label";
      label.textContent = this.widgetData.label || 'Select a color';
      
      const colorWrapper = document.createElement("div");
      colorWrapper.className = "widget-color-wrapper";
      
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.className = "widget-color-input";
      colorInput.setAttribute("data-widget-id", this.widgetId);
      
      if (this.widgetData.defaultColor) {
        colorInput.value = this.widgetData.defaultColor;
      }
      
      const colorDisplay = document.createElement("div");
      colorDisplay.className = "widget-color-display";
      colorDisplay.style.backgroundColor = colorInput.value;
      colorDisplay.textContent = colorInput.value.toUpperCase();
      
      const presetContainer = document.createElement("div");
      presetContainer.className = "widget-color-presets";
      
      if (this.widgetData.presetColors && this.widgetData.presetColors.length > 0) {
        this.widgetData.presetColors.forEach(color => {
          const preset = document.createElement("button");
          preset.className = "widget-color-preset";
          preset.style.backgroundColor = color;
          preset.setAttribute("data-color", color);
          
          preset.addEventListener("click", () => {
            colorInput.value = color;
            colorDisplay.style.backgroundColor = color;
            colorDisplay.textContent = color.toUpperCase();
          });
          
          presetContainer.appendChild(preset);
        });
      }
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-color-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      colorInput.addEventListener("input", () => {
        colorDisplay.style.backgroundColor = colorInput.value;
        colorDisplay.textContent = colorInput.value.toUpperCase();
      });
      
      const handleSubmit = () => {
        const value = colorInput.value;
        
        colorInput.disabled = true;
        colorInput.classList.add('widget-color-disabled');
        submitButton.disabled = true;
        submitButton.classList.add('widget-color-disabled');
        
        this.handleInteraction({
          optionId: 'color-submit',
          optionValue: value,
          optionText: value.toUpperCase(),
          widgetType: 'color'
        });
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      colorWrapper.appendChild(colorInput);
      colorWrapper.appendChild(colorDisplay);
      colorContainer.appendChild(label);
      colorContainer.appendChild(colorWrapper);
      if (this.widgetData.presetColors && this.widgetData.presetColors.length > 0) {
        colorContainer.appendChild(presetContainer);
      }
      colorContainer.appendChild(submitButton);
      widgetContainer.appendChild(colorContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === LEGACY_WIDGET_TYPES.COLOR;
  }
}
