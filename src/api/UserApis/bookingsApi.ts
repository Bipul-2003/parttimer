import axiosInstance from "../axiosConfig";

export const getUserPartimeBookings = () => 
  axiosInstance.get('/api/bookings/user').then(response => response.data);

export const getUserWorkerBookings = () => 
  axiosInstance.get('/api/user/labour-bookings').then(response => response.data);

export const getReqOffers = (serviceId: string) => 
  axiosInstance.get(`/api/user/labour-bookings/price-offers/${serviceId}`).then(response => response.data);

export const getReqDetails = (serviceId: string) => 
  axiosInstance.get(`/api/user/labour-bookings/assignment-details/${serviceId}`).then(response => response.data);