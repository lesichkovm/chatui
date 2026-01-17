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
            session_key: "demo_widgets_" + Date.now(),
            message: "Welcome to Widgets Demo! Try different commands to see all available widgets."
          };
        }
        
        // Messages endpoint
        else if (message) {
          const lowerMessage = message.toLowerCase().trim();
          
          if (lowerMessage === 'menu' || lowerMessage === 'options') {
            responseData = {
              text: "Available Widget Demos:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "btn1", text: "⭐ Rating Widget", value: "rating" },
                  { id: "btn2", text: "📝 Form Widgets", value: "forms" },
                  { id: "btn3", text: "🎨 Visual Widgets", value: "visual" },
                  { id: "btn4", text: "🔧 Advanced Widgets", value: "advanced" }
                ]
              }
            };
          } else if (lowerMessage === 'rating' || lowerMessage === 'rate') {
            responseData = {
              text: "Rate your experience with our widgets:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "rating",
                data: {
                  max: 5,
                  initial: 0,
                  icon: "star"
                }
              }
            };
          } else if (lowerMessage === 'forms') {
            responseData = {
              text: "Form Widgets Showcase:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "input", text: "📝 Text Input", value: "input" },
                  { id: "textarea", text: "📄 Textarea", value: "textarea" },
                  { id: "select", text: "📋 Dropdown", value: "select" },
                  { id: "checkbox", text: "☑️ Checkboxes", value: "checkbox" },
                  { id: "radio", text: "🔘 Radio Buttons", value: "radio" }
                ]
              }
            };
          } else if (lowerMessage === 'input') {
            responseData = {
              text: "Enter your name:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "input",
                data: {
                  placeholder: "Enter your name...",
                  type: "text",
                  required: true
                }
              }
            };
          } else if (lowerMessage === 'textarea') {
            responseData = {
              text: "Share your detailed feedback:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "textarea",
                data: {
                  placeholder: "Enter your detailed feedback here...",
                  rows: 4,
                  required: true
                }
              }
            };
          } else if (lowerMessage === 'select') {
            responseData = {
              text: "Choose your favorite programming language:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "select",
                options: [
                  { value: "javascript", text: "JavaScript" },
                  { value: "python", text: "Python" },
                  { value: "java", text: "Java" },
                  { value: "csharp", text: "C#" },
                  { value: "go", text: "Go" }
                ],
                placeholder: "Select a language..."
              }
            };
          } else if (lowerMessage === 'checkbox') {
            responseData = {
              text: "Select your interests:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "checkbox",
                options: [
                  { id: "web", text: "Web Development", value: "web_dev" },
                  { id: "mobile", text: "Mobile Development", value: "mobile_dev" },
                  { id: "ai", text: "Artificial Intelligence", value: "ai" },
                  { id: "cloud", text: "Cloud Computing", value: "cloud" },
                  { id: "devops", text: "DevOps", value: "devops" }
                ]
              }
            };
          } else if (lowerMessage === 'radio') {
            responseData = {
              text: "What's your experience level?",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "radio",
                options: [
                  { id: "beginner", text: "Beginner", value: "beginner" },
                  { id: "intermediate", text: "Intermediate", value: "intermediate" },
                  { id: "advanced", text: "Advanced", value: "advanced" },
                  { id: "expert", text: "Expert", value: "expert" }
                ],
                name: "experience_level"
              }
            };
          } else if (lowerMessage === 'visual') {
            responseData = {
              text: "Visual Widgets Showcase:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "color", text: "🎨 Color Picker", value: "color" },
                  { id: "date", text: "📅 Date Picker", value: "date" },
                  { id: "file", text: "📎 File Upload", value: "file" },
                  { id: "slider", text: "🎚️ Slider", value: "slider" },
                  { id: "toggle", text: "🔘 Toggle", value: "toggle" }
                ]
              }
            };
          } else if (lowerMessage === 'color') {
            responseData = {
              text: "Choose your favorite color:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "color_picker",
                data: {
                  value: "#667eea",
                  preset_colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#ff6b6b", "#4ecdc4", "#ffd93d", "#6bcf7f"]
                }
              }
            };
          } else if (lowerMessage === 'date') {
            responseData = {
              text: "Select a date for your appointment:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "date",
                data: {
                  value: new Date().toISOString().split('T')[0],
                  required: true
                }
              }
            };
          } else if (lowerMessage === 'file') {
            responseData = {
              text: "Upload a file (demo - no actual upload):",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "file_upload",
                data: {
                  accept: ".jpg,.png,.pdf,.doc,.txt",
                  multiple: false,
                  max_size: "5MB"
                }
              }
            };
          } else if (lowerMessage === 'slider') {
            responseData = {
              text: "Rate your satisfaction from 0 to 100:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "slider",
                data: {
                  min: 0,
                  max: 100,
                  value: 50,
                  step: 1
                }
              }
            };
          } else if (lowerMessage === 'toggle') {
            responseData = {
              text: "Enable notifications:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "toggle",
                data: {
                  checked: false,
                  label: "Push Notifications"
                }
              }
            };
          } else if (lowerMessage === 'data') {
            responseData = {
              text: "Data Widgets Showcase:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "progress", text: "📊 Progress Bar", value: "progress" },
                  { id: "tags", text: "🏷️ Tags Input", value: "tags" },
                  { id: "confirmation", text: "✅ Confirmation", value: "confirmation" }
                ]
              }
            };
          } else if (lowerMessage === 'progress') {
            responseData = {
              text: "Loading progress:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "progress",
                data: {
                  value: 65,
                  max: 100,
                  show_percentage: true
                }
              }
            };
          } else if (lowerMessage === 'tags') {
            responseData = {
              text: "Add tags for this topic:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "tags",
                data: {
                  placeholder: "Add tags...",
                  suggestions: ["javascript", "widgets", "demo", "chat", "ui", "interactive", "frontend"]
                }
              }
            };
          } else if (lowerMessage === 'confirmation') {
            responseData = {
              text: "Confirm your action:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "confirmation",
                data: {
                  title: "Confirm Action",
                  message: "Are you sure you want to proceed with this demo action?",
                  confirm_text: "Yes, proceed",
                  cancel_text: "Cancel"
                }
              }
            };
          } else if (lowerMessage === 'all') {
            responseData = {
              text: "Here's a quick demo of multiple widgets:",
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now(),
              widget: {
                type: "buttons",
                options: [
                  { id: "rating_demo", text: "⭐ Try Rating", value: "rating" },
                  { id: "color_demo", text: "🎨 Try Color", value: "color" },
                  { id: "form_demo", text: "📝 Try Forms", value: "forms" },
                  { id: "visual_demo", text: "🎨 Try Visual", value: "visual" },
                  { id: "advanced_demo", text: "🔧 Try Advanced", value: "advanced" }
                ]
              }
            };
          } else {
            const responses = [
              "This is the Widgets Demo! Try 'menu' to see all available widgets.",
              "I can show you 15+ different interactive widgets. Type 'menu' to explore!",
              "Widgets available: rating, forms, visual, data widgets. Type 'menu' to see them all.",
              "Try specific commands: 'rating', 'forms', 'color', 'date', 'file', 'slider', 'toggle', 'progress', 'tags', 'confirmation'.",
              "Type 'all' to see a quick overview of all widget categories."
            ];
            
            responseData = {
              text: responses[Math.floor(Math.random() * responses.length)],
              sender: "bot",
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now()
            };
          }
        }
        
        // Handle connection initialization
        else if (type === 'connect') {
          responseData = {
            text: "Widgets Demo loaded! I can show you 15+ interactive widgets. Type 'menu' to see all options or try 'rating', 'color', 'forms', etc.",
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_widgets_" + Date.now()
          };
        }
        
        // Handle other message types
        else if (type) {
          const responses = {
            'typing': { text: "", sender: "bot", timestamp: Date.now() },
            'read_receipt': { text: "", sender: "bot", timestamp: Date.now() },
            'handshake': { 
              text: "Widgets Demo ready! All 15+ widgets are available for testing.", 
              sender: "bot", 
              timestamp: Date.now(),
              session_key: session_key || "demo_widgets_" + Date.now()
            }
          };
          
          responseData = responses[type] || {
            text: "Widgets demo received your message.",
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
            session_key: "demo_widgets_" + Date.now(),
            message: "Widgets Demo API"
          };
        } else if (message) {
          responseData = {
            text: "Widgets demo response for: " + message,
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type === 'connect') {
          responseData = {
            text: "Widgets Demo connected!",
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type) {
          responseData = {
            text: "Widgets demo: " + type,
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
            session_key: session_key || "demo_widgets_" + Date.now(),
            message: "Widgets Demo connected"
          };
          break;
          
        case 'message':
          responseData = {
            type: 'message',
            text: "Widgets demo received: " + (payload?.text || "your message"),
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
            message: 'Widgets Demo: Unknown message type',
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
