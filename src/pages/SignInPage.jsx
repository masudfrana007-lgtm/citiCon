import React, { useState } from 'react';
import './SignInPage.css';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { refreshUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!acceptedLegal) {
      setMessage('You must agree to the Terms & Privacy Policy.');
      return;
    }

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
        await refreshUser();
        setTimeout(() => {
          window.location.href = '#/';
        }, 1200);
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

          {/* ✅ Legal consent */}
          <div className="legal-consent">
            <label>
              <input
                type="checkbox"
                checked={acceptedLegal}
                onChange={(e) => setAcceptedLegal(e.target.checked)}
                disabled={loading}
              />
              <span>
                I agree to the{' '}
                <a href="#/terms" target="_blank" rel="noopener noreferrer">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="signin-btn"
            disabled={loading || !acceptedLegal}
          >
            {loading ? 'SIGNING IN...' : 'SIGN-IN'}
          </button>
        </form>

        {message && (
          <p
            className={`message ${
              message.includes('successful') ? 'success' : 'error'
            }`}
          >
            {message}
          </p>
        )}

        <p className="signup-link">
          Don&apos;t have an account? <a href="#/signup">Sign Up</a>
        </p>

        {/* Optional footer links */}
        <div className="auth-footer">
          <a href="#/terms">Terms</a> · <a href="#/privacy">Privacy</a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
