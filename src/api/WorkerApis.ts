import axios from "axios";

const API_URL = "http://localhost:8080/api/labour-dashboard";

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

export const workerOfferPrice = async (labourAssignmentId: string, proposedPrice: number) => {
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
    }