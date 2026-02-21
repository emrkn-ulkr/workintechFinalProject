import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://workintech-fe-ecommerce.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.Authorization = token;
    return;
  }

  delete axiosInstance.defaults.headers.Authorization;
};

export default axiosInstance;
