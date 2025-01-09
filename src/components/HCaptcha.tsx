import HCaptcha from '@hcaptcha/react-hcaptcha'

interface HCaptchaProps {
  onVerify: (token: string) => void
}

export function HCaptchaComponent({ onVerify }: HCaptchaProps) {
  return (
    <HCaptcha
      sitekey={'50b2fe65-b00b-4b9e-ad62-3ba471098be2' || ''}
      onVerify={onVerify}
    />
  )
}

