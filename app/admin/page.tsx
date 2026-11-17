import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BackToRanking } from "@/components/back-to-ranking";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { getLiveShops } from "@/lib/admin/close-shop";
import { getAdmin } from "@/lib/admin/get-admin";
import { closeAction } from "@/lib/admin/review-actions";
import { getPendingSubmissions } from "@/lib/admin/review-submissions";
import { getMember } from "@/lib/auth/auth-server";

export const metadata: Metadata = { title: "Admin · Lattely" };

export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center px-3">
        <BackToRanking />
      </header>

      <div className="flex flex-col gap-7 px-5 pt-4 pb-8">
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

  const pending = await getPendingSubmissions();
  const live = await getLiveShops();

  return (
    <>
      <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
        Admin
      </h1>

      <section aria-labelledby="pending-title" className="flex flex-col gap-3">
        <h2
          id="pending-title"
          className="font-heading text-[22px] font-semibold"
        >
          Waiting for review
        </h2>

        {pending.length === 0 && (
          <p className="rounded-[20px] border border-dashed border-mocha p-5 text-mocha">
            Nothing to review. Nice.
          </p>
        )}

        {pending.map((shop) => (
          <ReviewCard key={shop.id} shop={shop} />
        ))}
      </section>

      <section aria-labelledby="live-title">
        <h2 id="live-title" className="font-heading text-[22px] font-semibold">
          Live shops
        </h2>

        <p className="mt-1 mb-2 text-sm leading-normal text-mocha">
          Close a shop that has shut down. It leaves the Ranking; its ratings
          are kept.
        </p>

        <ul>
          {live.map((shop) => (
            <li
              key={shop.id}
              className="flex min-h-16 items-center gap-3 border-b border-latte py-2.5"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-semibold">{shop.name}</span>

                <span className="text-sm text-mocha">{shop.address}</span>
              </div>

              {/* A form so the button works without JavaScript; shop.id is bound on the server. */}
              <form action={closeAction.bind(null, shop.id)}>
                <Button
                  type="submit"
                  variant="outline"
                  aria-label={`Close ${shop.name}`}
                  className="h-11 rounded-full border-dashed border-mocha px-4 font-semibold"
                >
                  Close
                </Button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
