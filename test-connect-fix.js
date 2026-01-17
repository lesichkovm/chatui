// Simple test to verify the connect endpoint fix works
const fetch = require('node-fetch');

async function testConnectEndpoint() {
  try {
    console.log('Testing connect endpoint...');
    
    const response = await fetch('http://localhost:8888/.netlify/functions/chat-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'connect',
        session_key: 'demo-session-1768694022744',
        timestamp: Date.now()
      })
    });

    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.status === 'success' && data.text) {
      console.log('✅ Connect endpoint working correctly!');
    } else {
      console.log('❌ Connect endpoint still has issues');
    }
    
  } catch (error) {
    console.error('❌ Error testing connect endpoint:', error.message);
  }
}

testConnectEndpoint();
