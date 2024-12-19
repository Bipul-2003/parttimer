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
import { SignupData } from '@/lib/validations/signup'
import { getCity } from "@/api/locationsApi"

type WorkerCitySelectionProps = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData>) => void
  nextStep: () => void
  prevStep: () => void
}

const workerCitySchema = z.object({
  cities: z.array(z.string()).min(1, "Please select at least one city").max(3, "You can select up to 3 cities"),
})

export function WorkerCitySelection({ formData, updateFormData, nextStep, prevStep }: WorkerCitySelectionProps) {
  const [cities, setCities] = useState<string[]>([])

  const form = useForm<z.infer<typeof workerCitySchema>>({
    resolver: zodResolver(workerCitySchema),
    defaultValues: {
      cities: [],
    },
  })

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await getCity(formData.country || '', formData.state || '')
        setCities(citiesData)
      } catch (error) {
        console.error("Failed to fetch cities:", error)
      }
    }

    fetchCities()
  }, [formData.country, formData.state])

  const onSubmit = (values: z.infer<typeof workerCitySchema>) => {
    updateFormData({ cities: values.cities })
    nextStep()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">Select Your Cities</h2>
          <p className="text-sm text-muted-foreground text-center">
            Choose up to 3 cities where you'd like to work
          </p>
        </div>

        <FormField
          control={form.control}
          name="cities"
          render={() => (
            <FormItem>
              <FormLabel>Cities</FormLabel>
              <FormControl>
                <ScrollArea className="h-72 rounded-md border p-4">
                  {cities.map((city) => (
                    <FormField
                      key={city}
                      control={form.control}
                      name="cities"
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
          <Button type="submit">Complete Signup</Button>
        </div>
      </form>
    </Form>
  )
}

