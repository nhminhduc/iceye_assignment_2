import { Route, Routes } from "react-router";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/authStore";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProfilePage } from "@/pages/ProfilePage";

function App() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
