// Composable widgets
import { ContainerWidget } from './container-widget.js';
import { CardWidget } from './card-widget.js';
import { TextWidget } from './text-widget.js';
import { ButtonWidget } from './button-widget.js';
import { SelectWidget } from './select-widget.js';
import { ButtonsWidget } from './buttons-widget.js';
import { InputWidget } from './input-widget.js';
import { PasswordWidget } from './password-widget.js';
import { CheckboxWidget } from './checkbox-widget.js';
import { TextareaWidget } from './textarea-widget.js';
import { SliderWidget } from './slider-widget.js';
import { RatingWidget } from './rating-widget.js';
import { ToggleWidget } from './toggle-widget.js';
import { DateWidget } from './date-widget.js';
import { TagsWidget } from './tags-widget.js';
import { RadioWidget } from './radio-widget.js';
import { ConfirmationWidget } from './confirmation-widget.js';
import { ProgressWidget } from './progress-widget.js';
import { FileUploadWidget } from './file-upload-widget.js';
import { ColorPickerWidget } from './color-picker-widget.js';
import { ConditionalWidget } from './conditional-widget.js';
import { ListWidget } from './list-widget.js';

import { WIDGET_TYPES, SERVER_TYPE_MAPPINGS, LEGACY_WIDGET_TYPES } from './widget-types.js';

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
    // Widget type mappings
    [WIDGET_TYPES.BUTTONS, ButtonsWidget],
    [WIDGET_TYPES.SELECT, SelectWidget],
    [WIDGET_TYPES.INPUT, InputWidget],
    [WIDGET_TYPES.PASSWORD, PasswordWidget],
    [WIDGET_TYPES.CHECKBOX, CheckboxWidget],
    [WIDGET_TYPES.TEXTAREA, TextareaWidget],
    [WIDGET_TYPES.SLIDER, SliderWidget],
    [WIDGET_TYPES.RATING, RatingWidget],
    [WIDGET_TYPES.TOGGLE, ToggleWidget],
    [WIDGET_TYPES.DATE, DateWidget],
    [WIDGET_TYPES.TAGS, TagsWidget],
    [WIDGET_TYPES.RADIO, RadioWidget],
    [WIDGET_TYPES.CONFIRMATION, ConfirmationWidget],
    [WIDGET_TYPES.PROGRESS, ProgressWidget],
    [WIDGET_TYPES.FILE, FileUploadWidget],
    [WIDGET_TYPES.COLOR, ColorPickerWidget],
    
    // Layout and content widgets
    [WIDGET_TYPES.TEXT, TextWidget],
    [WIDGET_TYPES.CONTAINER, ContainerWidget],
    [WIDGET_TYPES.CARD, CardWidget],
    [WIDGET_TYPES.IMAGE, ContainerWidget], // Placeholder for future image widget
    [WIDGET_TYPES.ICON, ContainerWidget],   // Placeholder for future icon widget
    [WIDGET_TYPES.BUTTON, ButtonWidget],
    [WIDGET_TYPES.ROW, ContainerWidget],
    [WIDGET_TYPES.COLUMN, ContainerWidget],
    
    // Advanced composition widgets
    [WIDGET_TYPES.CONDITIONAL, ConditionalWidget],
    [WIDGET_TYPES.LIST, ListWidget]
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
   * Create a widget instance based on data type with recursive support
   * @static
   * @param {Object} widgetConfig - Widget configuration data
   * @param {string} widgetConfig.type - Widget type identifier
   * @param {Array} [widgetConfig.children] - Nested child widgets
   * @param {string} widgetId - Widget container ID for scoping
   * @returns {HTMLElement|null} Widget DOM element or null if type not supported
   */
  static createWidget(widgetConfig, widgetId) {
    if (!widgetConfig || !widgetConfig.type) {
      console.warn('Invalid widget config:', widgetConfig);
      return null;
    }

    // Handle server-to-widget type mapping
    const widgetType = SERVER_TYPE_MAPPINGS[widgetConfig.type] || widgetConfig.type;
    const WidgetClass = this.widgetTypes.get(widgetType);
    
    if (!WidgetClass) {
      console.warn(`Unsupported widget type: ${widgetConfig.type} (mapped to: ${widgetType})`);
      return null;
    }

    try {
      // Create widget with mapped type for internal consistency
      const mappedWidgetConfig = { ...widgetConfig, type: widgetType };
      const widgetInstance = new WidgetClass(mappedWidgetConfig, widgetId);
      const element = widgetInstance.createElement();

      // Recursively process children if present
      if (widgetConfig.children && Array.isArray(widgetConfig.children)) {
        const childrenContainer = widgetInstance.getChildrenContainer ? 
                                  widgetInstance.getChildrenContainer(element) : 
                                  element;
        
        widgetConfig.children.forEach(childConfig => {
          const childElement = this.createWidget(childConfig, widgetId);
          if (childElement) {
            childrenContainer.appendChild(childElement);
          }
        });
      }

      return element;
    } catch (error) {
      console.error(`Error creating widget of type ${widgetConfig.type}:`, error);
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
