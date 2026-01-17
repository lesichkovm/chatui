import { BaseWidget } from './base-widget.js';

/**
 * Slider Widget
 * Renders a numeric range slider for selecting values
 */
export class SliderWidget extends BaseWidget {
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid slider widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'slider') {
      const sliderContainer = document.createElement("div");
      sliderContainer.className = "widget-slider";
      
      const label = document.createElement("label");
      label.className = "widget-slider-label";
      label.textContent = this.widgetData.label || 'Select a value';
      
      const sliderWrapper = document.createElement("div");
      sliderWrapper.className = "widget-slider-wrapper";
      
      const slider = document.createElement("input");
      slider.type = "range";
      slider.className = "widget-slider-element";
      slider.min = this.widgetData.min || 0;
      slider.max = this.widgetData.max || 100;
      slider.step = this.widgetData.step || 1;
      slider.value = this.widgetData.defaultValue || Math.floor((slider.min + slider.max) / 2);
      slider.setAttribute("data-widget-id", this.widgetId);
      
      const valueDisplay = document.createElement("div");
      valueDisplay.className = "widget-slider-value";
      valueDisplay.textContent = slider.value;
      
      const submitButton = document.createElement("button");
      submitButton.className = "widget-slider-submit";
      submitButton.textContent = this.widgetData.buttonText || 'Submit';
      
      slider.addEventListener("input", () => {
        valueDisplay.textContent = slider.value;
      });
      
      const handleSubmit = () => {
        const value = parseFloat(slider.value);
        
        slider.disabled = true;
        slider.classList.add('widget-slider-disabled');
        submitButton.disabled = true;
        submitButton.classList.add('widget-slider-disabled');
        
        this.handleInteraction({
          optionId: 'slider-submit',
          optionValue: value,
          optionText: value.toString(),
          widgetType: 'slider'
        });
      };
      
      submitButton.addEventListener("click", handleSubmit);
      
      sliderWrapper.appendChild(slider);
      sliderWrapper.appendChild(valueDisplay);
      sliderContainer.appendChild(label);
      sliderContainer.appendChild(sliderWrapper);
      sliderContainer.appendChild(submitButton);
      widgetContainer.appendChild(sliderContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'slider' &&
           typeof this.widgetData.min === 'number' &&
           typeof this.widgetData.max === 'number' &&
           this.widgetData.max > this.widgetData.min;
  }
}
