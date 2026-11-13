import { expect, test } from "@playwright/test";

// A Visitor who opens Suggest a shop signs in, then lands on the form, and the app no longer replays
// the "go to sign-in" it saw before signing in.
test("after signing in, Suggest a shop opens the form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Submit it" }).click();
  await expect(page).toHaveURL("/sign-in?next=/submit");

  // Sign in as the test Member, like rate-a-shop.spec.ts does.
  const signIn = await page.request.post("/api/auth/sign-in/email", {
    data: {
      email: process.env.E2E_MEMBER_EMAIL,
      password: process.env.E2E_MEMBER_PASSWORD,
    },
  });
  expect(signIn.ok()).toBe(true);

  // The code form ends with a full page load of ?next=. The API sign-in skips that form, so do the same here.
  await page.goto("/submit");
  await expect(page.getByLabel("Shop name")).toBeVisible();

  // Moving around inside the app (no reload) keeps opening the form.
  await page.getByRole("link", { name: "Ranking" }).click();
  await page.getByRole("link", { name: "Submit it" }).click();
  await expect(page.getByLabel("Shop name")).toBeVisible();
});
