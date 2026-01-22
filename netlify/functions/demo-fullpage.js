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
            session_key: "demo_fullpage_" + Date.now(),
            message: "Welcome to Full Page Chat Demo! This shows the embedded chat interface."
          };
        }
        
        // Messages endpoint
        else if (message) {
          const lowerMessage = message.toLowerCase().trim();
          
          if (lowerMessage === 'menu' || lowerMessage === 'options') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Full Page Chat Features:", format: "plain" }
                },
                {
                  type: "buttons",
                  props: {
                    options: [
                      { id: "btn1", text: "📊 View Statistics", value: "stats" },
                      { id: "btn2", text: "🎨 Customize Theme", value: "theme" },
                      { id: "btn3", text: "📝 Start Survey", value: "survey" },
                      { id: "btn4", text: "💾 Save Conversation", value: "save" }
                    ]
                  }
                }
              ]
            };
          } else if (lowerMessage === 'stats') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Chat Statistics:", format: "plain" }
                },
                {
                  type: "progress",
                  props: {
                    value: 75,
                    max: 100,
                    showPercentage: true,
                    label: "Completion"
                  }
                }
              ]
            };
          } else if (lowerMessage === 'theme') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Choose your theme preference:", format: "plain" }
                },
                {
                  type: "radio",
                  props: {
                    options: [
                      { id: "light", text: "Light Theme", value: "light" },
                      { id: "dark", text: "Dark Theme", value: "dark" },
                      { id: "auto", text: "Auto (System)", value: "auto" }
                    ],
                    name: "theme_choice",
                    showSubmitButton: true,
                    buttonText: "Apply Theme"
                  }
                }
              ]
            };
          } else if (lowerMessage === 'survey') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Please rate your experience:", format: "plain" }
                },
                {
                  type: "rating",
                  props: {
                    maxRating: 5,
                    iconType: "stars"
                  }
                }
              ]
            };
          } else if (lowerMessage === 'save') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Enter a name for this conversation:", format: "plain" }
                },
                {
                  type: "input",
                  props: {
                    placeholder: "Conversation name...",
                    inputType: "text",
                    buttonText: "Save",
                    showSubmitButton: true
                  }
                }
              ]
            };
          } else if (lowerMessage === 'light' || lowerMessage === 'dark' || lowerMessage === 'auto') {
            responseData = {
              text: `Theme switched to ${lowerMessage} mode! 🎨`,
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now()
            };
          } else {
            const responses = [
              "This is the full page chat demo! The interface is embedded directly in the page.",
              "I'm the full page chat assistant. Try typing 'menu' to see available features.",
              "This demo shows how the chat widget looks when embedded in a full page layout.",
              "Try 'stats' to see progress indicators or 'theme' to change the appearance!",
              "The full page mode is perfect for dedicated chat pages or support centers."
            ];
            
            responseData = {
              text: responses[Math.floor(Math.random() * responses.length)],
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now()
            };
          }
        }
        
        // Handle connection initialization
        else if (type === 'connect') {
          responseData = {
            text: "Full Page Chat Demo loaded! This is the embedded chat interface. Type 'menu' to explore features.",
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_fullpage_" + Date.now()
          };
        }
        
        // Handle other message types
        else if (type) {
          const responses = {
            'typing': { text: "", sender: "bot", timestamp: Date.now() },
            'read_receipt': { text: "", sender: "bot", timestamp: Date.now() },
            'handshake': { 
              text: "Full Page Chat Demo ready! The interface is fully embedded.", 
              sender: "bot", 
              timestamp: Date.now(),
              session_key: session_key || "demo_fullpage_" + Date.now()
            }
          };
          
          responseData = responses[type] || {
            text: "Full page chat received your message.",
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
            session_key: "demo_fullpage_" + Date.now(),
            message: "Full Page Chat Demo API"
          };
        } else if (message) {
          responseData = {
            text: "Full page demo response for: " + message,
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type === 'connect') {
          responseData = {
            text: "Full Page Chat Demo connected!",
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type) {
          responseData = {
            text: "Full page chat: " + type,
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
            session_key: session_key || "demo_fullpage_" + Date.now(),
            message: "Full Page Chat Demo connected"
          };
          break;
          
        case 'message':
          responseData = {
            type: 'message',
            text: "Full page chat received: " + (payload?.text || "your message"),
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
            message: 'Full Page Chat Demo: Unknown message type',
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
