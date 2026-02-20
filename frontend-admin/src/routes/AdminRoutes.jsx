import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import Repayments from "../pages/Repayments/Repayments";
import Disbursement from "../pages/disbursements/Disbursements";
import LoanApplications from "../pages/LoanApplications/LoanApplications";
import BranchKycVerification from "../pages/KycVerification/BranchKycVerification";
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
         <Route path="disbursements" element={<Disbursement/>} />
         <Route path="repayments" element={<Repayments />} />
         <Route path="kyc" element={<BranchKycVerification />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
