// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { format } from "date-fns"
// import * as z from "zod"
// import { Calendar } from "@/components/ui/calendar"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"
// import { CalendarIcon, Loader2, Search } from "lucide-react"
// import { useAuth } from "@/context/AuthContext"
// import { useToast } from "@/hooks/use-toast"
// import { fetchServices } from "@/api/service.api"
// import { bookService } from "@/api/apiService"
// import { useNavigate } from "react-router-dom"

// interface Service {
//   serviceId: number
//   name: string
//   category: string
//   baseFee: number
//   subcategory: string
//   description: string
// }

// const formSchema = z.object({
//   service: z.string(),
//   date: z.date(),
//   time: z.string(),
//   address: z.string().min(1, "Address is required"),
//   fullName: z.string().min(1, "Full name is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(1, "Phone number is required"),
//   description: z.string().optional(),
//   state: z.string().min(1, "State is required"),
//   city: z.string().min(1, "City is required"),
//   zipCode: z.string().min(1, "ZIP code is required"),
// })

// // Mock functions for fetchServices and bookService
// // const fetchServices = async (): Promise<Service[]> => {
// //   // Replace with your actual fetch logic
// //   return [
// //     {
// //       serviceId: 1,
// //       name: "Plumbing Service",
// //       category: "Home Services",
// //       baseFee: 50.0,
// //       subcategory: "Plumbing",
// //       description: "General plumbing repairs and installations.",
// //     },
// //     {
// //       serviceId: 2,
// //       name: "Electrical Service",
// //       category: "Home Services",
// //       baseFee: 60.0,
// //       subcategory: "Electrical",
// //       description: "General electrical repairs and installations.",
// //     },
// //   ]
// // }

// // const bookService = async (bookingRequest: any): Promise<void> => {
// //   // Replace with your actual booking logic
// //   console.log("Booking request:", bookingRequest)
// //   return Promise.resolve()
// // }

// export default function ServicesPage() {
//   const [services, setServices] = useState<Service[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedCategory, setSelectedCategory] = useState("All Categories")
//   const [selectedSubcategory, setSelectedSubcategory] = useState("All Subcategories")
//   const [selectedService, setSelectedService] = useState<Service | null>(null)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const { user } = useAuth()
//   const { toast } = useToast()
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("")

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       service: "",
//       date: new Date(),
//       time: "",
//       address: "",
//       fullName: "",
//       email: "",
//       phone: "",
//       description: "",
//       state: user?.user_type === "USER" ? user.state : "",
//       city: user?.user_type === "USER" ? user.city : "",
//       zipCode: user?.user_type === "USER" ? user.zipcode : "",
//     },
//   })
//   useEffect(() => {
//     if (user?.user_type === "LABOUR") {
//       navigate("/"); // Redirect to home page or show a message
//     }
//   }, [user, navigate]);
//   useEffect(() => {
//     const loadServices = async () => {
//       try {
//         const data = await fetchServices();
//         setServices(data)
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to load services. Please try again later.",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadServices()
//   }, [toast])

//   const categories = ["All Categories", ...Array.from(new Set(services.map((service) => service.category)))]

//   const subcategories = ["All Subcategories", ...Array.from(new Set(services.map((service) => service.subcategory)))]

//   const handleCategoryChange = (value: string) => {
//     setSelectedCategory(value)
//     setSelectedSubcategory("All Subcategories")
//   }

//   const filteredServices = services.filter((service) => {
//     const categoryMatch = selectedCategory === "All Categories" || service.category === selectedCategory
//     const subcategoryMatch = selectedSubcategory === "All Subcategories" || service.subcategory === selectedSubcategory
//     const searchMatch =
//       service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       service.description.toLowerCase().includes(searchQuery.toLowerCase())
//     return categoryMatch && subcategoryMatch && searchMatch
//   })

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     if (!selectedService) return

//     try {
//     //   const bookingRequest = {
//     //     serviceId: selectedService.serviceId,
//     //     email: data.email,
//     //     location: data.address,
//     //     name: data.fullName,
//     //     date: data.date.toISOString().split("T")[0],
//     //     time: data.time,
//     //     description: data.description || "",
//     //   }

//       const bookingRequest: any = {
//         serviceId: selectedService.serviceId,
//         email: data.email,
//         location: data.address,
//         name: data.fullName,
//         date: data.date.toISOString().split("T")[0],
//         time: data.time,
//         description: data.description || "",
//       };
  

//       await bookService(bookingRequest)
//       toast({
//         title: "Success",
//         description: "Service booked successfully!",
//       })
//       form.reset()
//       setSelectedService(null)
//       setDialogOpen(false)
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to book service. Please try again.",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex h-[50vh] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <div className="mb-12 text-center">
//         <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
//         <p className="mt-4 text-lg text-muted-foreground">
//           Discover our comprehensive range of professional services tailored to meet your needs. From home maintenance
//           to specialized solutions, we've got you covered.
//         </p>
//       </div>

//       <div className="mb-8">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search services..."
//             className="pl-10"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="mb-8 flex space-x-4">
//         <Select value={selectedCategory} onValueChange={handleCategoryChange}>
//           <SelectTrigger className="w-[200px]">
//             <SelectValue placeholder="Select category" />
//           </SelectTrigger>
//           <SelectContent>
//             {categories.map((category) => (
//               <SelectItem key={category} value={category}>
//                 {category}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select value={selectedSubcategory} onValueChange={(value) => setSelectedSubcategory(value)}>
//           <SelectTrigger className="w-[200px]">
//             <SelectValue placeholder="Select subcategory" />
//           </SelectTrigger>
//           <SelectContent>
//             {subcategories.map((subcategory) => (
//               <SelectItem key={subcategory} value={subcategory}>
//                 {subcategory}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredServices.map((service) => (
//           <Card key={service.serviceId}>
//             <CardHeader>
//               <CardTitle>{service.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground">{service.description}</p>
//               <p className="mt-2 font-semibold">Base Fee: ${service.baseFee.toFixed(2)}</p>
//               <div className="mt-2 text-sm">
//                 <span className="mr-2 inline-block rounded-full bg-primary/10 px-2 py-1">{service.category}</span>
//                 <span className="inline-block rounded-full bg-primary/10 px-2 py-1">{service.subcategory}</span>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button className="w-full" onClick={() => setSelectedService(service)}>
//                     Book Now
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[500px]">
//                   <DialogHeader>
//                     <DialogTitle>Book Service - {service.name}</DialogTitle>
//                   </DialogHeader>
//                   <ScrollArea className="max-h-[60vh] px-1">
//                     <div className="p-4">
//                       <Form {...form}>
//                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                           <FormField
//                             control={form.control}
//                             name="fullName"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Full Name</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="email"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Email</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} type="email" />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="phone"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Phone</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} type="tel" />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="date"
//                             render={({ field }) => (
//                               <FormItem className="flex flex-col">
//                                 <FormLabel>Date</FormLabel>
//                                 <Popover>
//                                   <PopoverTrigger asChild>
//                                     <FormControl>
//                                       <Button
//                                         variant={"outline"}
//                                         className={cn(
//                                           "w-full pl-3 text-left font-normal",
//                                           !field.value && "text-muted-foreground",
//                                         )}
//                                       >
//                                         {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                                       </Button>
//                                     </FormControl>
//                                   </PopoverTrigger>
//                                   <PopoverContent className="w-auto p-0" align="start">
//                                     <Calendar
//                                       mode="single"
//                                       selected={field.value}
//                                       onSelect={field.onChange}
//                                       disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
//                                       initialFocus
//                                     />
//                                   </PopoverContent>
//                                 </Popover>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="time"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Time</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} type="time" />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="address"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Address</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <div className="grid grid-cols-3 gap-4">
//                             <FormField
//                               control={form.control}
//                               name="city"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>City</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} disabled />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={form.control}
//                               name="state"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>State</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} disabled/>
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />

//                             <FormField
//                               control={form.control}
//                               name="zipCode"
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel>ZIP Code</FormLabel>
//                                   <FormControl>
//                                     <Input {...field} disabled />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>

//                           <FormField
//                             control={form.control}
//                             name="description"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Additional Notes</FormLabel>
//                                 <FormControl>
//                                   <Textarea {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />

//                           <Button type="submit" className="w-full">
//                             Confirm Booking
//                           </Button>
//                         </form>
//                       </Form>
//                     </div>
//                   </ScrollArea>
//                 </DialogContent>
//               </Dialog>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import * as z from "zod"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { fetchServices } from "@/api/service.api"
import { bookService } from "@/api/apiService"
import { useNavigate } from "react-router-dom"

interface Service {
  serviceId: number
  name: string
  category: string
  baseFee: number
  subcategory: string
  description: string
}

const formSchema = z.object({
  service: z.string(),
  date: z.date(),
  time: z.string(),
  address: z.string().min(1, "Address is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  description: z.string().optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
})

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All Subcategories")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      date: new Date(),
      time: "",
      address: "",
      fullName: "",
      email: "",
      phone: "",
      description: "",
      state: user?.user_type === "USER" ? user.state : "",
      city: user?.user_type === "USER" ? user.city : "",
      zipCode: user?.user_type === "USER" ? user.zipcode : "",
    },
  })

  useEffect(() => {
    if (user?.user_type === "LABOUR") {
      navigate("/") // Redirect to home page or show a message
    }
  }, [user, navigate])

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices()
        setServices(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load services. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [toast])

  useEffect(() => {
    if (dialogOpen) {
      document.body.classList.add('popover-open')
    } else {
      document.body.classList.remove('popover-open')
    }
  }, [dialogOpen])

  const categories = ["All Categories", ...Array.from(new Set(services.map((service) => service.category)))]

  const subcategories = ["All Subcategories", ...Array.from(new Set(services.map((service) => service.subcategory)))]

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setSelectedSubcategory("All Subcategories")
  }

  const filteredServices = services.filter((service) => {
    const categoryMatch = selectedCategory === "All Categories" || service.category === selectedCategory
    const subcategoryMatch = selectedSubcategory === "All Subcategories" || service.subcategory === selectedSubcategory
    const searchMatch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && subcategoryMatch && searchMatch
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!selectedService) return

    try {
        const bookingRequest: any = {
            serviceId: selectedService.serviceId,
            email: data.email,
            location: data.address,
            name: data.fullName,
            date: data.date.toISOString().split("T")[0],
            time: data.time,
            description: data.description || "",
          };

      await bookService(bookingRequest)
      toast({
        title: "Success",
        description: "Service booked successfully!",
      })
      form.reset()
      setSelectedService(null)
      setDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book service. Please try again.",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-10">
      <style>{`
        .popover-content {
          z-index: 1100;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 16px;
        }

        .calendar {
          user-select: none;
          pointer-events: auto;
        }

        .calendar button {
          cursor: pointer;
          background: none;
          border: none;
          padding: 8px;
          font-size: 14px;
        }

        .calendar button:hover {
          background-color: #f3f4f6;
        }

        .calendar button.selected {
          background-color: #007bff;
          color: white;
        }

        .dialog-content {
          z-index: 1050;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 24px;
          max-width: 500px;
          width: 100%;
        }

        .dialog-header {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .dialog-footer {
          margin-top: 16px;
          text-align: right;
        }

        body.popover-open {
          pointer-events: none;
        }

        body.popover-open .popover-content {
          pointer-events: auto;
        }
      `}</style>

      <div className="mb-12 text-center ">
        <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover our comprehensive range of professional services tailored to meet your needs. From home maintenance
          to specialized solutions, we've got you covered.
        </p>
      </div>

      

      <div className="mb-8 flex space-x-4">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSubcategory} onValueChange={(value) => setSelectedSubcategory(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory} value={subcategory}>
                {subcategory}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mb-8">
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-10 w-52"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <Card key={service.serviceId}>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <p className="mt-2 font-semibold">Base Fee: ${service.baseFee.toFixed(2)}</p>
              <div className="mt-2 text-sm">
                <span className="mr-2 inline-block rounded-full bg-primary/10 px-2 py-1">{service.category}</span>
                <span className="inline-block rounded-full bg-primary/10 px-2 py-1">{service.subcategory}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedService(service)}>
                    Book Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="dialog-content sm:max-w-[500px]">
                  <DialogHeader className="dialog-header">
                    <DialogTitle>Book Service - {service.name}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[60vh] px-1">
                    <div className="p-4">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} type="tel" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground",
                                        )}
                                      >
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="popover-content w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                      initialFocus
                                      className="calendar"
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                  <Input {...field} type="time" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Notes</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full">
                            Confirm Booking
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
