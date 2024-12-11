import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import axios from "axios";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  numberOfLabors: z.enum(["1", "2", "3", "4"]),
  sameDateForAll: z.boolean().default(false),
  sameTimeSlotForAll: z.boolean().default(false),
  sameNoteForAll: z.boolean().default(false),
  sharedNote: z.string().optional(),
  laborDetails: z.array(
    z.object({
      date: z.date({ required_error: "Date is required" }),
      timeSlot: z.enum(
        ["8:30 AM - 11:30 AM", "12:30 PM - 5:30 PM", "Full Day"],
        {
          required_error: "Time slot is required",
        }
      ),
      note: z.string().optional(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function LaborBookingForm() {
  const [sharedNote, setSharedNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      phoneNumber: "",
      email: "",
      numberOfLabors: "1",
      sameDateForAll: false,
      sameTimeSlotForAll: false,
      sameNoteForAll: false,
      sharedNote: "",
      laborDetails: [
        { date: new Date(), timeSlot: "8:30 AM - 11:30 AM", note: "" },
      ],
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
        append({ date: new Date(), timeSlot: "8:30 AM - 11:30 AM", note: "" });
      }
    } else if (numberOfLabors < currentLength) {
      for (let i = currentLength; i > numberOfLabors; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfLabors, fields.length, append, remove]);

  const handleDateChange = (date: Date | undefined, index: number) => {
    if (date) {
      if (form.getValues("sameDateForAll")) {
        form.setValue(
          "laborDetails",
          fields.map((f) => ({ ...f, date }))
        );
      } else {
        form.setValue(`laborDetails.${index}.date`, date);
      }
    }
  };

  const handleTimeSlotChange = (
    timeSlot: FormValues["laborDetails"][number]["timeSlot"],
    index: number
  ) => {
    if (form.getValues("sameTimeSlotForAll")) {
      form.setValue(
        "laborDetails",
        fields.map((f) => ({ ...f, timeSlot }))
      );
    } else {
      form.setValue(`laborDetails.${index}.timeSlot`, timeSlot);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const formattedValues = {
      ...values,
      laborDetails: values.laborDetails.map((detail) => ({
        ...detail,
        note: values.sameNoteForAll ? sharedNote : detail.note,
      })),
    };

    try {
      const response = await axios.post("/api/book-labor", formattedValues, {
        withCredentials: true,
      });
      console.log(response.data);
      toast({
        title: "Booking Successful",
        description: "Your labor booking has been submitted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Booking Failed",
        description:
          "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="sameDateForAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Same time slot for all</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sameNoteForAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Same note for all</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                {form.watch("sameNoteForAll") && (
                  <FormField
                    control={form.control}
                    name="sharedNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shared Note</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add a note for all laborers"
                            className="resize-none"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setSharedNote(e.target.value);
                              form.setValue(
                                "laborDetails",
                                form
                                  .getValues("laborDetails")
                                  .map((detail) => ({
                                    ...detail,
                                    note: e.target.value,
                                  }))
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                                    onSelect={(date) =>
                                      handleDateChange(date, index)
                                    }
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
                                onValueChange={(
                                  value: FormValues["laborDetails"][number]["timeSlot"]
                                ) => handleTimeSlotChange(value, index)}
                                value={field.value}>
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
                      <FormField
                        control={form.control}
                        name={`laborDetails.${index}.note`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Note</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add any additional notes for this laborer"
                                className="resize-none"
                                disabled={form.watch("sameNoteForAll")}
                                value={
                                  form.watch("sameNoteForAll")
                                    ? sharedNote
                                    : field.value
                                }
                                onChange={(e) => {
                                  if (!form.watch("sameNoteForAll")) {
                                    field.onChange(e);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Book Laborers"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
