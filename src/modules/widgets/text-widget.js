import { BaseWidget } from './base-widget.js';

/**
 * Text Widget (v2)
 * Displays text content with support for markdown or basic formatting
 */
export class TextWidget extends BaseWidget {
  /**
   * Create the DOM element for the text widget
   * @returns {HTMLElement} The text DOM element
   */
  createElement() {
    const element = document.createElement('div');
    element.className = 'widget-text';
    
    const content = this.widgetData.props?.content || '';
    const format = this.widgetData.props?.format || 'plain';
    
    // Apply format classes
    element.classList.add(`format-${format}`);
    
    // Set content based on format
    if (format === 'markdown') {
      // Basic markdown support (can be enhanced later)
      element.innerHTML = this.parseBasicMarkdown(content);
    } else if (format === 'html') {
      element.innerHTML = content;
    } else {
      // Plain text
      element.textContent = content;
    }
    
    // Apply custom styles if provided
    if (this.widgetData.props?.style) {
      Object.assign(element.style, this.widgetData.props.style);
    }
    
    return element;
  }
  
  /**
   * Parse basic markdown syntax
   * @private
   * @param {string} text - Markdown text
   * @returns {string} HTML string
   */
  parseBasicMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
}
