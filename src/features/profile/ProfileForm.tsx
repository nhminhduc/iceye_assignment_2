import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading profile">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    );
  }

  const isBusy = isPending || isVerifying;
  const buttonLabel = isVerifying
    ? "Verifying…"
    : isPending
      ? "Saving…"
      : "Save Changes";

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Profile form"
      className="space-y-6"
    >
      {/* Feedback alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>Profile updated!</AlertDescription>
        </Alert>
      )}

      {/* ── Account info ────────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Account
        </legend>

        <div className="space-y-2">
          <Label htmlFor="profile-userid">User ID</Label>
          <Input
            id="profile-userid"
            value={profile?.user_id ?? ""}
            disabled
            className="bg-muted text-muted-foreground font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Your unique identifier — this cannot be changed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-name">Display Name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setNameEdited(e.target.value)}
            placeholder="Your name"
            disabled={isBusy}
            required
          />
        </div>
      </fieldset>

      <Separator />

      {/* ── Change password ─────────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Change Password
        </legend>
        <p className="text-xs text-muted-foreground">
          Leave these fields blank to keep your current password.
        </p>

        <div className="space-y-2">
          <Label htmlFor="profile-old-password">Current Password</Label>
          <Input
            id="profile-old-password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Required to change password"
            disabled={isBusy}
            autoComplete="current-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-password">New Password</Label>
          <Input
            id="profile-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            disabled={isBusy}
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-confirm">Confirm New Password</Label>
          <Input
            id="profile-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            disabled={isBusy}
            autoComplete="new-password"
          />
        </div>
      </fieldset>

      <Separator />

      {/* ── Submit ───────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isBusy}>
          {buttonLabel}
        </Button>
        {success && (
          <span className="text-sm text-muted-foreground">
            All changes saved.
          </span>
        )}
      </div>
    </form>
  );
}
