// api/axiosConfig.ts
import axios from 'axios';
import config from "@/config/config";

const API_URL = config.apiURI;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add interceptor for handling authentication
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Refactored API methods
export const getUserPartimeBookings = () => 
  axiosInstance.get('/api/bookings/user').then(response => response.data);

export const getUserWorkerBookings = () => 
  axiosInstance.get('/api/user/labour-bookings').then(response => response.data);

export const getReqOffers = (serviceId: string) => 
  axiosInstance.get(`/api/user/labour-bookings/price-offers/${serviceId}`).then(response => response.data);

export const getReqDetails = (serviceId: string) => 
  axiosInstance.get(`/api/user/labour-bookings/assignment-details/${serviceId}`).then(response => response.data);

export default axiosInstance;