import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8080/api/locations";


export const getCountry = async () => {
  try {
    const response = await axios.get(`${API_URL}/countries`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Country failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getState = async () => {
  try {
    const response = await axios.get(`${API_URL}/states`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "State failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getCity = async (state: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/cities?state=${state}`,
        // {withCredentials: true}
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "City failed");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getZipcodes = async (state: string, city: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/zipcodes?state=${state}&city=${city}`,
        // {withCredentials: true}
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Zipcode failed");
    }
    throw new Error("An unexpected error occurred");
  }
};
