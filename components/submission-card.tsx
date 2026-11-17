"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { approveSubmissionAction } from "@/lib/admin/approve-submission-action";
import { rejectSubmissionAction } from "@/lib/admin/reject-submission-action";

type Props = {
  submission: {
    id: number;
    name: string;
    address: string;
    instagramOrWebsite: string | null;
  };
  photoUrl: string | null; // the Member's photo, if they sent one
};

// One pending Submission on /admin: Approve needs its coordinates and can drop the photo, Reject doesn't.
export function SubmissionCard({ submission, photoUrl }: Props) {
  const [state, approve, approving] = useActionState(
    approveSubmissionAction.bind(null, submission.id),
    { coordinates: "" },
  );
  const inputId = `coordinates-${submission.id}`;

  return (
    <form
      action={approve}
      className="flex flex-col gap-3.5 rounded-3xl border border-latte bg-paper p-4.5"
    >
      {photoUrl && (
        <div className="relative h-44 overflow-hidden rounded-2xl">
          <Image
            src={photoUrl}
            alt={`Photo sent with ${submission.name}`}
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-[17px] font-bold">{submission.name}</span>

        <span className="text-sm text-mocha">{submission.address}</span>

        {submission.instagramOrWebsite && (
          <a
            href={submission.instagramOrWebsite}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold break-all underline"
          >
            {submission.instagramOrWebsite}
          </a>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId} className="font-semibold">
          Coordinates
        </Label>

        <Input
          id={inputId}
          name="coordinates"
          placeholder="41.3851, 2.1734"
          defaultValue={state.coordinates}
          aria-invalid={Boolean(state.error)}
          aria-describedby={`${inputId}-help`}
          className="h-12 rounded-2xl bg-cream px-3.5 md:text-base"
        />

        <p
          id={`${inputId}-help`}
          className={
            state.error
              ? "text-sm font-semibold text-destructive"
              : "text-[13px] text-mocha"
          }
        >
          {state.error ??
            "In Google Maps, right-click the shop and copy the numbers."}
        </p>
      </div>

      {photoUrl && (
        <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            name="removePhoto"
            className="size-5 accent-espresso"
          />
          Remove photo (the shop gets a drawing instead)
        </label>
      )}

      <div className="flex gap-2.5">
        <Button
          type="submit"
          disabled={approving}
          className="h-12 flex-1 rounded-full text-[15px] font-bold"
        >
          {approving ? "Approving…" : "Approve"}
        </Button>

        {/* formAction sends this form to rejectSubmissionAction instead, so the coordinates are ignored. */}
        <Button
          type="submit"
          variant="outline"
          formAction={rejectSubmissionAction.bind(null, submission.id)}
          className="h-12 flex-1 rounded-full text-[15px] font-semibold"
        >
          Reject
        </Button>
      </div>
    </form>
  );
}
