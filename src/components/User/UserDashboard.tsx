import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PartTimeServicesTable } from "./part-time-services-table"
import { WorkerServicesTable } from "./worker-services-table"

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

interface DashboardProps {
  user?: User;
}

const demoUser: User = {
  user_role: "User",
  user_id: 1,
  organization: { id: 1, name: "Demo Corp" },
  name: "John Doe",
  email: "john.doe@example.com",
  points: 1000
};

export default function UserDashboard({ user = demoUser }: DashboardProps) {
  return (
    <div className="container mx-auto space-y-4">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold">Welcome back, {user.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-200">{user.email}</p>
              <Badge variant="secondary" className="mt-1 bg-white text-purple-700">
                {user.user_role}
              </Badge>
            </div>
          </div> */}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="part-time" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="part-time" className="text-sm font-medium">
                Part-time Services
              </TabsTrigger>
              <TabsTrigger value="worker" className="text-sm font-medium">
                Worker Services
              </TabsTrigger>
            </TabsList>
            <TabsContent value="part-time">
              <PartTimeServicesTable />
            </TabsContent>
            <TabsContent value="worker">
              <WorkerServicesTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

