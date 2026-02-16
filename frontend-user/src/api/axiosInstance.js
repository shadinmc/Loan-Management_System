import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const isMockToken = (token) => {
  if (!token) return false;
  const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
  return /^mock-token-/i.test(raw);
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (isMockToken(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      token = null;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[api] Missing auth token for request:', config.url);
    }

    if (config?.headers?.Authorization) {
      console.debug('[api] Auth header set for request:', config.url);
    }


    // Add CSRF token if available
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to get cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default axiosInstance;
