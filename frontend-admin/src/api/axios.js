import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  const rawAuth = localStorage.getItem("adminAuth");
  const parsedAuth = rawAuth ? JSON.parse(rawAuth) : null;
  const token = localStorage.getItem("token") || parsedAuth?.token;
  if (!token) return null;
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
