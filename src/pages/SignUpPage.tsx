import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { signup } from "@/api/auth";
import { getCity, getState, getZipcodes } from "@/api/locationsApi";

const formSchema = z
  .object({
    namePrefix: z.enum(["Mr", "Ms", "Mrs", "Dr", "Other"]),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z.string().min(5, "Zip code is required"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOTP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [stateInputFocused, setStateInputFocused] = useState(false);
  const [cityInputFocused, setCityInputFocused] = useState(false);
  const [zipCodeInputFocused, setZipCodeInputFocused] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namePrefix: "Mr",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      state: "",
      city: "",
      zipCode: "",
      acceptTerms: false,
    },
  });

  const watchState = form.watch("state");
  const watchCity = form.watch("city");
  const watchEmail = form.watch("email");

  const debouncedFetchStates = useCallback(
    debounce(async (prefix: string) => {
      if (prefix.length === 0) return;
      try {
        const response = await getState(prefix);
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      }
    }, 300),
    []
  );

  const debouncedFetchCities = useCallback(
    debounce(async (state: string, prefix: string = "") => {
      if (prefix.length === 0) return;
      try {
        const response = await getCity(state, prefix);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    }, 300),
    []
  );

  const debouncedFetchZipCodes = useCallback(
    debounce(async (state: string, city: string, prefix: string = "") => {
      if (prefix.length === 0) return;
      try {
        const response = await getZipcodes(state, city);
        const data = await response.json();
        setZipCodes(data);
      } catch (error) {
        console.error("Error fetching zip codes:", error);
        setZipCodes([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (watchState) {
      form.setValue("city", "");
      form.setValue("zipCode", "");
      debouncedFetchCities(watchState);
    }
  }, [watchState, form, debouncedFetchCities]);

  useEffect(() => {
    if (watchCity) {
      form.setValue("zipCode", "");
      debouncedFetchZipCodes(watchState, watchCity);
    }
  }, [watchCity, form, watchState, debouncedFetchZipCodes]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    setPasswordStrength(strength);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const signupData = {
        namePrefix: values.namePrefix,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        state: values.state,
        city: values.city,
        zipCode: values.zipCode,
      };

      const data = await signup(signupData);
      console.log("Signup successful:", data);
      setIsLoading(false);
      setShowOTPDialog(true);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || "Signup failed. Please try again.");
    }
  }

  async function verifyEmailHandler() {
    try {
      // Simulating email verification
      setShowOTPDialog(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Email verification failed. Please try again.");
    }
  }

  function verifyOTP() {
    console.log("OTP verified:", otp);
    setShowOTPDialog(false);
    setIsEmailVerified(true);
  }

  const isValidEmail = z.string().email().safeParse(watchEmail).success;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-[600px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to sign up for PartTimer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="namePrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Ms">Ms</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Dr">Dr</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Middle Name <span className="text-xs">(Optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="M." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
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
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input type="email" placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        onClick={verifyEmailHandler} 
                        disabled={!isValidEmail || isEmailVerified}
                      >
                        {isEmailVerified ? "Verified" : "Verify Email"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEmailVerified && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              calculatePasswordStrength(e.target.value);
                            }}
                          />
                        </FormControl>
                        <Progress value={passwordStrength} className="w-full" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>State</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={() => setStateInputFocused(true)}
                          >
                            {field.value
                              ? states.find((state) => state === field.value)
                              : stateInputFocused
                              ? "Start writing to get suggestions"
                              : "Select state"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search state..."
                            onValueChange={(search) => {
                              if (search.length > 0) {
                                debouncedFetchStates(search);
                              }
                            }}
                          />
                          <CommandEmpty>No state found.</CommandEmpty>
                          <CommandGroup>
                            {states.length > 0 ? (
                              states.map((state) => (
                                <CommandItem
                                  value={state}
                                  key={state}
                                  onSelect={() => {
                                    form.setValue("state", state);
                                    setStateInputFocused(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      state === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {state}
                                </CommandItem>
                              ))
                            ) : (
                              <CommandItem>Start typing to search...</CommandItem>
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>City</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!watchState}
                            onClick={() => setCityInputFocused(true)}
                          >
                            {field.value
                              ? cities.find((city) => city === field.value)
                              : cityInputFocused
                              ? "Start writing to get suggestions"
                              : "Select city"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search city..."
                            onValueChange={(search) => {
                              if (search.length > 0) {
                                debouncedFetchCities(watchState, search);
                              }
                            }}
                          />
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup>
                            {cities.length > 0 ? (
                              cities.map((city) => (
                                <CommandItem
                                  value={city}
                                  key={city}
                                  onSelect={() => {
                                    form.setValue("city", city);
                                    setCityInputFocused(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      city === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {city}
                                </CommandItem>
                              ))
                            ) : (
                              <CommandItem>Start typing to search...</CommandItem>
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Zip Code</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={!watchCity}
                            onClick={() => setZipCodeInputFocused(true)}
                          >
                            {field.value
                              ? zipCodes.find(
                                  (zipCode) => zipCode === field.value
                                )
                              : zipCodeInputFocused
                              ? "Start writing to get suggestions"
                              : "Select zip code"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search zip code..."
                            onValueChange={(search) => {
                              if (search.length > 0) {
                                debouncedFetchZipCodes(watchState, watchCity, search);
                              }
                            }}
                          />
                          <CommandEmpty>No zip code found.</CommandEmpty>
                          <CommandGroup>
                            {zipCodes.length > 0 ? (
                              zipCodes.map((zipCode) => (
                                <CommandItem
                                  value={zipCode}
                                  key={zipCode}
                                  onSelect={() => {
                                    form.setValue("zipCode", zipCode);
                                    setZipCodeInputFocused(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      zipCode === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {zipCode}
                                </CommandItem>
                              ))
                            ) : (
                              <CommandItem>Start typing to search...</CommandItem>
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          terms and conditions
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !isEmailVerified}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing up...
                  </div>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>

      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              We've sent a one-time password to your email. Please enter it
              below to verify your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOTP(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              onClick={verifyOTP}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Verify OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

