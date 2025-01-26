import axios from "axios"
import config from "@/config/config"
import Cookies from "js-cookie"

const API_URL = config.apiURI + "/api/auth"

// Create an axios instance with default config
const authAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
})

authAPI.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})

export const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.post("/login", {
      email,
      password,
    })

    // Set the token in a cookie that expires in 7 days
    Cookies.set("token", response.data.token, { expires: 7 })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
    throw new Error("An unexpected error occurred")
  }
}

export const signup = async (signupData: any) => {
  try {
    const response = await authAPI.post("/register", signupData)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Signup failed")
    }
    throw new Error("An unexpected error occurred")
  }
}

export const logoutUser = async () => {
  try {
    await axios.post(`${config.apiURI}/logout`, {}, { withCredentials: true })
    // Remove the token cookie
    Cookies.remove("token")
  } catch (error) {
    console.error("Logout failed", error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await authAPI.get("/current-user")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return null
      }
      throw new Error(error.response?.data?.message || "Error fetching user")
    }
    throw new Error("An unexpected error occurred")
  }
}

