import { ButtonsWidget } from './buttons-widget.js';
import { SelectWidget } from './select-widget.js';
import { InputWidget } from './input-widget.js';
import { CheckboxWidget } from './checkbox-widget.js';
import { TextareaWidget } from './textarea-widget.js';
import { SliderWidget } from './slider-widget.js';
import { RatingWidget } from './rating-widget.js';
import { ToggleWidget } from './toggle-widget.js';
import { DateWidget } from './date-widget.js';
import { TagsWidget } from './tags-widget.js';
import { FileUploadWidget } from './file-upload-widget.js';
import { ColorPickerWidget } from './color-picker-widget.js';
import { ConfirmationWidget } from './confirmation-widget.js';
import { RadioWidget } from './radio-widget.js';
import { ProgressWidget } from './progress-widget.js';

/**
 * Widget Factory
 * Creates appropriate widget instances based on widget data type
 * Provides registration system for custom widget types
 */
export class WidgetFactory {
  /**
   * Map of widget type identifiers to their corresponding classes
   * @static
   * @type {Map<string, BaseWidget>}
   */
  static widgetTypes = new Map([
    ['buttons', ButtonsWidget],
    ['select', SelectWidget],
    ['input', InputWidget],
    ['checkbox', CheckboxWidget],
    ['textarea', TextareaWidget],
    ['slider', SliderWidget],
    ['rating', RatingWidget],
    ['toggle', ToggleWidget],
    ['date', DateWidget],
    ['tags', TagsWidget],
    ['file', FileUploadWidget],
    ['color', ColorPickerWidget],
    ['confirmation', ConfirmationWidget],
    ['radio', RadioWidget],
    ['progress', ProgressWidget]
  ]);

  /**
   * Register a new widget type
   * @static
   * @param {string} type - Widget type identifier
   * @param {class} WidgetClass - Widget class constructor extending BaseWidget
   */
  static registerWidget(type, WidgetClass) {
    this.widgetTypes.set(type, WidgetClass);
  }

  /**
   * Create a widget instance based on data type
   * @static
   * @param {Object} widgetData - Widget configuration data
   * @param {string} widgetData.type - Widget type identifier
   * @param {string} widgetId - Widget container ID for scoping
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
   * Get list of all supported widget types
   * @static
   * @returns {string[]} Array of supported widget type names
   */
  static getSupportedTypes() {
    return Array.from(this.widgetTypes.keys());
  }
}
