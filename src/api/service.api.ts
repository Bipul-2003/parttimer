import axios from "axios";
import config from "@/config/config";

const API_URL = config.apiURI+"/api/services";

export const fetchServices = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data; // assuming the data is in response.data
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
