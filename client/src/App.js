import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Mockup from "./pages/Mockup";
import Register from "./pages/Register";
import Stories from "./pages/Stories";

// Route protection by role
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  const user = JSON.parse(atob(token.split(".")[1]));
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

// Redirect based on role after login
function AuthRedirect() {
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setRedirectPath("/");

    try {
      const user = JSON.parse(atob(token.split(".")[1]));
      if (user.role === "admin") setRedirectPath("/admin");
      else setRedirectPath("/dashboard/mockups");
    } catch {
      setRedirectPath("/");
    }
  }, []);

  if (redirectPath === null) return null;
  return <Navigate to={redirectPath} />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/redirect" element={<AuthRedirect />} />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard with nested routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="mockups" />} />
          <Route path="mockups" element={<Mockup />} />
          <Route path="stories" element={<Stories />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
