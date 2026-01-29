const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }, // Board linkage 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', TodoSchema);