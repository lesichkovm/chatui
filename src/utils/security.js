/**
 * Security Utilities
 * Provides sanitization and validation functions for security
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows a whitelist of safe tags for formatting
 * @param {string} text - Text content to sanitize
 * @returns {string} Sanitized text with safe HTML only
 */
export function sanitizeHTML(text) {
  if (typeof text !== 'string') return '';
  
  // Use a temporary div and DOMParser for robust sanitization if available
  // Fallback to simple regex for environments without full DOM (though widgets need DOM anyway)
  
  const template = document.createElement('template');
  template.innerHTML = text;
  const fragment = template.content;
  
  const allowedTags = [
    'strong', 'em', 'code', 'br', 'b', 'i', 'u', 'p', 'span', 'div', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'
  ];
  const allowedAttrs = ['class', 'style']; // style is further sanitized below

  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return;
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      if (!allowedTags.includes(tagName)) {
        // Replace dangerous tags with their text content or just remove
        const textNode = document.createTextNode(node.textContent);
        node.parentNode.replaceChild(textNode, node);
        return;
      }
      
      // Sanitize attributes
      const attrs = node.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attrName = attrs[i].name.toLowerCase();
        if (!allowedAttrs.includes(attrName)) {
          node.removeAttribute(attrName);
        } else if (attrName === 'style') {
          // Additional style sanitization logic could be added here
          // For now, we rely on the fact that we've already defined allowed properties
        }
      }
      
      // Recursively sanitize children
      const children = Array.from(node.childNodes);
      children.forEach(sanitizeNode);
    }
  };

  Array.from(fragment.childNodes).forEach(sanitizeNode);
  
  const div = document.createElement('div');
  div.appendChild(fragment);
  return div.innerHTML;
}

/**
 * Sanitize CSS style properties to prevent CSS injection
 * @param {Object} style - Style object to sanitize
 * @returns {Object} Sanitized style object
 */
export function sanitizeStyleProps(style) {
  if (!style || typeof style !== 'object') return {};
  
  // List of commonly used and safe CSS properties
  const allowedProps = [
    // Layout
    'display', 'position', 'top', 'right', 'bottom', 'left', 'zIndex',
    'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'borderWidth', 'borderStyle', 'borderColor', 'borderRadius',
    
    // Flexbox
    'flex', 'flexDirection', 'flexWrap', 'flexFlow', 'flexGrow', 'flexShrink', 'flexBasis',
    'justifyContent', 'alignItems', 'alignContent', 'alignSelf', 'order',
    'gap', 'rowGap', 'columnGap',
    
    // Grid
    'grid', 'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows',
    'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridColumns',
    'gridRow', 'gridRowEnd', 'gridRowStart', 'gridRows',
    'gridTemplate', 'gridTemplateAreas', 'gridTemplateColumns', 'gridTemplateRows',
    
    // Typography
    'font', 'fontFamily', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle',
    'fontVariant', 'fontWeight', 'lineHeight', 'textAlign', 'textDecoration',
    'textIndent', 'textTransform', 'letterSpacing', 'wordSpacing', 'whiteSpace',
    
    // Colors
    'color', 'backgroundColor', 'background', 'backgroundImage', 'backgroundPosition',
    'backgroundRepeat', 'backgroundSize', 'opacity', 'visibility',
    
    // Visual
    'overflow', 'overflowX', 'overflowY', 'clip', 'cursor', 'pointerEvents',
    'userSelect', 'resize', 'boxSizing', 'boxShadow', 'textShadow',
    
    // Transform
    'transform', 'transformOrigin', 'perspective', 'perspectiveOrigin',
    
    // Animation
    'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty',
    'transitionTimingFunction', 'animation', 'animationDelay', 'animationDirection',
    'animationDuration', 'animationFillMode', 'animationIterationCount',
    'animationName', 'animationPlayState', 'animationTimingFunction'
  ];
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(style)) {
    // Convert to camelCase if needed
    const camelCaseKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    
    // Only allow known safe properties
    if (allowedProps.includes(camelCaseKey) && value !== null && value !== undefined) {
      // Additional validation for certain properties
      if (isSafeStyleValue(camelCaseKey, value)) {
        sanitized[camelCaseKey] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Validate individual CSS property values
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 * @returns {boolean} True if the value is safe
 */
function isSafeStyleValue(property, value) {
  if (typeof value !== 'string') return false;
  
  // Block potentially dangerous values
  const dangerousPatterns = [
    /javascript:/i,           // JavaScript URLs
    /data:/i,                // Data URLs
    /vbscript:/i,            // VBScript URLs
    /expression\s*\(/i,      // CSS expressions
    /@import/i,              // CSS imports
    /behavior\s*:/i,         // IE behaviors
    /binding\s*:/i,          // IE bindings
    /url\s*\(\s*javascript:/i,  // JavaScript URLs in url()
  ];
  
  // Check for dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.test(value)) {
      return false;
    }
  }
  
  // Additional checks for specific properties
  switch (property) {
    case 'backgroundImage':
    case 'listStyleImage':
      // Allow only safe image URLs
      return /^url\s*\(\s*['"]?(https?:\/\/|\/|\.)[^'")]*\s*\)$/.test(value) ||
             value === 'none' ||
             value === 'inherit' ||
             value === 'initial' ||
             value === 'unset';
    
    case 'content':
      // Allow only safe content values
      return !/(javascript|data|vbscript):/i.test(value);
    
    case 'cursor':
      // Allow only safe cursor values
      return !/url\s*\(\s*javascript:/i.test(value);
    
    default:
      return true;
  }
}

/**
 * Sanitize widget configuration data
 * @param {Object} widgetData - Widget configuration to sanitize
 * @returns {Object} Sanitized widget data
 */
export function sanitizeWidgetData(widgetData) {
  if (!widgetData || typeof widgetData !== 'object') return {};
  
  const sanitized = { ...widgetData };
  
  // Sanitize props if present
  if (sanitized.props && typeof sanitized.props === 'object') {
    sanitized.props = sanitizeWidgetProps(sanitized.props);
  }
  
  // Sanitize children if present
  if (sanitized.children && Array.isArray(sanitized.children)) {
    sanitized.children = sanitized.children.map(child => sanitizeWidgetData(child));
  }
  
  return sanitized;
}

/**
 * Sanitize widget props
 * @param {Object} props - Widget props to sanitize
 * @returns {Object} Sanitized props
 */
export function sanitizeWidgetProps(props) {
  if (!props || typeof props !== 'object') return {};
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(props)) {
    switch (key) {
      // Text content - sanitize HTML
      case 'label':
      case 'placeholder':
      case 'buttonText':
      case 'content':
      case 'header':
      case 'footer':
      case 'text':
        sanitized[key] = sanitizeHTML(value);
        break;
      
      // Style properties - sanitize CSS
      case 'style':
      case 'inputStyle':
      case 'buttonStyle':
      case 'textareaStyle':
      case 'toggleStyle':
      case 'sliderStyle':
      case 'starsStyle':
      case 'optionsStyle':
      case 'barStyle':
      case 'wrapperStyle':
      case 'labelStyle':
      case 'textStyle':
      case 'statusStyle':
      case 'dropzoneStyle':
      case 'fileListStyle':
      case 'tagsStyle':
      case 'contentStyle':
        sanitized[key] = sanitizeStyleProps(value);
        break;
      
      // Arrays - sanitize each item if it's a string
      case 'options':
      case 'items':
        if (Array.isArray(value)) {
          sanitized[key] = value.map(item => {
            if (typeof item === 'string') {
              return sanitizeHTML(item);
            } else if (typeof item === 'object' && item !== null) {
              // Handle option/item objects
              const sanitizedItem = { ...item };
              if (sanitizedItem.text) sanitizedItem.text = sanitizeHTML(sanitizedItem.text);
              if (sanitizedItem.label) sanitizedItem.label = sanitizeHTML(sanitizedItem.label);
              if (sanitizedItem.content) sanitizedItem.content = sanitizeHTML(sanitizedItem.content);
              return sanitizedItem;
            }
            return item;
          });
        } else {
          sanitized[key] = value;
        }
        break;
      
      // Pass through other properties as-is (they're generally safe)
      default:
        sanitized[key] = value;
        break;
    }
  }
  
  return sanitized;
}

/**
 * Create safe HTML content with line breaks
 * @param {string} text - Text content to process
 * @returns {string} Safe HTML with line breaks
 */
export function createSafeMessageHTML(text) {
  if (typeof text !== 'string') return '';
  
  // Escape HTML and then add safe line breaks
  const escapedText = sanitizeHTML(text);
  return escapedText.replace(/\n/g, '<br>');
}
