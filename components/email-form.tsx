"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import { useUserContextStore } from "@/lib/auth/user-context-store";

export function EmailForm() {
  const router = useRouter();
  const storedEmail = useUserContextStore((state) => state.email);
  const setStoredEmail = useUserContextStore((state) => state.setEmail);
  // Coming back with "use a different email" shows the last one, ready to fix.
  const [email, setEmail] = useState(storedEmail ?? "");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function sendCode(event: React.FormEvent) {
    event.preventDefault(); // stay on this page instead of the browser submitting the form
    setPending(true);
    setFailed(false);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    if (error) {
      setPending(false);
      setFailed(true);
      return;
    }
    setStoredEmail(email);
    router.push("/sign-in/code");
  }

  return (
    <form onSubmit={sendCode} className="flex flex-col gap-3">
      <Label htmlFor="email" className="font-semibold text-mocha">
        Email
      </Label>

      <Input
        id="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-13 rounded-full bg-white px-5 md:text-base"
      />

      <Button
        type="submit"
        disabled={pending}
        className="h-13 rounded-full text-base font-bold"
      >
        {pending ? "Sending…" : "Send me a code"}
      </Button>

      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          Couldn&apos;t send the code. Check the email and try again.
        </p>
      ) : (
        <p className="text-sm leading-normal text-mocha">
          We&apos;ll email you a 6-digit code. No password needed.
        </p>
      )}
    </form>
  );
}
