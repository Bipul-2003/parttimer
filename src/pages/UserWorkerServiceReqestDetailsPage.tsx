import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star } from 'lucide-react';
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
import { getReqDetails, getReqOffers } from "@/api/UserApis/bookingsApi";
import axios from 'axios';


type LaborOffer = {
  priceOfferId: number;
  labourFirstName: string;
  labourMiddleName: string;
  labourLastName: string;
  labourRating: number;
  proposedPrice: number;
};

type WorkerService = {
  date: string;
  timeSlot: string;
  status: string;
  description: string;
  location: string;
  zipcode: string;
  city: string;
};



export function UserWorkerServiceReqestDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<WorkerService | null>(null);
  const [offers, setOffers] = useState<LaborOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const labourAssignmentId = serviceId?.split('-')[1];
      if (!labourAssignmentId) 
        return;
      if (!serviceId) return;
      setLoading(true);
      setError(null);
      try {
        const [serviceDetails, offerDetails] = await Promise.all([
          getReqDetails(labourAssignmentId),
          getReqOffers(labourAssignmentId)
        ]);
        setService(serviceDetails);
        setOffers(offerDetails);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAcceptOffer = async (priceOfferId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/labour-bookings/accept-offer/${priceOfferId}`,
        {}, // empty body since it's just the URL parameter
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log(`Accepted offer ${priceOfferId} for service ${serviceId}`);
        setService((prev) => prev ? { ...prev, status: "ACCEPTED" } : null);
      } else {
        throw new Error('Failed to accept offer');
      }
    } catch (err) {
      setError("Failed to accept offer. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    // TODO: Implement API call to cancel the request
    console.log(`Cancelled service ${serviceId}`);
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!service) {
    return <div>No service details found.</div>;
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
          Service Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-4 sm:px-6">
        <div className="mb-8 flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Status</h2>
          <Badge variant={service.status === "ACCEPTED" ? "default" : "secondary"}>
            {service.status}
          </Badge>
        </div>

        <div className="space-y-6">
          {service.status === "OPEN" && offers.length > 0 && (
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
                      {offers.map((offer) => (
                        <TableRow key={offer.priceOfferId}>
                          <TableCell>{`${offer.labourFirstName} ${offer.labourMiddleName} ${offer.labourLastName}`}</TableCell>
                          <TableCell>${offer.proposedPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {offer.labourRating.toFixed(1)}
                              <Star className="h-4 w-4 ml-1 fill-yellow-400 text-yellow-400" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              onClick={() => handleAcceptOffer(offer.priceOfferId)}
                              disabled={loading}
                            >
                              {loading ? 'Accepting...' : 'Accept Offer'}
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
                  <strong>Date:</strong> {format(new Date(service.date), "PPP")}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Time:</strong> {service.timeSlot}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Location:</strong> {service.location}, {service.city}, {service.zipcode}
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

