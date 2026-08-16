import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStudents: 0, totalTeams: 0 });
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsCountRes, teamsCountRes, teamsDataRes, studentsDataRes] = await Promise.all([
        api.get('/students/count'),
        api.get('/teams/count'),
        api.get('/teams/all'),
        api.get('/students/')
      ]);

      setStats({
        totalStudents: studentsCountRes.data.count,
        totalTeams: teamsCountRes.data.count
      });
      setTeams(teamsDataRes.data.teams);
      setStudents(studentsDataRes.data.students);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleGenerateTeams = async () => {
    if (!window.confirm('This will regenerate all teams. Are you sure?')) {
      return;
    }

    setGenerating(true);
    setMessage(null);

    try {
      const response = await api.post('/teams/generate');
      setMessage({
        type: 'success',
        text: response.data.message
      });
      await fetchData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to generate teams'
      });
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage(null), 5000);
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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h2>🎓 Admin Dashboard</h2>
          <div className="nav-actions">
            <span className="user-name">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card glass-panel">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">{stats.totalTeams}</div>
            <div className="stat-label">Teams Generated</div>
          </div>
        </div>

        <div className="action-section glass-panel">
          <button
            onClick={handleGenerateTeams}
            className="btn btn-primary btn-large"
            disabled={generating}
          >
            {generating ? '⏳ Generating...' : '🎲 Generate Random Teams'}
          </button>
          <p className="help-text">
            This will create random teams of 3 students with a random leader in each team
          </p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? '✓ ' : '✗ '}
            {message.text}
          </div>
        )}

        <div className="students-section">
          <h2>Registered Students</h2>
          {students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p>No students have registered yet.</p>
            </div>
          ) : (
            <div className="students-table-container glass-panel">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>University Roll No</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student._id}>
                      <td>{idx + 1}</td>
                      <td>{student.name}</td>
                      <td><code className="roll-no">{student.studentId}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="teams-section">
          <h2>Generated Teams</h2>
          {teams.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No teams generated yet. Click the button above to create teams.</p>
            </div>
          ) : (
            <div className="teams-grid">
              {teams.map((team) => (
                <div key={team._id} className="team-card glass-panel">
                  <h3>{team.name}</h3>
                  <div className="team-members">
                    {team.members.map((member, idx) => (
                      <div
                        key={idx}
                        className={`member ${member.isLeader ? 'leader' : ''}`}
                      >
                        <span className="member-name">{member.name}</span>
                        {member.isLeader && (
                          <span className="badge">👑 Leader</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
