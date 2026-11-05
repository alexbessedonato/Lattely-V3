import { Coffee, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmailForm } from "@/components/email-form";
import { GoogleSignIn } from "@/components/google-sign-in";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Sign in · Lattely" };

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center px-3">
        <Link
          href="/"
          aria-label="Close and go back"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "size-11 rounded-full border-latte bg-paper",
          )}
        >
          <X className="size-4.5" aria-hidden />
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-7 px-6 pt-6 pb-8">
        <div className="flex flex-col items-start gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-clay">
            <Coffee className="size-7.5 text-cream" aria-hidden />
          </span>

          <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
            Join the Lattely community
          </h1>

          <p className="leading-normal text-mocha">
            Sign in to rate the shops you visit and suggest ones we&apos;re
            missing.
          </p>
        </div>

        <GoogleSignIn />

        <div className="flex items-center gap-3 text-sm text-mocha">
          <span aria-hidden className="h-px flex-1 bg-latte" />

          <span>or use your email</span>

          <span aria-hidden className="h-px flex-1 bg-latte" />
        </div>

        <EmailForm />

        <p className="mt-auto flex flex-wrap justify-center gap-x-1 text-sm leading-normal text-mocha">
          <span>Just browsing? You don&apos;t need an account.</span>

          <Link href="/" className="font-semibold text-espresso underline">
            Back to the Ranking
          </Link>
        </p>
      </div>
    </main>
  );
}
