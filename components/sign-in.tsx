"use client";

import { ChevronLeft, Coffee, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleSignIn } from "@/components/google-sign-in";
import { authClient } from "@/lib/auth-client";

// Neon Auth's real code lifetime: a code's expiresAt is 300 s after it's made, though Neon's email says 10 minutes.
const CODE_LIFETIME_MINUTES = 5;

// Both sign-in screens. The email lives only in this component's memory, never in the URL.
export function SignIn() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  return sentTo === null ? (
    <EmailScreen onCodeSent={setSentTo} />
  ) : (
    <CodeScreen email={sentTo} onBack={() => setSentTo(null)} />
  );
}

function EmailScreen({ onCodeSent }: { onCodeSent: (email: string) => void }) {
  const [email, setEmail] = useState("");
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
    setPending(false);
    if (error) setFailed(true);
    else onCodeSent(email);
  }

  return (
    <Screen
      topButton={
        <Link
          href="/"
          aria-label="Close and go back"
          className="flex size-11 items-center justify-center rounded-full border border-latte bg-paper"
        >
          <X className="size-4.5" aria-hidden />
        </Link>
      }
    >
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

      <form onSubmit={sendCode} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-sm font-semibold text-mocha">
          Email
        </label>

        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-13 rounded-full border border-input bg-white px-5"
        />

        <button
          type="submit"
          disabled={pending}
          className="h-13 rounded-full bg-espresso font-bold text-cream disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send me a code"}
        </button>

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

      <p className="mt-auto flex flex-wrap justify-center gap-x-1 text-sm leading-normal text-mocha">
        <span>Just browsing? You don&apos;t need an account.</span>

        <Link href="/" className="font-semibold text-espresso underline">
          Back to the Ranking
        </Link>
      </p>
    </Screen>
  );
}

function CodeScreen({ email, onBack }: { email: string; onBack: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    const { error } = await authClient.signIn.emailOtp({ email, otp: code });
    if (!error) {
      router.push("/");
      router.refresh(); // rebuild the server pages with the new session cookie
      return;
    }
    setPending(false);
    setMessage(codeErrorMessage(error.code));
  }

  async function sendNewCode() {
    setMessage(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setCode("");
    setMessage(
      error ? "Couldn't send a new code. Please try again." : "New code sent.",
    );
  }

  return (
    <Screen
      topButton={
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-11 items-center gap-1.5 rounded-full border border-latte bg-paper px-3.5 font-semibold"
        >
          <ChevronLeft className="size-4.5" aria-hidden />
          Back
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
          Check your email
        </h1>

        <p className="leading-normal text-mocha">
          {"We sent a 6-digit code to "}

          <strong className="text-espresso">{email}</strong>

          {`. It expires in ${CODE_LIFETIME_MINUTES} minutes.`}
        </p>
      </div>

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

          <button
            type="button"
            onClick={onBack}
            className="min-h-11 font-semibold text-espresso underline"
          >
            use a different email
          </button>
        </span>
      </div>
    </Screen>
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

// The page frame both screens share: a button at the top left, then the content.
function Screen({
  topButton,
  children,
}: {
  topButton: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <header className="flex h-16 items-center px-3">{topButton}</header>

      <div className="flex flex-1 flex-col gap-7 px-6 pt-6 pb-8">
        {children}
      </div>
    </main>
  );
}
