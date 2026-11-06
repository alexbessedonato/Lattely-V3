import Link from "next/link";
import { AccountMenu } from "@/components/account-menu";
import { buttonVariants } from "@/components/ui/button";
import { getMember } from "@/lib/auth/auth-server";
import { cn } from "@/lib/utils";

// "Sign in" for a Visitor, the account button for a Member.
// It reads the session cookie, so pages show it inside <Suspense> and the rest of the page doesn't wait.
export async function Account() {
  const member = await getMember();

  if (!member) {
    return (
      <Link
        href="/sign-in"
        className={cn(
          buttonVariants(),
          "h-11 rounded-full px-4 text-[15px] font-semibold",
        )}
      >
        Sign in
      </Link>
    );
  }

  return <AccountMenu name={member.name} email={member.email} />;
}
