// src/api/auth.ts
import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8080"; // Backend API URL

export const login = async (usernameOrEmail: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      usernameOrEmail,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signup = async (signupData: any) => {
  console.log(signupData);
  try {
    const response = await axios.post(`${API_URL}/register`, signupData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
