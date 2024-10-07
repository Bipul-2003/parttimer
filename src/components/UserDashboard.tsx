import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, AlertCircle,  Trash2 } from 'lucide-react'

interface DashboardProps {
  user?: {
    name: string
    email: string
    avatar: string
    role: string
  }
}

interface ServiceRequest {
  id: number
  name: string
  status: string
  date: string
  offeredPrice: number | null
  lastOfferTime: string | null
  organization: string | null
  category: string
}

const mockServiceRequests: ServiceRequest[] = [
  { id: 1, name: "Car Wash", status: "Pending", date: "2023-06-20", offeredPrice: 50, lastOfferTime: "2023-06-21 14:30", organization: "SparkleWash Inc.", category: "Automotive" },
  { id: 2, name: "Lawn Mowing", status: "In Progress", date: "2023-05-15", offeredPrice: 75, lastOfferTime: "2023-05-16 09:15", organization: "GreenCut Services", category: "Gardening" },
  { id: 3, name: "House Cleaning", status: "Pending", date: "2023-07-01", offeredPrice: null, lastOfferTime: null, organization: null, category: "Home" },
  { id: 4, name: "Window Washing", status: "Pending", date: "2023-07-05", offeredPrice: 100, lastOfferTime: "2023-07-06 11:45", organization: "ClearView Cleaners", category: "Home" },
  { id: 5, name: "Carpet Cleaning", status: "Pending", date: "2023-07-10", offeredPrice: 80, lastOfferTime: "2023-07-11 10:00", organization: "FreshFloor Co.", category: "Home" },
  { id: 6, name: "Pest Control", status: "In Progress", date: "2023-07-08", offeredPrice: 120, lastOfferTime: "2023-07-09 16:20", organization: "BugBGone", category: "Home" },
]

const categoryColors: { [key: string]: string } = {
  Automotive: "bg-blue-500",
  Gardening: "bg-green-500",
  Home: "bg-yellow-500",
}

export default function Dashboard({ user }: DashboardProps) {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests)
  const [withdrawalReason, setWithdrawalReason] = useState("")
  const [withdrawingRequestId, setWithdrawingRequestId] = useState<number | null>(null)

  const handleAcceptPrice = (id: number) => {
    setServiceRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, status: 'Accepted' } : request
      )
    )
  }

  const handleRejectPrice = (id: number) => {
    setServiceRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, offeredPrice: null, lastOfferTime: null, organization: null } : request
      )
    )
  }

  const handleContinueWaiting = (id: number) => {
    console.log(`Continuing to wait for request ${id}`)
  }

  const handleWithdraw = (id: number) => {
    setWithdrawingRequestId(id)
  }

  const confirmWithdrawal = () => {
    if (withdrawingRequestId !== null) {
      setServiceRequests(prevRequests =>
        prevRequests.filter(request => request.id !== withdrawingRequestId)
      )
      setWithdrawingRequestId(null)
      setWithdrawalReason("")
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Loading user information...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {user.name}!</CardTitle>
          <CardDescription className="text-gray-100">Here's your service dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 border-2 border-white">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-200">{user.email}</p>
              <Badge variant="secondary" className="mt-1 bg-white text-purple-500">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            {/* <DollarSign className="mr-2" /> */}
            Your Service Requests
          </CardTitle>
          <CardDescription>Manage your ongoing service requests</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {serviceRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full overflow-hidden">
                      <div className={`h-2 ${categoryColors[request.category]}`} />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold">{request.name}</h4>
                          <Badge variant={request.status === 'Accepted' ? 'secondary' : 'default'}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Requested on: {request.date}</p>
                        {request.offeredPrice !== null ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">Offered Price: ${request.offeredPrice}</p>
                              <Badge variant="outline" className="text-green-500 border-green-500">
                                Best Offer
                              </Badge>
                            </div>
                            {/* <Progress value={75} className="w-full" /> */}
                            <p className="text-xs text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Last offer: {request.lastOfferTime}
                            </p>
                            <p className="text-xs text-gray-500">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              Offered by: {request.organization}
                            </p>
                            {request.status !== 'Accepted' && (
                              <div className="flex justify-between items-center mt-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleAcceptPrice(request.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectPrice(request.id)}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleContinueWaiting(request.id)}
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  Wait
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <Clock className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                            <p className="text-sm text-gray-500">Waiting for offers...</p>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleWithdraw(request.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Withdraw
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Withdraw Service Request</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for withdrawing your service request. This helps us improve our services.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Label htmlFor="withdrawalReason" className="text-right">
                                  Reason
                                </Label>
                                <Textarea
                                  id="withdrawalReason"
                                  value={withdrawalReason}
                                  onChange={(e) => setWithdrawalReason(e.target.value)}
                                  placeholder="Enter your reason here..."
                                />
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setWithdrawingRequestId(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={confirmWithdrawal} className="bg-red-500 hover:bg-red-600">
                                  Confirm Withdrawal
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}