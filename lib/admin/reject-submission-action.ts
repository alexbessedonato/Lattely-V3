"use server";

import { refresh } from "next/cache";
import { refuseNonAdmins } from "@/lib/admin/get-admin";
import { rejectSubmission } from "@/lib/admin/submissions";
import { deletePhoto } from "@/lib/photo/photo-bucket";

// The Reject button posts here. submissionId is bound on the page.
export async function rejectSubmissionAction(submissionId: number) {
  await refuseNonAdmins();
  const photoKey = await rejectSubmission(submissionId);
  // After the database: if this fails, a photo nothing points at stays in the bucket, which is harmless.
  if (photoKey) await deletePhoto(photoKey);
  refresh(); // rebuild /admin so the Submission leaves the list
}
