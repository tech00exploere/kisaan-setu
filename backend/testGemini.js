require('dotenv').config();
const fetch = require('node-fetch');
const prompt = 'Hello';
const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
(async () => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(data));
  } catch (e) {
    console.error('Error:', e);
  }
})();
