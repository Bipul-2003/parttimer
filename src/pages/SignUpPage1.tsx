import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { SignupStep1 } from '@/components/SignUp/SignupStep1'
import { SignupStep2 } from '@/components/SignUp/SignupStep2'
import { SignupStep3 } from '@/components/SignUp/SignupStep3'
import { UserTypeSelection } from '@/components/SignUp/UserTypeSelection'
import { WorkerCitySelection } from '@/components/SignUp/WorkerCitySelection'
import { SignupData, workerSchema, normalUserSchema } from '@/lib/validations/signup'
import { signup } from '@/api/auth'
import config from '@/config/config'
import { z } from 'zod'

type FormDataState = Partial<SignupData>

export default function SignupPage1() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormDataState>({})
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state) {
      const { firstName, lastName, middleName, email } = location.state

      const updateData: FormDataState = {
        firstName,
        lastName,
        email,
      }

      if (middleName) {
        updateData.middleName = middleName
      }

      updateFormData(updateData)
      setStep(2)
    }
  }, [location])

  const updateFormData = useCallback((data: Partial<SignupData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const nextStep = useCallback(() => setStep((prev) => prev + 1), [])
  const prevStep = useCallback(() => setStep((prev) => prev - 1), [])

  const regularSignup = useCallback(async (data: SignupData) => {
    try {
      const parsedData = normalUserSchema.parse(data)
      const response = await signup(parsedData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Signup failed')
      } else {
        throw new Error('An unexpected error occurred during signup')
      }
    }
  }, [])

  const laborSignup = useCallback(async () => {
    if (!formData.userType || formData.userType !== 'LABOUR') {
      throw new Error('Invalid user type')
    }

    try {
      const laborData = {
        ...formData,
        isRideNeeded: false,
        subscriptionStatus: 'BASIC'
      }

      // Validate the data against the worker schema
      const parsedData = workerSchema.parse(laborData)
      console.log( parsedData);
      
      const response = await axios.post(
        `${config.apiURI}/api/auth/labour/sign-up`,
        parsedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Labor signup error:', error);
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
      }
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message ||
                           error.response?.data ||
                           'Labor signup failed'
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage))
      } else {
        throw new Error('An unexpected error occurred during labor signup')
      }
    }
  }, [formData])

  const completeSignup = useCallback(async () => {
    try {
      if (formData.userType === 'LABOUR') {
        await laborSignup()
      } else if (formData.userType === 'REGULAR') {
        await regularSignup(formData as SignupData)
      } else {
        throw new Error('Invalid user type')
      }
      
      toast({
        title: "Signup Successful",
        description: "Your account has been created successfully.",
        variant: "default",
      })

      navigate('/login')
    } catch (error) {
      console.error('Signup failed:', error)
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }, [formData, laborSignup, regularSignup, toast, navigate])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 && `Create your account`}
          {step === 2 && `Select account type`}
          {step === 3 && formData.userType === 'LABOUR' && `Select your cities`}
          {step === 3 && formData.userType === 'REGULAR' && `Location Information`}
          {step === 4 && `Document Upload & Verification`}
        </h2>
        {step === 1 && <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </a>
        </p>}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 && <SignupStep1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} />}
          {step === 2 && <UserTypeSelection formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
          {step === 3 && formData.userType === 'LABOUR' && (
            <WorkerCitySelection 
              formData={formData} 
              updateFormData={updateFormData}
              completeSignup={completeSignup} 
              prevStep={prevStep} 
            />
          )}
          {step === 3 && formData.userType === 'REGULAR' && (
            <SignupStep2 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />
          )}
          {step === 4 && formData.userType === 'REGULAR' && (
            <SignupStep3 formData={formData} updateFormData={updateFormData} prevStep={prevStep} completeSignup={completeSignup} />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  )
}

