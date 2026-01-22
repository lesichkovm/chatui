import { BaseWidget } from './base-widget.js';

/**
 * Form Widget (Composable)
 * A specialized container widget that coordinates multi-widget form submissions
 * Collects values from child input widgets and handles form-level actions
 */
export class FormWidget extends BaseWidget {
  constructor(widgetData, widgetId) {
    super(widgetData, widgetId);
    this.childWidgets = new Map();
    this.formValues = new Map();
    this.setupChildWidgetListeners();
  }

  /**
   * Create the DOM element for the form widget
   * @returns {HTMLElement} The form DOM element
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid form widget data');
    }

    const formElement = document.createElement('div');
    formElement.className = 'widget-form-container';
    formElement.setAttribute('data-widget-id', this.widgetId);
    
    const props = this.widgetData.props || {};
    const layout = props.layout || 'vertical';
    const gap = props.gap || 'medium';
    const alignment = props.alignment || 'start';
    
    // Apply layout system (reuse ContainerWidget logic)
    this.applyLayout(formElement, layout, gap, alignment, props);
    
    // Apply custom styles if provided
    if (props.style) {
      Object.assign(formElement.style, props.style);
    }
    
    // Store reference for later use
    this.element = formElement;
    
    return formElement;
  }

  /**
   * Apply layout properties (reused from ContainerWidget)
   * @private
   * @param {HTMLElement} element - Container element
   * @param {string} layout - Layout type
   * @param {string} gap - Gap size
   * @param {string} alignment - Alignment type
   * @param {Object} props - Additional properties
   */
  applyLayout(element, layout, gap, alignment, props) {
    // Apply flexbox layout (similar to ContainerWidget)
    if (layout === 'flex' || layout === 'horizontal' || layout === 'vertical') {
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
        if (alignment === 'center') element.style.justifyContent = 'center';
        else if (alignment === 'end') element.style.justifyContent = 'flex-end';
        else if (alignment === 'space-between') element.style.justifyContent = 'space-between';
        else if (alignment === 'space-around') element.style.justifyContent = 'space-around';
        else element.style.justifyContent = 'flex-start';
        
        if (props.verticalAlignment === 'center') element.style.alignItems = 'center';
        else if (props.verticalAlignment === 'end') element.style.alignItems = 'flex-end';
        else if (props.verticalAlignment === 'stretch') element.style.alignItems = 'stretch';
        else element.style.alignItems = 'center';
      } else {
        if (alignment === 'center') element.style.justifyContent = 'center';
        else if (alignment === 'end') element.style.justifyContent = 'flex-end';
        else if (alignment === 'space-between') element.style.justifyContent = 'space-between';
        else if (alignment === 'space-around') element.style.justifyContent = 'space-around';
        else element.style.justifyContent = 'flex-start';
        
        if (props.horizontalAlignment === 'center') element.style.alignItems = 'center';
        else if (props.horizontalAlignment === 'end') element.style.alignItems = 'flex-end';
        else if (props.horizontalAlignment === 'stretch') element.style.alignItems = 'stretch';
        else element.style.alignItems = 'stretch';
      }
      
      if (props.wrap === 'wrap') element.style.flexWrap = 'wrap';
      else if (props.wrap === 'nowrap') element.style.flexWrap = 'nowrap';
    } else if (layout === 'grid') {
      element.style.display = 'grid';
      
      const gapSize = this.getGapSize(gap);
      element.style.gap = gapSize;
      
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
      
      if (props.autoFlow) {
        element.style.gridAutoFlow = props.autoFlow;
      }
      
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
  }

  /**
   * Setup listeners for child widget interactions
   * @private
   */
  setupChildWidgetListeners() {
    // Listen for widget interactions from child widgets
    document.addEventListener('widgetInteraction', (event) => {
      const { widgetId, widgetType } = event.detail;
      
      // Check if this is a child widget and if it's a button/action widget
      if (this.isChildWidget(widgetId) && this.isActionWidget(widgetType)) {
        this.handleFormAction(event.detail);
      }
    });

    // Listen for value changes from child widgets
    document.addEventListener('widgetValueChanged', (event) => {
      const { widgetId, value } = event.detail;
      
      if (this.isChildWidget(widgetId)) {
        this.formValues.set(widgetId, value);
      }
    });
  }

  /**
   * Check if a widget is a child of this form
   * @private
   * @param {string} widgetId - Widget ID to check
   * @returns {boolean} True if the widget is a child
   */
  isChildWidget(widgetId) {
    // This would be populated by the widget factory or parent container
    // For now, we'll use a simple DOM-based check
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
    const formData = this.collectFormValues();
    
    this.handleInteraction({
      action: actionData.optionId || actionData.action,
      actionData: actionData,
      formData: formData,
      widgetType: 'form'
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
    
    // Other widget types can be added here as needed
    
    return undefined;
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

  /**
   * Validate form widget data structure
   * @returns {boolean} True if data contains required properties for form widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'form';
  }

  /**
   * Get all form values
   * @returns {Object} Current form values
   */
  getValues() {
    return this.collectFormValues();
  }

  /**
   * Reset all form values
   */
  reset() {
    if (this.element) {
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
      
      // Clear stored values
      this.formValues.clear();
    }
  }
}
