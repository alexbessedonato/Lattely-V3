"use server";

import { refresh } from "next/cache";
import { closeShop } from "@/lib/admin/close-shop";
import { parseCoordinates } from "@/lib/admin/coordinates";
import { getAdmin } from "@/lib/admin/get-admin";
import {
  approveSubmission,
  rejectSubmission,
} from "@/lib/admin/review-submissions";
import type { ApproveState } from "@/lib/admin/types/approve-state";

// Server Actions can be called by anyone, not just from /admin, so each one checks for an Admin itself.
async function refuseNonAdmins() {
  if (!(await getAdmin())) throw new Error("Only Admins can do this.");
}

// The Approve button posts here. shopId is bound on the page; useActionState passes in the last state first.
export async function approveAction(
  shopId: number,
  _previous: ApproveState,
  formData: FormData,
): Promise<ApproveState> {
  await refuseNonAdmins();

  const coordinates = String(formData.get("coordinates") ?? "");
  const location = parseCoordinates(coordinates);
  if (!location) {
    return {
      coordinates,
      error: "Paste the latitude and longitude, like 41.3851, 2.1734.",
    };
  }

  await approveSubmission(shopId, location);
  refresh(); // rebuild /admin so the Shop leaves the list
  return { coordinates: "" };
}

// The Reject button posts here.
export async function rejectAction(shopId: number) {
  await refuseNonAdmins();
  await rejectSubmission(shopId);
  refresh();
}

// The Close button next to a live Shop posts here.
export async function closeAction(shopId: number) {
  await refuseNonAdmins();
  await closeShop(shopId);
  refresh(); // rebuild /admin so the Shop leaves the Live shops list
}
