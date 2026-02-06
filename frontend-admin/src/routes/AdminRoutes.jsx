import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import LoanApplications from "../pages/LoanApplications/LoanApplications";
import AuthGuard from "../utils/AuthGuard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard role="BRANCH_MANAGER">
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="loan-applications" element={<LoanApplications />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
