const http = require('http');
const { URL } = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams);

  // CORS headers (good practice, though JSONP bypasses)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (pathname === '/api/handshake') {
    handleHandshake(req, res, query);
  } else if (pathname === '/api/messages') {
    handleMessages(req, res, query);
  } else {
    // Basic 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

function handleHandshake(req, res, query) {
  const callback = query.callback;
  const data = {
    status: 'success',
    session_key: 'demo-session-' + Date.now()
  };

  sendJSONP(res, callback, data);
}

function handleMessages(req, res, query) {
  const callback = query.callback;
  const message = query.message;
  const type = query.type;
  const referer = req.headers.referer || '';

  // Debug logging
  console.log('Request details:');
  console.log('- Message:', message);
  console.log('- Type:', type);
  console.log('- Referer:', referer);

  let responseData;

  if (type === 'connect') {
    // Welcome message - check if this is any widget demo for special welcome
    if (referer.includes('widget-demo.html') || referer.includes('buttons-widget-demo.html') || referer.includes('input-widget-demo.html') || referer.includes('select-widget-demo.html')) {
      responseData = {
        text: 'Hello! I\'m your virtual assistant. Try "show buttons", "show select", or "show input" to see interactive widgets!',
        sender: 'bot'
      };
    } else {
      responseData = {
        text: 'Welcome to the demo chat! Server is running.',
        sender: 'bot'
      };
    }
  } else if (message) {
    console.log('Received message:', message);
    
    // Check for widget trigger keywords regardless of page
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage === 'show buttons' || lowerMessage === 'show select' || lowerMessage === 'show input' || lowerMessage === 'help') {
      // Widget responses - triggered by specific keywords
      if (lowerMessage === 'show buttons') {
        responseData = {
          text: 'Welcome! How can I help you today?',
          widget: {
            type: 'buttons',
            options: [
              { id: 'opt1', text: 'Customer Support', value: 'support' },
              { id: 'opt2', text: 'Sales Inquiry', value: 'sales' },
              { id: 'opt3', text: 'Technical Help', value: 'technical' },
              { id: 'opt4', text: 'Billing Question', value: 'billing' }
            ]
          }
        };
      } else if (lowerMessage === 'show select') {
        responseData = {
          text: 'Please choose your preferred department:',
          widget: {
            type: 'select',
            placeholder: 'Select a department...',
            options: [
              { id: 'dept1', text: 'Customer Support', value: 'support' },
              { id: 'dept2', text: 'Sales', value: 'sales' },
              { id: 'dept3', text: 'Technical Support', value: 'tech' },
              { id: 'dept4', text: 'Billing', value: 'billing' }
            ]
          }
        };
      } else if (lowerMessage === 'show input') {
        responseData = {
          text: 'Please enter your email address:',
          widget: {
            type: 'input',
            inputType: 'email',
            placeholder: 'Enter your email...',
            buttonText: 'Submit'
          }
        };
      }
    } else if (lowerMessage === 'support') {
      responseData = {
        text: 'Connecting you to customer support... Our team will help you with any issues you\'re experiencing.',
        widget: {
          type: 'buttons',
          options: [
            { id: 'urgent', text: 'Urgent Issue', value: 'urgent_support' },
            { id: 'callback', text: 'Request Callback', value: 'callback' },
            { id: 'email', text: 'Email Support', value: 'email_support' }
          ]
        }
      };
    } else if (lowerMessage === 'sales') {
      responseData = {
        text: 'Our sales team is ready to help! What are you interested in?',
        widget: {
          type: 'buttons',
          options: [
            { id: 'pricing', text: 'Pricing Information', value: 'pricing' },
            { id: 'demo', text: 'Product Demo', value: 'demo_request' },
            { id: 'enterprise', text: 'Enterprise Plans', value: 'enterprise' }
          ]
        }
      };
    } else if (lowerMessage === 'technical') {
      responseData = {
        text: 'Let me help you with technical issues. What seems to be the problem?',
        widget: {
          type: 'buttons',
          options: [
            { id: 'login', text: 'Login Problems', value: 'login_help' },
            { id: 'performance', text: 'Performance Issues', value: 'performance_help' },
            { id: 'bug', text: 'Report a Bug', value: 'bug_report' }
          ]
        }
      };
    } else if (lowerMessage === 'billing') {
      responseData = {
        text: 'I can help with billing questions. What do you need assistance with?',
        widget: {
          type: 'buttons',
          options: [
            { id: 'invoice', text: 'Invoice Questions', value: 'invoice_help' },
            { id: 'payment', text: 'Payment Issues', value: 'payment_help' },
            { id: 'refund', text: 'Refund Request', value: 'refund_request' }
          ]
        }
      };
    } else {
      // Default echo response
      if (referer.includes('widget-demo.html') || referer.includes('buttons-widget-demo.html') || referer.includes('input-widget-demo.html') || referer.includes('select-widget-demo.html')) {
        responseData = {
          text: `You said: "${message}". Try "show buttons", "show select", "show input", or "help" to see interactive widgets!`,
          sender: 'bot'
        };
      } else {
        responseData = {
          text: `Echo: ${message}`,
          sender: 'bot'
        };
      }
    }
  } else {
    responseData = {
      status: 'error',
      message: 'No message provided'
    };
  }

  sendJSONP(res, callback, responseData);
}

function sendJSONP(res, callback, data) {
  const jsonData = JSON.stringify(data);
  
  if (callback) {
    // JSONP response
    const content = `${callback}(${jsonData});`;
    res.writeHead(200, {
      'Content-Type': 'application/javascript',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(content);
  } else {
    // Regular JSON response
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(jsonData);
  }
}

server.listen(PORT, () => {
  console.log(`Demo API server running at http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET /api/handshake`);
  console.log(`  GET /api/messages`);
});
