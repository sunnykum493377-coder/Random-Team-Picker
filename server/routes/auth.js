const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register a new student (for initial setup)
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, studentId, isAdmin } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ username });
    if (existingStudent) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create student
    const student = new Student({
      username,
      password: hashedPassword,
      name,
      studentId,
      isAdmin: isAdmin || false
    });
    
    await student.save();
    
    res.status(201).json({ 
      message: 'Student registered successfully',
      student: {
        id: student._id,
        username: student.username,
        name: student.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}, password: ${password}`);
    
    // Find student
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { 
        id: student._id, 
        username: student.username,
        name: student.name,
        isAdmin: student.isAdmin 
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production-2024',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: student._id,
        username: student.username,
        name: student.name,
        isAdmin: student.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({
      id: student._id,
      username: student.username,
      name: student.name,
      isAdmin: student.isAdmin
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

module.exports = router;
