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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CalendarIcon,
  CarIcon,
  HomeIcon,
  LeafIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  MailIcon,
  StarIcon,
  CheckCircleIcon,
  SearchIcon,
  Dumbbell,
  GraduationCapIcon,
} from "lucide-react";
import { fetchServices } from "@/api/service.api";
import { bookService } from "@/api/apiService";

interface Service {
  serviceId: number;
  name: string;
  category: string;
  baseFee: number;
  subcategory: string;
  description: string;
}

function ServicesPage() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState("All Subcategories");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const servicesRef = useRef<HTMLDivElement>(null);

  const iconMap: { [key: string]: React.ElementType } = {
    Other: UserIcon, // General icon for "Other" category
    Automotive: CarIcon, // Icon for automotive services
    "Home & Garden": LeafIcon, // Icon for home and garden services
    Education: GraduationCapIcon, // Icon for education services
    // You can add more as needed
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const fetchedServices = await fetchServices();
        setServices(fetchedServices);
        setFilteredServices(fetchedServices);
      } catch (error) {
        console.error("Failed to load services:", error);
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

  const handleRequestSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle request form submission logic here
    console.log("Request form submitted");
    setIsRequestDialogOpen(false);
  };

  const handleBookSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Collect form data
    const serviceId =
      services
        .find(
          (service) =>
            service.name.toLowerCase().replace(" ", "-") === selectedService
        )
        ?.serviceId?.toString() || "";
    const bookingRequest = {
      serviceId: serviceId,
      customerName: (event.currentTarget["book-fullname"] as HTMLInputElement)
        .value,
      email: (event.currentTarget["book-email"] as HTMLInputElement).value,
      location: (event.currentTarget["book-location"] as HTMLInputElement)
        .value,
      name: (event.currentTarget["book-fullname"] as HTMLInputElement).value,
      date: (event.currentTarget["book-date"] as HTMLInputElement).value,
      time: (event.currentTarget["book-time"] as HTMLInputElement).value,
      description: (event.currentTarget["book-description"] as HTMLInputElement)
        .value,
    };

    try {
      const result = await bookService(bookingRequest);
      console.log("Booking successful:", result);
      // Handle success (e.g., show a confirmation message, close dialog)
      setIsBookDialogOpen(false); // Close the dialog on success
    } catch (error) {
      console.error("Error booking service:", error);
      // Handle error (e.g., show an error message)
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
    setSelectedService(serviceName.toLowerCase().replace(" ", "-"));
    setIsBookDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      <header className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setIsRequestDialogOpen(true)}
              >
                Request a Service
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-primary">
            Our Premium Services
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
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
                disabled={selectedCategory === "All Categories"}
              >
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.serviceId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    {/* <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary-foreground" />
                    </div> */}
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
                      onClick={() => openBookDialog(service.name)}
                    >
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
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Dialog
            open={isRequestDialogOpen}
            onOpenChange={setIsRequestDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="px-8 py-6 text-lg">
                <CalendarIcon className="mr-2 h-5 w-5" /> Request a Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Request a Service</DialogTitle>
                <DialogDescription>
                  Fill out the form below to request a service. We'll get back
                  to you as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="request-name" className="text-right">
                      Name
                    </Label>
                    <Input id="request-name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="request-service" className="text-right">
                      Service
                    </Label>
                    <Select required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem
                            key={service.serviceId}
                            value={service.name.toLowerCase().replace(" ", "-")}
                          >
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="request-area" className="text-right">
                      Area
                    </Label>
                    <Input id="request-area" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="request-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="request-description"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </main>

      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book a Service</DialogTitle>
            <DialogDescription>
              Fill out the form below to book a service. We'll confirm your
              booking shortly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book-service" className="text-right">
                  Service
                </Label>
                <Select required defaultValue={selectedService}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem
                        key={service.serviceId}
                        value={service.name.toLowerCase().replace(" ", "-")}
                      >
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book-date" className="text-right">
                  <CalendarIcon className="h-4 w-4" />
                </Label>
                <Input
                  id="book-date"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book-time" className="text-right">
                  <ClockIcon className="h-4 w-4" />
                </Label>
                <Input
                  id="book-time"
                  type="time"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book-location" className="text-right">
                  <MapPinIcon className="h-4 w-4" />
                </Label>
                <Input
                  id="book-location"
                  placeholder="Location"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book-fullname" className="text-right">
                  <UserIcon className="h-4 w-4" />
                </Label>
                <Input
                  id="book-fullname"
                  placeholder="Full Name"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book-email" className="text-right">
                  <MailIcon className="h-4 w-4" />
                </Label>
                <Input
                  id="book-email"
                  type="email"
                  placeholder="Email"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="book-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="book-description"
                  placeholder="Additional details"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Book Now</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ServicesPage;
