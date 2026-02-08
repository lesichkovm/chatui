/**
 * Shared utilities for Netlify demo functions
 * Extracts common patterns to reduce code duplication
 */

/**
 * Standard CORS headers for all demo functions
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

/**
 * Create a preflight OPTIONS response
 * @returns {Object} Lambda response for OPTIONS request
 */
function handlePreflight() {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: ''
  };
}

/**
 * Create a JSONP response
 * @param {string} callback - Callback function name
 * @param {Object} data - Response data
 * @returns {Object} Lambda response with JSONP content type
 */
function createJSONPResponse(callback, data) {
  return {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/javascript'
    },
    body: `${callback}(${JSON.stringify(data)})`
  };
}

/**
 * Create a JSON response
 * @param {Object} data - Response data
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {Object} Lambda response
 */
function createJSONResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(data)
  };
}

/**
 * Create an error response
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 * @returns {Object} Lambda error response
 */
function createErrorResponse(message, statusCode = 500) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      error: statusCode === 500 ? 'Internal server error' : 'Error',
      message
    })
  };
}

/**
 * Create a method not allowed response
 * @returns {Object} Lambda 405 response
 */
function createMethodNotAllowedResponse() {
  return createErrorResponse('Method not allowed', 405);
}

/**
 * Generate a session key with prefix
 * @param {string} prefix - Session key prefix
 * @returns {string} Generated session key
 */
function generateSessionKey(prefix) {
  return `${prefix}_${Date.now()}`;
}

/**
 * Log debug information (only in non-production environments)
 * @param {string} context - Log context identifier
 * @param {Object} data - Data to log (will be redacted)
 */
function debugLog(context, data) {
  if (process.env.NODE_ENV !== 'production') {
    const redacted = { ...data };
    if (redacted.session_key) redacted.session_key = '[REDACTED]';
    if (redacted.body && redacted.body.session_key) {
      redacted.body = { ...redacted.body, session_key: '[REDACTED]' };
    }
    console.log(`${context}:`, redacted);
  }
}

/**
 * Common message type handlers for POST requests
 * @param {string} type - Message type
 * @param {Object} body - Request body
 * @param {string} sessionKeyPrefix - Prefix for session keys
 * @param {Object} customHandlers - Custom message handlers for specific demo
 * @returns {Object} Response data
 */
function handleCommonMessageTypes(type, body, sessionKeyPrefix, customHandlers = {}) {
  const { session_key } = body;
  
  // Allow custom handlers to override defaults
  if (customHandlers[type]) {
    return customHandlers[type](body, session_key);
  }
  
  switch (type) {
    case 'handshake':
      return {
        type: 'handshake',
        status: 'success',
        session_key: session_key || generateSessionKey(sessionKeyPrefix),
        message: 'Connected'
      };
      
    case 'typing':
      return {
        type: 'typing',
        payload: { typing: false },
        session_key
      };
      
    default:
      debugLog('Unknown message type', { type });
      return {
        type: 'error',
        message: 'Unknown message type',
        session_key
      };
  }
}

/**
 * Wrap a handler function with standard error handling
 * @param {Function} handler - Handler function
 * @returns {Function} Wrapped handler
 */
function withErrorHandling(handler) {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      return createErrorResponse(error.message);
    }
  };
}

module.exports = {
  corsHeaders,
  handlePreflight,
  createJSONPResponse,
  createJSONResponse,
  createErrorResponse,
  createMethodNotAllowedResponse,
  generateSessionKey,
  debugLog,
  handleCommonMessageTypes,
  withErrorHandling
};
