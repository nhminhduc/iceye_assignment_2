import { expect, loginAs, test } from "./fixtures";

test.describe("Profile", () => {
  test.beforeEach(async ({ mockedPage: page }) => {
    await page.goto("/");
    await loginAs(page, "alice", "1234");
    await expect(
      page.getByRole("heading", { name: "Acquisitions", exact: true }),
    ).toBeVisible();
  });

  test("navigates to profile page via sidebar", async ({
    mockedPage: page,
  }) => {
    await page.getByRole("link", { name: /profile/i }).click();

    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
    await expect(page.getByText(/manage your account/i)).toBeVisible();
  });

  test("displays user profile form with current name", async ({
    mockedPage: page,
  }) => {
    await page.getByRole("link", { name: /profile/i }).click();

    // The profile form should load with Alice's name
    const nameInput = page.getByLabel(/display name/i);
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue("Alice Smith");
  });

  test("navigates to profile via user menu", async ({ mockedPage: page }) => {
    await page.getByRole("button", { name: /user menu/i }).click();
    await page.getByRole("menuitem", { name: /profile/i }).click();

    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
  });
});
