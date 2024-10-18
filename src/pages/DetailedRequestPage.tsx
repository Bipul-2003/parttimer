import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, CheckCircle2 } from "lucide-react";

import {
  ServiceRequest,
  Status,
  PaymentSimulation,
  fetchServiceRequest,
  selectOrganization,
  simulatePayment,
  submitFeedback,
  confirmServiceRequest,
} from "@/api/serviceRequestsApi";
import { useParams } from "react-router-dom";

type BackendStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED";

export default function DetailedServiceRequestPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = React.useState<ServiceRequest | null>(null);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<
    "offline" | "bank" | ""
  >("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [newStatus, setNewStatus] = React.useState<BackendStatus | null>(null);

  const statusOrder: Status[] = [
    "posted",
    "request sent",
    "confirmed",
    "payment pending",
    "completed",
  ];
  React.useEffect(() => {
    const loadServiceRequest = async () => {
      if (!requestId) {
        setError("No request ID provided");
        console.log("no request ID provided");
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchServiceRequest(parseInt(requestId, 10));
        console.log("Received data:", data);
        setRequest({
          ...data,
          // Make sure optional fields are properly handled
          associatedOrganization: data.associatedOrganization || undefined,
          employeesInvolved: data.employeesInvolved || undefined,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load service request"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceRequest();
  }, [requestId]);

  const handleSelectService = async (orgId: number) => {
    if (!request) return;
    try {
      setIsLoading(true);
      console.log("received data for handleSelectService: ", request);
      const updatedRequest = await selectOrganization(request.id, orgId);
      setRequest(updatedRequest);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to select organization"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmission = async () => {
    if (!request || !paymentMethod) return;

    try {
      setIsLoading(true);
      const paymentInfo: PaymentSimulation = {
        paymentMethod,
        bankDetails:
          paymentMethod === "bank" ? "Simulated bank details" : undefined,
      };
      const updatedRequest = await simulatePayment(request.id, paymentInfo);
      setRequest(updatedRequest);
      if (updatedRequest.paymentStatus === "COMPLETED") {
        await confirmServiceRequest(request.id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmService = async () => {
    if (!request) return;
    try {
      setIsLoading(true);
      const updatedRequest = await confirmServiceRequest(request.id); // Call the new API function
      setRequest(updatedRequest);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to confirm service"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmission = async () => {
    if (!request) return;

    try {
      setIsLoading(true);
      const updatedRequest = await submitFeedback(request.id, {
        rating,
        feedback,
      });
      setRequest(updatedRequest);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const statusMapping: Record<BackendStatus, Status> = {
    PENDING: "posted",
    CONFIRMED: "confirmed",
    IN_PROGRESS: "payment pending",
    COMPLETED: "completed",
  };
  // Then update your status progression display
  const getDisplayStatus = (status: string): Status => {
    return (
      statusMapping[status as BackendStatus] || (status.toLowerCase() as Status)
    );
  };

  if (isLoading && !request) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>{error}</CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return null; // or return a loading state
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl">Car Wash Service</CardTitle>
              <CardDescription>Request ID: {request.id}</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg py-1">
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Status Progression */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {statusOrder.map((status, index) => (
              <div key={status} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    statusOrder.indexOf(getDisplayStatus(request.status)) >=
                    index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } mb-2`}
                >
                  {statusOrder.indexOf(getDisplayStatus(request.status)) >
                  index ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-center capitalize">
                  {status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <div className="font-medium">{request.date}</div>
            </div>
            <div>
              <Label>Time</Label>
              <div className="font-medium">{request.time}</div>
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <div className="font-medium">{request.address}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Proposals */}
      {request.status === "PENDING" && request.availableOrganizations && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choose a Service Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {request.availableOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent"
                >
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <Badge variant="secondary" className="mt-1">
                      ${org.expectedFee.toFixed(2)}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleSelectService(org.id)}
                    disabled={isLoading}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Sent */}
      {request.status === "request sent" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Request Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your request has been sent to{" "}
              {request.associatedOrganization?.name}. We're waiting for their
              confirmation.
            </p>
            <Button onClick={confirmService}>Simulate Confirmation</Button>
          </CardContent>
        </Card>
      )}

      {/* Associated Organization */}
      {request.status !== "PENDING" && request.associatedOrganization && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {request.associatedOrganization.name}
              </span>
              <Badge variant="secondary">
                ${request.associatedOrganization.expectedFee.toFixed(2)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employees */}
      {request.employeesInvolved && request.employeesInvolved.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {request.employeesInvolved.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Section */}
      {request.paymentStatus === "PENDING" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              onValueChange={(value) =>
                setPaymentMethod(value as "offline" | "bank")
              }
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline" className="font-medium">
                  Pay Offline
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="font-medium">
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>
            {paymentMethod === "bank" && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Bank Details:</h4>
                <p>Bank Name: Example Bank</p>
                <p>Account Number: 1234567890</p>
                <p>IFSC Code: EXMP0001234</p>
              </div>
            )}
            <Button
              onClick={handlePaymentSubmission}
              className="mt-4 w-full"
              disabled={!paymentMethod || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Payment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Submitted */}
      {request.status === "payment submitted" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg mb-4">
              Thank you for your payment!
            </p>
            <p className="text-center">
              We are verifying your payment. This usually takes a few moments.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {request.status === "COMPLETED" && (
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
                        star <= rating
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
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
  );
}
