import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './StudentDashboard.css';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyTeam(true);

    // Set up auto-refresh polling every 3 seconds
    const intervalId = setInterval(() => {
      fetchMyTeam(false);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchMyTeam = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const response = await api.get('/teams/my-team');
      setTeamData(response.data);
      if (showLoader) setLoading(false);
    } catch (error) {
      console.error('Error fetching team:', error);
      setError('Failed to load team information');
      if (showLoader) setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your team...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2>🎓 My Team</h2>
          <div className="nav-actions">
            <span className="user-name">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section glass-panel">
          <h1>Welcome, {user.name}! 👋</h1>
        </div>

        {error ? (
          <div className="error-box">
            <p>{error}</p>
          </div>
        ) : !teamData?.hasTeam ? (
          <div className="empty-state-large glass-panel">
            <div className="empty-icon">📋</div>
            <h2>No Team Assigned Yet</h2>
            <p>Your instructor hasn't created teams yet. Please check back later.</p>
          </div>
        ) : (
          <>
            {teamData.isLeader && (
              <div className="leader-banner">
                <span className="leader-icon">👑</span>
                <span>You are the Team Leader!</span>
              </div>
            )}

            <div className="team-card-large glass-panel">
              <h2>{teamData.team.name}</h2>
              <div className="team-members-list">
                {teamData.team.members.map((member, idx) => (
                  <div
                    key={idx}
                    className={`member-card ${member.isLeader ? 'leader' : ''} ${
                      member.studentId === user.id ? 'current-user' : ''
                    }`}
                  >
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      {member.studentId === user.id && (
                        <span className="badge-small">You</span>
                      )}
                    </div>
                    {member.isLeader ? (
                      <span className="badge">👑 Team Leader</span>
                    ) : (
                      <span className="badge-role">Member</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="team-info glass-panel">
              <h3>About Your Team</h3>
              <p>
                Work together with your team members to complete assignments and projects. 
                {teamData.isLeader && ' As the team leader, you may coordinate team activities and represent your team in class discussions.'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
