import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { categories, cities, shops } from '@/utils/mockData'
// import { Shop } from '@/types/types'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Shop } from '@/types/Advertisements'
import { categories, cities, shops } from '@/lib/data/mockData'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  city: z.string({
    required_error: "Please select a city.",
  }),
  zip: z.string().min(5, {
    message: "ZIP code must be at least 5 characters.",
  }),
  mobileNumber: z.string().min(10, {
    message: "Mobile number must be at least 10 characters.",
  }),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  hours: z.string().min(5, {
    message: "Hours must be at least 5 characters.",
  }),
  googleMapLink: z.string().url({
    message: "Please enter a valid Google Maps URL.",
  }),
  offers: z.array(z.object({
    code: z.string().min(2, "Code must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
  })).default([]),
})

export default function ManageAdPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shop, setShop] = useState<Shop | null>(null)

  useEffect(() => {
    const foundShop = shops.find(s => s.id === id)
    setShop(foundShop || null)
  }, [id])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shop?.name || "",
      category: shop?.category || "",
      description: shop?.description || "",
      location: shop?.location || "",
      city: shop?.city || "",
      zip: shop?.zip || "",
      mobileNumber: shop?.mobileNumber || "",
      email: shop?.email || "",
      website: shop?.website || "",
      hours: shop?.hours || "",
      googleMapLink: shop?.googleMapLink || "",
      offers: shop?.offers || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "offers",
  })

  function addOffer() {
    if (fields.length < 10) {
      append({ code: '', description: '' })
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Here you would typically send the data to your backend
    console.log(values)
    setTimeout(() => {
      setIsSubmitting(false)
      // Show success message or update state
      navigate('/my-ads')
    }, 2000)
  }

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Ad Not Found</h2>
            <p className="text-gray-600">Sorry, we couldn't find the ad you're looking for.</p>
            <Button className="mt-4" onClick={() => navigate('/my-ads')}>Back to My Ads</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Ad</CardTitle>
          <CardDescription>Update your ad details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business name" {...field} />
                    </FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business address" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
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
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ZIP code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
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
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter website URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="googleMapLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Map Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Google Maps URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Offers</h3>
                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-medium">Offer #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`offers.${index}.code`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Offer Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`offers.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Offer Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addOffer}
                  disabled={fields.length >= 10}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Offer
                </Button>
              </div>
              <div className="flex justify-between">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Ad"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/my-ads')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

