/**
 * Base Widget Class
 * All widget types should extend this class to provide consistent functionality
 */
export class BaseWidget {
  /**
   * Create a new widget instance
   * @param {Object} widgetData - Widget configuration data
   * @param {string} widgetId - Widget ID for scoping
   */
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
   * Handle widget interaction and dispatch custom event
   * @param {Object} interaction - Interaction data
   * @param {string} interaction.type - Type of interaction
   * @param {string} interaction.value - Interaction value
   * @param {string} [interaction.text] - Display text for the interaction
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
   * Validate widget data structure
   * @returns {boolean} True if data contains required type property
   */
  validate() {
    return this.widgetData && this.widgetData.type;
  }
}
