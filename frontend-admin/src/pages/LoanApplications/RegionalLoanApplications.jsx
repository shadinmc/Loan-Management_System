import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import RegionalLoanReview from "../loans/RegionalLoanReview";
import { fetchRegionalPendingLoans } from "../../api/regionalLoansApi";
import "./RegionalLoanApplications.css";

const LOAN_TYPE_FILTERS = ["PERSONAL", "VEHICLE", "BUSINESS", "EDUCATION"];

const normalize = (v) => (v ?? "").toLowerCase();
const toLabel = (value) =>
  (value || "")
    .toLowerCase()
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

const RegionalLoanApplications = () => {
  const queryClient = useQueryClient();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [search, setSearch] = useState("");

  const loansQuery = useQuery({
    queryKey: ["regional-pending-loans"],
    queryFn: fetchRegionalPendingLoans,
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const loans = useMemo(() => loansQuery.data || [], [loansQuery.data]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (selectedType && loan.loanType !== selectedType) return false;
      if (!search) return true;
      const q = normalize(search);
      return (
        normalize(loan.loanId).includes(q) ||
        normalize(loan.fullName).includes(q) ||
        normalize(loan.email).includes(q)
      );
    });
  }, [loans, selectedType, search]);

  const countByType = (type) => loans.filter((loan) => loan.loanType === type).length;

  return (
    <>
      <div className="page-title">
        <h2>Loan Applications</h2>
        <p>Regional review queue (branch approved loans only)</p>
      </div>

      <div className="loan-type-grid">
        {LOAN_TYPE_FILTERS.map((type) => (
          <div
            key={type}
            className={`loan-type-card ${selectedType === type ? "active" : ""}`}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
          >
            {toLabel(type)} ({countByType(type)})
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by loan ID, applicant, email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Application #</th>
              <th>Loan Type</th>
              <th>Applicant</th>
              <th className="amount">Approved Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loansQuery.isLoading ? (
              <tr>
                <td colSpan="6" className="empty-state">Loading applications...</td>
              </tr>
            ) : filteredLoans.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No branch-approved applications found</td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr key={loan.loanId}>
                  <td>{loan.loanId}</td>
                  <td>{toLabel(loan.loanType)}</td>
                  <td>
                    <strong>{loan.fullName || loan.userId}</strong>
                    <div className="email">{loan.email || "N/A"}</div>
                  </td>
                  <td className="amount">INR {Number(loan.approvedAmount || 0).toLocaleString()}</td>
                  <td>
                    <StatusBadge status={loan.status} />
                  </td>
                  <td>
                    <button
                      className="review-btn"
                      onClick={() => setSelectedLoan(loan)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLoan && (
        <RegionalLoanReview
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
          onDecisionDone={() => {
            queryClient.invalidateQueries({ queryKey: ["regional-pending-loans"] });
            setSelectedLoan(null);
          }}
        />
      )}
    </>
  );
};

export default RegionalLoanApplications;
