import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Lock, CheckCircle } from "lucide-react";
import "./LoanClosure.css";
import {
  closeLoanByManager,
  getManagerLoanClosures,
} from "../../api/loanClosureApi";

const normalize = (v) => (v ?? "").toLowerCase();
const formatInr = (value) => `INR ${Number(value || 0).toLocaleString()}`;

const LoanClosure = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const closuresQuery = useQuery({
    queryKey: ["manager-loan-closures", page, pageSize],
    queryFn: () => getManagerLoanClosures({ page, size: pageSize }),
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const closeMutation = useMutation({
    mutationFn: (loanId) => closeLoanByManager(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-loan-closures"] });
      queryClient.invalidateQueries({ queryKey: ["manager-repayments"] });
      queryClient.invalidateQueries({ queryKey: ["disbursements"] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to close loan";
      alert(message);
    },
  });

  const closurePage = closuresQuery.data;
  const loans = useMemo(() => closurePage?.content || [], [closurePage]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (filter !== "ALL" && loan.status !== filter) return false;
      if (!search) return true;
      const q = normalize(search);
      return (
        normalize(loan.loanId).includes(q) ||
        normalize(loan.fullName).includes(q)
      );
    });
  }, [loans, filter, search]);

  const count = (status) => loans.filter((loan) => loan.status === status).length;

  return (
    <>
      <div className="page-title">
        <h2>Loan Closure</h2>
        <p>Close fully repaid loans and track closed records</p>
      </div>

      <div className="stats-grid">
        <div
          className={`stat-card info ${filter === "ACTIVE" ? "active" : ""}`}
          onClick={() => {
            setFilter("ACTIVE");
            setPage(0);
          }}
        >
          <Lock />
          <span>Active Loans</span>
          <strong>{count("ACTIVE")}</strong>
        </div>

        <div
          className={`stat-card success ${filter === "CLOSED" ? "active" : ""}`}
          onClick={() => {
            setFilter("CLOSED");
            setPage(0);
          }}
        >
          <CheckCircle />
          <span>Closed Loans</span>
          <strong>{count("CLOSED")}</strong>
        </div>

        <div
          className={`stat-card neutral ${filter === "ALL" ? "active" : ""}`}
          onClick={() => {
            setFilter("ALL");
            setPage(0);
          }}
        >
          <CheckCircle />
          <span>All Loans</span>
          <strong>{closurePage?.totalElements ?? loans.length}</strong>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by loan ID or borrower name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {closuresQuery.isLoading ? (
        <div className="empty">Loading loan closure records...</div>
      ) : filteredLoans.length === 0 ? (
        <div className="empty">No loans available</div>
      ) : (
        filteredLoans.map((loan) => (
          <div className="closure-card" key={loan.loanId}>
            <div className="closure-header">
              <strong>{loan.loanId}</strong>
              <span
                className={`badge ${loan.status === "CLOSED" ? "success" : "warning"}`}
              >
                {loan.status}
              </span>
            </div>

            <p className={loan.status === "CLOSED" ? "closed-overline" : ""}>
              {loan.fullName || loan.userId}
            </p>

            <div className="closure-grid">
              <div>
                <label>Loan Amount</label>
                <strong>{formatInr(loan.loanAmount)}</strong>
              </div>

              <div>
                <label>Total Paid</label>
                <strong className="success">{formatInr(loan.totalPaidAmount)}</strong>
              </div>

              <div>
                <label>EMI Progress</label>
                <strong>{loan.paidEmis || 0}/{loan.totalEmis || 0}</strong>
              </div>

              <div>
                <label>Remaining Months</label>
                <strong>{loan.remainingMonths || 0}</strong>
              </div>
            </div>

            {loan.status === "ACTIVE" ? (
              <div className="closure-actions">
                <button
                  type="button"
                  className="close-loan-btn"
                  disabled={!loan.closureEligible || closeMutation.isPending}
                  onClick={() => closeMutation.mutate(loan.loanId)}
                >
                  {closeMutation.isPending ? "Closing..." : "Close Loan"}
                </button>
                {!loan.closureEligible && (
                  <span className="closure-note">Repayment in progress</span>
                )}
              </div>
            ) : (
              <div className="closure-note closed-overline">
                Closed on: {loan.closedAt ? new Date(loan.closedAt).toLocaleString() : "-"}
              </div>
            )}
          </div>
        ))
      )}

      <div className="pagination-bar">
        <button
          type="button"
          className="pager-btn"
          disabled={closurePage?.first || closuresQuery.isLoading}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
        >
          Previous
        </button>
        <span>
          Page {(closurePage?.page ?? 0) + 1} of {Math.max(closurePage?.totalPages ?? 1, 1)}
        </span>
        <button
          type="button"
          className="pager-btn"
          disabled={closurePage?.last || closuresQuery.isLoading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default LoanClosure;
