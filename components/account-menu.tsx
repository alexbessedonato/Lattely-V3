"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";

// The round button with the Member's initial, which opens a menu to sign out.
export function AccountMenu({ name, email }: { name: string; email: string }) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.refresh(); // rebuild the server header without the session, so it shows "Sign in" again
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

        <DropdownMenuItem onClick={signOut} className="min-h-11 text-base">
          <LogOut aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
