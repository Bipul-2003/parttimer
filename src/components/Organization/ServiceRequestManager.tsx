import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { CheckCircle2, DollarSign, ChevronLeft } from "lucide-react"

type FrontendStatus = "posted" | "request sent" | "confirmed" | "initiated" | "payment pending" | "payment submitted" | "completed"

const serviceRequest = {
  id: "REQ001",
  name: "Air Conditioning Repair",
  status: "posted" as FrontendStatus,
  info: "Customer reported AC not cooling. Unit is 5 years old. Last serviced 2 years ago.",
  date: "2023-06-15",
  time: "14:30",
  address: "123 Main St, Anytown, USA",
  estimatedRevenue: "$250.00",
  pastOfferedPrices: ["$200", "$225"],
}

const employees = [
  { id: 1, name: "John Doe", designation: "Senior Technician" },
  { id: 2, name: "Jane Smith", designation: "HVAC Specialist" },
  { id: 3, name: "Mike Johnson", designation: "Junior Technician" },
  { id: 4, name: "Emily Brown", designation: "Electrician" },
  { id: 5, name: "Chris Lee", designation: "Plumber" },
]

const statusOrder: FrontendStatus[] = [
  "posted",
  "request sent",
  "confirmed",
  "initiated",
  "payment pending",
  "payment submitted",
  "completed",
]

export default function ServiceRequestManager() {
  const [status, setStatus] = useState<FrontendStatus>(serviceRequest.status)
  const [assignedEmployees, setAssignedEmployees] = useState<number[]>([])
  const [offeredPrice, setOfferedPrice] = useState("")
  const [pastPrices, setPastPrices] = useState(serviceRequest.pastOfferedPrices)
  const navigate = useNavigate()

  useEffect(() => {
    if (status === "request sent") {
      setAssignedEmployees([])
    }
  }, [status])

  const handleStatusChange = (newStatus: FrontendStatus) => {
    setStatus(newStatus)
  }

  const handleEmployeeToggle = (employeeId: number) => {
    setAssignedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId]
    )
  }

  const getDisplayStatus = (status: FrontendStatus): string => {
    return status.replace(/_/g, " ")
  }

  const handleOfferPrice = () => {
    if (offeredPrice) {
      setPastPrices([...pastPrices, offeredPrice])
      setOfferedPrice("")
      handleStatusChange("request sent")
    }
  }

  const handleConfirmRequest = () => {
    if (assignedEmployees.length > 0) {
      handleStatusChange("confirmed")
    } else {
      alert("Please assign at least one employee before confirming the request.")
    }
  }

  const handleInitiateWork = () => {
    handleStatusChange("initiated")
  }

  const handleCompleteWork = () => {
    handleStatusChange("payment pending")
  }

  const handleVerifyPayment = () => {
    handleStatusChange("completed")
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink >
              Service Requests
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{serviceRequest.id}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="w-full h-full">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-xl sm:text-2xl font-semibold">Service Request: {serviceRequest.id}</CardTitle>
          <p className="text-base sm:text-lg">{serviceRequest.name}</p>
        </CardHeader>
        <CardContent className="pt-6 px-4 sm:px-6">
          <div className="mb-8">
            <Label className="text-base sm:text-lg font-semibold mb-2">Status</Label>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  {statusOrder.map((statusItem, index) => (
                    <div key={statusItem} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          statusOrder.indexOf(status) >= index
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        } mb-2`}
                      >
                        {statusOrder.indexOf(status) > index ? (
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

            {status === "posted" && (
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
                {pastPrices.length > 0 && (
                  <div className="mt-2">
                    <Label>Past Offered Prices:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pastPrices.map((price, index) => (
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

            {status === "request sent" && (
              <div className="mb-4">
                <Label className="text-base font-semibold mb-2">Assign Employees</Label>
                <div className="flex gap-4">
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
                              {employees
                                .filter((e) => assignedEmployees.includes(e.id))
                                .map((employee) => (
                                  <TableRow key={employee.id}>
                                    <TableCell>
                                      <Checkbox
                                        id={`assigned-${employee.id}`}
                                        checked={true}
                                        onCheckedChange={() =>
                                          handleEmployeeToggle(employee.id)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {employee.name}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                      {employee.designation}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
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
                              {employees
                                .filter((e) => !assignedEmployees.includes(e.id))
                                .map((employee) => (
                                  <TableRow key={employee.id}>
                                    <TableCell>
                                      <Checkbox
                                        id={`available-${employee.id}`}
                                        checked={false}
                                        onCheckedChange={() =>
                                          handleEmployeeToggle(employee.id)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {employee.name}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                      {employee.designation}
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
                <Button className="mt-4" onClick={handleConfirmRequest}>Confirm Request</Button>
              </div>
            )}

            {status === "confirmed" && (
              <div className="mb-4">
                <Button onClick={handleInitiateWork}>Initiate Work</Button>
              </div>
            )}

            {status === "initiated" && (
              <div className="mb-4">
                <Button onClick={handleCompleteWork}>Complete Work & Request Payment</Button>
              </div>
            )}

            {status === "payment submitted" && (
              <div className="mb-4">
                <Button onClick={handleVerifyPayment}>Verify Payment</Button>
              </div>
            )}

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {statusOrder.map((step) => (
                  <SelectItem key={step} value={step}>
                    {getDisplayStatus(step)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-base sm:text-lg font-semibold">Service Request Details</Label>
              <Card className="mt-2">
                <CardContent className="pt-4 sm:pt-6">
                  <p className="mb-2 text-sm sm:text-base">{serviceRequest.info}</p>
                  <p className="text-sm sm:text-base"><strong>Date:</strong> {serviceRequest.date}</p>
                  <p className="text-sm sm:text-base"><strong>Time:</strong> {serviceRequest.time}</p>
                  <p className="text-sm sm:text-base"><strong>Address:</strong> {serviceRequest.address}</p>
                  <p className="text-sm sm:text-base mt-2">
                    <strong>Estimated Revenue:</strong> {serviceRequest.estimatedRevenue}
                  </p>
                </CardContent>
              </Card>
            </div>

            {assignedEmployees.length > 0 && (
              <div>
                <Label className="text-base sm:text-lg font-semibold">Assigned Employees</Label>
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
                          {employees
                            .filter((e) => assignedEmployees.includes(e.id))
                            .map((employee) => (
                              <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.designation}</TableCell>
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
  )
}