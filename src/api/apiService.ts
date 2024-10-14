import axios from "axios";

interface BookingRequest {
  serviceId: string; // Changed to string
  customerName: string;
  email: string;
  location: string;
  date: string;
  time: string;
  description: string;
}

export const bookService = async (
  serviceId: string,
  bookingRequest: BookingRequest
): Promise<any> => {
  const response = await fetch(
    `http://localhost:8080/api/bookings/${serviceId}/book`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingRequest),
    }
  );
  return response.json();
};
