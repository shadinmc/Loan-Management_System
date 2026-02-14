import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  Search,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import "./Repayments.css";
import {
  getManagerRepaymentDetail,
  getManagerRepayments,
} from "../../api/repaymentApi";

const normalize = (v) => (v ?? "").toLowerCase();
const STATUS_LABELS = {
  ACTIVE: "Active",
  CLOSED: "Closed",
};

const formatInr = (value) => `INR ${Number(value || 0).toLocaleString()}`;

const RepaymentMonitoring = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const repaymentsQuery = useQuery({
    queryKey: ["manager-repayments"],
    queryFn: getManagerRepayments,
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const detailQuery = useQuery({
    queryKey: ["manager-repayment-detail", selectedLoanId],
    queryFn: () => getManagerRepaymentDetail(selectedLoanId),
    enabled: Boolean(selectedLoanId),
    retry: false,
  });

  const loans = useMemo(() => repaymentsQuery.data || [], [repaymentsQuery.data]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        normalize(loan.loanId).includes(normalize(search)) ||
        normalize(loan.fullName).includes(normalize(search));
      const matchesFilter = filter === "ALL" || loan.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [loans, search, filter]);

  const countByStatus = (status) => loans.filter((loan) => loan.status === status).length;

  const selectedLoan = detailQuery.data || null;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Repayment Monitoring</h2>
          <p>Track repayment by loan ID with progress and loan lifecycle status</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi warning">
          <Clock /> Active <strong>{countByStatus("ACTIVE")}</strong>
        </div>
        <div className="kpi success">
          <CheckCircle /> Closed <strong>{countByStatus("CLOSED")}</strong>
        </div>
        <div className="kpi info">
          <CheckCircle /> Total Loans <strong>{loans.length}</strong>
        </div>
      </div>

      <div className="table-filter">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by Loan ID or Full Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Loan</th>
              <th>Total Paid</th>
              <th>Remaining Months</th>
              <th>Paid Progress</th>
              <th>Next EMI</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {repaymentsQuery.isLoading ? (
              <tr>
                <td colSpan="7" className="empty">
                  Loading repayments...
                </td>
              </tr>
            ) : filteredLoans.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty">
                  No results found
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr
                  key={loan.loanId}
                  className={loan.status === "CLOSED" ? "row-overdue" : ""}
                >
                  <td>
                    <strong>{loan.loanId}</strong>
                    <div className="muted">{loan.fullName || loan.userId}</div>
                  </td>
                  <td>{formatInr(loan.totalPaidAmount)}</td>
                  <td>{loan.remainingMonths ?? 0}</td>
                  <td>
                    <div className="progress-bar">
                      <span style={{ width: `${loan.paidProgressPercent || 0}%` }} />
                    </div>
                    {loan.paidEmis || 0}/{loan.totalEmis || 0} EMIs ({loan.paidProgressPercent || 0}%)
                  </td>
                  <td>
                    {loan.nextEmiDate ? new Date(loan.nextEmiDate).toLocaleDateString() : "-"}
                    <div className="muted">
                      {loan.nextEmiAmount ? formatInr(loan.nextEmiAmount) : ""}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${normalize(loan.status)}`}>
                      {STATUS_LABELS[loan.status] || loan.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => setSelectedLoanId(loan.loanId)}>
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLoanId && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Repayment Detail - {selectedLoanId}</h3>
              <X onClick={() => setSelectedLoanId(null)} />
            </div>

            {detailQuery.isLoading || !selectedLoan ? (
              <div className="empty">Loading repayment detail...</div>
            ) : (
              <>
                <div className="detail-summary-grid">
                  <div><strong>Borrower:</strong> {selectedLoan.fullName || selectedLoan.userId}</div>
                  <div><strong>Total Paid:</strong> {formatInr(selectedLoan.totalPaidAmount)}</div>
                  <div><strong>Remaining Months:</strong> {selectedLoan.remainingMonths}</div>
                  <div><strong>Progress:</strong> {selectedLoan.paidProgressPercent}%</div>
                  <div><strong>Status:</strong> {STATUS_LABELS[selectedLoan.status] || selectedLoan.status}</div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Due Date</th>
                      <th>EMI Amount</th>
                      <th>Paid Amount</th>
                      <th>Penalty</th>
                      <th>Status</th>
                      <th>Paid On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedLoan.emis || []).map((emi) => (
                      <tr
                        key={emi.emiNumber}
                        className={emi.status === "OVERDUE" ? "row-overdue" : ""}
                      >
                        <td>{emi.emiNumber}</td>
                        <td>{emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : "-"}</td>
                        <td>{formatInr(emi.emiAmount)}</td>
                        <td>{formatInr(emi.paidAmount)}</td>
                        <td>{formatInr(emi.penaltyAmount)}</td>
                        <td>{STATUS_LABELS[emi.status] || emi.status}</td>
                        <td>{emi.paidAt ? new Date(emi.paidAt).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RepaymentMonitoring;
