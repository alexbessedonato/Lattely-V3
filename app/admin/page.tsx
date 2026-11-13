import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BackToRanking } from "@/components/back-to-ranking";
import { getAdmin } from "@/lib/admin/get-admin";
import { getMember } from "@/lib/auth/auth-server";

export const metadata: Metadata = { title: "Admin · Lattely" };

export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center px-3">
        <BackToRanking />
      </header>

      <div className="flex flex-col gap-5 px-5 pt-4 pb-8">
        {/* Reading the session cookie happens on every visit, so it sits inside <Suspense>. */}
        <Suspense>
          <AdminsOnly />
        </Suspense>
      </div>
    </main>
  );
}

// Visitors who aren't signed in go to sign in first; other Members get a 404, as if /admin didn't exist.
async function AdminsOnly() {
  const admin = await getAdmin();
  if (!admin) {
    if (!(await getMember())) redirect("/sign-in?next=/admin");
    notFound();
  }

  return (
    <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
      Admin
    </h1>
  );
}
