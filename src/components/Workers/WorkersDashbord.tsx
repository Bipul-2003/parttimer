"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import axios from 'axios';
// import { LaborRequestDetails } from "./LaborRequestDetails"

type LaborRequest = {
  id: string;
  requestNumber: string;
  date: Date;
  timeSlot: string;
  status: "PENDING" | "PRICE_OFFERED" | "ACCEPTED" | "COMPLETED";
  description: string;
  location: string;
  zipcode: string;
  city: string;
  offeredPrice?: number;
};

export function WorkerDashboard() {
  const [requests, setRequests] = useState<LaborRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/labour-dashboard/open-bookings');
        setRequests(response.data.map((item: any) => ({
          id: item.id.toString(),
          requestNumber: item.bookingId.toString(),
          date: new Date(item.bookingDate),
          timeSlot: item.timeSlot,
          status: "PENDING",
          description: item.bookingNote,
          location: item.city,
          zipcode: item.zipcode,
          city: item.city,
        })));
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleOfferPrice = async (requestId: string, price: number) => {
    // TODO: Implement API call to offer price
    console.log(`Offered price $${price} for request ${requestId}`);
    // Update the request status and price in the local state
    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? { ...req, status: "PRICE_OFFERED" as const, offeredPrice: price }
          : req
      )
    );
  };

  const handleCompleteRequest = async (requestId: string) => {
    // TODO: Implement API call to mark request as completed
    console.log(`Marked request ${requestId} as completed`);
    // Update the request status in the local state
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "COMPLETED" as const } : req
      )
    );
  };

  return (
    <>
      {selectedRequestId ? (
        <div className="">hii</div>
      ) : (
        // <LaborRequestDetails
        //   requestId={selectedRequestId}
        //   onBack={() => setSelectedRequestId(null)}
        // />
        <div className="">
          <h1 className="text-2xl font-bold mb-4">Labor Requests</h1>

          <Card>
            <CardHeader>
              <CardTitle>Available Labor Requests</CardTitle>
              <CardDescription>
                There are {requests.length} labor requests available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Zipcode</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Offered Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.requestNumber}</TableCell>
                      <TableCell>{format(request.date, "PP")}</TableCell>
                      <TableCell>{request.timeSlot}</TableCell>
                      <TableCell>{request.city}</TableCell>
                      <TableCell>{request.zipcode}</TableCell>
                      <TableCell>{request.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "ACCEPTED"
                              ? "default"
                              : "secondary"
                          }>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.offeredPrice
                          ? `$${request.offeredPrice}`
                          : "N/A"}
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
                                navigator.clipboard.writeText(request.id)
                              }>
                              Copy request ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              onClick={() => setSelectedRequestId(request.id)}>
                              View Details
                            </DropdownMenuItem>
                            {request.status === "PENDING" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}>
                                    Offer Price
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Offer Price</DialogTitle>
                                    <DialogDescription>
                                      Enter the price you want to offer for this
                                      request.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Input
                                    id="price"
                                    placeholder="Enter price"
                                    type="number"
                                  />
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        const price = parseFloat(
                                          (
                                            document.getElementById(
                                              "price"
                                            ) as HTMLInputElement
                                          ).value
                                        );
                                        if (price)
                                          handleOfferPrice(request.id, price);
                                      }}>
                                      Submit Offer
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            {request.status === "ACCEPTED" && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}>
                                    Mark as Completed
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Complete Request</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to mark this request
                                      as completed?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      onClick={() =>
                                        handleCompleteRequest(request.id)
                                      }>
                                      Mark as Completed
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
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
      )}
    </>
  );
}

