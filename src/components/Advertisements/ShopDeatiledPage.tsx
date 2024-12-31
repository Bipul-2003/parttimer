import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { MapPin, Phone, Mail, Globe, Clock, Store, Utensils, ShoppingBag, Briefcase, Music, Heart, GraduationCap, Cpu, Car, Home, Dumbbell, Plane, PawPrint, Ticket, ArrowLeft, Copy, ExternalLink } from 'lucide-react'
import { Shop } from '@/types/Advertisements'
import { categories, shops } from '@/lib/data/mockData'

function getIconComponent(iconName: string) {
  const icons: { [key: string]: React.ElementType } = {
    Utensils, ShoppingBag, Briefcase, Music, Heart, GraduationCap, Cpu, Car, Home, Dumbbell, Plane, Paw: PawPrint, Store
  }
  return icons[iconName] || Store
}

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null)

  useEffect(() => {
    const foundShop = shops.find(s => s.id === id)
    setShop(foundShop || null)
  }, [id])

  const onBack = () => {
    navigate(-1);
  };

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Button onClick={onBack} variant="ghost" className="mb-4 hover:bg-gray-200">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
        </Button>
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
            <p className="text-gray-600">Sorry, we couldn't find the shop you're looking for.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const category = categories.find(c => c.name === shop.category)
  const IconComponent = category ? getIconComponent(category.icon) : Store

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Button onClick={onBack} variant="ghost" className="mb-4 hover:bg-gray-200">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
      </Button>
      <Card className="overflow-hidden bg-white shadow-lg">
        <div className={`relative overflow-hidden bg-gradient-to-r ${category?.color || 'from-gray-600 to-gray-800'} text-white p-8`}>
          <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-white bg-opacity-20 transform rotate-45"></div>
          <div className="absolute top-0 right-0 w-48 h-48 -mr-24 -mt-24 bg-white bg-opacity-20 transform rotate-45"></div>
          <div className="relative z-10 flex items-center">
            <IconComponent className="w-16 h-16 mr-6 text-white" />
            <div>
              <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
              <p className="text-xl text-gray-200">{shop.category}</p>
            </div>
          </div>
          {shop.offers.length > 0 && (
            <Badge variant="secondary" className="absolute top-4 right-4 bg-yellow-500 text-white">
              <Ticket className="w-4 h-4 mr-1" />
              Special Offers Available
            </Badge>
          )}
        </div>
        <CardContent className="p-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 space-y-6">
                  <InfoItem icon={MapPin} title="Address" content={`${shop.location}, ${shop.city}, ${shop.zip}`} />
                  <InfoItem icon={Phone} title="Mobile" content={shop.mobileNumber} />
                  <InfoItem icon={Clock} title="Hours" content={shop.hours} />
                  {shop.email && <InfoItem icon={Mail} title="Email" content={shop.email} />}
                  {shop.website && <InfoItem icon={Globe} title="Website" content={shop.website} link={shop.website} />}
                  <InfoItem icon={MapPin} title="Google Maps" content="View on Google Maps" link={shop.googleMapLink} />
                  <div className="mt-6">
                    <h3 className="text-2xl font-semibold mb-2 text-gray-800">About</h3>
                    <p className="text-gray-600">{shop.description}</p>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${shop.latitude},${shop.longitude}`}
                    ></iframe>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="offers">
              {shop.offers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {shop.offers.map((offer, index) => (
                    <Card key={index} className="bg-yellow-50 border-2 border-dashed border-yellow-500">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">{offer.description}</h4>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-yellow-700">
                            Code: <span className="font-mono bg-yellow-200 px-2 py-1 rounded">{offer.code}</span>
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(offer.code);
                              // You might want to add a toast notification here
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No current offers available.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface InfoItemProps {
  icon: React.ElementType
  title: string
  content: string
  link?: string
}

function InfoItem({ icon: Icon, title, content, link }: InfoItemProps) {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
            {content}
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        ) : (
          <p className="text-gray-600">{content}</p>
        )}
      </div>
    </div>
  )
}

