const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

// =========================
// GET all todos (USER ONLY)
// =========================
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// ADD new todo
// =========================
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTodo = new Todo({
      title,
      description,
      user: req.userId
    });

    const saved = await newTodo.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// MARK todo as completed
// =========================
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { completed: true, completedOn: new Date() },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// DELETE todo
// =========================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    const todos = await Todo.find({ user: req.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
