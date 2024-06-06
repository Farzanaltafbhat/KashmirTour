const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  name: String,
  description: String,
  days: Number,
  maxPeople: Number,
  price: Number,
  // Other relevant fields
});

const Package = mongoose.model('Package', PackageSchema);

module.exports = Package;
