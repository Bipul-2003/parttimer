// //

// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { BarChart3, Users, Package, Clock, MoreHorizontal } from "lucide-react";
// import { dashboardAPI } from "@/api/dashboard";
// import type { Booking, DashboardStats } from "@/types/dashboardTypes";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import config from "./../../config/config";

// export default function OrgDashboard() {
//   // const { orgId } = useParams<{ orgId: string }>();
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [offerPrice, setOfferPrice] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { user } = useAuth();
//   const { toast } = useToast();

//   const fetchDashboardData = async () => {
//     if (!user || user.user_type !== "USER" || !user.organization) {
//       setError("User does not have access to organization data");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const [statsResponse, latestBookingsResponse] = await Promise.all([
//         dashboardAPI.getDashboardStats(user.organization.id.toString()),
//         dashboardAPI.getLatestBookings(user.organization.id.toString()),
//       ]);

//       setStats(statsResponse);
//       setRecentBookings(latestBookingsResponse);
//     } catch (err) {
//       setError("Failed to fetch dashboard data. Please try again later.");
//       console.error("Error fetching dashboard data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, [user]);

//   const handleOfferPrice = async (bookingId: number, newPrice: number) => {
//     // console.log(config.apiURI);
//     if (isSubmitting) return;

//     try {
//       setIsSubmitting(true);

//       if (user?.user_type !== "USER" || !user.organization) {
//         toast({
//           title: "Error",
//           description: "User does not have organization data",
//           variant: "destructive",
//         });
//         return;
//       }
//       await axios.post(
//         `${config.apiURI}/api/organizations/${user.organization.id}/bookings/${bookingId}/price-offer`,
//         {
//           offeredPrice: newPrice,
//         },
//         { withCredentials: true }
//       );

//       toast({
//         title: "Success",
//         description: "Price offer submitted successfully",
//       });

//       // Reset offer price
//       setOfferPrice("");

//       // Refresh data
//       await fetchDashboardData();
//     } catch (err) {
//       console.error("Error offering price:", err);
//       toast({
//         title: "Error",
//         description: "Failed to submit price offer. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   if (!stats) {
//     return <ErrorMessage message="No dashboard data available" />;
//   }

//   return (
//     <div className="space-y-6">
//       <DashboardStats stats={stats} />
//       <RecentBookings
//         bookings={recentBookings}
//         offerPrice={offerPrice}
//         setOfferPrice={setOfferPrice}
//         handleOfferPrice={handleOfferPrice}
//       />
//     </div>
//   );
// }

// function DashboardStats({ stats }: { stats: DashboardStats }) {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       <StatCard
//         title="Total Employees"
//         value={stats.totalEmployees}
//         icon={<Users className="h-4 w-4 text-muted-foreground" />}
//         description="Active employees"
//       />
//       <StatCard
//         title="Total Services"
//         value={stats.totalServices}
//         icon={<Package className="h-4 w-4 text-muted-foreground" />}
//         description="Active services"
//       />
//       <StatCard
//         title="Total Pending Bookings"
//         value={stats.pendingBookings}
//         icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
//         description="Complete bookings"
//       />
//       <StatCard
//         title="Completed Bookings"
//         value={stats.completedBookings}
//         icon={<Clock className="h-4 w-4 text-muted-foreground" />}
//         description="Successfully completed"
//       />
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   icon,
//   description,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   description: string;
// }) {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {icon}
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//         <p className="text-xs text-muted-foreground">{description}</p>
//       </CardContent>
//     </Card>
//   );
// }

// function RecentBookings({
//   bookings,
//   offerPrice,
//   setOfferPrice,
//   handleOfferPrice,
// }: {
//   bookings: Booking[];
//   offerPrice: string;
//   setOfferPrice: (price: string) => void;
//   handleOfferPrice: (bookingId: number, newPrice: number) => Promise<void>;
// }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Recent Service Requests</CardTitle>
//         <CardDescription>
//           You have {bookings.length} recent requests
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Service Name</TableHead>
//               <TableHead>Customer Name</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Time</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Payment Status</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {bookings.map((booking) => (
//               <TableRow key={booking.bookingId}>
//                 <TableCell className="font-medium">
//                   {booking.serviceName}
//                 </TableCell>
//                 <TableCell>{booking.customerName}</TableCell>
//                 <TableCell>{booking.date}</TableCell>
//                 <TableCell>{booking.time}</TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={
//                       booking.status === "CONFIRMED" ? "default" : "secondary"
//                     }>
//                     {booking.status}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={
//                       booking.paymentStatus === "COMPLETED"
//                         ? "default"
//                         : "secondary"
//                     }>
//                     {booking.paymentStatus}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <BookingActions
//                     booking={booking}
//                     offerPrice={offerPrice}
//                     setOfferPrice={setOfferPrice}
//                     handleOfferPrice={handleOfferPrice}
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }

// function BookingActions({
//   booking,
//   offerPrice,
//   setOfferPrice,
//   handleOfferPrice,
// }: {
//   booking: Booking;
//   offerPrice: string;
//   setOfferPrice: (price: string) => void;
//   handleOfferPrice: (bookingId: number, newPrice: number) => Promise<void>;
// }) {
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmitOffer = async () => {
//     const price = Number(offerPrice);
//     if (isNaN(price) || price <= 0) {
//       toast({
//         title: "Invalid price",
//         description: "Please enter a valid price greater than 0.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);
//     await handleOfferPrice(booking.bookingId, price);
//     setIsSubmitting(false);
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <span className="sr-only">Open menu</span>
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//         <DropdownMenuItem
//           onClick={() => {
//             navigator.clipboard.writeText(booking.bookingId.toString());
//             toast({
//               title: "Copied",
//               description: "Booking ID copied to clipboard",
//             });
//           }}>
//           Copy booking ID
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>View details</DropdownMenuItem>
//         <Dialog>
//           <DialogTrigger asChild>
//             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
//               Offer price
//             </DropdownMenuItem>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Offer Price for {booking.serviceName}</DialogTitle>
//               <DialogDescription>
//                 Booking for {booking.customerName}
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="price" className="text-right">
//                   Offer Price
//                 </Label>
//                 <Input
//                   id="price"
//                   value={offerPrice}
//                   onChange={(e) => setOfferPrice(e.target.value)}
//                   className="col-span-3"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 type="submit"
//                 onClick={handleSubmitOffer}
//                 disabled={isSubmitting}>
//                 {isSubmitting ? "Submitting..." : "Submit Offer"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// function LoadingSpinner() {
//   return (
//     <div className="flex items-center justify-center h-full">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700" />
//     </div>
//   );
// }

// function ErrorMessage({ message }: { message: string }) {
//   return <div className="text-center text-red-500">{message}</div>;
// }

"use client";

import type React from "react";
import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import axios from "axios";
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
import { dashboardAPI } from "@/api/dashboard";
import type { Booking, DashboardStats } from "@/types/dashboardTypes";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import config from "@/config/config";

// PriceChangeDialog Component
function PriceChangeDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (price: number) => void;
}) {
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    const formattedPrice = Number.parseFloat(price);
    if (isNaN(formattedPrice) || formattedPrice <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formattedPrice);
      setPrice("");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Offer Price</DialogTitle>
          <DialogDescription>Enter the offer price below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// StatCard Component
function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// DashboardStats Component
function DashboardStats({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Employees"
        value={stats.totalEmployees}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Active employees"
      />
      <StatCard
        title="Total Services"
        value={stats.totalServices}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        description="Active services"
      />
      <StatCard
        title="Total Pending Bookings"
        value={stats.pendingBookings}
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        description="Pending bookings"
      />
      <StatCard
        title="Completed Bookings"
        value={stats.completedBookings}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        description="Successfully completed"
      />
    </div>
  );
}

// BookingActions Component
function BookingActions({
  booking,
  onOfferPrice,
}: {
  booking: Booking;
  onOfferPrice: (bookingId: number) => void;
}) {
  const { toast } = useToast();

  return (
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
          onClick={() => {
            navigator.clipboard.writeText(booking.bookingId.toString());
            toast({
              title: "Copied",
              description: "Booking ID copied to clipboard",
            });
          }}>
          Copy booking ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onOfferPrice(booking.bookingId)}>
          Offer price
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// RecentBookings Component
function RecentBookings({
  bookings,
  onOfferPrice,
}: {
  bookings: Booking[];
  onOfferPrice: (bookingId: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Service Requests</CardTitle>
        <CardDescription>
          You have {bookings.length} recent requests
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
            {bookings.map((booking) => (
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
                    }>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.paymentStatus === "COMPLETED"
                        ? "default"
                        : "secondary"
                    }>
                    {booking.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <BookingActions
                    booking={booking}
                    onOfferPrice={onOfferPrice}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// LoadingSpinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700" />
    </div>
  );
}

// ErrorMessage Component
function ErrorMessage({ message }: { message: string }) {
  return <div className="text-center text-red-500">{message}</div>;
}

// Main OrgDashboard Component
export default function OrgDashboard() {
  // const { orgId } = useParams<{ orgId: string }>();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    if (!user || user.user_type !== "USER" || !user.organization) {
      setError("User does not have access to organization data");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [statsResponse, latestBookingsResponse] = await Promise.all([
        dashboardAPI.getDashboardStats(user.organization.id.toString()),
        dashboardAPI.getLatestBookings(user.organization.id.toString()),
      ]);

      setStats(statsResponse);
      setRecentBookings(latestBookingsResponse);
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again later.");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handlePriceSubmit = async (price: number) => {
    if (user?.user_type !== "USER" || !user.organization) {
      toast({
        title: "Error",
        description: "User does not have organization data",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(
        `${config.apiURI}/api/organizations/${user.organization.id}/bookings/${selectedBookingId}/price-offer`,
        {
          offeredPrice: price,
        },
        { withCredentials: true }
      );

      toast({
        title: "Success",
        description: "Price offer submitted successfully",
      });

      await fetchDashboardData();
    } catch (err) {
      console.error("Error offering price:", err);
      toast({
        title: "Error",
        description: "Failed to submit price offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOfferPrice = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsPriceDialogOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!stats) {
    return <ErrorMessage message="No dashboard data available" />;
  }

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <RecentBookings
        bookings={recentBookings}
        onOfferPrice={handleOfferPrice}
      />
      <PriceChangeDialog
        isOpen={isPriceDialogOpen}
        onClose={() => setIsPriceDialogOpen(false)}
        onSubmit={handlePriceSubmit}
      />
    </div>
  );
}
