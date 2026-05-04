import { z } from "zod";

export const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
});

export const step2Schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const step3Schema = z.object({
  role: z.enum(["developer", "designer", "manager", "other"], {
    required_error: "Please select a role",
  }),
  goals: z.array(z.string()).min(1, "Select at least one goal"),
  newsletter: z.boolean(),
});

export const onboardingSchema = step1Schema.merge(step2Schema.omit({ confirmPassword: true })).merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;
