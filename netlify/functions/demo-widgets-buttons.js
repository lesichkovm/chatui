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
            session_key: "demo_buttons_" + Date.now(),
            message: "Welcome to Buttons Widget Demo! This showcases interactive button functionality."
          };
        }
        
        // Messages endpoint
        else if (message) {
          const lowerMessage = message.toLowerCase().trim();
          
          if (lowerMessage === 'menu' || lowerMessage === 'options') {
            responseData = {
              text: "Button Widget Options:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_buttons_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "btn1", text: "🚀 Quick Actions", value: "quick" },
                  { id: "btn2", text: "🎨 Style Options", value: "style" },
                  { id: "btn3", text: "⚙️ Settings", value: "settings" },
                  { id: "btn4", text: "📊 Analytics", value: "analytics" }
                ]
              }
            };
          } else if (lowerMessage === 'quick') {
            responseData = {
              text: "Quick Actions:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_buttons_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "save", text: "💾 Save", value: "save_action" },
                  { id: "cancel", text: "❌ Cancel", value: "cancel_action" },
                  { id: "submit", text: "✅ Submit", value: "submit_action" },
                  { id: "reset", text: "🔄 Reset", value: "reset_action" }
                ]
              }
            };
          } else if (lowerMessage === 'style') {
            responseData = {
              text: "Button Style Options:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_buttons_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "primary", text: "🔵 Primary", value: "primary_style" },
                  { id: "secondary", text: "⚪ Secondary", value: "secondary_style" },
                  { id: "success", text: "🟢 Success", value: "success_style" },
                  { id: "danger", text: "🔴 Danger", value: "danger_style" }
                ]
              }
            };
          } else if (lowerMessage === 'types') {
            responseData = {
              text: "Different Button Types:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_buttons_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "icon", text: "🎨 Icon Button", value: "icon_button" },
                  { id: "text", text: "📝 Text Only", value: "text_button" },
                  { id: "emoji", text: "😀 Emoji Button", value: "emoji_button" },
                  { id: "mixed", text: "🎯 Mixed Content", value: "mixed_button" }
                ]
              }
            };
          } else if (lowerMessage === 'interactive') {
            responseData = {
              text: "Interactive Button Demo:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_buttons_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "click1", text: "👆 Click Me!", value: "click_demo_1" },
                  { id: "click2", text: "🎯 Try This", value: "click_demo_2" },
                  { id: "click3", text: "⚡ Quick Action", value: "click_demo_3" },
                  { id: "click4", text: "🔄 Refresh", value: "click_demo_4" }
                ]
              }
            };
          } else {
            const responses = [
              "This is the Buttons Widget Demo! Try 'menu' to see different button options.",
              "I can show you various button styles and interactions. Type 'menu' to explore!",
              "Buttons available: quick actions, style options, button types, and interactive demos.",
              "Try 'quick' for common actions, 'style' for different colors, or 'types' for button varieties.",
              "Click any button to see how it responds! Type 'interactive' for a hands-on demo."
            ];
            
            responseData = {
              text: responses[Math.floor(Math.random() * responses.length)],
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_buttons_" + Date.now()
            };
          }
        }
        
        // Handle connection initialization
        else if (type === 'connect') {
          responseData = {
            text: "Buttons Widget Demo loaded! This demo showcases all button widget functionality. Type 'menu' to see options.",
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_buttons_" + Date.now()
          };
        }
        
        // Handle other message types
        else if (type) {
          const responses = {
            'typing': { text: "", sender: "bot", timestamp: Date.now() },
            'read_receipt': { text: "", sender: "bot", timestamp: Date.now() },
            'handshake': { 
              text: "Buttons Widget Demo ready! All button features are available for testing.", 
              sender: "bot", 
              timestamp: Date.now(),
              session_key: session_key || "demo_buttons_" + Date.now()
            }
          };
          
          responseData = responses[type] || {
            text: "Buttons demo received your message.",
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
            session_key: "demo_buttons_" + Date.now(),
            message: "Buttons Widget Demo API"
          };
        } else if (message) {
          responseData = {
            text: "Buttons demo response for: " + message,
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type === 'connect') {
          responseData = {
            text: "Buttons Widget Demo connected!",
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type) {
          responseData = {
            text: "Buttons demo: " + type,
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
            session_key: session_key || "demo_buttons_" + Date.now(),
            message: "Buttons Widget Demo connected"
          };
          break;
          
        case 'message':
          responseData = {
            type: 'message',
            text: "Buttons demo received: " + (payload?.text || "your message"),
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
            message: 'Buttons Widget Demo: Unknown message type',
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
