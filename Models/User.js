// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  adults: Number,
  children: Number,
  days: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;
