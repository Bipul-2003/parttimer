"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LaborOffer = {
  laborId: string;
  laborName: string;
  offeredPrice: number;
  rating: number;
};

type WorkerService = {
  id: string;
  requestNumber: string;
  date: Date;
  timeSlot: string;
  status: "PENDING" | "PRICE_OFFERED" | "ACCEPTED" | "COMPLETED";
  description: string;
  location: string;
  zipcode: string;
  city: string;
  note: string;
  laborOffers: LaborOffer[];
};

export function UserWorkerServiceReqestDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<WorkerService | null>(null);

  useEffect(() => {
    // Fetch service details
    // This is a mock implementation. Replace with actual API call.
    setService({
      id: serviceId || "",
      requestNumber: `REQ-${serviceId}`,
      date: new Date(),
      timeSlot: "8:30 AM - 11:30 AM",
      status: "PRICE_OFFERED",
      description: "Need help moving furniture",
      location: "123 Main St",
      zipcode: "12345",
      city: "New York",
      note: "Please bring moving straps and gloves",
      laborOffers: [
        {
          laborId: "L1",
          laborName: "John Doe",
          offeredPrice: 150,
          rating: 4.5,
        },
        {
          laborId: "L2",
          laborName: "Jane Smith",
          offeredPrice: 140,
          rating: 4.8,
        },
        {
          laborId: "L3",
          laborName: "Mike Johnson",
          offeredPrice: 160,
          rating: 4.2,
        },
      ],
    });
  }, [serviceId]);

  const handleBack = () => {
    navigate(-1); // This will navigate to the previous page
  };

  const handleAcceptOffer = async (laborId: string) => {
    // TODO: Implement API call to accept the offer
    console.log(
      `Accepted offer from labor ${laborId} for service ${serviceId}`
    );
    setService((prev) => (prev ? { ...prev, status: "ACCEPTED" } : null));
  };

  const handleCancelRequest = async () => {
    // TODO: Implement API call to cancel the request
    console.log(`Cancelled service ${serviceId}`);
    navigate(-1); // Go back to the previous page after cancelling
  };

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary text-primary-foreground">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4 inline" />
                Back to Services
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CardTitle className="text-xl sm:text-2xl font-semibold mt-2">
          Service: {service.requestNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-4 sm:px-6">
        <div className="mb-8 flex items-center space-x-2">
          <h2 className="text-lg font-semibold ">status</h2>
          <Badge
            variant={service.status === "ACCEPTED" ? "default" : "secondary"}>
            {service.status}
          </Badge>
        </div>

        <div className="space-y-6">
          {service.status === "PRICE_OFFERED" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Labor Offers</h2>
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Labor Name</TableHead>
                        <TableHead>Offered Price</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.laborOffers.map((offer) => (
                        <TableRow key={offer.laborId}>
                          <TableCell>{offer.laborName}</TableCell>
                          <TableCell>${offer.offeredPrice}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {offer.rating}
                              <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleAcceptOffer(offer.laborId)}>
                              Accept Offer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-2">Service Details</h2>
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <p className="mb-2 text-sm sm:text-base">
                  {service.description}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Date:</strong> {format(service.date, "PPP")}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Time:</strong> {service.timeSlot}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Location:</strong> {service.location}, {service.city},{" "}
                  {service.zipcode}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Note:</strong> {service.note}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {service.status !== "COMPLETED" && (
          <div className="mt-8">
            <Button variant="destructive" onClick={handleCancelRequest}>
              Cancel Service
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
