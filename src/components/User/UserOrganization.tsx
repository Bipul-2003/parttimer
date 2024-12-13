import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { Link } from "react-router-dom";

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

export default function UserOrganization() {
  const user = demoUser;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Organization Details</CardTitle>
        <CardDescription>Information about your organization</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.organization?.name || "Not part of an organization"}
          </p>
          <p>
            <strong>Your Role:</strong> {user.user_role}
          </p>
          <p>
            <strong>User ID:</strong> {user.user_id}
          </p>
        </div>
        <div className="">
          <Button asChild>
            <Link to="/organization">
              Go to the Organization Page{" "}
              <ExternalLink className="h-5 w-5 mx-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

