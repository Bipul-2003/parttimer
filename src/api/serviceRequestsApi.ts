import axios, { AxiosResponse } from "axios";

// Interfaces
export interface Organization {
  id: number;
  name: string;
  expectedFee: number;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
}

export interface ServiceRequest {
  id: number;
  status: string;
  date: string;
  time: string;
  address: string;
  agreedPrice: number | null;
  availableOrganizations: Organization[];
  organizationId: number | null;
  organizationName: string | null;
  paymentStatus: string;
  rating: number | null;
  feedback: string | null;
  comments: string | null;
  serviceId: number | null;
  userId: number | null;
  associatedOrganization?: Organization;
  employeesInvolved?: Employee[];
  organizationOwnerName?: string;
  organizationCoOwnerNames?: string[];
}

export interface PaymentSimulation {
  paymentMethod: "offline" | "bank";
  bankDetails?: string;
}

export interface FeedbackDTO {
  rating: number;
  feedback: string;
}

// Status Type
export type Status =
  | "posted"
  | "request sent"
  | "confirmed"
  | "initiated"
  | "payment pending"
  | "payment submitted"
  | "completed";

export const statusOrder: readonly Status[] = [
  "posted",
  "request sent", 
  "confirmed",
  "initiated", 
  "payment pending",
  "payment submitted", 
  "completed"
] as const;

// API Configuration
const API_BASE_URL = "http://localhost:8080/api";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Service Request API Methods
export const ServiceRequestAPI = {
  async fetchServiceRequest(requestId: number): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.get(`/requests/${requestId}`);
    return response.data;
  },

  async selectOrganization(requestId: number, organizationId: number): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.post(
      `/requests/${requestId}/select-organization`, 
      organizationId
    );
    return response.data;
  },

  async simulatePayment(requestId: number, paymentInfo: PaymentSimulation): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.post(
      `/requests/${requestId}/payment/simulate`,
      paymentInfo
    );
    return response.data;
  },

  async submitFeedback(requestId: number, feedback: FeedbackDTO): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.post(
      `/requests/${requestId}/feedback`,
      feedback
    );
    return response.data;
  },

  async confirmServiceRequest(requestId: number): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.post(
      `/requests/${requestId}/confirm`
    );
    return response.data;
  },

  async initiateServiceRequest(requestId: number): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.post(
      `/requests/${requestId}/initiate`
    );
    return response.data;
  },

  async finishServiceRequest(requestId: number): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.post(
      `/requests/${requestId}/finish`
    );
    return response.data;
  },

  async verifyPayment(requestId: number): Promise<ServiceRequest> {
    const response: AxiosResponse<ServiceRequest> = await axiosInstance.post(
      `/requests/${requestId}/verify`
    );
    return response.data;
  }
};

// Optional: Error Handling Utility
export class ServiceRequestError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ServiceRequestError";
  }
}

// Optional: Interceptors for Global Error Handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      throw new ServiceRequestError(
        error.response.data.message || "An error occurred", 
        error.response.status
      );
    }
    throw error;
  }
);

export default ServiceRequestAPI;