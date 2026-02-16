// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { isAuthenticated, logout as authLogout } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    if (authenticated) {
      const userData = localStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    }
  }, []);

  const login = useCallback((userData, token) => {
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
    const sanitizedUser = Object.fromEntries(
      Object.entries(userData || {}).filter(([, value]) => value !== undefined && value !== null)
    );
    const mergedUser = { ...existingUser, ...sanitizedUser };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mergedUser));
    setUser(mergedUser);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
