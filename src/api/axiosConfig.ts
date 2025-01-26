// src/api/axiosConfig.ts
import axios from 'axios';
import config from "@/config/config";
import Cookies from 'js-cookie';

const API_URL = config.apiURI;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Token management
export const tokenService = {
  setToken(token: string) {
    Cookies.set('token', token, { expires: 7 });
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  getToken() {
    return Cookies.get('token');
  },
  
  removeToken() {
    Cookies.remove('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Authentication interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      tokenService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;