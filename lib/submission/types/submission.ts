import type { z } from "zod";
import type { submissionSchema } from "@/lib/submission/submission-schema";

// A Submission after Zod has checked and tidied it.
export type Submission = z.infer<typeof submissionSchema>;
