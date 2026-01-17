/**
 * Widget System Entry Point
 * Exports all widget-related functionality
 */

export { BaseWidget } from './base-widget.js';
export { ButtonsWidget } from './buttons-widget.js';
export { SelectWidget } from './select-widget.js';
export { InputWidget } from './input-widget.js';
export { WidgetFactory } from './widget-factory.js';

// Convenience function for creating widgets
export function createWidget(widgetData, widgetId) {
  return WidgetFactory.createWidget(widgetData, widgetId);
}
