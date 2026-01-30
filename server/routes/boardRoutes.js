const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Create a Todo within a board (POST) 
router.post('/', async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Todos for a specific board (GET) 
router.get('/:boardId', async (req, res) => {
  try {
    const todos = await Todo.find({ boardId: req.params.boardId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Todo (PUT)
router.put('/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    res.status(200).json(updatedTodo);
  } catch (err) { 
    res.status(500).json(err); 
  }
});

// Delete a Todo(DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json("Todo deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;