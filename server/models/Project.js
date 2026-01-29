const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, default: 'Dev' },
    tasks: { type: Number, required: true },
    completed: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    status: { type: String, default: 'In Progress' },
    userEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);