import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { MapPin, Phone, Clock, Grid, Utensils, ShoppingBag, Briefcase, Music, Heart, GraduationCap, Cpu, Car, Home, Dumbbell, Plane, PawPrint, Store, Tag } from 'lucide-react'
import {categories, shops, cities} from '@/lib/data/mockData'
import { Category, Shop } from '@/types/Advertisements'
// import { categories, shops, cities } from '../utils/mockData'
// import { Shop, Category } from '../types/types'

export default function AdsHome() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedZip, setSelectedZip] = useState<string>('')
  const [availableZips, setAvailableZips] = useState<string[]>([])

  useEffect(() => {
    if (selectedCity) {
      const cityData = cities.find(city => city.name === selectedCity)
      setAvailableZips(cityData ? cityData.zips : [])
      setSelectedZip('')
    } else {
      setAvailableZips([])
      setSelectedZip('')
    }
  }, [selectedCity])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredShops = shops.filter((shop) => {
    return (
      (!selectedCategory || shop.category === selectedCategory) &&
      (shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!selectedCity || shop.city === selectedCity) &&
      (!selectedZip || shop.zip === selectedZip)
    )
  })

  const onSelectShop = (shopId: string) => {
    navigate(`/advertisement/${shopId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
         {/* <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <div>
              <Link to="/publish-ad">
                <Button variant="outline" className="mr-2">Publish Ad</Button>
              </Link>
              <Link to="/my-ads">
                <Button variant="outline">My Ads</Button>
              </Link>
            </div>
          </div>
        </nav> */}
      {/* <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">Discover Local Gems</h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Search by name, description, or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white shadow-md"
        />
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="bg-white shadow-md">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedZip} onValueChange={setSelectedZip}>
          <SelectTrigger className="bg-white shadow-md" disabled={!selectedCity}>
            <SelectValue placeholder="Select a ZIP code" />
          </SelectTrigger>
          <SelectContent>
            {availableZips.map((zip) => (
              <SelectItem key={zip} value={zip}>
                {zip}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Categories</h2>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white rounded-lg shadow-inner">
          <CategoryBadge
            category={{ id: 'all', name: 'All', icon: 'Grid', color: 'from-gray-600 to-gray-800' }}
            isSelected={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
          />
          {filteredCategories.map((category) => (
            <CategoryBadge
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(category.name)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} onSelect={onSelectShop} />
        ))}
      </div>
    </div>
  )
}

function getIconComponent(iconName: string) {
  const icons: { [key: string]: React.ElementType } = {
    Utensils, ShoppingBag, Briefcase, Music, Heart, GraduationCap, Cpu, Car, Home, Dumbbell, Plane, Paw: PawPrint, Grid, Store
  }
  return icons[iconName] || Store
}

function CategoryBadge({ category, isSelected, onClick }: { category: Category, isSelected: boolean, onClick: () => void }) {
  const IconComponent = getIconComponent(category.icon)
  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={`cursor-pointer transition-all hover:scale-110 ${isSelected ? `bg-gradient-to-r ${category.color} text-white` : ''}`}
      onClick={onClick}
    >
      <IconComponent className="w-4 h-4 mr-1" />
      {category.name}
    </Badge>
  )
}

function ShopCard({ shop, onSelect }: { shop: Shop; onSelect: (shopId: string) => void }) {
  const category = categories.find(c => c.name === shop.category)
  const IconComponent = category ? getIconComponent(category.icon) : Store

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white">
      <CardHeader className={`relative overflow-hidden bg-gradient-to-r ${category?.color || 'from-gray-600 to-gray-800'} text-white p-6`}>
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white bg-opacity-20 transform rotate-45"></div>
        <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-white bg-opacity-20 transform rotate-45"></div>
        <div className="absolute top-2 right-2 w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <IconComponent className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold mb-2 relative z-10">{shop.name}</CardTitle>
        <CardDescription className="text-gray-200 flex items-center relative z-10">
          {shop.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 relative">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{shop.location}, {shop.city}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{shop.mobileNumber}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{shop.hours}</span>
          </div>
        </div>
        {shop.offers.length > 0 && (
          <div className="absolute top-2 right-2 rounded-full p-2 transform rotate-12">
            <Tag className="w-4 h-4 text-yellow-700" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onSelect(shop.id)} 
          className={`w-full text-white bg-gradient-to-r ${category?.color || 'from-gray-600 to-gray-800'} hover:saturate-150 transition-all duration-300 group-hover:scale-105`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

