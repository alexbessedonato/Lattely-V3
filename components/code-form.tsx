"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUserContextStore } from "@/lib/user-context-store";

// Neon Auth's real code lifetime: a code's expiresAt is 300 s after it's made, though Neon's email says 10 minutes.
const CODE_LIFETIME_MINUTES = 5;

export function CodeForm() {
  const router = useRouter();
  const email = useUserContextStore((state) => state.email);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // The email is only in memory, so after a reload it's gone: start again from /sign-in.
  useEffect(() => {
    if (email === null) router.replace("/sign-in");
  }, [email, router]);

  if (email === null) return null;

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: code,
    });
    if (!error) {
      router.push("/");
      router.refresh(); // rebuild the server pages with the new session cookie
      return;
    }
    setPending(false);
    setMessage(codeErrorMessage(error.code));
  };

  const sendNewCode = async () => {
    setMessage(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setCode("");
    setMessage(
      error ? "Couldn't send a new code. Please try again." : "New code sent.",
    );
  };

  return (
    <>
      <p className="leading-normal text-mocha">
        {"We sent a 6-digit code to "}

        <strong className="text-espresso">{email}</strong>

        {`. It expires in ${CODE_LIFETIME_MINUTES} minutes.`}
      </p>

      <form onSubmit={signIn} className="flex flex-col gap-3">
        <label htmlFor="code" className="text-sm font-semibold text-mocha">
          Code
        </label>

        <input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          className="h-16 rounded-[20px] border-2 border-clay bg-white px-5 text-center font-heading text-3xl font-semibold tracking-[0.4em]"
        />

        <button
          type="submit"
          disabled={pending}
          className="h-13 rounded-full bg-espresso font-bold text-cream disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>

        {message && (
          <p role="alert" className="text-sm text-mocha">
            {message}
          </p>
        )}
      </form>

      <div className="flex flex-col gap-1 text-sm leading-normal text-mocha">
        <span>Didn&apos;t get it? Check your spam folder, or</span>

        <span className="flex flex-wrap items-center gap-x-1">
          <button
            type="button"
            onClick={sendNewCode}
            className="min-h-11 font-semibold text-espresso underline"
          >
            send a new code
          </button>

          <span aria-hidden>·</span>

          <Link
            href="/sign-in"
            className="flex min-h-11 items-center font-semibold text-espresso underline"
          >
            use a different email
          </Link>
        </span>
      </div>
    </>
  );
}

// Neon Auth's error codes for a code that didn't work, in the Visitor's words.
function codeErrorMessage(code: string | undefined) {
  if (code === "INVALID_OTP")
    return "That code isn't right. Check it and try again.";
  if (code === "OTP_EXPIRED")
    return "That code has expired. Send a new one below.";
  if (code === "TOO_MANY_ATTEMPTS")
    return "Too many tries. Send a new code below.";
  return "Something went wrong. Please try again.";
}
