import { BaseWidget } from './base-widget.js';

/**
 * Buttons Widget (Composable)
 * A container widget that holds multiple button widgets
 * Uses the new composable system with Button widgets as children
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

    const container = document.createElement('div');
    container.className = 'widget-buttons-container';
    
    const props = this.widgetData.props || {};
    const layout = props.layout || 'vertical';
    const gap = props.gap || 'small';
    const alignment = props.alignment || 'start';
    
    // Apply layout styles
    container.style.display = 'flex';
    
    if (layout === 'horizontal') {
      container.style.flexDirection = 'row';
    } else {
      container.style.flexDirection = 'column';
    }
    
    // Set gap
    const gapSize = this.getGapSize(gap);
    container.style.gap = gapSize;
    
    // Set alignment
    if (layout === 'horizontal') {
      if (alignment === 'center') container.style.justifyContent = 'center';
      else if (alignment === 'end') container.style.justifyContent = 'flex-end';
      else if (alignment === 'space-between') container.style.justifyContent = 'space-between';
      else if (alignment === 'space-around') container.style.justifyContent = 'space-around';
      else container.style.justifyContent = 'flex-start';
      
      // Vertical alignment
      if (props.verticalAlignment === 'center') container.style.alignItems = 'center';
      else if (props.verticalAlignment === 'end') container.style.alignItems = 'flex-end';
      else if (props.verticalAlignment === 'stretch') container.style.alignItems = 'stretch';
      else container.style.alignItems = 'center';
    } else {
      // Vertical layout
      if (alignment === 'center') container.style.justifyContent = 'center';
      else if (alignment === 'end') container.style.justifyContent = 'flex-end';
      else if (alignment === 'space-between') container.style.justifyContent = 'space-between';
      else if (alignment === 'space-around') container.style.justifyContent = 'space-around';
      else container.style.justifyContent = 'flex-start';
      
      // Horizontal alignment
      if (props.horizontalAlignment === 'center') container.style.alignItems = 'center';
      else if (props.horizontalAlignment === 'end') container.style.alignItems = 'flex-end';
      else if (props.horizontalAlignment === 'stretch') container.style.alignItems = 'stretch';
      else container.style.alignItems = 'stretch';
    }
    
    // Create buttons from options
    const options = props.options || [];
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'widget-button';
      
      // Apply variant and size
      const variant = option.variant || props.variant || 'primary';
      const size = option.size || props.size || 'medium';
      
      button.classList.add(`variant-${variant}`);
      button.classList.add(`size-${size}`);
      
      // Set button text and value
      button.textContent = option.text || option.label || 'Button';
      button.setAttribute('data-option-id', option.id);
      button.setAttribute('data-option-value', option.value || option.id);
      
      // Set disabled state
      if (option.disabled || props.disabled) {
        button.disabled = true;
        button.classList.add('widget-button-disabled');
      }
      
      // Add click handler
      button.addEventListener('click', () => {
        if (!button.disabled) {
          // Disable all buttons in this widget after one is clicked if specified
          if (props.disableOnClick !== false) {
            const allButtons = container.querySelectorAll('.widget-button');
            allButtons.forEach(btn => {
              btn.disabled = true;
              btn.classList.add('widget-button-disabled');
            });
          }
          
          this.handleInteraction({
            optionId: option.id,
            optionValue: option.value || option.id,
            optionText: option.text || option.label,
            widgetType: 'buttons'
          });
        }
      });
      
      // Apply custom styles if provided
      if (option.style) {
        Object.assign(button.style, option.style);
      } else if (props.buttonStyle) {
        Object.assign(button.style, props.buttonStyle);
      }
      
      container.appendChild(button);
    });
    
    // Apply container custom styles if provided
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    return container;
  }

  /**
   * Convert gap size to CSS value
   * @private
   * @param {string} gap - Gap size identifier
   * @returns {string} CSS gap value
   */
  getGapSize(gap) {
    const gapMap = {
      'none': '0',
      'xs': '4px',
      'small': '8px',
      'medium': '16px',
      'large': '24px',
      'xl': '32px',
      'xxl': '48px'
    };
    
    return gapMap[gap] || gapMap['medium'];
  }

  /**
   * Validate buttons widget data structure
   * @returns {boolean} True if data contains required properties for buttons widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'buttons' && 
           this.widgetData.props &&
           Array.isArray(this.widgetData.props.options) &&
           this.widgetData.props.options.length > 0;
  }
}
