import { UseFormRegister, FieldErrors } from "react-hook-form";
import { OnboardingData } from "@/lib/schema";

interface Props {
  register: UseFormRegister<OnboardingData>;
  errors: FieldErrors<OnboardingData>;
}

export function Step1PersonalInfo({ register, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Personal Information</h2>
        <p className="mt-1 text-sm text-zinc-500">Tell us a bit about yourself.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            {...register("name")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="jane@example.com"
            {...register("email")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
