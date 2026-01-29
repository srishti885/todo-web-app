const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Create a Board (POST)
router.post('/', async (req, res) => {
  try {
    const newBoard = new Board(req.body);
    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Boards for a user (GET)
router.get('/:email', async (req, res) => {
  try {
    const boards = await Board.find({ userEmail: req.params.email });
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;