import { isAdmin } from "@/lib/admin/is-admin";
import { getMember } from "@/lib/auth/auth-server";

// The signed-in Member if they are an Admin, or null for everyone else. The /admin page and every admin action start here.
export async function getAdmin() {
  const member = await getMember();
  if (!member || !(await isAdmin(member))) return null;
  return member;
}

// Server Actions can be called by anyone, not just from /admin, so each one calls this first.
export async function refuseNonAdmins() {
  if (!(await getAdmin())) throw new Error("Only Admins can do this.");
}
