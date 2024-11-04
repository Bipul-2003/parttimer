export interface BookingDetailsDTO {
  id: string;
  name: string;
  status: string;
  description: string;
  date: string;
  time: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  clientEmail: string;
  agreedPrice: number;
  assignedEmployees: User[];
  pastOfferedPrices: string[];
  location: string;
}

// ServiceAssignmentDTO.ts
export interface ServiceAssignmentDTO {
  bookingId: number;
  organizationId: number;
  agreedPrice: number;
  prevPrice: number;
  serviceName: string;
  description: string;
  bookingStatus: string;
  paymentStatus: string;
  date: string;
  time: string;
  address: string;
  location: string;
  zip: string;
}

// OrganizationEmployeeDTO.ts
export interface OrganizationEmployeeDTO {
  bookingId: number;
  organizationId: number;
  bookingStatus: string;
  location: string;
  serviceName: string;
  description: string;
  date: string;
  time: string;
  employees: EmployeeDetails[];
}

export interface EmployeeDetails {
  userId: number;
  fullName: string;
  role: string;
}

// BookingAssignmentDTO.ts
export interface BookingAssignmentDTO {
  bookingId: number;
  organizationId: number;
  assignedEmployeeIds: number[];
  status: string;
  address: string;
  serviceName: string;
  description: string;
  date: Date;
  time: Date;
  feedback: string;
  rating: number;
  paymentStatus: string;
  location: string;
  zip: string;
  agreedPrice: number;
  clientEmail: string;
}

// User.ts
export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}
