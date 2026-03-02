import { Link, Route, Routes } from "react-router";

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

export default App;
