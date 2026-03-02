import { useState } from "react";

import { useLogin } from "./useLogin";

export function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ userId, password });
  };

  return (
    <div style={{ maxWidth: 360, margin: "100px auto", padding: 24 }}>
      <h1>LARVIS Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="alice, bob, or charlie"
            required
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="1234"
            required
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        {isError && (
          <p style={{ color: "red", marginBottom: 12 }}>
            Login failed: {error?.message ?? "Unknown error"}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          style={{ width: "100%", padding: 10 }}
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
