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

test.describe('Widget System Tests', () => {
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
                // Disable all buttons in this widget after one is clicked
                const allButtons = buttonsContainer.querySelectorAll('.widget-button');
                allButtons.forEach((btn: any) => {
                  btn.disabled = true;
                  btn.classList.add('widget-button-disabled');
                });
                
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
              text: 'Sales department contacted.',
              widget: {
                type: 'buttons',
                options: [
                  { id: 'pricing', text: 'Pricing Information', value: 'pricing' },
                  { id: 'demo', text: 'Request Demo', value: 'demo' }
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

  test('should display welcome message', async ({ page }) => {
    const messagesContainer = page.locator('#messages');
    await expect(messagesContainer).toContainText('Hello! I\'m your virtual assistant');
  });

  test('should show buttons widget when typing "menu"', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Type "menu" and send
    await textarea.fill('menu');
    await sendButton.click();
    
    // Wait for response with widget
    await page.waitForSelector('.widget');
    
    // Check if buttons are displayed
    const widgetButtons = page.locator('.widget-button');
    await expect(widgetButtons).toHaveCount(4);
    
    // Check button texts
    await expect(widgetButtons.nth(0)).toContainText('Customer Support');
    await expect(widgetButtons.nth(1)).toContainText('Sales Inquiry');
    await expect(widgetButtons.nth(2)).toContainText('Technical Help');
    await expect(widgetButtons.nth(3)).toContainText('Billing Question');
  });

  test('should show options widget when typing "options"', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Type "options" and send
    await textarea.fill('options');
    await sendButton.click();
    
    // Wait for response with widget
    await page.waitForSelector('.widget');
    
    // Check if buttons are displayed
    const widgetButtons = page.locator('.widget-button');
    await expect(widgetButtons).toHaveCount(3);
    
    // Check button texts
    await expect(widgetButtons.nth(0)).toContainText('General Inquiry');
    await expect(widgetButtons.nth(1)).toContainText('Product Information');
    await expect(widgetButtons.nth(2)).toContainText('Account Issues');
  });

  test('should handle button clicks correctly', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Type "menu" and send
    await textarea.fill('menu');
    await sendButton.click();
    
    // Wait for widget to appear
    await page.waitForSelector('.widget');
    
    // Get the menu widget (should be in the first bot message with widgets)
    const botMessages = page.locator('.bot-message');
    const menuBotMessage = botMessages.filter({ has: page.locator('.widget') }).first();
    const menuButtons = menuBotMessage.locator('.widget-button');
    
    // Click on "Customer Support" button
    const supportButton = menuButtons.filter({ hasText: 'Customer Support' });
    await supportButton.click();
    
    // Check if button text appears as user message
    const userMessages = page.locator('.user-message');
    await expect(userMessages.last()).toContainText('Customer Support');
    
    // Wait for response with new widget
    await page.waitForTimeout(200); // Wait for bot response
    
    // Get buttons from the latest bot message (which should contain the support widget)
    const latestBotMessage = page.locator('.bot-message').last();
    const supportButtons = latestBotMessage.locator('.widget-button');
    await expect(supportButtons.nth(0)).toContainText('Urgent Issue');
    await expect(supportButtons.nth(1)).toContainText('Request Callback');
    await expect(supportButtons.nth(2)).toContainText('Email Support');
    
    // Check that the original menu buttons are now disabled
    await expect(menuButtons.nth(0)).toBeDisabled();
    await expect(menuButtons.nth(1)).toBeDisabled();
    await expect(menuButtons.nth(2)).toBeDisabled();
    await expect(menuButtons.nth(3)).toBeDisabled();
  });

  test('should handle multi-level widget navigation', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Navigate through multiple levels
    await textarea.fill('menu');
    await sendButton.click();
    await page.waitForSelector('.widget');
    
    const allButtons1 = page.locator('.widget-button');
    const salesButton = allButtons1.filter({ hasText: 'Sales Inquiry' });
    await salesButton.click();
    await page.waitForSelector('.widget');
    
    const allButtons2 = page.locator('.widget-button');
    const pricingButton = allButtons2.filter({ hasText: 'Pricing Information' });
    await pricingButton.click();
    
    // Check that the navigation worked
    const userMessages = page.locator('.user-message');
    await expect(userMessages).toHaveCount(3); // menu, Sales, Pricing Information
  });

  test('should handle regular text messages without widgets', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Send a regular message
    await textarea.fill('hello world');
    await sendButton.click();
    
    // Check if echo response is received
    const botMessages = page.locator('.bot-message');
    await expect(botMessages.last()).toContainText('You said: "hello world"');
    
    // Ensure no widget is displayed
    const widgets = page.locator('.widget');
    await expect(widgets).toHaveCount(0);
  });

  test('should handle Enter key to send messages', async ({ page }) => {
    const textarea = page.locator('#textarea');
    
    // Type message and press Enter
    await textarea.fill('menu');
    await textarea.press('Enter');
    
    // Wait for widget to appear
    await page.waitForSelector('.widget');
    
    // Check if buttons are displayed
    const widgetButtons = page.locator('.widget-button');
    await expect(widgetButtons).toHaveCount(4);
  });

  test('should handle Shift+Enter for new lines', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Type multi-line message
    await textarea.fill('line 1');
    await textarea.press('Shift+Enter');
    await page.waitForTimeout(100);
    await textarea.type('line 2');
    await sendButton.click();
    
    // Check if message was sent with new line - check innerHTML instead of textContent
    const userMessages = page.locator('.user-message');
    const messageHTML = await userMessages.last().innerHTML();
    expect(messageHTML).toContain('line 1<br>line 2');
  });

  test('should clear textarea after sending message', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    
    // Send message
    await textarea.fill('test message');
    await sendButton.click();
    
    // Check if textarea is cleared
    await expect(textarea).toHaveValue('');
  });

  test('should auto-scroll to latest message', async ({ page }) => {
    const textarea = page.locator('#textarea');
    const sendButton = page.locator('#send');
    const messagesContainer = page.locator('#messages');
    
    // Send multiple messages to fill the chat
    for (let i = 0; i < 10; i++) {
      await textarea.fill(`message ${i}`);
      await sendButton.click();
      await page.waitForTimeout(100);
    }
    
    // Check if scrolled to bottom
    const scrollTop = await messagesContainer.evaluate(el => el.scrollTop);
    const scrollHeight = await messagesContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await messagesContainer.evaluate(el => el.clientHeight);
    
    expect(scrollTop + clientHeight).toBeGreaterThanOrEqual(scrollHeight - 10);
  });
});
