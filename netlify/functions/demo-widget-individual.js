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
      const { callback, message, session_key, type, widget_type } = queryStringParameters || {};
      
      // Handle JSONP callback
      if (callback) {
        let responseData = {};
        
        // Handshake endpoint
        if (!message && !type) {
          responseData = {
            status: "success",
            session_key: "demo_widget_" + (widget_type || "general") + "_" + Date.now(),
            message: `Welcome to ${widget_type || 'Widget'} Demo!`
          };
        }
        
        // Messages endpoint
        else if (message) {
          const lowerMessage = message.toLowerCase().trim();
          const widget = widget_type || 'general';
          
          if (lowerMessage === 'menu' || lowerMessage === 'options') {
            responseData = {
              text: `${widget.charAt(0).toUpperCase() + widget.slice(1)} Widget Options:`,
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widget_" + widget + "_" + Date.now(),
              widget: {
                type: widget === 'buttons' ? "buttons" : 
                      widget === 'rating' ? "rating" :
                      widget === 'input' ? "input" :
                      widget === 'select' ? "select" :
                      widget === 'checkbox' ? "checkbox" :
                      widget === 'radio' ? "radio" :
                      widget === 'textarea' ? "textarea" :
                      widget === 'slider' ? "slider" :
                      widget === 'toggle' ? "toggle" :
                      widget === 'date' ? "date" :
                      widget === 'color_picker' ? "color_picker" :
                      widget === 'file_upload' ? "file_upload" :
                      widget === 'tags' ? "tags" :
                      widget === 'confirmation' ? "confirmation" :
                      widget === 'progress' ? "progress" : "buttons",
                data: getWidgetData(widget)
              }
            };
          } else {
            const responses = [
              `This is the ${widget} widget demo! Try 'menu' to see specific options.`,
              `I can demonstrate the ${widget} widget functionality. Type 'menu' to explore!`,
              `${widget.charAt(0).toUpperCase() + widget.slice(1)} widget features are available. Type 'menu' to see them.`,
              `Try the ${widget} widget by typing 'menu' or interacting with the widget directly.`
            ];
            
            responseData = {
              text: responses[Math.floor(Math.random() * responses.length)],
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widget_" + widget + "_" + Date.now()
            };
          }
        }
        
        // Handle connection initialization
        else if (type === 'connect') {
          const widget = widget_type || 'general';
          responseData = {
            text: `${widget.charAt(0).toUpperCase() + widget.slice(1)} Widget Demo loaded! Type 'menu' to see specific options.`,
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_widget_" + widget + "_" + Date.now()
          };
        }
        
        // Handle other message types
        else if (type) {
          const widget = widget_type || 'general';
          const responses = {
            'typing': { text: "", sender: "bot", timestamp: Date.now() },
            'read_receipt': { text: "", sender: "bot", timestamp: Date.now() },
            'handshake': { 
              text: `${widget.charAt(0).toUpperCase() + widget.slice(1)} Widget Demo ready!`, 
              sender: "bot", 
              timestamp: Date.now(),
              session_key: session_key || "demo_widget_" + widget + "_" + Date.now()
            }
          };
          
          responseData = responses[type] || {
            text: `${widget} demo received your message.`,
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
        const widget = widget_type || 'general';
        
        if (!message && !type) {
          responseData = {
            status: "success",
            session_key: "demo_widget_" + widget + "_" + Date.now(),
            message: `${widget} Widget Demo API`
          };
        } else if (message) {
          responseData = {
            text: `${widget} demo response for: ` + message,
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type === 'connect') {
          responseData = {
            text: `${widget} Widget Demo connected!`,
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type) {
          responseData = {
            text: `${widget} demo: ` + type,
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
      const widget = queryStringParameters?.widget_type || 'general';
      
      let responseData = {};
      
      switch (type) {
        case 'handshake':
          responseData = {
            type: 'handshake',
            status: 'success',
            session_key: session_key || "demo_widget_" + widget + "_" + Date.now(),
            message: `${widget} Widget Demo connected`
          };
          break;
          
        case 'message':
          responseData = {
            type: 'message',
            text: `${widget} demo received: ` + (payload?.text || "your message"),
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
            message: `${widget} Widget Demo: Unknown message type`,
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

// Helper function to get widget data based on type
function getWidgetData(widgetType) {
  switch (widgetType) {
    case 'buttons':
      return {
        buttons: [
          { id: "btn1", text: "🚀 Action 1", value: "action1" },
          { id: "btn2", text: "⭐ Action 2", value: "action2" },
          { id: "btn3", text: "💎 Action 3", value: "action3" }
        ]
      };
    
    case 'rating':
      return {
        max: 5,
        initial: 0,
        icon: "star"
      };
    
    case 'input':
      return {
        placeholder: "Enter your text here...",
        type: "text",
        required: true
      };
    
    case 'select':
      return {
        options: [
          { value: "option1", text: "First Option" },
          { value: "option2", text: "Second Option" },
          { value: "option3", text: "Third Option" }
        ],
        placeholder: "Choose an option..."
      };
    
    case 'checkbox':
      return {
        options: [
          { id: "chk1", text: "Option A", value: "option_a" },
          { id: "chk2", text: "Option B", value: "option_b" },
          { id: "chk3", text: "Option C", value: "option_c" }
        ]
      };
    
    case 'radio':
      return {
        options: [
          { id: "rad1", text: "Choice A", value: "choice_a" },
          { id: "rad2", text: "Choice B", value: "choice_b" },
          { id: "rad3", text: "Choice C", value: "choice_c" }
        ],
        name: "demo_radio"
      };
    
    case 'textarea':
      return {
        placeholder: "Enter your detailed feedback...",
        rows: 4,
        required: true
      };
    
    case 'slider':
      return {
        min: 0,
        max: 100,
        value: 50,
        step: 1
      };
    
    case 'toggle':
      return {
        checked: false,
        label: "Enable feature"
      };
    
    case 'date':
      return {
        value: new Date().toISOString().split('T')[0],
        required: false
      };
    
    case 'color_picker':
      return {
        value: "#667eea",
        preset_colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#ff6b6b", "#4ecdc4"]
      };
    
    case 'file_upload':
      return {
        accept: ".jpg,.png,.pdf,.doc,.txt",
        multiple: false,
        max_size: "5MB"
      };
    
    case 'tags':
      return {
        placeholder: "Add tags...",
        suggestions: ["javascript", "widgets", "demo", "chat", "ui", "interactive"]
      };
    
    case 'confirmation':
      return {
        title: "Confirm Action",
        message: "Are you sure you want to proceed?",
        confirm_text: "Yes",
        cancel_text: "No"
      };
    
    case 'progress':
      return {
        value: 75,
        max: 100,
        show_percentage: true
      };
    
    default:
      return {
        buttons: [
          { id: "default1", text: "Option 1", value: "default1" },
          { id: "default2", text: "Option 2", value: "default2" }
        ]
      };
  }
}

module.exports = { handler };
