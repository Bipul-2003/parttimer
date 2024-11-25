import axios, { AxiosError } from "axios";

const API_URL = "/oauth2/authorize";

export const signInwithGoogle = async () => {
    try {
        const response = await axios.get(`${API_URL}/google`,{withCredentials: true});  
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Google OAuth failed");
        }
        throw new Error("An unexpected error occurred");
    }
    }

    
