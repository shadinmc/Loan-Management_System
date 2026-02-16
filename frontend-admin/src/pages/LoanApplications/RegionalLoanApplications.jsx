import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import RegionalLoanReview from "../loans/RegionalLoanReview";
import { fetchRegionalLoans } from "../../api/regionalLoansApi";
import "./RegionalLoanApplications.css";

const RegionalLoanApplications = () => {
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const loansQuery = useQuery({
    queryKey: ["regional-loans"],
    queryFn: fetchRegionalLoans,
    enabled: !!localStorage.getItem("token"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loans = useMemo(() => {
    const items = loansQuery.data || [];
    return items.map((loan) => ({
      id: loan.loanId,
      applicant: loan.userId || "N/A",
      loanType: loan.loanType || "N/A",
      amount: Number(loan.approvedAmount || 0),
      status: loan.status,
      updatedAt: loan.updatedAt,
    }));
  }, [loansQuery.data]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (statusFilter !== "ALL" && loan.status !== statusFilter) return false;

      if (search) {
        const q = search.toLowerCase();
        const applicant = String(loan.applicant || "").toLowerCase();
        const id = String(loan.id || "").toLowerCase();
        if (!applicant.includes(q) && !id.includes(q)) return false;
      }

      return true;
    });
  }, [loans, search, statusFilter]);

  return (
    <>
      <div className="page-title">
        <h2>Loan Applications</h2>
        <p>Final approval by Regional Manager</p>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by application # or user"
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
          <option value="UNDER_REGIONAL_REVIEW">Under Regional Review</option>
          <option value="DISBURSEMENT_PENDING">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

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
            {loansQuery.isLoading && (
              <tr>
                <td colSpan="6" className="empty-state">
                  Loading applications...
                </td>
              </tr>
            )}

            {loansQuery.isError && (
              <tr>
                <td colSpan="6" className="empty-state">
                  Failed to load applications
                </td>
              </tr>
            )}

            {!loansQuery.isLoading && !loansQuery.isError && filteredLoans.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  No applications found
                </td>
              </tr>
            )}

            {!loansQuery.isLoading &&
              !loansQuery.isError &&
              filteredLoans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.loanType}</td>
                  <td>
                    <strong>{loan.applicant}</strong>
                  </td>
                  <td className="amount">INR {loan.amount.toLocaleString()}</td>
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
              ))}
          </tbody>
        </table>
      </div>

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
