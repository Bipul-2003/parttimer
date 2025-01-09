import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { signupSchema, SignupData } from "../../lib/validations/signup";
import { getCountry, getState, getCity, getZipcodes } from "@/api/locationsApi";
// import { useLocation, useNavigate } from "react-router-dom";

type SignupStep2Props = {
  formData: Partial<SignupData>;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const step2Schema = signupSchema.pick({
  country: true,
  state: true,
  city: true,
  zipCode: true,
});

export function SignupStep2({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: SignupStep2Props) {
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  // const location = useLocation();
  // const navigate = useNavigate();

  const form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  });

  useEffect(() => {
    // Check if we have data from Google Sign-In
   
    getCountry()
      .then(setCountries)
      .catch((error) => {
        console.error("Failed to fetch countries:", error);
      });
  }, []);

  useEffect(() => {
    if (form.watch("country")) {
      getState(form.watch("country"))
        .then(setStates)
        .catch((error) => {
          console.error("Failed to fetch states:", error);
        });
    }
  }, [form.watch("country")]);

  useEffect(() => {
    if (form.watch("country") && form.watch("state")) {
      getCity(form.watch("country"), form.watch("state"))
        .then(setCities)
        .catch((error) => {
          console.error("Failed to fetch cities:", error);
        });
    }
  }, [form.watch("country"), form.watch("state")]);

  useEffect(() => {
    if (form.watch("country") && form.watch("state") && form.watch("city")) {
      getZipcodes(
        form.watch("country"),
        form.watch("state"),
        form.watch("city")
      )
        .then(setZipCodes)
        .catch((error) => {
          console.error("Failed to fetch zip codes:", error);
        });
    }
  }, [form.watch("country"), form.watch("state"), form.watch("city")]);

  function onSubmit(values: z.infer<typeof step2Schema>) {
    console.log(values);
    
    updateFormData(values);
    // if (location.state) {
    //   // If we came from Google Sign-In, go to Step 3
    //   navigate("/signup/step3");
    // } else {
      nextStep();
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            Location Information
          </h2>
          <p className="text-muted-foreground text-center">
            Please provide your location details
          </p>
        </div>
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.watch("country")}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.watch("state")}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.watch("city")}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zip code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {zipCodes.map((zipCode) => (
                    <SelectItem key={zipCode} value={zipCode}>
                      {zipCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" onClick={prevStep} variant="outline">
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
