import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface OrganizationProps {
  user: {
    organization: string;
    role: string;
    joinDate: string;
  };
}

export default function UserOrganization({ user }: OrganizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>Information about your organization</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {user.organization}
          </p>
          <p>
            <strong>Your Role:</strong> {user.role}
          </p>
          <p>
            <strong>Join Date:</strong> {user.joinDate}
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
