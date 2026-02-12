import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  X
} from "lucide-react";
import {
  makeBranchDecision,
  runEligibilityCheck
} from "../../api/loanReviewApi";
import "./LoanReview.css";

const LoanReview = ({ loan, onClose, onDecisionComplete }) => {
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [eligibility, setEligibility] = useState(null);
  const [finalDecision, setFinalDecision] = useState(null);

  if (!loan) return null;

  // ===== ELIGIBILITY =====
  const handleEligibility = async () => {
    try {
      setLoading(true);
      const res = await runEligibilityCheck(loan.loanId);
      setEligibility(res.data);
    } catch (err) {
      console.error(err);
      alert("Eligibility check failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== DECISIONS =====
  const handleApprove = async () => {
    try {
      setLoading(true);
      await makeBranchDecision(loan.loanId, { decision: "APPROVE" });
      setFinalDecision("APPROVED");
      onDecisionComplete();
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Rejection reason is required");
      return;
    }

    try {
      setLoading(true);
      await makeBranchDecision(loan.loanId, {
        decision: "REJECT",
        message: reason
      });
      setFinalDecision("REJECTED");
      onDecisionComplete();
    } catch (err) {
      console.error(err);
      alert("Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClarification = async () => {
    if (!reason.trim()) {
      alert("Clarification message required");
      return;
    }

    try {
      setLoading(true);
      await makeBranchDecision(loan.loanId, {
        decision: "CLARIFICATION_REQUIRED",
        message: reason
      });
      setFinalDecision("CLARIFICATION_REQUIRED");
      onDecisionComplete();
    } catch (err) {
      console.error(err);
      alert("Clarification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="review-modal animate-in">
        <div className="review-header">
          <div>
            <h2>Application Review</h2>
            <p>{loan.loanId} – {loan.loanType}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">

          {/* APPLICATION DETAILS */}
          <section className="review-card">
            <h4 className="section-title">
              <FileText size={16} /> Application Details
            </h4>

            <div className="info-grid">
              <div className="info-item">
                <label>Application Number</label>
                <strong>{loan.loanId}</strong>
              </div>

              <div className="info-item">
                <label>Loan Type</label>
                <strong>{loan.loanType}</strong>
              </div>

              <div className="info-item">
                <label>EMI Amount</label>
                <strong>₹{loan.emiAmount?.toLocaleString()}</strong>
              </div>

              <div className="info-item">
                <label>Status</label>
                <span className="badge warning">{loan.status}</span>
              </div>
            </div>
          </section>

          {/* ELIGIBILITY */}
          <section className="review-card">
            <h4 className="section-title">Eligibility Assessment</h4>

            {!eligibility && (
              <button
                className="btn-manual"
                onClick={handleEligibility}
                disabled={loading}
              >
                Run Eligibility Check
              </button>
            )}

            {eligibility && (
              <div className="eligibility-result animate-in">
                <div
                  className={`eligibility-status ${
                    eligibility.eligible ? "success" : "danger"
                  }`}
                >
                  {eligibility.eligible ? "✅ Eligible" : "❌ Not Eligible"}
                </div>

                <div className="eligibility-row">
                  <label>Score</label>
                  <strong>{eligibility.score}</strong>
                </div>

                <div className="eligibility-row">
                  <label>Approved Amount</label>
                  <strong>
                    ₹{eligibility.approvedAmount?.toLocaleString() ?? "N/A"}
                  </strong>

                </div>

                <div className="eligibility-remarks">
                  <strong>Remarks:</strong> {eligibility.remarks}
                </div>

                {eligibility.passedRules?.length > 0 && (
                  <div className="rules-box success">
                    <h5>✅ Passed Rules</h5>
                    <ul>
                      {eligibility.passedRules.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {eligibility.failedRules?.length > 0 && (
                  <div className="rules-box danger">
                    <h5>❌ Failed Rules</h5>
                    <ul>
                      {eligibility.failedRules.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* DECISION */}
          <section className="review-card decision-section">
            <h4 className="section-title">Make Your Decision</h4>

            {/* FINAL STATE */}
            {finalDecision && (
              <div className={`final-decision ${finalDecision.toLowerCase()}`}>
                {finalDecision === "APPROVED" && "✅ Approved & Forwarded"}
                {finalDecision === "REJECTED" && "❌ Application Rejected"}
                {finalDecision === "CLARIFICATION_REQUIRED" &&
                  "⚠️ Clarification Requested"}
              </div>
            )}

            {/* BUTTONS ONLY IF NOT DECIDED */}
            {!finalDecision && (
              <>
                <div className="decision-buttons">
                  <button
                    className="btn-approve"
                    onClick={handleApprove}
                    disabled={loading || !eligibility?.eligible}
                  >
                    <CheckCircle size={20} />
                    <div className="btn-text">
                      Approve
                      <span>Forward to Regional</span>
                    </div>
                  </button>

                  <button
                    className="btn-manual"
                    onClick={() => setDecision("CLARIFICATION")}
                    disabled={loading}
                  >
                    <AlertTriangle size={20} />
                    <div className="btn-text">
                      Clarification
                      <span>Needs verification</span>
                    </div>
                  </button>

                  <button
                    className="btn-reject"
                    onClick={() => setDecision("REJECT")}
                    disabled={loading}
                  >
                    <XCircle size={20} />
                    <div className="btn-text">
                      Reject
                      <span>Provide reason</span>
                    </div>
                  </button>
                </div>

                {(decision === "REJECT" || decision === "CLARIFICATION") && (
                  <div className="reject-box animate-in">
                    <label>
                      {decision === "REJECT"
                        ? "Rejection Reason"
                        : "Clarification Message"}
                    </label>

                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter message..."
                    />

                    <div className="reject-actions">
                      <button
                        className="btn-cancel"
                        onClick={() => setDecision(null)}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn-confirm-reject"
                        onClick={
                          decision === "REJECT"
                            ? handleReject
                            : handleClarification
                        }
                        disabled={loading}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoanReview;

