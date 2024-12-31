import axios from "axios";
import config from "@/config/config";
// const API_URL = config.apiURI;

const API_URL = config.apiURI+"/api/locations";

export const getCountry = async () => {
  try {
    const response = await axios.get(`${API_URL}/countries`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Country fetch failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getState = async (country: string) => {
  try {
    const response = await axios.get(`${API_URL}/states?country=${country}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "State fetch failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getCity = async (country: string, state: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/cities?country=${country}&state=${state}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "City fetch failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getZipcodes = async (country: string, state: string, city: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/zipcodes?country=${country}&state=${state}&city=${city}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Zipcode fetch failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

