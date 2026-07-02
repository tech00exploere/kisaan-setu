// backend/routes/marketplace.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ensure user is logged in (optional, can be public)
const Product = require('../Product');
const Category = require('../Category');
const User = require('../User');

// GET all products (public or protected). You can add query ?category=ID to filter.
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('farmerId', 'name email')
      .lean();
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
