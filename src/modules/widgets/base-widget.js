/**
 * Base Widget Class
 * All widget types should extend this class
 */
export class BaseWidget {
  constructor(widgetData, widgetId) {
    this.widgetData = widgetData;
    this.widgetId = widgetId;
  }

  /**
   * Create the DOM element for this widget
   * @returns {HTMLElement} The widget DOM element
   */
  createElement() {
    throw new Error('createElement() must be implemented by subclass');
  }

  /**
   * Handle widget interaction
   * @param {Object} interaction - Interaction data
   */
  handleInteraction(interaction) {
    // Dispatch custom event for widget interaction
    const event = new CustomEvent("widgetInteraction", {
      detail: {
        widgetId: this.widgetId,
        ...interaction
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Validate widget data
   * @returns {boolean} True if data is valid
   */
  validate() {
    return this.widgetData && this.widgetData.type;
  }
}
