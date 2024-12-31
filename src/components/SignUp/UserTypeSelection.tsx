import { Button } from "@/components/ui/button"
import { SignupData } from "@/lib/validations/signup"

type UserTypeSelectionProps = {
  formData: Partial<SignupData>
  updateFormData: (data: Partial<SignupData>) => void
  nextStep: () => void
  prevStep: () => void
}

export function UserTypeSelection({  updateFormData, nextStep, prevStep }: UserTypeSelectionProps) {
  const handleSelection = (userType: 'REGULAR' | 'LABOUR') => {
    updateFormData({ userType })
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">Choose Account Type</h2>
        <p className="text-muted-foreground text-center">Select whether you want to be a user or a worker</p>
      </div>
      <div className="flex flex-col space-y-4">
        <Button onClick={() => handleSelection('REGULAR')} className="w-full">
          I want to be a User
        </Button>
        <Button onClick={() => handleSelection('LABOUR')} className="w-full">
          I want to be a Worker
        </Button>
      </div>
      <Button onClick={prevStep} variant="outline" className="w-full">
        Back
      </Button>
    </div>
  )
}

