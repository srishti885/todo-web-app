const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects for a user
router.get('/', async (req, res) => {
    try {
        const { email } = req.query;
        const projects = await Project.find({ userEmail: email });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new project
router.post('/', async (req, res) => {
    const project = new Project(req.body);
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update project (Progress/Status)
router.patch('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete project
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;