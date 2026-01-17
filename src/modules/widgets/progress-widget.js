import { BaseWidget } from './base-widget.js';

/**
 * Progress Widget
 * Renders a read-only progress indicator
 * Extends BaseWidget to provide progress display functionality
 */
export class ProgressWidget extends BaseWidget {
  /**
   * Create the DOM element for the progress widget
   * @returns {HTMLElement|Comment} Widget container element or comment for invalid data
   */
  createElement() {
    if (!this.validate()) {
      return document.createComment('Invalid progress widget data');
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widget";
    
    if (this.widgetData.type === 'progress') {
      const progressContainer = document.createElement("div");
      progressContainer.className = "widget-progress";
      
      const label = document.createElement("div");
      label.className = "widget-progress-label";
      label.textContent = this.widgetData.label || 'Progress';
      
      const progressBarWrapper = document.createElement("div");
      progressBarWrapper.className = "widget-progress-bar-wrapper";
      
      const progressBar = document.createElement("div");
      progressBar.className = "widget-progress-bar";
      
      const value = this.widgetData.value || 0;
      const max = this.widgetData.max || 100;
      const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
      
      progressBar.style.width = `${percentage}%`;
      
      const progressText = document.createElement("div");
      progressText.className = "widget-progress-text";
      progressText.textContent = `${value} / ${max}`;
      
      if (this.widgetData.showPercentage !== false) {
        progressText.textContent += ` (${Math.round(percentage)}%)`;
      }
      
      progressBarWrapper.appendChild(progressBar);
      progressContainer.appendChild(label);
      progressContainer.appendChild(progressBarWrapper);
      progressContainer.appendChild(progressText);
      widgetContainer.appendChild(progressContainer);
    }
    
    return widgetContainer;
  }

  validate() {
    return super.validate() && 
           this.widgetData.type === 'progress' &&
           typeof this.widgetData.value === 'number' &&
           typeof this.widgetData.max === 'number' &&
           this.widgetData.max > 0;
  }
}
