const express = require('express');
const router = express.Router();
const Item = require('./Item');
const auth = require('./middleware/auth');
const role = require('./middleware/role'); // role-based middleware

// @route   GET /api/items
// @desc    Get all available produce (authenticated users)
router.get('/', auth, async (req, res) => {
  try {
    const items = await Item.find().populate('seller', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/items
// @desc    Add new produce (farmer only)
router.post('/', auth, role('farmer'), async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, unit, forecast } = req.body;
    const newItem = new Item({
      name,
      description,
      price,
      category,
      imageUrl,
      unit,
      forecast,
      seller: req.user.id,
    });
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/items/:id
// @desc    Update an existing produce (farmer only)
router.put('/:id', auth, role('farmer'), async (req, res) => {
  try {
    const updates = req.body;
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      updates,
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete a produce (farmer only)
router.delete('/:id', auth, role('farmer'), async (req, res) => {
  try {
    const deleted = await Item.findOneAndDelete({ _id: req.params.id, seller: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
