import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  IndianRupee,
  Repeat,
  CheckCircle,
  FileCheck
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const getNavClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <aside className="sidebar">
{/*       <div className="brand"> */}
{/*         <div className="brand-logo">LMS</div> */}
{/*         <span className="brand-text">Loan System</span> */}
{/*       </div> */}

      <nav>
        <NavLink to="/admin/dashboard" className={getNavClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/loan-applications" className={getNavClass}>
          <FileText size={18} />
          Loan Applications
        </NavLink>


        <NavLink to="/admin/disbursements" className={getNavClass}>
          <IndianRupee size={18} />
          Disbursements
        </NavLink>

        <NavLink to="/admin/repayments" className={getNavClass}>
          <Repeat size={18} />
          Repayments
        </NavLink>

        <NavLink to="/admin/kyc" className={getNavClass}>
          <FileCheck size={18} />
          KYC Verification
        </NavLink>

        <NavLink to="/admin/closure" className={getNavClass}>
          <CheckCircle size={18} />
          Loan Closure
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
