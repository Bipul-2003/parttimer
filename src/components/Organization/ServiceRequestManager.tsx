import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { CheckCircle, Clock, Loader2 } from "lucide-react";

const serviceRequest = {
  id: "REQ001",
  name: "Air Conditioning Repair",
  status: "initiated",
  info: "Customer reported AC not cooling. Unit is 5 years old. Last serviced 2 years ago.",
  date: "2023-06-15",
  time: "14:30",
  address: "123 Main St, Anytown, USA",
  estimatedRevenue: "$250.00",
};

const employees = [
  {
    id: 1,
    name: "John Doe",
    designation: "Senior Technician",
    status: "Requested",
  },
  {
    id: 2,
    name: "Jane Smith",
    designation: "HVAC Specialist",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "Mike Johnson",
    designation: "Junior Technician",
    status: "Requested",
  },
  {
    id: 4,
    name: "Emily Brown",
    designation: "Electrician",
    status: "Confirmed",
  },
  { id: 5, name: "Chris Lee", designation: "Plumber", status: "Requested" },
];

export default function ServiceRequestManager() {
  const [status, setStatus] = useState(serviceRequest.status);
  const [assignedEmployees, setAssignedEmployees] = useState<number[]>([]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleEmployeeToggle = (employeeId: number) => {
    setAssignedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSubmit = () => {
    console.log("Submitting changes:", { status, assignedEmployees });
    // Here you would typically send this data to your backend
  };

  const statusSteps = [
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "initiated", label: "Initiated", icon: Clock },
    { key: "in progress", label: "In Progress", icon: Loader2 },
    { key: "completed", label: "Completed", icon: CheckCircle },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-xl sm:text-2xl font-semibold">
          Service Request: {serviceRequest.id}
        </CardTitle>
        <p className="text-base sm:text-lg">{serviceRequest.name}</p>
      </CardHeader>
      <CardContent className="pt-6 px-4 sm:px-6">
        <div className="mb-8">
          <Label className="text-base sm:text-lg font-semibold mb-2">
            Status
          </Label>
          <div className="flex justify-between items-center mb-4 overflow-x-auto">
            {statusSteps.map((step, index) => (
              <div
                key={step.key}
                className="flex flex-col items-center min-w-[80px]">
                <div className="flex items-center">
                  {index > 0 && (
                    <div className="w-8 sm:w-10 h-0.5 bg-muted-foreground" />
                  )}
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      statusSteps.findIndex((s) => s.key === status) >= index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className="w-8 sm:w-10 h-0.5 bg-muted-foreground" />
                  )}
                </div>
                <span className="text-xs mt-1 text-center">{step.label}</span>
              </div>
            ))}
          </div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              {statusSteps.map((step) => (
                <SelectItem key={step.key} value={step.key}>
                  {step.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-base sm:text-lg font-semibold">
              Service Request Details
            </Label>
            <Card className="mt-2">
              <CardContent className="pt-4 sm:pt-6">
                <p className="mb-2 text-sm sm:text-base">
                  {serviceRequest.info}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Date:</strong> {serviceRequest.date}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Time:</strong> {serviceRequest.time}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Address:</strong> {serviceRequest.address}
                </p>
                <p className="text-sm sm:text-base mt-2">
                  <strong>Estimated Revenue:</strong>{" "}
                  {serviceRequest.estimatedRevenue}
                </p>
              </CardContent>
            </Card>
          </div>

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
                          <TableHead>Status</TableHead>
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
                              <TableCell>
                                <Badge
                                  variant={
                                    employee.status === "Confirmed"
                                      ? "default"
                                      : "outline"
                                  }>
                                  {employee.status}
                                </Badge>
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-end px-4 sm:px-6">
        <Button onClick={handleSubmit} size="lg" className="w-full sm:w-auto">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
