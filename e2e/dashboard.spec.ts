import { expect, loginAs, test } from "./fixtures";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ mockedPage: page }) => {
    await page.goto("/");
    await loginAs(page, "alice", "1234");
    await expect(
      page.getByRole("heading", { name: "Acquisitions", exact: true }),
    ).toBeVisible();
  });

  test("displays summary statistics cards", async ({ mockedPage: page }) => {
    await expect(page.getByText(/days with data/i)).toBeVisible();
    await expect(page.getByText(/avg detected sites/i)).toBeVisible();
    await expect(page.getByText(/peak detected sites/i)).toBeVisible();
  });

  test("renders chart, histogram, and table sections", async ({
    mockedPage: page,
  }) => {
    await expect(
      page.getByRole("region", { name: /timeline chart/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /distribution histogram/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: /acquisitions data table/i }),
    ).toBeVisible();
  });

  test("table shows record count", async ({ mockedPage: page }) => {
    // 5 records in our fixture
    await expect(page.getByText(/5 records/)).toBeVisible();
  });

  test("filters section is visible with date and site inputs", async ({
    mockedPage: page,
  }) => {
    await expect(page.getByLabel(/start date/i)).toBeVisible();
    await expect(page.getByLabel(/end date/i)).toBeVisible();
    await expect(page.getByLabel(/minimum detected sites/i)).toBeVisible();
    await expect(page.getByLabel(/maximum detected sites/i)).toBeVisible();
  });

  test("filtering by min sites updates the displayed data", async ({
    mockedPage: page,
  }) => {
    // Initially 5 records
    await expect(page.getByText(/5 records/)).toBeVisible();

    // Set min sites to 10 — only 2024-01-02 (12) and 2024-01-04 (20) match
    await page.getByLabel(/minimum detected sites/i).fill("10");

    // Wait for the table to update
    await expect(page.getByText(/2 records/)).toBeVisible();
  });

  test("clear filters button resets filters", async ({ mockedPage: page }) => {
    // Apply a filter
    await page.getByLabel(/minimum detected sites/i).fill("10");
    await expect(page.getByText(/2 records/)).toBeVisible();

    // Clear filters
    await page.getByRole("button", { name: /clear/i }).click();

    // Back to all records
    await expect(page.getByText(/5 records/)).toBeVisible();
  });
});
