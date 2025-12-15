import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken, getAuthToken, apiLogin } from '../api/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions (login/logout) to children. */
  const [token, setToken] = useState(getAuthToken());
  const [user, setUser] = useState(token ? { email: 'admin@example.com' } : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const login = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      const t = res?.access_token;
      if (!t) throw new Error('Invalid login response');
      setToken(t);
      setUser({ email });
      setAuthToken(t);
      return true;
    } catch (e) {
      setError(e.message || 'Login failed');
      setToken(null);
      setUser(null);
      setAuthToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, error, login, logout, isAuthenticated: !!token }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
