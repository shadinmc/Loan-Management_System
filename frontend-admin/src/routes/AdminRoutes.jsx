import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
// import LoanQueue from "../pages/loans/LoanQueue";
// import LoanReview from "../pages/loans/LoanReview";

const AdminRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
{/*         <Route path="/loans" element={<LoanQueue />} /> */}
{/*         <Route path="/loans/:id" element={<LoanReview />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
