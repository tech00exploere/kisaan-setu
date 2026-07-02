require('dotenv').config({ path: __dirname + '/.env' });
const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/gemini', {
      prompt: 'Hello, can you tell me about soil health?',
      history: []
    });
    console.log('Response:', res.data);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
