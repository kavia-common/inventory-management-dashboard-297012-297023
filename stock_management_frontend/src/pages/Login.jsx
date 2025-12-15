import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../ui/layout.css';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login page: posts credentials and saves JWT; redirects to dashboard. */
  const { login, isAuthenticated, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const ok = await login(email, password);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <div className="layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: 380 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8, color: 'var(--primary)' }}>Admin Login</h2>
        <p style={{ marginTop: 0, color: 'var(--secondary)', fontSize: 14 }}>
          Sign in to manage inventory
        </p>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email" style={{ fontSize: 12, color: 'var(--secondary)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="password" style={{ fontSize: 12, color: 'var(--secondary)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
