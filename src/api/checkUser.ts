// import axios from "axios";
// import config from "@/config/config";
import axiosInstance from "./axiosConfig";

const API_URL = "/api/auth";

// export const checkUser = async (email: string) => {
//   console.log(email);
  
//   try {
//     const response = await axios.post(`${API_URL}/check-user`, { email });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "Check user failed");
//     }
//     throw new Error("An unexpected error occurred");
//   }
// };


// src/api/checkUser.ts
export const checkUser = async (email: string) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/check-user`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Check user failed");
  }
};