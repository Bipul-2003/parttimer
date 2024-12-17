import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getUserPartimeBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/user`,{withCredentials: true});
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user bookings");
  }
}

export const getUserWorkerBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/labour-bookings`,{withCredentials: true});
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch worker bookings");
  }
}

export const getReqOffers = async (serviceId: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/labour-bookings/price-offers/${serviceId}`,{withCredentials: true});
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch offers");
  }
}

export const getReqDetails = async (serviceId: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/labour-bookings/assignment-details/${serviceId}`,{withCredentials: true});
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch service details");
  }
}