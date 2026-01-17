import { ButtonsWidget } from './buttons-widget.js';
import { SelectWidget } from './select-widget.js';
import { InputWidget } from './input-widget.js';

/**
 * Widget Factory
 * Creates appropriate widget instances based on widget data
 */
export class WidgetFactory {
  static widgetTypes = new Map([
    ['buttons', ButtonsWidget],
    ['select', SelectWidget],
    ['input', InputWidget]
  ]);

  /**
   * Register a new widget type
   * @param {string} type - Widget type identifier
   * @param {class} WidgetClass - Widget class constructor
   */
  static registerWidget(type, WidgetClass) {
    this.widgetTypes.set(type, WidgetClass);
  }

  /**
   * Create a widget instance
   * @param {Object} widgetData - Widget configuration data
   * @param {string} widgetId - Widget container ID
   * @returns {BaseWidget|null} Widget instance or null if type not supported
   */
  static createWidget(widgetData, widgetId) {
    if (!widgetData || !widgetData.type) {
      console.warn('Invalid widget data:', widgetData);
      return null;
    }

    const WidgetClass = this.widgetTypes.get(widgetData.type);
    
    if (!WidgetClass) {
      console.warn(`Unsupported widget type: ${widgetData.type}`);
      return null;
    }

    try {
      return new WidgetClass(widgetData, widgetId);
    } catch (error) {
      console.error(`Error creating widget of type ${widgetData.type}:`, error);
      return null;
    }
  }

  /**
   * Get list of supported widget types
   * @returns {string[]} Array of supported widget type names
   */
  static getSupportedTypes() {
    return Array.from(this.widgetTypes.keys());
  }
}
