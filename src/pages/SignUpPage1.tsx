import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { SignupStep1 } from '@/components/SignUp/SignupStep1'
import { SignupStep2 } from '@/components/SignUp/SignupStep2'
import { SignupStep3 } from '@/components/SignUp/SignupStep3'
import { UserTypeSelection } from '@/components/SignUp/UserTypeSelection'
import { WorkerCitySelection } from '@/components/SignUp/WorkerCitySelection'
import { SignupData } from '@/lib/validations/signup'
import { signup } from '@/api/auth'

export default function SignupPage1() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<SignupData & { serviceCities?: string[] }>>({})
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state) {
      const { firstName, lastName, middleName, email } = location.state

      const updateData: Partial<SignupData> = {
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

  const updateFormData = (data: Partial<SignupData & { serviceCities?: string[] }>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const regularSignup = async (data: SignupData) => {
    try {
      const response = await signup(data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Signup failed')
      } else {
        throw new Error('An unexpected error occurred during signup')
      }
    }
  }

  const laborSignup = async () => {
    const laborData = {
      ...formData,
      serviceCities: formData.serviceCities || [],
      isRideNeeded: false,
      subscriptionStatus: 'BASIC'
    }
    console.log("Labor signup data:", laborData)

    try {
      const response = await axios.post('http://localhost:8080/api/auth/labour/sign-up', laborData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Properly extract the error message from the backend response
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message ||
                           error.response?.data ||
                           'Labor signup failed'
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage))
      } else {
        throw new Error('An unexpected error occurred during labor signup')
      }
    }
  }

  const completeSignup = async () => {
    try {
      let response
      if (formData.userType === 'LABOUR') {
        response = await laborSignup()
      } else {
        response = await regularSignup(formData as SignupData)
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
  }

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
              updateFormData={(data) => {
                updateFormData({
                  ...data,
                  serviceCities: data.cities
                })
              }}
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