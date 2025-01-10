import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'

type SignupStep3Props = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData>) => void
  prevStep: () => void
  completeSignup: () => void
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "application/pdf"];

const step3Schema = normalUserSchema.pick({
  typeOfVerificationFile: true,
  consentAccepted: true,
  zipCode: true,
}).extend({
  document: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than 1MB`)
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only JPG, JPEG, or PDF files are allowed"
    ),
});

export function SignupStep3({ formData, updateFormData, prevStep, completeSignup }: SignupStep3Props) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      typeOfVerificationFile: formData.userType === 'REGULAR' ? (formData as any).typeOfVerificationFile : undefined,
      consentAccepted: (formData as any).consentAccepted || false,
      zipCode: formData.userType === 'REGULAR' ? formData.zipCode : '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('document', file, { shouldValidate: true });
      setFileError(null);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    const file = form.getValues('document');
    if (!file) {
      setFileError('No file selected');
      setIsVerifying(false);
      return;
    }

    const verificationFormData = new FormData();
    const name = `${formData.firstName || ''}${formData.middleName ? ' ' + formData.middleName : ''}${formData.lastName ? ' ' + formData.lastName : ''}`.trim();
    verificationFormData.append('name', name);
    if (formData.userType === 'REGULAR') {
      verificationFormData.append('city', formData.city || '');
      verificationFormData.append('zipcode', form.getValues('zipCode') || '');
    }
    verificationFormData.append('verifyfile', file);

    try {
      // Simulating verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsVerified(true);
      updateFormData({ docsVerified: true });
      toast({
        title: "Verification Successful",
        description: "Your document has been verified successfully.",
        variant: "default",
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFileError(error.response?.data?.message || 'Document verification failed');
      } else {
        setFileError('An unexpected error occurred');
      }
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof step3Schema>) => {
    if (formData.userType === 'REGULAR') {
      updateFormData({ 
        typeOfVerificationFile: values.typeOfVerificationFile,
        consentAccepted: values.consentAccepted,
        zipCode: values.zipCode,
      } as Partial<SignupData>);
    } else {
      updateFormData({ 
        consentAccepted: values.consentAccepted,
      } as Partial<SignupData>);
    }
    await handleVerify();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">Document Upload & Verification</h2>
          <p className="text-sm text-muted-foreground text-center">
            Please upload a valid document to verify your identity.
          </p>
        </div>
        
        {formData.userType === 'REGULAR' && (
          <>
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
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter zip code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
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
                  disabled={isVerified}
                  {...rest}
                  value={undefined}
                />
              </FormControl>
              {fileError && <p className="text-sm text-destructive">{fileError}</p>}
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
                Verifying
              </>
            ) : (
              'Verify Document'
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-primary">Verification successful!</p>
            <Button onClick={completeSignup} className="w-full">
              Complete Signup
            </Button>
          </div>
        )}
        
        <Button onClick={prevStep} variant="outline" className="w-full">
          Back
        </Button>
      </form>
    </Form>
  )
}

