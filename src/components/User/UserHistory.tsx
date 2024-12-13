import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Organization {
  id: number;
  name: string;
}

interface User {
  user_role: string;
  user_id: number;
  organization?: Organization;
  name: string;
  email: string;
  points: number;
}

const demoUser: User = {
  user_role: "User",
  user_id: 1,
  organization: { id: 1, name: "Demo Corp" },
  name: "John Doe",
  email: "john.doe@example.com",
  points: 1000
};

const mockServices = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    date: "2023-06-20",
  },
  {
    id: 2,
    name: "Mobile App Development",
    status: "Completed",
    date: "2023-05-15",
  },
  {
    id: 3,
    name: "Database Optimization",
    status: "Pending",
    date: "2023-07-01",
  },
]

export default function UserHistory() {
  const user = demoUser;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Service History for {user.name}</CardTitle>
        <CardDescription>Your recent service requests and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {mockServices.map((service) => (
            <div
              key={service.id}
              className="mb-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">
                  {service.name}
                </h4>
                <Badge
                  variant={
                    service.status === "Completed"
                      ? "secondary"
                      : "default"
                  }>
                  {service.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Date: {service.date}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

