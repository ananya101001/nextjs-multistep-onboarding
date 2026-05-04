import { UseFormRegister, FieldErrors } from "react-hook-form";
import { OnboardingData } from "@/lib/schema";

interface Props {
  register: UseFormRegister<OnboardingData>;
  errors: FieldErrors<OnboardingData>;
}

export function Step2CompanyDetails({ register, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Company Details</h2>
        <p className="mt-1 text-sm text-zinc-500">Help us understand your organization.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="companyName" className="text-sm font-medium text-zinc-700">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            placeholder="Acme Inc."
            {...register("companyName")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          {errors.companyName && (
            <p className="text-xs text-red-500">{errors.companyName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="websiteUrl" className="text-sm font-medium text-zinc-700">
            Website URL
          </label>
          <input
            id="websiteUrl"
            type="url"
            placeholder="https://acme.com"
            {...register("websiteUrl")}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          />
          {errors.websiteUrl && (
            <p className="text-xs text-red-500">{errors.websiteUrl.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
