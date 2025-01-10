import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupData } from "../../lib/validations/signup";

type SignupStep2Props = {
  formData: Partial<SignupData>;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const step2Schema = z.object({
  userType: z.enum(["REGULAR", "LABOUR"], {
    required_error: "Please select a user type",
  }),
});

export function SignupStep2({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: SignupStep2Props) {
  const form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      userType: formData.userType || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof step2Schema>) {
    updateFormData(values);
    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            Confirm User Type
          </h2>
          <p className="text-muted-foreground text-center">
            Please confirm your user type
          </p>
        </div>
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular User</SelectItem>
                  <SelectItem value="LABOUR">Worker</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" onClick={prevStep} variant="outline">
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}

