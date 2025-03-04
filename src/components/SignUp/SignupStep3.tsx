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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SignupData, normalUserSchema } from '@/lib/validations/signup'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate } from 'react-router-dom';

type SignupStep3Props = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData>) => void
  prevStep: () => void
  completeSignup: () => Promise<void>
}

interface VerificationResponse {
  name_verified: boolean;
  city_verified: boolean;
  zipcode_verified: boolean;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "application/pdf"];

const step3Schema = normalUserSchema.pick({
  typeOfVerificationFile: true,
  consentAccepted: true,
}).extend({
  document: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than 1MB`)
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only JPG, JPEG, or PDF files are allowed"
    ),
});

export function SignupStep3({ formData, updateFormData, prevStep, completeSignup }: SignupStep3Props) {
  const [fileError, setFileError] = useState<string | JSX.Element | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCompletingSignup, setIsCompletingSignup] = useState(false);
  const router =  useNavigate();

  useEffect(() => {
    if (formData.userType === 'LABOUR') {
      router('/signup');
    }
  }, [formData.userType, router]);

  const form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      typeOfVerificationFile: (formData as any).typeOfVerificationFile,
      consentAccepted: (formData as any).consentAccepted || false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('document', file, { shouldValidate: true });
      setFileError(null);
      setIsVerified(false); // Reset verification status when file changes
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setFileError(null);
    
    const file = form.getValues('document');
    if (!file) {
      setFileError('No file selected');
      setIsVerifying(false);
      return;
    }

    const verificationFormData = new FormData();
    const name = `${formData.firstName || ''}${formData.middleName ? ' ' + formData.middleName : ''}${formData.lastName ? ' ' + formData.lastName : ''}`.trim();
    verificationFormData.append('name', name);
    verificationFormData.append('city', (formData as any).city || '');
    verificationFormData.append('zipcode', (formData as any).zipCode || '');
    verificationFormData.append('verifyfile', file);

    try {
      const response = await axios.post<VerificationResponse>(
        'https://python-ocr-verification.onrender.com/verify',
        verificationFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },

      );

      if (response.data.name_verified && response.data.city_verified && response.data.zipcode_verified) {
        setIsVerified(true);
        updateFormData({ docsVerified: true });
        setFileError(
          <Alert>
            <AlertTitle>Verification Successful</AlertTitle>
            <AlertDescription>Your document has been verified successfully.</AlertDescription>
          </Alert>
        );
      } else {
        let errorMessage = "Verification failed. The following information did not match:";
        if (!response.data.name_verified) errorMessage += " Name,";
        if (!response.data.city_verified) errorMessage += " City,";
        if (!response.data.zipcode_verified) errorMessage += " Zipcode,";
        errorMessage = errorMessage.slice(0, -1); // Remove trailing comma
        setFileError(
          <Alert variant="destructive">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        );
      }
    } catch (error) {
      console.error('Verification error:', error);
      let errorMessage = 'An unexpected error occurred';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 'Document verification failed';
      }
      setFileError(
        <Alert variant="destructive">
          <AlertTitle>Verification Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteSignup = async () => {
    try {
      setIsCompletingSignup(true);
      await completeSignup();
    } catch (error) {
      console.error('Signup completion error:', error);
      setFileError(
        <Alert variant="destructive">
          <AlertTitle>Signup Error</AlertTitle>
          <AlertDescription>Failed to complete signup. Please try again.</AlertDescription>
        </Alert>
      );
    } finally {
      setIsCompletingSignup(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof step3Schema>) => {
    updateFormData({ 
      typeOfVerificationFile: values.typeOfVerificationFile,
      consentAccepted: values.consentAccepted,
    } as Partial<SignupData>);
    await handleVerify();
  };

  if (formData.userType === 'LABOUR') {
    return null; // This will prevent rendering anything for LABOUR users
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">Document Upload & Verification</h2>
          <p className="text-sm text-muted-foreground text-center">
            Please upload a valid document to verify your identity.
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="typeOfVerificationFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Verification Document</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driverLicense">Driver's License</SelectItem>
                  <SelectItem value="nationalId">National ID</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="document"
          render={({ field: { onChange, ...rest } }) => (
            <FormItem>
              <FormLabel>Upload Document</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.pdf"
                  onChange={(e) => {
                    handleFileChange(e);
                    onChange(e.target.files?.[0]);
                  }}
                  disabled={isVerified || isVerifying}
                  {...rest}
                  value={undefined}
                />
              </FormControl>
              {typeof fileError === 'string' && <p className="text-sm text-destructive">{fileError}</p>}
              {typeof fileError !== 'string' && fileError}
              <FormMessage />
              <p className="text-xs text-muted-foreground">Only JPG, JPEG, or PDF files less than 1MB are accepted.</p>
            </FormItem>
          )}
        />
        
        {form.watch('document') && (
          <p className="text-sm text-primary">
            File uploaded: {form.watch('document').name}
          </p>
        )}
        
        <FormField
          control={form.control}
          name="consentAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the terms and conditions
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  By uploading the document, you are accepting our terms and conditions. We are not storing your personal data.
                </p>
              </div>
            </FormItem>
          )}
        />
        
        {!isVerified ? (
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!form.formState.isValid || isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Document...
              </>
            ) : (
              'Verify Document'
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-primary">Verification successful!</p>
            <Button 
              onClick={handleCompleteSignup} 
              className="w-full"
              disabled={isCompletingSignup}
            >
              {isCompletingSignup ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Signup...
                </>
              ) : (
                'Complete Signup'
              )}
            </Button>
          </div>
        )}
        
        <Button 
          onClick={prevStep} 
          variant="outline" 
          className="w-full"
          disabled={isVerifying || isCompletingSignup}
        >
          Back
        </Button>
      </form>
    </Form>
  )
}

