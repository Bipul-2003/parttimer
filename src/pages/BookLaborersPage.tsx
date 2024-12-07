import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  numberOfLabors: z.enum(["1", "2", "3", "4"]),
  sameDateForAll: z.boolean().default(false),
  sameTimeSlotForAll: z.boolean().default(false),
  laborDetails: z.array(
    z.object({
      date: z.date({ required_error: "Date is required" }),
      timeSlot: z.enum(
        ["8:30 AM - 11:30 AM", "12:30 PM - 5:30 PM", "Full Day"],
        { required_error: "Time slot is required" }
      ),
    })
  ),
});

export function LaborBookingForm() {
  const [sameDateForAll, setSameDateForAll] = useState(false);
  const [sameTimeSlotForAll, setSameTimeSlotForAll] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      phoneNumber: "",
      email: "",
      numberOfLabors: "1",
      sameDateForAll: false,
      sameTimeSlotForAll: false,
      laborDetails: [{ date: new Date(), timeSlot: "8:30 AM - 11:30 AM" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "laborDetails",
  });

  const numberOfLabors = parseInt(form.watch("numberOfLabors"));

  useEffect(() => {
    const currentLength = fields.length;
    if (numberOfLabors > currentLength) {
      for (let i = currentLength; i < numberOfLabors; i++) {
        append({ date: new Date(), timeSlot: "8:30 AM - 11:30 AM" });
      }
    } else if (numberOfLabors < currentLength) {
      for (let i = currentLength; i > numberOfLabors; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfLabors, fields.length, append, remove]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6">Book Laborers</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
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
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfLabors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Laborers</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of laborers" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["1", "2", "3", "4"].map((num) => (
                            <SelectItem key={num} value={num}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Scheduling Options</h2>
                <div className="flex space-x-4 ">
                  <FormField
                    control={form.control}
                    name="sameDateForAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setSameDateForAll(checked as boolean);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Same date for all</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sameTimeSlotForAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setSameTimeSlotForAll(checked as boolean);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Same time slot for all</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Labor {index + 1}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`laborDetails.${index}.date`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="pb-3">Date</FormLabel>
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
                                    onSelect={(date) => {
                                      if (date) {
                                        field.onChange(date);
                                        if (sameDateForAll) {
                                          form.setValue(
                                            "laborDetails",
                                            fields.map((f) => ({ ...f, date }))
                                          );
                                        }
                                      }
                                    }}
                                    disabled={(date) =>
                                      date < new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`laborDetails.${index}.timeSlot`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time Slot</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(
                                    value as
                                      | "8:30 AM - 11:30 AM"
                                      | "12:30 PM - 5:30 PM"
                                      | "Full Day"
                                  );
                                  if (sameTimeSlotForAll) {
                                    form.setValue(
                                      "laborDetails",
                                      fields.map((f) => ({
                                        ...f,
                                        timeSlot: value as
                                          | "8:30 AM - 11:30 AM"
                                          | "12:30 PM - 5:30 PM"
                                          | "Full Day",
                                      }))
                                    );
                                  }
                                }}
                                defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time slot" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="8:30 AM - 11:30 AM">
                                    8:30 AM - 11:30 AM
                                  </SelectItem>
                                  <SelectItem value="12:30 PM - 5:30 PM">
                                    12:30 PM - 5:30 PM
                                  </SelectItem>
                                  <SelectItem value="Full Day">
                                    Full Day
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button type="submit" className="w-full">
                Book Laborers
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
