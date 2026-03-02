import { expect, loginAs, test } from "./fixtures";

test.describe("Navigation & Layout", () => {
  test.beforeEach(async ({ mockedPage: page }) => {
    await page.goto("/");
    await loginAs(page, "alice", "1234");
    await expect(
      page.getByRole("heading", { name: "Acquisitions", exact: true }),
    ).toBeVisible();
  });

  test("sidebar shows app branding and navigation links", async ({
    mockedPage: page,
  }) => {
    await expect(
      page.getByText("LARVIS", { exact: true }).first(),
    ).toBeVisible();
    const sidebar = page.getByLabel("Main navigation");
    await expect(
      sidebar.getByRole("link", { name: "Dashboard", exact: true }),
    ).toBeVisible();
    await expect(
      sidebar.getByRole("link", { name: "Profile", exact: true }),
    ).toBeVisible();
  });

  test("navigates between dashboard and profile", async ({
    mockedPage: page,
  }) => {
    // Go to profile
    const sidebar = page.getByLabel("Main navigation");
    await sidebar.getByRole("link", { name: "Profile", exact: true }).click();
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();

    // Go back to dashboard
    await sidebar.getByRole("link", { name: "Dashboard", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Acquisitions", exact: true }),
    ).toBeVisible();
  });

  test("theme toggle switches between light and dark mode", async ({
    mockedPage: page,
  }) => {
    // Open theme dropdown
    await page.getByRole("button", { name: /toggle theme/i }).click();
    await page.getByRole("menuitem", { name: /dark/i }).click();

    // html should have dark class
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);

    // Switch back to light
    await page.getByRole("button", { name: /toggle theme/i }).click();
    await page.getByRole("menuitem", { name: /light/i }).click();

    await expect(page.locator("html")).not.toHaveAttribute("class", /dark/);
  });
});
