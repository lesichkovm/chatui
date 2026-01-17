/**
 * Widget Type Constants
 * Centralized constants for all widget types to avoid magic strings
 */

export const WIDGET_TYPES = {
  BUTTONS: 'buttons',
  SELECT: 'select',
  INPUT: 'input',
  PASSWORD: 'password',
  CHECKBOX: 'checkbox',
  TEXTAREA: 'textarea',
  SLIDER: 'slider',
  RATING: 'rating',
  TOGGLE: 'toggle',
  DATE: 'date',
  TAGS: 'tags',
  FILE_UPLOAD: 'file_upload',
  COLOR_PICKER: 'color_picker',
  CONFIRMATION: 'confirmation',
  RADIO: 'radio',
  PROGRESS: 'progress'
};

// Legacy type mappings for backward compatibility
export const LEGACY_WIDGET_TYPES = {
  FILE: 'file',
  COLOR: 'color'
};

// Server-to-widget type mappings
export const SERVER_TYPE_MAPPINGS = {
  [WIDGET_TYPES.FILE_UPLOAD]: LEGACY_WIDGET_TYPES.FILE,
  [WIDGET_TYPES.COLOR_PICKER]: LEGACY_WIDGET_TYPES.COLOR
};

// Widget-to-server type mappings (reverse mapping)
export const WIDGET_TYPE_MAPPINGS = {
  [LEGACY_WIDGET_TYPES.FILE]: WIDGET_TYPES.FILE_UPLOAD,
  [LEGACY_WIDGET_TYPES.COLOR]: WIDGET_TYPES.COLOR_PICKER
};
