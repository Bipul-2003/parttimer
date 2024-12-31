import axios from "axios";
import config from "@/config/config";

const API_URL = config.apiURI+"/api/auth";

export const checkUser = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/check-user`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Check user failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
