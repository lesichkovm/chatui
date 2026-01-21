import { BaseWidget } from './base-widget.js';

/**
 * Card Widget
 * A visually distinct container with padding and shadows
 */
export class CardWidget extends BaseWidget {
  /**
   * Create the DOM element for the card widget
   * @returns {HTMLElement} The card DOM element
   */
  createElement() {
    const element = document.createElement('div');
    element.className = 'widget-card';
    
    // Apply variant classes based on props
    const variant = this.widgetData.props?.variant || 'default';
    const padding = this.widgetData.props?.padding || 'medium';
    
    element.classList.add(`variant-${variant}`);
    element.classList.add(`padding-${padding}`);
    
    // Apply custom styles if provided
    if (this.widgetData.props?.style) {
      Object.assign(element.style, this.widgetData.props.style);
    }
    
    return element;
  }
}
