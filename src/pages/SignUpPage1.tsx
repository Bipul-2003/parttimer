'use client'

import { SignupStep1 } from '@/components/SignUp/SignupStep1'
import { SignupStep2 } from '@/components/SignUp/SignupStep2'
import { SignupStep3 } from '@/components/SignUp/SignupStep3'
import { SignupData } from '@/lib/validations/signup'
import { useEffect, useState } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { signup } from '@/api/auth'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SignupPage1() {
  const [step, setStep] = useState(3)
  const [formData, setFormData] = useState<Partial<SignupData> & { document?: File }>({})
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { firstName, lastName, middleName, email } = location.state;

      const updateData: Partial<SignupData> = {
        firstName,
        lastName,
        email,
      };

      if (middleName) {
        updateData.middleName = middleName;
      }

      updateFormData(updateData);

      setStep(2);
    }
  }, [location]);

  const updateFormData = (data: Partial<SignupData> & { document?: File }) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const completeSignup = async () => {
    try {
      const signupData = {
        namePrefix: formData.title,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipcode: formData.zipCode,
        docsVerified: formData.docsVerified || false,
        typeOfVerificationFile: formData.typeOfVerificationFile,
      }

      const response = await signup(signupData)
      
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
          {step === 2 && <SignupStep2 formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />}
          {step === 3 && <SignupStep3 formData={formData} updateFormData={updateFormData} prevStep={prevStep} completeSignup={completeSignup} />}
        </div>
      </div>
      <Toaster />
    </div>
  )
}

