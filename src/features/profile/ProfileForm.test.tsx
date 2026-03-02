import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { useAuthStore } from "@/features/auth/authStore";

import { ProfileForm } from "./ProfileForm";

const server = setupServer(
  http.get("http://localhost:8080/users/alice", () => {
    return HttpResponse.json({
      user_id: "alice",
      name: "Alice",
      password: "1234",
    });
  }),
  http.post("http://localhost:8080/users/alice", async ({ request }) => {
    const body = (await request.json()) as { name?: string; password?: string };
    return HttpResponse.json({
      user_id: "alice",
      name: body.name ?? "Alice",
      password: body.password ?? "1234",
    });
  }),
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
});
afterAll(() => server.close());

function renderProfileForm() {
  useAuthStore.setState({ token: "fake-token", userId: "alice" });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfileForm />
    </QueryClientProvider>,
  );
}

describe("ProfileForm", () => {
  it("loads and displays user profile", async () => {
    renderProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/user id/i)).toHaveValue("alice");
    });
    expect(screen.getByLabelText(/display name/i)).toHaveValue("Alice");
    expect(screen.getByLabelText(/user id/i)).toBeDisabled();
  });

  it("requires name field", async () => {
    renderProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toHaveValue("Alice");
    });

    const nameInput = screen.getByLabelText(/display name/i);
    expect(nameInput).toBeRequired();
  });

  it("requires current password when setting new password", async () => {
    const user = userEvent.setup();
    renderProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toHaveValue("Alice");
    });

    await user.type(screen.getByLabelText(/new password/i), "newpass");
    await user.type(screen.getByLabelText(/confirm password/i), "newpass");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(
      screen.getByText(/current password is required/i),
    ).toBeInTheDocument();
  });

  it("rejects incorrect current password", async () => {
    const user = userEvent.setup();
    renderProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toHaveValue("Alice");
    });

    await user.type(screen.getByLabelText(/current password/i), "wrong");
    await user.type(screen.getByLabelText(/new password/i), "newpass");
    await user.type(screen.getByLabelText(/confirm password/i), "newpass");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/current password is incorrect/i),
      ).toBeInTheDocument();
    });
  });

  it("validates password confirmation matches", async () => {
    const user = userEvent.setup();
    renderProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toHaveValue("Alice");
    });

    await user.type(screen.getByLabelText(/current password/i), "1234");
    await user.type(screen.getByLabelText(/new password/i), "newpass");
    await user.type(screen.getByLabelText(/confirm password/i), "different");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("submits name change without password fields", async () => {
    const user = userEvent.setup();
    renderProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toHaveValue("Alice");
    });

    await user.clear(screen.getByLabelText(/display name/i));
    await user.type(screen.getByLabelText(/display name/i), "Alice Updated");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
    });
  });

  it("submits password change with correct current password", async () => {
    const user = userEvent.setup();
    renderProfileForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toHaveValue("Alice");
    });

    await user.type(screen.getByLabelText(/current password/i), "1234");
    await user.type(screen.getByLabelText(/new password/i), "newpass");
    await user.type(screen.getByLabelText(/confirm password/i), "newpass");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
    });
  });
});
