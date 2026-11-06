import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BackToRanking } from "@/components/back-to-ranking";
import { SubmitForm } from "@/components/submit-form";
import { getMember } from "@/lib/auth/auth-server";

export const metadata: Metadata = { title: "Suggest a shop · Lattely" };

export default function SubmitPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center px-3">
        <BackToRanking />
      </header>

      <div className="flex flex-col gap-6 px-6 pt-4 pb-8">
        <div className="flex flex-col gap-2.5">
          <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
            Know a gem we&apos;re missing?
          </h1>

          <p className="leading-normal text-mocha">
            Tell us where it is. We&apos;ll check it and add it to the Ranking.
          </p>
        </div>

        {/* Reading the session cookie happens on every visit, so it sits inside <Suspense>. */}
        <Suspense>
          <MembersOnly />
        </Suspense>
      </div>
    </main>
  );
}

// Visitors who aren't signed in go to sign in first; Members get the form.
async function MembersOnly() {
  const member = await getMember();
  if (!member) redirect("/sign-in");

  return <SubmitForm />;
}
