import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import Repayments from "../pages/Repayments/Repayments";
import LoanClosure from "../pages/LoanClosure/LoanClosure";
import Disbursement from "../pages/disbursements/Disbursements";
import LoanApplications from "../pages/LoanApplications/LoanApplications";
import AuthGuard from "../utils/AuthGuard";
import KYCVerification from "../pages/kycverification/AdminKycVerification";

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
            <Route path="kyc-verification" element={<KYCVerification />} />
        <Route path="loan-applications" element={<LoanApplications />} />
         <Route path="disbursements" element={<Disbursement/>} />
         <Route path="repayments" element={<Repayments />} />
            <Route path="closure" element={<LoanClosure />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
