import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      await authAPI.requestReset({ email, phone });
      setResetSent(true);
    } catch (err) {
      setError('Reset request failed');
    }
  };

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    try {
      await authAPI.resetPassword({ email, phone, token: resetCode, password: newPassword });
      setShowReset(false);
      setResetSent(false);
      setError(null);
    } catch (err) {
      setError('Password reset failed');
    }
  };

  return (
    <div className="login-container">
      <h2>{showReset ? 'Reset Password' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!showReset && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      )}

      {showReset && !resetSent && (
        <form onSubmit={handleResetRequest}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Send Code</button>
        </form>
      )}

      {showReset && resetSent && (
        <form onSubmit={handleResetConfirm}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Reset Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Reset Password</button>
        </form>
      )}

      {!showReset && (
        <p>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setShowReset(true)}
          >
            Forgot Password?
          </button>
        </p>
      )}

      {showReset && (
        <p>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              setShowReset(false);
              setResetSent(false);
            }}
          >
            Back to Login
          </button>
        </p>
      )}
    </div>
  );
};

export default Login;
