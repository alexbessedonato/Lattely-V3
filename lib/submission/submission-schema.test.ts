import { expect, test } from "vitest";
import { submissionSchema } from "@/lib/submission/submission-schema";

test("trims the text and turns an empty link into null", () => {
  expect(
    submissionSchema.parse({
      name: "  Nomad Coffee ",
      address: " Passatge Sert 12 ",
      instagramOrWebsite: "  ",
    }),
  ).toEqual({
    name: "Nomad Coffee",
    address: "Passatge Sert 12",
    instagramOrWebsite: null,
  });
});

test("keeps a full http(s) link", () => {
  const link = "https://instagram.com/nomadcoffee";
  expect(
    submissionSchema.parse({
      name: "Nomad",
      address: "Sert 12",
      instagramOrWebsite: link,
    }).instagramOrWebsite,
  ).toBe(link);
});

test("refuses a blank name or address, and a link that isn't a full URL", () => {
  const result = submissionSchema.safeParse({
    name: " ",
    address: "",
    instagramOrWebsite: "instagram.com/nomad",
  });
  expect(result.success).toBe(false);
  expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
    "name",
    "address",
    "instagramOrWebsite",
  ]);
});
