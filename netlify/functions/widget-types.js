/**
 * Server-side Widget Type Constants
 * Centralized constants for all widget types used by server functions
 */

export const WIDGET_TYPES = {
  BUTTONS: 'buttons',
  SELECT: 'select',
  INPUT: 'input',
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

// Default widget configurations
export const DEFAULT_WIDGET_CONFIGS = {
  [WIDGET_TYPES.BUTTONS]: {
    type: WIDGET_TYPES.BUTTONS,
    options: []
  },
  [WIDGET_TYPES.RATING]: {
    type: WIDGET_TYPES.RATING,
    maxRating: 5,
    iconType: 'star'
  },
  [WIDGET_TYPES.INPUT]: {
    type: WIDGET_TYPES.INPUT,
    placeholder: 'Enter your response...',
    inputType: 'text',
    required: true
  },
  [WIDGET_TYPES.COLOR_PICKER]: {
    type: WIDGET_TYPES.COLOR_PICKER,
    defaultColor: '#667eea',
    presetColors: ['#667eea', '#764ba2', '#f093fb', '#4facfe']
  },
  [WIDGET_TYPES.TOGGLE]: {
    type: WIDGET_TYPES.TOGGLE,
    defaultValue: false,
    label: 'Enable'
  },
  [WIDGET_TYPES.SLIDER]: {
    type: WIDGET_TYPES.SLIDER,
    min: 0,
    max: 100,
    defaultValue: 50,
    step: 1
  }
};
