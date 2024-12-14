import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getUserPartimeBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/user`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user bookings");
  }
}