"use client";

import { ListChecks, LogOut } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

// The round button with the Member's initial, which opens a menu with My submissions and Sign out.
export function AccountMenu({ name, email }: { name: string; email: string }) {
  async function signOut() {
    await authClient.signOut();
    // A full reload, so no page kept from while signed in (like the /submit form) can show again.
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Your account"
        className="flex size-11 items-center justify-center rounded-full bg-espresso font-bold text-cream outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {/* A Member who signed in by email code may have no name yet */}
        {(name || email).charAt(0).toUpperCase()}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm">
            Signed in as {email}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuItem
          render={<Link href="/my-submissions" />}
          className="min-h-11 text-base"
        >
          <ListChecks aria-hidden />
          My submissions
        </DropdownMenuItem>

        <DropdownMenuItem onClick={signOut} className="min-h-11 text-base">
          <LogOut aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
