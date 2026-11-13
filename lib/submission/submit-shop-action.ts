"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getMember } from "@/lib/auth/auth-server";
import { submissionSchema } from "@/lib/submission/submission-schema";
import { submitShop } from "@/lib/submission/submit-shop";
import type { SubmitShopState } from "@/lib/submission/types/submit-shop-state";

// A Server Action: the /submit form posts here. useActionState passes in the last state first.
export async function submitShopAction(
  _previous: SubmitShopState,
  formData: FormData,
): Promise<SubmitShopState> {
  const member = await getMember();
  if (!member) redirect("/sign-in?next=/submit"); // only Members can submit

  const values = {
    name: String(formData.get("name") ?? ""),
    address: String(formData.get("address") ?? ""),
    instagramOrWebsite: String(formData.get("instagramOrWebsite") ?? ""),
  };

  const result = submissionSchema.safeParse(values);
  if (!result.success) {
    return { values, errors: z.flattenError(result.error).fieldErrors };
  }

  const refusal = await submitShop(member, result.data); // result.data is Zod's tidied version
  if (refusal) return { values, errors: { form: [refusal] } };

  redirect("/my-submissions?submitted=1"); // shows "Thanks! We'll check it soon."
}
