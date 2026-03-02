import { useMemo } from "react";
import { Link, Route, Routes } from "react-router";

import { AcquisitionFilters } from "@/features/acquisitions/AcquisitionFilters";
import { AcquisitionsTable } from "@/features/acquisitions/AcquisitionsTable";
import { filterAcquisitions } from "@/features/acquisitions/filterAcquisitions";
import { useAcquisitionFilters } from "@/features/acquisitions/useAcquisitionFilters";
import { useAcquisitions } from "@/features/acquisitions/useAcquisitions";
import { useAuthStore } from "@/features/auth/authStore";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProfileForm } from "@/features/profile/ProfileForm";

function App() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <LoginPage />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Nav />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

function Nav() {
  const userId = useAuthStore((s) => s.userId);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <Link to="/">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      <span style={{ marginLeft: "auto" }}>
        Logged in as: <strong>{userId}</strong>
      </span>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

function DashboardPage() {
  const { data, isLoading, isError, error } = useAcquisitions();
  const { filters } = useAcquisitionFilters();

  const filtered = useMemo(
    () => (data ? filterAcquisitions(data, filters) : []),
    [data, filters],
  );

  if (isLoading) return <p>Loading acquisitions...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <>
      <h1>Acquisitions</h1>
      <AcquisitionFilters />
      <AcquisitionsTable data={filtered} />
    </>
  );
}

function ProfilePage() {
  return (
    <>
      <h1>Profile</h1>
      <div style={{ maxWidth: 400 }}>
        <ProfileForm />
      </div>
    </>
  );
}

export default App;
