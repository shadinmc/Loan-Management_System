import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminLogin from "./pages/auth/AdminLogin";
import AdminRoutes from "./routes/AdminRoutes";
import RegionalRoutes from "./routes/RegionalRoutes";
import { getCurrentUser } from "./utils/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login/admin" />
            ) : user.role === "BRANCH_MANAGER" ? (
              <Navigate to="/admin/dashboard" />
            ) : user.role === "REGIONAL_MANAGER" ? (
              <Navigate to="/regional/dashboard" />
            ) : (
              <Navigate to="/login/admin" />
            )
          }
        />

        {/* Login */}
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Regional */}
        <Route path="/regional/*" element={<RegionalRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
