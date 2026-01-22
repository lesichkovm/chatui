import { test, expect } from '@playwright/test';

test.describe('ChatWidget Input Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a demo page that loads the widget
    await page.goto('/demo/full_page.htm');
  });

  test('should successfully send message from input widget', async ({ page }) => {
    // 1. Initialize ChatWidget and Mock API
    await page.evaluate(() => {
        // Debug: Log what is available on window
        console.log('window keys:', Object.keys(window).filter(k => k.includes('Chat') || k.includes('Widget')));
        
        // Create a dummy script element for initialization if needed, 
        // or just pass a config object since the factory supports it
        // based on entry.js: window.createChatWidget = function(scriptElement) { return new ChatWidget(scriptElement); };
        // and ChatWidget constructor handles objects too.
        
        // Let's rely on the global createChatWidget existing
        // @ts-ignore
        if (!window.createChatWidget) {
            throw new Error('window.createChatWidget is not defined');
        }

        // Create a test instance
        const config = {
            id: 'test-widget',
            serverUrl: 'http://localhost:3000'
        };
        // @ts-ignore
        // ChatUI.init is a factory function, not a constructor
        const widget = window.ChatUI.init(config);
        
        // Mock the API to track sent messages
        const messages: string[] = [];
        // @ts-ignore
        window.sentMessages = messages;
        
        // Mock the sendMessage method to capture calls
        widget.api.sendMessage = (message: string, onSuccess: (response: string, sender: string) => void, onError: (error: Error) => void) => {
            messages.push(message);
            // Call original to maintain behavior if needed, or just mock success
            if (typeof message !== 'string') {
               // Simulate the validation error we saw
               onError(new Error('Invalid message type: message must be a string'));
            } else {
               if (onSuccess) onSuccess('Echo: ' + message, 'bot');
            }
        };

        // Create a fake input interaction event
        // This simulates what InputWidget does: this.handleInteraction({ value: 'test-value' ... })
        const interactionEvent = {
            value: 'test-input-value',
            inputType: 'text',
            widgetType: 'input'
        };

        // Trigger the handleWidgetInteraction method directly to test the integration logic
        widget.handleWidgetInteraction(interactionEvent);
    });

    // 2. Verify the message was sent correctly
    // @ts-ignore
    const sentMessages = await page.evaluate(() => window.sentMessages);
    
    // The bug was that it was sending undefined (because it looked for optionValue)
    // The fix ensures it sends 'test-input-value'
    expect(sentMessages).toHaveLength(1);
    expect(sentMessages[0]).toBe('test-input-value');
  });
});
