require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

/**
 * POST /api/gemini
 * Body: { prompt: string, history?: Array<{role:string, content:string}> }
 */
router.post('/', async (req, res) => {
  const { prompt, history = [], attachment } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  // Map history to Gemini API format. Gemini uses 'model' instead of 'assistant'.
  const contents = [];
  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg && msg.content && (msg.role === 'user' || msg.role === 'assistant')) {
        // Skip 'No response' or empty responses to avoid contaminating context
        if (msg.content === 'No response' || msg.content === 'Request failed') continue;
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }
  }

  // Construct parts for current message
  const userParts = [];
  if (attachment && attachment.data && attachment.mimeType) {
    let base64Data = attachment.data;
    // Strip data URL scheme metadata if present
    if (base64Data.includes(';base64,')) {
      base64Data = base64Data.split(';base64,')[1];
    }
    console.log(`📎 Processing attachment type: ${attachment.mimeType}, size: ${base64Data.length} chars`);
    userParts.push({
      inlineData: {
        mimeType: attachment.mimeType,
        data: base64Data
      }
    });
  }
  userParts.push({ text: prompt });

  contents.push({
    role: 'user',
    parts: userParts
  });

  const payload = { contents };

  // Try available models under v1 API version
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash'];
  let replyText = '';
  for (const model of models) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(`Gemini API error from ${model}:`, response.status, JSON.stringify(data));
        continue; // try next model
      }
      replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (replyText) {
        console.log(`🔎 Gemini success with model ${model}`);
        break; // success
      }
    } catch (err) {
      console.error(`Gemini fetch error for ${model}:`, err);
    }
  }
  if (!replyText) {
    return res.status(500).json({ error: 'Gemini request failed or returned empty' });
  }
  res.json({ reply: replyText });
});

module.exports = router;
