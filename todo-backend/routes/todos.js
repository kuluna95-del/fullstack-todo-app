const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

// Get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new Todo({ title, description });
    const saved = await newTodo.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark todo as completed
router.put("/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: true, completedOn: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
