// import * as z from "zod"

// export const signupSchema = z.object({
//   title: z.enum(["mr", "mrs", "ms", "dr"]).optional(),
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   middleName: z.string().optional(),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
//   password: z.string().min(8, "Password must be at least 8 characters").optional(),
//   email: z.string().email("Invalid email address"),
//   country: z.string().min(1, "Country is required"),
//   state: z.string().min(1, "State is required"),
//   city: z.string().min(1, "City is required"),
//   zipCode: z.string().min(1, "Zip code is required"),
//   docsVerified: z.boolean().optional(),
// })

// export type SignupData = z.infer<typeof signupSchema>


import * as z from "zod"

export const signupSchema = z.object({
  title: z.enum(["mr", "mrs", "ms", "dr"]).optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  docsVerified: z.boolean().optional(),
  typeOfVerificationFile: z.enum(["passport", "driverLicense", "nationalId"]).optional(),
  consentAccepted: z.boolean().default(false),
  userType: z.enum(["REGULAR", "LABOUR"]),
  serviceCities: z.array(z.string()).min(1).max(3).optional(),
})

export type SignupData = z.infer<typeof signupSchema>




