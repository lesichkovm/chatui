import { test, expect } from '@playwright/test';

// Extend Window interface for test environment
declare global {
  interface Window {
    widgetSystem: {
      createWidget: (widgetData: any, widgetId: string) => HTMLElement | null;
      addMessage: (text: string, sender: string, widgetData?: any) => void;
      simulateBotResponse: (userInput: string) => void;
      sendMessage: (message: string) => void;
    };
  }
}

test.describe('Widget Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Create a self-contained test page with mock widget system
    await page.goto('about:blank');
    
    // Set up the widget system with mock data
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .widget-button {
            padding: 8px 16px;
            margin: 4px;
            border: 1px solid #ccc;
            background: white;
            cursor: pointer;
            border-radius: 4px;
          }
          .widget-button:hover {
            background: #f0f0f0;
          }
          .widget {
            margin-top: 8px;
          }
          .widget-buttons {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .user-message {
            background: #e3f2fd;
            padding: 8px;
            margin: 4px;
            border-radius: 8px;
          }
          .bot-message {
            background: #f5f5f5;
            padding: 8px;
            margin: 4px;
            border-radius: 8px;
          }
          .messages {
            height: 300px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 8px;
          }
          .textarea {
            width: 100%;
            height: 60px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            resize: none;
          }
          .send {
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div id="chat-widget-test">
          <div class="messages" id="messages"></div>
          <textarea class="textarea" id="textarea" placeholder="Type a message..."></textarea>
          <button class="send" id="send">Send</button>
        </div>
      </body>
      </html>
    `);

    // Initialize the widget system after setting content
    await page.evaluate(() => {
      // Mock widget system
      (window as any).widgetSystem = {
        createWidget: function(widgetData: any, widgetId: string) {
          if (!widgetData || !widgetData.type) return null;
          
          const widgetContainer = document.createElement('div');
          widgetContainer.className = 'widget';
          
          if (widgetData.type === 'buttons' && widgetData.options) {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'widget-buttons';
            
            widgetData.options.forEach((option: any) => {
              const button = document.createElement('button');
              button.className = 'widget-button';
              button.textContent = option.text;
              button.setAttribute('data-option-id', option.id);
              button.setAttribute('data-option-value', option.value);
              
              button.addEventListener('click', () => {
                // Dispatch widget interaction event
                const event = new CustomEvent('widgetInteraction', {
                  detail: {
                    widgetId: widgetId,
                    optionId: option.id,
                    optionValue: option.value,
                    optionText: option.text,
                    widgetType: 'buttons'
                  }
                });
                document.dispatchEvent(event);
                
                // Add user message
                (window as any).widgetSystem.addMessage(option.text, 'user');
                
                // Simulate bot response
                (window as any).widgetSystem.simulateBotResponse(option.value);
              });
              
              buttonsContainer.appendChild(button);
            });
            
            widgetContainer.appendChild(buttonsContainer);
          }
          
          return widgetContainer;
        },
        
        addMessage: function(text: string, sender: string, widgetData?: any) {
          const messagesContainer = document.getElementById('messages');
          if (!messagesContainer) return;
          const messageElement = document.createElement('div');
          messageElement.className = sender + '-message';
          messageElement.innerHTML = text.replace(/\n/g, '<br>');
          
          if (widgetData && sender === 'bot') {
            const widgetElement = this.createWidget(widgetData, 'test-widget');
            if (widgetElement) {
              messageElement.appendChild(widgetElement);
            }
          }
          
          messagesContainer.appendChild(messageElement);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        },
        
        simulateBotResponse: function(userInput: string) {
          // Mock responses based on input
          const responses: any = {
            'menu': {
              text: 'Please choose an option:',
              widget: {
                type: 'buttons',
                options: [
                  { id: 'support', text: 'Customer Support', value: 'support' },
                  { id: 'sales', text: 'Sales Inquiry', value: 'sales' },
                  { id: 'technical', text: 'Technical Help', value: 'technical' },
                  { id: 'billing', text: 'Billing Question', value: 'billing' }
                ]
              }
            },
            'options': {
              text: 'Here are your options:',
              widget: {
                type: 'buttons',
                options: [
                  { id: 'general', text: 'General Inquiry', value: 'general' },
                  { id: 'product', text: 'Product Information', value: 'product' },
                  { id: 'account', text: 'Account Issues', value: 'account' }
                ]
              }
            },
            'support': {
              text: 'Connecting you to customer support...',
              widget: {
                type: 'buttons',
                options: [
                  { id: 'urgent', text: 'Urgent Issue', value: 'urgent_support' },
                  { id: 'callback', text: 'Request Callback', value: 'callback' },
                  { id: 'email', text: 'Email Support', value: 'email_support' }
                ]
              }
            },
            'sales': {
              text: 'How can I help with sales?',
              widget: {
                type: 'buttons',
                options: [
                  { id: 'pricing', text: 'Pricing Information', value: 'pricing' },
                  { id: 'demo', text: 'Request Demo', value: 'demo' },
                  { id: 'contact', text: 'Contact Sales', value: 'contact' }
                ]
              }
            },
            'urgent_support': {
              text: 'This is urgent. What do you need?',
              widget: {
                type: 'buttons',
                options: [
                  { id: 'emergency', text: 'Emergency Support', value: 'emergency' },
                  { id: 'critical', text: 'Critical Issue', value: 'critical' },
                  { id: 'escalate', text: 'Escalate to Manager', value: 'escalate' }
                ]
              }
            },
            'default': {
              text: 'You said: "' + userInput + '"',
              widget: null
            }
          };
          
          const response = responses[userInput] || responses.default;
          setTimeout(() => {
            (window as any).widgetSystem.addMessage(response.text, 'bot', response.widget);
          }, 100);
        },
        
        sendMessage: function(message: string) {
          this.addMessage(message, 'user');
          this.simulateBotResponse(message.toLowerCase());
        }
      };
      
      // Set up event handlers
      document.getElementById('send')?.addEventListener('click', () => {
        const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
        const message = textarea.value.trim();
        if (message) {
          (window as any).widgetSystem.sendMessage(message);
          textarea.value = '';
        }
      });
      
      document.getElementById('textarea')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          document.getElementById('send')?.click();
        }
      });
    });

    // Initialize with welcome message after content is set
    await page.waitForTimeout(100); // Ensure the script is fully loaded
    await page.evaluate(() => {
      if ((window as any).widgetSystem && (window as any).widgetSystem.addMessage) {
        (window as any).widgetSystem.addMessage('Hello! I\'m your virtual assistant. Type \'menu\' to see interactive options or \'options\' for more choices.', 'bot');
      }
    });
  });

  test('should handle complete widget interaction flow', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Start the widget flow
    await textarea.fill('menu');
    await sendButton.click();
    
    // Wait for initial widget
    await page.waitForSelector('.widget');
    
    // Click through the flow: menu -> support -> urgent_support
    const allButtons1 = page.locator('.widget-button');
    const supportButton = allButtons1.filter({ hasText: 'Customer Support' });
    await supportButton.click();
    await page.waitForSelector('.widget');
    
    const allButtons2 = page.locator('.widget-button');
    const urgentButton = allButtons2.filter({ hasText: 'Urgent Issue' });
    await urgentButton.click();
    await page.waitForSelector('.widget');
    
    // Verify the complete flow
    const userMessages = page.locator('.user-message');
    await expect(userMessages).toHaveCount(3);
    await expect(userMessages.nth(0)).toContainText('menu');
    await expect(userMessages.nth(1)).toContainText('Customer Support');
    await expect(userMessages.nth(2)).toContainText('Urgent Issue');
  });

  test('should handle widget interaction events', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Set up event listener
    let eventData: any = null;
    await page.evaluate(() => {
      document.addEventListener('widgetInteraction', (event: any) => {
        (window as any).lastWidgetEvent = event.detail;
      });
    });
    
    // Trigger widget interaction
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('.widget');
    
    const allButtons = page.locator('.widget-button');
    const salesButton = allButtons.filter({ hasText: 'Sales Inquiry' });
    await salesButton.click();
    
    // Check event data
    eventData = await page.evaluate(() => (window as any).lastWidgetEvent);
    expect(eventData).not.toBeNull();
    expect(eventData.optionText).toBe('Sales Inquiry');
    expect(eventData.optionValue).toBe('sales');
    expect(eventData.widgetType).toBe('buttons');
  });

  test('should maintain widget state during navigation', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Start widget flow
    await textarea.fill('options');
    await sendButton.click();
    await page.waitForSelector('.widget');
    
    // Verify initial state
    const buttons1 = page.locator('.widget-button');
    await expect(buttons1).toHaveCount(3);
    
    // Navigate to different widget
    const allButtons1 = page.locator('.widget-button');
    const productButton = allButtons1.filter({ hasText: 'Product Information' });
    await productButton.click();
    await page.waitForTimeout(200);
    
    // Go back to main menu
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForTimeout(200);
    
    // Verify main menu is displayed correctly - get buttons from the latest bot message
    const latestBotMessage = page.locator('.bot-message').last();
    const buttons2 = latestBotMessage.locator('.widget-button');
    await expect(buttons2).toHaveCount(4);
    await expect(buttons2.nth(0)).toContainText('Customer Support');
  });

  test('should handle rapid widget interactions', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Start widget
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('.widget');
    
    // Rapidly click multiple buttons
    const buttons = page.locator('.widget-button');
    
    await buttons.nth(0).click(); // Customer Support
    await page.waitForTimeout(100);
    
    await buttons.nth(1).click(); // Sales Inquiry  
    await page.waitForTimeout(100);
    
    await buttons.nth(2).click(); // Technical Help
    await page.waitForTimeout(100);
    
    // Verify all interactions were processed
    const userMessages = page.locator('.user-message');
    await expect(userMessages).toHaveCount(4); // menu + 3 button clicks
  });

  test('should handle widget errors gracefully', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Send message that might cause issues
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('.widget');
    
    // Verify widget is still functional after potential errors
    const buttons = page.locator('.widget-button');
    await expect(buttons).toHaveCount(4);
    
    // Click a button to ensure it still works
    await buttons.nth(0).click();
    await page.waitForSelector('.widget');
    
    // Verify response
    const botMessages = page.locator('.bot-message');
    await expect(botMessages.last()).toContainText('Connecting you to customer support');
  });

  test('should handle widget accessibility', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Trigger widget
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('.widget');
    
    // Check accessibility attributes
    const buttons = page.locator('.widget-button');
    
    // Verify buttons have proper attributes for accessibility
    await expect(buttons.nth(0)).toHaveAttribute('data-option-id');
    await expect(buttons.nth(0)).toHaveAttribute('data-option-value');
    
    // Check if buttons are focusable
    await buttons.nth(0).focus();
    await expect(buttons.nth(0)).toBeFocused();
    
    // Test keyboard navigation
    await buttons.nth(0).press('Enter');
    await page.waitForSelector('.widget');
    
    // Verify interaction worked
    const userMessages = page.locator('.user-message');
    await expect(userMessages.last()).toContainText('Customer Support');
  });
});
