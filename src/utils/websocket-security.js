/**
 * WebSocket Security Configuration
 * Provides security settings and validation for WebSocket connections
 */

/**
 * WebSocket Security Configuration
 * Centralized security settings for WebSocket connections
 */
export const WebSocketSecurityConfig = {
  // Protocol enforcement
  enforceSecureProtocol: true,        // Force WSS in production
  allowInsecureInDev: true,           // Allow WS in development
  
  // Certificate validation
  validateCertificates: true,         // Enable certificate validation
  allowedCertificateHashes: [],       // Certificate pinning (optional)
  
  // Hostname validation
  blockLocalhostInProduction: true,   // Block localhost in production
  allowedHostnames: [],               // Whitelist of allowed hostnames
  blockedHostnames: [],               // Blacklist of blocked hostnames
  
  // Port validation
  allowedPorts: [443, 8080, 8443],     // Allowed WebSocket ports
  blockNonStandardPorts: false,       // Block non-standard ports
  
  // Connection security
  maxReconnectAttempts: 5,            // Maximum reconnection attempts
  reconnectDelay: 1000,                // Base reconnection delay (ms)
  connectionTimeout: 10000,            // Connection timeout (ms)
  
  // Message security
  validateMessageFormat: true,        // Validate message format
  maxMessageSize: 1024 * 1024,        // Max message size (1MB)
  allowedMessageTypes: [              // Allowed message types
    'handshake',
    'message',
    'message:stream',
    'typing',
    'read_receipt',
    'error',
    'ping',
    'pong'
  ],
  
  // Rate limiting
  enableRateLimiting: true,           // Enable rate limiting
  maxMessagesPerSecond: 10,           // Max messages per second
  rateLimitWindow: 1000,              // Rate limit window (ms)
  
  // Monitoring and logging
  enableSecurityLogging: true,        // Enable security event logging
  logConnectionEvents: true,          // Log connection events
  logMessageEvents: false,            // Log message events (privacy)
  
  // Environment detection - lazy evaluation to avoid ReferenceError in non-browser environments
  get productionIndicators() {
    return [
      typeof process !== 'undefined' && process.env?.NODE_ENV === 'production',
      typeof location !== 'undefined' && location.protocol === 'https:',
      typeof location !== 'undefined' && !location.hostname.includes('localhost'),
      typeof location !== 'undefined' && !location.hostname.includes('127.0.0.1')
    ];
  }
};

/**
 * WebSocket Security Validator
 * Provides validation functions for WebSocket security
 */
export class WebSocketSecurityValidator {
  /**
   * Validate WebSocket URL against security policies
   * @param {string} url - WebSocket URL to validate
   * @param {Object} config - Security configuration
   * @returns {Object} Validation result
   */
  static validateUrl(url, config = WebSocketSecurityConfig) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      sanitizedUrl: null
    };

    try {
      const wsUrl = new URL(url);
      
      // Protocol validation
      this.validateProtocol(wsUrl, config, result);
      
      // Hostname validation
      this.validateHostname(wsUrl, config, result);
      
      // Port validation
      this.validatePort(wsUrl, config, result);
      
      // Path and query validation
      this.validatePathAndQuery(wsUrl, config, result);
      
      // Set sanitized URL if valid
      if (result.valid) {
        result.sanitizedUrl = wsUrl.toString();
      }
      
    } catch (error) {
      result.valid = false;
      result.errors.push(`Invalid URL format: ${error.message}`);
    }

    return result;
  }

  /**
   * Validate WebSocket protocol
   * @private
   */
  static validateProtocol(wsUrl, config, result) {
    const isProduction = this.isProductionEnvironment(config);
    const isSecure = wsUrl.protocol === 'wss:';
    const isInsecure = wsUrl.protocol === 'ws:';

    if (config.enforceSecureProtocol && isProduction && !isSecure) {
      result.valid = false;
      result.errors.push('Insecure WebSocket protocol (ws:) not allowed in production');
    } else if (isInsecure && !config.allowInsecureInDev) {
      result.valid = false;
      result.errors.push('Insecure WebSocket protocol (ws:) not allowed');
    } else if (isInsecure) {
      result.warnings.push('Using insecure WebSocket protocol (ws:). Consider using WSS.');
    }
  }

  /**
   * Validate WebSocket hostname
   * @private
   */
  static validateHostname(wsUrl, config, result) {
    const hostname = wsUrl.hostname.toLowerCase();
    const isProduction = this.isProductionEnvironment(config);

    // Check for localhost in production
    if (config.blockLocalhostInProduction && isProduction && this.isLocalhost(hostname)) {
      result.valid = false;
      result.errors.push('Localhost connections not allowed in production');
    }

    // Check against whitelist
    if (config.allowedHostnames.length > 0 && !config.allowedHostnames.includes(hostname)) {
      result.valid = false;
      result.errors.push(`Hostname ${hostname} not in allowed list`);
    }

    // Check against blacklist
    if (config.blockedHostnames.includes(hostname)) {
      result.valid = false;
      result.errors.push(`Hostname ${hostname} is blocked`);
    }

    // Check for suspicious patterns
    if (this.hasSuspiciousPatterns(hostname)) {
      result.valid = false;
      result.errors.push('Hostname contains suspicious patterns');
    }
  }

  /**
   * Validate WebSocket port
   * @private
   */
  static validatePort(wsUrl, config, result) {
    const port = parseInt(wsUrl.port) || (wsUrl.protocol === 'wss:' ? 443 : 80);

    // Check port range
    if (port < 1 || port > 65535) {
      result.valid = false;
      result.errors.push(`Invalid port: ${port}`);
    }

    // Check against allowed ports
    if (config.allowedPorts.length > 0 && !config.allowedPorts.includes(port)) {
      if (config.blockNonStandardPorts) {
        result.valid = false;
        result.errors.push(`Port ${port} not in allowed list`);
      } else {
        result.warnings.push(`Using non-standard port: ${port}`);
      }
    }
  }

  /**
   * Validate WebSocket path and query parameters
   * @private
   */
  static validatePathAndQuery(wsUrl, config, result) {
    // Check for suspicious patterns in path
    if (this.hasSuspiciousPatterns(wsUrl.pathname)) {
      result.valid = false;
      result.errors.push('Path contains suspicious patterns');
    }

    // Check query parameters
    if (wsUrl.search) {
      const searchParams = wsUrl.searchParams;
      for (const [key, value] of searchParams) {
        if (this.hasSuspiciousPatterns(key) || this.hasSuspiciousPatterns(value)) {
          result.valid = false;
          result.errors.push(`Query parameter contains suspicious patterns: ${key}`);
        }
      }
    }
  }

  /**
   * Validate WebSocket message format
   * @param {Object} message - Message to validate
   * @param {Object} config - Security configuration
   * @returns {Object} Validation result
   */
  static validateMessage(message, config = WebSocketSecurityConfig) {
    const result = {
      valid: true,
      errors: [],
      warnings: []
    };

    try {
      // Check if message is an object
      if (typeof message !== 'object' || message === null) {
        result.valid = false;
        result.errors.push('Message must be an object');
        return result;
      }

      // Check message size
      const messageSize = JSON.stringify(message).length;
      if (messageSize > config.maxMessageSize) {
        result.valid = false;
        result.errors.push(`Message size (${messageSize}) exceeds maximum (${config.maxMessageSize})`);
      }

      // Check message type
      if (config.validateMessageFormat && message.type) {
        if (!config.allowedMessageTypes.includes(message.type)) {
          result.valid = false;
          result.errors.push(`Message type ${message.type} not allowed`);
        }
      }

      // Check for suspicious patterns in message content
      const messageStr = JSON.stringify(message);
      if (this.hasSuspiciousPatterns(messageStr)) {
        result.valid = false;
        result.errors.push('Message contains suspicious patterns');
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(`Message validation error: ${error.message}`);
    }

    return result;
  }

  /**
   * Check if hostname is localhost
   * @private
   */
  static isLocalhost(hostname) {
    const localhostPatterns = [
      'localhost',
      '127.0.0.1',
      '::1',
      '0.0.0.0'
    ];
    
    // Full RFC 1918 private IP ranges:
    // 10.0.0.0 - 10.255.255.255 (10.x.x.x)
    // 172.16.0.0 - 172.31.255.255 (172.16.x.x - 172.31.x.x)
    // 192.168.0.0 - 192.168.255.255 (192.168.x.x)
    return localhostPatterns.includes(hostname) ||
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);
  }

  /**
   * Check for suspicious patterns
   * @private
   */
  static hasSuspiciousPatterns(text) {
    // Use word boundaries or protocol position to avoid matching legitimate URLs
    // e.g., /api/data/endpoint should not match data: protocol
    const suspiciousPatterns = [
      /javascript:/i,
      /data:[^/]/i,           // Only match data: when not followed by / (to avoid matching /api/data/...)
      /vbscript:/i,
      /file:/i,
      /ftp:/i,
      /<script/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i,
      /onmouseover=/i,
      /eval\s*\(/i,
      /function\s*\(/i,
      /alert\s*\(/i,
      /prompt\s*\(/i,
      /confirm\s*\(/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if running in production environment
   * @private
   */
  static isProductionEnvironment(config) {
    return config.productionIndicators.some(indicator => indicator);
  }

  /**
   * Generate security report
   * @param {string} url - WebSocket URL
   * @param {Object} config - Security configuration
   * @returns {Object} Security report
   */
  static generateSecurityReport(url, config = WebSocketSecurityConfig) {
    const validation = this.validateUrl(url, config);
    
    return {
      url: url,
      timestamp: new Date().toISOString(),
      environment: this.isProductionEnvironment(config) ? 'production' : 'development',
      validation: validation,
      config: {
        enforceSecureProtocol: config.enforceSecureProtocol,
        validateCertificates: config.validateCertificates,
        blockLocalhostInProduction: config.blockLocalhostInProduction,
        allowedPorts: config.allowedPorts
      },
      recommendations: this.generateRecommendations(validation, config)
    };
  }

  /**
   * Generate security recommendations
   * @private
   */
  static generateRecommendations(validation, config) {
    const recommendations = [];

    if (!validation.valid) {
      recommendations.push('Fix validation errors before establishing connection');
    }

    if (validation.warnings.length > 0) {
      recommendations.push('Address security warnings for improved security');
    }

    if (validation.sanitizedUrl && !validation.sanitizedUrl.startsWith('wss://')) {
      recommendations.push('Use WSS (secure) protocol for WebSocket connections');
    }

    if (config.allowedCertificateHashes.length === 0) {
      recommendations.push('Consider implementing certificate pinning for enhanced security');
    }

    if (!config.enableRateLimiting) {
      recommendations.push('Enable rate limiting to prevent abuse');
    }

    return recommendations;
  }
}
