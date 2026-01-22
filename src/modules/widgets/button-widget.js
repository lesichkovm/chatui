import { BaseWidget } from './base-widget.js';

/**
 * Button Widget (Composable)
 * A standalone button widget that can be used in containers or standalone
 * Extends BaseWidget to provide button-based interaction
 */
export class ButtonWidget extends BaseWidget {
  /**
   * Create the DOM element for the button widget
   * @returns {HTMLElement|Comment} Button element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid button widget data');
    }

    const button = document.createElement("button");
    button.className = "widget-button";
    
    // Apply variant styling
    const variant = this.widgetData.props?.variant || 'primary';
    const size = this.widgetData.props?.size || 'medium';
    
    button.classList.add(`variant-${variant}`);
    button.classList.add(`size-${size}`);
    
    // Set button text
    button.textContent = this.widgetData.props?.label || 'Button';
    
    // Set button value if provided
    if (this.widgetData.props?.value) {
      button.setAttribute("data-value", this.widgetData.props.value);
    }
    
    // Set disabled state
    if (this.widgetData.props?.disabled) {
      button.disabled = true;
      button.classList.add('widget-button-disabled');
    }
    
    // Add click handler
    button.addEventListener("click", () => {
      if (!button.disabled) {
        // Disable button after click if specified
        if (this.widgetData.props?.disableOnClick !== false) {
          button.disabled = true;
          button.classList.add('widget-button-disabled');
        }
        
        this.handleInteraction({
          value: this.widgetData.props?.value || this.widgetData.props?.label,
          label: this.widgetData.props?.label,
          widgetType: 'button'
        });
      }
    });
    
    // Apply custom styles if provided
    if (this.widgetData.props?.style) {
      Object.assign(button.style, this.widgetData.props.style);
    }
    
    return button;
  }

  /**
   * Validate button widget data structure
   * @returns {boolean} True if data contains required properties for button widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'button' && 
           this.widgetData.props &&
           typeof this.widgetData.props.label === 'string';
  }
}
