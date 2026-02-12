// src/api/authApi.js
const API_BASE_URL = 'http://localhost:8080/api/auth';

export const signup = async (userData) => {
  const payload = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone,
    dateOfBirth: userData.dob, // Add date of birth
    role: 'USER'
  };

  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  // Store token and user data
  localStorage.setItem('token', data.token);
  const token = localStorage.getItem('token');

  console.log('Token payload:', payload);
  localStorage.setItem('user', JSON.stringify({
    userId: data.userId,
    username: data.username,
    email: data.email,
    roles: data.roles
  }));

  return data;
};

export const login = async (credentials) => {
  const payload = {
    usernameOrEmail: credentials.email, // Backend expects usernameOrEmail
    password: credentials.password
  };

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Store token and user data
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    userId: data.userId,
    username: data.username,
    email: data.email,
    roles: data.roles
  }));
    console.log('Token:', localStorage.getItem('token'));
    console.log('User:', localStorage.getItem('user'));
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};