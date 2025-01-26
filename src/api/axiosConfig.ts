import axios from "axios"
import config from "@/config/config"
import Cookies from "js-cookie"

const API_URL = config.apiURI

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Token management
export const tokenService = {
  setToken(token: string) {
    // Set in Cookies
    Cookies.set("token", token, { expires: 7 })

    // Set in Local Storage
    localStorage.setItem("token", token)

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  },

  getToken() {
    // Try to get from Cookies first, then from Local Storage
    return Cookies.get("token") || localStorage.getItem("token")
  },

  removeToken() {
    // Remove from Cookies
    Cookies.remove("token")

    // Remove from Local Storage
    localStorage.removeItem("token")

    delete axiosInstance.defaults.headers.common["Authorization"]
  },
}

// Authentication interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenService.removeToken()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Set initial token if it exists
const initialToken = tokenService.getToken()
if (initialToken) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`
}

export default axiosInstance

