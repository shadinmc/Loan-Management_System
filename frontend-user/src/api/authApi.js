/**
 * Authentication API
 * Handles user authentication operations
 */

export const login = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      if (email && password) {
        const user = {
          email,
          username: email.split('@')[0],
          firstName: 'User',
          lastName: ''
        };

        localStorage.setItem('token', 'mock-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(user));

        resolve({ success: true, user });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const signup = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Signup data:', data);
      resolve({ success: true });
    }, 800);
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');window.location.href = '/';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};
