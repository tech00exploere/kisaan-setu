const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
// Log every incoming request for debugging
app.use((req, res, next) => {
  console.log(`🔔 ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supermandi';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'running', service: 'Super Mandi API' });
});

// Example API Route (prefixed with /api as per your frontend .env)
app.use('/api/auth', require('./auth'));
app.use('/api/items', require('./items'));
app.use('/api/farmer', require('./farmer'));
const geminiRoute = require('./geminiRoute');


app.use('/api/gemini', geminiRoute);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});