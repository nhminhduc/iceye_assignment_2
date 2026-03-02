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
      <p>Logged in as: <strong>{userId}</strong></p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;
