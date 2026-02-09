import {
  MdOutlinePendingActions,
  MdOutlineCancel,
  MdOutlineTrendingUp
} from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";



const AdminDashboard = () => {
    const navigate = useNavigate();
  // MOCK DATA (temporary until backend API)
  const mockLoans = [
    {
      id: "LN-2026-006",
      applicant: "Meera Nair",
      type: "Vehicle Loan",
      amount: 600000,
      status: "PENDING_BRANCH"
    },
    {
      id: "LN-2026-008",
      applicant: "Kavita Shah",
      type: "Business Loan",
      amount: 1500000,
      status: "PENDING_BRANCH"
    },
    {
      id: "LN-2026-001",
      applicant: "Amit Patel",
      type: "Personal Loan",
      amount: 500000,
      status: "PENDING_BRANCH"
    },
    {
      id: "LN-2026-005",
      applicant: "Rahul Verma",
      type: "Personal Loan",
      amount: 300000,
      status: "BRANCH_REJECTED"
    },
    {
      id: "LN-2026-002",
      applicant: "Sneha Reddy",
      type: "Vehicle Loan",
      amount: 750000,
      status: "ACTIVE"
    }
  ];

  // KPI Calculations
  const pending = mockLoans.filter(l => l.status === "PENDING_BRANCH").length;
  const rejected = mockLoans.filter(l => l.status === "BRANCH_REJECTED").length;
  const active = mockLoans.filter(l => l.status === "ACTIVE").length;
  const approved = 0;

  // Loan type counts
  const loanTypes = {
    personal: mockLoans.filter(l => l.type === "Personal Loan").length,
    vehicle: mockLoans.filter(l => l.type === "Vehicle Loan").length,
    business: mockLoans.filter(l => l.type === "Business Loan").length,
    education: 2
  };

  const getBadgeClass = (status) => {
    if (status === "PENDING_BRANCH") return "badge warning";
    if (status === "BRANCH_REJECTED") return "badge danger";
    if (status === "ACTIVE") return "badge success";
    return "badge";
  };

  const getStatusText = (status) => {
    if (status === "PENDING_BRANCH") return "Pending Branch Review";
    if (status === "BRANCH_REJECTED") return "Branch Rejected";
    if (status === "ACTIVE") return "Active Loan";
    return status;
  };

  return (
    <>
      {/* PAGE TITLE */}
      <section className="page-title">
        <h2>Branch Manager Dashboard</h2>
        <p>Review and approve loan applications.</p>
      </section>

      {/* KPI CARDS */}
      <section className="stats-grid">
        <div className="stat-card warning">
          <MdOutlinePendingActions />
          <div>
            <p>Pending Review</p>
            <h3>{pending}</h3>
          </div>
        </div>

        <div className="stat-card success">
          <FiCheckCircle />
          <div>
            <p>Branch Approved</p>
            <h3>{approved}</h3>
          </div>
        </div>

        <div className="stat-card danger">
          <MdOutlineCancel />
          <div>
            <p>Branch Rejected</p>
            <h3>{rejected}</h3>
          </div>
        </div>

        <div className="stat-card info">
          <MdOutlineTrendingUp />
          <div>
            <p>Active Loans</p>
            <h3>{active}</h3>
          </div>
        </div>
      </section>

      {/* LOAN TYPES OVERVIEW */}
      <section className="card">
        <h3>Loan Types Overview</h3>

        <div className="loan-types">
          <div>
            <span>Personal Loan</span>
            <strong>{loanTypes.personal}</strong>
          </div>

          <div>
            <span>Vehicle Loan</span>
            <strong>{loanTypes.vehicle}</strong>
          </div>

          <div>
            <span>Business Loan</span>
            <strong>{loanTypes.business}</strong>
          </div>

          <div>
            <span>Education Loan</span>
            <strong>{loanTypes.education}</strong>
          </div>
        </div>
      </section>

      {/* RECENT APPLICATIONS */}
      <section className="card">
        <div className="card-header">
          <h3>Recent Applications</h3>
          <span
            className="link"
            onClick={() => navigate("/admin/loan-applications")}
            style={{ cursor: "pointer" }}
          >
            View all →
          </span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Application #</th>
              <th>Applicant</th>
              <th>Loan Type</th>
              <th className="amount">Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {mockLoans.slice(0, 3).map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.applicant}</td>
                <td>{loan.type}</td>
                <td className="amount">
                  ₹{loan.amount.toLocaleString()}
                </td>
                <td>
                  <span className={getBadgeClass(loan.status)}>
                    {getStatusText(loan.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminDashboard;
