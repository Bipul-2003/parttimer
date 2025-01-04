// auth.ts

import axios from "axios";
import config from "@/config/config";

const API_URL = config.apiURI+"/api/auth";


// const API_URL = "http://localhost:8080/api/auth";

// Create an axios instance with default config
const authAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.post('/login', {
      email,
      password,
    });
    return response.data; // The cookie will be automatically handled by the browser
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signup = async (signupData: any) => {
  try {
    const response = await authAPI.post('/register', signupData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(`${config.apiURI}/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await authAPI.get('/current-user');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || "Error fetching user");
    }
    throw new Error("An unexpected error occurred");
  }
};