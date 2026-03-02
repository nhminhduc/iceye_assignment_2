import { type Page, test as base } from "@playwright/test";

// ── Fake API data ────────────────────────────────────────────────

const VALID_USER = { user_id: "alice", password: "1234" };
const FAKE_TOKEN = "fake-e2e-token";

const ACQUISITIONS = [
  { timestamp: 1704067200, ore_sites: 5 }, // 2024-01-01 00:00
  { timestamp: 1704153600, ore_sites: 12 }, // 2024-01-02 00:00
  { timestamp: 1704240000, ore_sites: 3 }, // 2024-01-03 00:00
  { timestamp: 1704326400, ore_sites: 20 }, // 2024-01-04 00:00
  { timestamp: 1704412800, ore_sites: 8 }, // 2024-01-05 00:00
];

const PROFILE = { user_id: "alice", name: "Alice Smith" };

// ── Helper: mock all API endpoints ───────────────────────────────

async function mockApi(page: Page) {
  await page.route("**/token", async (route) => {
    const body = route.request().postDataJSON();
    if (
      body.user_id === VALID_USER.user_id &&
      body.password === VALID_USER.password
    ) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ access: FAKE_TOKEN }),
      });
    }
    return route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "unauthorized" }),
    });
  });

  await page.route("**/acquisitions", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(ACQUISITIONS),
    }),
  );

  await page.route("**/users/alice", async (route) => {
    if (route.request().method() === "POST") {
      const payload = route.request().postDataJSON();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ...PROFILE, ...payload }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(PROFILE),
    });
  });
}

// ── Helper: login via the UI ─────────────────────────────────────

async function loginAs(page: Page, userId: string, password: string) {
  await page.getByLabel(/user id/i).fill(userId);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /login/i }).click();
}

// ── Custom fixture that pre-mocks the API ────────────────────────

export const test = base.extend<{ mockedPage: Page }>({
  mockedPage: async ({ page }, use) => {
    await mockApi(page);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  },
});

export { ACQUISITIONS, FAKE_TOKEN, loginAs, mockApi, PROFILE, VALID_USER };
export { expect } from "@playwright/test";
