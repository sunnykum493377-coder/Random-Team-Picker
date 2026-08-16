const express = require('express');
const Student = require('../models/Student');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all students (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const students = await Student.find({ isAdmin: false })
      .select('-password')
      .sort({ studentId: 1 });
    
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student count (admin only)
router.get('/count', auth, adminAuth, async (req, res) => {
  try {
    const count = await Student.countDocuments({ isAdmin: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count students' });
  }
});

module.exports = router;
