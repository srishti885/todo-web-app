const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userEmail: { type: String, required: true }, // Auth requirement ke liye [cite: 4]
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', BoardSchema);