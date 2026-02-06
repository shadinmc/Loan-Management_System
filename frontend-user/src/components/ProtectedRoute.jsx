import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api/authApi';

/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 */
export default function ProtectedRoute() {
  const location = useLocation();
  if (!isAuthenticated()) {
    // Preserve the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
