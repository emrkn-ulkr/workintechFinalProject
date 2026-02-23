import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://workintech-fe-ecommerce.onrender.com';

const resolveApiBaseUrl = () => {
  const configured = String(import.meta.env.VITE_API_BASE_URL || '').trim();

  if (!configured) {
    return DEFAULT_API_BASE_URL;
  }

  try {
    const parsedUrl = new URL(configured);
    const isLocalHttp = parsedUrl.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);

    if (parsedUrl.protocol !== 'https:' && !isLocalHttp) {
      return DEFAULT_API_BASE_URL;
    }

    return configured.replace(/\/+$/, '');
  } catch {
    return DEFAULT_API_BASE_URL;
  }
};

const axiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = token;
    return;
  }

  delete axiosInstance.defaults.headers.common.Authorization;
  delete axiosInstance.defaults.headers.Authorization;
};

export default axiosInstance;
