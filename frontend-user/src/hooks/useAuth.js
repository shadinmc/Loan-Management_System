import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, logout as authLogout } from '../api/authApi';

/**
 * Custom hook for authentication state management
 * Handles user session and provides auth utilities
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);

    if (authenticated) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } else {
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const refreshAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isLoggedIn,
    logout,
    refreshAuth
  };
};
