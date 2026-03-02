import { useMemo } from "react";

import { AcquisitionFilters } from "@/features/acquisitions/AcquisitionFilters";
import { AcquisitionsTable } from "@/features/acquisitions/AcquisitionsTable";
import { filterAcquisitions } from "@/features/acquisitions/filterAcquisitions";
import { useAcquisitionFilters } from "@/features/acquisitions/useAcquisitionFilters";
import { useAcquisitions } from "@/features/acquisitions/useAcquisitions";
import { useAuthStore } from "@/features/auth/authStore";
import { LoginPage } from "@/features/auth/LoginPage";

function App() {
  const token = useAuthStore((s) => s.token);
  const userId = useAuthStore((s) => s.userId);
  const logout = useAuthStore((s) => s.logout);

  if (!token) {
    return <LoginPage />;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>LARVIS Dashboard</h1>
      <p>
        Logged in as: <strong>{userId}</strong>
      </p>
      <button onClick={logout}>Logout</button>
      <hr style={{ margin: "16px 0" }} />
      <h2>Acquisitions</h2>
      <AcquisitionsData />
    </div>
  );
}

function AcquisitionsData() {
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
      <AcquisitionFilters />
      <AcquisitionsTable data={filtered} />
    </>
  );
}

export default App;
