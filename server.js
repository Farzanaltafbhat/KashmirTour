// server.js (or app.js)

// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Import your User model
const User = require('../Backend/Models/User'); // Adjust the path as needed

// Configure environment variables
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { firstname, lastname, email, phone, adults, children, days } = req.body;
  
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Create a new user instance
    const newUser = new User({ firstname, lastname, email, phone, adults, children, days });
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    console.log(newUser);
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
