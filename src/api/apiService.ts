import axios from "axios";
import config from "@/config/config";
const API_URL = config.apiURI+"/api";

interface BookingRequest {
  serviceId: string;
  // customerName: string;
  email: string;
  address: string;
  name: string;
  date: string;
  time: string;
  description: string;
  phone: string;
  // mobile: string;
  city: string;
  zipCode: string;
}

export const bookService = async (
  bookingRequest: BookingRequest
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/bookings/book`, 
      bookingRequest,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Booking error:", error);
    throw error;
  }
};