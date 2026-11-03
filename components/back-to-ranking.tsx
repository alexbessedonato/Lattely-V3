"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Goes back like the browser's Back when the Visitor came from the Ranking, so their filter
// and the loaded Shops are still there. From a shared link, it opens the Ranking fresh.
export function BackToRanking() {
  const router = useRouter();

  return (
    <Link
      href="/"
      onNavigate={(event) => {
        if (!cameFromRanking()) return;
        event.preventDefault();
        router.back();
      }}
      className="flex min-h-11 items-center gap-1.5 rounded-full border border-latte bg-paper pr-3.5 pl-2.5 font-semibold"
    >
      <ChevronLeft className="size-4.5" aria-hidden />
      Ranking
    </Link>
  );
}

// The Navigation API isn't in TypeScript's built-in types yet, so this describes the part we use.
type NavigationApi = {
  currentEntry: { index: number } | null;
  entries(): { url: string | null }[]; // only this tab's pages on our own site
};

function cameFromRanking() {
  // Missing in older browsers, which then just get the link.
  const navigation = (window as Window & { navigation?: NavigationApi })
    .navigation;
  const current = navigation?.currentEntry;
  if (!navigation || !current) return false;
  const previousUrl = navigation.entries()[current.index - 1]?.url;
  return previousUrl != null && new URL(previousUrl).pathname === "/";
}
