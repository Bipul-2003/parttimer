import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Check, DollarSign, Gem, Users } from 'lucide-react'

type SubscriptionTier = {
  name: string
  price: {
    dollar: number
    gems: number
  }
  description: string
  features: string[]
  icon: React.ReactNode
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: "User",
    price: {
      dollar: 5,
      gems: 1000,
    },
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
    price: {
      dollar: 10,
      gems: 2000,
    },
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
  const [useGems, setUseGems] = useState(true)

  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-b from-purple-50 to-indigo-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Choose Your Subscription Plan</h1>
      <div className="flex justify-center items-center mb-8 space-x-2">
        <DollarSign className={`h-5 w-5 ${useGems ? 'text-gray-400' : 'text-indigo-600'}`} />
        <Switch
          checked={useGems}
          onCheckedChange={setUseGems}
          className="data-[state=checked]:bg-indigo-600"
        />
        <Gem className={`h-5 w-5 ${useGems ? 'text-indigo-600' : 'text-gray-400'}`} />
        <span className="text-sm font-medium text-indigo-800">Pay with Gems</span>
      </div>
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
                {useGems ? (
                  <>
                    {tier.price.gems} <span className="text-xl">⚜️</span>
                  </>
                ) : (
                  <>
                    ${tier.price.dollar}
                  </>
                )}
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
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                Select {tier.name} Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

