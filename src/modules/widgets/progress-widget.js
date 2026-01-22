import { BaseWidget } from './base-widget.js';

/**
 * Progress Widget (Composable)
 * A standalone progress indicator widget
 * Can be used in containers or standalone
 */
export class ProgressWidget extends BaseWidget {
  /**
   * Create the DOM element for the progress widget
   * @returns {HTMLElement|Comment} Progress container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid progress widget data');
    }

    const container = document.createElement('div');
    container.className = 'widget-progress-container';
    
    const props = this.widgetData.props || {};
    const label = props.label || 'Progress';
    const variant = props.variant || 'primary';
    const size = props.size || 'medium';
    const value = props.value || 0;
    const max = props.max || 100;
    const showPercentage = props.showPercentage !== false;
    const showText = props.showText !== false;
    const animated = props.animated !== false;
    
    // Calculate percentage
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    // Create label
    const labelElement = document.createElement('div');
    labelElement.className = 'widget-progress-label';
    labelElement.textContent = label;
    labelElement.classList.add(`variant-${variant}`);
    labelElement.classList.add(`size-${size}`);
    
    // Create progress bar wrapper
    const progressBarWrapper = document.createElement('div');
    progressBarWrapper.className = 'widget-progress-bar-wrapper';
    progressBarWrapper.classList.add(`variant-${variant}`);
    progressBarWrapper.classList.add(`size-${size}`);
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'widget-progress-bar';
    progressBar.classList.add(`variant-${variant}`);
    progressBar.classList.add(`size-${size}`);
    
    if (animated) {
      progressBar.classList.add('animated');
    }
    
    // Set progress width
    progressBar.style.width = `${percentage}%`;
    
    // Create progress text
    let progressText = null;
    if (showText) {
      progressText = document.createElement('div');
      progressText.className = 'widget-progress-text';
      progressText.classList.add(`variant-${variant}`);
      progressText.classList.add(`size-${size}`);
      
      let text = `${value} / ${max}`;
      if (showPercentage) {
        text += ` (${Math.round(percentage)}%)`;
      }
      progressText.textContent = text;
    }
    
    // Create status indicator
    let statusIndicator = null;
    if (props.showStatus) {
      statusIndicator = document.createElement('div');
      statusIndicator.className = 'widget-progress-status';
      statusIndicator.classList.add(`variant-${variant}`);
      statusIndicator.classList.add(`size-${size}`);
      
      let status = 'in-progress';
      let statusText = 'In Progress';
      
      if (percentage >= 100) {
        status = 'complete';
        statusText = 'Complete';
        progressBar.classList.add('complete');
      } else if (percentage === 0) {
        status = 'not-started';
        statusText = 'Not Started';
      }
      
      statusIndicator.classList.add(status);
      statusIndicator.textContent = statusText;
    }
    
    // Apply custom styles if provided
    if (props.barStyle) {
      Object.assign(progressBar.style, props.barStyle);
    }
    
    if (props.wrapperStyle) {
      Object.assign(progressBarWrapper.style, props.wrapperStyle);
    }
    
    if (props.labelStyle) {
      Object.assign(labelElement.style, props.labelStyle);
    }
    
    if (props.textStyle && progressText) {
      Object.assign(progressText.style, props.textStyle);
    }
    
    if (props.statusStyle && statusIndicator) {
      Object.assign(statusIndicator.style, props.statusStyle);
    }
    
    if (props.style) {
      Object.assign(container.style, props.style);
    }
    
    // Assemble the widget
    progressBarWrapper.appendChild(progressBar);
    
    container.appendChild(labelElement);
    container.appendChild(progressBarWrapper);
    
    if (progressText) {
      container.appendChild(progressText);
    }
    
    if (statusIndicator) {
      container.appendChild(statusIndicator);
    }
    
    return container;
  }

  /**
   * Validate progress widget data structure
   * @returns {boolean} True if data contains required properties for progress widget
   */
  validate() {
    return super.validate() && 
           this.widgetData.type === 'progress' &&
           this.widgetData.props &&
           typeof this.widgetData.props.value === 'number' &&
           typeof this.widgetData.props.max === 'number' &&
           this.widgetData.props.max > 0;
  }
}
