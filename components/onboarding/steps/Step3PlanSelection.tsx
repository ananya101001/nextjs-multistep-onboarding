import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Check } from "lucide-react";
import { OnboardingData, Plan, PLANS } from "@/lib/schema";

interface Props {
  register: UseFormRegister<OnboardingData>;
  errors: FieldErrors<OnboardingData>;
  selectedPlan: Plan | undefined;
  isSubmitting: boolean;
}

const PLAN_DETAILS: Record<Plan, { label: string; price: string; description: string }> = {
  free: { label: "Free", price: "$0 / mo", description: "For individuals getting started" },
  starter: { label: "Starter", price: "$9 / mo", description: "For freelancers and solo builders" },
  pro: { label: "Pro", price: "$29 / mo", description: "For growing teams" },
  enterprise: { label: "Enterprise", price: "$99 / mo", description: "For large organizations" },
};

export function Step3PlanSelection({ register, errors, selectedPlan, isSubmitting }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Choose a Plan</h2>
        <p className="mt-1 text-sm text-zinc-500">Select the plan that fits your needs.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PLANS.map((plan) => {
          const { label, price, description } = PLAN_DETAILS[plan];
          const isSelected = selectedPlan === plan;
          return (
            <label
              key={plan}
              className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors ${
                isSelected
                  ? "border-zinc-900 bg-zinc-50 shadow-sm"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <input
                type="radio"
                value={plan}
                {...register("plan")}
                className="sr-only"
              />
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              )}
              <span className="text-sm font-semibold text-zinc-900">{label}</span>
              <span className="text-base font-bold text-zinc-900">{price}</span>
              <span className="text-xs text-zinc-500">{description}</span>
            </label>
          );
        })}
      </div>
      {errors.plan && (
        <p className="text-xs text-red-500">{errors.plan.message}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 active:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Submitting…" : "Complete Onboarding"}
      </button>
    </div>
  );
}
