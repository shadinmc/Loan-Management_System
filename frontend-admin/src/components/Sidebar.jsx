import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  IndianRupee,
  Repeat,
  CheckCircle
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
{/*       <div className="brand"> */}
{/*         <div className="brand-logo">LMS</div> */}
{/*         <span className="brand-text">Loan System</span> */}
{/*       </div> */}

      <nav>
        <NavLink to="/admin/dashboard" className="nav-link">
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

     <NavLink
       to="/admin/loan-applications"
       className={({ isActive }) =>
         isActive ? "nav-link active" : "nav-link"
       }
     >
       <FileText size={18} />
       Loan Applications
     </NavLink>


        <NavLink to="/admin/disbursements" className="nav-link">
          <IndianRupee size={18} />
          Disbursements
        </NavLink>

        <NavLink to="/admin/repayments" className="nav-link">
          <Repeat size={18} />
          Repayments
        </NavLink>

        <NavLink to="/admin/closure" className="nav-link">
          <CheckCircle size={18} />
          Loan Closure
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
