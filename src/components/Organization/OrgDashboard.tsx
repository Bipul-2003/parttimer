import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Package, Clock, MoreHorizontal } from "lucide-react";
import axios from "axios";

type ServiceRequest = {
  bookingId: number;
  serviceName: string;
  customerName: string;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
};

type DashboardStats = {
  totalEmployees: number;
  totalServices: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
};

export default function OrgDashboard() {
  const { orgId } = useParams<{ orgId: string }>();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState<string>("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dummy data for demonstration
        // setRecentBookings([
        //   {
        //     bookingId: 9,
        //     serviceName: "Car Wash",
        //     customerName: "v rajesh",
        //     date: "2024-11-01",
        //     time: "22:10",
        //     status: "CONFIRMED",
        //     paymentStatus: "COMPLETED",
        //   },
        //   {
        //     bookingId: 10,
        //     serviceName: "House Cleaning",
        //     customerName: "John Doe",
        //     date: "2024-11-02",
        //     time: "10:00",
        //     status: "PENDING",
        //     paymentStatus: "PENDING",
        //   },
        //   {
        //     bookingId: 11,
        //     serviceName: "Lawn Mowing",
        //     customerName: "Jane Smith",
        //     date: "2024-11-03",
        //     time: "14:30",
        //     status: "CONFIRMED",
        //     paymentStatus: "PENDING",
        //   },
        //   {
        //     bookingId: 12,
        //     serviceName: "Plumbing Service",
        //     customerName: "Alice Johnson",
        //     date: "2024-11-04",
        //     time: "09:15",
        //     status: "CONFIRMED",
        //     paymentStatus: "COMPLETED",
        //   },
        //   {
        //     bookingId: 13,
        //     serviceName: "Pest Control",
        //     customerName: "Bob Williams",
        //     date: "2024-11-05",
        //     time: "11:45",
        //     status: "PENDING",
        //     paymentStatus: "PENDING",
        //   },
        // ]);
        // setStats({
        //   totalEmployees: 3,
        //   totalServices: 3,
        //   totalBookings: 40,
        //   completedBookings: 11,
        //   pendingBookings: 0,
        // });

        // Uncomment the following lines when ready to fetch from API
        const [statsResponse, bookingsResponse] = await Promise.all([
          axios.get<DashboardStats>(`/api/organization/${orgId}/dashboard`),
          axios.get<ServiceRequest[]>(`/api/organization/${orgId}/bookings`),
        ]);
        console.log(statsResponse.data);
        console.log(bookingsResponse.data);
        setStats(statsResponse.data);
        setRecentBookings(bookingsResponse.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [orgId]);

  const handleOfferPrice = async (bookingId: number, newPrice: number) => {
    try {
      await axios.post(`/api/organization/${orgId}/offer-price`, {
        bookingId,
        offerPrice: newPrice,
      });
      // Refresh the bookings data after successful offer
      const response = await axios.get<ServiceRequest[]>(
        `/api/organization/${orgId}/recent-bookings`
      );
      setRecentBookings(response.data);
    } catch (err) {
      console.error("Error offering price:", err);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        No dashboard data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">Available services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">All-time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Service Requests</CardTitle>
          <CardDescription>
            You have {recentBookings.length} recent requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell className="font-medium">
                    {booking.serviceName}
                  </TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "CONFIRMED" ? "default" : "secondary"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.paymentStatus === "COMPLETED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(
                              booking.bookingId.toString()
                            )
                          }
                        >
                          Copy booking ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              Offer price
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Offer Price for {booking.serviceName}
                              </DialogTitle>
                              <DialogDescription>
                                Booking for {booking.customerName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                  Offer Price
                                </Label>
                                <Input
                                  id="price"
                                  value={offerPrice}
                                  onChange={(e) =>
                                    setOfferPrice(e.target.value)
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={() =>
                                  handleOfferPrice(
                                    booking.bookingId,
                                    Number(offerPrice)
                                  )
                                }
                              >
                                Submit Offer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
