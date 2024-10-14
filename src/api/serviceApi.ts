import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

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
        serviceData
      );
      return response.data;
    } catch (error) {
      console.error("Error requesting new service:", error);
      throw error;
    }
  },
};
