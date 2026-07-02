const express = require('express');
const router = express.Router();
const Item = require('./Item'); // corrected path
const path = require('path');
const auth = require(path.join(__dirname, 'middleware', 'auth'));
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Simple role guard – only farmer or business can add products
function checkRole(req, res, next) {
  const allowed = ['farmer', 'business'];
  if (allowed.includes(req.user.role)) return next();
  return res.status(403).json({ message: 'Insufficient permissions' });
}

// @route   GET /api/farmer/me/products
// @desc    Get all products belonging to the authenticated farmer (optional category / startsWith filters)
router.get('/me/products', auth, async (req, res) => {
  try {
    const filter = { seller: req.user.id };
    if (req.query.category) {
      // case‑insensitive substring match for category
      filter.category = { $regex: new RegExp(req.query.category, "i") };
    }
    if (req.query.startsWith) {
      filter.name = { $regex: `^${req.query.startsWith}`, $options: 'i' };
    }
    const products = await Item.find(filter);
    console.log('GET products filter:', filter);
    // Return in the shape the frontend expects
    res.json({ products });
  } catch (err) {
    console.error('Error fetching farmer products:', err);
    res.status(500).json({ error: err.message });
  }
});



// Apply checkRole to POST route
router.post('/me/products', auth, checkRole, upload.single('image'), async (req, res) => {
  try {
    const { name, quantity, price, status, farmerName, location, category } = req.body;
    const description = `Farmer: ${farmerName || ''} | Location: ${location || ''}`;
    const newItem = new Item({
      name,
      description,
      price: Number(price),
      category: (category || "").toLowerCase(),
      seller: req.user.id,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });
    await newItem.save();
    res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
