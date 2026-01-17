import { test, expect } from '@playwright/test';
import { HybridChatAPI } from '../src/modules/hybrid-api.js';

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
  let mockLocalStorage: { [key: string]: string } = {};

  test.beforeEach(async () => {
    // Mock localStorage
    (global as any).localStorage = {
      getItem: (key: string) => mockLocalStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockLocalStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockLocalStorage[key];
      },
      clear: () => {
        mockLocalStorage = {};
      },
      length: 0,
      key: () => null
    };

    // Mock document for JSONP tests
    (global as any).document = {
      createElement: (tagName: string) => {
        if (tagName === 'script') {
          return {
            src: '',
            onerror: null,
            onload: null,
            parentNode: null
          };
        }
        return {};
      },
      body: {
        appendChild: () => {},
        removeChild: () => {},
        contains: () => false
      }
    };

    mockLocalStorage = {};
  });

  test.describe('CORS to JSONP Fallback', () => {
    test('should fallback to JSONP when CORS fails', async () => {
      // Mock CORS failure
      (global as any).fetch = () => Promise.reject(
        new TypeError('Failed to fetch')
      );

      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        debug: true
      });

      expect(api.apiType).toBe('cors');

      let handshakeSuccess = false;
      let fallbackTriggered = false;

      // Mock console.warn to detect fallback
      const originalWarn = console.warn;
      console.warn = (message: string) => {
        if (message.includes('Falling back to JSONP')) {
          fallbackTriggered = true;
        }
      };

      await new Promise<void>((resolve) => {
        api.performHandshake(() => {
          handshakeSuccess = true;
          resolve();
        });
      });

      // Restore console.warn
      console.warn = originalWarn;

      expect(fallbackTriggered).toBe(true);
      expect(api.apiType).toBe('jsonp');
      expect(handshakeSuccess).toBe(true);
    });

    test('should not fallback when CORS succeeds', async () => {
      // Mock CORS success
      (global as any).fetch = () => Promise.resolve(
        new MockResponse({ status: 'success', session_key: 'test-key' })
      );

      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        debug: true
      });

      expect(api.apiType).toBe('cors');

      let handshakeSuccess = false;
      let fallbackTriggered = false;

      // Mock console.warn to detect fallback
      const originalWarn = console.warn;
      console.warn = (message: string) => {
        if (message.includes('Falling back to JSONP')) {
          fallbackTriggered = true;
        }
      };

      await new Promise<void>((resolve) => {
        api.performHandshake(() => {
          handshakeSuccess = true;
          resolve();
        });
      });

      // Restore console.warn
      console.warn = originalWarn;

      expect(fallbackTriggered).toBe(false);
      expect(api.apiType).toBe('cors');
      expect(handshakeSuccess).toBe(true);
      expect(mockLocalStorage['chat_session_key']).toBe('test-key');
    });

    test('should respect fallback retry limit', async () => {
      // Mock CORS failure
      (global as any).fetch = () => Promise.reject(
        new TypeError('Failed to fetch')
      );

      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        fallbackRetries: 1
      });

      expect(api.apiType).toBe('cors');

      // First attempt should trigger fallback
      let fallbackCount = 0;
      const originalWarn = console.warn;
      console.warn = (message: string) => {
        if (message.includes('Falling back to JSONP')) {
          fallbackCount++;
        }
      };

      await new Promise<void>((resolve) => {
        api.performHandshake(() => resolve());
      });

      console.warn = originalWarn;

      expect(fallbackCount).toBe(1);
      expect(api.apiType).toBe('jsonp');
      expect(api.fallbackAttempts).toBe(1);
    });

    test('should force JSONP when configured', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        forceJsonP: true
      });

      expect(api.apiType).toBe('jsonp');
      expect(api.connectionType).toBe('http');

      // Should not attempt CORS at all
      let fetchCalled = false;
      (global as any).fetch = () => {
        fetchCalled = true;
        return Promise.resolve(new MockResponse({}));
      };

      await new Promise<void>((resolve) => {
        api.performHandshake(() => resolve());
      });

      expect(fetchCalled).toBe(false);
    });

    test('should prefer JSONP when configured', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'https://example.com',
        preferJsonP: true
      });

      expect(api.apiType).toBe('jsonp');
      expect(api.connectionType).toBe('http');

      // Should not attempt CORS at all
      let fetchCalled = false;
      (global as any).fetch = () => {
        fetchCalled = true;
        return Promise.resolve(new MockResponse({}));
      };

      await new Promise<void>((resolve) => {
        api.performHandshake(() => resolve());
      });

      expect(fetchCalled).toBe(false);
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
      expect(api.fallbackAttempts).toBe(1);

      // Should fallback again when still under limit
      expect(api.shouldFallbackToJSONP(corsError)).toBe(true);
      expect(api.fallbackAttempts).toBe(2);

      // Should not fallback when at limit
      expect(api.shouldFallbackToJSONP(corsError)).toBe(false);
      expect(api.fallbackAttempts).toBe(2);
    });
  });

  test.describe('WebSocket Protocol', () => {
    test('should not use CORS for WebSocket connections', async () => {
      api = new HybridChatAPI({ 
        serverUrl: 'wss://example.com/ws'
      });

      expect(api.connectionType).toBe('websocket');
      expect(api.apiType).toBeUndefined(); // WebSocket doesn't use apiType

      // Should not attempt fetch for WebSocket
      let fetchCalled = false;
      (global as any).fetch = () => {
        fetchCalled = true;
        return Promise.resolve(new MockResponse({}));
      };

      await new Promise<void>((resolve) => {
        api.performHandshake(() => resolve());
      });

      expect(fetchCalled).toBe(false);
    });
  });
});
