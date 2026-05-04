import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-100">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Get started
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Complete the steps below to set up your account.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
