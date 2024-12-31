import axios from "axios";
import config from "@/config/config";
// const API_URL = config.apiURI;

const API_BASE_URL = config.apiURI+"/api";

export const serviceApi = {
  requestNewService: async (serviceData: {
    name: string;
    description: string;
    category: string;
    subcategory: string;
    baseFee: number;
  }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/services`,
        serviceData,{withCredentials: true}
      );
      return response.data;
    } catch (error) {
      console.error("Error requesting new service:", error);
      throw error;
    }
  },
};
