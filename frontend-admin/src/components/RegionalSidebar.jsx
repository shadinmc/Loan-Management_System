import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Repeat,
  CheckCircle,
  FileCheck
} from "lucide-react";

const RegionalSidebar = () => {
  return (
    <aside className="sidebar">
{/*       <div className="brand"> */}
{/*         <div className="brand-logo">LMS</div> */}
{/*         <span className="brand-text">Loan System</span> */}
{/*       </div> */}

      <nav>
        <NavLink to="/regional/dashboard" className="nav-link">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/regional/loan-applications" className="nav-link">
          <FileText size={18} />
          Loan Applications
        </NavLink>

        <NavLink to="/regional/disbursements" className="nav-link">
          <DollarSign size={18} />
          Disbursements
        </NavLink>

        <NavLink to="/regional/repayments" className="nav-link">
          <Repeat size={18} />
          Repayments
        </NavLink>

        <NavLink to="/regional/kyc" className="nav-link">
          <FileCheck size={18} />
          KYC Verification
        </NavLink>

        <NavLink to="/regional/loan-closure" className="nav-link">
          <CheckCircle size={18} />
          Loan Closure
        </NavLink>
      </nav>
    </aside>
  );
};

export default RegionalSidebar;
