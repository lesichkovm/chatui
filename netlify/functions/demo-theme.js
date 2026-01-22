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
            session_key: "demo_theme_" + Date.now(),
            message: "Welcome to Theme Demo! Explore light/dark themes and custom colors."
          };
        }
        
        // Messages endpoint
        else if (message) {
          const lowerMessage = message.toLowerCase().trim();
          
          if (lowerMessage === 'menu' || lowerMessage === 'options') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Theme Options:", format: "plain" }
                },
                {
                  type: "buttons",
                  props: {
                    options: [
                      { id: "btn1", text: "🔄 Switch Mode", value: "switch" },
                      { id: "btn2", text: "🎨 Custom Colors", value: "colors" },
                      { id: "btn3", text: "📝 Typography", value: "typography" },
                      { id: "btn4", text: "✨ Effects", value: "effects" }
                    ]
                  }
                }
              ]
            };
          } else if (lowerMessage === 'switch' || lowerMessage === 'toggle') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Choose theme mode:", format: "plain" }
                },
                {
                  type: "radio",
                  props: {
                    options: [
                      { id: "light", text: "Light Mode", value: "light" },
                      { id: "dark", text: "Dark Mode", value: "dark" },
                      { id: "auto", text: "Auto (System)", value: "auto" }
                    ],
                    name: "theme_selection",
                    showSubmitButton: true,
                    buttonText: "Apply Mode"
                  }
                }
              ]
            };
          } else if (lowerMessage === 'colors' || lowerMessage === 'custom') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Customize theme colors:", format: "plain" }
                },
                {
                  type: "select",
                  props: {
                    options: [
                      { value: "default", text: "Default (Blue)" },
                      { value: "branded", text: "Branded (Purple)" },
                      { value: "nature", text: "Nature (Green)" },
                      { value: "sunset", text: "Sunset (Orange)" }
                    ],
                    placeholder: "Select color scheme...",
                    showSubmitButton: true
                  }
                }
              ]
            };
          } else if (lowerMessage === 'presets') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Choose a theme preset:", format: "plain" }
                },
                {
                  type: "select",
                  props: {
                    options: [
                      { value: "default", text: "Default (Blue)" },
                      { value: "branded", text: "Branded (Purple)" },
                      { value: "nature", text: "Nature (Green)" },
                      { value: "sunset", text: "Sunset (Orange)" },
                      { value: "monochrome", text: "Monochrome (Gray)" }
                    ],
                    placeholder: "Select a preset theme...",
                    showSubmitButton: true
                  }
                }
              ]
            };
          } else if (lowerMessage === 'advanced') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Advanced theme settings:", format: "plain" }
                },
                {
                  type: "buttons",
                  props: {
                    options: [
                      { id: "border", text: "🔲 Border Radius", value: "border" },
                      { id: "shadow", text: "🌑 Shadows", value: "shadow" },
                      { id: "animation", text: "✨ Animations", value: "animation" },
                      { id: "typography", text: "📝 Typography", value: "typography" }
                    ]
                  }
                }
              ]
            };
          } else if (lowerMessage === 'border') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Adjust border radius:", format: "plain" }
                },
                {
                  type: "slider",
                  props: {
                    min: 0,
                    max: 20,
                    defaultValue: 8,
                    step: 1,
                    label: "Radius (px)",
                    showSubmitButton: true
                  }
                }
              ]
            };
          } else if (lowerMessage === 'shadow') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Shadow intensity:", format: "plain" }
                },
                {
                  type: "slider",
                  props: {
                    min: 0,
                    max: 50,
                    defaultValue: 15,
                    step: 5,
                    label: "Intensity",
                    showSubmitButton: true
                  }
                }
              ]
            };
          } else if (lowerMessage === 'animation') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Enable theme animations:", format: "plain" }
                },
                {
                  type: "toggle",
                  props: {
                    defaultValue: true,
                    label: "Smooth Transitions",
                    showSubmitButton: true
                  }
                }
              ]
            };
          } else if (lowerMessage === 'typography') {
            responseData = {
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now(),
              widgets: [
                {
                  type: "text",
                  props: { content: "Font style preference:", format: "plain" }
                },
                {
                  type: "radio",
                  props: {
                    options: [
                      { id: "system", text: "System Default", value: "system" },
                      { id: "modern", text: "Modern (Sans-serif)", value: "modern" },
                      { id: "classic", text: "Classic (Serif)", value: "classic" },
                      { id: "mono", text: "Monospace", value: "mono" }
                    ],
                    name: "font_style",
                    showSubmitButton: true
                  }
                }
              ]
            };
          } else if (lowerMessage === 'light') {
            responseData = {
              text: "Switched to light theme! ☀️",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now()
            };
          } else if (lowerMessage === 'dark') {
            responseData = {
              text: "Switched to dark theme! 🌙",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now()
            };
          } else {
            const responses = [
              "This is the Theme Demo! Try 'menu' to see theme customization options.",
              "I can help you customize themes. Type 'switch' to change modes or 'colors' for custom colors.",
              "Theme features: light/dark modes, custom colors, presets, and advanced settings.",
              "Try 'presets' to see pre-built themes or 'advanced' for detailed customization.",
              "Type 'light' or 'dark' to quickly switch themes."
            ];
            
            responseData = {
              text: responses[Math.floor(Math.random() * responses.length)],
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now()
            };
          }
        }
        
        // Handle connection initialization
        else if (type === 'connect') {
          responseData = {
            text: "Theme Demo loaded! Explore light/dark themes and custom colors. Type 'menu' to see all options.",
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_theme_" + Date.now()
          };
        }
        
        // Handle other message types
        else if (type) {
          const responses = {
            'typing': { text: "", sender: "bot", timestamp: Date.now() },
            'read_receipt': { text: "", sender: "bot", timestamp: Date.now() },
            'handshake': { 
              text: "Theme Demo ready! All theme customization features are available.", 
              sender: "bot", 
              timestamp: Date.now(),
              session_key: session_key || "demo_theme_" + Date.now()
            }
          };
          
          responseData = responses[type] || {
            text: "Theme demo received your message.",
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
            session_key: "demo_theme_" + Date.now(),
            message: "Theme Demo API"
          };
        } else if (message) {
          responseData = {
            text: "Theme demo response for: " + message,
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type === 'connect') {
          responseData = {
            text: "Theme Demo connected!",
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type) {
          responseData = {
            text: "Theme demo: " + type,
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
            session_key: session_key || "demo_theme_" + Date.now(),
            message: "Theme Demo connected"
          };
          break;
          
        case 'message':
          responseData = {
            type: 'message',
            text: "Theme demo received: " + (payload?.text || "your message"),
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
            message: 'Theme Demo: Unknown message type',
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
