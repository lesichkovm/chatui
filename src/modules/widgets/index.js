/**
 * Widget System Entry Point
 * Exports all widget-related functionality
 */

export { BaseWidget } from './base-widget.js';
export { ButtonsWidget } from './buttons-widget.js';
export { SelectWidget } from './select-widget.js';
export { InputWidget } from './input-widget.js';
export { CheckboxWidget } from './checkbox-widget.js';
export { TextareaWidget } from './textarea-widget.js';
export { SliderWidget } from './slider-widget.js';
export { RatingWidget } from './rating-widget.js';
export { ToggleWidget } from './toggle-widget.js';
export { DateWidget } from './date-widget.js';
export { TagsWidget } from './tags-widget.js';
export { FileUploadWidget } from './file-upload-widget.js';
export { ColorPickerWidget } from './color-picker-widget.js';
export { ConfirmationWidget } from './confirmation-widget.js';
export { RadioWidget } from './radio-widget.js';
export { ProgressWidget } from './progress-widget.js';
export { WidgetFactory } from './widget-factory.js';

// Convenience function for creating widgets
export function createWidget(widgetData, widgetId) {
  return WidgetFactory.createWidget(widgetData, widgetId);
}
