import { X, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchRegionalLoanReview,
  submitRegionalLoanDecision,
} from "../../api/regionalLoansApi";
import "./RegionalLoanReview.css";

const toLabel = (value) =>
  (value || "")
    .toLowerCase()
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

const RegionalLoanReview = ({ loan, onClose, onDecisionDone }) => {
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");

  const loanQuery = useQuery({
    queryKey: ["regional-loan-review", loan.loanId],
    queryFn: () => fetchRegionalLoanReview(loan.loanId),
    enabled: !!loan?.loanId,
    retry: false,
  });

  const decisionMutation = useMutation({
    mutationFn: (payload) => submitRegionalLoanDecision(loan.loanId, payload),
    onSuccess: () => {
      onDecisionDone?.();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit regional decision";
      alert(message);
    },
  });

  const details = loanQuery.data;

  const handleApprove = () => {
    decisionMutation.mutate({
      approved: true,
      remarks: "Approved by regional manager",
    });
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Rejection reason is required");
      return;
    }
    decisionMutation.mutate({
      approved: false,
      remarks: reason.trim(),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3>Application Review</h3>
            <p>{loan.loanId} - {toLabel(loan.loanType)}</p>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        {loanQuery.isLoading ? (
          <section className="card soft-blue">
            <p>Loading loan details...</p>
          </section>
        ) : (
          <>
            <section className="card soft-blue">
              <h4>Application Details</h4>
              <div className="grid-2">
                <div><label>Approved Amount</label><strong>INR {Number(loan.approvedAmount || 0).toLocaleString()}</strong></div>
                <div><label>Loan Type</label><strong>{toLabel(loan.loanType)}</strong></div>
                <div><label>Status</label><strong>{details?.status || loan.status}</strong></div>
                <div><label>User ID</label><strong>{loan.userId}</strong></div>
              </div>
            </section>

            <section className="card soft-green">
              <h4>Applicant Information</h4>
              <div className="grid-2">
                <div><label>Name</label><strong>{loan.fullName || "N/A"}</strong></div>
                <div><label>Email</label><strong>{loan.email || "N/A"}</strong></div>
              </div>
            </section>

            <section className="card soft-violet">
              <h4>Final Decision (Regional Manager)</h4>
              <p className="notes">
                On approval, loan moves to disbursement flow automatically.
              </p>

              <div className="decision-actions">
                <button
                  className="approve"
                  onClick={handleApprove}
                  disabled={decisionMutation.isPending}
                >
                  <CheckCircle /> Final Approval
                </button>

                <button
                  className="reject"
                  onClick={() => setDecision("REJECT")}
                  disabled={decisionMutation.isPending}
                >
                  <XCircle /> Final Rejection
                </button>
              </div>

              {decision === "REJECT" && (
                <div className="reject-box">
                  <label>Why are you rejecting this application?</label>
                  <textarea
                    placeholder="Enter detailed rejection reason..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <div className="actions">
                    <button className="cancel" onClick={() => setDecision(null)}>Cancel</button>
                    <button
                      className="confirm-reject"
                      onClick={handleReject}
                      disabled={decisionMutation.isPending}
                    >
                      {decisionMutation.isPending ? "Submitting..." : "Confirm Final Rejection"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default RegionalLoanReview;
