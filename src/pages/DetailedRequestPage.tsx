import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, CheckCircle2,  } from "lucide-react";


import { useParams } from "react-router-dom";
import ServiceRequestAPI, { ServiceRequest } from "@/api/serviceRequestsApi";

// type BackendStatus =
//   | "POSTED"
//   | "REQUEST_SENT"
//   | "CONFIRMED"
//   | "INITIATED"
//   | "PAYMENT_PENDING"
//   | "PAYMENT_SUBMITTED"
//   | "COMPLETED";

type BackendStatus =
| "OPEN"
| "SELLER_SELECTED"
| "SELLER_ACCEPTED";

// type FrontendStatus =
//   | "posted"
//   | "request sent"
//   | "confirmed"
//   | "initiated"
//   | "payment pending"
//   | "payment submitted"
//   | "completed";

  type FrontendStatus =
  | "open"
  | "seller selected"
  | "seller accepted"
  // | "initiated"
  // | "payment pending"
  // | "payment submitted"
  // | "completed";
export default function DetailedServiceRequestPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = React.useState<ServiceRequest | null>(null);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");
  // const [paymentMethod, setPaymentMethod] = React.useState<
  //   "offline" | "bank" | ""
  // >("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // const [newStatus, setNewStatus] = React.useState<BackendStatus | null>(null);

  // const isPosted = (request: ServiceRequest): boolean => {
  //   return request.status.toUpperCase() === "POSTED";
  // };

  // const statusOrder: FrontendStatus[] = [
  //   "posted",
  //   "request sent",
  //   "confirmed",
  //   "initiated",
  //   "payment pending",
  //   "payment submitted",
  //   "completed",
  // ];

  const statusOrder: FrontendStatus[] = [
    "open",
    "seller selected",
    "seller accepted",
    // "initiated",
    // "payment pending",
    // "payment submitted",
    // "completed",
  ];
  React.useEffect(() => {
    const loadServiceRequest = async () => {
      if (!requestId) return;
      try {
        setIsLoading(true);
        const data = await ServiceRequestAPI.fetchServiceRequest(parseInt(requestId, 10));
        // Make sure to handle the status correctly
        setRequest(data);
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
  console.log(request);
  const handleSelectService = async (orgId: number) => {
    if (!request) return;
    try {
      setIsLoading(true);
      console.log("received data for handleSelectService: ", request);
      const updatedRequest = await ServiceRequestAPI.selectOrganization(request.id, orgId);
      setRequest(updatedRequest);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to select organization"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const handlePaymentSubmission = async () => {
  //   if (!request || !paymentMethod) return;

  //   try {
  //     setIsLoading(true);
  //     const paymentInfo: PaymentSimulation = {
  //       paymentMethod,
  //       bankDetails:
  //         paymentMethod === "bank" ? "Simulated bank details" : undefined,
  //     };
  //     const updatedRequest = await simulatePayment(request.id, paymentInfo);
  //     setRequest(updatedRequest);
  //     // if (updatedRequest.paymentStatus === "COMPLETED") {
  //     //   await confirmServiceRequest(request.id);
  //     // }
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : "Failed to process payment"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const confirmService = async () => {
    if (!request) return;
    try {
      setIsLoading(true);
      const updatedRequest = await ServiceRequestAPI.confirmServiceRequest(request.id); // Call the new API function to employees
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
      const updatedRequest = await ServiceRequestAPI.submitFeedback(request.id, {
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
  // const statusMapping: Record<BackendStatus, FrontendStatus> = {
  //   POSTED: "posted",
  //   REQUEST_SENT: "request sent",
  //   CONFIRMED: "confirmed",
  //   INITIATED: "initiated",
  //   PAYMENT_PENDING: "payment pending",
  //   PAYMENT_SUBMITTED: "payment submitted",
  //   COMPLETED: "completed",
  // };

  const statusMapping: Record<BackendStatus, FrontendStatus> = {
     OPEN : "open",
    SELLER_SELECTED: "seller selected",
    SELLER_ACCEPTED: "seller accepted",
    // INITIATED: "initiated",
    // PAYMENT_PENDING: "payment pending",
    // PAYMENT_SUBMITTED: "payment submitted",
    // COMPLETED: "completed",
  };
  // Then update your status progression display
  const getDisplayStatus = (status: string): FrontendStatus => {
    return (
      statusMapping[status as BackendStatus] ||
      (status.toLowerCase() as FrontendStatus)
    );
  };

  //new ones, (20/10/2024)
  // const handleInitiateService = async () => {
  //   if (!request) return;
  //   try {
  //     setIsLoading(true);
  //     const updatedRequest = await initiateServiceRequest(request.id);
  //     setRequest(updatedRequest);
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : "Failed to initiate service"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleFinishService = async () => {
  //   if (!request) return;
  //   try {
  //     setIsLoading(true);
  //     const updatedRequest = await finishServiceRequest(request.id);
  //     setRequest(updatedRequest);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to finish service");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleVerifyPayment = async () => {
  //   if (!request) return;
  //   try {
  //     setIsLoading(true);
  //     const updatedRequest = await verifyPayment(request.id);
  //     setRequest(updatedRequest);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Failed to verify payment");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const ServiceRequestDetails: React.FC<{ request: ServiceRequest }> = ({
  //   request,
  // }) => {
  //   return (
  //     <div>
  //       {/* existing request details */}
  //       <Card className="mb-6">
  //         <CardHeader>
  //           <CardTitle>Service Details</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label>Date</Label>
  //               <div className="font-medium">{request.date}</div>
  //             </div>
  //             <div>
  //               <Label>Time</Label>
  //               <div className="font-medium">{request.time}</div>
  //             </div>
  //             <div className="col-span-2">
  //               <Label>Address</Label>
  //               <div className="font-medium">{request.address}</div>
  //             </div>
  //           </div>
  //         </CardContent>
  //       </Card>

  //       {request.organizationOwnerName && (
  //         <div className="mt-4">
  //           <h4 className="font-semibold">Organization Owner:</h4>
  //           <p>{request.organizationOwnerName}</p>
  //         </div>
  //       )}

  //       {request.organizationCoOwnerNames &&
  //         request.organizationCoOwnerNames.length > 0 && (
  //           <div className="mt-2">
  //             <h4 className="font-semibold">Organization Co-Owners:</h4>
  //             <ul className="list-disc pl-5">
  //               {request.organizationCoOwnerNames.map((name, index) => (
  //                 <li key={index}>{name}</li>
  //               ))}
  //             </ul>
  //           </div>
  //         )}
  //     </div>
  //   );
  // };

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
      {request.status.toUpperCase() === "OPEN" &&
        request.availableOrganizations && (
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
                        ${org.expectedFee}
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
      {request.status === "seler selected" && (
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
      {request.status !== "open" && request.organizationName && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="font-medium">{request.organizationName}</span>
              <Badge variant="secondary">
                ${request.agreedPrice?.toFixed(2)}
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
      {/* {request.status.toUpperCase() === "PAYMENT_PENDING" && (
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
      )} */}

      {/* Payment Submitted */}
      {/* {request.status === "payment submitted" && (
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
      )} */}

      {/* Feedback Section */}
      {request.status === "seler accepted" && new Date(request.date) < new Date() && (
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

      {/* Confirmed Status */}
      {/* {request.status === "CONFIRMED" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Start Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The service request has been confirmed. Ready to begin?
            </p>
            <Button
              onClick={handleInitiateService}
              disabled={isLoading}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Service
            </Button>
          </CardContent>
        </Card>
      )} */}

      {/* Initiated Status */}
      {/* {request.status === "INITIATED" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Service is currently in progress.</p>
            <Button
              onClick={handleFinishService}
              disabled={isLoading}
              className="w-full"
            >
              <Flag className="mr-2 h-4 w-4" />
              Complete Service
            </Button>
          </CardContent>
        </Card>
      )} */}

      {/* Payment Submitted Status */}
{/*       
      {request.status === "PAYMENT_SUBMITTED" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              Payment has been submitted and is awaiting verification.
            </p> */}
            {/* This button would typically only be shown to organization users */}
            {/* <Button
              onClick={handleVerifyPayment}
              disabled={isLoading}
              className="w-full"
            >
              Verify Payment
            </Button>
          </CardContent>
        </Card>
      )} */}
      
    </div>
  );
}
