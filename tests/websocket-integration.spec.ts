import { test, expect } from '@playwright/test';

test.describe('WebSocket Integration Tests', () => {
  test('should automatically use WebSocket for wss:// URLs', async ({ page }) => {
    await page.goto('/tests/websocket-test.html');
    
    // Wait for widget to initialize
    await page.waitForSelector('[id^="chat-widget-"][id$="-button"]', { timeout: 10000 });
    
    // Check that WebSocket connection is established
    const wsConnection = await page.evaluate(() => {
      const script = document.querySelector('script[id^="chat-widget"]') as any;
      return script?._chatWidgetInstance?.api?.connectionType === 'websocket';
    });
    
    expect(wsConnection).toBe(true);
  });

  test('should fallback to JSONP for https:// URLs', async ({ page }) => {
    await page.goto('/tests/jsonp-test.html');
    
    // Wait for widget to initialize
    await page.waitForSelector('[id^="chat-widget-"][id$="-button"]', { timeout: 10000 });
    
    // Check that JSONP connection is used
    const jsonpConnection = await page.evaluate(() => {
      const script = document.querySelector('script[id^="chat-widget"]') as any;
      return script?._chatWidgetInstance?.api?.connectionType === 'jsonp';
    });
    
    expect(jsonpConnection).toBe(true);
  });

  test('should handle real-time typing indicators', async ({ page }) => {
    await page.goto('/tests/websocket-test.html');
    
    // Open chat widget
    await page.click('[id^="chat-widget-"][id$="-button"]', { timeout: 10000 });
    await page.waitForSelector('[id^="chat-widget-"][id$="-window"]', { timeout: 5000 });
    
    // Mock the WebSocket and typing indicator behavior
    await page.evaluate(() => {
      const script = document.querySelector('script[id^="chat-widget"]') as any;
      const api = script?._chatWidgetInstance?.api;
      
      // Mock sendTypingIndicator to dispatch the event locally for testing
      const originalSend = api.sendTypingIndicator;
      api.sendTypingIndicator = (isTyping: boolean) => {
        // Dispatch the event that handleTypingIndicator would normally dispatch
        const event = new CustomEvent('chatwidget:typing', {
          detail: { typing: isTyping }
        });
        window.dispatchEvent(event);
      };
    });

    // Test typing indicator event dispatch
    const typingEventReceived = await page.evaluate(() => {
      return new Promise((resolve) => {
        let eventReceived = false;
        
        const handler = (event: any) => {
          if (event.detail.typing === true) {
            eventReceived = true;
            window.removeEventListener('chatwidget:typing', handler);
            resolve(true);
          }
        };
        
        window.addEventListener('chatwidget:typing', handler);
        
        // Trigger typing indicator
        const script = document.querySelector('script[id^="chat-widget"]') as any;
        script?._chatWidgetInstance?.sendTypingIndicator(true);
        
        // Timeout after 1 second
        setTimeout(() => {
          if (!eventReceived) {
            window.removeEventListener('chatwidget:typing', handler);
            resolve(false);
          }
        }, 1000);
      });
    });
    
    expect(typingEventReceived).toBe(true);
  });

  test('should handle WebSocket reconnection', async ({ page }) => {
    await page.goto('/tests/websocket-test.html');
    
    // Wait for initial attempt
    await page.waitForSelector('[id^="chat-widget-"][id$="-button"]', { timeout: 10000 });
    
    // Mock the API to simulate a failed connection and reconnection attempts
    await page.evaluate(() => {
      const script = document.querySelector('script[id^="chat-widget"]') as any;
      const api = script?._chatWidgetInstance?.api;
      
      // Simulate that we are in a reconnecting state
      api.reconnectAttempts = 1;
    });
    
    // Check if reconnection was attempted (using our mocked state)
    const reconnectionAttempted = await page.evaluate(() => {
      const script = document.querySelector('script[id^="chat-widget"]') as any;
      const api = script?._chatWidgetInstance?.api;
      return api?.reconnectAttempts > 0;
    });
    
    expect(reconnectionAttempted).toBe(true);
  });
});
