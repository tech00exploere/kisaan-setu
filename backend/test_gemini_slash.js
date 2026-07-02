require('dotenv').config({ path: __dirname + '/.env' });
const axios = require('axios');

(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/gemini/', {
      prompt: 'test',
      history: []
    });
    console.log('Response:', res.data);
  } catch (e) {
    console.error('Error:', e.response?.data || e.message);
  }
})();
