import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';

export const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { accessToken, user } = await authApi.login(email, password);
    localStorage.setItem('accessToken', accessToken);
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    await authApi.logout();
    setUser(null);
  };

  /* optional: auto-refresh once near expiry */
  const refreshToken = useCallback(async () => {
    try {
      const { accessToken } = await authApi.refresh();
      localStorage.setItem('accessToken', accessToken);
    } catch (_) { logout(); }
  }, []);

  useEffect(() => {
    // EXAMPLE: refresh every 12 min for a 15 min token
    const id = setInterval(refreshToken, 12 * 60 * 1000);
    return () => clearInterval(id);
  }, [refreshToken]);

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
