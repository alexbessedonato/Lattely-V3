import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { deleteLogin } from "@/lib/auth/delete-login";

// No real calls to Neon: fetch is a fake that answers with the status each test picks.
const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEON_API_KEY", "test-key");
  vi.stubEnv("NEON_PROJECT_ID", "project-1");
  vi.stubEnv("NEON_AUTH_BRANCH_ID", "branch-1");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  fetchMock.mockReset();
});

test("asks Neon to delete exactly this Member's login", async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

  await deleteLogin({ id: "member-1" });

  expect(fetchMock).toHaveBeenCalledWith(
    "https://console.neon.tech/api/v2/projects/project-1/branches/branch-1/auth/users/member-1",
    { method: "DELETE", headers: { Authorization: "Bearer test-key" } },
  );
});

test("fails loudly when Neon says no", async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

  await expect(deleteLogin({ id: "member-1" })).rejects.toThrow("HTTP 401");
});

test("fails loudly when the key isn't set", async () => {
  vi.stubEnv("NEON_API_KEY", "");

  await expect(deleteLogin({ id: "member-1" })).rejects.toThrow("NEON_API_KEY");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("a login Neon has already deleted counts as done, so a retry works", async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

  await expect(deleteLogin({ id: "member-1" })).resolves.toBeUndefined();
});
