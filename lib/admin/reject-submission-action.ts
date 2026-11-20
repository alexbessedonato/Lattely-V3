"use server";

import { refresh } from "next/cache";
import { refuseNonAdmins } from "@/lib/admin/get-admin";
import { rejectSubmission } from "@/lib/admin/submissions";

// The Reject button posts here. submissionId is bound on the page.
export async function rejectSubmissionAction(submissionId: number) {
  await refuseNonAdmins();
  await rejectSubmission(submissionId); // also deletes its photo
  refresh(); // rebuild /admin so the Submission leaves the list
}
