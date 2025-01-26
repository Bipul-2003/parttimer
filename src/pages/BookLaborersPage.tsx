import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
// import axios from "axios"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2, AlertTriangle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
// import config from "@/config/config"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getZipbyCityandState } from "@/api/locationsApi"
import axiosInstance from "@/api/axiosConfig"

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  numberOfLabors: z.enum(["1", "2", "3", "4"]),
  sameDateForAll: z.boolean().default(false),
  sameTimeSlotForAll: z.boolean().default(false),
  sameNoteForAll: z.boolean().default(false),
  sharedNote: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  laborDetails: z.array(
    z.object({
      date: z.date({ required_error: "Date is required" }),
      timeSlot: z.enum(["7:30 AM - 11:30 AM", "12:30 PM - 4:30 PM", "Full Day", "Extended Hours"], {
        required_error: "Time slot is required",
      }),
      note: z.string().optional(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

export function LaborBookingForm() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>Please log in to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (user.user_type !== "USER") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>This page is only accessible to regular users.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const [sharedNote, setSharedNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [zipcodes, setZipcodes] = useState<string[]>([])

  function getLocalDate() {
    const now = new Date()
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0, // Reset time to midnight in local timezone
    )
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      phoneNumber: "",
      email: user?.user_type === "USER" ? user.email : "",
      city: user?.user_type === "USER" ? user.city || "" : "",
      state: user?.user_type === "USER" ? user.state || "" : "",
      zipcode: user.zipcode,
      numberOfLabors: "1",
      sameDateForAll: false,
      sameTimeSlotForAll: false,
      sameNoteForAll: false,
      sharedNote: "",
      laborDetails: [{ date: getLocalDate(), timeSlot: "7:30 AM - 11:30 AM", note: "" }],
    },
  })

  const fetchZipcodes = useCallback(async (city: string, state: string) => {
    try {
      const fetchedZipcodes = await getZipbyCityandState(city, state)
      setZipcodes(fetchedZipcodes)
    } catch (error) {
      console.error("Error fetching zipcodes:", error)
    }
  }, [])

  useEffect(() => {
    const city = form.watch("city")
    const state = user?.state || ""
    if (city && state) {
      fetchZipcodes(city, state)
    }
  }, [form.watch("city"), fetchZipcodes, user?.state])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "laborDetails",
  })

  const numberOfLabors = Number.parseInt(form.watch("numberOfLabors"))

  useEffect(() => {
    const currentLength = fields.length
    if (numberOfLabors > currentLength) {
      for (let i = currentLength; i < numberOfLabors; i++) {
        append({ date: new Date(), timeSlot: "7:30 AM - 11:30 AM", note: "" })
      }
    } else if (numberOfLabors < currentLength) {
      for (let i = currentLength; i > numberOfLabors; i--) {
        remove(i - 1)
      }
    }
  }, [numberOfLabors, fields.length, append, remove])

  // function convertToUTCMidnight(date: Date): Date {
  //   // Create a new Date object at UTC midnight
  //   const utcDate = new Date(
  //     Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  //   );
  //   return utcDate;
  // }

  const handleDateChange = (date: Date | undefined, index: number) => {
    if (date) {
      if (form.getValues("sameDateForAll")) {
        form.setValue(
          "laborDetails",
          fields.map((f) => ({ ...f, date })),
        )
      } else {
        form.setValue(`laborDetails.${index}.date`, date)
      }
    }
  }

  const handleTimeSlotChange = (timeSlot: FormValues["laborDetails"][number]["timeSlot"], index: number) => {
    if (form.getValues("sameTimeSlotForAll")) {
      form.setValue(
        "laborDetails",
        fields.map((f) => ({ ...f, timeSlot })),
      )
    } else {
      form.setValue(`laborDetails.${index}.timeSlot`, timeSlot)
    }
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    const formattedValues = {
      ...values,
      laborDetails: values.laborDetails.map((detail) => ({
        ...detail,
        date: new Date(Date.UTC(detail.date.getFullYear(), detail.date.getMonth(), detail.date.getDate())),
      })),
    }

    try {
      // await axios.post(config.apiURI + "/api/user/labour-bookings", formattedValues, {
      //   withCredentials: true,
      // })
       await axiosInstance.post(`/api/user/labour-bookings`, formattedValues, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log(formattedValues)

      toast({
        title: "Booking Successful",
        description: "Your labor booking has been submitted successfully.",
      })
      setBookingSuccess(true)
    } catch (error) {
      console.error(error)
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="p-6">
          {bookingSuccess ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-6">Booking Successful!</h1>
              <p className="mb-6">Your labor booking has been submitted successfully.</p>
              <Button
                onClick={() => {
                  setBookingSuccess(false)
                  form.reset()
                }}
              >
                Book Another
              </Button>
            </div>
          ) : (
            <>
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
                            <Input placeholder="Enter your phone number" {...field} />
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
                            <Input
                              placeholder="Enter your email"
                              {...field}
                              disabled={user?.user_type === "USER"}
                              value={user?.user_type === "USER" ? user.email : field.value}
                            />
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
                            <Input
                              placeholder="Enter your state"
                              {...field}
                              disabled={user?.user_type === "USER"}
                              value={user?.user_type === "USER" ? user.state || "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your city"
                              {...field}
                              disabled={user?.user_type === "USER"}
                              value={user?.user_type === "USER" ? user.city || "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zipcode</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={user.zipcode} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder={user.zipcode || "Select zipcode"} />
                              </SelectTrigger>
                              <SelectContent>
                                {zipcodes.length > 0 ? (
                                  zipcodes.map((zipcode) => (
                                    <SelectItem key={zipcode} value={zipcode}>
                                      {zipcode}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value={user.zipcode}>{user.zipcode}</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {zipcodes.length === 0 ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Fetching available zipcodes...</span>
                              </>
                            ) : (
                              `${zipcodes.length} zipcodes available for ${form.watch("city")}`
                            )}
                          </div>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                                  field.onChange(e)
                                  setSharedNote(e.target.value)
                                  form.setValue(
                                    "laborDetails",
                                    form.getValues("laborDetails").map((detail) => ({
                                      ...detail,
                                      note: e.target.value,
                                    })),
                                  )
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
                          <h3 className="text-lg font-semibold mb-4">Labor {index + 1}</h3>
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
                                            !field.value && "text-muted-foreground",
                                          )}
                                        >
                                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                          if (date) {
                                            const localDate = new Date(
                                              date.getFullYear(),
                                              date.getMonth(),
                                              date.getDate(),
                                              0,
                                              0,
                                              0,
                                              0,
                                            )
                                            handleDateChange(localDate, index)
                                          }
                                        }}
                                        disabled={(date) => {
                                          const today = getLocalDate()
                                          return (
                                            date < today ||
                                            date < new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
                                          )
                                        }}
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
                                    onValueChange={(value: FormValues["laborDetails"][number]["timeSlot"]) =>
                                      handleTimeSlotChange(value, index)
                                    }
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select time slot" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="7:30 AM - 11:30 AM">7:30 AM - 11:30 AM</SelectItem>
                                      <SelectItem value="12:30 PM - 4:30 PM">12:30 PM - 4:30 PM</SelectItem>
                                      <SelectItem value="Full Day">Full Day (7:30 AM - 4:30 PM)</SelectItem>
                                      <SelectItem value="Extended Hours">Extended Hours</SelectItem>
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
                                    value={form.watch("sameNoteForAll") ? sharedNote : field.value}
                                    onChange={(e) => {
                                      if (!form.watch("sameNoteForAll")) {
                                        field.onChange(e)
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
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Book Laborers"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

