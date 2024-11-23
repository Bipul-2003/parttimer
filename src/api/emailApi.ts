import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8080/api/email";

export const sendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Send OTP failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Verify OTP failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

