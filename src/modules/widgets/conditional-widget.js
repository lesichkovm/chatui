import { BaseWidget } from './base-widget.js';

/**
 * Conditional Container Widget
 * Shows/hides content based on widget state or conditions
 * Extends BaseWidget to provide conditional rendering
 */
export class ConditionalWidget extends BaseWidget {
  constructor(widgetData, widgetId) {
    super(widgetData, widgetId);
    this.state = new Map();
    this.evaluator = this.createEvaluator();
  }

  /**
   * Create the DOM element for the conditional container
   * @returns {HTMLElement|Comment} Conditional container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid conditional widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-conditional-container';
    
    const props = this.widgetData.props || {};
    const condition = props.condition;
    const children = props.children || [];
    const fallback = props.fallback;
    
    // Apply variant and size classes
    const variant = props.variant || 'default';
    const size = props.size || 'medium';
    container.classList.add(`variant-${variant}`);
    container.classList.add(`size-${size}`);
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'widget-conditional-content';
    
    // Create fallback container
    const fallbackContainer = document.createElement('div');
    fallbackContainer.className = 'widget-conditional-fallback';
    fallbackContainer.style.display = 'none';
    
    // Render children and fallback
    this.renderChildren(contentContainer, children);
    if (fallback) {
      this.renderChildren(fallbackContainer, Array.isArray(fallback) ? fallback : [fallback]);
    }
    
    // Initial evaluation
    this.updateVisibility(container, contentContainer, fallbackContainer, condition);
    
    // Set up state change listeners
    this.setupStateListeners(container, contentContainer, fallbackContainer, condition);
    
    // Apply custom styles
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    if (props.contentStyle) {
      Object.assign(contentContainer.style, props.contentStyle);
    }
    
    if (props.fallbackStyle) {
      Object.assign(fallbackContainer.style, props.fallbackStyle);
    }
    
    // Assemble the widget
    container.appendChild(contentContainer);
    if (fallback) {
      container.appendChild(fallbackContainer);
    }
    
    return container;
  }

  /**
   * Create condition evaluator function
   * @returns {Function} Evaluator function
   */
  createEvaluator() {
    return (condition, state) => {
      if (!condition) return true;
      
      try {
        // Handle different condition types
        if (typeof condition === 'function') {
          return condition(state);
        }
        
        if (typeof condition === 'string') {
          // Simple property check: "showIf" or "hideIf"
          if (condition.startsWith('showIf:')) {
            const key = condition.substring(7);
            return Boolean(state.get(key));
          }
          
          if (condition.startsWith('hideIf:')) {
            const key = condition.substring(7);
            return !Boolean(state.get(key));
          }
          
          // Simple equality check: "key:value"
          if (condition.includes(':')) {
            const [key, value] = condition.split(':');
            return state.get(key) === value;
          }
          
          // Simple boolean check
          return Boolean(state.get(condition));
        }
        
        if (typeof condition === 'object') {
          // Complex condition object
          const { operator, key, value, conditions } = condition;
          
          switch (operator) {
            case 'equals':
              return state.get(key) === value;
            
            case 'notEquals':
              return state.get(key) !== value;
            
            case 'greaterThan':
              return Number(state.get(key)) > Number(value);
            
            case 'lessThan':
              return Number(state.get(key)) < Number(value);
            
            case 'contains':
              return String(state.get(key)).includes(String(value));
            
            case 'and':
              return conditions.every(cond => this.evaluator(cond, state));
            
            case 'or':
              return conditions.some(cond => this.evaluator(cond, state));
            
            default:
              return true;
          }
        }
        
        return true;
      } catch (error) {
        console.warn('Condition evaluation error:', error);
        return true; // Default to showing content
      }
    };
  }

  /**
   * Update visibility based on condition
   * @param {HTMLElement} container - Main container
   * @param {HTMLElement} contentContainer - Content container
   * @param {HTMLElement} fallbackContainer - Fallback container
   * @param {*} condition - Condition to evaluate
   */
  updateVisibility(container, contentContainer, fallbackContainer, condition) {
    const shouldShow = this.evaluator(condition, this.state);
    
    if (shouldShow) {
      contentContainer.style.display = '';
      if (fallbackContainer) {
        fallbackContainer.style.display = 'none';
      }
      container.classList.remove('conditional-hidden');
      container.classList.add('conditional-visible');
    } else {
      contentContainer.style.display = 'none';
      if (fallbackContainer) {
        fallbackContainer.style.display = '';
      }
      container.classList.remove('conditional-visible');
      container.classList.add('conditional-hidden');
    }
  }

  /**
   * Set up state change listeners
   * @param {HTMLElement} container - Main container
   * @param {HTMLElement} contentContainer - Content container
   * @param {HTMLElement} fallbackContainer - Fallback container
   * @param {*} condition - Condition to evaluate
   */
  setupStateListeners(container, contentContainer, fallbackContainer, condition) {
    // Listen for widget interaction events to update state
    document.addEventListener('widgetInteraction', (event) => {
      const { widgetId, widgetType, ...data } = event.detail;
      
      // Update state based on interaction
      if (widgetId === this.widgetId) {
        Object.keys(data).forEach(key => {
          this.state.set(key, data[key]);
        });
        
        // Re-evaluate condition
        this.updateVisibility(container, contentContainer, fallbackContainer, condition);
      }
    });
  }

  /**
   * Render children widgets
   * @param {HTMLElement} container - Container to render into
   * @param {Array} children - Children to render
   */
  renderChildren(container, children) {
    // Import WidgetFactory dynamically to avoid circular dependencies
    import('./widget-factory.js').then(({ WidgetFactory }) => {
      children.forEach(childConfig => {
        const childElement = WidgetFactory.createWidget(childConfig, this.widgetId);
        if (childElement) {
          container.appendChild(childElement);
        }
      });
    });
  }

  /**
   * Set state value
   * @param {string} key - State key
   * @param {*} value - State value
   */
  setState(key, value) {
    this.state.set(key, value);
    
    // Trigger re-evaluation
    const container = document.querySelector(`[data-widget-id="${this.widgetId}"]`);
    if (container) {
      const contentContainer = container.querySelector('.widget-conditional-content');
      const fallbackContainer = container.querySelector('.widget-conditional-fallback');
      const condition = this.widgetData.props?.condition;
      
      this.updateVisibility(container, contentContainer, fallbackContainer, condition);
    }
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @returns {*} State value
   */
  getState(key) {
    return this.state.get(key);
  }

  /**
   * Validate conditional widget data structure
   * @returns {boolean} True if data contains required properties for conditional widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'conditional';
  }
}
