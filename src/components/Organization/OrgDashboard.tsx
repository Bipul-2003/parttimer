import { useState } from "react";
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

import { DashboardComponentProps } from "@/pages/OrganizationPage";

// Updated mock data for service requests
const serviceRequests = [
  {
    id: 1,
    name: "Car Wash",
    type: "Primitive",
    status: "Pending",
    date: "2023-07-01",
    time: "10:00 AM",
  },
  {
    id: 2,
    name: "Lawn Mowing",
    type: "Primitive",
    status: "In Progress",
    date: "2023-06-28",
    time: "2:30 PM",
  },
  {
    id: 3,
    name: "Tennis Coaching",
    type: "Primitive",
    status: "Completed",
    date: "2023-06-25",
    time: "4:00 PM",
  },
  {
    id: 4,
    name: "House Cleaning",
    type: "Primitive",
    status: "Pending",
    date: "2023-07-03",
    time: "9:00 AM",
  },
  {
    id: 5,
    name: "Custom Garden Design",
    type: "New",
    status: "In Progress",
    date: "2023-06-30",
    time: "11:30 AM",
  },
];

export default function OrgDashboard({
  stats,
  services,
  loading,
}: DashboardComponentProps) {
  const [offerPrice, setOfferPrice] = useState<string>("");

  // Early return for loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700" />
      </div>
    );
  }

  // Early return if stats are not available
  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        No dashboard data available
      </div>
    );
  }
  const recentBookings = services.slice(0, 5).map((service) => ({
    id: service.id,
    name: service.name,
    type: service.category || "Primitive",
    status: service.status,
    date: new Date().toISOString().split("T")[0], // You might want to add bookingDate to your service type
    time: "10:00 AM", // You might want to add bookingTime to your service type
    expectedFee: service.expectedFee,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
            {/* <div className="text-2xl font-bold">
              ${stats.revenue.monthly.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly Revenue
            </p> */}
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
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
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
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
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
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
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
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
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
                        request.type === "Primitive" ? "secondary" : "default"
                      }
                    >
                      {request.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "active" ? "default" : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.time}</TableCell>
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
                              Update price
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Update Price for {request.name}
                              </DialogTitle>
                              <DialogDescription>
                                Current price: ${request.expectedFee}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                  New Price
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
                              <Button type="submit">Update price</Button>
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
