import { test, expect } from '@playwright/test';
import { CorsAPI } from '../src/modules/cors-api.js';

// Mock fetch for testing
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

  get header() {
    return (name: string) => this.headers.get(name) || null;
  }
}

// Mock fetch function
let mockFetch: any = null;
let mockAbortController: any = null;

test.describe('CorsAPI', () => {
  let api: CorsAPI;
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

    // Mock AbortController
    mockAbortController = {
      abort: () => {}
    };
    (global as any).AbortController = function() {
      return mockAbortController;
    };

    mockLocalStorage = {};
  });

  test.describe('Initialization', () => {
    test('should initialize with default config', async () => {
      api = new CorsAPI({ serverUrl: 'https://example.com' });
      expect(api.serverUrl).toBe('https://example.com');
      expect(api.debug).toBe(false);
      expect(api.timeout).toBe(5000);
    });

    test('should initialize with custom config', async () => {
      api = new CorsAPI({ 
        serverUrl: 'https://example.com',
        debug: true,
        timeout: 10000
      });
      expect(api.serverUrl).toBe('https://example.com');
      expect(api.debug).toBe(true);
      expect(api.timeout).toBe(10000);
    });
  });

  test.describe('Session Management', () => {
    test.beforeEach(async () => {
      api = new CorsAPI({ serverUrl: 'https://example.com' });
    });

    test('should get and set session key', async () => {
      expect(api.getSessionKey()).toBe('');
      
      api.setSessionKey('test-session-key');
      expect(api.getSessionKey()).toBe('test-session-key');
      expect(mockLocalStorage['chat_session_key']).toBe('test-session-key');
    });

    test('should handle missing session key', async () => {
      expect(api.getSessionKey()).toBe('');
    });
  });

  test.describe('Test Environment Detection', () => {
    test('should detect test environment', async () => {
      (global as any).window = {
        location: {
          hostname: 'localhost',
          port: '32000'
        }
      };

      api = new CorsAPI({ serverUrl: 'https://example.com' });
      expect(api.isTestEnvironment()).toBe(true);
    });

    test('should not detect production environment as test', async () => {
      (global as any).window = {
        location: {
          hostname: 'example.com',
          port: '443'
        }
      };

      api = new CorsAPI({ serverUrl: 'https://example.com' });
      expect(api.isTestEnvironment()).toBe(false);
    });

    test('should handle missing window object', async () => {
      delete (global as any).window;
      
      api = new CorsAPI({ serverUrl: 'https://example.com' });
      expect(api.isTestEnvironment()).toBe(false);
    });
  });

  test.describe('HTTP Requests', () => {
    test.beforeEach(async () => {
      api = new CorsAPI({ serverUrl: 'https://example.com' });
      
      // Mock successful fetch
      mockFetch = () => Promise.resolve(
        new MockResponse({ status: 'success', session_key: 'test-key' })
      );
      (global as any).fetch = mockFetch;
    });

    test('should perform successful handshake', async () => {
      let handshakeSuccess = false;
      
      await new Promise<void>((resolve) => {
        api.performHandshake(() => {
          handshakeSuccess = true;
          resolve();
        }, () => {});
      });

      expect(handshakeSuccess).toBe(true);
      expect(mockLocalStorage['chat_session_key']).toBe('test-key');
    });

    test('should handle connect request', async () => {
      mockLocalStorage['chat_session_key'] = 'test-session-key';
      
      // Mock connect response
      mockFetch = () => Promise.resolve(
        new MockResponse({ text: 'Hello from bot', sender: 'bot' })
      );
      (global as any).fetch = mockFetch;
      
      let connectMessage: any = null;
      
      await new Promise<void>((resolve) => {
        api.connect((text: string, sender: string, widget: any) => {
          connectMessage = { text, sender, widget };
          resolve();
        }, () => {});
      });

      expect(connectMessage).toEqual({
        text: 'Hello from bot',
        sender: 'bot',
        widget: undefined
      });
    });

    test('should send message', async () => {
      mockLocalStorage['chat_session_key'] = 'test-session-key';
      
      // Mock message response
      mockFetch = () => Promise.resolve(
        new MockResponse({ text: 'Bot response', sender: 'bot' })
      );
      (global as any).fetch = mockFetch;
      
      let responseMessage: any = null;
      
      await new Promise<void>((resolve) => {
        api.sendMessage('Hello bot', (text: string, sender: string, widget: any) => {
          responseMessage = { text, sender, widget };
          resolve();
        }, () => {});
      });

      expect(responseMessage).toEqual({
        text: 'Bot response',
        sender: 'bot',
        widget: undefined
      });
    });

    test('should handle widget data in responses', async () => {
      // Mock widget response
      mockFetch = () => Promise.resolve(
        new MockResponse({ 
          text: 'Select an option',
          widget: { type: 'buttons', options: [{ id: '1', text: 'Option 1' }] }
        })
      );
      (global as any).fetch = mockFetch;

      let responseMessage: any = null;
      
      await new Promise<void>((resolve) => {
        api.sendMessage('show buttons', (text: string, sender: string, widget: any) => {
          responseMessage = { text, sender, widget };
          resolve();
        }, () => {});
      });

      expect(responseMessage).toEqual({
        text: 'Select an option',
        sender: 'bot',
        widget: { type: 'buttons', options: [{ id: '1', text: 'Option 1' }] }
      });
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async () => {
      api = new CorsAPI({ serverUrl: 'https://example.com' });
    });

    test('should handle CORS errors', async () => {
      // Mock CORS error
      mockFetch = () => Promise.reject(
        new TypeError('Failed to fetch')
      );
      (global as any).fetch = mockFetch;

      let errorCalled = false;
      let errorDetails: Error | null = null;

      await new Promise<void>((resolve) => {
        api.performHandshake(
          () => resolve(),
          (error: any) => {
            errorCalled = true;
            errorDetails = error;
            resolve();
          }
        );
      });

      expect(errorCalled).toBe(true);
      expect(errorDetails?.message).toContain('CORS_ERROR');
    });

    test('should handle timeout errors', async () => {
      // Mock timeout
      mockFetch = () => 
        new Promise((_, reject) => {
          setTimeout(() => reject(new DOMException('AbortError', 'AbortError')), 100);
        });
      (global as any).fetch = mockFetch;

      let errorCalled = false;
      let errorDetails: Error | null = null;

      await new Promise<void>((resolve) => {
        api.performHandshake(
          () => resolve(),
          (error: any) => {
            errorCalled = true;
            errorDetails = error;
            resolve();
          }
        );
      });

      expect(errorCalled).toBe(true);
      expect(errorDetails?.message).toContain('TIMEOUT_ERROR');
    });

    test('should handle HTTP errors', async () => {
      // Mock HTTP 500 error
      mockFetch = () => Promise.resolve(
        new MockResponse({ error: 'Server error' }, 500, 'Internal Server Error')
      );
      (global as any).fetch = mockFetch;

      let errorCalled = false;
      let errorDetails: Error | null = null;

      await new Promise<void>((resolve) => {
        api.performHandshake(
          () => resolve(),
          (error: any) => {
            errorCalled = true;
            errorDetails = error;
            resolve();
          }
        );
      });

      expect(errorCalled).toBe(true);
      expect(errorDetails?.message).toContain('HTTP 500');
    });

    test('should handle invalid content type', async () => {
      // Mock non-JSON response
      mockFetch = () => Promise.resolve({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => name === 'content-type' ? 'text/html' : null
        },
        json: () => Promise.reject(new Error('Invalid JSON'))
      });
      (global as any).fetch = mockFetch;

      let errorCalled = false;
      let errorDetails: Error | null = null;

      await new Promise<void>((resolve) => {
        api.performHandshake(
          () => resolve(),
          (error: any) => {
            errorCalled = true;
            errorDetails = error;
            resolve();
          }
        );
      });

      expect(errorCalled).toBe(true);
      expect(errorDetails?.message).toContain('Invalid response content type');
    });
  });

  test.describe('Test Environment Behavior', () => {
    test.beforeEach(async () => {
      (global as any).window = {
        location: {
          hostname: 'localhost',
          port: '32000'
        }
      };

      api = new CorsAPI({ serverUrl: 'https://example.com' });
    });

    test('should use test session key in test environment', async () => {
      let handshakeSuccess = false;
      
      await new Promise<void>((resolve) => {
        api.performHandshake(() => {
          handshakeSuccess = true;
          resolve();
        }, () => {});
      });

      expect(handshakeSuccess).toBe(true);
      expect(mockLocalStorage['chat_session_key']).toBe('test-session-key');
    });

    test('should simulate delayed response in test environment', async () => {
      let responseReceived = false;
      let responseText = '';

      const startTime = Date.now();
      
      await new Promise<void>((resolve) => {
        api.sendMessage('test message', (text: string) => {
          responseText = text;
          responseReceived = true;
          resolve();
        });
      });

      const endTime = Date.now();
      
      expect(responseReceived).toBe(true);
      expect(responseText).toBe('Test response to: test message');
      expect(endTime - startTime).toBeGreaterThanOrEqual(100); // Should have delay
    });

    test('should not make actual requests in test environment', async () => {
      let fetchCalled = false;
      mockFetch = () => {
        fetchCalled = true;
        return Promise.resolve(new MockResponse({}));
      };
      (global as any).fetch = mockFetch;

      await new Promise<void>((resolve) => {
        api.performHandshake(() => resolve(), () => {});
      });

      expect(fetchCalled).toBe(false);
    });
  });

  test.describe('Timeout Handling', () => {
    test('should abort request on timeout', async () => {
      api = new CorsAPI({ serverUrl: 'https://example.com', timeout: 100 });

      // Mock slow request
      mockFetch = () => 
        new Promise((resolve) => {
          setTimeout(() => resolve(new MockResponse({ status: 'success' })), 200);
        });
      (global as any).fetch = mockFetch;

      let errorCalled = false;
      let abortCalled = false;
      
      // Track abort calls
      const originalAbort = mockAbortController.abort;
      mockAbortController.abort = () => {
        abortCalled = true;
        originalAbort();
      };
      
      await new Promise<void>((resolve) => {
        api.performHandshake(
          () => resolve(),
          (error: Error) => {
            errorCalled = true;
            resolve();
          }
        );
      });

      expect(errorCalled).toBe(true);
      expect(abortCalled).toBe(true);
    });
  });
});
