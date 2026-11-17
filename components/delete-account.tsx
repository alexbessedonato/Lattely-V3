"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteMemberAction } from "@/lib/member/delete-member-action";

const pillLook = "h-12 rounded-full px-5 text-[15px]";

// The Delete account card. The first tap only asks "are you sure?"; "Yes, delete it" does it.
export function DeleteAccount() {
  const [confirming, setConfirming] = useState(false);
  const [deleting, startDeleting] = useTransition();

  return (
    <section
      aria-labelledby="delete-heading"
      className="mt-2 flex flex-col items-start gap-3 rounded-3xl border border-latte bg-paper px-5.5 py-6"
    >
      <h2
        id="delete-heading"
        className="font-heading text-[22px] font-semibold"
      >
        {confirming ? "Delete your account?" : "Delete account"}
      </h2>

      <p className="leading-normal text-mocha">
        {confirming
          ? "This can't be undone. Your Ratings go with it."
          : "Your account and all your Ratings are removed, and the Ranking updates without them."}
      </p>

      {confirming ? (
        <div className="flex flex-wrap gap-2.5">
          <Button
            disabled={deleting}
            onClick={() => startDeleting(() => deleteMemberAction())}
            className={`${pillLook} bg-clay font-bold text-paper hover:bg-clay/90`}
          >
            {deleting ? "Deleting…" : "Yes, delete it"}
          </Button>

          <Button
            variant="outline"
            disabled={deleting}
            onClick={() => setConfirming(false)}
            className={`${pillLook} border-latte font-semibold`}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setConfirming(true)}
          className={`${pillLook} border-clay font-bold text-clay`}
        >
          Delete account
        </Button>
      )}
    </section>
  );
}
