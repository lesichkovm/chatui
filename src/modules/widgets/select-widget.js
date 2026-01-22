import { BaseWidget } from './base-widget.js';
import { applyMigrationConfig, getMigrationWarning } from '../../config/widget-defaults.js';

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

    // Apply migration configuration
    const widgetData = applyMigrationConfig(this.widgetData);
    
    // Check for migration warnings
    const warning = getMigrationWarning(widgetData);
    if (warning) {
      console.warn(warning);
    }

    const container = document.createElement('div');
    container.className = 'widget-select-container';
    
    const select = document.createElement('select');
    select.className = 'widget-select';
    
    // Apply variant styling
    const variant = widgetData.props?.variant || 'default';
    const size = widgetData.props?.size || 'medium';
    const disableOnSelect = widgetData.props?.disableOnSelect || false; // Allow deferring auto-submission
    
    select.classList.add(`variant-${variant}`);
    select.classList.add(`size-${size}`);
    
    // Add placeholder option if specified
    if (widgetData.props?.placeholder) {
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = widgetData.props.placeholder;
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      select.appendChild(placeholderOption);
    }
    
    // Add options
    const options = widgetData.props?.options || [];
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
        
        // Emit value change event
        this.emitValueChange(optionData?.value || optionData?.id || '');
        
        if (optionData) {
          // Disable the select element after selection if specified
          if (this.widgetData.props?.disableOnSelect !== false && !disableOnSelect) {
            select.disabled = true;
            select.classList.add('widget-select-disabled');
          }
          
          // Only handle interaction if not deferring
          if (!disableOnSelect) {
            this.handleInteraction({
              optionId: optionData.id,
              optionValue: optionData.value || optionData.id,
              optionText: optionData.text || optionData.label,
              widgetType: 'select'
            });
          }
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

  /**
   * Get the current value of the select widget
   * @returns {string|null} Selected option value or null if none selected
   */
  getValue() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const select = container.querySelector('.widget-select');
      return select ? select.value : null;
    }
    return null;
  }

  /**
   * Set the value of the select widget
   * @param {string} value - Value to select
   */
  setValue(value) {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const select = container.querySelector('.widget-select');
      if (select) {
        select.value = value;
      }
    }
  }

  /**
   * Trigger interaction manually (useful when disableOnSelect is true)
   */
  submit() {
    const container = this.element || document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const select = container.querySelector('.widget-select');
      if (select && select.value) {
        const selectedOption = select.options[select.selectedIndex];
        const options = this.widgetData.props?.options || [];
        const optionData = options.find(opt => opt.id === selectedOption.getAttribute('data-option-id'));
        
        if (optionData) {
          this.handleInteraction({
            optionId: optionData.id,
            optionValue: optionData.value || optionData.id,
            optionText: optionData.text || optionData.label,
            widgetType: 'select'
          });
        }
      }
    }
  }
}
