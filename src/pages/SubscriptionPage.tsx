"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Gem, Users } from 'lucide-react'

type SubscriptionTier = {
  name: string
  price: number
  description: string
  features: string[]
  icon: React.ReactNode
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: "User",
    price: 1000,
    description: "For individuals seeking services",
    features: [
      "Access to all services",
      "Basic support",
      "Personal profile",
      "Service request creation",
    ],
    icon: <Users className="h-6 w-6" />,
  },
  {
    name: "Seller",
    price: 2000,
    description: "For professionals offering services",
    features: [
      "All User features",
      "Create an organization",
      "Offer services",
      "Priority support",
      "Advanced analytics",
    ],
    icon: <Gem className="h-6 w-6" />,
  },
]

export default function SubscriptionsPage() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectPlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier)
    setIsDialogOpen(true)
  }

  const handleConfirmSubscription = () => {
    // Here you would implement the actual subscription logic
    console.log(`Subscribing to ${selectedTier?.name} plan`)
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-purple-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Choose Your Subscription Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {subscriptionTiers.map((tier, index) => (
          <Card key={tier.name} className="flex flex-col overflow-hidden transform transition-all hover:scale-105 shadow-xl">
            <CardHeader className={`relative overflow-hidden ${index === 0 ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-amber-500 to-yellow-400'} text-white p-6`}>
              <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 rotate-45 bg-white opacity-10"></div>
              <div className="relative z-10 flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                {tier.icon}
              </div>
              <CardDescription className="text-white/80 mt-2">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6 bg-white">
              <p className="text-4xl font-bold mb-4 text-indigo-800">
                {tier.price} <span className="text-xl">⚜️</span>
                <span className="text-sm font-normal text-indigo-600">/month</span>
              </p>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-indigo-700">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100">
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                onClick={() => handleSelectPlan(tier)}
              >
                Select {tier.name} Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              You are about to subscribe to the {selectedTier?.name} plan for {selectedTier?.price} ⚜️ per month.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              By confirming, you agree that this subscription will automatically renew each month on this date. You can cancel the renewal at any time.
            </p>
            <p className="mt-2 text-sm font-semibold text-indigo-600">
              Note: You can stop the subscription renewal at any point of time.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmSubscription}>Start Subscription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

