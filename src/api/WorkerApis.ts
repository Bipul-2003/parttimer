import axios from "axios";
import config from "@/config/config";

const API_URL = config.apiURI + "/api/labour-dashboard";

export const getOpenWorkerBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/open-bookings`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch open bookings");
  }
};

export const getWorkerBookings = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch worker bookings");
  }
};

export const workerOfferPrice = async (
  labourAssignmentId: string,
  proposedPrice: number
) => {
  try {
    const response = await axios.post(
      `${API_URL}/offer-price`,
      { labourAssignmentId, proposedPrice },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to offer price");
  }
};

export const getWorkerHistory = async () => {
  try {
    const response = await axios.get(
      config.apiURI + `/api/labour/price-history`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch worker history");
  }
};

export const getWorkerPendingRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/pending`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch worker history");
  }
};

export const changeOfferPrice = async (newPrice: number, priceOfferId: number) => {
  try {
    const response = await axios.put(
      `${API_URL}/edit-offer/${priceOfferId}`,
      { newPrice, priceOfferId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to change offer price");
  }
}