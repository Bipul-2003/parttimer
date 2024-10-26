import axios, { AxiosInstance } from "axios";
import {
  DashboardStats,
  Employee,
  OrganizationService,
  Booking,
  ServiceAssignment,
  CreateEmployeeData,
  UpdateEmployeeData,
  UpdateServiceData,
} from "../types/dashboardTypes";

class DashboardAPI {
  private api: AxiosInstance;

  constructor(baseURL = "http://localhost:8080/api") {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private getOrgEndpoint(orgId: string | number) {
    return `/organization/${orgId}`;
  }

  // Error handler helper
  private async handleRequest<T>(promise: Promise<any>): Promise<T> {
    try {
      const response = await promise;
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "An error occurred");
      }
      throw error;
    }
  }

  // Dashboard Stats
  async getDashboardStats(orgId: string | number): Promise<DashboardStats> {
    return this.handleRequest(
      this.api.get(`${this.getOrgEndpoint(orgId)}/dashboard`)
    );
  }

  // Employee Management
  async getEmployees(orgId: string | number): Promise<Employee[]> {
    return this.handleRequest(
      this.api.get(`${this.getOrgEndpoint(orgId)}/employees`)
    );
  }

  async addEmployee(
    orgId: string | number,
    employee: CreateEmployeeData
  ): Promise<Employee> {
    return this.handleRequest(
      this.api.post(`${this.getOrgEndpoint(orgId)}/employees`, employee)
    );
  }

  async updateEmployee(
    orgId: string | number,
    userId: number,
    employee: UpdateEmployeeData
  ): Promise<Employee> {
    return this.handleRequest(
      this.api.put(
        `${this.getOrgEndpoint(orgId)}/employees/${userId}`,
        employee
      )
    );
  }

  // Service Management
  async getServices(orgId: string | number): Promise<OrganizationService[]> {
    return this.handleRequest(
      this.api.get(`${this.getOrgEndpoint(orgId)}/services`)
    );
  }

  async updateService(
    orgId: string | number,
    serviceId: number,
    data: UpdateServiceData
  ): Promise<OrganizationService> {
    return this.handleRequest(
      this.api.put(`${this.getOrgEndpoint(orgId)}/services/${serviceId}`, data)
    );
  }

  // Booking Management
  async getBookings(
    orgId: string | number,
    status?: Booking["status"]
  ): Promise<Booking[]> {
    return this.handleRequest(
      this.api.get(`${this.getOrgEndpoint(orgId)}/bookings`, {
        params: { status },
      })
    );
  }

  // Service Assignment Management
  async getServiceAssignments(
    orgId: string | number
  ): Promise<ServiceAssignment[]> {
    return this.handleRequest(
      this.api.get(`${this.getOrgEndpoint(orgId)}/service-assignments`)
    );
  }

  async assignEmployeesToBooking(
    orgId: string | number,
    bookingId: number,
    employeeIds: number[]
  ): Promise<ServiceAssignment> {
    return this.handleRequest(
      this.api.post(
        `${this.getOrgEndpoint(orgId)}/service-assignments/${bookingId}/assign`,
        { employeeIds }
      )
    );
  }

  // Latest Bookings for Dashboard
  async getLatestBookings(orgId: string | number): Promise<Booking[]> {
    return this.handleRequest<Booking[]>(
      this.api.get(`${this.getOrgEndpoint(orgId)}/latest-bookings`)
    );
  }
}

export const dashboardAPI = new DashboardAPI();
