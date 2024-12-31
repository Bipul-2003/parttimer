import axios, { AxiosInstance } from "axios";
import {
  BookingDetailsDTO,
  ServiceAssignmentDTO,
  OrganizationEmployeeDTO,
  BookingAssignmentDTO,
} from "@/types/BookingDetailsDTO";
import config from "@/config/config";

class BookingApi {
  private http: AxiosInstance;

  constructor(baseURL = config.apiURI+"/api/organizations") {
    this.http = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getBookingDetails = async (
    orgId: string,
    bookingId: string
  ): Promise<BookingDetailsDTO> => {
    const response = await this.http.get(`/${orgId}/bookings/${bookingId}`);
    return response.data;
  };

  offerPrice = async (
    orgId: string,
    bookingId: string,
    offeredPrice: number
  ): Promise<ServiceAssignmentDTO> => {
    const response = await this.http.post(
      `/${orgId}/bookings/${bookingId}/price-offer`,
      { offeredPrice }
    );
    return response.data;
  };

  getAvailableEmployees = async (
    orgId: string,
    bookingId: string
  ): Promise<OrganizationEmployeeDTO> => {
    const response = await this.http.get(
      `/${orgId}/bookings/${bookingId}/available-employees`
    );
    return response.data;
  };

  assignEmployees = async (
    orgId: string,
    bookingId: string,
    employeeIds: number[]
  ): Promise<BookingAssignmentDTO> => {
    const response = await this.http.post(
      `/${orgId}/bookings/${bookingId}/assign-employees`,
      { employeeIds }
    );
    return response.data;
  };

  initiateServiceRequest = async (
    bookingId: string
  ): Promise<BookingAssignmentDTO> => {
    const response = await this.http.post(`/${bookingId}/initiate-request`);
    return response.data;
  };

  completeWork = async (bookingId: number): Promise<BookingAssignmentDTO> => {
    const response = await this.http.post(`/${bookingId}/finish-request`);
    return response.data;
  };

  verifyPayment = async (
    bookingId: string,
    orgId: string
  ): Promise<BookingAssignmentDTO> => {
    const response = await this.http.post(
      `/${orgId}/bookings/${bookingId}/verify-payment`
    );
    return response.data;
  };

  submitFeedback = async (
    bookingId: number,
    feedback: string,
    rating: number
  ): Promise<BookingAssignmentDTO> => {
    const response = await this.http.post(`/${bookingId}/user-feedback`, {
      feedback,
      rating,
    });
    return response.data;
  };
}

export default BookingApi;

export const bookingAPI = new BookingApi();
