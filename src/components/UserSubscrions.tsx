
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Gem, RefreshCcw, Users } from 'lucide-react'

type SubscriptionPlan = "User" | "Seller"

interface UserSubscription {
  plan: SubscriptionPlan
  startDate: Date
  nextBillingDate: Date
}

export default function SubscriptionManagementPage() {
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: "User",
    startDate: new Date(),
    nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
  })

  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  }

  const handleUpgrade = () => {
    setSubscription(prev => ({
      ...prev,
      plan: "Seller",
      nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    }))
    setIsUpgradeDialogOpen(false)
  }

  const handleCancel = () => {
    // In a real application, you would call an API to cancel the subscription
    console.log("Subscription cancelled")
    setIsCancelDialogOpen(false)
  }

  const daysUntilRenewal = Math.max(0, Math.ceil((subscription.nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-purple-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Subscription Management</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Your Subscription</CardTitle>
            <Badge variant={subscription.plan === "User" ? "secondary" : "default"} className="text-lg py-1">
              {subscription.plan === "User" ? <Users className="mr-1 h-4 w-4" /> : <Gem className="mr-1 h-4 w-4" />}
              {subscription.plan} Plan
            </Badge>
          </div>
          <CardDescription>Manage your subscription and usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Subscription Details</h3>
            <p><strong>Start Date:</strong> {formatDate(subscription.startDate)}</p>
            <p><strong>Next Billing Date:</strong> {formatDate(subscription.nextBillingDate)}</p>
            <p className="text-sm text-indigo-600 mt-2">
              <RefreshCcw className="inline mr-1 h-4 w-4" />
              Renews in {daysUntilRenewal} days
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {subscription.plan === "User" ? (
            <Button onClick={() => setIsUpgradeDialogOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              Upgrade to Seller Plan
            </Button>
          ) : (
            <Button disabled className="opacity-50 cursor-not-allowed">
              Highest Plan
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsCancelDialogOpen(true)} className="text-red-500 border-red-500 hover:bg-red-50">
            Cancel Subscription
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Seller Plan</DialogTitle>
            <DialogDescription>
              Upgrade your plan to access more features and increase your gem allowance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold">Upgrade Benefits:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Create an organization</li>
              <li>Offer services to other users</li>
              <li>Access to priority support</li>
              <li>Advanced analytics tools</li>
            </ul>
            <p className="mt-4 text-indigo-600 font-semibold">
              Upgrade cost: 1000 gems
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpgrade} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              Confirm Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-semibold text-red-500">
              <AlertCircle className="inline mr-2 h-5 w-5" />
              Warning:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>You will lose access to all premium features</li>
              <li>This action cannot be undone</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              If you change your mind, you can always subscribe again in the future.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Keep Subscription</Button>
            <Button variant="destructive" onClick={handleCancel}>
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

