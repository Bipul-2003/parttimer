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

// dashboardTypes.ts 29-10-2024
export interface ServiceDelivery {
  id: number;
  customerName: string;
  status: string;
  assignedEmployees: AssignedEmployee[];
  estimatedRevenue: number;
  area: string;
  address: string;
  date: string;
  time: string;
  progress: number;
}

export interface ServiceDeliveryUpdate {
  //29-10-2024
  status?: string;
  allocatedEmployee?: string;
  progress?: number;
  notes?: string;
}

export interface AssignedEmployee {
  userId: number;
  name: string;
}

export type CreateEmployeeData = Omit<Employee, "id" | "joinedAt">;
export type UpdateEmployeeData = Partial<CreateEmployeeData>;
export type UpdateServiceData = Pick<
  OrganizationService,
  "expectedFee" | "status"
>;
