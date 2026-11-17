"use client";

import { ListChecks, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/sign-out";

// The round button with the Member's initial, which opens a menu with Account, My submissions and Sign out.
export function AccountMenu({ name, email }: { name: string; email: string }) {
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
          render={<Link href="/account" />}
          className="min-h-11 text-base"
        >
          <UserRound aria-hidden />
          Account
        </DropdownMenuItem>

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
