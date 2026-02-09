import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, logout as authLogout } from '../api/authApi';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = useCallback(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);

    if (!authenticated) {
      setUser(null);
      return;
    }

    try {
      const userData = localStorage.getItem('user');

      if (!userData || userData === 'undefined') {
        setUser(null);
        localStorage.removeItem('user');
        return;
      }

      setUser(JSON.parse(userData));
    } catch (err) {
      console.error('Invalid user data in localStorage', err);
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    authLogout();
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return {
    user,
    isLoggedIn,
    logout,
    refreshAuth: checkAuth
  };
};
