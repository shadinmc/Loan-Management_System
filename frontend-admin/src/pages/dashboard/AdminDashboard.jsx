import {
  MdOutlinePendingActions,
  MdOutlineCancel,
  MdOutlineTrendingUp
} from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchBranchLoans } from "../../api/branchLoansApi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const data = await fetchBranchLoans({ page: 0, size: 500 });
      setLoans(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.error("Error loading dashboard loans", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  // ===== KPI calculations =====
  const pending = loans.filter(l => l.status === "UNDER_BRANCH_REVIEW").length;
  const rejected = loans.filter(l => l.status === "BRANCH_REJECTED").length;
  const approved = loans.filter(l => l.status === "BRANCH_APPROVED").length;
  const active = loans.filter(l => l.status === "ACTIVE").length;

  // ===== Loan type counts =====
  const loanTypes = {
    personal: loans.filter(l => l.loanType === "PERSONAL").length,
    vehicle: loans.filter(l => l.loanType === "VEHICLE").length,
    business: loans.filter(l => l.loanType === "BUSINESS").length,
    education: loans.filter(l => l.loanType === "EDUCATION").length
  };

  // ===== Badge helpers (UNCHANGED) =====
  const getBadgeClass = (status) => {
    if (status === "UNDER_BRANCH_REVIEW") return "badge warning";
    if (status === "BRANCH_REJECTED") return "badge danger";
    if (status === "ACTIVE") return "badge success";
    if (status === "BRANCH_APPROVED") return "badge success";
    return "badge";
  };

  const getStatusText = (status) => {
    if (status === "UNDER_BRANCH_REVIEW") return "Pending Branch Review";
    if (status === "BRANCH_REJECTED") return "Branch Rejected";
    if (status === "BRANCH_APPROVED") return "Branch Approved";
    if (status === "ACTIVE") return "Active Loan";
    return status;
  };

  // ✅ ONLY 5 PENDING APPLICATIONS FOR DASHBOARD
  const pendingApplications = loans
    .filter(l =>   l.status === "UNDER_BRANCH_REVIEW" || 
                        l.status === "APPLIED")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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

      {/* PENDING APPLICATIONS (LIMIT 5) */}
      <section className="card">
        <div className="card-header">
          <h3>Pending Applications</h3>
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
            {pendingApplications.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No pending applications
                </td>
              </tr>
            ) : (
              pendingApplications.map((loan) => (
                <tr key={loan.loanId}>
                  <td>{loan.loanId}</td>
                  <td>{loan.applicantName}</td>
                  <td>{loan.loanType}</td>
                  <td className="amount">
                    ₹{loan.loanAmount?.toLocaleString?.() || "-"}
                  </td>
                  <td>
                    <span className={getBadgeClass(loan.status)}>
                      {getStatusText(loan.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminDashboard;
