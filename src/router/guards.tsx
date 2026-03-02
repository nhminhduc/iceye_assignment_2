import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "@/features/auth/authStore";

export function AuthGuard() {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function GuestGuard() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/" replace />;
  return <Outlet />;
}
