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
  const referer = req.headers.referer || '';

  // Handle both GET (query params) and POST (body) requests
  let message, type, session_key;
  
  if (req.method === 'POST') {
    // For POST requests, read the body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const postData = JSON.parse(body);
        message = postData.message;
        type = postData.type;
        session_key = postData.session_key;
        
        processMessage(req, res, callback, message, type, session_key, referer);
      } catch (error) {
        console.error('Error parsing POST body:', error);
        const errorResponse = {
          status: 'error',
          message: 'Invalid JSON in request body'
        };
        sendJSONP(res, callback, errorResponse);
      }
    });
  } else {
    // For GET requests, use query parameters
    message = query.message;
    type = query.type;
    session_key = query.session_key;
    
    // Debug logging
    console.log('Request details:');
    console.log('- Message:', message);
    console.log('- Type:', type);
    console.log('- Referer:', referer);
    
    processMessage(req, res, callback, message, type, session_key, referer);
  }
}

function processMessage(req, res, callback, message, type, session_key, referer) {
  let responseData;

  // Debug logging for POST requests
  if (req.method === 'POST') {
    console.log('POST Request details:');
    console.log('- Message:', message);
    console.log('- Type:', type);
    console.log('- Session Key:', session_key);
    console.log('- Referer:', referer);
  }

  if (type === 'connect') {
    // Welcome message - check if this is any widget demo for special welcome
    if (referer.includes('widget-demo.html') || referer.includes('buttons-widget-demo.html') || referer.includes('input-widget-demo.html') || referer.includes('select-widget-demo.html') || referer.includes('rating-widget-demo.html') || referer.includes('checkbox-widget-demo.html') || referer.includes('textarea-widget-demo.html') || referer.includes('slider-widget-demo.html') || referer.includes('toggle-widget-demo.html') || referer.includes('date-widget-demo.html') || referer.includes('tags-widget-demo.html') || referer.includes('file-upload-widget-demo.html') || referer.includes('color-picker-widget-demo.html') || referer.includes('confirmation-widget-demo.html') || referer.includes('radio-widget-demo.html') || referer.includes('progress-widget-demo.html')) {
      responseData = {
        status: 'success',
        widgets: [
          {
            type: 'text',
            props: {
              content: 'Hello! I\'m your virtual assistant. Try "show buttons", "show select", "show input", "show rating", "show checkbox", "show textarea", "show slider", "show toggle", "show date", "show tags", "show file", "show color", "show confirmation", "show radio", or "show progress" to see interactive widgets!',
              format: 'plain'
            }
          }
        ]
      };
    } else {
      responseData = {
        status: 'success',
        widgets: [
          {
            type: 'text',
            props: {
              content: 'Welcome to the demo chat! Server is running.',
              format: 'plain'
            }
          }
        ]
      };
    }
  } else if (message !== undefined && message !== null) {
    console.log('Received message:', message);
    
    // Handle boolean values from toggle widget
    if (typeof message === 'boolean') {
      responseData = {
        status: 'success',
        widgets: [
          {
            type: 'text',
            props: {
              content: `Toggle ${message ? 'enabled' : 'disabled'}`,
              format: 'plain'
            }
          }
        ]
      };
    } else {
      // Check for widget trigger keywords regardless of page
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage === 'show buttons' || lowerMessage === 'show select' || lowerMessage === 'show input' || lowerMessage === 'show rating' || lowerMessage === 'show checkbox' || lowerMessage === 'show textarea' || lowerMessage === 'show slider' || lowerMessage === 'show toggle' || lowerMessage === 'show date' || lowerMessage === 'show tags' || lowerMessage === 'show file' || lowerMessage === 'show color' || lowerMessage === 'show confirmation' || lowerMessage === 'show radio' || lowerMessage === 'show progress' || lowerMessage === 'help') {
        // Widget responses - triggered by specific keywords
        if (lowerMessage === 'show buttons') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Welcome! How can I help you today?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'buttons',
                  options: [
                    { id: 'opt1', text: 'Customer Support', value: 'support' },
                    { id: 'opt2', text: 'Sales Inquiry', value: 'sales' },
                    { id: 'opt3', text: 'Technical Help', value: 'technical' },
                    { id: 'opt4', text: 'Billing Question', value: 'billing' }
                  ]
                }
              }
            ]
          };
        } else if (lowerMessage === 'show select') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Please choose your preferred department:',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'select',
                  placeholder: 'Select a department...',
                  options: [
                    { id: 'dept1', text: 'Customer Support', value: 'support' },
                    { id: 'dept2', text: 'Sales', value: 'sales' },
                    { id: 'dept3', text: 'Technical Support', value: 'tech' },
                    { id: 'dept4', text: 'Billing', value: 'billing' }
                  ]
                }
              }
            ]
          };
        } else if (lowerMessage === 'show input') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Please enter your email address:',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'input',
                  inputType: 'email',
                  placeholder: 'Enter your email...',
                  buttonText: 'Submit'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show rating') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'How would you rate our service?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'rating',
                  label: 'Rate your experience',
                  maxRating: 5,
                  iconType: 'stars'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show checkbox') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Select your interests:',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'checkbox',
                  buttonText: 'Submit',
                  options: [
                    { id: 'tech', text: 'Technology', 'value': 'tech' },
                    { id: 'sports', text: 'Sports', 'value': 'sports' },
                    { id: 'music', text: 'Music', 'value': 'music' },
                    { id: 'travel', text: 'Travel', 'value': 'travel' }
                  ]
                }
              }
            ]
          };
        } else if (lowerMessage === 'show textarea') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Please describe your issue in detail:',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'textarea',
                  placeholder: 'Describe your issue here...',
                  rows: 6,
                  maxLength: 500,
                  buttonText: 'Submit'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show slider') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'How satisfied are you with our service?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'slider',
                  label: 'Satisfaction Level',
                  min: 0,
                  max: 100,
                  step: 10,
                  value: 50
                }
              }
            ]
          };
        } else if (lowerMessage === 'show toggle') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Would you like to enable notifications?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'toggle',
                  label: 'Enable Notifications',
                  defaultValue: false,
                  buttonText: 'Save'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show date') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'When would you like to schedule your appointment?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'date',
                  label: 'Select Date',
                  minDate: '2024-01-01',
                  maxDate: '2024-12-31',
                  buttonText: 'Schedule'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show tags') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'What are your interests?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'tags',
                  label: 'Select Your Interests',
                  placeholder: 'Type and press Enter',
                  suggestions: ['Technology', 'Sports', 'Music', 'Travel', 'Food'],
                  maxTags: 5,
                  buttonText: 'Submit'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show file') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Please upload your documents:',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'file',
                  label: 'Upload Documents',
                  accept: '.pdf,.doc,.docx',
                  maxFiles: 3,
                  maxSize: 5242880,
                  buttonText: 'Upload Files'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show color') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Choose your preferred theme color:',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'color',
                  label: 'Select Theme Color',
                  defaultColor: '#007bff',
                  presetColors: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8'],
                  buttonText: 'Apply'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show confirmation') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Are you sure you want to delete this item?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'confirmation',
                  message: 'This action cannot be undone. Are you sure?',
                  confirmText: 'Delete',
                  cancelText: 'Cancel'
                }
              }
            ]
          };
        } else if (lowerMessage === 'show radio') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'What is your preferred contact method?',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'radio',
                  buttonText: 'Submit',
                  options: [
                    { id: 'email', text: 'Email', 'value': 'email' },
                    { id: 'phone', text: 'Phone', 'value': 'phone' },
                    { id: 'sms', text: 'SMS', 'value': 'sms' }
                  ]
                }
              }
            ]
          };
        } else if (lowerMessage === 'show progress') {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: 'Your download is in progress:',
                  format: 'plain'
                }
              },
              {
                type: 'widget',
                props: {
                  type: 'progress',
                  label: 'Download Progress',
                  value: 75,
                  max: 100,
                  showPercentage: true
                }
              }
            ]
          };
        } else if (message && message.startsWith('[') && message.endsWith(']')) {
          // Handle file upload responses (JSON array string)
          try {
            const fileData = JSON.parse(decodeURIComponent(message));
            const fileNames = fileData.map(f => f.name).join(', ');
            const totalSize = fileData.reduce((sum, f) => sum + f.size, 0);
            
            responseData = {
              status: 'success',
              widgets: [
                {
                  type: 'text',
                  props: {
                    content: `Files uploaded successfully!\n\nFiles: ${fileNames}\nTotal size: ${Math.round(totalSize / 1024)}KB`,
                    format: 'plain'
                  }
                }
              ]
            };
          } catch (e) {
            responseData = {
              status: 'success',
              widgets: [
                {
                  type: 'text',
                  props: {
                    content: 'Files uploaded successfully!',
                    format: 'plain'
                  }
                }
              ]
            };
          }
        }
      } else if (lowerMessage === 'support') {
        responseData = {
          status: 'success',
          widgets: [
            {
              type: 'text',
              props: {
                content: 'Connecting you to customer support... Our team will help you with any issues you\'re experiencing.',
                format: 'plain'
              }
            },
            {
              type: 'widget',
              props: {
                type: 'buttons',
                options: [
                  { id: 'urgent', text: 'Urgent Issue', value: 'urgent_support' },
                  { id: 'callback', text: 'Request Callback', value: 'callback' },
                  { id: 'email', text: 'Email Support', value: 'email_support' }
                ]
              }
            }
          ]
        };
      } else if (lowerMessage === 'sales') {
        responseData = {
          status: 'success',
          widgets: [
            {
              type: 'text',
              props: {
                content: 'Our sales team is ready to help! What are you interested in?',
                format: 'plain'
              }
            },
            {
              type: 'widget',
              props: {
                type: 'buttons',
                options: [
                  { id: 'pricing', text: 'Pricing Information', value: 'pricing' },
                  { id: 'demo', text: 'Product Demo', value: 'demo_request' },
                  { id: 'enterprise', text: 'Enterprise Plans', value: 'enterprise' }
                ]
              }
            }
          ]
        };
      } else if (lowerMessage === 'technical') {
        responseData = {
          status: 'success',
          widgets: [
            {
              type: 'text',
              props: {
                content: 'Let me help you with technical issues. What seems to be the problem?',
                format: 'plain'
              }
            },
            {
              type: 'widget',
              props: {
                type: 'buttons',
                options: [
                  { id: 'login', text: 'Login Problems', value: 'login_help' },
                  { id: 'performance', text: 'Performance Issues', value: 'performance_help' },
                  { id: 'bug', text: 'Report a Bug', value: 'bug_report' }
                ]
              }
            }
          ]
        };
      } else if (lowerMessage === 'billing') {
        responseData = {
          status: 'success',
          widgets: [
            {
              type: 'text',
              props: {
                content: 'I can help with billing questions. What do you need assistance with?',
                format: 'plain'
              }
            },
            {
              type: 'widget',
              props: {
                type: 'buttons',
                options: [
                  { id: 'invoice', text: 'Invoice Questions', value: 'invoice_help' },
                  { id: 'payment', text: 'Payment Issues', value: 'payment_help' },
                  { id: 'refund', text: 'Refund Request', value: 'refund_request' }
                ]
              }
            }
          ]
        };
      } else {
        // Default echo response
        if (referer.includes('widget-demo.html') || referer.includes('buttons-widget-demo.html') || referer.includes('input-widget-demo.html') || referer.includes('select-widget-demo.html') || referer.includes('rating-widget-demo.html') || referer.includes('checkbox-widget-demo.html') || referer.includes('textarea-widget-demo.html') || referer.includes('slider-widget-demo.html') || referer.includes('toggle-widget-demo.html') || referer.includes('date-widget-demo.html') || referer.includes('tags-widget-demo.html') || referer.includes('file-upload-widget-demo.html') || referer.includes('color-picker-widget-demo.html') || referer.includes('confirmation-widget-demo.html') || referer.includes('radio-widget-demo.html') || referer.includes('progress-widget-demo.html')) {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: `You said: "${message}". Try "show buttons", "show select", "show input", "show rating", "show checkbox", "show textarea", "show slider", "show toggle", "show date", "show tags", "show file", "show color", "show confirmation", "show radio", "show progress", or "help" to see interactive widgets!`,
                  format: 'plain'
                }
              }
            ]
          };
        } else {
          responseData = {
            status: 'success',
            widgets: [
              {
                type: 'text',
                props: {
                  content: `Echo: ${message}`,
                  format: 'plain'
                }
              }
            ]
          };
        }
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
