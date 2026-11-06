import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeForm } from "@/components/code-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata: Metadata = { title: "Enter your code · Lattely" };

export default function CodePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center px-3">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 gap-1.5 rounded-full border-latte bg-paper px-3.5 text-base font-semibold",
          )}
        >
          <ChevronLeft className="size-4.5" aria-hidden />
          Back
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-7 px-6 pt-6 pb-8">
        <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
          Check your email
        </h1>

        <CodeForm />
      </div>
    </main>
  );
}
