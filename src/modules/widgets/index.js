/**
 * Widget System Entry Point
 * Exports all widget-related functionality and provides convenience functions
 */

// Layout and content widgets
export { BaseWidget } from './base-widget.js';
export { ContainerWidget } from './container-widget.js';
export { CardWidget } from './card-widget.js';
export { TextWidget } from './text-widget.js';
export { ButtonWidget } from './button-widget.js';

// Input widgets
export { InputWidget } from './input-widget.js';
export { PasswordWidget } from './password-widget.js';
export { TextareaWidget } from './textarea-widget.js';

// Selection widgets
export { SelectWidget } from './select-widget.js';
export { CheckboxWidget } from './checkbox-widget.js';
export { RadioWidget } from './radio-widget.js';

// Interactive widgets
export { SliderWidget } from './slider-widget.js';
export { RatingWidget } from './rating-widget.js';
export { ToggleWidget } from './toggle-widget.js';

// Action widgets
export { ButtonsWidget } from './buttons-widget.js';
export { ConfirmationWidget } from './confirmation-widget.js';

// Data widgets
export { DateWidget } from './date-widget.js';
export { TagsWidget } from './tags-widget.js';
export { FileUploadWidget } from './file-upload-widget.js';
export { ColorPickerWidget } from './color-picker-widget.js';
export { ProgressWidget } from './progress-widget.js';

// Advanced composition widgets
export { ConditionalWidget } from './conditional-widget.js';
export { ListWidget } from './list-widget.js';

export { WidgetFactory } from './widget-factory.js';

/**
 * Convenience function for creating widgets
 * @param {Object} widgetData - Widget configuration data
 * @param {string} widgetId - Widget ID for scoping
 * @returns {BaseWidget|null} Widget instance or null if type not supported
 */
export function createWidget(widgetData, widgetId) {
  return WidgetFactory.createWidget(widgetData, widgetId);
}
