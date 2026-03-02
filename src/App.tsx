import { Route, Routes } from "react-router";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProfilePage } from "@/pages/ProfilePage";

import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthGuard, GuestGuard } from "./router";

export function App() {
  return (
    <Routes>
      {/* Guest-only: redirect to dashboard if already logged in */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Authenticated: redirect to login if not logged in */}
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
