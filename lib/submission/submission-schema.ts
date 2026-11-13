import { z } from "zod";

// What a Member types into /submit. Zod checks it on the server, where it can't be skipped.
export const submissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Add the shop's name.")
    .max(100, "Keep the name under 100 characters."),
  address: z
    .string()
    .trim()
    .min(1, "Add the street and number so we can find it.")
    .max(200, "Keep the address under 200 characters."),
  // Optional: an empty field becomes null, anything else must be a full http(s) link.
  instagramOrWebsite: z
    .string()
    .trim()
    .refine(
      (link) => link === "" || /^https?:\/\/[^\s/]+\.[^\s]+$/.test(link),
      "Paste the full link, starting with https://",
    )
    .transform((link) => link || null),
});
