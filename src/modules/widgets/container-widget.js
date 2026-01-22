import { BaseWidget } from './base-widget.js';

/**
 * Container Widget
 * A generic container widget that can hold other widgets in various layouts
 * Supports flex, grid, and custom layout systems
 * Can optionally operate in form mode for coordinating multi-widget submissions
 */
export class ContainerWidget extends BaseWidget {
  constructor(widgetData, widgetId) {
    super(widgetData, widgetId);
    this.formMode = false;
    this.childWidgets = new Map();
    this.setupFormListeners();
  }
  /**
   * Create the DOM element for the container widget
   * @returns {HTMLElement} The container DOM element
   */
  createElement() {
    const element = document.createElement('div');
    element.className = 'widget-container';
    element.setAttribute('data-widget-id', this.widgetId);
    
    const props = this.widgetData.props || {};
    const layout = props.layout || 'vertical';
    const gap = props.gap || 'medium';
    const alignment = props.alignment || 'start';
    
    // Enable form mode if specified
    if (props.formMode) {
      this.enableFormMode();
      element.classList.add('widget-form-mode');
    }
    
    // Apply layout system
    if (layout === 'flex' || layout === 'horizontal' || layout === 'vertical') {
      this.applyFlexLayout(element, layout, gap, alignment, props);
    } else if (layout === 'grid') {
      this.applyGridLayout(element, gap, alignment, props);
    } else {
      // Legacy layout support
      element.classList.add(`layout-${layout}`);
      element.classList.add(`gap-${gap}`);
      element.classList.add(`align-${alignment}`);
    }
    
    // Apply custom styles if provided
    if (props.style) {
      Object.assign(element.style, props.style);
    }
    
    // Store reference for later use
    this.element = element;
    
    return element;
  }

  /**
   * Apply flexbox layout properties
   * @private
   * @param {HTMLElement} element - Container element
   * @param {string} layout - Layout type
   * @param {string} gap - Gap size
   * @param {string} alignment - Alignment type
   * @param {Object} props - Additional properties
   */
  applyFlexLayout(element, layout, gap, alignment, props) {
    element.style.display = 'flex';
    
    // Set direction
    if (layout === 'horizontal') {
      element.style.flexDirection = 'row';
    } else {
      element.style.flexDirection = 'column';
    }
    
    // Set gap
    const gapSize = this.getGapSize(gap);
    element.style.gap = gapSize;
    
    // Set alignment
    if (layout === 'horizontal') {
      // Horizontal alignment (main axis)
      if (alignment === 'center') element.style.justifyContent = 'center';
      else if (alignment === 'end') element.style.justifyContent = 'flex-end';
      else if (alignment === 'space-between') element.style.justifyContent = 'space-between';
      else if (alignment === 'space-around') element.style.justifyContent = 'space-around';
      else element.style.justifyContent = 'flex-start';
      
      // Vertical alignment (cross axis)
      if (props.verticalAlignment === 'center') element.style.alignItems = 'center';
      else if (props.verticalAlignment === 'end') element.style.alignItems = 'flex-end';
      else if (props.verticalAlignment === 'stretch') element.style.alignItems = 'stretch';
      else element.style.alignItems = 'center';
    } else {
      // Vertical layout
      // Vertical alignment (main axis)
      if (alignment === 'center') element.style.justifyContent = 'center';
      else if (alignment === 'end') element.style.justifyContent = 'flex-end';
      else if (alignment === 'space-between') element.style.justifyContent = 'space-between';
      else if (alignment === 'space-around') element.style.justifyContent = 'space-around';
      else element.style.justifyContent = 'flex-start';
      
      // Horizontal alignment (cross axis)
      if (props.horizontalAlignment === 'center') element.style.alignItems = 'center';
      else if (props.horizontalAlignment === 'end') element.style.alignItems = 'flex-end';
      else if (props.horizontalAlignment === 'stretch') element.style.alignItems = 'stretch';
      else element.style.alignItems = 'stretch';
    }
    
    // Wrap behavior
    if (props.wrap === 'wrap') element.style.flexWrap = 'wrap';
    else if (props.wrap === 'nowrap') element.style.flexWrap = 'nowrap';
    
    // Flex distribution
    if (props.distribute === 'evenly') {
      element.style.justifyContent = 'space-evenly';
    }
  }

  /**
   * Apply grid layout properties
   * @private
   * @param {HTMLElement} element - Container element
   * @param {string} gap - Gap size
   * @param {string} alignment - Alignment type
   * @param {Object} props - Additional properties
   */
  applyGridLayout(element, gap, alignment, props) {
    element.style.display = 'grid';
    
    // Set gap
    const gapSize = this.getGapSize(gap);
    element.style.gap = gapSize;
    
    // Set grid template columns/rows
    if (props.columns) {
      if (typeof props.columns === 'number') {
        element.style.gridTemplateColumns = `repeat(${props.columns}, 1fr)`;
      } else {
        element.style.gridTemplateColumns = props.columns;
      }
    }
    
    if (props.rows) {
      if (typeof props.rows === 'number') {
        element.style.gridTemplateRows = `repeat(${props.rows}, 1fr)`;
      } else {
        element.style.gridTemplateRows = props.rows;
      }
    }
    
    // Auto-flow
    if (props.autoFlow) {
      element.style.gridAutoFlow = props.autoFlow;
    }
    
    // Alignment
    if (alignment === 'center') {
      element.style.justifyItems = 'center';
      element.style.alignItems = 'center';
    } else if (alignment === 'end') {
      element.style.justifyItems = 'end';
      element.style.alignItems = 'end';
    } else if (alignment === 'stretch') {
      element.style.justifyItems = 'stretch';
      element.style.alignItems = 'stretch';
    } else {
      element.style.justifyItems = 'start';
      element.style.alignItems = 'start';
    }
  }

  /**
   * Enable form mode for container
   */
  enableFormMode() {
    this.formMode = true;
  }

  /**
   * Setup form listeners for child widget interactions
   * @private
   */
  setupFormListeners() {
    // Listen for widget interactions from child widgets
    document.addEventListener('widgetInteraction', (event) => {
      const { widgetId, widgetType } = event.detail;
      
      // Check if this is a child widget and if it's a button/action widget
      if (this.isChildWidget(widgetId) && this.isActionWidget(widgetType)) {
        this.handleFormAction(event.detail);
      }
    });
  }

  /**
   * Check if a widget is a child of this container
   * @private
   * @param {string} widgetId - Widget ID to check
   * @returns {boolean} True if the widget is a child
   */
  isChildWidget(widgetId) {
    if (this.element) {
      const childElement = this.element.querySelector(`[data-widget-id="${widgetId}"]`);
      return childElement !== null;
    }
    return false;
  }

  /**
   * Check if a widget type is an action widget
   * @private
   * @param {string} widgetType - Widget type to check
   * @returns {boolean} True if the widget is an action widget
   */
  isActionWidget(widgetType) {
    return widgetType === 'buttons' || widgetType === 'button';
  }

  /**
   * Handle form action from child button widget
   * @private
   * @param {Object} actionData - Action data from the button widget
   */
  handleFormAction(actionData) {
    if (!this.formMode) return;
    
    const formData = this.collectFormValues();
    
    this.handleInteraction({
      action: actionData.optionId || actionData.action,
      actionData: actionData,
      formData: formData,
      widgetType: 'container-form'
    });
  }

  /**
   * Collect values from all child input widgets
   * @returns {Object} Form data object with widget values
   */
  collectFormValues() {
    const formData = {};
    
    if (this.element) {
      // Find all input-type child widgets
      const inputWidgets = this.element.querySelectorAll('[data-widget-id]');
      
      inputWidgets.forEach(widgetElement => {
        const widgetId = widgetElement.getAttribute('data-widget-id');
        
        // Try to get value using standard widget interface
        const value = this.getWidgetValue(widgetElement);
        if (value !== undefined) {
          formData[widgetId] = value;
        }
      });
    }
    
    return formData;
  }

  /**
   * Get value from a widget element
   * @private
   * @param {HTMLElement} widgetElement - Widget DOM element
   * @returns {*} Widget value or undefined if not found
   */
  getWidgetValue(widgetElement) {
    // Try different widget types and their value extraction methods
    
    // Input widgets
    const inputElement = widgetElement.querySelector('.widget-input-element');
    if (inputElement) return inputElement.value;
    
    // Textarea widgets
    const textareaElement = widgetElement.querySelector('.widget-textarea');
    if (textareaElement) return textareaElement.value;
    
    // Password widgets
    const passwordElement = widgetElement.querySelector('.widget-password-input');
    if (passwordElement) return passwordElement.value;
    
    // Date widgets
    const dateElement = widgetElement.querySelector('.widget-date-input');
    if (dateElement) return dateElement.value;
    
    // Select widgets
    const selectElement = widgetElement.querySelector('.widget-select');
    if (selectElement) return selectElement.value;
    
    // Checkbox widgets (multiple values)
    const checkedBoxes = widgetElement.querySelectorAll('.widget-checkbox:checked');
    if (checkedBoxes.length > 0) {
      const values = [];
      checkedBoxes.forEach(checkbox => values.push(checkbox.value));
      return values;
    }
    
    // Radio widgets (single value)
    const checkedRadio = widgetElement.querySelector('.widget-radio:checked');
    if (checkedRadio) return checkedRadio.value;
    
    // Slider widgets
    const sliderElement = widgetElement.querySelector('.widget-slider');
    if (sliderElement) return parseFloat(sliderElement.value);
    
    // Color picker widgets
    const colorInput = widgetElement.querySelector('.widget-color-input');
    if (colorInput) return colorInput.value;
    
    // Rating widgets
    const activeStars = widgetElement.querySelectorAll('.widget-rating-star.active');
    if (activeStars.length > 0) return activeStars.length;
    
    // Toggle widgets
    const toggleInput = widgetElement.querySelector('.widget-toggle-input');
    if (toggleInput) return toggleInput.checked;
    
    // Tags widgets
    const tagElements = widgetElement.querySelectorAll('.widget-tag');
    if (tagElements.length > 0) {
      const tags = [];
      tagElements.forEach(tagElement => {
        const text = tagElement.textContent.replace('×', '').trim();
        if (text) tags.push(text);
      });
      return tags;
    }
    
    return undefined;
  }

  /**
   * Get all form values (when in form mode)
   * @returns {Object} Current form values
   */
  getValues() {
    if (this.formMode) {
      return this.collectFormValues();
    }
    return {};
  }

  /**
   * Reset all form values (when in form mode)
   */
  reset() {
    if (!this.formMode || !this.element) return;
    
    // Reset input widgets
    const inputs = this.element.querySelectorAll('.widget-input-element, .widget-password-input, .widget-textarea, .widget-date-input');
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('widget-input-error', 'widget-password-error', 'widget-textarea-error', 'widget-date-error');
    });
    
    // Reset select widgets
    const selects = this.element.querySelectorAll('.widget-select');
    selects.forEach(select => {
      select.selectedIndex = 0;
      select.classList.remove('widget-select-error');
    });
    
    // Reset checkbox widgets
    const checkboxes = this.element.querySelectorAll('.widget-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      checkbox.disabled = false;
      checkbox.classList.remove('widget-checkbox-disabled');
    });
    
    // Reset radio widgets
    const radios = this.element.querySelectorAll('.widget-radio');
    radios.forEach(radio => {
      radio.checked = false;
      radio.disabled = false;
      radio.classList.remove('widget-radio-disabled');
    });
    
    // Reset other widgets as needed...
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
   * Get the container for child widgets
   * @returns {HTMLElement} The element that should contain child widgets
   */
  getChildrenContainer(element) {
    return element || this.element;
  }
}
