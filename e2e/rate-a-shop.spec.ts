import { expect, test } from "@playwright/test";

// The one end-to-end test: browse, pick a Neighbourhood, sign in, rate a Shop, see the Ranking update.
// It starts from the seeded Shops: in Gràcia, SlowMov (rated) is No. 1 and Onna Coffee (Unrated) No. 2.
test("a Member rates a Shop and sees the Ranking update", async ({ page }) => {
  // Browse, and pick a Neighbourhood.
  await page.goto("/");
  await page.getByLabel("Neighbourhood").click();
  await page.getByRole("option", { name: "Gràcia" }).click();
  await expect(page).toHaveURL(/n=gracia/);

  const onna = page.getByRole("link", { name: /Onna Coffee/ });
  await expect(onna).toContainText("No. 2");
  await expect(onna).toContainText("No ratings yet");

  // Open the Shop. A Visitor who taps a star is sent to sign in.
  await onna.click();
  await page.getByRole("button", { name: "5 stars" }).click();
  await expect(page).toHaveURL("/sign-in");

  // Sign in as the test Member. The sign-in screens get their own test later; this uses the password API.
  const signIn = await page.request.post("/api/auth/sign-in/email", {
    data: {
      email: process.env.E2E_MEMBER_EMAIL,
      password: process.env.E2E_MEMBER_PASSWORD,
    },
  });
  expect(signIn.ok()).toBe(true);

  // Back to the Shop, now signed in, and rate it.
  await page.goBack();
  await page.reload();
  await page.getByRole("button", { name: "5 stars" }).click();
  await expect(page.getByText("You gave it 5 stars.")).toBeVisible();

  // Back on the Ranking, Onna Coffee has the new Rating and has moved up.
  await page.getByRole("link", { name: "Ranking" }).click();
  await expect(page).toHaveURL(/n=gracia/);
  await expect(onna).toContainText("No. 1");
  await expect(onna).toContainText("5.0");
});
