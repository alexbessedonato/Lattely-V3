import { authClient } from "@/lib/auth/auth-client";

// Used by the account menu and the /account page.
export async function signOut() {
  await authClient.signOut();
  // A full reload, so no page kept from while signed in (like the /submit form) can show again.
  window.location.reload();
}
