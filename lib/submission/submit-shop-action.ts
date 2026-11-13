"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getMember } from "@/lib/auth/auth-server";
import { submissionSchema } from "@/lib/submission/submission-schema";
import type { SubmitShopState } from "@/lib/submission/types/submit-shop-state";

// A Server Action: the /submit form posts here. useActionState passes in the last state first.
export async function submitShopAction(
  _previous: SubmitShopState,
  formData: FormData,
): Promise<SubmitShopState> {
  const member = await getMember();
  if (!member) redirect("/sign-in"); // only Members can submit

  const values = {
    name: String(formData.get("name") ?? ""),
    address: String(formData.get("address") ?? ""),
    instagramOrWebsite: String(formData.get("instagramOrWebsite") ?? ""),
  };

  const result = submissionSchema.safeParse(values);
  if (!result.success) {
    return { values, errors: z.flattenError(result.error).fieldErrors };
  }

  // shortcut: checkpoint 2 only validates; checkpoint 3 saves it with submitShop and goes to My submissions.
  return { values, errors: {} };
}
