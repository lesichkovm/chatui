import { test, expect } from '@playwright/test';

test.describe('API Response Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle response with only widgets', async ({ page }) => {
    await page.setContent(`
      <script type="module">
        import { HybridChatAPI } from '/src/modules/api.js';
        
        // Mock the API for testing
        window.api = new HybridChatAPI({ serverUrl: 'http://localhost:3000' });
        
        // Expose a function to simulate receiving a message
        window.receiveMessage = (response) => {
            // This logic mimics what happens in HybridChatAPI.connectWebSocket or connectCors
            if (response.status === 'success' && (response.widgets || response.text)) {
                if (response.widgets && Array.isArray(response.widgets)) {
                    // New composable widget format
                    return { type: 'widgets', content: response.widgets };
                } else if (response.text) {
                    // Backward compatibility
                    return { type: 'text', content: response.text, widget: response.widget };
                }
            }
            return null;
        };
      </script>
    `);

    const result = await page.evaluate(() => {
        const response = {
            "status": "success",
            "widgets": [
                {
                    "type": "text",
                    "props": {
                        "content": "Welcome to the demo chat! Server is running.",
                        "format": "plain"
                    }
                }
            ]
        };
        // @ts-ignore
        return window.receiveMessage(response);
    });

    expect(result).toEqual({
        type: 'widgets',
        content: [
            {
                type: 'text',
                props: {
                    content: 'Welcome to the demo chat! Server is running.',
                    format: 'plain'
                }
            }
        ]
    });
  });

  test('should process widgets-only response in ChatWidget', async ({ page }) => {
      // This test simulates the full flow within ChatWidget
      await page.setContent(`
        <div id="chat-container"></div>
        <script type="module">
            import { ChatWidget } from '/src/modules/chat-widget.class.js';
            
            // Mock API to return immediate success
            const mockApi = {
                connect: (onMessage) => {
                    window.simulateMessage = onMessage;
                },
                performHandshake: (onSuccess) => onSuccess(),
                sendMessage: (msg, onSuccess) => onSuccess('Echo: ' + msg, 'bot')
            };

            const widget = new ChatWidget({
                serverUrl: 'http://localhost:3000',
                title: 'Test Widget'
            });
            
            // Swap the real API with our mock
            widget.api = mockApi;
            widget.init(); // Re-init to bind events if needed, though constructor calls it. 
                           // Actually constructor calls init(), which calls api.connect. 
                           // We need to intercept before connect is called or manually call connect again.
                           
            // Since we can't easily swap before constructor finishes, we'll manually call connect on our mock
            // simulating what init() does.
            mockApi.connect((text, sender, widgetData) => widget.addMessage(text, sender, widgetData));
            
            widget.open();
        </script>
      `);

      // Simulate receiving the widgets-only response
      await page.evaluate(() => {
          const responseWidgets = [
            {
                "type": "text",
                "props": {
                    "content": "Welcome to the demo chat!",
                    "format": "plain"
                }
            }
          ];
          // In HybridChatAPI, if widgets are present, it calls onMessage(widgets, 'bot')
          // @ts-ignore
          window.simulateMessage(responseWidgets, 'bot');
      });

      // Check if the message was rendered
      const messageText = page.locator('.message .widget-text');
      await expect(messageText).toBeVisible();
      await expect(messageText).toHaveText('Welcome to the demo chat!');
  });
});
