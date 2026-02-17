import { Users, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRegionalPendingLoans } from "../../api/regionalLoansApi";
import "./RegionalDashboard.css";
import StatusBadge from "../../components/StatusBadge";
const LOAN_TYPES = ["PERSONAL", "VEHICLE", "BUSINESS", "EDUCATION"];

const toLabel = (value) =>
  (value || "")
    .toLowerCase()
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

const RegionalDashboard = () => {
  const navigate = useNavigate();

  const pendingLoansQuery = useQuery({
    queryKey: ["regional-pending-loans", "dashboard"],
    queryFn: () => fetchRegionalPendingLoans({ page: 0, size: 500 }),
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const pendingLoanPage = pendingLoansQuery.data;
  const pendingLoans = useMemo(() => pendingLoanPage?.content || [], [pendingLoanPage]);
  const totalPending = pendingLoanPage?.totalElements ?? pendingLoans.length;

  const typeCounts = useMemo(() => {
    return LOAN_TYPES.reduce((acc, type) => {
      acc[type] = pendingLoans.filter((loan) => loan.loanType === type).length;
      return acc;
    }, {});
  }, [pendingLoans]);

  return (
    <>
      <section className="page-title">
        <h2>Regional Manager Dashboard</h2>
        <p>Review branch-approved applications and take final regional decisions.</p>
      </section>

      <section className="stats-grid">
        <div
          className="stat-card warning"
          onClick={() => navigate("/regional/loan-applications")}
        >
          <Users />
          <div>
            <p>Branch Approved Queue</p>
            <h3>{totalPending}</h3>
            <span>Open queue</span>
          </div>
        </div>

        <div className="stat-card success">
          <CheckCircle />
          <div>
            <p>Loan Types in Queue</p>
            <h3>{LOAN_TYPES.filter((type) => typeCounts[type] > 0).length}</h3>
          </div>
        </div>

        <div className="stat-card neutral">
          <FileText />
          <div>
            <p>Total Applications</p>
            <h3>{totalPending}</h3>
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Loan Portfolio Distribution (Branch Approved)</h3>
        <div className="loan-types">
          {LOAN_TYPES.map((type) => (
            <div key={type}>
              <span>{toLabel(type)}</span>
              <strong>{typeCounts[type] || 0} loans</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Awaiting Your Approval</h3>
          <span
            className="link"
            onClick={() => navigate("/regional/loan-applications")}
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
              <th className="amount">Approved Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {pendingLoansQuery.isLoading ? (
              <tr>
                <td colSpan="5">Loading queue...</td>
              </tr>
            ) : pendingLoans.length === 0 ? (
              <tr>
                <td colSpan="5">No branch-approved applications pending</td>
              </tr>
            ) : (
              pendingLoans.slice(0, 5).map((loan) => (
                <tr key={loan.loanId}>
                  <td>{loan.loanId}</td>
                  <td>{loan.fullName || loan.userId}</td>
                  <td>{toLabel(loan.loanType)}</td>
                  <td className="amount">INR {Number(loan.approvedAmount || 0).toLocaleString()}</td>
                  <td>
                      <StatusBadge status={loan.status} />
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

export default RegionalDashboard;
