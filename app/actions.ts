"use server";

import { OnboardingData } from "@/lib/schema";

export async function submitToHubSpot(
  data: OnboardingData
): Promise<{ success: true }> {
  await new Promise<void>((res) => setTimeout(res, 1500));
  console.log("HubSpot submission payload:\n" + JSON.stringify(data, null, 2));
  return { success: true };
}
