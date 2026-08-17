import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reusing base styles
import './Signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // We pass rollNo as username, and the real password
    const result = await register(rollNo, password, name, rollNo);

    if (result.success) {
      // Auto-login after successful registration
      const loginResult = await login(rollNo, password);
      if (loginResult.success) {
        // Navigation is handled by AuthContext and protected routes
      } else {
        // If auto-login fails, redirect to login page
        navigate('/login');
      }
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="login-container signup-container">
      <div className="login-box signup-box glass-panel">
        <div className="login-header signup-header">
          <h1>🎓 Student Signup</h1>
          <p className="subtitle">Create an account to join the team manager</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNo">University Roll No</label>
            <input
              type="text"
              id="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. 2025BTCS123"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="form-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
