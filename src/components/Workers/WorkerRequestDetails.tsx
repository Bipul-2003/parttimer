import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, User, DollarSign, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

import config from "@/config/config";

export type LaborRequest = {
  bookingDate: string;
  bookingNote: string;
  bookingStatus: string;
  timeSlot: string;
  userPhoneNumber: string | null;
  userEmail: string | null;
  bookingAddress: string | null;
  acceptedPrice: number | null;
  acceptedLabourRating: number | null;
  status: "ACCEPTED" | "PENDING" | "WITHDRAWN";
  offeredPrice?: number | null;
};

export default function LaborRequestDetails() {
  const { id: requestId } = useParams<{ id: string }>();
  const [request, setRequest] = useState<LaborRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axios.get<LaborRequest>(config.apiURI+`/api/labour/${requestId}/details`, {
          withCredentials: true,
        });
        setRequest(response.data);
        await checkFeedbackEligibility();
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch labor request details. Please try again later.",
        });
        console.error("Error fetching labor request details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId, toast]);

  const checkFeedbackEligibility = async () => {
    if (!requestId) return;
    
    try {
      const response = await axios.get(`${config.apiURI}/api/reviews/check-labour-review?bookingId=${requestId}`, { withCredentials: true });
      const canGiveFeedback = !response.data;
      
      if (request && request.status === "ACCEPTED") {
        const serviceDate = new Date(request.bookingDate);
        const currentDate = new Date();
        setShowFeedback(canGiveFeedback && serviceDate < currentDate);
      } else {
        setShowFeedback(false);
      }
    } catch (error) {
      console.error("Error checking feedback eligibility:", error);
      setShowFeedback(false);
    }
  };

  const handleFeedbackSubmission = async () => {
    if (!requestId) return;
    setIsSubmittingFeedback(true);
    try {
      const response = await axios.post(
        `${config.apiURI}/api/reviews//labour-review`,
        {
          bookingId: parseInt(requestId),
          rating,
          review: feedback,
          feedbackType: "LABOUR_TO_USER"
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShowFeedback(false);
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit feedback. Please try again later.",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "WITHDRAWN":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderStatusSpecificContent = () => {
    if (!request) return null;

    switch (request.status) {
      case "ACCEPTED":
        return (
          <Card className="mt-4 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-green-500" />
                <span className="font-medium">Phone:</span> {request.userPhoneNumber}
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-green-500" />
                <span className="font-medium">Email:</span> {request.userEmail}
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-green-500" />
                <span className="font-medium">Address:</span> {request.bookingAddress}
              </div>
            </CardContent>
          </Card>
        );
      case "WITHDRAWN":
        return (
          <Card className="mt-4 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Withdrawn Request Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-red-500" />
                <span className="font-medium">Accepted Price:</span> ${request.acceptedPrice?.toFixed(2)}
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-red-500" />
                <span className="font-medium">Labor Rating:</span> {request.acceptedLabourRating?.toFixed(1)} / 5.0
              </div>
            </CardContent>
          </Card>
        );
      case "PENDING":
        return (
          <Card className="mt-4 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-700">Pending Request Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="font-medium">Your Offered Price:</span> ${request.offeredPrice?.toFixed(2)}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="font-medium">Waiting for customer acceptance</span>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full mx-auto mt-8">
      <CardHeader className="bg-primary text-primary-foreground">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
              <Link to="/worker">
                <ChevronLeft className="mr-2 h-4 w-4 inline" />
                Back to Dashboard
              </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CardTitle className="text-2xl font-semibold mt-2">
          Labor Request Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : request ? (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-xl font-semibold">Status</Label>
                <Badge className={`${getStatusColor(request.status)} text-white px-3 py-1 rounded-full text-sm`}>
                  {request.status}
                </Badge>
              </div>
            </div>

            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Booking Date</Label>
                  <p>{new Date(request.bookingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="font-medium">Time Slot</Label>
                  <p>{request.timeSlot}</p>
                </div>
                <div>
                  <Label className="font-medium">Booking Note</Label>
                  <p>{request.bookingNote}</p>
                </div>
                {renderStatusSpecificContent()}

                {showFeedback && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Provide Feedback</CardTitle>
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
                            placeholder="Tell us about your experience with the customer"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        <Button
                          onClick={handleFeedbackSubmission}
                          className="w-full"
                          disabled={isSubmittingFeedback || rating === 0}
                        >
                          {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

