// Deletes a Member's login (and its sessions) from Neon Auth, through Neon's admin API.
// Needed because Neon Auth refuses auth.deleteUser() for the signed-in user, and has no setting to allow it.
// NEON_API_KEY is a secret that can change the whole Lattely Neon project: server only, never sent to the browser.
export async function deleteLogin(member: { id: string }) {
  const { apiKey, projectId, branchId } = neonSettings();

  const response = await fetch(
    `https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}/auth/users/${encodeURIComponent(member.id)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${apiKey}` } },
  );
  // 404: Neon already deleted it, on an earlier try that failed later on. That's what we wanted.
  if (!response.ok && response.status !== 404) {
    throw new Error(`Neon didn't delete the login (HTTP ${response.status}).`);
  }
}

// Throws if deleteLogin couldn't work. The delete action calls this first, so a missing key stops it before anything is deleted.
export function ensureCanDeleteLogin() {
  neonSettings();
}

// What deleteLogin needs, or an error saying what's missing.
function neonSettings() {
  const apiKey = process.env.NEON_API_KEY;
  const projectId = process.env.NEON_PROJECT_ID;
  const branchId = process.env.NEON_AUTH_BRANCH_ID;
  if (!apiKey || !projectId || !branchId) {
    throw new Error(
      "NEON_API_KEY, NEON_PROJECT_ID or NEON_AUTH_BRANCH_ID is not set. The ids are in .env.development and .env.production; the key goes in .env.local and Vercel.",
    );
  }
  return { apiKey, projectId, branchId };
}
