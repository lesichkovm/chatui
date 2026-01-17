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
            message: "Welcome to Popup Chat Demo! This is the floating chat widget demo."
          };
        }
        
        // Messages endpoint
        else if (message) {
          const lowerMessage = message.toLowerCase().trim();
          
          if (lowerMessage === 'menu' || lowerMessage === 'options') {
            responseData = {
              text: "Popup Chat Options:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_popup_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "btn1", text: "🎨 Change Color", value: "color" },
                  { id: "btn2", text: "📍 Move Position", value: "position" },
                  { id: "btn3", text: "🔔 Toggle Sound", value: "sound" },
                  { id: "btn4", text: "❓ Help", value: "help" }
                ]
              }
            };
          } else if (lowerMessage === 'color') {
            responseData = {
              text: "Choose a color for the popup:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_popup_" + Date.now(),
              widget: {
                type: "color_picker",
                data: {
                  value: "#007bff",
                  preset_colors: ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6610f2", "#e83e8c"]
                }
              }
            };
          } else if (lowerMessage === 'position') {
            responseData = {
              text: "Choose popup position:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_popup_" + Date.now(),
              widget: {
                type: "select",
                data: {
                  options: [
                    { value: "bottom-right", text: "Bottom Right (Default)" },
                    { value: "bottom-left", text: "Bottom Left" },
                    { value: "top-right", text: "Top Right" },
                    { value: "top-left", text: "Top Left" }
                  ],
                  placeholder: "Select position..."
                }
              }
            };
          } else if (lowerMessage === 'sound') {
            responseData = {
              text: "Enable notification sounds?",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_popup_" + Date.now(),
              widget: {
                type: "toggle",
                data: {
                  checked: false,
                  label: "Notification Sounds"
                }
              }
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
            text: "Popup chat demo response for: " + message,
            sender: "bot",
            timestamp: Date.now()
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
      const { type, payload, session_key } = body;
      
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
          
        case 'message':
          responseData = {
            type: 'message',
            text: "Popup chat received: " + (payload?.text || "your message"),
            sender: 'bot',
            timestamp: Date.now(),
            session_key: session_key
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
