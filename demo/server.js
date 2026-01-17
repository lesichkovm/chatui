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

  let responseData;

  if (type === 'connect') {
    // Check if this is the widget demo
    if (referer.includes('widget-demo.html')) {
      responseData = {
        text: 'Hello! I\'m your virtual assistant. Type "menu" to see interactive options, or just ask me anything!',
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
    
    // Check if this is the widget demo
    if (referer.includes('widget-demo.html')) {
      // Widget demo responses with interactive buttons
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage === 'menu') {
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
      } else if (lowerMessage === 'options') {
        responseData = {
          text: 'Choose your preferred department:',
          widget: {
            type: 'buttons',
            options: [
              { id: 'dept1', text: 'General Inquiry', value: 'general' },
              { id: 'dept2', text: 'Product Information', value: 'product' },
              { id: 'dept3', text: 'Account Issues', value: 'account' }
            ]
          }
        };
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
        // Default echo response for widget demo
        responseData = {
          text: `You said: "${message}". Try typing "menu" or "options" to see interactive buttons!`,
          sender: 'bot'
        };
      }
    } else {
      // Regular demo responses (popup.html, full_page.htm, etc.)
      responseData = {
        text: `Echo: ${message}`,
        sender: 'bot'
      };
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
