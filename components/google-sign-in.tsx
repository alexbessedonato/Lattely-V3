"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function GoogleSignIn() {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signIn() {
    setPending(true);
    setFailed(false);
    // On success the browser leaves for Google, then comes back to the Ranking signed in.
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (error) {
      setPending(false);
      setFailed(true);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={signIn}
        disabled={pending}
        className="h-13 gap-2.5 rounded-full border-input bg-white text-base font-semibold"
      >
        <GoogleLogo />

        {pending ? "Opening Google…" : "Continue with Google"}
      </Button>

      {failed && (
        <p role="alert" className="text-sm text-destructive">
          Couldn&apos;t reach Google. Please try again.
        </p>
      )}
    </div>
  );
}

// Google's own four-colour "G", which their brand rules ask sign-in buttons to show.
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"
        fill="#4285F4"
      />

      <path
        d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"
        fill="#34A853"
      />

      <path
        d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14z"
        fill="#FBBC05"
      />

      <path
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z"
        fill="#EA4335"
      />
    </svg>
  );
}
