import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

export default function UserSettings() {
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const user = demoUser;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Account Settings for {user.name}</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Email Notifications</Label>
            <p className="text-sm text-gray-500">
              Receive email updates about your account
            </p>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            id="twoFactor"
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-medium">Danger Zone</h4>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </CardContent>
    </Card>
  )
}

