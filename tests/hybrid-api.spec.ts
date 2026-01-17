import { test, expect } from '@playwright/test';
import { HybridChatAPI } from '../src/modules/hybrid-api.js';

// Mock WebSocket for testing
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState: number = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  
  sentMessages: string[] = [];

  constructor(url: string) {
    this.url = url;
    // Simulate connection opening after a delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 10);
  }

  send(data: string) {
    this.sentMessages.push(data);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }

  // Helper method for testing
  simulateMessage(data: any) {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }

  simulateError() {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }
}

// Mock global WebSocket
(global as any).WebSocket = MockWebSocket;

test.describe('HybridChatAPI', () => {
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

    // Mock window events
    (global as any).window = {
      dispatchEvent: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    };

    mockLocalStorage = {};
  });

  test.afterEach(async () => {
    if (api) {
      api.disconnect();
    }
  });

  test.describe('Protocol Detection', () => {
    test('should detect WebSocket protocol for wss://', async () => {
      api = new HybridChatAPI({ serverUrl: 'wss://example.com/ws' });
      expect(api.connectionType).toBe('websocket');
    });

    test('should detect WebSocket protocol for ws://', async () => {
      api = new HybridChatAPI({ serverUrl: 'ws://example.com/ws' });
      expect(api.connectionType).toBe('websocket');
    });

    test('should detect JSONP protocol for https://', async () => {
      api = new HybridChatAPI({ serverUrl: 'https://example.com' });
      expect(api.connectionType).toBe('jsonp');
    });

    test('should detect JSONP protocol for http://', async () => {
      api = new HybridChatAPI({ serverUrl: 'http://example.com' });
      expect(api.connectionType).toBe('jsonp');
    });

    test('should default to JSONP for invalid URLs', async () => {
      api = new HybridChatAPI({ serverUrl: 'invalid-url' });
      expect(api.connectionType).toBe('jsonp');
    });

    test('should default to JSONP for empty URL', async () => {
      api = new HybridChatAPI({ serverUrl: '' });
      expect(api.connectionType).toBe('jsonp');
    });
  });

  test.describe('WebSocket Connection', () => {
    test.beforeEach(async () => {
      api = new HybridChatAPI({ serverUrl: 'wss://example.com/ws' });
    });

    test('should initialize WebSocket connection', async () => {
      const initPromise = api.initWebSocket();
      await new Promise(resolve => setTimeout(resolve, 15)); // Wait for connection
      await initPromise;
      
      expect(api.wsConnection).toBeDefined();
      expect(api.wsConnection?.readyState).toBe(MockWebSocket.OPEN);
    });

    test('should handle WebSocket handshake', async () => {
      let handshakeSuccess = false;
      
      api.performHandshake(() => {
        handshakeSuccess = true;
      });
      
      await new Promise(resolve => setTimeout(resolve, 15)); // Wait for connection
      
      // Simulate handshake response
      if (api.wsConnection) {
        (api.wsConnection as any).simulateMessage({
          type: 'handshake',
          status: 'success',
          session_key: 'test-session-key'
        });
      }

      expect(handshakeSuccess).toBe(true);
      expect(mockLocalStorage['chat_session_key']).toBe('test-session-key');
    });

    test('should queue messages when WebSocket is not connected', async () => {
      api.sendMessage('test message', () => {});
      expect(api.messageQueue).toHaveLength(1);
      expect(api.messageQueue[0]).toEqual({
        message: 'test message',
        onResponse: expect.any(Function)
      });
    });

    test('should flush message queue after connection', async () => {
      api.sendMessage('test message', () => {});
      expect(api.messageQueue).toHaveLength(1);

      const initPromise = api.initWebSocket();
      await new Promise(resolve => setTimeout(resolve, 15)); // Wait for connection
      await initPromise;

      expect(api.messageQueue).toHaveLength(0);
      const sentMessage = (api.wsConnection as any).sentMessages.find((msg: string) => {
        const parsed = JSON.parse(msg);
        return parsed.type === 'message' && parsed.payload === 'test message';
      });
      expect(sentMessage).toBeDefined();
      const parsed = JSON.parse(sentMessage);
      expect(parsed.type).toBe('message');
      expect(parsed.payload).toBe('test message');
      expect(parsed.session_key).toBe('');
      expect(typeof parsed.timestamp).toBe('number');
    });
  });

  test.describe('Real-time Features', () => {
    test.beforeEach(async () => {
      api = new HybridChatAPI({ serverUrl: 'wss://example.com/ws' });
    });

    test('should send typing indicator', async () => {
      const initPromise = api.initWebSocket();
      await new Promise(resolve => setTimeout(resolve, 15)); // Wait for connection
      await initPromise;

      api.sendTypingIndicator(true);

      const typingMessage = (api.wsConnection as any).sentMessages.find((msg: string) => {
        const parsed = JSON.parse(msg);
        return parsed.type === 'typing';
      });
      expect(typingMessage).toBeDefined();
      const parsed = JSON.parse(typingMessage);
      expect(parsed.type).toBe('typing');
      expect(parsed.payload.typing).toBe(true);
      expect(parsed.session_key).toBe('');
      expect(typeof parsed.timestamp).toBe('number');
    });

    test('should send read receipt', async () => {
      const initPromise = api.initWebSocket();
      await new Promise(resolve => setTimeout(resolve, 15)); // Wait for connection
      await initPromise;

      api.sendReadReceipt('message-123');

      const readReceiptMessage = (api.wsConnection as any).sentMessages.find((msg: string) => {
        const parsed = JSON.parse(msg);
        return parsed.type === 'read_receipt';
      });
      expect(readReceiptMessage).toBeDefined();
      const parsed = JSON.parse(readReceiptMessage);
      expect(parsed.type).toBe('read_receipt');
      expect(parsed.payload.message_id).toBe('message-123');
      expect(parsed.session_key).toBe('');
      expect(typeof parsed.timestamp).toBe('number');
    });
  });

  test.describe('Message Handling', () => {
    test.beforeEach(async () => {
      api = new HybridChatAPI({ serverUrl: 'wss://example.com/ws' });
    });

    test('should handle incoming messages', async () => {
      let receivedMessage: any = null;
      const initPromise = api.initWebSocket();
      await new Promise(resolve => setTimeout(resolve, 15)); // Wait for connection
      await initPromise;

      api.connect((text: any, sender: any, widgetData: any) => {
        receivedMessage = { text, sender, widgetData };
      });

      // Wait a bit for the connect to set up the onmessage handler
      await new Promise(resolve => setTimeout(resolve, 5));

      if (api.wsConnection) {
        (api.wsConnection as any).simulateMessage({
          type: 'message',
          text: 'Hello from bot',
          sender: 'bot'
        });
        
        // Wait for message to be processed
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      expect(receivedMessage).toEqual({
        text: 'Hello from bot',
        sender: 'bot',
        widgetData: undefined
      });
    });

    test('should handle streaming messages', async () => {
      let receivedMessage: any = null;
      const initPromise = api.initWebSocket();
      await new Promise(resolve => setTimeout(resolve, 15)); // Wait for connection
      await initPromise;

      api.sendMessage('test', (text: any, sender: any, widgetData: any) => {
        receivedMessage = { text, sender, widgetData };
      });

      if (api.wsConnection) {
        (api.wsConnection as any).simulateMessage({
          type: 'message:stream',
          text: 'I am'
        });
      }

      expect(receivedMessage).toEqual({
        text: 'I am',
        sender: 'bot',
        widgetData: undefined
      });
    });
  });

  test.describe('JSONP Fallback', () => {
    test('should use JSONP methods when connection type is jsonp', async () => {
      // Mock document for JSONP tests
      (global as any).document = {
        createElement: () => ({
          src: '',
          onerror: null,
          onload: null
        }),
        body: {
          appendChild: () => {},
          removeChild: () => {},
          contains: () => false
        }
      };

      api = new HybridChatAPI({ serverUrl: 'https://example.com' });
      
      expect(api.connectionType).toBe('jsonp');
      
      // These should call the parent class methods without throwing
      expect(() => api.performHandshake(() => {})).not.toThrow();
      expect(() => api.connect(() => {})).not.toThrow();
      expect(() => api.sendMessage('test', () => {})).not.toThrow();
    });
  });

  test.describe('Test Environment', () => {
    test('should handle test environment correctly', async () => {
      // Mock test environment
      (global as any).window = {
        ...global.window,
        location: {
          hostname: 'localhost',
          port: '32000'
        }
      };

      api = new HybridChatAPI({ serverUrl: 'wss://example.com/ws' });
      
      let handshakeSuccess = false;
      api.performHandshake(() => {
        handshakeSuccess = true;
      });
      
      expect(handshakeSuccess).toBe(true);
      expect(mockLocalStorage['chat_session_key']).toBe('test-session-key');
    });
  });
});
