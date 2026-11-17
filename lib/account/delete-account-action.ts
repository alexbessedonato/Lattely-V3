"use server";

import { redirect } from "next/navigation";
import { deleteMember } from "@/lib/account/delete-member";
import { auth, getMember } from "@/lib/auth/auth-server";
import { deleteLogin } from "@/lib/auth/delete-login";

// "Yes, delete it" on /account posts here. It only ever deletes the signed-in Member.
export async function deleteAccountAction() {
  const member = await getMember();
  if (!member) redirect("/sign-in?next=/account");

  // Ratings first: if a later step fails, the Member can sign in and simply try again.
  await deleteMember(member);

  // Clears the session cookies in this browser, so it stops showing them as signed in.
  await auth.signOut();

  await deleteLogin(member.id);

  redirect("/");
}
