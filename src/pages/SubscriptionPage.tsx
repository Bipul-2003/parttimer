import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

type SubscriptionTier = {
  name: string
  price: string
  description: string
  features: string[]
  employeeLimit: number
  highlighted?: boolean
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: "Basic",
    price: "$9.99",
    description: "Essential features for small businesses",
    features: ["Limited service features", "Basic support", "1 GB storage"],
    employeeLimit: 5,
  },
  {
    name: "Advanced",
    price: "$29.99",
    description: "Ideal for growing businesses",
    features: ["All Basic features", "Priority support", "10 GB storage", "Advanced analytics"],
    employeeLimit: 20,
    highlighted: true,
  },
  {
    name: "Premium",
    price: "$59.99",
    description: "Full-featured for large enterprises",
    features: ["All Advanced features", "24/7 premium support", "50 GB storage", "Custom integrations"],
    employeeLimit: 50,
  },
]

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Subscription Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subscriptionTiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.highlighted ? 'border-primary shadow-lg' : ''}`}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold mb-4">{tier.price}<span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex items-center">
                  {tier.employeeLimit <= 50 ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <X className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <span>Up to {tier.employeeLimit} employees</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.highlighted ? "default" : "outline"}>
                Select {tier.name} Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}