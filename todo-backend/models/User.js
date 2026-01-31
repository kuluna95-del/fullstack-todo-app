// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // retire username si tu ne l'utilises pas
});

module.exports = mongoose.model("User", userSchema);
