/**
 * Widget Configuration Defaults
 * Centralized configuration for widget default behaviors
 */

/**
 * Widget Default Configuration
 * Controls default behavior for all widget types
 */
export const WIDGET_DEFAULTS = {
  // Input widget defaults
  input: {
    showSubmitButton: true,  // Current default for backward compatibility
    // Future: showSubmitButton: false
  },
  
  password: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  textarea: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  date: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  checkbox: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  radio: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  select: {
    disableOnSelect: false,
    // Future: disableOnSelect: true (better default for forms)
  },
  
  file: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  color: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  slider: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  rating: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  tags: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  },
  
  toggle: {
    showSubmitButton: true,
    // Future: showSubmitButton: false
  }
};

/**
 * Migration Configuration
 * Controls migration behavior and warnings
 */
export const MIGRATION_CONFIG = {
  // Enable migration warnings
  enableWarnings: true,
  
  // Show deprecation notices for old patterns
  showDeprecationNotices: false,
  
  // Auto-migrate to new patterns
  autoMigrate: false,
  
  // Migration phases
  phases: {
    phase1: {
      description: 'Configurable buttons (current)',
      defaultShowSubmitButton: true,
      enableWarnings: false
    },
    phase2: {
      description: 'Migration preparation',
      defaultShowSubmitButton: true,
      enableWarnings: true,
      showDeprecationNotices: true
    },
    phase3: {
      description: 'Composable default',
      defaultShowSubmitButton: false,
      enableWarnings: true,
      showDeprecationNotices: true,
      autoMigrate: true
    }
  },
  
  // Current phase (can be overridden)
  currentPhase: 'phase3'
};

/**
 * Get default props for a widget type
 * @param {string} widgetType - Widget type
 * @returns {Object} Default props
 */
export function getWidgetDefaults(widgetType) {
  const defaults = WIDGET_DEFAULTS[widgetType];
  return defaults || {};
}

/**
 * Check if widget should show submit button by default
 * @param {string} widgetType - Widget type
 * @returns {boolean} Whether to show submit button
 */
export function shouldShowSubmitButton(widgetType) {
  const defaults = getWidgetDefaults(widgetType);
  return defaults.showSubmitButton !== false;
}

/**
 * Apply migration configuration to widget props
 * @param {Object} widgetData - Widget data
 * @param {string} phase - Migration phase
 * @returns {Object} Updated widget data
 */
export function applyMigrationConfig(widgetData, phase = MIGRATION_CONFIG.currentPhase) {
  const phaseConfig = MIGRATION_CONFIG.phases[phase];
  if (!phaseConfig) return widgetData;
  
  const updated = { ...widgetData };
  updated.props = { ...updated.props };
  
  // Apply phase-specific defaults
  const defaults = getWidgetDefaults(widgetData.type);
  
  if (defaults.showSubmitButton !== undefined) {
    // Only apply if not explicitly set
    if (updated.props.showSubmitButton === undefined) {
      updated.props.showSubmitButton = phaseConfig.defaultShowSubmitButton;
      
      // Add warning if needed
      if (phaseConfig.enableWarnings && 
          phaseConfig.defaultShowSubmitButton === false && 
          defaults.showSubmitButton === true) {
        console.warn(
          `Widget ${widgetData.type} default behavior changed. ` +
          `Explicitly set showSubmitButton to maintain current behavior.`
        );
      }
    }
  }
  
  // Handle SelectWidget special case
  if (widgetData.type === 'select' && updated.props.disableOnSelect === undefined) {
    if (phase === 'phase3') {
      updated.props.disableOnSelect = true;
    }
  }
  
  return updated;
}

/**
 * Get migration warning for widget
 * @param {Object} widgetData - Widget data
 * @param {string} phase - Migration phase
 * @returns {string|null} Warning message
 */
export function getMigrationWarning(widgetData, phase = MIGRATION_CONFIG.currentPhase) {
  const phaseConfig = MIGRATION_CONFIG.phases[phase];
  if (!phaseConfig || !phaseConfig.enableWarnings) return null;
  
  const defaults = getWidgetDefaults(widgetData.type);
  
  // Check for deprecated patterns
  if (widgetData.props?.showSubmitButton === undefined && 
      defaults.showSubmitButton === true && 
      phaseConfig.defaultShowSubmitButton === false) {
    return `Widget ${widgetData.type} default behavior changed. ` +
           `Add showSubmitButton: true to maintain current behavior.`;
  }
  
  return null;
}

/**
 * Check if widget is using deprecated pattern
 * @param {Object} widgetData - Widget data
 * @param {string} phase - Migration phase
 * @returns {boolean} True if deprecated
 */
export function isDeprecatedPattern(widgetData, phase = MIGRATION_CONFIG.currentPhase) {
  const phaseConfig = MIGRATION_CONFIG.phases[phase];
  if (!phaseConfig) return false;
  
  const defaults = getWidgetDefaults(widgetData.type);
  
  // Check for embedded button pattern
  if (widgetData.type !== 'buttons' && 
      widgetData.type !== 'button' &&
      widgetData.props?.showSubmitButton !== false &&
      phaseConfig.defaultShowSubmitButton === false) {
    return true;
  }
  
  return false;
}

/**
 * Get recommended composable alternative
 * @param {Object} widgetData - Widget data
 * @returns {Object} Recommended alternative
 */
export function getComposableAlternative(widgetData) {
  const alternatives = {
    input: {
      type: 'input',
      props: {
        ...widgetData.props,
        showSubmitButton: false
      }
    },
    password: {
      type: 'password',
      props: {
        ...widgetData.props,
        showSubmitButton: false
      }
    },
    textarea: {
      type: 'textarea',
      props: {
        ...widgetData.props,
        showSubmitButton: false
      }
    },
    // Add other widget types as needed...
  };
  
  return alternatives[widgetData.type] || widgetData;
}

/**
 * Export current configuration for debugging
 */
export function getCurrentConfig() {
  return {
    defaults: WIDGET_DEFAULTS,
    migration: MIGRATION_CONFIG,
    currentPhase: MIGRATION_CONFIG.currentPhase
  };
}
