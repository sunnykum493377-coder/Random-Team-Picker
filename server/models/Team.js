const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  teamNumber: {
    type: Number,
    required: true
  },
  members: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    isLeader: {
      type: Boolean,
      default: false
    }
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for fast querying by student ID
teamSchema.index({ 'members.studentId': 1 });

module.exports = mongoose.model('Team', teamSchema);
