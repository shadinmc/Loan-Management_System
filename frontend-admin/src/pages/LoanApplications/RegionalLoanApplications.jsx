import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import StatusBadge from "../../components/StatusBadge";
import RegionalLoanReview from "../loans/RegionalLoanReview";
import { fetchRegionalPendingLoans } from "../../api/regionalLoansApi";
import "./RegionalLoanApplications.css";

const LOAN_TYPES = [
  { value: "PERSONAL", label: "Personal Loan" },
  { value: "VEHICLE", label: "Vehicle Loan" },
  { value: "BUSINESS", label: "Business Loan" },
  { value: "EDUCATION", label: "Education Loan" }
];

const formatLoanType = (loanType) => {
  const match = LOAN_TYPES.find((type) => type.value === loanType);
  if (match) return match.label;
  if (!loanType) return "N/A";
  return loanType.replaceAll("_", " ");
};

const getStoredToken = () => {
  const rawAuth = localStorage.getItem("adminAuth");
  const parsedAuth = rawAuth ? JSON.parse(rawAuth) : null;
  return localStorage.getItem("token") || parsedAuth?.token || null;
};

const RegionalLoanApplications = () => {
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const token = getStoredToken();

  const loansQuery = useQuery({
    queryKey: ["regional-loans-pending"],
    queryFn: fetchRegionalPendingLoans,
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loans = useMemo(() => {
    const items = loansQuery.data || [];
    return items.map((loan) => ({
      id: loan.loanId || loan.id,
      applicant: loan.applicantName || loan.userName || loan.userId || "N/A",
      email: loan.email || loan.userEmail || "N/A",
      type: formatLoanType(loan.loanType),
      amount: Number(loan.approvedAmount ?? loan.loanAmount ?? 0),
      status: loan.status || "BRANCH_APPROVED",
      raw: loan,
    }));
  }, [loansQuery.data]);

  /* ===========================
     FILTER LOGIC
     =========================== */
  const filteredLoans = loans.filter((loan) => {
    if (selectedType && loan.raw?.loanType !== selectedType) return false;

    if (statusFilter !== "ALL" && loan.status !== statusFilter) return false;

    if (search) {
      const q = search.toLowerCase();
      const applicant = loan.applicant?.toLowerCase() || "";
      const id = loan.id?.toLowerCase() || "";

      if (!applicant.includes(q) && !id.includes(q)) return false;
    }

    return true;
  });

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Loan Applications</h2>
        <p>Final approval by Regional Manager</p>
      </div>

      {/* LOAN TYPE CARDS */}
      <div className="loan-card-grid">
        {LOAN_TYPES.map((type) => (
          <div
            key={type.value}
            className={`loan-type-card ${
              selectedType === type.value ? "active" : ""
            }`}
            onClick={() =>
              setSelectedType(selectedType === type.value ? null : type.value)
            }
          >
            {type.label}
          </div>
        ))}
      </div>

      {/* SEARCH + STATUS FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by application # or applicant"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="BRANCH_APPROVED">Pending My Review</option>
          <option value="DISBURSEMENT_PENDING">Approved</option>
          <option value="REJECTED">Rejected</option>
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
              <th className="amount">Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loansQuery.isLoading ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Loading applications...
                </td>
              </tr>
            ) : loansQuery.isError ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  Failed to load applications
                </td>
              </tr>
            ) : filteredLoans.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.type}</td>
                  <td>
                    <strong>{loan.applicant}</strong>
                    <div className="email">{loan.email}</div>
                  </td>
                  <td className="amount">
                    INR {loan.amount.toLocaleString()}
                  </td>
                  <td>
                    <StatusBadge status={loan.status} />
                  </td>
                  <td>
                    <button
                      className="review-btn"
                      onClick={() => setSelectedLoanId(loan.id)}
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

      {/* REVIEW MODAL */}
      {selectedLoanId && (
        <RegionalLoanReview
          loanId={selectedLoanId}
          onClose={() => setSelectedLoanId(null)}
        />
      )}
    </>
  );
};

export default RegionalLoanApplications;
