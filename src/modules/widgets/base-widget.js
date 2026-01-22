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
   * Get the container element for nested children widgets
   * Override this method in container widgets to specify where children should be placed
   * @param {HTMLElement} element - The widget's main element
   * @returns {HTMLElement} Container element for children (defaults to main element)
   */
  getChildrenContainer(element) {
    return element;
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
   * Emit value change event for form coordination
   * @param {*} value - New value
   */
  emitValueChange(value) {
    const event = new CustomEvent("widgetValueChanged", {
      detail: {
        widgetId: this.widgetId,
        value: value,
        widgetType: this.widgetData.type
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get the current value of the widget
   * @returns {*} Current widget value
   */
  getValue() {
    // Should be implemented by subclasses
    return undefined;
  }

  /**
   * Set the value of the widget
   * @param {*} value - Value to set
   */
  setValue(value) {
    // Optional: can be implemented by subclasses
  }

  /**
   * Validate widget data structure
   * @returns {boolean} True if data contains required type property
   */
  validate() {
    return this.widgetData && this.widgetData.type;
  }
}
