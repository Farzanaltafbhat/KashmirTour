// server.js (or app.js)

// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Import your User model
const User = require('./Models/User'); // Adjust the path as needed
const Package = require('./Models/package');
// Configure environment variables
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow all origins, you can set specific origins if needed

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes

// Register User Route
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

// Get All Users Route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to search packages
app.get('/api/packages/search', async (req, res) => {
  try {
    const { days, people } = req.query;
    const numericDays = parseInt(days);
    const numericPeople = parseInt(people);
    
    const packages = await Package.find({
      days: { $gte: numericDays },
      maxPeople: { $gte: numericPeople }
    });
    res.json(packages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to fetch all packages
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to add a packag
app.post('/api/packages', async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to delete a package
app.delete('/api/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Package.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
