import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ClockIcon, MapPinIcon, DollarSignIcon, MailIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

// Define the type for a service request
interface ServiceRequest {
  id: number;
  service: string;
  area: string;
  description: string;
  status: 'Pending' | 'Accepted' | 'Completed';
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
}

// This would typically come from a database or API
const mockRequests: ServiceRequest[] = [
  { 
    id: 1, 
    service: 'Car Wash', 
    area: 'Downtown', 
    description: 'Need a full exterior and interior clean', 
    status: 'Pending', 
    date: '2023-06-15',
    time: '14:00',
    customerName: 'John Doe',
    customerEmail: 'john@example.com'
  },
  { 
    id: 2, 
    service: 'Lawn Mowing', 
    area: 'Suburbs', 
    description: 'Weekly lawn maintenance needed', 
    status: 'Accepted', 
    date: '2023-06-16',
    time: '10:00',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com'
  },
  { 
    id: 3, 
    service: 'House Cleaning', 
    area: 'Uptown', 
    description: 'Deep cleaning for a 3-bedroom house', 
    status: 'Completed', 
    date: '2023-06-14',
    time: '09:00',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com'
  },
]

export default function RequestedServicesPage() {
  const [requests,
    
    // setRequests
  ] = useState<ServiceRequest[]>(mockRequests)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [offeredPrice, setOfferedPrice] = useState('')

  useEffect(() => {
    // In a real application, you would fetch the requests from an API here
    // For now, we're using the mock data
  }, [])

  const openDetailsDialog = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setIsDetailsDialogOpen(true)
  }

  const openPriceDialog = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setIsPriceDialogOpen(true)
  }

  const openContactDialog = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setIsContactDialogOpen(true)
  }

  const handleOfferPrice = () => {
    // Here you would typically send the offered price to your backend
    console.log(`Offered price for ${selectedRequest?.service}: $${offeredPrice}`)
    setIsPriceDialogOpen(false)
    setOfferedPrice('')
  }

  const handleContactCustomer = () => {
    // Here you would typically send a message to the customer or open an email client
    console.log(`Contacting customer for ${selectedRequest?.service}`)
    setIsContactDialogOpen(false)
  }

  const getBadgeVariant = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'default'
      case 'Accepted':
        return 'secondary'
      case 'Completed':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      <header className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="text-5xl font-bold mb-4">Requested Services</h1>
            <p className="text-xl mb-8">Track the status of your service requests</p>
            <Link to="/services">
              <Button variant="secondary">Back to Services</Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">{request.service}
                  <Badge className='ml-4' variant={getBadgeVariant(request.status)}>
                    {request.status}
                  </Badge>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {request.area}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{request.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>{request.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto flex flex-wrap justify-between items-center gap-2">
                  
                  <div className="flex gap-2">

                  <Button variant="secondary" size="sm" onClick={() => openPriceDialog(request)}>
                      <DollarSignIcon className="w-4 h-4 mr-2" />
                      Offer Price
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openDetailsDialog(request)}>
                      <ClockIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => openContactDialog(request)}>
                      <MailIcon className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
            <DialogDescription>
              Here are the details of the service request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Service:</span>
                <span className="col-span-3">{selectedRequest.service}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Status:</span>
                <Badge variant={getBadgeVariant(selectedRequest.status)}>
                  {selectedRequest.status}
                </Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Area:</span>
                <span className="col-span-3">{selectedRequest.area}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Date:</span>
                <span className="col-span-3">{selectedRequest.date}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Time:</span>
                <span className="col-span-3">{selectedRequest.time}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Description:</span>
                <span className="col-span-3">{selectedRequest.description}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Offer Price</DialogTitle>
            <DialogDescription>
              Enter the price you want to offer for this service.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleOfferPrice}>Submit Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Customer</DialogTitle>
            <DialogDescription>
              Send a message to the customer about their service request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <textarea
                  id="message"
                  className="col-span-3 h-32 p-2 border rounded"
                  placeholder="Enter your message here..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleContactCustomer}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}