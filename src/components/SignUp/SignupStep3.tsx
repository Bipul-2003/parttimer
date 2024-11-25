'use client'

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
import { SignupData } from '../../lib/validations/signup'
import { Loader2 } from 'lucide-react'

type SignupStep3Props = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData> & { document?: File }) => void
  prevStep: () => void
  completeSignup: () => void
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "application/pdf"];

const step3Schema = z.object({
  document: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 1MB`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only JPG, JPEG, or PDF files are allowed"
    )
});

export function SignupStep3({ formData, updateFormData, prevStep, completeSignup }: SignupStep3Props) {
  const [fileError, setFileError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const form = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        step3Schema.parse({ document: file });
        form.setValue('document', file);
        setFileError(null);
      } catch (error) {
        if (error instanceof z.ZodError) {
          setFileError(error.errors[0].message);
        }
      }
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulated verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsVerifying(false);
    setIsVerified(true);
  };

  const onSubmit = async (values: z.infer<typeof step3Schema>) => {
    updateFormData({ document: values.document });
    await handleVerify();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">Document Upload & Verification</h2>
          <p className="text-sm text-muted-foreground text-center">
            Please upload a valid document to verify your community membership.
          </p>
        </div>
        
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Document</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                  disabled={isVerified}
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
        
        {!isVerified ? (
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!form.watch('document') || isVerifying}
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

