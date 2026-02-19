import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Repeat,
  CheckCircle,
  FileCheck
} from "lucide-react";
import "./Sidebar.css";

const RegionalSidebar = () => {
  const getNavClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <aside className="sidebar">
{/*       <div className="brand"> */}
{/*         <div className="brand-logo">LMS</div> */}
{/*         <span className="brand-text">Loan System</span> */}
{/*       </div> */}

      <nav>
        <NavLink to="/regional/dashboard" className={getNavClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/regional/loan-applications" className={getNavClass}>
          <FileText size={18} />
          Loan Applications
        </NavLink>

        <NavLink to="/regional/disbursements" className={getNavClass}>
          <DollarSign size={18} />
          Disbursements
        </NavLink>

        <NavLink to="/regional/repayments" className={getNavClass}>
          <Repeat size={18} />
          Repayments
        </NavLink>

        <NavLink to="/regional/kyc" className={getNavClass}>
          <FileCheck size={18} />
          KYC Verification
        </NavLink>

        <NavLink to="/regional/loan-closure" className={getNavClass}>
          <CheckCircle size={18} />
          Loan Closure
        </NavLink>

        <NavLink to="/regional/audit-logs" className="nav-link">
          <FileText size={18} />
          Audit Logs
        </NavLink>
      </nav>
    </aside>
  );
};

export default RegionalSidebar;
