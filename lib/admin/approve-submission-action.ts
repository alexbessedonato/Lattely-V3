"use server";

import { refresh } from "next/cache";
import { parseCoordinates } from "@/lib/admin/coordinates";
import { refuseNonAdmins } from "@/lib/admin/get-admin";
import { approveSubmission } from "@/lib/admin/submissions";
import type { ApproveState } from "@/lib/admin/types/approve-state";
import { preparePhoto } from "@/lib/photo/prepare-photo";
import { uploadPhoto } from "@/lib/photo/upload-photo";

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

  // The photo is optional: with no file chosen, the browser still sends an empty one.
  const photo = formData.get("photo");
  let photoKey = null;
  if (photo instanceof File && photo.size > 0) {
    let webp;
    try {
      webp = await preparePhoto(photo);
    } catch {
      return {
        coordinates,
        photoError: "That file isn't a photo. Try a JPEG, PNG or WebP.",
      };
    }
    photoKey = await uploadPhoto(webp);
  }

  await approveSubmission(submissionId, location, photoKey);
  refresh(); // rebuild /admin so the Submission leaves the list
  return { coordinates: "" };
}
