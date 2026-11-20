"use server";

import { refresh } from "next/cache";
import { parseCoordinates } from "@/lib/admin/coordinates";
import { refuseNonAdmins } from "@/lib/admin/get-admin";
import { approveSubmission } from "@/lib/admin/submissions";
import type { ApproveState } from "@/lib/admin/types/approve-state";

// The Approve button posts here. submissionId is bound on the page; useActionState passes in the last state first.
export async function approveSubmissionAction(
  submissionId: number,
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

  const removePhoto = formData.get("removePhoto") === "on"; // a ticked checkbox sends "on"; unticked sends nothing
  await approveSubmission(submissionId, location, removePhoto);
  refresh(); // rebuild /admin so the Submission leaves the list
  return { coordinates: "" };
}
