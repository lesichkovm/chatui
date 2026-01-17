// src/modules/theme.js
// Theme management system with data-attributes-first approach

/**
 * Default theme configurations
 * Each theme has light and dark mode variants
 */
export const THEMES = {
  default: {
    light: {
      primary: '#007bff',
      bg: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      border: '#e9ecef',
    },
    dark: {
      primary: '#4dabf7',
      bg: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      border: '#404040',
    },
  },
  branded: {
    light: {
      primary: '#6366f1',
      bg: '#ffffff',
      surface: '#f5f3ff',
      text: '#1e1b4b',
      border: '#e0e7ff',
    },
    dark: {
      primary: '#818cf8',
      bg: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      border: '#334155',
    },
  },
};

/**
 * ThemeManager handles theme switching, persistence, and system preference detection
 */
export class ThemeManager {
  constructor(widgetId, scriptElement) {
    this.widgetId = widgetId;
    this.scriptElement = scriptElement;
    this.storageKey = `chat-widget-${widgetId}-theme`;
    this.modeStorageKey = `chat-widget-${widgetId}-mode`;
  }

  /**
   * Get theme configuration from data attributes or defaults
   */
  getThemeConfig() {
    const theme = this.getTheme();
    const mode = this.getMode();
    
    // Get custom colors from data attributes
    const customColors = this.getCustomColors(mode);
    
    // Merge with defaults
    const defaultColors = THEMES[theme]?.[mode] || THEMES.default[mode];
    
    return {
      theme,
      mode,
      colors: { ...defaultColors, ...customColors },
    };
  }

  /**
   * Get theme name from data attribute, localStorage, or default
   */
  getTheme() {
    // 1. Check data attribute
    if (this.scriptElement) {
      const dataTheme = this.scriptElement.getAttribute('data-theme');
      if (dataTheme && THEMES[dataTheme]) {
        return dataTheme;
      }
    }

    // 2. Check localStorage
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme && THEMES[savedTheme]) {
      return savedTheme;
    }

    // 3. Default
    return 'default';
  }

  /**
   * Get mode (light/dark) from data attribute, localStorage, system preference, or default
   */
  getMode() {
    // 1. Check data attribute
    if (this.scriptElement) {
      const dataMode = this.scriptElement.getAttribute('data-mode');
      if (dataMode === 'light' || dataMode === 'dark') {
        return dataMode;
      }
    }

    // 2. Check localStorage
    const savedMode = localStorage.getItem(this.modeStorageKey);
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }

    // 3. Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 4. Default
    return 'light';
  }

  /**
   * Get custom colors from data attributes
   */
  getCustomColors(mode) {
    if (!this.scriptElement) return {};

    const colors = {};
    const suffix = mode === 'light' ? '-light' : '-dark';

    // Map data attributes to color properties
    const colorMap = {
      [`data-color${suffix}`]: 'primary',
      [`data-bg-color${suffix}`]: 'bg',
      [`data-surface-color${suffix}`]: 'surface',
      [`data-text-color${suffix}`]: 'text',
      [`data-border-color${suffix}`]: 'border',
    };

    // Also check for generic attributes without mode suffix (fallback)
    const genericColorMap = {
      'data-color': 'primary',
      'data-bg-color': 'bg',
      'data-surface-color': 'surface',
      'data-text-color': 'text',
      'data-border-color': 'border',
    };

    // First check mode-specific attributes
    for (const [attr, prop] of Object.entries(colorMap)) {
      const value = this.scriptElement.getAttribute(attr);
      if (value) {
        colors[prop] = value;
      }
    }

    // Then check generic attributes as fallback
    for (const [attr, prop] of Object.entries(genericColorMap)) {
      const value = this.scriptElement.getAttribute(attr);
      if (value && !colors[prop]) {
        colors[prop] = value;
      }
    }

    return colors;
  }

  /**
   * Set theme and persist to localStorage
   */
  setTheme(theme) {
    if (!THEMES[theme]) {
      console.warn(`Unknown theme: ${theme}`);
      return;
    }
    localStorage.setItem(this.storageKey, theme);
  }

  /**
   * Set mode and persist to localStorage
   */
  setMode(mode) {
    if (mode !== 'light' && mode !== 'dark') {
      console.warn(`Invalid mode: ${mode}`);
      return;
    }
    localStorage.setItem(this.modeStorageKey, mode);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleMode() {
    const currentMode = this.getMode();
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    this.setMode(newMode);
    return newMode;
  }

  /**
   * Listen for system theme changes
   */
  watchSystemTheme(callback) {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = (e) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem(this.modeStorageKey)) {
        const newMode = e.matches ? 'dark' : 'light';
        callback(newMode);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }
}
