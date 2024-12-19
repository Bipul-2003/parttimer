import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SignupData, signupSchema } from "@/lib/validations/signup"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

type SignupStep1Props = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData>) => void
  nextStep: () => void
}

const step1Schema = signupSchema.pick({
  title: true,
  firstName: true,
  middleName: true,
  lastName: true,
  phoneNumber: true,
  password: true,
  email: true,
})

export function SignupStep1({ formData, updateFormData, nextStep }: SignupStep1Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { googleSignIn, checkUser } = useAuth()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  })

  async function onSubmit(values: z.infer<typeof step1Schema>) {
    try {
      setIsLoading(true)
      const { profileComplete } = await checkUser(values.email)
      if (profileComplete) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please log in.",
          variant: "destructive",
        })
      } else {
        updateFormData(values)
        nextStep()
      }
    } catch (error) {
      console.error("Error checking user:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignup() {
    try {
      setIsLoading(true)
      const response = await googleSignIn()
      
      if (response.user) {
        const { name, email } = response.user
        const splitname = name ? name.split(' ') : []
        
        updateFormData({
          firstName: splitname[0] || '',
          lastName: splitname[splitname.length - 1] || '',
          middleName: splitname.length > 2 ? splitname.slice(1, -1).join(' ') : '',
          email: email || '',
        })
        
        nextStep()
      } else {
        throw new Error("Failed to get user data from Google Sign-In")
      }
    } catch (error) {
      console.error("Google signup failed:", error)
      toast({
        title: "Google Sign-Up Failed",
        description: "An error occurred during Google sign-up. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">Personal Information</h2>
        <p className="text-muted-foreground text-center">Please provide your details</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Title</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="M." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="john.doe@example.com" />
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
                  <Input {...field} type="tel" placeholder="+1 (555) 000-0000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Next'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Signing up...
          </div>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign up with Google
          </>
        )}
      </Button>
    </div>
  )
}

