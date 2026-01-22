import { BaseWidget } from './base-widget.js';

/**
 * Container Widget
 * A generic container widget that can hold other widgets in various layouts
 * Supports flex, grid, and custom layout systems
 */
export class ContainerWidget extends BaseWidget {
  /**
   * Create the DOM element for the container widget
   * @returns {HTMLElement} The container DOM element
   */
  createElement() {
    const element = document.createElement('div');
    element.className = 'widget-container';
    
    const props = this.widgetData.props || {};
    const layout = props.layout || 'vertical';
    const gap = props.gap || 'medium';
    const alignment = props.alignment || 'start';
    
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
    return element;
  }
}
