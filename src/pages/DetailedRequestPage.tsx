import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Star, CheckCircle2 } from 'lucide-react'

type Status = 'posted' | 'request sent' | 'confirmed' | 'initiated' | 'payment pending' | 'payment submitted' | 'completed'
type Organization = {
  id: number
  name: string
  proposedPrice?: number
}
type Employee = {
  id: number
  name: string
  role: string
}
type ServiceRequest = {
  id: number
  status: Status
  date: string
  time: string
  address: string
  associatedOrganization?: Organization
  employeesInvolved: Employee[]
  organizationProposals: Organization[]
}

const serviceRequest: ServiceRequest = {
  id: 1001,
  status: 'posted',
  date: '2023-05-15',
  time: '14:00',
  address: '123 Main St, Anytown, USA',
  organizationProposals: [
    { id: 1, name: 'Super Clean Co.', proposedPrice: 49.99 },
    { id: 2, name: 'Sparkle Cars', proposedPrice: 54.99 },
    { id: 3, name: 'Quick Wash', proposedPrice: 39.99 },
  ],
  employeesInvolved: []
}

export default function DetailedServiceRequestPage() {
  const [request, setRequest] = React.useState<ServiceRequest>(serviceRequest)
  const [rating, setRating] = React.useState(0)
  const [feedback, setFeedback] = React.useState('')
  const [paymentMethod, setPaymentMethod] = React.useState<'offline' | 'bank' | ''>('')
  const [verificationTimer, setVerificationTimer] = React.useState<NodeJS.Timeout | null>(null)

  const statusOrder: Status[] = ['posted', 'request sent', 'confirmed', 'initiated', 'payment pending', 'payment submitted', 'completed']

  const selectService = (orgId: number) => {
    const selectedOrg = request.organizationProposals.find(org => org.id === orgId)
    if (selectedOrg) {
      setRequest({
        ...request,
        status: 'request sent',
        associatedOrganization: selectedOrg,
      })
    }
  }

  const confirmService = () => {
    setRequest({
      ...request,
      status: 'confirmed',
      employeesInvolved: [
        { id: 1, name: 'John Doe', role: 'Washer' },
        { id: 2, name: 'Jane Smith', role: 'Inspector' }
      ]
    })
  }

  const progressStatus = () => {
    const currentIndex = statusOrder.indexOf(request.status)
    if (currentIndex < statusOrder.length - 1) {
      setRequest({ ...request, status: statusOrder[currentIndex + 1] })
    }
  }

  const handlePayment = () => {
    if (paymentMethod) {
      setRequest({ ...request, status: 'payment submitted' })
      // Simulate payment verification after 5 seconds
      const timer = setTimeout(() => {
        setRequest(prevRequest => ({ ...prevRequest, status: 'completed' }))
      }, 5000)
      setVerificationTimer(timer)
    }
  }

  const submitFeedback = () => {
    console.log('Feedback submitted:', { rating, feedback })
    // Here you would typically send this data to your backend
  }

  React.useEffect(() => {
    return () => {
      if (verificationTimer) {
        clearTimeout(verificationTimer)
      }
    }
  }, [verificationTimer])

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl">Car Wash Service</CardTitle>
              <CardDescription>Request ID: {request.id}</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg py-1">
              {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace(/_/g, ' ')}
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      {/* Status Progression */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {statusOrder.map((status, index) => (
              <div key={status} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  statusOrder.indexOf(request.status) >= index 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                } mb-2`}>
                  {statusOrder.indexOf(request.status) > index ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span className="text-xs text-center">{status.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <div className="font-medium">{request.date}</div>
            </div>
            <div>
              <Label>Time</Label>
              <div className="font-medium">{request.time}</div>
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <div className="font-medium">{request.address}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Proposals */}
      {request.status === 'posted' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Choose a Service Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {request.organizationProposals.map(org => (
                <div key={org.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent">
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <Badge variant="secondary" className="mt-1">${org.proposedPrice?.toFixed(2)}</Badge>
                  </div>
                  <Button onClick={() => selectService(org.id)}>Select</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Request Sent */}
      {request.status === 'request sent' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Request Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Your request has been sent to {request.associatedOrganization?.name}. We're waiting for their confirmation.</p>
            <Button onClick={confirmService}>Simulate Confirmation</Button>
          </CardContent>
        </Card>
      )}

      {/* Associated Organization */}
      {request.status !== 'posted' && request.associatedOrganization && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="font-medium">{request.associatedOrganization.name}</span>
              <Badge variant="secondary">${request.associatedOrganization.proposedPrice?.toFixed(2)}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employees Involved */}
      {request.employeesInvolved.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {request.employeesInvolved.map(employee => (
                <div key={employee.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Options */}
      {request.status === 'payment pending' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(value) => setPaymentMethod(value as 'offline' | 'bank')} className="space-y-4">
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline" className="font-medium">Pay Offline</Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="font-medium">Bank Transfer</Label>
              </div>
            </RadioGroup>
            {paymentMethod === 'bank' && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Bank Details:</h4>
                <p>Bank Name: Example Bank</p>
                <p>Account Number: 1234567890</p>
                <p>IFSC Code: EXMP0001234</p>
              </div>
            )}
            <Button onClick={handlePayment} className="mt-4 w-full" disabled={!paymentMethod}>
              Confirm Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Submitted */}
      {request.status === 'payment submitted' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg mb-4">Thank you for your payment!</p>
            <p className="text-center">We are verifying your payment. This usually takes a few moments.</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Form */}
      {request.status === 'completed' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thank You for Using Our Service!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg mb-6">We appreciate your business and hope you enjoyed our car wash service.</p>
            <div className="space-y-4">
              <div>
                <Label>How was your experience?</Label>
                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer ${star <= rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="feedback">Additional Comments</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us more about your experience"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button onClick={submitFeedback} className="w-full">Submit Feedback</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Button */}
      {['posted', 'request sent', 'confirmed', 'initiated'].includes(request.status) && (
        <Button onClick={progressStatus} className="w-full">
          {request.status === 'posted' ? 'View Proposals' : 'Next Step'}
        </Button>
      )}
    </div>
  )
}