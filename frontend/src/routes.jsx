import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RestaurantListPage from "./pages/RestaurantListPage";
import RestaurantMenuPage from "./pages/RestaurantMenuPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminRestaurantPage from "./pages/AdminRestaurantPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes */}
        <Route path="/restaurants" element={<ProtectedRoute role="CUSTOMER"><RestaurantListPage /></ProtectedRoute>} />
        <Route path="/restaurants/:id" element={<ProtectedRoute role="CUSTOMER"><RestaurantMenuPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute role="CUSTOMER"><CartPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="CUSTOMER"><OrdersPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/restaurants" element={<ProtectedRoute role="ADMIN"><AdminRestaurantPage /></ProtectedRoute>} />
        <Route path="/admin/restaurants/:id" element={<ProtectedRoute role="ADMIN"><AdminMenuPage /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrdersPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
