import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BackToRanking } from "@/components/back-to-ranking";
import { buttonVariants } from "@/components/ui/button";
import { getMember } from "@/lib/auth/auth-server";
import { getMySubmissions } from "@/lib/submission/my-submissions";
import { MAX_PENDING } from "@/lib/submission/submit-shop";
import { cn } from "cn";

export const metadata: Metadata = { title: "My submissions · Lattely" };

const suggestLook = cn(
  buttonVariants(),
  "h-11 rounded-full px-4 text-[15px] font-semibold",
);

export default function MySubmissionsPage({
  searchParams,
}: PageProps<"/my-submissions">) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center justify-between px-3">
        <BackToRanking />

        <Link href="/submit" className={suggestLook}>
          Suggest a shop
        </Link>
      </header>

      <div className="flex flex-col gap-5 px-5 pt-4 pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
            My submissions
          </h1>

          <p className="leading-normal text-mocha">
            Shops you&apos;ve suggested, and what happened to them.
          </p>
        </div>

        {/* Reading the session cookie happens on every visit, so it sits inside <Suspense>. */}
        <Suspense>
          <MembersOnly searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

// Visitors who aren't signed in go to sign in first; Members see their Submissions.
async function MembersOnly({
  searchParams,
}: {
  searchParams: PageProps<"/my-submissions">["searchParams"];
}) {
  const member = await getMember();
  if (!member) redirect("/sign-in");

  const submissions = await getMySubmissions(member);
  // The Server Action sends Members here with ?submitted=1 right after a Submission is saved.
  const justSubmitted = (await searchParams).submitted === "1";

  if (submissions.length === 0) {
    return (
      <section className="mt-6 flex flex-col items-start gap-3 rounded-3xl border border-latte bg-paper px-5.5 py-7">
        <h2 className="font-heading text-[22px] font-semibold">
          Nothing here yet
        </h2>

        <p className="leading-normal text-mocha">
          Found a great cup that isn&apos;t on the Ranking? Tell us about it.
        </p>

        <Link href="/submit" className={cn(suggestLook, "h-12 px-5")}>
          Suggest a shop
        </Link>
      </section>
    );
  }

  const pending = submissions.filter((shop) => shop.status === "pending");

  return (
    <>
      {justSubmitted && (
        <p
          role="status"
          className="flex items-center gap-3 rounded-[20px] border border-latte bg-paper px-4.5 py-3.5"
        >
          <Check className="size-5.5 text-clay" aria-hidden />
          Thanks! We&apos;ll check it soon.
        </p>
      )}

      <section aria-label="Your submissions">
        <ul>
          {submissions.map((shop) => (
            <li
              key={shop.id}
              className="flex min-h-18 items-center gap-3 border-b border-latte py-3"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-semibold">{shop.name}</span>

                <span className="text-sm text-mocha">{shop.address}</span>
              </div>

              <Status shop={shop} />
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm leading-normal text-mocha">
          {`${pending.length} of ${MAX_PENDING} waiting for review.`}
        </p>
      </section>
    </>
  );
}

const pillLook =
  "flex h-7.5 items-center rounded-full px-3 text-[13px] font-bold whitespace-nowrap";

// What happened to the Submission. "closed" was approved once, then hidden, so it has no page to link to.
function Status({ shop }: { shop: { status: string; slug: string } }) {
  if (shop.status === "pending") {
    return (
      <span className={cn(pillLook, "border border-clay text-clay")}>
        Pending
      </span>
    );
  }

  if (shop.status === "live") {
    return (
      <Link
        href={`/shops/${shop.slug}`}
        className={cn(pillLook, "bg-espresso text-cream")}
      >
        Approved · see it
      </Link>
    );
  }

  return (
    <span
      className={cn(
        pillLook,
        "border border-dashed border-mocha font-semibold text-mocha",
      )}
    >
      {shop.status === "rejected" ? "Rejected" : "Closed"}
    </span>
  );
}
