const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedOn: { type: Date },
});

module.exports = mongoose.model("Todo", todoSchema);
