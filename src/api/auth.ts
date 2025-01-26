
// src/api/auth.ts
import axiosInstance, { tokenService } from './axiosConfig';

const AUTH_URL = '/api/auth';

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/login`, { email, password });
    tokenService.setToken(response.data.token);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const signup = async (signupData: any) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/register`, signupData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post('/logout');
    tokenService.removeToken();
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get(`${AUTH_URL}/current-user`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 404) {
      return null;
    }
    throw new Error(error.response?.data?.message || "Error fetching user");
  }
};
