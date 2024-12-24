import axios from "axios";

interface BookingRequest {
  serviceId: string;
  customerName: string;
  email: string;
  address: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

export const bookService = async (
  bookingRequest: BookingRequest
): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/bookings/book`, 
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