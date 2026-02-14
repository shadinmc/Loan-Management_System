import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import "./Disbursements.css";
import { getDisbursements } from "../../api/disbursementApi";

const normalize = (v) => (v ?? "").toLowerCase();
const ALLOWED_STATUSES = [
  "DISBURSEMENT_PENDING",
  "DISBURSED",
  "ACTIVE",
  "CLOSED",
];
const STATUS_LABELS = {
  DISBURSEMENT_PENDING: "Disbursement Pending",
  DISBURSED: "Disbursed",
  ACTIVE: "Active",
  CLOSED: "Closed",
};

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
    return items
      .map((loan) => {
        const status = loan.status;
        if (!ALLOWED_STATUSES.includes(status)) return null;

        return {
          id: loan.loanId || loan.id,
          applicant: loan.userId,
          amount: Number(loan.amount || loan.loanAmount || 0),
          date:
            loan.transactionDoneAt ||
            loan.disbursementScheduledAt ||
            loan.disbursedAt ||
            loan.updatedAt ||
            null,
          status,
          txnId: loan.transactionId || "-",
        };
      })
      .filter(Boolean);
  }, [disbursementsQuery.data]);

  const filteredData = disbursements.filter((d) => {
    if (statusFilter !== "ALL" && d.status !== statusFilter) return false;
    if (!search) return true;

    const q = normalize(search);
    return (
      normalize(d.id).includes(q) ||
      normalize(d.applicant).includes(q) ||
      normalize(d.txnId).includes(q)
    );
  });

  const count = (status) => disbursements.filter((d) => d.status === status).length;

  return (
    <>
      <div className="page-title">
        <h2>Disbursement Management</h2>
        <p>Track loan disbursements for branch and regional operations</p>
      </div>

      <div className="stats-grid">
        <div
          className={`stat-card warning ${statusFilter === "DISBURSEMENT_PENDING" ? "active" : ""}`}
          onClick={() => setStatusFilter("DISBURSEMENT_PENDING")}
        >
          <Clock />
          <span>Disbursement Pending</span>
          <strong>{count("DISBURSEMENT_PENDING")}</strong>
        </div>

        <div
          className={`stat-card info ${statusFilter === "DISBURSED" ? "active" : ""}`}
          onClick={() => setStatusFilter("DISBURSED")}
        >
          <RefreshCcw />
          <span>Disbursed</span>
          <strong>{count("DISBURSED")}</strong>
        </div>

        <div
          className={`stat-card success ${statusFilter === "ACTIVE" ? "active" : ""}`}
          onClick={() => setStatusFilter("ACTIVE")}
        >
          <CheckCircle />
          <span>Active</span>
          <strong>{count("ACTIVE")}</strong>
        </div>

        <div
          className={`stat-card danger ${statusFilter === "CLOSED" ? "active" : ""}`}
          onClick={() => setStatusFilter("CLOSED")}
        >
          <XCircle />
          <span>Closed</span>
          <strong>{count("CLOSED")}</strong>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by loan ID, user ID or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Loan Details</th>
              <th>Amount</th>
              <th>Date</th>
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
                <tr key={`${d.id}-${d.txnId}`}>
                  <td>
                    <strong>{d.id}</strong>
                    <div className="sub">{d.applicant}</div>
                  </td>

                  <td>INR {d.amount.toLocaleString()}</td>
                  <td>{d.date ? new Date(d.date).toLocaleString() : "-"}</td>

                  <td>
                    <span className={`badge ${d.status.toLowerCase()}`}>
                      {STATUS_LABELS[d.status] || d.status}
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
