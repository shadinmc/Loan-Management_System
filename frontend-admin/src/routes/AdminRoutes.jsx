import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
// import LoanQueue from "../pages/loans/LoanQueue";
// import LoanReview from "../pages/loans/LoanReview";
import RegionalDashboard from "../pages/dashboard/RegionalDashboard";
import Login from "../pages/auth/AdminLogin";



const AdminRoutes = () => {
  return (
    <BrowserRouter>
{/*       <Routes> */}
{/*         <Route path="/login/admin" element={<AdminLogin />} /> */}
{/*         <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
{/*         <Route path="/loans" element={<LoanQueue />} /> */}
{/*         <Route path="/loans/:id" element={<LoanReview />} /> */}
{/* <Route path="/regional/dashboard" element={<RegionalDashboard />} /> */}

{/*       </Routes> */}
 <Routes>


          {/* LOGIN */}
          <Route path="/login" element={<AdminLogin />} />

          {/* DASHBOARDS */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/regional/dashboard" element={<RegionalDashboard />} />

          {/* DEFAULT */}
          <Route path="*" element={<AdminLogin />} />
        </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
