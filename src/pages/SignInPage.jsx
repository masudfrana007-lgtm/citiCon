import React, { useState } from 'react';
import './SignInPage.css';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { refreshUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Login successful! Redirecting...');
        await refreshUser(); // This fetches full user (name + email)
        setTimeout(() => {
          window.location.href = '#/';
        }, 1500);
      } else {
        setMessage(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">SIGN-IN</h1>
        <form onSubmit={handleLogin} className="signin-form">
          <div className="input-group">
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN-IN'}
          </button>
        </form>
        {message && (
          <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <p className="signup-link">
          Don't have an account? <a href="#/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
