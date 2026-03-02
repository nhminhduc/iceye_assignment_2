import { useState } from "react";

import { authApi } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/authStore";

import { useProfile, useUpdateProfile } from "./useProfile";

export function ProfileForm() {
  const userId = useAuthStore((s) => s.userId);
  const { data: profile, isLoading } = useProfile();
  const { mutateAsync, isPending } = useUpdateProfile();
  const [isVerifying, setIsVerifying] = useState(false);

  const [nameEdited, setNameEdited] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const name = nameEdited ?? profile?.name ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (password && !oldPassword) {
      setError("Current password is required to set a new password.");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Verify current password server-side via /token
      if (password && userId) {
        setIsVerifying(true);
        try {
          await authApi.login(userId, oldPassword);
        } catch {
          setError("Current password is incorrect.");
          return;
        } finally {
          setIsVerifying(false);
        }
      }

      const payload: { name?: string; password?: string } = {
        name: name.trim(),
      };
      if (password) payload.password = password;

      await mutateAsync(payload);
      setSuccess(true);
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  };

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit} aria-label="Profile form">
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="profile-userid">User ID</label>
        <input
          id="profile-userid"
          value={profile?.user_id ?? ""}
          disabled
          style={{
            display: "block",
            width: "100%",
            padding: 8,
            marginTop: 4,
            background: "#eee",
          }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="profile-name">Display Name</label>
        <input
          id="profile-name"
          value={name}
          onChange={(e) => setNameEdited(e.target.value)}
          placeholder="Your name"
          disabled={isPending}
          required
          style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="profile-old-password">Current Password</label>
        <input
          id="profile-old-password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Required to change password"
          disabled={isPending}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="profile-password">New Password</label>
        <input
          id="profile-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep current"
          disabled={isPending}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="profile-confirm">Confirm Password</label>
        <input
          id="profile-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
          disabled={isPending}
          style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
        />
      </div>

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginBottom: 12 }}>Profile updated!</p>
      )}

      <button
        type="submit"
        disabled={isPending || isVerifying}
        style={{ padding: "8px 16px" }}
      >
        {isVerifying
          ? "Verifying..."
          : isPending
            ? "Saving..."
            : "Save Changes"}
      </button>
    </form>
  );
}
