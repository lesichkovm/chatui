import { BaseWidget } from './base-widget.js';

/**
 * Color Picker Widget (Composable)
 * A standalone color selection widget with preset colors
 * Can be used in containers or standalone
 */
export class ColorPickerWidget extends BaseWidget {
  /**
   * Create the DOM element for the color picker widget
   * @returns {HTMLElement|Comment} Color picker container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid color picker widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-color-picker-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Select a color';
    const buttonText = props.buttonText || 'Submit';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const defaultColor = props.defaultColor || '#000000';
    const presetColors = props.presetColors || [];
    const showHex = props.showHex !== false;
    const showPresets = props.showPresets !== false && presetColors.length > 0;
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.className = 'widget-color-picker-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create color wrapper
    const colorWrapper = document.createElement('div');
    colorWrapper.className = 'widget-color-wrapper';
    colorWrapper.classList.add(`variant-${variant}`);
    colorWrapper.classList.add(`size-${size}`);
    
    // Create color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'widget-color-input';
    colorInput.value = defaultColor;
    
    if (props.disabled) {
      colorInput.disabled = true;
      colorInput.classList.add('widget-color-picker-disabled');
    }
    
    // Create color display
    const colorDisplay = document.createElement('div');
    colorDisplay.className = 'widget-color-display';
    colorDisplay.style.backgroundColor = defaultColor;
    
    if (showHex) {
      colorDisplay.textContent = defaultColor.toUpperCase();
    }
    
    // Create preset colors container
    let presetContainer = null;
    if (showPresets) {
      presetContainer = document.createElement('div');
      presetContainer.className = 'widget-color-presets';
      presetContainer.classList.add(`variant-${variant}`);
      presetContainer.classList.add(`size-${size}`);
      
      presetColors.forEach(color => {
        const preset = document.createElement('button');
        preset.className = 'widget-color-preset';
        preset.style.backgroundColor = color;
        preset.setAttribute('data-color', color);
        preset.setAttribute('aria-label', `Select color ${color}`);
        
        if (props.disabled) {
          preset.disabled = true;
          preset.classList.add('widget-color-picker-disabled');
        }
        
        preset.addEventListener('click', () => {
          if (!props.disabled && !colorInput.disabled) {
            colorInput.value = color;
            colorDisplay.style.backgroundColor = color;
            if (showHex) {
              colorDisplay.textContent = color.toUpperCase();
            }
            
            // Trigger color change event if needed
            if (props.onColorChange) {
              this.handleInteraction({
                action: 'colorChange',
                color: color,
                hex: color.toUpperCase(),
                widgetType: 'color'
              });
            }
          }
        });
        
        presetContainer.appendChild(preset);
      });
    }
    
    // Update color display when input changes
    colorInput.addEventListener('input', () => {
      colorDisplay.style.backgroundColor = colorInput.value;
      if (showHex) {
        colorDisplay.textContent = colorInput.value.toUpperCase();
      }
    });
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.className = 'widget-color-picker-submit';
    submitButton.textContent = buttonText;
    submitButton.classList.add(`variant-${variant}`);
    submitButton.classList.add(`size-${size}`);
    
    if (props.disabled) {
      submitButton.disabled = true;
      submitButton.classList.add('widget-color-picker-disabled');
    }
    
    // Handle submission
    const handleSubmit = () => {
      if (!submitButton.disabled && !colorInput.disabled) {
        const color = colorInput.value;
        
        // Disable color input and submit button if specified
        if (props.disableOnSubmit !== false) {
          colorInput.disabled = true;
          colorInput.classList.add('widget-color-picker-disabled');
          submitButton.disabled = true;
          submitButton.classList.add('widget-color-picker-disabled');
        }
        
        this.handleInteraction({
          action: 'submit',
          color: color,
          hex: color.toUpperCase(),
          rgb: this.hexToRgb(color),
          widgetType: 'color'
        });
      }
    };
    
    submitButton.addEventListener('click', handleSubmit);
    
    // Add keyboard support
    colorInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    });
    
    // Apply custom styles if provided
    if (props.inputStyle) {
      Object.assign(colorInput.style, props.inputStyle);
    }
    
    if (props.displayStyle) {
      Object.assign(colorDisplay.style, props.displayStyle);
    }
    
    if (props.presetStyle && presetContainer) {
      Object.assign(presetContainer.style, props.presetStyle);
    }
    
    if (props.buttonStyle) {
      Object.assign(submitButton.style, props.buttonStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    colorWrapper.appendChild(colorInput);
    colorWrapper.appendChild(colorDisplay);
    
    container.appendChild(labelElement);
    container.appendChild(colorWrapper);
    
    if (presetContainer) {
      container.appendChild(presetContainer);
    }
    
    container.appendChild(submitButton);
    
    return container;
  }

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color value
   * @returns {Object} RGB object with r, g, b values
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Validate color picker widget data structure
   * @returns {boolean} True if data contains required properties for color picker widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'color';
  }
}
