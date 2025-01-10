import { useState, useEffect, useCallback } from 'react'
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SignupData, workerSchema } from '@/lib/validations/signup'
import { getCountry, getState, getCity } from "@/api/locationsApi"

type WorkerLocationSelectionProps = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData>) => void
  completeSignup: () => Promise<void>
  prevStep: () => void
}

const workerLocationSchema = workerSchema.pick({
  country: true,
  state: true,
  serviceCities: true,
})

export function WorkerCitySelection({ formData, updateFormData, completeSignup, prevStep }: WorkerLocationSelectionProps) {
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof workerLocationSchema>>({
    resolver: zodResolver(workerLocationSchema),
    defaultValues: {
      country: formData.country || '',
      state: formData.state || '',
      serviceCities: (formData as any).serviceCities || [],
    },
  })

  const fetchCountries = useCallback(async () => {
    try {
      const countriesData = await getCountry()
      setCountries(countriesData)
    } catch (error) {
      console.error("Failed to fetch countries:", error)
    }
  }, [])

  const fetchStates = useCallback(async (country: string) => {
    if (country) {
      try {
        const statesData = await getState(country)
        setStates(statesData)
      } catch (error) {
        console.error("Failed to fetch states:", error)
      }
    }
  }, [])

  const fetchCities = useCallback(async (country: string, state: string) => {
    if (country && state) {
      try {
        const citiesData = await getCity(country, state)
        setCities(citiesData)
      } catch (error) {
        console.error("Failed to fetch cities:", error)
      }
    }
  }, [])

  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])

  useEffect(() => {
    const country = form.watch('country')
    if (country) {
      fetchStates(country)
    }
  }, [form.watch('country'), fetchStates])

  useEffect(() => {
    const country = form.watch('country')
    const state = form.watch('state')
    if (country && state) {
      fetchCities(country, state)
    }
  }, [form.watch('country'), form.watch('state'), fetchCities])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'country' || name === 'state' || name === 'serviceCities') {
        updateFormData(value as Partial<SignupData>)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  const onSubmit = async (values: z.infer<typeof workerLocationSchema>) => {
    setIsLoading(true);
    try {
      updateFormData(values);
      if (values.serviceCities.length > 0) {
        await completeSignup();
      } else {
        form.setError('serviceCities', {
          type: 'manual',
          message: 'Please select at least one service city',
        });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">Select Your Location</h2>
          <p className="text-sm text-muted-foreground text-center">
            Choose your country, state, and up to 3 cities where you'd like to work
          </p>
        </div>

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
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
          name="serviceCities"
          render={() => (
            <FormItem>
              <FormLabel>Service Cities</FormLabel>
              <FormControl>
                <ScrollArea className="h-72 rounded-md border p-4">
                  {cities.map((city) => (
                    <FormField
                      key={city}
                      control={form.control}
                      name="serviceCities"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={city}
                            className="flex flex-row items-start space-x-3 space-y-0 mb-4"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(city)}
                                onCheckedChange={(checked) => {
                                  const updatedCities = checked
                                    ? [...field.value, city]
                                    : field.value?.filter((value) => value !== city)
                                  field.onChange(updatedCities)
                                  updateFormData({ ...form.getValues(), serviceCities: updatedCities })
                                }}
                                disabled={
                                  !field.value?.includes(city) &&
                                  field.value?.length >= 3
                                }
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {city}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" onClick={prevStep} variant="outline">
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Complete Sign Up"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

