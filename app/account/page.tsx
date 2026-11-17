import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BackToRanking } from "@/components/back-to-ranking";
import { DeleteAccount } from "@/components/delete-account";
import { SignOutButton } from "@/components/sign-out-button";
import { getMember } from "@/lib/auth/auth-server";

export const metadata: Metadata = { title: "Your account · Lattely" };

export default function AccountPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center px-3">
        <BackToRanking />
      </header>

      <div className="flex flex-col gap-6 px-5 pt-4 pb-8">
        <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
          Your account
        </h1>

        {/* Reading the session cookie happens on every visit, so it sits inside <Suspense>. */}
        <Suspense>
          <MembersOnly />
        </Suspense>
      </div>
    </main>
  );
}

// Visitors who aren't signed in go to sign in first; Members see sign out and delete.
async function MembersOnly() {
  const member = await getMember();
  if (!member) redirect("/sign-in?next=/account");

  return (
    <>
      <p className="-mt-4 leading-normal text-mocha">
        Signed in as {member.email}
      </p>

      <SignOutButton />

      <DeleteAccount />
    </>
  );
}
