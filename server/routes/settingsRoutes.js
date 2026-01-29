const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET Settings: Data fetch karne ke liye
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.findOne({ email: req.query.email });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Update: Data save/sync karne ke liye
router.post('/settings/update', async (req, res) => {
  const { email, theme, name, notifs } = req.body;
  try {
    const updated = await Settings.findOneAndUpdate(
      { email },
      { theme, name, notifs },
      { upsert: true, new: true } // Upsert matlab: user nahi hai toh naya banao, hai toh update karo
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;