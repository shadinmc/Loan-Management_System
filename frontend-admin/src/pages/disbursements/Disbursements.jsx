import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw
} from "lucide-react";
import "./Disbursements.css";
import { getDisbursements } from "../../api/disbursementApi";

const normalize = (v) => (v ?? "").toLowerCase();

const Disbursements = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const disbursementsQuery = useQuery({
    queryKey: ["disbursements"],
    queryFn: getDisbursements,
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const disbursements = useMemo(() => {
    const items = disbursementsQuery.data || [];
    return items.map((loan) => {
      const status = loan.status === "DISBURSEMENT_PENDING" ? "PENDING" : "COMPLETED";
      return {
        id: loan.loanId || loan.id,
        applicant: loan.userId,
        amount: Number(loan.loanAmount || 0),
        date: loan.disbursementScheduledAt || loan.disbursedAt || loan.updatedAt || null,
        status,
        txnId: loan.transactionId || "-"
      };
    });
  }, [disbursementsQuery.data]);

  /* =====================
     FILTERED DATA
     ===================== */
  const filteredData = disbursements.filter((d) => {
    if (statusFilter !== "ALL" && d.status !== statusFilter) return false;

    if (search) {
      const q = normalize(search);
      return (
        normalize(d.id).includes(q) ||
        normalize(d.applicant).includes(q) ||
        normalize(d.txnId).includes(q)
      );
    }

    return true;
  });

  /* =====================
     KPI COUNTS
     ===================== */
  const count = (status) =>
    disbursements.filter((d) => d.status === status).length;

  return (
    <>
      {/* PAGE TITLE */}
      <div className="page-title">
        <h2>Disbursement Management</h2>
        <p>Manage loan disbursements and monitor transaction status</p>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <div
          className={`stat-card warning ${statusFilter === "PENDING" ? "active" : ""}`}
          onClick={() => setStatusFilter("PENDING")}
        >
          <Clock />
          <span>Pending</span>
          <strong>{count("PENDING")}</strong>
        </div>

        <div
          className={`stat-card info ${statusFilter === "IN_PROGRESS" ? "active" : ""}`}
          onClick={() => setStatusFilter("IN_PROGRESS")}
        >
          <RefreshCcw />
          <span>In Progress</span>
          <strong>{count("IN_PROGRESS")}</strong>
        </div>

        <div
          className={`stat-card success ${statusFilter === "COMPLETED" ? "active" : ""}`}
          onClick={() => setStatusFilter("COMPLETED")}
        >
          <CheckCircle />
          <span>Completed</span>
          <strong>{count("COMPLETED")}</strong>
        </div>

        <div
          className={`stat-card danger ${statusFilter === "FAILED" ? "active" : ""}`}
          onClick={() => setStatusFilter("FAILED")}
        >
          <XCircle />
          <span>Failed</span>
          <strong>{count("FAILED")}</strong>
        </div>
      </div>

      {/* SEARCH */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by application #, name or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Loan Details</th>
              <th>Amount</th>
              <th>Scheduled Date</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {disbursementsQuery.isLoading ? (
              <tr>
                <td colSpan="5" className="empty">
                  Loading disbursements...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">
                  No disbursements found
                </td>
              </tr>
            ) : (
              filteredData.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.id}</strong>
                    <div className="sub">{d.applicant}</div>
                  </td>

                  <td>₹{d.amount.toLocaleString()}</td>
                  <td>{d.date ? new Date(d.date).toLocaleString() : "-"}</td>

                  <td>
                    <span className={`badge ${d.status.toLowerCase()}`}>
                      {d.status}
                    </span>
                  </td>

                  <td>{d.txnId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Disbursements;
