import { Routes, Route, Navigate } from "react-router-dom";
import RegionalLayout from "../layouts/RegionalLayout";
import RegionalDashboard from "../pages/dashboard/RegionalDashboard";
import RegionalLoanApplications from "../pages/LoanApplications/RegionalLoanApplications";
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


      </Route>


    </Routes>
  );
};

export default RegionalRoutes;
