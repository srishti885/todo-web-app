const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  theme: { type: String, default: 'Deep Blue' },
  notifs: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    alerts: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);