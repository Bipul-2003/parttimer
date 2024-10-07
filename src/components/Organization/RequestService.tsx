// import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Car, Leaf, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const services = [
  {
    id: 1,
    name: "Car Wash",
    description: "Professional car cleaning service",
    icon: Car,
    category: "Automotive",
    subcategory: "Cleaning",
    requestCount: 150,
  },
  {
    id: 2,
    name: "Oil Change",
    description: "Quick and reliable oil change service",
    icon: Car,
    category: "Automotive",
    subcategory: "Maintenance",
    requestCount: 120,
  },
  {
    id: 3,
    name: "Lawn Mowing",
    description: "Expert lawn care and maintenance",
    icon: Leaf,
    category: "Home & Garden",
    subcategory: "Lawn Care",
    requestCount: 200,
  },
  {
    id: 4,
    name: "Garden Design",
    description: "Professional garden design and landscaping",
    icon: Leaf,
    category: "Home & Garden",
    subcategory: "Landscaping",
    requestCount: 80,
  },
  {
    id: 5,
    name: "House Cleaning",
    description: "Thorough home cleaning service",
    icon: Home,
    category: "Home & Garden",
    subcategory: "Cleaning",
    requestCount: 250,
  },
  {
    id: 6,
    name: "Carpet Cleaning",
    description: "Deep carpet cleaning and stain removal",
    icon: Home,
    category: "Home & Garden",
    subcategory: "Cleaning",
    requestCount: 100,
  },
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  subcategory: z.string().min(1, {
    message: "Please select a subcategory.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  proposedPrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid price.",
    }),
});

export function RequestService() {
  // const [customCategory, setCustomCategory] = useState(false);
  // const [customSubcategory, setCustomSubcategory] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      subcategory: "",
      description: "",
      proposedPrice: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the form data to your backend
    alert("Service request submitted successfully!");
    form.reset();
  }

  const categories = Array.from(
    new Set(services.map((service) => service.category))
  );
  const subcategories = Array.from(
    new Set(services.map((service) => service.subcategory))
  );

  return (
    <div className="p-10 rounded-lg bg-background">
        <h1 className="text-3xl mb-4 font-bold">Request to Add a New Service</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service name" {...field} />
                </FormControl>
                <FormDescription>
                  Provide a clear and concise name for the service you want to
                  request.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the category that best fits your service request.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("category") === "other" && (
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the subcategory that best describes your service
                  request.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("subcategory") === "other" && (
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Subcategory</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter custom subcategory" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the service you're requesting"
                    className="resize-none h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide details about the service you're requesting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proposedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter proposed price"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Suggest a price for this service (in your local currency).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Request</Button>
        </form>
      </Form>
    </div>
  );
}
