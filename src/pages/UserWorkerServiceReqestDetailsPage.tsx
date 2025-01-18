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
import config from "@/config/config";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

type LaborOffer = {
  priceOfferId: number;
  labourFirstName: string;
  labourMiddleName: string;
  labourLastName: string;
  labourRating: number;
  proposedPrice: number;
};

type SelectedLabour = {
  labourId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type WorkerService = {
  date: string;
  timeSlot: string;
  status: string;
  description: string;
  location: string;
  zipcode: string;
  city: string;
  selectedLabour: SelectedLabour | null;
};

export function UserWorkerServiceReqestDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<WorkerService | null>(null);
  const [offers, setOffers] = useState<LaborOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const bookingId = serviceId?.split('-')[1];
      if (!bookingId) return;
      setLoading(true);
      setError(null);
      try {
        const [serviceDetails, offerDetails] = await Promise.all([
          getReqDetails(bookingId),
          getReqOffers(bookingId)
        ]);
        console.log(serviceDetails);
        
        setService(serviceDetails);
        setOffers(offerDetails);
        await checkFeedbackEligibility(bookingId, serviceDetails);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const checkFeedbackEligibility = async (bookingId: string, serviceDetails: WorkerService) => {
    if (serviceDetails.status !== "ACCEPTED") {
      setShowFeedback(false);
      return;
    }

    const serviceDate = new Date(serviceDetails.date);
    const currentDate = new Date();

    if (serviceDate > currentDate) {
      setShowFeedback(false);
      return;
    }

    try {
      const response = await axios.get(`${config.apiURI}/api/reviews/check-user-review?bookingId=${bookingId}`, { withCredentials: true });
      const canGiveFeedback = !response.data;
      setShowFeedback(canGiveFeedback);
    } catch (error) {
      console.error("Error checking feedback eligibility:", error);
      setShowFeedback(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAcceptOffer = async (priceOfferId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${config.apiURI}/api/user/labour-bookings/accept-offer/${priceOfferId}`,
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

  const handleFeedbackSubmission = async () => {
    if (!serviceId || !service || !service.selectedLabour) return;
    const bookingId = serviceId.split('-')[0];
    const labourId = service.selectedLabour.labourId;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${config.apiURI}/api/reviews/user-review`,
        {
          bookingId: parseInt(bookingId),
          labourId,
          rating,
          review: feedback,
          feedbackType: "USER_TO_LABOUR"
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShowFeedback(false);
        // Optionally, show a success message to the user
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-primary text-primary-foreground">
          <Skeleton className="h-4 w-[200px] mb-2" />
          <Skeleton className="h-6 w-[300px]" />
        </CardHeader>
        <CardContent className="pt-6 px-4 sm:px-6">
          <Skeleton className="h-4 w-[100px] mb-4" />
          <Skeleton className="h-[200px] w-full mb-6" />
          <Skeleton className="h-[100px] w-full mb-6" />
          <Skeleton className="h-10 w-[150px]" />
        </CardContent>
      </Card>
    );
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
                {service.status === "ACCEPTED" && service.selectedLabour && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">Selected Labour</h3>
                    <p className="text-sm sm:text-base">
                      <strong>Name:</strong> {service.selectedLabour.firstName} {service.selectedLabour.lastName}
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Phone:</strong> {service.selectedLabour.phoneNumber}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {showFeedback && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Rate your experience</Label>
                    <div className="flex space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 cursor-pointer ${
                            star <= rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="feedback">Additional Comments</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Tell us about your experience"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={handleFeedbackSubmission}
                    className="w-full"
                    disabled={isLoading || rating === 0}
                  >
                    {isLoading ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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

