import axios from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;
  if (!url) {
    url = import.meta.env.PROD
      ? 'https://quest-board-yohm.onrender.com/api/v1'
      : 'http://localhost:5000/api/v1';
  }
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api/v1')) {
    if (url.endsWith('/api')) {
      url = `${url}/v1`;
    } else {
      url = `${url}/api/v1`;
    }
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45s timeout to handle free-tier cold starts smoothly
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('questboard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response data or format error
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message =
      error.response?.data?.message || error.message || 'An unexpected error occurred.';

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Server is waking up or request timed out. Please wait 10 seconds and try again.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      message = 'Unable to connect to the QuestBoard server. The server may be waking up.';
    }

    const customError = {
      message,
      status: error.response?.status,
      errors: error.response?.data?.errors || null,
    };

    if (error.response?.status === 401) {
      // Clear token if expired or unauthorized
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        localStorage.removeItem('questboard_token');
      }
    }

    return Promise.reject(customError);
  }
);

export default api;
