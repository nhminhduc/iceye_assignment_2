import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { useAuthStore } from "./authStore";
import { LoginPage } from "./LoginPage";

const server = setupServer(
  http.post("http://localhost:8080/token", async ({ request }) => {
    const body = (await request.json()) as {
      user_id: string;
      password: string;
    };
    if (body.user_id === "alice" && body.password === "1234") {
      return HttpResponse.json({ access: "fake-token-123" });
    }
    return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  useAuthStore.setState({ token: null, userId: null });
});
afterAll(() => server.close());

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>,
  );
}

describe("LoginPage", () => {
  it("renders the login form", () => {
    renderLoginPage();
    expect(screen.getByLabelText(/user id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("logs in successfully with valid credentials", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/user id/i), "alice");
    await user.type(screen.getByLabelText(/password/i), "1234");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.token).toBe("fake-token-123");
      expect(state.userId).toBe("alice");
    });
  });

  it("shows error message on failed login", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/user id/i), "alice");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid user id or password/i),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state while logging in", async () => {
    // Delay the response so we can observe the pending state
    server.use(
      http.post("http://localhost:8080/token", async () => {
        await new Promise((r) => setTimeout(r, 200));
        return HttpResponse.json({ access: "fake-token-123" });
      }),
    );

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/user id/i), "alice");
    await user.type(screen.getByLabelText(/password/i), "1234");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });
});
