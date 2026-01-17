import { test, expect } from '@playwright/test';
import { HybridChatAPI } from '../src/modules/api.js';

// Mock fetch for CORS failure simulation
class MockResponse {
  status: number;
  statusText: string;
  headers: Map<string, string>;
  body: string;

  constructor(data: any, status = 200, statusText = 'OK') {
    this.status = status;
    this.statusText = statusText;
    this.headers = new Map();
    this.headers.set('content-type', 'application/json');
    this.body = JSON.stringify(data);
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }

  ok() {
    return this.status >= 200 && this.status < 300;
  }
}

test.describe('CORS Fallback Tests', () => {
  let api: HybridChatAPI;

  test.describe('API Type Detection', () => {
    test('should use CORS by default for HTTP URLs', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com'
      });

      expect(api.apiType).toBe('cors');
      expect(api.connectionType).toBe('http');
    });

    test('should use JSONP when forceJsonP is true', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        forceJsonP: true
      });

      expect(api.apiType).toBe('jsonp');
      expect(api.connectionType).toBe('http');
    });

    test('should use JSONP when preferJsonP is true', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        preferJsonP: true
      });

      expect(api.apiType).toBe('jsonp');
      expect(api.connectionType).toBe('http');
    });

    test('should use websocket for WebSocket URLs', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'wss://example.com/ws'
      });

      expect(api.connectionType).toBe('websocket');
      expect(api.apiType).toBe('websocket');
    });
  });

  test.describe('Error Detection', () => {
    test('should detect CORS errors correctly', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com'
      });

      // Test CORS error detection
      const corsError = new Error('CORS_ERROR: Failed to fetch');
      expect(api.shouldFallbackToJSONP(corsError)).toBe(true);

      // Test network error detection
      const networkError = new Error('Failed to fetch');
      expect(api.shouldFallbackToJSONP(networkError)).toBe(true);

      // Test timeout error (should not fallback)
      const timeoutError = new Error('TIMEOUT_ERROR: Request timed out');
      expect(api.shouldFallbackToJSONP(timeoutError)).toBe(false);

      // Test generic error (should not fallback)
      const genericError = new Error('Some other error');
      expect(api.shouldFallbackToJSONP(genericError)).toBe(false);
    });

    test('should respect retry limit in error detection', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        fallbackRetries: 2
      });

      const corsError = new Error('CORS_ERROR: Failed to fetch');

      // Should fallback when under limit
      expect(api.shouldFallbackToJSONP(corsError)).toBe(true);
      expect(api.fallbackAttempts).toBe(0); // Not incremented yet

      // Simulate the fallback
      api.fallbackToJSONP();
      expect(api.fallbackAttempts).toBe(1);

      // Should fallback again when still under limit
      expect(api.shouldFallbackToJSONP(corsError)).toBe(true);
      api.fallbackToJSONP();
      expect(api.fallbackAttempts).toBe(2);

      // Should not fallback when at limit
      expect(api.shouldFallbackToJSONP(corsError)).toBe(false);
      expect(api.fallbackAttempts).toBe(2);
    });
  });
});
