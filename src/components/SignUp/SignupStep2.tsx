'use client'

import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signupSchema, SignupData } from '../../lib/validations/signup'

type SignupStep2Props = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData>) => void
  nextStep: () => void
  prevStep: () => void
}

const step2Schema = signupSchema.pick({
  country: true,
  state: true,
  city: true,
  zipCode: true,
})

export function SignupStep2({ formData, updateFormData, nextStep, prevStep }: SignupStep2Props) {
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [zipCodes, setZipCodes] = useState<string[]>([])

  const form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  })

  useEffect(() => {
    // Simulated API calls to fetch location data
    setCountries(['USA', 'Canada', 'UK'])
  }, [])

  useEffect(() => {
    if (form.watch('country')) {
      setStates(['State 1', 'State 2', 'State 3'])
    }
  }, [form.watch('country')])

  useEffect(() => {
    if (form.watch('state')) {
      setCities(['City 1', 'City 2', 'City 3'])
    }
  }, [form.watch('state')])

  useEffect(() => {
    if (form.watch('city')) {
      setZipCodes(['12345', '67890', '54321'])
    }
  }, [form.watch('city')])

  function onSubmit(values: z.infer<typeof step2Schema>) {
    updateFormData(values)
    nextStep()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">Location Information</h2>
          <p className="text-muted-foreground text-center">Please provide your location details</p>
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
              <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch('country')}>
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
              <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch('state')}>
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
              <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch('city')}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zip code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {zipCodes.map((zipCode) => (
                    <SelectItem key={zipCode} value={zipCode}>
                      {
zipCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" onClick={prevStep} variant="outline">Back</Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  )
}

