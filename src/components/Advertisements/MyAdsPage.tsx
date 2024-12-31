import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { shops } from '@/lib/data/mockData'


export default function MyAdsPage() {
  const navigate = useNavigate()

  // In a real application, you would fetch the user's ads from your backend
  const myAds = shops.slice(0, 3) // Just using the first 3 shops as examples

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Ads</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {myAds.map((ad) => (
          <Card key={ad.id}>
            <CardHeader>
              <CardTitle>{ad.name}</CardTitle>
              <CardDescription>{ad.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{ad.description}</p>
              <p className="text-sm">
                <strong>Location:</strong> {ad.location}, {ad.city}
              </p>
              <p className="text-sm">
                <strong>Mobile:</strong> {ad.mobileNumber}
              </p>
              {ad.email && (
                <p className="text-sm">
                  <strong>Email:</strong> {ad.email}
                </p>
              )}
              {ad.website && (
                <p className="text-sm">
                  <strong>Website:</strong> {ad.website}
                </p>
              )}
              <p className="text-sm">
                <strong>Hours:</strong> {ad.hours}
              </p>
              <p className="text-sm mt-2">
                <strong>Offers:</strong> {ad.offers.length}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate(`/advertisement/manage-ad/${ad.id}`)}>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

