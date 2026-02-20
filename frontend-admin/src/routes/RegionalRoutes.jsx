import { Routes, Route, Navigate } from "react-router-dom";
import RegionalLayout from "../layouts/RegionalLayout";
import RegionalDashboard from "../pages/dashboard/RegionalDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import Repayments from "../pages/Repayments/Repayments";
import Disbursement from "../pages/disbursements/Disbursements";
import RegionalLoanApplications from "../pages/LoanApplications/RegionalLoanApplications";
import BranchKycVerification from "../pages/KycVerification/BranchKycVerification";
import RegionalAuditLogs from "../pages/AuditLogs/RegionalAuditLogs";
import AuthGuard from "../utils/AuthGuard";

const RegionalRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard role="REGIONAL_MANAGER">
            <RegionalLayout />
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<RegionalDashboard />} />
        <Route path="loan-applications" element={<RegionalLoanApplications />} />
        <Route path="disbursements" element={<Disbursement/>} />
        <Route path="repayments" element={<Repayments />} />
        <Route path="kyc" element={<BranchKycVerification />} />
        <Route path="audit-logs" element={<RegionalAuditLogs />} />


      </Route>


    </Routes>
  );
};

export default RegionalRoutes;
