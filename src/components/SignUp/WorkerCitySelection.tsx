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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SignupData } from '@/lib/validations/signup'
import { getCountry, getState, getCity } from "@/api/locationsApi"

type WorkerLocationSelectionProps = {
  formData: Partial<SignupData & { serviceCities?: string[] }>
  updateFormData: (data: Partial<SignupData & { serviceCities?: string[] }>) => void
  completeSignup: () => void
  prevStep: () => void
}

const workerLocationSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  state: z.string().min(1, "Please select a state"),
  serviceCities: z.array(z.string()).min(1, "Please select at least one city").max(3, "You can select up to 3 cities"),
})

export function WorkerCitySelection({ formData, updateFormData, completeSignup, prevStep }: WorkerLocationSelectionProps) {
  const [countries, setCountries] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const form = useForm<z.infer<typeof workerLocationSchema>>({
    resolver: zodResolver(workerLocationSchema),
    defaultValues: {
      country: formData.country || '',
      state: formData.state || '',
      serviceCities: formData.serviceCities || [],
    },
  })

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await getCountry()
        setCountries(countriesData)
      } catch (error) {
        console.error("Failed to fetch countries:", error)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchStates = async () => {
      if (form.watch('country')) {
        try {
          const statesData = await getState(form.watch('country'))
          setStates(statesData)
        } catch (error) {
          console.error("Failed to fetch states:", error)
        }
      }
    }

    fetchStates()
  }, [form.watch('country')])

  useEffect(() => {
    const fetchCities = async () => {
      if (form.watch('country') && form.watch('state')) {
        try {
          const citiesData = await getCity(form.watch('country'), form.watch('state'))
          setCities(citiesData)
        } catch (error) {
          console.error("Failed to fetch cities:", error)
        }
      }
    }

    fetchCities()
  }, [form.watch('country'), form.watch('state')])

  const onSubmit = (values: z.infer<typeof workerLocationSchema>) => {
    updateFormData(values)
    completeSignup()
  }

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
              <FormLabel>Cities</FormLabel>
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
                                  return checked
                                    ? field.onChange([...field.value, city])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== city
                                        )
                                      )
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
          <Button type="submit">Complete Sign Up</Button>
        </div>
      </form>
    </Form>
  )
}

