import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { fetchBranchLoans } from "../../api/branchLoansApi";
import LoanCard from "../../components/LoanCard";
import StatusBadge from "../../components/StatusBadge";
import LoanReview from "../loans/LoanReview";
import "./LoanApplications.css";

const LoanApplications = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const authRaw = localStorage.getItem("adminAuth");
  const auth = authRaw ? JSON.parse(authRaw) : null;
  const roles = auth?.roles || [];
  const canViewLoans = !!token && roles.includes("BRANCH_MANAGER");

  const { data: loans = [], isLoading, isError } = useQuery({
    queryKey: ["branch-loans", statusFilter, token],
    queryFn: () => fetchBranchLoans({ status: statusFilter }),
    enabled: canViewLoans,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (selectedType && loan.loanType !== selectedType) return false;

      if (
        search &&
        !loan.applicantName?.toLowerCase().includes(search.toLowerCase()) &&
        !loan.loanId?.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [loans, selectedType, search]);

  const loanTypeLabel = (loanType) => {
    switch (loanType) {
      case "PERSONAL":
        return "Personal Loan";
      case "VEHICLE":
        return "Vehicle Loan";
      case "BUSINESS":
        return "Business Loan";
      case "EDUCATION":
        return "Education Loan";
      default:
        return loanType || "Loan";
    }
  };

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Loan Applications</h2>
        <p>Review and manage loan applications by type</p>
      </div>

      {/* LOAN TYPE CARDS */}
      <div className="loan-card-grid">
        {[
          { id: "PERSONAL", label: "Personal Loan" },
          { id: "VEHICLE", label: "Vehicle Loan" },
          { id: "BUSINESS", label: "Business Loan" },
          { id: "EDUCATION", label: "Education Loan" },
        ].map((type) => (
          <LoanCard
            key={type.id}
            title={type.label}
            active={selectedType === type.id}
            onClick={() =>
              setSelectedType(selectedType === type.id ? null : type.id)
            }
          />
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by application #, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-filter"
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="ALL">All Status</option>
          <option value="UNDER_BRANCH_REVIEW">Under Branch Review</option>
          <option value="BRANCH_APPROVED">Branch Approved</option>
          <option value="BRANCH_REJECTED">Branch Rejected</option>
          <option value="CLARIFICATION_REQUIRED">Clarification Required</option>
          <option value="NOT_ELIGIBLE">Not Eligible</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Application #</th>
              <th>Loan Type</th>
              <th>Applicant</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>Loading applications...</td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6}>Failed to load applications.</td>
              </tr>
            )}
            {!isLoading && !isError && filteredLoans.length === 0 && (
              <tr>
                <td colSpan={6}>No applications found.</td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              filteredLoans.map((loan) => (
                <tr key={loan.loanId}>
                  <td>{loan.loanId}</td>
                  <td>{loanTypeLabel(loan.loanType)}</td>
                  <td>
                    <strong>{loan.applicantName}</strong>
                    <div className="email">{loan.email}</div>
                  </td>
                  <td className="amount">
                    INR {Number(loan.loanAmount || 0).toLocaleString()}
                  </td>
                  <td>
                    <StatusBadge status={loan.status} />
                  </td>
                  <td>
                    <button
                      className="review-btn"
                      onClick={() => setSelectedLoanId(loan.loanId)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedLoanId && (
        <LoanReview
          loanId={selectedLoanId}
          onClose={() => setSelectedLoanId(null)}
        />
      )}
    </>
  );
};

export default LoanApplications;
