import { expect, loginAs, test } from "./fixtures";

test.describe("Authentication", () => {
  test("shows the login form when unauthenticated", async ({
    mockedPage: page,
  }) => {
    await page.goto("/");

    await expect(page.getByLabel(/user id/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    await expect(
      page.getByText("LARVIS", { exact: true }).first(),
    ).toBeVisible();
  });

  test("logs in with valid credentials and shows dashboard", async ({
    mockedPage: page,
  }) => {
    await page.goto("/");
    await loginAs(page, "alice", "1234");

    // Should navigate to dashboard
    await expect(
      page.getByRole("heading", { name: "Acquisitions", exact: true }),
    ).toBeVisible();
    // Summary cards should be rendered
    await expect(page.getByText(/days with data/i)).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ mockedPage: page }) => {
    await page.goto("/");
    await loginAs(page, "alice", "wrong-password");

    await expect(page.getByText(/invalid user id or password/i)).toBeVisible();
    // Should stay on login page
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  test("logs out and returns to login page", async ({ mockedPage: page }) => {
    await page.goto("/");
    await loginAs(page, "alice", "1234");
    await expect(
      page.getByRole("heading", { name: "Acquisitions", exact: true }),
    ).toBeVisible();

    // Open user menu and click logout
    await page.getByRole("button", { name: /user menu/i }).click();
    await page.getByRole("menuitem", { name: /logout/i }).click();

    // Should be back on login page
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });
});
