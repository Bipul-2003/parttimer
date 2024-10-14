import axios from "axios";

const API_URL = "http://localhost:8080/api/services";

export const fetchServices = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data; // assuming the data is in response.data
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
