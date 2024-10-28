export interface DashboardStats {
  totalEmployees: number;
  totalServices: number;
  pendingBookings: number;
  completedBookings: number;
  // revenue: {
  //   daily: number;
  //   weekly: number;
  //   monthly: number;
  // };
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  status: "active" | "inactive";
  joinedAt: string;
  department?: string;
  skills?: string[];
}

export interface OrganizationService {
  id: number;
  name: string;
  description: string;
  expectedFee: number;
  status: "active" | "inactive";
  category?: string;
}

export interface fetchOrganizationService {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  pendingCount?: number;
  completedCount?: number;
  ongoingCount?: number;
  revenue?: number;
}

export interface Booking {
  bookingId: number;
  serviceName: string;
  customerName: string;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
}

export interface ServiceAssignment {
  id: number;
  bookingId: number;
  employeeIds: number[];
  status: "assigned" | "in-progress" | "completed";
  assignedAt: string;
  updatedAt: string;
}

export interface fetchOrganizationServices {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  completedCount: number;
  ongoingCount: number;
  pendingCount: number;
  revenue: number;
}

export type CreateEmployeeData = Omit<Employee, "id" | "joinedAt">;
export type UpdateEmployeeData = Partial<CreateEmployeeData>;
export type UpdateServiceData = Pick<
  OrganizationService,
  "expectedFee" | "status"
>;
