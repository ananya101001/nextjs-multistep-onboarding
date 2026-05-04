"use client";

import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { onboardingSchema, OnboardingData } from "@/lib/schema";
import { useFormPersistence } from "@/lib/hooks/useFormPersistence";
import { submitToHubSpot } from "@/app/actions";
import { Step1PersonalInfo } from "./steps/Step1PersonalInfo";
import { Step2CompanyDetails } from "./steps/Step2CompanyDetails";
import { Step3PlanSelection } from "./steps/Step3PlanSelection";

const TOTAL_STEPS = 3;
const STEP_LABELS = ["Personal Info", "Company Details", "Plan Selection"];

const STEP_FIELDS: Record<number, (keyof OnboardingData)[]> = {
  1: ["name", "email"],
  2: ["companyName", "websiteUrl"],
  3: ["plan"],
};

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      websiteUrl: "",
      plan: undefined,
    },
  });

  useFormPersistence(form, "onboarding-progress");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const selectedPlan = watch("plan");

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as (keyof OnboardingData)[]);
    if (valid) setStep((s) => s + 1);
  };

  const handlePrev = () => setStep((s) => s - 1);

  const onSubmit = async (data: OnboardingData) => {
    await submitToHubSpot(data);
    localStorage.removeItem("onboarding-progress");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">You're all set!</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Your onboarding is complete. Welcome aboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      {/* Step indicator */}
      <div className="flex items-start">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const isComplete = step > n;
          const isActive = step === n;
          return (
            <Fragment key={n}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isActive || isComplete
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {isComplete ? "✓" : n}
                </div>
                <span
                  className={`whitespace-nowrap text-xs font-medium ${
                    isActive ? "text-zinc-900" : "text-zinc-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < TOTAL_STEPS - 1 && (
                <div
                  className={`mt-4 h-px flex-1 transition-colors ${
                    step > n ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Active step */}
      <div className="min-h-56">
        {step === 1 && <Step1PersonalInfo register={register} errors={errors} />}
        {step === 2 && <Step2CompanyDetails register={register} errors={errors} />}
        {step === 3 && (
          <Step3PlanSelection
            register={register}
            errors={errors}
            selectedPlan={selectedPlan}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
          >
            Previous
          </button>
        ) : (
          <div />
        )}
        {step < TOTAL_STEPS && (
          <button
            type="button"
            onClick={handleNext}
            className="flex h-10 items-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 active:bg-zinc-800"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}
