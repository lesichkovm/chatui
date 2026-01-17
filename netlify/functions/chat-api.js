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
            session_key: "demo_session_" + Date.now(),
            message: "Welcome to ChatUI Widget Demo! This is a simulated backend powered by Netlify Functions."
          };
        }
        
        // Messages endpoint
        else if (message) {
          const responses = [
            "That's interesting! Tell me more about that.",
            "I understand. How can I help you today?",
            "Thanks for sharing! What would you like to discuss?",
            "Great question! Let me think about that...",
            "I'm here to help! What's on your mind?",
            "That's a good point. What else would you like to know?",
            "I appreciate you reaching out. How can I assist you?",
            "Interesting! Can you elaborate on that?"
          ];
          
          responseData = {
            text: responses[Math.floor(Math.random() * responses.length)],
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_session_" + Date.now()
          };
        }
        
        // Handle connection initialization
        else if (type === 'connect') {
          responseData = {
            text: "Welcome to ChatUI Widget Demo! I'm here to help you explore the features. Try typing 'menu' to see interactive widgets, or just say hello!",
            sender: "bot",
            timestamp: Date.now(),
            session_key: session_key || "demo_session_" + Date.now()
          };
        }
        
        // Handle other message types
        else if (type) {
          const responses = {
            'typing': { text: "", sender: "bot", timestamp: Date.now() },
            'read_receipt': { text: "", sender: "bot", timestamp: Date.now() },
            'handshake': { 
              text: "Connected to ChatUI Demo Backend! How can I help you today?", 
              sender: "bot", 
              timestamp: Date.now(),
              session_key: session_key || "demo_session_" + Date.now()
            }
          };
          
          responseData = responses[type] || {
            text: "I received your message. How can I assist you?",
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
            session_key: "demo_session_" + Date.now(),
            message: "Welcome to ChatUI Widget Demo!"
          };
        } else if (message) {
          const responses = [
            "That's interesting! Tell me more.",
            "I understand. How can I help?",
            "Thanks for sharing! What else?",
            "Great question! Let me assist you.",
            "I'm here to help! What's on your mind?"
          ];
          
          responseData = {
            text: responses[Math.floor(Math.random() * responses.length)],
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type === 'connect') {
          responseData = {
            text: "Welcome to ChatUI Widget Demo! I'm here to help you explore the features.",
            sender: "bot",
            timestamp: Date.now()
          };
        } else if (type) {
          responseData = {
            text: "Connection established. How can I help you?",
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
    
    // Handle POST requests (for WebSocket-like functionality)
    else if (httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { type, payload, session_key } = body;
      
      let responseData = {};
      
      switch (type) {
        case 'handshake':
          responseData = {
            type: 'handshake',
            status: 'success',
            session_key: session_key || "demo_session_" + Date.now(),
            message: "Connected to ChatUI Demo Backend"
          };
          break;
          
        case 'message':
          const responses = [
            "That's interesting! Tell me more.",
            "I understand. How can I help?",
            "Thanks for sharing! What else?",
            "Great question! Let me assist you.",
            "I'm here to help! What's on your mind?"
          ];
          
          responseData = {
            type: 'message',
            text: responses[Math.floor(Math.random() * responses.length)],
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
            message: 'Unknown message type',
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
