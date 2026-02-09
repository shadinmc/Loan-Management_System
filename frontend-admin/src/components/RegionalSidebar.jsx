import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Repeat,
  CheckCircle,
  ClipboardList
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

        <NavLink to="/regional/loan-closure" className="nav-link">
          <CheckCircle size={18} />
          Loan Closure
        </NavLink>

        <NavLink to="/regional/audit-logs" className="nav-link">
          <ClipboardList size={18} />
          Audit Logs
        </NavLink>
      </nav>
    </aside>
  );
};

export default RegionalSidebar;
