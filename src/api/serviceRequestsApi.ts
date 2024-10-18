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
}

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

export interface PaymentSimulation {
  paymentMethod: "offline" | "bank";
  bankDetails?: string;
}

export interface FeedbackDTO {
  rating: number;
  feedback: string;
}

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
  "completed",
] as const;

const API_BASE_URL = "http://localhost:8080/api";

// Fetch service request details
export const fetchServiceRequest = async (
  requestId: number
): Promise<ServiceRequest> => {
  const response = await fetch(`${API_BASE_URL}/requests/${requestId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch service request: ${response.statusText}`);
  }
  return response.json();
};
export const selectOrganization = async (
  requestId: number,
  organizationId: number
): Promise<ServiceRequest> => {
  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/select-organization`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Just send the organizationId as a raw number, not as an object
      body: JSON.stringify(organizationId),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to select organization: ${response.statusText}`);
  }
  return response.json();
};
export const simulatePayment = async (
  requestId: number,
  paymentInfo: PaymentSimulation
): Promise<ServiceRequest> => {
  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/payment/simulate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentInfo),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to process payment: ${response.statusText}`);
  }
  return response.json();
};

export const submitFeedback = async (
  requestId: number,
  feedback: FeedbackDTO
): Promise<ServiceRequest> => {
  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/feedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to submit feedback: ${response.statusText}`);
  }
  return response.json();
};

export const confirmServiceRequest = async (
  requestId: number
): Promise<ServiceRequest> => {
  const response = await fetch(
    `${API_BASE_URL}/requests/${requestId}/confirm`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to confirm service: ${response.statusText}`);
  }
  return response.json();
};
