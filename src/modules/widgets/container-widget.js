import { BaseWidget } from './base-widget.js';

/**
 * Container Widget
 * A generic container widget that can hold other widgets in various layouts
 */
export class ContainerWidget extends BaseWidget {
  /**
   * Create the DOM element for the container widget
   * @returns {HTMLElement} The container DOM element
   */
  createElement() {
    const element = document.createElement('div');
    element.className = 'widget-container';
    
    // Apply layout classes based on props
    const layout = this.widgetData.props?.layout || 'vertical';
    const gap = this.widgetData.props?.gap || 'medium';
    const alignment = this.widgetData.props?.alignment || 'start';
    
    element.classList.add(`layout-${layout}`);
    element.classList.add(`gap-${gap}`);
    element.classList.add(`align-${alignment}`);
    
    // Apply custom styles if provided
    if (this.widgetData.props?.style) {
      Object.assign(element.style, this.widgetData.props.style);
    }
    
    return element;
  }
}
