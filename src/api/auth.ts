import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8080/api/auth"; // Updated base URL

export const login = async (email: string, password: string) => {
  try {
    // console.log("email: " + email);
    // console.log("password: " + password);
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    console.log("token: " + response.data.token);
    return response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signup = async (signupData: any) => {
  try {
    const response = await axios.post(`${API_URL}/register`, signupData, {
      withCredentials: true,
    });
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
    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/current-user`, {
      withCredentials: true,
    });
    console.log("inside getCurrentUser: " + response.data.name);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If no user is authenticated, the backend should return a 401 or similar
      throw new Error(error.response?.data?.message || "No authenticated user");
    }
    throw new Error("An unexpected error occurred");
  }
};
