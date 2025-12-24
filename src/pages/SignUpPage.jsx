import React, { useState } from 'react';
import './SignUpPage.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Sign up successful! Redirecting to login...');
        await refreshUser();
        navigate('/signin');
        
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setMessage('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">SIGN-UP</h1>
        <form onSubmit={handleSignup} className="signup-form">
          <div className="input-group">
            <label>FULL NAME</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
          </div>
          <div className="input-group">
            <label>EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div className="input-group">
            <label>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" disabled={loading} />
          </div>
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'CREATING ACCOUNT...' : 'SIGN-UP'}
          </button>
        </form>
        {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
        <p className="login-link">
          Already have an account? <a href="#/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
