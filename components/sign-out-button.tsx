"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/sign-out";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={signOut}
      className="h-12 self-start rounded-full border-latte bg-paper px-5 text-[15px] font-semibold"
    >
      <LogOut className="size-4.5" aria-hidden />
      Sign out
    </Button>
  );
}
