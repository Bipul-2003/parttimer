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
import {
  BarChart3,
  DollarSign,
  Users,
  Package,
  MoreHorizontal,
} from "lucide-react";
import axios from "axios";

type ServiceRequest = {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  expectedFee: number;
};

type DashboardStats = {
  revenue: {
    monthly: number;
  };
  activeClients: number;
  activeServices: number;
  serviceRequests: number;
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

        setRecentBookings([
          {
            id: 1,
            name: "Website Design",
            type: "Digital",
            date: "2024-10-25",
            time: "10:00 AM",
            expectedFee: 2500,
          },
          {
            id: 2,
            name: "Logo Creation",
            type: "Design",
            date: "2024-10-26",
            time: "2:30 PM",
            expectedFee: 500,
          },
          {
            id: 3,
            name: "SEO Optimization",
            type: "Digital",
            date: "2024-10-27",
            time: "11:15 AM",
            expectedFee: 1200,
          },
          {
            id: 4,
            name: "Social Media Management",
            type: "Marketing",
            date: "2024-10-28",
            time: "9:00 AM",
            expectedFee: 800,
          },
          {
            id: 5,
            name: "Content Writing",
            type: "Content",
            date: "2024-10-29",
            time: "3:45 PM",
            expectedFee: 300,
          },
        ]);
        setStats({
          revenue: {
            monthly: 125000,
          },
          activeClients: 1250,
          activeServices: 75,
          serviceRequests: 320,
        });

        // const [statsResponse, bookingsResponse] = await Promise.all([
        //   axios.get<DashboardStats>(`/api/organization/${orgId}/stats`),
        //   axios.get<ServiceRequest[]>(`/api/organization/${orgId}/recent-bookings`)
        // ])

        // setStats(statsResponse.data)
        // setRecentBookings(bookingsResponse.data)
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [orgId]);

  const handleOfferPrice = async (requestId: number, newPrice: number) => {
    try {
      await axios.post(`/api/organization/${orgId}/offer-price`, {
        requestId,
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.revenue.monthly.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeClients.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total active clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Services
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeServices.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total active services
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Requests
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.serviceRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total service requests
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
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Expected Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.type === "Digital" ? "secondary" : "default"
                      }
                    >
                      {request.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.time}</TableCell>
                  <TableCell>${request.expectedFee.toLocaleString()}</TableCell>
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
                            navigator.clipboard.writeText(request.id.toString())
                          }
                        >
                          Copy request ID
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
                                Offer Price for {request.name}
                              </DialogTitle>
                              <DialogDescription>
                                Current expected fee: ${request.expectedFee}
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
                                    request.id,
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
