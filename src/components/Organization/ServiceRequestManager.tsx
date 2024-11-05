import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import {
  CheckCircle2,
  DollarSign,
  ChevronLeft,
} from "lucide-react";
import { BookingDetailsDTO, OrganizationEmployeeDTO } from "@/types/BookingDetailsDTO";
import { bookingAPI } from "@/api/bookingApi";

type FrontendStatus =
  | "posted"
  | "request_sent"
  | "confirmed"
  | "initiated"
  | "payment_pending"
  | "payment_submitted"
  | "completed";

const statusOrder: FrontendStatus[] = [
  "posted",
  "request_sent",
  "confirmed",
  "initiated",
  "payment_pending",
  "payment_submitted",
  "completed",
];

export default function ServiceRequestManager() {
  const [requestData, setRequestData] = useState<BookingDetailsDTO>();
  const [assignedEmployees, setAssignedEmployees] = useState<number[]>([]);
  const [offeredPrice, setOfferedPrice] = useState("");
  const [availableEmployees, setAvailableEmployees] = useState<OrganizationEmployeeDTO>();

  const { requestId, orgId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const data = await bookingAPI.getBookingDetails(orgId as string, requestId as string);
      setRequestData(data);
      if (data.status === "request sent") {
        fetchAvailableEmployees();
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const fetchAvailableEmployees = async () => {
    try {
      const employees = await bookingAPI.getAvailableEmployees(orgId as string, requestId as string);
      setAvailableEmployees(employees);
    } catch (error) {
      console.error("Error fetching available employees:", error);
    }
  };

  const handleEmployeeToggle = (employeeId: number) => {
    setAssignedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const getDisplayStatus = (status: FrontendStatus): string => {
    return status.replace(/_/g, " ");
  };

  const handleOfferPrice = async () => {
    if (offeredPrice) {
      try {
        await bookingAPI.offerPrice(orgId as string, requestId as string, Number(offeredPrice));
        setOfferedPrice("");
        fetchDetails();
      } catch (error) {
        console.error("Error offering price:", error);
      }
    }
  };

  const handleConfirmRequest = async () => {
    if (assignedEmployees.length > 0) {
      try {
        await bookingAPI.assignEmployees(orgId as string, requestId as string, assignedEmployees);
        fetchDetails();
      } catch (error) {
        console.error("Error confirming request:", error);
      }
    } else {
      alert("Please assign at least one employee before confirming the request.");
    }
  };

  const handleInitiateWork = async () => {
    try {
      await bookingAPI.initiateServiceRequest( requestId as string);
      fetchDetails();
    } catch (error) {
      console.error("Error initiating work:", error);
    }
  };

  const handleCompleteWork = async () => {
    try {
      // await bookingAPI.completeWork(orgId as string, requestId as string);
      fetchDetails();
    } catch (error) {
      console.error("Error completing work:", error);
    }
  };

  const handleVerifyPayment = async () => {
    try {
      await bookingAPI.verifyPayment(requestId as string);
      fetchDetails();
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  if (!requestData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="w-full h-full">
        <CardHeader className="bg-primary text-primary-foreground">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/service-requests"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                  }}>
                  <ChevronLeft className="mr-2 h-4 w-4 inline" />
                  Back
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CardTitle className="text-xl sm:text-2xl font-semibold mt-2">
            Service Request: {requestData.id}
          </CardTitle>
          <p className="text-base sm:text-lg">{requestData.name}</p>
        </CardHeader>
        <CardContent className="pt-6 px-4 sm:px-6">
          <div className="mb-8">
            <Label className="text-base sm:text-lg font-semibold mb-2">
              Status
            </Label>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  {statusOrder.map((statusItem, index) => (
                    <div
                      key={statusItem}
                      className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          statusOrder.indexOf(requestData.status.toLowerCase() as FrontendStatus) >= index
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        } mb-2`}>
                        {statusOrder.indexOf(requestData.status.toLowerCase()  as FrontendStatus) > index ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-xs text-center capitalize">
                        {getDisplayStatus(statusItem)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {requestData.status.toLowerCase() === "posted" && (
              <div className="mb-4">
                <Label htmlFor="offeredPrice">Offer Price</Label>
                <div className="flex items-center mt-2">
                  <Input
                    id="offeredPrice"
                    type="text"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    placeholder="Enter offered price"
                    className="mr-2"
                  />
                  <Button onClick={handleOfferPrice}>Offer Price</Button>
                </div>
                {requestData.pastOfferedPrices && requestData.pastOfferedPrices.length > 0 && (
                  <div className="mt-2">
                    <Label>Past Offered Prices:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {requestData.pastOfferedPrices.map((price, index) => (
                        <Badge key={index} variant="secondary">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {price}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {requestData.status.toLowerCase()  === "request_sent" && (
              <div className="mb-4 w-full">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="w-full sm:w-1/2">
                    <Label className="text-base sm:text-lg font-semibold">
                      Assigned Employees
                    </Label>
                    <Card className="mt-2">
                      <CardContent className="pt-4 sm:pt-6">
                        <ScrollArea className="h-[200px] w-full">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[60px] sm:w-[100px]">
                                  Assign
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">
                                  Designation
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {availableEmployees && availableEmployees.employees
                                .filter((e) => assignedEmployees.includes(e.userId))
                                .map((employee) => (
                                  <TableRow key={employee.userId}>
                                    <TableCell>
                                      <Checkbox
                                        id={`assigned-${employee.userId}`}
                                        checked={true}
                                        onCheckedChange={() =>
                                          handleEmployeeToggle(employee.userId)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {employee.fullName}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                      {employee.role}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <Label className="text-base sm:text-lg font-semibold">
                      Available Employees
                    </Label>
                    <Card className="mt-2">
                      <CardContent className="pt-4 sm:pt-6">
                        <ScrollArea className="h-[200px] w-full">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[60px] sm:w-[100px]">
                                  Assign
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">
                                  Designation
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {availableEmployees && availableEmployees.employees
                                .filter(
                                  (e) => !assignedEmployees.includes(e.userId)
                                )
                                .map((employee) => (
                                  <TableRow key={employee.userId}>
                                    <TableCell>
                                      <Checkbox
                                        id={`available-${employee.userId}`}
                                        checked={false}
                                        onCheckedChange={() =>
                                          handleEmployeeToggle(employee.userId)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {employee.fullName}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                      {employee.role}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <Button className="mt-4" onClick={handleConfirmRequest}>
                  Confirm Request
                </Button>
              </div>
            )}

            {requestData.status.toLowerCase()  === "confirmed" && (
              <div className="mb-4">
                <Button onClick={handleInitiateWork}>Initiate Work</Button>
              </div>
            )}

            {requestData.status.toLowerCase()  === "initiated" && (
              <div className="mb-4">
                <Button onClick={handleCompleteWork}>
                  Complete Work & Request Payment
                </Button>
              </div>
            )}

            {requestData.status.toLowerCase()  === "payment_submitted" && (
              <div className="mb-4">
                <Button onClick={handleVerifyPayment}>Verify Payment</Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-base sm:text-lg font-semibold">
                Service Request Details
              </Label>
              <Card className="mt-2">
                <CardContent className="pt-4 sm:pt-6">
                  <p className="mb-2 text-sm sm:text-base">
                    {requestData.description}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Date:</strong> {requestData.date}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Time:</strong> {requestData.time}
                  </p>
                  <div className="flex items-start mt-2">
                    <div>
                      {statusOrder.indexOf(requestData.status.toLowerCase()  as FrontendStatus) >=
                      statusOrder.indexOf("confirmed") ? (
                        <p className="text-sm sm:text-base">
                          <strong>Address:</strong>
                          {`${requestData.address}, ${requestData.zip}, ${requestData.city}`}{" "}
                        </p>
                      ) : (
                        <div className="">
                          <p className="text-sm sm:text-base">
                            <strong>Location:</strong>
                            {`${requestData.zip}, ${requestData.city}`}{" "}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Complete address will be shown after the service
                            request is completed.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {statusOrder.indexOf(requestData.status.toLowerCase()  as FrontendStatus) >=
                    statusOrder.indexOf("confirmed") && (
                    <div className="flex items-center mt-2">
                      <p className="text-sm sm:text-base">
                        <strong>Client Email:</strong>{" "}
                        {requestData.clientEmail}
                      
                      </p>
                    </div>
                  )}
                  {statusOrder.indexOf(requestData.status.toLowerCase()  as FrontendStatus) >=
                    statusOrder.indexOf("completed") && (
                    <p className="text-sm sm:text-base mt-2">
                      <strong>Estimated Revenue:</strong>{" "}
                      {requestData.agreedPrice}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {requestData.assignedEmployees && requestData.assignedEmployees.length > 0 && (
              <div>
                <Label className="text-base sm:text-lg font-semibold">
                  Assigned Employees
                </Label>
                <Card className="mt-2">
                  <CardContent className="pt-4 sm:pt-6">
                    <ScrollArea className="h-[200px] w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Designation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {requestData.assignedEmployees.map((employee) => (
                            <TableRow key={employee.userId}>
                              <TableCell className="font-medium">
                                {employee.firstName + " " + employee.lastName}
                              </TableCell>
                              {/* <TableCell>{employee.role}</TableCell> */}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}