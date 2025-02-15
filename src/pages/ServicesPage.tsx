import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { animateScroll as scroll } from "react-scroll";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  SearchIcon,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { fetchServices } from "@/api/service.api";
import { bookService } from "@/api/apiService";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { createPortal } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// import { DatePicker } from "@/components/ui/date-picker";

interface Service {
  serviceId: number;
  name: string;
  category: string;
  baseFee: number;
  subcategory: string;
  description: string;
}

// interface BookingRequest {
//   serviceId: string;
//   customerName: string;
//   email: string;
//   address: string;
//   name: string;
//   date: string;
//   time: string;
//   description: string;
//   phone: string;
//   city: string;
//   zipCode: string;
// }

const formSchema = z.object({
  service: z.string({
    required_error: "Please select a service",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  address: z.string().min(1, "Address is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  description: z.string().optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().optional(),
  zipCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function ServicesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState("All Subcategories");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<Service[]>([])

 
  
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "error" | "success";
    title: string;
    description: string;
  } | null>(null);
  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const servicesRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
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
  });
  useEffect(() => {
    const loadServices = async () => {
      setIsServicesLoading(true);
      try {
        const fetchedServices = await fetchServices();
        console.log(fetchServices);
        setServices(fetchedServices);
        setFilteredServices(fetchedServices);
      } catch (error) {
        console.error("Failed to load services:", error);
        setNotification({
          type: "error",
          title: "Error",
          description: "Failed to load services. Please try again later.",
        });
      } finally {
        setIsServicesLoading(false);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        (selectedCategory === "All Categories" ||
          service.category === selectedCategory) &&
        (selectedSubcategory === "All Subcategories" ||
          service.subcategory === selectedSubcategory) &&
        (service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredServices(filtered);
  }, [selectedCategory, selectedSubcategory, searchQuery, services]);

  useEffect(() => {
    if (user?.user_type === "LABOUR") {
      navigate("/"); // Redirect to home page or show a message
    }
  }, [user, navigate]);

  const categories = [
    "All Categories",
    ...Array.from(new Set(services.map((service) => service.category))),
  ];
  const subcategories = [
    "All Subcategories",
    ...Array.from(new Set(services.map((service) => service.subcategory))),
  ];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory("All Subcategories");
  };

  const handleBookSubmit = async (data: FormValues) => {
    console.log("Form submitted with data:", data);
    setIsLoading(true);
    setNotification(null);

    const serviceId =
      services
        .find(
          (service) =>
            service.name.toLowerCase().replace(" ", "-") === data.service
        )
        ?.serviceId?.toString() || "";

    const bookingRequest: any = {
      serviceId: serviceId,
      // customerName: data.fullName,
      email: data.email,
      location: data.address,
      name: data.fullName,
      date: data.date.toISOString().split("T")[0],
      time: data.time,
      description: data.description || "",
      // phone: data.phone,
      // city: data.city || "",
      // zipCode: data.zipCode || "",
    };

    try {
      // Simulating API call
      await bookService(bookingRequest);
      setNotification({
        type: "success",
        title: "Success",
        description:
          "Your service has been booked successfully! (This is a simulation)",
      });
      setIsBookDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error booking service:", error);
      setNotification({
        type: "error",
        title: "Error",
        description: "Failed to book service. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToServices = () => {
    if (servicesRef.current) {
      scroll.scrollTo(servicesRef.current.offsetTop, {
        duration: 800,
        smooth: "easeInOutQuart",
      });
    }
  };

  const openBookDialog = (serviceName: string) => {
    form.setValue("service", serviceName.toLowerCase().replace(" ", "-"));
    setIsBookDialogOpen(true);
  };

  if (user?.user_type === "LABOUR") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">This page is not available for labour users.</p>
      </div>
    );
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
            <h1 className="text-5xl font-bold mb-4">
              Experience Premium Services
            </h1>
            <p className="text-xl mb-8">
              Elevate your lifestyle with our top-tier solutions
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" variant="secondary" onClick={scrollToServices}>
                Book Now
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        {notification && (
          <Alert
            variant={notification.type === "error" ? "destructive" : "default"}
            className="mb-6">
            <AlertTitle>{notification.title}</AlertTitle>
            <AlertDescription>{notification.description}</AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <Alert>
            <AlertTitle>Loading...</AlertTitle>
            <AlertDescription>
              <Loader2 className="animate-spin h-4 w-4 inline mr-2" />
              Please wait while we fetch the services.
            </AlertDescription>
          </Alert>
        )}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="text-4xl font-bold mb-4 text-primary">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <StarIcon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground text-center">
                We deliver nothing but the best in every service.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ClockIcon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Timely Service</h3>
              <p className="text-muted-foreground text-center">
                Punctuality is our promise to you, every time.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircleIcon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Customer Satisfaction
              </h3>
              <p className="text-muted-foreground text-center">
                Your happiness is our top priority.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={servicesRef}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}>
          <h2 className="text-4xl font-bold mb-8 text-center text-primary">
            Our Premium Services
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
                disabled={selectedCategory === "All Categories"}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {isServicesLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.serviceId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl">{service.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {service.category} - {service.subcategory}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="mt-auto flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => openBookDialog(service.name)}>
                        Book Now
                      </Button>
                      <Badge variant="secondary">
                        ${service.baseFee.toFixed(2)}
                      </Badge>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {isBookDialogOpen &&
        createPortal(
          <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] z-dialog max-h-svh overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>Book a Service</DialogTitle>
                <DialogDescription>
                  Fill out the form below to book a service. We'll confirm your
                  booking shortly.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleBookSubmit)}
                  className="space-y-6">
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem
                                key={service.serviceId}
                                value={service.name
                                  .toLowerCase()
                                  .replace(" ", "-")}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                       
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col flex-1">
                          <FormLabel className="mb-3">Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}>
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Select the date for your service.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            Choose a preferred time.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your address"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide the service location address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
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
                          <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                    </div>
                  <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex-1">
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
                        <FormItem className="flex-1">
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
                        <FormItem className="flex-1">
                          <FormLabel>Zip Code</FormLabel>
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional details (optional)"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide any additional information or special
                          requests.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Book Now"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>,
          document.body
        )}
      <style>{`
        .popover-content {
          z-index: 1000;
        }
        .react-calendar {
          width: 350px;
          max-width: 100%;
          background: white;
          border: 1px solid #a0a096;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.125em;
        }
        .react-calendar button {
          margin: 0;
          border: 0;
          outline: none;
        }
        .react-calendar button:enabled:hover {
          cursor: pointer;
        }
        .react-calendar__tile {
          max-width: 100%;
          padding: 10px 6.6667px;
          background: none;
          text-align: center;
          line-height: 16px;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #e6e6e6;
        }
        .react-calendar__tile--active {
          background: #006edc;
          color: white;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: #1087ff;
        }
      `}</style>
    </div>
  );
}

export default ServicesPage;
