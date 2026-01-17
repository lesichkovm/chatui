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
      const { callback, widget_type, action, session_key } = queryStringParameters || {};
      
      // Handle JSONP callback
      if (callback) {
        let responseData = {};
        
        // Widget data for different types
        if (widget_type) {
          switch (widget_type) {
            case 'buttons':
              responseData = {
                type: 'buttons',
                options: [
                  { id: 'btn1', text: 'Option 1', value: 'option1' },
                  { id: 'btn2', text: 'Option 2', value: 'option2' },
                  { id: 'btn3', text: 'Option 3', value: 'option3' }
                ]
              };
              break;
              
            case 'rating':
              responseData = {
                type: 'rating',
                data: {
                  max: 5,
                  initial: 0,
                  icon: 'star'
                }
              };
              break;
              
            case 'input':
              responseData = {
                type: 'input',
                data: {
                  placeholder: 'Enter your message...',
                  type: 'text',
                  required: true
                }
              };
              break;
              
            case 'select':
              responseData = {
                type: 'select',
                options: [
                  { value: 'option1', text: 'First Option' },
                  { value: 'option2', text: 'Second Option' },
                  { value: 'option3', text: 'Third Option' }
                ],
                placeholder: 'Choose an option...'
              };
              break;
              
            case 'checkbox':
              responseData = {
                type: 'checkbox',
                options: [
                  { id: 'chk1', text: 'Feature A', value: 'feature_a' },
                  { id: 'chk2', text: 'Feature B', value: 'feature_b' },
                  { id: 'chk3', text: 'Feature C', value: 'feature_c' }
                ],
                buttonText: 'Submit Selection'
              };
              break;
              
            case 'textarea':
              responseData = {
                type: 'textarea',
                data: {
                  placeholder: 'Enter your detailed feedback...',
                  rows: 4,
                  required: true
                }
              };
              break;
              
            case 'slider':
              responseData = {
                type: 'slider',
                data: {
                  min: 0,
                  max: 100,
                  value: 50,
                  step: 1
                }
              };
              break;
              
            case 'toggle':
              responseData = {
                type: 'toggle',
                data: {
                  checked: false,
                  label: 'Enable notifications'
                }
              };
              break;
              
            case 'date':
              responseData = {
                type: 'date',
                data: {
                  value: new Date().toISOString().split('T')[0],
                  required: false
                }
              };
              break;
              
            case 'tags':
              responseData = {
                type: 'tags',
                data: {
                  placeholder: 'Add tags...',
                  suggestions: ['javascript', 'chat', 'widget', 'demo', 'netlify']
                }
              };
              break;
              
            case 'file_upload':
              responseData = {
                type: 'file_upload',
                data: {
                  accept: '.jpg,.png,.pdf,.doc',
                  multiple: false,
                  max_size: '5MB'
                }
              };
              break;
              
            case 'color_picker':
              responseData = {
                type: 'color_picker',
                data: {
                  value: '#667eea',
                  preset_colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe']
                }
              };
              break;
              
            case 'confirmation':
              responseData = {
                type: 'confirmation',
                data: {
                  title: 'Confirm Action',
                  message: 'Are you sure you want to proceed?',
                  confirm_text: 'Yes',
                  cancel_text: 'No'
                }
              };
              break;
              
            case 'radio':
              responseData = {
                type: 'radio',
                options: [
                  { id: 'rad1', text: 'Choice A', value: 'choice_a' },
                  { id: 'rad2', text: 'Choice B', value: 'choice_b' },
                  { id: 'rad3', text: 'Choice C', value: 'choice_c' }
                ],
                buttonText: 'Submit Choice'
              };
              break;
              
            case 'progress':
              responseData = {
                type: 'progress',
                data: {
                  value: 75,
                  max: 100,
                  show_percentage: true
                }
              };
              break;
              
            default:
              responseData = {
                type: 'error',
                message: 'Unknown widget type'
              };
          }
        }
        
        // Handle widget actions
        else if (action) {
          responseData = {
            type: 'action_response',
            action: action,
            status: 'success',
            message: `Action "${action}" completed successfully`,
            session_key: session_key || "demo_session_" + Date.now()
          };
        }
        
        // Default response
        else {
          responseData = {
            type: 'welcome',
            message: 'ChatUI Widget API - Use widget_type parameter to get specific widget data',
            available_widgets: [
              'buttons', 'rating', 'input', 'select', 'checkbox',
              'textarea', 'slider', 'toggle', 'date', 'tags',
              'file_upload', 'color_picker', 'confirmation', 'radio', 'progress'
            ]
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
        
        if (widget_type) {
          // Same widget data logic as above but without JSONP wrapper
          responseData = { type: 'widget', data: 'Widget data for ' + widget_type };
        } else {
          responseData = {
            message: 'ChatUI Widget API - Use widget_type parameter to get specific widget data'
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(responseData)
        };
      }
    }
    
    // Handle POST requests for widget submissions
    else if (httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { widget_type, widget_data, action } = body;
      
      let responseData = {};
      
      if (widget_type && widget_data) {
        responseData = {
          type: 'widget_response',
          widget_type: widget_type,
          status: 'success',
          message: `Received ${widget_type} data: ${JSON.stringify(widget_data)}`,
          processed_at: Date.now()
        };
      } else {
        responseData = {
          type: 'error',
          message: 'Missing widget_type or widget_data in request'
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
