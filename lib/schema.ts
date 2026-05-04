import { z } from "zod";

export const step1Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
});

export const step2Schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  websiteUrl: z.url("Enter a valid URL"),
});

export const PLANS = ["free", "starter", "pro", "enterprise"] as const;
export type Plan = (typeof PLANS)[number];

export const step3Schema = z.object({
  plan: z.enum(PLANS, { error: "Please select a plan" }),
});

export const onboardingSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;
