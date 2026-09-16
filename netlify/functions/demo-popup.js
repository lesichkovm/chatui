/**
 * Build the response payload for a user message (shared by JSONP GET and CORS POST paths)
 * @param {string} message - The user message text
 * @param {string} session_key - Session key
 * @returns {Object} Response data (may contain text or widgets array)
 */
function buildMessageResponseData(message, session_key) {
  let responseData = {};
  const lowerMessage = message.toLowerCase().trim();

  if (lowerMessage === 'menu' || lowerMessage === 'options') {
    responseData = {
      sender: "bot",
      timestamp: Date.now(),
      session_key: session_key || "demo_popup_" + Date.now(),
      widgets: [
        {
          type: "text",
          props: { content: "Popup Chat Options:", format: "plain" }
        },
        {
          type: "buttons",
          props: {
            options: [
              { id: "btn1", text: "🎨 Change Color", value: "color" },
              { id: "btn2", text: "📍 Move Position", value: "position" },
              { id: "btn3", text: "🔔 Toggle Sound", value: "sound" },
              { id: "btn4", text: "❓ Help", value: "help" }
            ]
          }
        }
      ]
    };
  } else if (lowerMessage === 'color') {
    responseData = {
      sender: "bot",
      timestamp: Date.now(),
      session_key: session_key || "demo_popup_" + Date.now(),
      widgets: [
        {
          type: "text",
          props: { content: "Choose a color for the popup:", format: "plain" }
        },
        {
          type: "color_picker",
          props: {
            defaultColor: "#007bff",
            presetColors: ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6610f2", "#e83e8c"],
            showSubmitButton: true,
            buttonText: "Apply"
          }
        }
      ]
    };
  } else if (lowerMessage === 'position') {
    responseData = {
      sender: "bot",
      timestamp: Date.now(),
      session_key: session_key || "demo_popup_" + Date.now(),
      widgets: [
        {
          type: "text",
          props: { content: "Choose popup position:", format: "plain" }
        },
        {
          type: "select",
          props: {
            options: [
              { value: "bottom-right", text: "Bottom Right (Default)" },
              { value: "bottom-left", text: "Bottom Left" },
              { value: "top-right", text: "Top Right" },
              { value: "top-left", text: "Top Left" }
            ],
            placeholder: "Select position...",
            showSubmitButton: true
          }
        }
      ]
    };
  } else if (lowerMessage === 'sound') {
    responseData = {
      sender: "bot",
      timestamp: Date.now(),
      session_key: session_key || "demo_popup_" + Date.now(),
      widgets: [
        {
          type: "text",
          props: { content: "Enable notification sounds?", format: "plain" }
        },
        {
          type: "toggle",
          props: {
            defaultValue: false,
            label: "Notification Sounds",
            showSubmitButton: true,
            buttonText: "Save"
          }
        }
      ]
    };
  } else {
    const responses = [
      "This is the popup chat demo! Try typing 'menu' to see options.",
      "I'm the popup widget assistant. How can I help you?",
      "This demo shows the floating chat widget functionality.",
      "Try 'color' to change the popup color or 'position' to move it!",
      "The popup chat can be customized in many ways. Ask me how!"
    ];
  
    responseData = {
      text: responses[Math.floor(Math.random() * responses.length)],
      sender: "bot",
      timestamp: Date.now(),
      session_key: session_key || "demo_popup_" + Date.now()
    };
  }
  return responseData;
}

const handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (httpMethod === 'GET') {
      const { callback, message, session_key, type } = queryStringParameters || {};
      
      // Handle JSONP callback
      if (callback) {
        let responseData = {};
        
        // Handshake endpoint
        if (!message && !type) {
          responseData = {
            status: "success",
            session_key: "demo_popup_" + Date.now(),
            widgets: [
              {
                type: "text",
                props: { 
                  content: "Welcome to Popup Chat Demo! This is the floating chat widget demo.", 
                  format: "plain" 
                }
              },
              {
                type: "buttons",
                props: {
                  options: [
                    { id: "btn1", text: "🎨 Change Color", value: "color" },
                    { id: "btn2", text: "📍 Move Position", value: "position" },
                    { id: "btn3", text: "🔔 Toggle Sound", value: "sound" },
                    { id: "btn4", text: "❓ Help", value: "help" }
                  ]
                }
              }
            ]
          };
        }
        
        // Messages endpoint
        else if (message) {
          responseData = buildMessageResponseData(message, session_key);
        }
        
        // Handle connection initialization
        else if (type === 'connect') {
          responseData = {
            text: "Popup Chat Demo connected! I'm the floating widget assistant. Type 'menu' to see customization options.",
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_popup_" + Date.now()
          };
        }
        
        // Handle other message types
        else if (type) {
          const responses = {
            'typing': { text: "", sender: "bot", timestamp: Date.now() },
            'read_receipt': { text: "", sender: "bot", timestamp: Date.now() },
            'handshake': { 
              text: "Popup Chat Demo ready! Try typing 'menu' for options.", 
              sender: "bot", 
              timestamp: Date.now(),
              session_key: session_key || "demo_popup_" + Date.now()
            }
          };
          
          responseData = responses[type] || {
            text: "Popup chat received your message.",
            sender: "bot",
            timestamp: Date.now()
          };
        }
        
        // Return JSONP response
        const jsonpResponse = `${callback}(${JSON.stringify(responseData)})`;
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/javascript'
          },
          body: jsonpResponse
        };
      }
      
      // Handle regular JSON API
      else {
        let responseData = {};
        
        if (!message && !type) {
          responseData = {
            status: "success",
            session_key: "demo_popup_" + Date.now(),
            message: "Popup Chat Demo API"
          };
        } else if (message) {
          responseData = {
            status: "success",
            ...buildMessageResponseData(message, session_key)
          };
        } else if (type === 'connect') {
          responseData = {
            text: "Popup Chat Demo connected!",
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type) {
          responseData = {
            text: "Popup chat: " + type,
            sender: "bot",
            timestamp: Date.now()
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(responseData)
        };
      }
    }
    
    // Handle POST requests
    else if (httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { type, payload, message, session_key } = body;
      
      // Debug logging - only in non-production environments
      if (process.env.NODE_ENV !== 'production') {
        console.log('Popup demo POST request:', { type, payload, session_key: session_key ? '[REDACTED]' : undefined, body: { ...body, session_key: body.session_key ? '[REDACTED]' : undefined } });
      }
      
      let responseData = {};
      
      switch (type) {
        case 'handshake':
          responseData = {
            type: 'handshake',
            status: 'success',
            session_key: session_key || "demo_popup_" + Date.now(),
            message: "Popup Chat Demo connected"
          };
          break;
          
        case 'connect':
          responseData = {
            type: 'connect',
            status: 'success',
            text: "Popup Chat Demo loaded! Type 'menu' to see options.",
            sender: 'bot',
            timestamp: Date.now(),
            session_key: session_key
          };
          break;

        case 'message':
          responseData = {
            type: 'message',
            status: 'success',
            ...buildMessageResponseData(message || payload?.text || '', session_key)
          };
          break;
          
        case 'typing':
          responseData = {
            type: 'typing',
            payload: { typing: false },
            session_key: session_key
          };
          break;
          
        default:
          // Debug logging - only in non-production environments
          if (process.env.NODE_ENV !== 'production') {
            console.log('Popup demo: Unknown message type:', type);
          }
          responseData = {
            type: 'error',
            message: 'Popup Chat Demo: Unknown message type',
            session_key: session_key
          };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseData)
      };
    }
    
    else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

module.exports = { handler };
