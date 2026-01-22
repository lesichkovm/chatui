import { BaseWidget } from './base-widget.js';

/**
 * Select Widget (Composable)
 * A standalone select dropdown widget that can be used in containers or standalone
 * Extends BaseWidget to provide dropdown-based interaction
 */
export class SelectWidget extends BaseWidget {
  /**
   * Create the DOM element for the select widget
   * @returns {HTMLElement|Comment} Select element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid select widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-select-container';
    
    const select = document.createElement('select');
    select.className = 'widget-select';
    
    // Apply variant styling
    const variant = this.widgetData.props?.variant || 'default';
    const size = this.widgetData.props?.size || 'medium';
    
    select.classList.add(`variant-${variant}`);
    select.classList.add(`size-${size}`);
    
    // Add placeholder option if specified
    if (this.widgetData.props?.placeholder) {
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = this.widgetData.props.placeholder;
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      select.appendChild(placeholderOption);
    }
    
    // Add options
    const options = this.widgetData.props?.options || [];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value || option.id;
      optionElement.textContent = option.text || option.label;
      optionElement.setAttribute('data-option-id', option.id);
      
      if (option.disabled) {
        optionElement.disabled = true;
      }
      
      select.appendChild(optionElement);
    });
    
    // Set disabled state
    if (this.widgetData.props?.disabled) {
      select.disabled = true;
      select.classList.add('widget-select-disabled');
    }
    
    // Add change handler
    select.addEventListener('change', () => {
      if (!select.disabled) {
        const selectedOption = select.options[select.selectedIndex];
        const optionData = options.find(opt => opt.id === selectedOption.getAttribute('data-option-id'));
        
        if (optionData) {
          // Disable the select element after selection if specified
          if (this.widgetData.props?.disableOnSelect !== false) {
            select.disabled = true;
            select.classList.add('widget-select-disabled');
          }
          
          this.handleInteraction({
            optionId: optionData.id,
            optionValue: optionData.value || optionData.id,
            optionText: optionData.text || optionData.label,
            widgetType: 'select'
          });
        }
      }
    });
    
    // Apply custom styles if provided
    if (this.widgetData.props?.style) {
      Object.assign(select.style, this.widgetData.props.style);
    }
    
    container.appendChild(select);
    return container;
  }

  /**
   * Validate select widget data structure
   * @returns {boolean} True if data contains required properties for select widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'select' && 
           this.widgetData.props &&
           Array.isArray(this.widgetData.props.options) &&
           this.widgetData.props.options.length > 0;
  }
}
