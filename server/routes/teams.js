const express = require('express');
const Team = require('../models/Team');
const Student = require('../models/Student');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Generate random teams (admin only)
router.post('/generate', auth, adminAuth, async (req, res) => {
  try {
    // Get all non-admin students
    const students = await Student.find({ isAdmin: false }).select('-password');
    
    if (students.length === 0) {
      return res.status(400).json({ error: 'No students found to create teams' });
    }
    
    // Clear existing teams
    await Team.deleteMany({});
    
    // Shuffle students using Fisher-Yates algorithm
    const shuffled = [...students];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Create teams of 3
    const teams = [];
    let teamNumber = 1;
    
    for (let i = 0; i < shuffled.length; i += 3) {
      const teamMembers = shuffled.slice(i, i + 3);
      
      if (teamMembers.length > 0) {
        // Randomly select a leader
        const leaderIndex = Math.floor(Math.random() * teamMembers.length);
        
        teams.push({
          name: `Team ${teamNumber}`,
          teamNumber: teamNumber,
          members: teamMembers.map((student, idx) => ({
            studentId: student._id,
            name: student.name,
            username: student.username,
            isLeader: idx === leaderIndex
          }))
        });
        
        teamNumber++;
      }
    }
    
    // Batch insert all teams for much better performance
    if (teams.length > 0) {
      await Team.insertMany(teams);
    }
    
    res.json({
      success: true,
      message: `Successfully generated ${teams.length} teams`,
      teamsCount: teams.length,
      totalStudents: students.length
    });
  } catch (error) {
    console.error('Team generation error:', error);
    res.status(500).json({ error: 'Failed to generate teams', details: error.message });
  }
});

// Get all teams (admin only)
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const teams = await Team.find().sort({ teamNumber: 1 });
    res.json({ teams });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get team count (admin only)
router.get('/count', auth, adminAuth, async (req, res) => {
  try {
    const count = await Team.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count teams' });
  }
});

// Get my team (student)
router.get('/my-team', auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin users cannot view student teams' });
    }
    
    const team = await Team.findOne({ 'members.studentId': req.user.id });
    
    if (!team) {
      return res.json({ 
        hasTeam: false, 
        message: 'No team assigned yet' 
      });
    }
    
    // Find if current user is the leader
    const myInfo = team.members.find(m => m.studentId.toString() === req.user.id);
    
    res.json({
      hasTeam: true,
      team: {
        id: team._id,
        name: team.name,
        teamNumber: team.teamNumber,
        members: team.members
      },
      isLeader: myInfo ? myInfo.isLeader : false
    });
  } catch (error) {
    console.error('Get my team error:', error);
    res.status(500).json({ error: 'Failed to fetch team', details: error.message });
  }
});

module.exports = router;
